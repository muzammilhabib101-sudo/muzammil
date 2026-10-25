import type { IconName } from "@/components/ui/Icon";

/* Page content lives here so copy changes never touch component code. */

export type Stat = { value: string; label: string };

export const heroContent = {
  eyebrow: "Available for AI engineering projects · Türkiye",
  headline: { lead: "Engineering Next-Gen", highlight: "Agentic AI Systems", trail: "& Intelligent Automations" },
  lead: "Specializing in custom AI agents, autonomous workflows, Claude Code integration, and robust Python-driven automation.",
  stats: [
    { value: "Multi-Agent", label: "Orchestration" },
    { value: "Claude Code", label: "Dev Automation" },
    { value: "Python", label: "Async Backends" },
    { value: "CI/CD", label: "GitHub Actions" },
  ] satisfies Stat[],
};

export type SectionIntro = { id: string; kicker: string; title: string; description: string };

export type Expertise = { icon: IconName; title: string; description: string; tags: string[] };

export const expertiseSection: SectionIntro = {
  id: "expertise",
  kicker: "01 — Core Expertise",
  title: "What I build",
  description: "End-to-end agentic systems — from the reasoning loop down to the API that ships it.",
};

export const expertise: Expertise[] = [
  {
    icon: "network",
    title: "Agentic AI Systems",
    description:
      "Multi-agent orchestration, autonomous decision-making loops, tool-calling agents, and custom LLM workflows.",
    tags: ["Orchestration", "Tool Calling", "Planning Loops"],
  },
  {
    icon: "branch",
    title: "Claude Code & GitHub Automation",
    description:
      "Hands-free developer workflows, auto-refactoring agents, CI/CD pipeline automation, and GitHub Actions integrations.",
    tags: ["Claude Code", "Actions", "Auto-Refactor"],
  },
  {
    icon: "code",
    title: "Enterprise Python Engineering",
    description: "Scalable backend APIs, custom LLM tool integrations, async pipelines, and data orchestration.",
    tags: ["FastAPI", "asyncio", "Pipelines"],
  },
  {
    icon: "bolt",
    title: "Automation & Tool Integration",
    description: "API integrations, web scraping, custom workflow triggers, and enterprise automation setups.",
    tags: ["REST", "Webhooks", "Scraping"],
  },
];

export type StackGroup = { index: string; title: string; items: string[] };

export const stackSection: SectionIntro = {
  id: "stack",
  kicker: "02 — Agentic Stack",
  title: "Technology & tools",
  description: "A production-tested toolkit for building, shipping, and automating intelligent systems.",
};

export const stack: StackGroup[] = [
  {
    index: "A",
    title: "Languages & Frameworks",
    items: ["Python", "LangChain", "LlamaIndex", "AutoGen", "CrewAI", "FastAPI"],
  },
  { index: "B", title: "AI Tools & Engines", items: ["Claude Code", "OpenAI API", "Anthropic API", "GitHub Copilot"] },
  { index: "C", title: "Automation & DevOps", items: ["GitHub Actions", "Git", "Docker", "Webhooks", "REST APIs"] },
];

export type ProjectArt = "agents" | "review" | "pipeline" | "quran";

export type Project = {
  art: ProjectArt;
  title: string;
  description: string;
  tags: string[];
  /** Screenshot in `public/`; replaces the line-art illustration and makes the card full-width. */
  image?: `/${string}`;
  /** Live deployment. */
  url?: string;
};

export const projectsSection: SectionIntro = {
  id: "projects",
  kicker: "03 — Featured Work",
  title: "Projects & case studies",
  description: "Selected builds showing how agents, automation, and solid engineering come together.",
};

export const projects: Project[] = [
  {
    art: "quran",
    title: "Quranic Arabic Language Course",
    description:
      "A bilingual (Urdu & English) learning platform that teaches the Arabic of the Quran word by word — roots, patterns and verb anatomy — with spaced-repetition practice, authentic recitation audio, a searchable dictionary and offline-friendly progress tracking.",
    tags: ["Next.js", "TypeScript", "Spaced Repetition", "i18n · RTL"],
    image: "/projects/quranic-arabic.png",
    url: "https://quranic-arabic-language.vercel.app",
  },
  {
    art: "agents",
    title: "Autonomous Multi-Agent Research Assistant",
    description:
      "A team of cooperating agents that plans research, calls search and retrieval tools, cross-checks sources and compiles structured reports — autonomously.",
    tags: ["Python", "Claude API", "Tool Calling"],
  },
  {
    art: "review",
    title: "Enterprise GitHub Action Code Reviewer",
    description:
      "An LLM-powered GitHub Action that reviews every pull request, flags bugs and security risks, and posts actionable inline comments before humans step in.",
    tags: ["GitHub Automation", "Python", "LLMs"],
  },
  {
    art: "pipeline",
    title: "Custom Workflow Automation Agent",
    description:
      "An event-driven agent that listens to webhooks, connects business tools over REST, and executes multi-step workflows with retries and audit logging.",
    tags: ["Python", "REST APIs", "Webhooks"],
  },
];

export const contactSection = {
  id: "contact",
  kicker: "04 — Contact",
  title: { lead: "Let’s Build", highlight: "Intelligent AI Solutions", trail: "Together" },
  description: "Have an agent, automation or AI integration in mind? Tell me about it — I usually reply within 24 hours.",
};

/** Syntax tone for each terminal token; maps to a CSS class. */
export type TerminalTone = "plain" | "keyword" | "func" | "string" | "comment" | "ok";
export type TerminalLine = Array<[TerminalTone, string]>;

export const terminalScript: TerminalLine[] = [
  [["comment", "# orchestrate a team of autonomous agents"]],
  [["keyword", "from"], ["plain", " agents "], ["keyword", "import"], ["plain", " Planner, Researcher, Reviewer"]],
  [],
  [["plain", "crew = "], ["func", "Orchestrator"], ["plain", "("]],
  [["plain", "    agents=[Planner(), Researcher(), Reviewer()],"]],
  [["plain", "    model="], ["string", '"claude"'], ["plain", ", tools=[search, code_exec],"]],
  [["plain", ")"]],
  [
    ["plain", "result = "],
    ["keyword", "await"],
    ["plain", " crew."],
    ["func", "run"],
    ["plain", "("],
    ["string", '"Audit repo & open PR"'],
    ["plain", ")"],
  ],
  [],
  [["comment", "› planner   "], ["plain", " decomposed task into 4 steps"]],
  [["comment", "› researcher"], ["plain", " 6 tool calls · context ready"]],
  [["comment", "› reviewer  "], ["plain", " tests passed"]],
  [["ok", "✓ PR #128 opened — fully autonomous"]],
];
