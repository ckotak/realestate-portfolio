# CLAUDE.md

## Project Overview

- **Project:** realestate-portfolio — single-page real estate portfolio for Chetan Kotak
- **Author:** Chetan Kotak
- **Live site:** https://chetankotak.github.io/realestate-portfolio

## Tech Stack

- Astro 5.2 (static output)
- Tailwind CSS v4 via `@tailwindcss/vite` plugin (CSS-first config with `@theme`)
- TypeScript strict mode (extends `astro/tsconfigs/strict`)
- Inter (body font, `@fontsource/inter`) + Bebas Neue (display font, Google Fonts)
- GitHub Pages deployment via GitHub Actions (`withastro/action@v5`)

## Commands

- `npm run dev` — start dev server (port 4321)
- `npm run build` — production build to `dist/`
- `npm run preview` — preview production build locally

## Architecture

- Single-page site with section-based navigation
- `src/pages/index.astro` — sole page, composes section components
- `src/layouts/BaseLayout.astro` — HTML shell with SEO, Open Graph, JSON-LD structured data, CSP headers
- `src/components/` — section components: Nav, Hero, About, WhyMe, Listings, Contact
- `src/content/` — Astro content collections (listings, about, whyme) defined in `config.ts`
- `src/styles/global.css` — Tailwind v4 `@theme` with brand tokens and scroll animation
- `public/` — static assets (SVG listing photos, favicon, og-image, robots.txt, llms.txt, sitemap.xml)

## Design System

- **Colors:** charcoal `#0f0f0f`, gold `#C9A84C`, offwhite `#f9f9f7`, lightgray `#f2f2f0`
- **Fonts:** Bebas Neue for headings (`--font-display`), Inter for body (`--font-body`)
- **Theme:** dark background with gold accent
- **Animation:** scroll-reveal via IntersectionObserver (`.reveal`/`.visible` classes), `fade-up` keyframes
- **Responsive:** mobile-first with sm/md/lg breakpoints, `clamp()` fluid typography

## Content Collections

Schemas defined in `src/content/config.ts`:

- **listings:** address, price, beds, baths, sqft, status (`Active`|`Under Contract`|`Sold`), order, photo, description, url — only status and order are required
- **about:** single entry (`bio.md`) with heading string, stats array `[{number, label}]`, and markdown body
- **whyme:** icon, title, body, order — displayed as feature cards

## Coding Conventions

- Astro components use frontmatter (`---`) for data fetching and TypeScript logic
- Tailwind utility classes directly in markup (no CSS modules, no `@apply` in components)
- Client-side JS is minimal and inlined via `<script>` tags
- Content managed through markdown files with Zod-validated frontmatter
- Static output only — no SSR, no API routes
- BASE_URL-aware paths: `import.meta.env.BASE_URL.replace(/\/$/, '') + path`
- Collections with `order` field sorted by: `.sort((a, b) => a.data.order - b.data.order)`

## Deployment

- GitHub Actions: `.github/workflows/deploy.yml`
- Triggers on push to `main` or manual `workflow_dispatch`
- Base path: `/realestate-portfolio`

## Known TODOs

`BaseLayout.astro` and `Contact.astro` contain placeholder contact info (phone, email, social links, DRE license number) marked with `// TODO` comments. Replace before going live.
