---
description: Tailwind CSS v4 usage rules for this project
globs: ["src/**/*.astro", "src/styles/**/*.css"]
---

# Tailwind CSS v4

- Using Tailwind v4 with **CSS-first configuration** (no `tailwind.config.ts`)
- Theme defined in `src/styles/global.css` via `@theme` block
- Integrated via `@tailwindcss/vite` plugin in `astro.config.mjs`

## Brand Tokens

- `--color-charcoal: #0f0f0f` / `--color-charcoal-90: #1a1a1a`
- `--color-gold: #C9A84C` / `--color-gold-hover: #dbb96a`
- `--color-offwhite: #f9f9f7` / `--color-lightgray: #f2f2f0`
- `--font-display: 'Bebas Neue'` (headings)
- `--font-body: 'Inter'` (body text)
- `--animate-fade-up` (scroll entrance animation)

## Rules

- Use existing brand color utilities: `bg-charcoal`, `text-gold`, `bg-offwhite`, etc.
- Headings use `clamp()` for fluid sizing: `text-[clamp(3rem,6vw,5rem)]`
- All styling via Tailwind utility classes in markup — no CSS modules, no `@apply` in components
- Custom properties reference: `var(--color-gold)` when needed in inline styles
- When adding new theme tokens, add them to the `@theme` block in `global.css`
