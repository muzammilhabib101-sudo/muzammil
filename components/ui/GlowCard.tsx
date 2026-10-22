"use client";

import type { HTMLAttributes, PointerEvent } from "react";

/** An `<article>` that exposes the pointer position as `--mx` / `--my` for a cursor-follow glow. */
export function GlowCard({ onPointerMove, ...props }: HTMLAttributes<HTMLElement>) {
  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    card.style.setProperty("--my", `${event.clientY - rect.top}px`);
    onPointerMove?.(event);
  };

  return <article onPointerMove={handlePointerMove} {...props} />;
}
