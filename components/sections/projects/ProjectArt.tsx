import type { ReactNode } from "react";
import type { ProjectArt as ProjectArtKind } from "@/content/portfolio";

const ART: Record<ProjectArtKind, ReactNode> = {
  agents: (
    <>
      <circle cx="100" cy="30" r="12" />
      <circle cx="45" cy="80" r="10" />
      <circle cx="100" cy="85" r="10" />
      <circle cx="155" cy="80" r="10" />
      <path d="M92 40 52 72M100 42v33M108 40l40 32" strokeDasharray="3 4" />
    </>
  ),
  review: (
    <>
      <rect x="40" y="20" width="120" height="70" rx="8" />
      <path d="M40 36h120" />
      <path d="M58 52h50M58 64h70M58 76h36" />
      <path d="m138 62 6 6 12-14" strokeWidth="2" />
    </>
  ),
  pipeline: (
    <>
      <rect x="22" y="42" width="40" height="26" rx="6" />
      <rect x="80" y="42" width="40" height="26" rx="6" />
      <rect x="138" y="42" width="40" height="26" rx="6" />
      <path d="M62 55h18M120 55h18" />
      <path d="m75 51 5 4-5 4M133 51l5 4-5 4" />
      <path d="M100 42V22h58v20" strokeDasharray="3 4" />
    </>
  ),
};

/** Line-art illustration for a project card. */
export function ProjectArt({ kind }: { kind: ProjectArtKind }) {
  return (
    <svg viewBox="0 0 200 110" fill="none" aria-hidden="true" focusable="false">
      <g stroke="currentColor" strokeWidth="1.5" opacity=".9">
        {ART[kind]}
      </g>
    </svg>
  );
}
