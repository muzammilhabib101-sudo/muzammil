"use client";

import dynamic from "next/dynamic";
import { useCallback, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { assistantConfig } from "@/lib/assistant";
import styles from "./Chat.module.css";

const loadPanel = () => import("./ChatPanel").then((mod) => mod.ChatPanel);

// The AI SDK and chat UI only download once a visitor shows interest.
const ChatPanel = dynamic(loadPanel, { ssr: false });

const PANEL_ID = "chat-panel";

/** Floating launcher in the bottom-right corner that opens the AI assistant. */
export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const launcherRef = useRef<HTMLButtonElement>(null);

  const toggle = () => {
    setMounted(true);
    setOpen((prev) => !prev);
  };

  const close = useCallback(() => {
    setOpen(false);
    launcherRef.current?.focus();
  }, []);

  const preload = () => void loadPanel();

  return (
    <div className={styles.widget}>
      {mounted && <ChatPanel id={PANEL_ID} open={open} onClose={close} />}
      <button
        ref={launcherRef}
        type="button"
        className={styles.launcher}
        data-open={open || undefined}
        aria-expanded={open}
        aria-controls={mounted ? PANEL_ID : undefined}
        aria-label={open ? "Close chat" : `Chat with ${assistantConfig.name}`}
        onClick={toggle}
        onPointerEnter={preload}
        onFocus={preload}
      >
        <span className={styles.launcherIcon} data-icon="chat">
          <Icon name="chat" size={26} />
        </span>
        <span className={styles.launcherIcon} data-icon="close">
          <Icon name="close" size={24} />
        </span>
      </button>
    </div>
  );
}
