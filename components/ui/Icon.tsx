import type { ReactNode, SVGProps } from "react";

type IconDef = { body: ReactNode; filled?: boolean; strokeWidth?: number };

const ICONS = {
  arrowRight: { body: <path d="M5 12h14M13 5l7 7-7 7" /> },
  download: { body: <path d="M12 3v12M7 10l5 5 5-5M5 21h14" /> },
  send: { body: <path d="M22 2 11 13M22 2l-7 20-4-9-9-4z" /> },
  mail: {
    body: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),
  },
  phone: {
    body: (
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />
    ),
  },
  whatsapp: {
    body: (
      <>
        <path d="M3 21l1.7-5A8.5 8.5 0 1 1 8 19.3z" />
        <path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 1c-1-.5-1.5-1-2-2l1-1-1-2z" />
      </>
    ),
  },
  linkedin: {
    filled: true,
    body: (
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
    ),
  },
  network: {
    strokeWidth: 1.8,
    body: (
      <>
        <circle cx="12" cy="5" r="2.5" />
        <circle cx="5" cy="18" r="2.5" />
        <circle cx="19" cy="18" r="2.5" />
        <path d="M12 7.5v4M12 11.5 6.5 16M12 11.5l5.5 4.5" />
      </>
    ),
  },
  branch: {
    strokeWidth: 1.8,
    body: (
      <>
        <circle cx="6" cy="6" r="2.5" />
        <circle cx="6" cy="18" r="2.5" />
        <circle cx="18" cy="9" r="2.5" />
        <path d="M6 8.5v7M18 11.5c0 3-3 4-9.5 5.5" />
      </>
    ),
  },
  code: { strokeWidth: 1.8, body: <path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" /> },
  bolt: { strokeWidth: 1.8, body: <path d="M13 2 4 14h7l-1 8 9-12h-7z" /> },
  chat: {
    strokeWidth: 1.8,
    body: (
      <>
        <path d="M21 12a8.5 8.5 0 0 1-12.4 7.6L3 21l1.4-5.1A8.5 8.5 0 1 1 21 12z" />
        <path d="M8.5 12h.01M12 12h.01M15.5 12h.01" strokeWidth={2.6} />
      </>
    ),
  },
  sparkle: {
    strokeWidth: 1.8,
    body: <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z" />,
  },
  close: { body: <path d="M18 6 6 18M6 6l12 12" /> },
  calendar: {
    strokeWidth: 1.8,
    body: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2.5" />
        <path d="M3 10h18M8 3v4M16 3v4M8 14h.01M12 14h.01M16 14h.01M8 17.5h.01M12 17.5h.01" />
      </>
    ),
  },
  check: { body: <path d="M20 6 9 17l-5-5" /> },
  refresh: { body: <path d="M3 12a9 9 0 0 1 15.5-6.2L21 8M21 3v5h-5M21 12a9 9 0 0 1-15.5 6.2L3 16M3 21v-5h5" /> },
  stop: { filled: true, body: <rect x="6" y="6" width="12" height="12" rx="2.5" /> },
} satisfies Record<string, IconDef>;

export type IconName = keyof typeof ICONS;

type IconProps = Omit<SVGProps<SVGSVGElement>, "name"> & { name: IconName; size?: number };

/** Inline, decorative SVG icon set (24×24 grid, inherits `currentColor`). */
export function Icon({ name, size = 18, ...props }: IconProps) {
  const { body, filled, strokeWidth = 2 }: IconDef = ICONS[name];
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      {...(filled
        ? { fill: "currentColor" }
        : { fill: "none", stroke: "currentColor", strokeWidth, strokeLinecap: "round", strokeLinejoin: "round" })}
      {...props}
    >
      {body}
    </svg>
  );
}
