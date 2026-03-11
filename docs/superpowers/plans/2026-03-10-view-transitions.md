# View Transitions API Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Astro's View Transitions API to enable a shared-element morph transition from listing cards to individual listing detail pages, while scaffolding the detail page infrastructure.

**Architecture:** `<ViewTransitions />` is added to `BaseLayout.astro` to enable Astro's client-side router. Listing cards get `transition:name` directives keyed to each listing's slug; the new `[slug].astro` detail page mirrors those names so the browser morphs the card photo, address, price, and badge into the detail layout. The existing scroll-reveal IntersectionObserver is refactored to fire on `astro:page-load` so it works after client-side navigation.

**Tech Stack:** Astro 5 (`astro:transitions`, `astro:content`), Tailwind CSS v4, TypeScript strict mode, static output (GitHub Pages base path `/realestate-portfolio`).

**Spec:** `docs/superpowers/specs/2026-03-10-view-transitions-design.md`

---

## File Map

| Action | File | Responsibility |
|---|---|---|
| Modify | `src/content/config.ts` | Add 8 optional detail-page fields to listings schema |
| Modify | `src/layouts/BaseLayout.astro` | Add `<ViewTransitions />`, refactor scroll-reveal to fire on `astro:page-load` |
| Modify | `src/components/Listings.astro` | Add `transition:name` to card elements; update link logic to use slug URL |
| Create | `src/pages/listings/[slug].astro` | Static listing detail page with matching `transition:name` elements |

---

## Chunk 1: Schema + BaseLayout

### Task 1: Extend listings schema with detail-page fields

**Files:**
- Modify: `src/content/config.ts`

> This is a pure schema change. All new fields are optional, so existing markdown files need no changes.

- [ ] **Step 1: Add 8 optional fields to the listings schema**

Open `src/content/config.ts`. The current `listings` schema ends at `url`. Add the following fields inside the `z.object({})` block, after the `url` line:

```ts
gallery: z.array(z.string()).optional(),
propertyType: z.string().optional(),
yearBuilt: z.number().optional(),
lotSize: z.string().optional(),
garages: z.number().optional(),
hoa: z.string().optional(),
highlights: z.array(z.string()).optional(),
mlsNumber: z.string().optional(),
```

The full updated `listings` definition should look like:

```ts
const listings = defineCollection({
  type: 'content',
  schema: z.object({
    address: z.string().optional(),
    price: z.string().optional(),
    beds: z.number().optional(),
    baths: z.number().optional(),
    sqft: z.number().optional(),
    status: z.enum(['Active', 'Under Contract', 'Sold']),
    order: z.number(),
    photo: z.string().optional(),
    description: z.string().optional(),
    url: z.string().url().optional(),
    gallery: z.array(z.string()).optional(),
    propertyType: z.string().optional(),
    yearBuilt: z.number().optional(),
    lotSize: z.string().optional(),
    garages: z.number().optional(),
    hoa: z.string().optional(),
    highlights: z.array(z.string()).optional(),
    mlsNumber: z.string().optional(),
  }),
});
```

- [ ] **Step 2: Verify build passes**

```bash
npm run build
```

Expected: build succeeds, no TypeScript errors. All existing listing pages render fine since all new fields are optional.

- [ ] **Step 3: Commit**

```bash
git add src/content/config.ts
git commit -m "feat: extend listings schema with detail-page fields (SCRUM-7)"
```

---

### Task 2: Add ViewTransitions and fix scroll-reveal in BaseLayout

**Files:**
- Modify: `src/layouts/BaseLayout.astro`

> Two changes: (1) add `<ViewTransitions />` to `<head>`, (2) refactor the inline scroll-reveal `<script>` so it fires on both `DOMContentLoaded` and `astro:page-load`.

- [ ] **Step 1: Import ViewTransitions in the frontmatter**

In `src/layouts/BaseLayout.astro`, the frontmatter block currently starts with font and CSS imports. Add the ViewTransitions import as the first line:

```astro
---
import { ViewTransitions } from 'astro:transitions';
import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';
import '../styles/global.css';
// ... rest of frontmatter unchanged
---
```

- [ ] **Step 2: Render `<ViewTransitions />` inside `<head>`**

In the `<head>` block, add `<ViewTransitions />` immediately before the closing `</head>` tag (after the Bebas Neue `<link>` tags):

```html
  <!-- Bebas Neue via Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap"
    rel="stylesheet"
  />
  <ViewTransitions />
</head>
```

- [ ] **Step 3: Refactor the scroll-reveal script**

Replace the existing `<script>` block at the bottom of `<body>`:

**Current (lines 133–147):**
```html
<script>
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
</script>
```

**Replace with:**
```html
<script>
  function initScrollReveal() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
  }

  // Run on first load and after every Astro client-side navigation
  document.addEventListener('DOMContentLoaded', initScrollReveal);
  document.addEventListener('astro:page-load', initScrollReveal);
</script>
```

- [ ] **Step 4: Verify build passes**

```bash
npm run build
```

Expected: build succeeds. No errors.

- [ ] **Step 5: Spot-check in dev server**

```bash
npm run dev
```

Open `http://localhost:4321/realestate-portfolio`. Scroll down — `.reveal` elements should still animate in. No console errors.

- [ ] **Step 6: Commit**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "feat: add ViewTransitions and fix scroll-reveal for client-side nav (SCRUM-7)"
```

---

## Chunk 2: Listings Card Updates + Detail Page

### Task 3: Add transition:name directives and update card links in Listings.astro

**Files:**
- Modify: `src/components/Listings.astro`

> Two changes: (1) add `transition:name` to the photo wrapper, address, price, and status badge on each card, (2) update the `CardWrapper` logic to link to `/listings/${slug}` instead of `url`, keyed off `address` presence.

- [ ] **Step 1: Update the destructuring to include `id`**

The `listings.map((listing, i) => {` call currently destructures `listing.data`. Change the destructuring line (line 30) to also capture `listing.id` (Astro 5 uses `.id`, not `.slug` — `.slug` is deprecated and returns `undefined`):

```astro
{listings.map((listing, i) => {
  const { address, price, beds, baths, sqft, status, photo, description, url } = listing.data;
  const slug = listing.id; // Astro 5: use .id, not .slug
```

- [ ] **Step 2: Update the CardWrapper link logic**

Replace the current `CardWrapper` / `cardProps` lines (lines 52–53):

**Current:**
```astro
const CardWrapper = url ? 'a' : 'div';
const cardProps = url ? { href: url, target: '_blank', rel: 'noopener noreferrer' } : {};
```

**Replace with:**
```astro
// Cards with an address link to the detail page.
// Cards without an address are placeholders — render as non-linking div.
const hasDetailPage = Boolean(address);
const CardWrapper = hasDetailPage ? 'a' : 'div';
const cardProps = hasDetailPage
  ? { href: `${import.meta.env.BASE_URL.replace(/\/$/, '')}/listings/${slug}` }
  : {};
```

Then find the `CardWrapper` JSX element's `class` attribute (line 59) and update the `block` conditional to key off `hasDetailPage` instead of `url`:

**Current:**
```astro
class={`reveal border border-white/10 hover:border-gold transition-colors group overflow-hidden${url ? ' block' : ''}`}
```

**Replace with:**
```astro
class={`reveal border border-white/10 hover:border-gold transition-colors group overflow-hidden${hasDetailPage ? ' block' : ''}`}
```

- [ ] **Step 3: Fix "Sold" badge class to match the design system**

The current `Listings.astro` uses `'bg-neutral-500 text-white'` for the Sold badge, but the design system specifies `'bg-neutral-500/20 text-neutral-400'`. Since the badge morphs from card to detail page via View Transitions, they must use the same classes or the animation will look jarring. Align the card to the design system value.

Find the `badgeClass` assignment (lines 32–37) and update the `Sold` branch:

**Current:**
```astro
const badgeClass =
  status === 'Active'
    ? 'bg-gold text-charcoal'
    : status === 'Under Contract'
    ? 'bg-charcoal text-white ring-1 ring-white/25'
    : 'bg-neutral-500 text-white';
```

**Replace with:**
```astro
const badgeClass =
  status === 'Active'
    ? 'bg-gold text-charcoal'
    : status === 'Under Contract'
    ? 'bg-charcoal text-white ring-1 ring-white/25'
    : 'bg-neutral-500/20 text-neutral-400';
```

- [ ] **Step 4: Add transition:name to the photo wrapper `<div>`**

Find the photo wrapper (line 63):

```astro
<div class="relative aspect-video overflow-hidden">
```

Add the `transition:name` directive:

```astro
<div class="relative aspect-video overflow-hidden" transition:name={`listing-photo-${slug}`}>
```

- [ ] **Step 5: Add transition:name to the status badge `<span>`**

Find the status badge `<span>` (line 76):

```astro
<span class={`absolute top-3 left-3 flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest shadow-[0_2px_12px_rgba(0,0,0,0.55)] ${badgeClass}`}>
```

Add `transition:name`:

```astro
<span
  transition:name={`listing-badge-${slug}`}
  class={`absolute top-3 left-3 flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest shadow-[0_2px_12px_rgba(0,0,0,0.55)] ${badgeClass}`}
>
```

- [ ] **Step 6: Add transition:name to the address paragraph**

Find the address `<p>` (line 84):

```astro
{address && (
  <p class="text-white/40 text-xs uppercase tracking-[0.15em] mb-2">
    {address}
  </p>
)}
```

Add `transition:name`:

```astro
{address && (
  <p transition:name={`listing-address-${slug}`} class="text-white/40 text-xs uppercase tracking-[0.15em] mb-2">
    {address}
  </p>
)}
```

- [ ] **Step 7: Add transition:name to the price paragraph**

Find the price `<p>` (line 89):

```astro
{price && (
  <p class="font-display text-3xl text-gold leading-none mb-4">
    {price}
  </p>
)}
```

Add `transition:name`:

```astro
{price && (
  <p transition:name={`listing-price-${slug}`} class="font-display text-3xl text-gold leading-none mb-4">
    {price}
  </p>
)}
```

- [ ] **Step 8: Verify build passes**

```bash
npm run build
```

Expected: build succeeds. No TypeScript errors.

- [ ] **Step 9: Spot-check in dev server**

```bash
npm run dev
```

Open `http://localhost:4321/realestate-portfolio`. Listing cards with an address should now be links (no external tab open — they link to `/realestate-portfolio/listings/<slug>`). Cards without address remain non-links. (The detail pages don't exist yet, so links will 404 — that's expected at this step.)

- [ ] **Step 10: Commit**

```bash
git add src/components/Listings.astro
git commit -m "feat: add transition:name to listing cards and update link targets (SCRUM-7)"
```

---

### Task 4: Create the listing detail page

**Files:**
- Create: `src/pages/listings/[slug].astro`

> New static page. `getStaticPaths()` generates one route per listing that has an `address`. Layout: hero image → property header → gallery strip → two-column body → back/MLS links. All shared elements use matching `transition:name` values.

- [ ] **Step 1: Create the file with frontmatter and static path generation**

Create `src/pages/listings/[slug].astro` with the following content:

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';

export async function getStaticPaths() {
  const listings = await getCollection('listings');
  // Only generate detail pages for listings that have an address
  return listings
    .filter((listing) => listing.data.address)
    .map((listing) => ({
      params: { slug: listing.id }, // Astro 5: use .id, not .slug
      props: { listing },
    }));
}

const { listing } = Astro.props;
const {
  address,
  price,
  beds,
  baths,
  sqft,
  status,
  photo,
  description,
  url,
  gallery,
  propertyType,
  yearBuilt,
  lotSize,
  garages,
  hoa,
  highlights,
  mlsNumber,
} = listing.data;

const slug = listing.id; // Astro 5: use .id, not .slug
const base = import.meta.env.BASE_URL.replace(/\/$/, '');

// Note: Sold badge uses design system value 'bg-neutral-500/20 text-neutral-400'
// Task 3 aligns Listings.astro to match — both card and detail page use the same classes
// so the View Transitions morph is visually seamless.
const badgeClass =
  status === 'Active'
    ? 'bg-gold text-charcoal'
    : status === 'Under Contract'
    ? 'bg-charcoal text-white ring-1 ring-white/25'
    : 'bg-neutral-500/20 text-neutral-400';

const badgeDot =
  status === 'Active'
    ? 'bg-charcoal/40'
    : status === 'Under Contract'
    ? 'bg-gold'
    : 'bg-white/50';

const specs = [
  beds != null && `${beds} bd`,
  baths != null && `${baths} ba`,
  sqft != null && `${sqft.toLocaleString()} sq ft`,
  propertyType,
].filter(Boolean);

const detailSpecs = [
  yearBuilt && { label: 'Year Built', value: String(yearBuilt) },
  lotSize && { label: 'Lot Size', value: lotSize },
  garages != null && { label: 'Garage', value: `${garages} space${garages !== 1 ? 's' : ''}` },
  hoa && { label: 'HOA', value: hoa },
  mlsNumber && { label: 'MLS #', value: mlsNumber },
].filter(Boolean) as { label: string; value: string }[];
---

<BaseLayout
  title={`${address} | Chetan Kotak`}
  description={description ?? 'Property listing by Chetan Kotak.'}
>
  <div class="min-h-screen bg-charcoal text-white">

    <!-- Hero image -->
    <div class="relative w-full aspect-video max-h-[60vh] overflow-hidden" transition:name={`listing-photo-${slug}`}>
      {photo ? (
        <img
          src={`${base}${photo}`}
          alt={address ?? 'Property listing'}
          class="w-full h-full object-cover"
        />
      ) : (
        <div class="w-full h-full bg-gradient-to-br from-gold/20 to-charcoal flex items-center justify-center">
          <span class="text-gold text-6xl opacity-30">◆</span>
        </div>
      )}
      <!-- Status badge -->
      <span
        transition:name={`listing-badge-${slug}`}
        class={`absolute top-4 left-4 flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest shadow-[0_2px_12px_rgba(0,0,0,0.55)] ${badgeClass}`}
      >
        <span class={`w-1.5 h-1.5 rounded-full shrink-0 ${badgeDot}`}></span>
        {status}
      </span>
    </div>

    <!-- Property header -->
    <div class="px-6 py-10 max-w-6xl mx-auto border-b border-white/10">
      {address && (
        <p transition:name={`listing-address-${slug}`} class="text-white/40 text-xs uppercase tracking-[0.15em] mb-3">
          {address}
        </p>
      )}
      {price && (
        <p transition:name={`listing-price-${slug}`} class="font-display text-[clamp(3rem,6vw,5rem)] text-gold leading-none mb-6">
          {price}
        </p>
      )}
      {specs.length > 0 && (
        <p class="text-white/50 text-sm" set:html={specs.join(' &middot; ')} />
      )}
    </div>

    <!-- Gallery strip (only if gallery field is present) -->
    {gallery && gallery.length > 0 && (
      <div class="px-6 py-8 max-w-6xl mx-auto">
        <div class="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
          {gallery.map((imgPath) => (
            <div class="shrink-0 w-64 aspect-video overflow-hidden border border-white/10">
              <img
                src={`${base}${imgPath}`}
                alt={`${address ?? 'Property'} photo`}
                class="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      </div>
    )}

    <!-- Two-column body -->
    <div class="px-6 py-12 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">

      <!-- Left: description + highlights -->
      <div class="lg:col-span-2 space-y-8">
        {description && (
          <div>
            <h2 class="font-display text-2xl text-white uppercase mb-4">About this property</h2>
            <p class="text-white/70 leading-relaxed">{description}</p>
          </div>
        )}
        {highlights && highlights.length > 0 && (
          <div>
            <h2 class="font-display text-2xl text-white uppercase mb-4">Highlights</h2>
            <ul class="space-y-2">
              {highlights.map((item) => (
                <li class="flex items-start gap-3 text-white/70 text-sm">
                  <span class="text-gold mt-0.5 shrink-0">◆</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <!-- Right: specs card -->
      {detailSpecs.length > 0 && (
        <div class="border border-white/10 p-6 self-start">
          <h2 class="font-display text-xl text-white uppercase mb-4">Property Details</h2>
          <dl class="space-y-3">
            {detailSpecs.map(({ label, value }) => (
              <div class="flex justify-between gap-4 text-sm border-b border-white/5 pb-3 last:border-0 last:pb-0">
                <dt class="text-white/40 uppercase tracking-widest text-xs">{label}</dt>
                <dd class="text-white/80 text-right">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>

    <!-- External MLS link + back navigation -->
    <div class="px-6 pb-16 max-w-6xl mx-auto flex flex-wrap items-center gap-4">
      {url && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 border border-white/20 hover:border-gold text-white/60 hover:text-gold transition-colors px-6 py-3 text-sm uppercase tracking-widest"
        >
          View on MLS ↗
        </a>
      )}
      <a
        href={`${base}/#listings`}
        class="inline-flex items-center gap-2 text-white/50 hover:text-gold transition-colors text-sm uppercase tracking-widest"
      >
        <span>←</span> Back to listings
      </a>
    </div>

  </div>
</BaseLayout>
```

- [ ] **Step 2: Verify build passes**

```bash
npm run build
```

Expected: build succeeds. You should see `dist/listings/<slug>/index.html` generated for each listing with an `address`.

Verify the generated files exist:

```bash
ls dist/listings/
```

Expected output (will match your listing slugs):
```
123-main-st/   456-oak-ave/   5254-country-lane/   789-pacific-hts/
```

- [ ] **Step 3: Smoke-test in dev server**

```bash
npm run dev
```

1. Open `http://localhost:4321/realestate-portfolio`
2. Click a listing card — browser should navigate to the detail page
3. In **Chrome**: observe the morph transition (photo, badge, address, price animate from card position into detail layout)
4. In **Firefox/Safari**: confirm normal navigation with no JS errors in console
5. On the detail page, click `← Back to listings` — should return to `/#listings`
6. Scroll the index page after navigating back — `.reveal` elements should still animate in

- [ ] **Step 4: Verify build output for a detail page**

```bash
cat dist/listings/123-main-st/index.html | grep -c "listing-photo"
```

Expected: `1` (the photo wrapper has `transition:name="listing-photo-123-main-st"` — one occurrence per detail page).

- [ ] **Step 5: Commit**

```bash
git add src/pages/listings/[slug].astro
git commit -m "feat: scaffold listing detail page with shared-element transitions (SCRUM-7)"
```

---

## Final Verification

- [ ] Run full production build and confirm no errors:

```bash
npm run build
```

- [ ] Check that all listing slugs produced detail pages:

```bash
ls dist/listings/
```

- [ ] Review the spec testing checklist at `docs/superpowers/specs/2026-03-10-view-transitions-design.md` and confirm each item passes manually.

- [ ] Final commit if any last-minute fixes were made:

```bash
git add -p
git commit -m "chore: final polish for View Transitions (SCRUM-7)"
```
