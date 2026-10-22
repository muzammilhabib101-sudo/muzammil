# muzammil-portfolio

Personal portfolio of **Muzammil Habib — Agentic AI Engineer**, built with Next.js (App Router), React and TypeScript, and shipped as a fully static site.

## Tech stack

- **Next.js 16** App Router with `output: "export"` (static HTML, no server needed)
- **React 19** Server Components by default; client components only where interaction is needed
- **TypeScript** in strict mode
- **CSS Modules** co-located with each component, plus design tokens in `app/globals.css`
- **next/font** for self-hosted Inter and JetBrains Mono (no layout shift, no third-party font requests)
- **ESLint** with `eslint-config-next` (Core Web Vitals and TypeScript rules)

## Getting started

```bash
npm install
cp .env.example .env.local   # optional: add your Formspree ID
npm run dev                  # http://localhost:3000
```

| Script              | What it does                                         |
| ------------------- | ---------------------------------------------------- |
| `npm run dev`       | Start the dev server                                 |
| `npm run build`     | Build the static site into `out/`                    |
| `npm run start`     | Serve the built `out/` folder locally                |
| `npm run lint`      | Lint with ESLint                                     |
| `npm run typecheck` | Generate route types and type-check with TypeScript  |
| `npm run check`     | Lint, type-check and build (what CI runs)            |

## Project structure

```
app/                    Routes, root layout, metadata, icons, robots/sitemap
  layout.tsx            Fonts, SEO metadata, navbar/footer shell
  page.tsx              Home page: composes the sections, JSON-LD profile
  globals.css           Design tokens, reset, shared utilities
components/
  layout/               Navbar, Footer, AmbientBackground
  sections/             Hero, Expertise, Stack, Projects, Contact
  ui/                   Button, Icon, SectionHeader, TagList, GlowCard, ScrollReveal
content/portfolio.ts    All page copy: expertise, stack, projects, terminal script
hooks/                  useActiveSection, useScrolled, usePrefersReducedMotion
lib/
  site.ts               Name, contact details, URLs, navigation
  contact.ts            Contact form validation and Formspree/mailto sending
  utils.ts              cn(), withBasePath()
```

**Editing content:** change text in `content/portfolio.ts` and contact details in `lib/site.ts`. You don't need to touch any components.

## Configuration

| Variable                   | Purpose                                                                       |
| -------------------------- | ----------------------------------------------------------------------------- |
| `NEXT_PUBLIC_FORMSPREE_ID` | Formspree form ID. If empty, the contact form opens the visitor's mail app instead. |
| `NEXT_PUBLIC_BASE_PATH`    | Sub-path the site is served from (e.g. `/muzammil` on GitHub Pages).          |

**Resume:** put your CV at `public/resume.pdf` and the "Download Resume" button will serve it.

## Deployment (GitHub Pages)

`.github/workflows/deploy.yml` lints, type-checks, builds and deploys on every push to `main`:

1. In the GitHub repo, go to **Settings → Pages** and set **Source** to **GitHub Actions**.
2. Optional: in **Settings → Secrets and variables → Actions → Variables**, add `FORMSPREE_ID`.
3. Push to `main`. The site is published at `https://<user>.github.io/<repo>/`.

The workflow sets `NEXT_PUBLIC_BASE_PATH` to `/<repo>` automatically. For a custom domain, remove that line from the workflow.

## Performance and accessibility notes

- Fully static and prerendered. Client JavaScript is limited to the navbar, terminal animation, contact form, card glow and a single shared scroll-reveal observer.
- `prefers-reduced-motion` is respected: animations are disabled and content shows immediately.
- Includes a skip link, landmark labels, `aria-current` on the active nav link, accessible form errors and a live status region.
- SEO: canonical URL, Open Graph and Twitter cards, a static OG image, `robots.txt`, `sitemap.xml` and schema.org `Person` data.
