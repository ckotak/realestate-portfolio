---
description: Rules for managing Astro content collections
globs: ["src/content/**/*"]
---

# Content Collections

Schemas are defined in `src/content/config.ts` using Zod.

## Collections

**listings** — Property listing cards
- Required fields: `status` (enum: `"Active"` | `"Under Contract"` | `"Sold"`), `order` (number)
- Optional fields: `address` (string), `price` (string), `beds` (number), `baths` (number), `sqft` (number), `photo` (string), `description` (string), `url` (string, must be valid URL)
- Photo paths are relative to `public/` (e.g., `"/listings/123-main.svg"`)
- New listings need: markdown file in `src/content/listings/` + optional image in `public/listings/`

**about** — Single entry (`bio.md`)
- Required fields: `heading` (string), `stats` (array of `{number: string, label: string}`)
- Body content is markdown rendered in the component

**whyme** — Feature/value proposition cards
- Required fields: `icon` (string, emoji), `title` (string), `body` (string), `order` (number)
- Displayed as a grid of feature cards

## Rules

- Status enum values must be exactly `"Active"`, `"Under Contract"`, or `"Sold"`
- Collections with `order` field must be sorted: `.sort((a, b) => a.data.order - b.data.order)`
- Use lowercase-kebab-case for markdown filenames (e.g., `123-main-st.md`)
- Frontmatter is validated by Zod at build time — type mismatches cause build errors
