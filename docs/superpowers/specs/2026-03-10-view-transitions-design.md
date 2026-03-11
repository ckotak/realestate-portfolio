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

- `transition:name={\`listing-photo-${entry.slug}\`}` — hero image
- `transition:name={\`listing-address-${entry.slug}\`}` — address heading
- `transition:name={\`listing-price-${entry.slug}\`}` — price
- `transition:name={\`listing-badge-${entry.slug}\`}` — status badge

Listing card links updated to point to `/listings/[slug]` instead of `entry.data.url` (external URL moved to detail page).

### 3. `src/pages/listings/[slug].astro` (new)

Static detail page generated via `getStaticPaths()` from the listings collection. Filters out placeholder listings (those without an `address`).

**Layout (top to bottom):**

1. **Hero image** — full-width, with matching `transition:name` for photo and status badge
2. **Property header** — address as display heading, price in gold, beds/baths/sqft/propertyType as horizontal spec row; all with matching `transition:name`
3. **Gallery strip** — horizontal scroll of `gallery[]` images; only rendered if field is present
4. **Two-column body** (stacks on mobile):
   - Left: `description` markdown body + `highlights[]` bullet list
   - Right: specs card (yearBuilt, lotSize, garages, hoa, mlsNumber)
5. **Back link** — `← Back to listings` navigates to `/#listings`

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
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1 });
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
