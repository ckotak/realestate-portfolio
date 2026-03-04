---
name: performance-optimization
description: Core Web Vitals and performance optimization for static Astro sites. Use when optimizing load times, images, fonts, or bundle size.
user-invocable: true
---

# Performance Optimization

Optimize Core Web Vitals and overall performance for an Astro static site deployed to GitHub Pages.

## When to Use

- Optimizing image loading and formats
- Improving font loading strategy
- Reducing bundle size
- Auditing Core Web Vitals (LCP, CLS, INP)
- Implementing lazy loading patterns
- Reviewing critical rendering path

## Core Web Vitals Targets

| Metric | Target | What it measures |
|--------|--------|-----------------|
| LCP (Largest Contentful Paint) | < 2.5s | Loading speed |
| CLS (Cumulative Layout Shift) | < 0.1 | Visual stability |
| INP (Interaction to Next Paint) | < 200ms | Responsiveness |

## Image Optimization

### Format Selection

- **SVG** for illustrations, icons, logos (current listing photos are SVG)
- **WebP** for photographs with fallback to JPEG
- **AVIF** for maximum compression (check browser support)
- Use `<picture>` element for format fallbacks

### Responsive Images

```html
<img
  src="/listings/photo-800.webp"
  srcset="/listings/photo-400.webp 400w,
          /listings/photo-800.webp 800w,
          /listings/photo-1200.webp 1200w"
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  width="800"
  height="600"
  loading="lazy"
  decoding="async"
  alt="Property description"
/>
```

### Key Rules

- Always set `width` and `height` attributes to prevent CLS
- Use `loading="lazy"` for below-the-fold images
- Use `loading="eager"` + `fetchpriority="high"` for hero/LCP images
- Use `decoding="async"` for non-critical images

## Font Loading

### Current Setup

- Inter: loaded via `@fontsource/inter` (self-hosted, good)
- Bebas Neue: loaded via Google Fonts with `display=swap`

### Optimization Patterns

- `font-display: swap` prevents invisible text during load (already used)
- `<link rel="preconnect">` for Google Fonts (already implemented)
- Consider self-hosting Bebas Neue to eliminate Google Fonts dependency
- Subset fonts to only needed character ranges

## Lazy Loading with Intersection Observer

```javascript
// Already implemented in BaseLayout.astro for scroll-reveal
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
```

Extend this pattern for:
- Lazy-loading images (swap `data-src` to `src` on intersect)
- Deferring non-critical CSS or scripts
- Loading embedded maps or iframes on demand

## Bundle Optimization

- Astro produces zero JS by default for static components
- Only inline `<script>` tags ship client-side JS
- Keep scripts minimal — current scripts are nav toggle + scroll observer
- Avoid importing large libraries; prefer native APIs
- Use `astro build` output analysis to monitor bundle size

## Testing

- Run Lighthouse in Chrome DevTools (Performance, Accessibility, Best Practices, SEO)
- Test on throttled 3G connection for mobile performance
- Use WebPageTest for detailed waterfall analysis
- Check `npm run build` output for page sizes
