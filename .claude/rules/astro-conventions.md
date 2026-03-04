---
description: Rules for working with Astro components and pages
globs: ["src/**/*.astro", "src/pages/**/*"]
---

# Astro Conventions

- All components use `.astro` single-file format with frontmatter (`---`) blocks for TypeScript logic
- Data fetching uses Astro content collection APIs: `getCollection()`, `getEntry()`
- TypeScript `Props` interfaces are defined in frontmatter
- Components are section-based: each represents a full-width page section
- Client-side interactivity uses inline `<script>` tags — no framework hydration needed
- Use `import.meta.env.BASE_URL.replace(/\/$/, '')` for all asset paths (site deploys under `/realestate-portfolio`)
- Static output only — never use server-side features, API routes, or `Astro.response`
- Layouts use `<slot />` for content projection
- Section pattern: `<section id="section-name">` with `py-24 px-6` padding and `max-w-6xl mx-auto` container
- Scroll-reveal: add `class="reveal"` plus `style="transition-delay: ${i * 100}ms"` for staggered entrance
