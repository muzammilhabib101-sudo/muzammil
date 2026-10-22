"use client";

import { Fragment, type ReactNode, useEffect, useState } from "react";
import { terminalScript, type TerminalLine, type TerminalTone } from "@/content/portfolio";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";
import styles from "./Terminal.module.css";

const TONE_CLASS: Record<TerminalTone, string | undefined> = {
  plain: undefined,
  keyword: styles.keyword,
  func: styles.func,
  string: styles.string,
  comment: styles.comment,
  ok: styles.ok,
};

const START_DELAY_MS = 600;
const NEWLINE_DELAY_MS = 140;
const RESTART_DELAY_MS = 4500;

/** Every visible character in order; "\n" separates lines. */
const SCRIPT_TEXT = terminalScript.map((line) => line.map(([, text]) => text).join("")).join("\n");

/** Renders the script truncated to its first `count` characters, keeping syntax colors. */
function renderScript(script: TerminalLine[], count: number): ReactNode[] {
  let budget = count;
  const output: ReactNode[] = [];

  script.forEach((line, lineIndex) => {
    if (budget <= 0) return;
    if (lineIndex > 0) {
      output.push("\n");
      budget -= 1;
    }
    line.forEach(([tone, text], segmentIndex) => {
      if (budget <= 0) return;
      const visible = text.slice(0, budget);
      budget -= visible.length;
      output.push(
        <span key={`${lineIndex}-${segmentIndex}`} className={TONE_CLASS[tone]}>
          {visible}
        </span>,
      );
    });
  });

  return output.map((node, i) => <Fragment key={i}>{node}</Fragment>);
}

function useTypewriter(length: number, enabled: boolean): number {
  const [typed, setTyped] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    let index = 0;
    let timer: ReturnType<typeof setTimeout>;

    const step = () => {
      if (index >= length) {
        timer = setTimeout(() => {
          index = 0;
          setTyped(0);
          step();
        }, RESTART_DELAY_MS);
        return;
      }
      index += 1;
      setTyped(index);
      const delay = SCRIPT_TEXT[index - 1] === "\n" ? NEWLINE_DELAY_MS : 18 + Math.random() * 22;
      timer = setTimeout(step, delay);
    };

    timer = setTimeout(step, START_DELAY_MS);
    return () => clearTimeout(timer);
  }, [length, enabled]);

  return enabled ? typed : length;
}

/** Decorative code window that "types" an agent-orchestration script on a loop. */
export function Terminal() {
  const reduceMotion = usePrefersReducedMotion();
  const typed = useTypewriter(SCRIPT_TEXT.length, !reduceMotion);

  return (
    <div className={cn("glass", styles.terminal)}>
      <div className={styles.bar}>
        <span className={cn(styles.dot, styles.red)} />
        <span className={cn(styles.dot, styles.yellow)} />
        <span className={cn(styles.dot, styles.green)} />
        <span className={styles.title}>agent_orchestrator.py</span>
      </div>
      <pre className={styles.body}>
        <code>{renderScript(terminalScript, typed)}</code>
        <span className={styles.caret} />
      </pre>
    </div>
  );
}
