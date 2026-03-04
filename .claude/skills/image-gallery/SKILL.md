---
name: image-gallery
description: Image handling and gallery patterns for real estate sites. Use when optimizing images, building galleries, or implementing responsive image loading.
user-invocable: true
---

# Image Gallery & Handling

Implement performant, responsive image patterns for a real estate portfolio site.

## When to Use

- Adding or optimizing property listing photos
- Building image galleries or lightboxes
- Implementing responsive image loading
- Setting up placeholder/skeleton states
- Choosing between image formats

## Format Selection

| Format | Use Case | Pros | Cons |
|--------|----------|------|------|
| SVG | Illustrations, icons, logos | Scalable, tiny files | Not for photos |
| WebP | Property photos (primary) | 30% smaller than JPEG | IE11 (irrelevant) |
| AVIF | Property photos (progressive) | 50% smaller than JPEG | Slower encode |
| JPEG | Fallback for photos | Universal support | Larger files |
| PNG | Screenshots, sharp edges | Lossless | Very large for photos |

Current listing photos are SVG illustrations. When using real property photos, prefer WebP with JPEG fallback.

## Responsive Images

### Picture Element with Format Fallback

```html
<picture>
  <source srcset="/listings/photo.avif" type="image/avif" />
  <source srcset="/listings/photo.webp" type="image/webp" />
  <img
    src="/listings/photo.jpg"
    alt="3-bedroom home at 123 Main Street with open floor plan"
    width="800"
    height="600"
    loading="lazy"
    decoding="async"
    class="w-full h-full object-cover"
  />
</picture>
```

### Srcset for Size Variants

```html
<img
  srcset="/listings/photo-400.webp 400w,
          /listings/photo-800.webp 800w,
          /listings/photo-1200.webp 1200w"
  sizes="(max-width: 640px) 100vw,
         (max-width: 1024px) 50vw,
         33vw"
  src="/listings/photo-800.webp"
  alt="Property description"
  width="800"
  height="600"
  loading="lazy"
  class="w-full h-full object-cover"
/>
```

## Aspect Ratio Containers

Prevent layout shift by reserving space before images load:

```html
<!-- Tailwind aspect ratio -->
<div class="aspect-[4/3] overflow-hidden rounded-lg bg-charcoal-90">
  <img src="..." alt="..." class="w-full h-full object-cover" loading="lazy" />
</div>

<!-- 16:9 for hero/banner images -->
<div class="aspect-video overflow-hidden">
  <img src="..." alt="..." class="w-full h-full object-cover" />
</div>
```

Standard aspect ratios for real estate:
- **4:3** — listing card thumbnails
- **16:9** — hero banners, wide shots
- **3:2** — gallery detail views
- **1:1** — agent headshot, square thumbnails

## Skeleton Loading

```html
<!-- Skeleton placeholder while image loads -->
<div class="aspect-[4/3] rounded-lg bg-charcoal-90 animate-pulse">
  <!-- Image replaces this on load -->
</div>
```

## Lightbox Pattern

For full-screen image viewing (zero-dependency approach):

```html
<dialog id="lightbox" class="bg-black/90 backdrop:bg-black/90 p-0 m-0
                              w-screen h-screen max-w-none max-h-none">
  <button onclick="this.closest('dialog').close()"
          class="absolute top-4 right-4 text-white text-2xl"
          aria-label="Close lightbox">
    &times;
  </button>
  <img id="lightbox-img" src="" alt=""
       class="max-w-[90vw] max-h-[90vh] m-auto object-contain" />
</dialog>

<script>
  document.querySelectorAll('[data-lightbox]').forEach(img => {
    img.addEventListener('click', () => {
      const dialog = document.getElementById('lightbox');
      document.getElementById('lightbox-img').src = img.src;
      document.getElementById('lightbox-img').alt = img.alt;
      dialog.showModal();
    });
  });
</script>
```

## Grid Layout Patterns

### Listing Cards Grid

```html
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  <!-- Cards with consistent image sizing -->
  <article class="rounded-xl overflow-hidden border border-white/10">
    <div class="aspect-[4/3] overflow-hidden">
      <img src="..." alt="..." class="w-full h-full object-cover
                                       hover:scale-105 transition-transform duration-500" />
    </div>
    <div class="p-5"><!-- Card content --></div>
  </article>
</div>
```

### Masonry-Style Gallery (CSS Grid)

```html
<div class="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
  <img src="..." alt="..." class="w-full rounded-lg" />
  <!-- More images -->
</div>
```

## Alt Text Guidelines for Real Estate

Good alt text describes what a potential buyer would want to know:

- "Spacious living room with hardwood floors and bay windows" (describes features)
- "Modern kitchen with granite countertops and stainless steel appliances" (materials)
- "Exterior view of 123 Main Street, a two-story craftsman home" (identifying info)

Avoid:
- "Photo 1" or "listing image" (uninformative)
- "Beautiful home" (subjective, not descriptive)
- Keyword stuffing ("buy home San Francisco real estate agent listing")

## Current Implementation

Listing photos are stored in `public/listings/` as SVG files. The `Listings.astro` component references them via the `photo` frontmatter field with BASE_URL-aware paths:

```javascript
const base = import.meta.env.BASE_URL.replace(/\/$/, '');
// Usage: `${base}${listing.data.photo}`
```
