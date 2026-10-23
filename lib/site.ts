/**
 * Canonical site URL (no trailing slash). Set NEXT_PUBLIC_SITE_URL for a custom
 * domain; on Vercel it falls back to the project's production domain.
 */
function siteUrl(): string {
  const url =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000");
  return url.replace(/\/+$/, "");
}

/** Single source of truth for identity, contact details and navigation. */
export const siteConfig = {
  name: "Muzammil Habib",
  initials: "MH",
  role: "Agentic AI Engineer",
  tagline: "Agentic AI Specialist",
  location: "Türkiye",
  url: siteUrl(),
  title: "Muzammil Habib — Agentic AI Engineer",
  description:
    "Muzammil Habib — Agentic AI Engineer based in Türkiye. Custom AI agents, autonomous workflows, Claude Code integration and Python-driven automation.",
  ogDescription: "Engineering next-gen agentic AI systems & intelligent automations.",
  keywords: [
    "Agentic AI",
    "AI Engineer",
    "AI Agents",
    "Multi-Agent Systems",
    "Claude Code",
    "LLM",
    "Python",
    "Automation",
    "Türkiye",
  ],
  contact: {
    email: "muzammilhabib101@gmail.com",
    phoneDisplay: "+90 501 151 0786",
    phoneHref: "tel:+905011510786",
    whatsapp: "https://wa.me/905011510786",
    linkedin: "https://www.linkedin.com/in/muzammil-habib-535874a1/",
    linkedinHandle: "in/muzammil-habib",
  },
  resumePath: "/resume.pdf",
  themeColor: "#0B0F19",
} as const;

export type NavItem = { label: string; href: `#${string}` };

export const navItems: readonly NavItem[] = [
  { label: "About", href: "#about" },
  { label: "Expertise", href: "#expertise" },
  { label: "Agentic Stack", href: "#stack" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];
