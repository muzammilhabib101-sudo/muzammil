"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { type FormEvent, type KeyboardEvent, useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { assistantConfig } from "@/lib/assistant";
import { siteConfig } from "@/lib/site";
import { cn, withBasePath } from "@/lib/utils";
import styles from "./Chat.module.css";
import { ChatMarkdown } from "./ChatMarkdown";

const transport = new DefaultChatTransport({ api: withBasePath("/api/chat/") });

type ChatPanelProps = { id: string; open: boolean; onClose: () => void };

function messageText(message: UIMessage): string {
  return message.parts.map((part) => (part.type === "text" ? part.text : "")).join("");
}

/** Surfaces the `{ error }` message our route returns; anything else gets a generic apology. */
function errorText(error: Error): string {
  try {
    const { error: message } = JSON.parse(error.message) as { error?: unknown };
    if (typeof message === "string" && message) return message;
  } catch {}
  return "Sorry, I couldn’t reply just now.";
}

export function ChatPanel({ id, open, onClose }: ChatPanelProps) {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, stop, error, regenerate, setMessages } = useChat({ transport });
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const stickToBottom = useRef(true);

  const busy = status === "submitted" || status === "streaming";
  const last = messages.at(-1);
  const thinking = busy && (last?.role !== "assistant" || !messageText(last));

  useEffect(() => {
    if (open) inputRef.current?.focus({ preventScroll: true });
  }, [open]);

  // Follow the conversation as it streams, unless the visitor scrolled up to read.
  useEffect(() => {
    const log = logRef.current;
    if (log && stickToBottom.current) log.scrollTop = log.scrollHeight;
  }, [messages, thinking, error]);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    stickToBottom.current = true;
    void sendMessage({ text: trimmed.slice(0, assistantConfig.maxMessageChars) });
    setInput("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    send(input);
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      send(input);
    }
  };

  const resetChat = () => {
    void stop();
    setMessages([]);
    setInput("");
    inputRef.current?.focus();
  };

  return (
    <section
      id={id}
      className={styles.panel}
      data-open={open || undefined}
      inert={!open}
      aria-label={assistantConfig.name}
      onKeyDown={(event) => event.key === "Escape" && onClose()}
    >
      <header className={styles.header}>
        <span className={styles.avatar} aria-hidden="true">
          {siteConfig.initials}
        </span>
        <div className={styles.heading}>
          <h2>{assistantConfig.name}</h2>
          <p>
            <span className="pulse-dot" aria-hidden="true" />
            Online · Powered by Gemini
          </p>
        </div>
        <button
          type="button"
          className={styles.iconButton}
          onClick={resetChat}
          disabled={messages.length === 0}
          aria-label="Start a new chat"
          title="New chat"
        >
          <Icon name="refresh" size={17} />
        </button>
        <button type="button" className={styles.iconButton} onClick={onClose} aria-label="Close chat" title="Close">
          <Icon name="close" size={18} />
        </button>
      </header>

      <div
        ref={logRef}
        className={styles.log}
        role="log"
        aria-live="polite"
        aria-busy={busy}
        onScroll={(event) => {
          const el = event.currentTarget;
          stickToBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 48;
        }}
      >
        <div className={cn(styles.message, styles.assistant)}>
          <p>{assistantConfig.greeting}</p>
        </div>

        {messages.length === 0 && (
          <div className={styles.suggestions}>
            {assistantConfig.suggestions.map((suggestion) => (
              <button key={suggestion} type="button" className={styles.chip} onClick={() => send(suggestion)}>
                <Icon name="sparkle" size={14} />
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {messages.map((message) => {
          const text = messageText(message);
          if (!text) return null;
          return message.role === "user" ? (
            <div key={message.id} className={cn(styles.message, styles.user)}>
              <span className="visually-hidden">You: </span>
              {text}
            </div>
          ) : (
            <div key={message.id} className={cn(styles.message, styles.assistant)}>
              <ChatMarkdown text={text} />
            </div>
          );
        })}

        {thinking && (
          <div className={cn(styles.message, styles.assistant, styles.typing)} aria-label="Assistant is typing">
            <span />
            <span />
            <span />
          </div>
        )}

        {error && !busy && (
          <div className={styles.error} role="alert">
            <p>{errorText(error)}</p>
            <button type="button" className={styles.chip} onClick={() => void regenerate()}>
              <Icon name="refresh" size={14} />
              Try again
            </button>
          </div>
        )}
      </div>

      <form className={styles.composer} onSubmit={handleSubmit}>
        <label htmlFor={`${id}-input`} className="visually-hidden">
          Message
        </label>
        <textarea
          id={`${id}-input`}
          ref={inputRef}
          rows={1}
          value={input}
          maxLength={assistantConfig.maxMessageChars}
          placeholder="Ask about skills, projects, availability…"
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleInputKeyDown}
        />
        {busy ? (
          <button type="button" className={styles.sendButton} onClick={() => void stop()} aria-label="Stop responding">
            <Icon name="stop" size={16} />
          </button>
        ) : (
          <button type="submit" className={styles.sendButton} disabled={!input.trim()} aria-label="Send message">
            <Icon name="send" size={17} />
          </button>
        )}
      </form>
    </section>
  );
}
