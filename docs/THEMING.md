# Theming & White-Label Guide

## Overview

The brand configuration system in `src/config/brand.ts` controls:

- **Agent identity** -- name, professional title, license number
- **Contact info** -- phone, email
- **Social links** -- Twitter, LinkedIn
- **Location / service area** -- city, region, country
- **Site metadata** -- site name, canonical URL, Open Graph image
- **Visual theme** -- colors (6 tokens) and fonts (display + body)

Taglines, marketing copy, and section content are **not** part of the brand config. Those live in their respective components and content collections.

## Quick Start

```bash
# 1. Copy the starter template
cp src/config/brand.example.ts src/config/brand.ts

# 2. Edit all values in the brand object
#    (agent, contact, social, location, site, theme)

# 3. Regenerate CSS tokens from your theme colors/fonts
npm run theme

# 4. Build and verify
npm run build
npm run preview

# 5. Push to main to deploy (GitHub Actions handles the rest)
git add -A && git commit -m "rebrand" && git push
```

## Regenerating CSS Tokens

When you change `theme.colors` or `theme.fonts` in `brand.ts`, run:

```bash
npm run theme
```

This regenerates `src/styles/theme-tokens.css` with updated Tailwind v4 `@theme` values.

You do **not** need to run this after changing identity, contact, social, location, or site fields -- those are read directly from `brand.ts` at build time.

## Customizing Fonts

The site uses two fonts: a **display** font for headings (default: Bebas Neue via Google Fonts) and a **body** font for text (default: Inter via `@fontsource`).

### 1. Update the font-family in `brand.ts`

Set `theme.fonts.display` and/or `theme.fonts.body` to a full CSS `font-family` string including fallbacks:

```ts
fonts: {
  display: "'Playfair Display', Georgia, serif",
  body: "'Lato', ui-sans-serif, system-ui, sans-serif",
},
```

### 2. Load the font files

You need to load the actual font files for the browser. The site uses two methods:

**Display font (Google Fonts)** -- Update the `<link>` tag in `src/layouts/BaseLayout.astro`:
```html
<link
  href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap"
  rel="stylesheet"
/>
```

**Body font (@fontsource)** -- Install the new package and remove the old one:
```bash
npm install @fontsource/lato
npm uninstall @fontsource/inter
```

### 3. Update font weight imports in `BaseLayout.astro`

The body font is imported by weight in `src/layouts/BaseLayout.astro` frontmatter. You must update these imports to match the weights your new font needs. The site uses **regular (400)** and **semibold (600)**:

```ts
// Replace these lines in BaseLayout.astro frontmatter:
import '@fontsource/inter/400.css';  // remove
import '@fontsource/inter/600.css';  // remove

// With your new font's weights:
import '@fontsource/lato/400.css';
import '@fontsource/lato/700.css';   // use whatever weight the font offers for bold
```

Not all fonts offer the same weights. Check your font's `@fontsource` package or Google Fonts page to see which weights are available. At minimum you need a regular weight (400) and a bold/semibold weight.

For Google Fonts, specify the weights you need in the URL's `wght@` parameter instead (e.g., `wght@400;700`).

### 4. Regenerate CSS tokens

```bash
npm run theme
```

## Build and Deploy

```bash
npm run build      # Production build to dist/
```

Push to `main` and GitHub Actions deploys automatically.

The generated `theme-tokens.css` is committed to git so CI builds work without running the generator.

## File Reference

| File | Purpose |
|------|---------|
| `src/config/brand.ts` | Live brand configuration (edit this) |
| `src/config/brand.example.ts` | Starter template -- copy to `brand.ts` |
| `scripts/generate-theme.ts` | CSS token generator script |
| `src/styles/theme-tokens.css` | Generated Tailwind v4 `@theme` tokens |
| `src/styles/global.css` | Imports theme tokens + base styles |
