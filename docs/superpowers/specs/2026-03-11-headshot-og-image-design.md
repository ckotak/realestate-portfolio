# SCRUM-5: Professional Headshot & OG Image Fix

**Date:** 2026-03-11
**Ticket:** [SCRUM-5](https://ckk22.atlassian.net/browse/SCRUM-5)
**Status:** Approved

## Summary

Two related changes:
1. Replace the "CK" initials placeholder in the About section with a real headshot using Astro's `<Picture />` component.
2. Fix iMessage/social sharing by adding the missing `og:image:type` meta tag to `BaseLayout.astro`.

## Files Changed

- `src/assets/` — new directory (create before adding the image)
- `src/assets/headshot.png` — new placeholder image (to be replaced with real photo)
- `src/components/About.astro` — swap placeholder div for `<Picture />` component
- `src/layouts/BaseLayout.astro` — add `og:image:type` meta tag

---

## 1. Placeholder Image — `src/assets/headshot.png`

Create a 600×800px PNG (3:4 aspect ratio matching the existing `aspect-[3/4]` container).

**Dimensions:** 900×1200px (3:4 portrait). Using 900px width (not 600px) ensures Astro can generate all three output variants (400px, 600px, 800px) without upscaling.

**Style:** Dark gradient background (#1a1a1a → #0f0f0f) with "CK" initials centered in gold (`#C9A84C`), matching the current placeholder div appearance. This ensures the image looks intentional during development.

**Replacement workflow:** When a real headshot is available, replace `src/assets/headshot.png` (or `.jpg`/`.webp`) and update the import path in `About.astro`. Astro regenerates all optimized formats at build time.

---

## 2. About.astro — `<Picture />` Component

Replace the inner gradient div in the photo column with Astro's `<Picture />` component.

**Import:**
```astro
import { Picture } from 'astro:assets';
import headshot from '../assets/headshot.png';
```

**Markup replacement** (inside the existing `aspect-[3/4]` container):
```astro
<Picture
  src={headshot}
  formats={['webp', 'jpeg']}
  widths={[400, 600, 800]}
  sizes="(max-width: 768px) 100vw, min(576px, 50vw)"
  alt="Chetan Kotak, Real Estate Agent"
  class="w-full h-full object-cover"
  loading="eager"
/>
```

Note on `loading="eager"`: the About section is immediately below the Hero and is typically visible on first paint or one short scroll. Lazy loading would delay the request and cause a layout shift. `eager` ensures the image is fetched as a priority resource.

**What stays unchanged:**
- The outer `aspect-[3/4] bg-lightgray relative overflow-hidden` container
- The gold offset border decoration `div` (`absolute inset-0 border-4 border-gold translate-x-4 translate-y-4 -z-10`)
- The `reveal` scroll animation class on the parent div

**Output:** Astro generates WebP and JPEG variants at 400px, 600px, and 800px widths. The browser picks the best format and resolution automatically. No JavaScript fallback needed — Astro validates the image at build time.

---

## 3. BaseLayout.astro — `og:image:type` Meta Tag

Add one line after the existing `og:image:height` tag:

```html
<meta property="og:image:type" content="image/png" />
```

**Why this fixes iMessage:** Apple's scraper requires explicit MIME type declaration to reliably render link previews. Without it, the scraper may skip the image even when the file is accessible.

**Existing OG setup (already correct):**
- `og:image` → `https://chetankotak.github.io/realestate-portfolio/og-image.png` ✓
- `og:image:width` → `1200` ✓
- `og:image:height` → `630` ✓
- `og:image:alt` → set ✓
- `og:image:type` → **missing — this is the fix**

---

## Acceptance Criteria

- [ ] `src/assets/` directory created
- [ ] `src/assets/headshot.png` exists and is a valid 900×1200px PNG
- [ ] About section renders the image (not the gradient div) at both mobile and desktop sizes
- [ ] Image has `alt="Chetan Kotak, Real Estate Agent"`
- [ ] Image `loading` attribute is `eager` — not `lazy`
- [ ] Gold offset border decoration remains visible
- [ ] `og:image:type` meta tag present in page `<head>`
- [ ] Production build succeeds (`npm run build`)
- [ ] Replacing `src/assets/headshot.png` with a real photo and rebuilding produces correct output

## Out of Scope

- Replacing the placeholder with a real headshot (blocked on photo availability)
- Adding `srcset` to the OG image itself
