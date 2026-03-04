---
name: content-author
description: Create and edit content collection entries for the real estate portfolio. Use when adding listings, updating bio, or creating WhyMe cards.
user-invocable: true
argument-hint: "[collection-type] [details]"
---

# Content Author

Create properly formatted content collection entries for this Astro site. All collections are defined in `src/content/config.ts` with Zod validation.

## When to Use

- Adding a new property listing
- Updating the About bio
- Adding or editing WhyMe feature cards
- Reviewing content for schema compliance

## Listing Template

File: `src/content/listings/<slug>.md`

```markdown
---
address: "123 Main Street, City, CA"
price: "$1,250,000"
beds: 3
baths: 2
sqft: 1800
status: "Active"
order: 1
photo: "/listings/123-main-st.svg"
description: "Brief description of the property"
url: "https://example.com/listing"
---

Optional markdown body content (not currently rendered by the Listings component).
```

**Required fields:** `status`, `order`
**Optional fields:** all others
**Status values:** `"Active"`, `"Under Contract"`, `"Sold"` (exact strings)
**Photo:** path relative to `public/`, add the image file to `public/listings/`
**URL:** must be a valid URL if provided

## WhyMe Template

File: `src/content/whyme/<slug>.md`

```markdown
---
icon: "🏠"
title: "Feature Title"
body: "Description of this value proposition for potential clients."
order: 1
---
```

**All fields required.** Order determines display sequence (lower numbers first).

## About Template

File: `src/content/about/bio.md` (single entry)

```markdown
---
heading: "About Heading Text"
stats:
  - number: "15+"
    label: "Years Experience"
  - number: "$200M+"
    label: "In Sales"
---

Markdown body content rendered as the bio text.
```

## Rules

- Use lowercase-kebab-case for filenames
- Order field determines display sequence (lower = first)
- Frontmatter is validated at build time — mismatches cause build errors
- Run `npm run build` after adding content to verify schema compliance
