"use client";

import { useEffect } from "react";

/**
 * Reveals every `[data-reveal]` element as it scrolls into view.
 *
 * One shared observer keeps the revealed sections as Server Components (no
 * per-element client wrapper). It renders nothing; styles live in globals.css.
 */
export function ScrollReveal() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const reveal = (el: Element) => el.setAttribute("data-visible", "");

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      elements.forEach(reveal);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          reveal(entry.target);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.12 },
    );

    elements.forEach((el, i) => {
      el.style.setProperty("--reveal-delay", `${(i % 4) * 70}ms`);
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
