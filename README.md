# muzammil-portfolio

Personal portfolio of **Muzammil Habib — Agentic AI Engineer**, built with Next.js (App Router), React and TypeScript, hosted on Vercel, with a Gemini-powered AI assistant.

## Tech stack

- **Next.js 16** App Router: every page is prerendered; only `/api/chat` runs on the server
- **React 19** Server Components by default; client components only where interaction is needed
- **AI SDK** (`ai`, `@ai-sdk/react`, `@ai-sdk/google`) streaming replies from **Google Gemini**
- **TypeScript** in strict mode
- **CSS Modules** co-located with each component, plus design tokens in `app/globals.css`
- **next/font** for self-hosted Inter and JetBrains Mono (no layout shift, no third-party font requests)
- **ESLint** with `eslint-config-next` (Core Web Vitals and TypeScript rules)

## Getting started

```bash
npm install
cp .env.example .env.local   # add GOOGLE_GENERATIVE_AI_API_KEY and SMTP_* values
npm run dev                  # http://localhost:3000
```

| Script              | What it does                                         |
| ------------------- | ---------------------------------------------------- |
| `npm run dev`       | Start the dev server                                 |
| `npm run build`     | Build the production site                            |
| `npm run start`     | Serve the production build locally                   |
| `npm run lint`      | Lint with ESLint                                     |
| `npm run typecheck` | Generate route types and type-check with TypeScript  |
| `npm run check`     | Lint, type-check and build (what CI runs)            |

## Project structure

```
app/                    Routes, root layout, metadata, icons, robots/sitemap
  layout.tsx            Fonts, SEO metadata, navbar/footer shell, chat widget
  page.tsx              Home page: composes the sections, JSON-LD profile
  api/chat/route.ts     Streams Gemini replies for the AI assistant
  api/contact/route.ts  Sends contact form emails over SMTP
  globals.css           Design tokens, reset, shared utilities
components/
  chat/                 ChatWidget (launcher), ChatPanel (conversation UI), ChatMarkdown
  layout/               Navbar, Footer, AmbientBackground
  sections/             Hero, Expertise, Stack, Projects, Contact
  ui/                   Button, Icon, SectionHeader, TagList, GlowCard, ScrollReveal
content/portfolio.ts    All page copy: expertise, stack, projects, terminal script
hooks/                  useActiveSection, useScrolled, usePrefersReducedMotion
lib/
  assistant.ts          Assistant name, greeting, suggestions and system instructions
  site.ts               Name, contact details, URLs, navigation
  contact.ts            Contact form validation and client-side sending
  mailer.ts             Nodemailer SMTP transport (server-only)
  email-templates.ts    HTML/text emails for the owner and the visitor
  utils.ts              cn(), withBasePath()
```

**Editing content:** change text in `content/portfolio.ts` and contact details in `lib/site.ts`. You don't need to touch any components. The AI assistant builds its knowledge from the same files, so it stays in sync automatically.

## AI assistant

A chat button sits in the bottom-right corner of every page. Clicking it opens a chat panel that streams answers from Gemini about your skills, projects and availability.

- The Gemini API key stays on the server (`app/api/chat/route.ts`); the browser never sees it.
- The chat code is lazy-loaded the first time a visitor hovers over or clicks the button, so it adds nothing to the initial page load.
- Requests are capped (message length, history length, output tokens) to keep costs predictable.
- Change the greeting, suggested questions or the assistant's behaviour in `lib/assistant.ts`.

## Contact form

Submissions go to `app/api/contact/route.ts`, which sends two emails with Nodemailer over SMTP:

1. **To you:** the visitor's name, email and message. Reply-To is set to the visitor, so you can just hit reply.
2. **To the visitor:** a branded thank-you confirming you received their message. It doesn't repeat their message, so the form can't be used to send arbitrary text to other people.

Fields are validated in the browser and again on the server (`lib/contact.ts`). The route also checks a honeypot field, strips header-breaking characters, and limits each IP to 5 messages per 10 minutes. Templates live in `lib/email-templates.ts`.

## Configuration

| Variable                       | Purpose                                                                       |
| ------------------------------ | ----------------------------------------------------------------------------- |
| `GOOGLE_GENERATIVE_AI_API_KEY` | **Required for chat.** Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey). Server-only. |
| `GEMINI_MODEL`                 | Optional Gemini model ID. Defaults to `gemini-3.8-flash`.                     |
| `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` | **Required for the contact form.** SMTP server and login. Server-only. |
| `SMTP_PORT`, `SMTP_SECURE`     | Optional. Port 465 uses TLS, 587 (default) uses STARTTLS.                     |
| `CONTACT_FROM_EMAIL`           | Optional sender address. Defaults to `SMTP_USER`.                             |
| `CONTACT_TO_EMAIL`             | Optional inbox for new messages. Defaults to the email in `lib/site.ts`.      |
| `NEXT_PUBLIC_SITE_URL`         | Canonical URL (e.g. a custom domain). On Vercel it defaults to the production domain. |
| `NEXT_PUBLIC_BASE_PATH`        | Sub-path the site is served from. Leave empty on Vercel.                      |

**Resume:** put your CV at `public/resume.pdf` and the "Download Resume" button will serve it.

## Deployment (Vercel)

1. Import the GitHub repo at [vercel.com/new](https://vercel.com/new). The Next.js framework is detected automatically.
2. In **Project → Settings → Environment Variables**, add `GOOGLE_GENERATIVE_AI_API_KEY` and the `SMTP_*` variables.
3. Push to `main` to deploy to production. Every pull request gets its own preview URL.

`.github/workflows/ci.yml` lints, type-checks and builds every push and pull request.

## Performance and accessibility notes

- All pages are prerendered. Client JavaScript is limited to the navbar, terminal animation, contact form, card glow, a single shared scroll-reveal observer and the chat launcher (the chat panel loads on demand).
- `prefers-reduced-motion` is respected: animations are disabled and content shows immediately.
- Includes a skip link, landmark labels, `aria-current` on the active nav link, accessible form errors and live status regions. The chat panel supports the keyboard: Enter sends, Shift+Enter adds a new line, Esc closes, and focus returns to the launcher.
- SEO: canonical URL, Open Graph and Twitter cards, a static OG image, `robots.txt`, `sitemap.xml` and schema.org `Person` data.
