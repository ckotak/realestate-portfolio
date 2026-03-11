# View Transitions API — Design Spec

**Jira:** SCRUM-7
**Date:** 2026-03-10
**Status:** Approved

---

## Overview

Add Astro's View Transitions API to the realestate-portfolio site to enable smooth, shared-element morph transitions when navigating from a listing card to its detail page. This also lays the foundation for multi-page expansion (individual listing detail pages coming next).

---

## Scope

- Enable `<ViewTransitions />` in `BaseLayout.astro`
- Wire `transition:name` shared elements on listing cards in `Listings.astro`
- Scaffold a new listing detail page at `src/pages/listings/[slug].astro`
- Extend the listings content collection schema with detail-page fields
- Fix scroll-reveal IntersectionObserver to re-run after client-side navigation
- Graceful degradation in browsers without View Transitions API support

**Out of scope:** In-page section scroll links (`#about`, `#listings`, etc.) remain as anchor links and do not trigger View Transitions.

---

## Architecture

Three layers of change:

### 1. `src/layouts/BaseLayout.astro`

Import and render `<ViewTransitions />` inside `<head>`. This enables Astro's client-side router so navigating to `/listings/[slug]` does not trigger a full page reload, which is required for the morph transition to fire.

```astro
---
import { ViewTransitions } from 'astro:transitions';
---
<head>
  <!-- existing head content -->
  <ViewTransitions />
</head>
```

### 2. `src/components/Listings.astro`

Add `transition:name` directives to shared elements on each listing card. Names must be unique per listing (include `entry.slug`):

- `transition:name={\`listing-photo-${entry.slug}\`}` — photo wrapper `<div>`
- `transition:name={\`listing-address-${entry.slug}\`}` — address heading
- `transition:name={\`listing-price-${entry.slug}\`}` — price
- `transition:name={\`listing-badge-${entry.slug}\`}` — status badge `<span>` (child of photo wrapper)

The photo wrapper and status badge are intentionally named as independent shared elements. The badge is absolutely positioned inside the photo wrapper; both animate independently to their counterpart positions on the detail page — the photo wrapper does not subsume the badge transition.

**Card link behavior:**
- Cards always render as `<a href={\`/listings/${entry.slug}\`}>` regardless of whether `url` is set. The `url` field is surfaced on the detail page instead (e.g., as an external MLS link).
- Listings without an `address` are excluded from `getStaticPaths()` and must not render as links on the card. These placeholder listings should render as a non-linking `<div>` in `Listings.astro` (preserve existing conditional link/div pattern, but key off `address` presence instead of `url`).

### 3. `src/pages/listings/[slug].astro` (new)

Static detail page generated via `getStaticPaths()` from the listings collection. Filters out placeholder listings (those without an `address`).

**`<BaseLayout>` props:** Pass `title={\`${address} | Chetan Kotak\`}` and `description={listing.data.description ?? 'Property listing by Chetan Kotak.'}` so each detail page has unique SEO title and meta description.

**Image paths:** All `photo` and `gallery` image `src` values must be prefixed with `import.meta.env.BASE_URL.replace(/\/$/, '')` — consistent with the existing pattern in `Listings.astro` — so images resolve correctly under the `/realestate-portfolio` base path on GitHub Pages.

**Layout (top to bottom):**

1. **Hero image** — full-width, with matching `transition:name` for photo wrapper and status badge
2. **Property header** — address as display heading (`transition:name` matching card), price in gold (`transition:name` matching card), beds/baths/sqft/propertyType as horizontal spec row
3. **Gallery strip** — horizontal scroll of `gallery[]` images with BASE_URL-prefixed paths; only rendered if field is present
4. **Two-column body** (stacks on mobile):
   - Left: `description` markdown body + `highlights[]` bullet list
   - Right: specs card (yearBuilt, lotSize, garages, hoa, mlsNumber)
5. **Back link** — `← Back to listings` navigates to `/#listings`
6. **External link** — if `url` is set, render a "View on MLS" link (moved from card)

### 4. `src/content/config.ts`

Extend the listings schema with optional detail-page fields:

| Field | Type | Description |
|---|---|---|
| `gallery` | `string[]` | Additional photo paths beyond primary `photo` |
| `propertyType` | `string` | e.g. `"Single Family"`, `"Condo"`, `"Townhouse"` |
| `yearBuilt` | `number` | Year the property was built |
| `lotSize` | `string` | e.g. `"0.25 acres"` |
| `garages` | `number` | Number of garage spaces |
| `hoa` | `string` | e.g. `"$450/mo"` |
| `highlights` | `string[]` | Bullet list of key features |
| `mlsNumber` | `string` | MLS identifier for legal/footer area |

All fields are optional. Existing listing files require no changes. Card view (`Listings.astro`) reads only the fields it already uses.

---

## Scroll-Reveal Compatibility

The existing scroll-reveal IntersectionObserver runs on `DOMContentLoaded`. After a View Transitions client-side navigation, `DOMContentLoaded` does not re-fire, so `.reveal` elements on the new page would never become `.visible`.

Fix: extract initialization into a named function and register it on both events:

```js
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target); // one-fire: stop observing once revealed
      }
    });
  }, { threshold: 0.15 }); // matches existing threshold in BaseLayout.astro
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}
document.addEventListener('DOMContentLoaded', initScrollReveal);
document.addEventListener('astro:page-load', initScrollReveal);
```

---

## Graceful Degradation

Astro's `<ViewTransitions />` uses progressive enhancement by default — browsers without View Transitions API support (Firefox, Safari) receive normal full-page navigation. No additional fallback code is needed. The `transition:name` directives are ignored in unsupported browsers.

---

## Files Changed

| File | Change |
|---|---|
| `src/layouts/BaseLayout.astro` | Add `<ViewTransitions />` import and component |
| `src/components/Listings.astro` | Add `transition:name` to card photo, address, price, badge; update card link target |
| `src/pages/listings/[slug].astro` | New — listing detail page with matching `transition:name` elements |
| `src/content/config.ts` | Extend listings schema with 8 optional detail-page fields |

---

## Testing Checklist

- [ ] Chrome: morph transition fires on card → detail navigation
- [ ] Chrome: back navigation returns to listings section smoothly
- [ ] Firefox/Safari: normal page navigation (no transition, no errors)
- [ ] Scroll-reveal `.reveal` elements animate correctly on both index and detail pages
- [ ] Existing listing cards with no new fields render without errors
- [ ] Detail page with all optional fields renders correctly
- [ ] Detail page with no optional fields renders without layout breaks
- [ ] `npm run build` passes with no type errors
