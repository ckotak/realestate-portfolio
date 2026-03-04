---
name: seo-structured-data
description: SEO best practices and structured data for static real estate sites. Use when optimizing meta tags, adding schema.org markup, or improving search visibility.
user-invocable: true
---

# SEO & Structured Data

Implement search engine optimization and structured data for an Astro-based real estate portfolio deployed as a static site on GitHub Pages.

## When to Use

- Adding or updating meta tags (title, description, Open Graph, Twitter Cards)
- Implementing JSON-LD structured data (schema.org)
- Optimizing for real estate-specific search queries
- Reviewing SEO compliance of pages or components
- Updating sitemap, robots.txt, or canonical URLs

## Structured Data Types for Real Estate

### RealEstateAgent (Person)

Already implemented in `BaseLayout.astro`. Uses combined `@type: ["Person", "RealEstateAgent"]` with:
- Contact info (telephone, email)
- Credentials (DRE license via `hasCredential`)
- Service area (`areaServed`)
- Social profiles (`sameAs`)

### RealEstateListing (for individual properties)

```json
{
  "@context": "https://schema.org",
  "@type": "RealEstateListing",
  "name": "123 Main Street",
  "description": "Property description",
  "url": "https://example.com/listing",
  "image": "https://site.com/listings/photo.svg",
  "offers": {
    "@type": "Offer",
    "price": "1250000",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Main Street",
    "addressLocality": "City",
    "addressRegion": "CA"
  }
}
```

## Meta Tag Patterns

### Page-Level SEO (in BaseLayout.astro)

- `<title>` — 50-60 characters, include primary keyword + brand
- `<meta name="description">` — 150-160 characters, include call to action
- `<link rel="canonical">` — absolute URL to prevent duplicate content
- `<meta name="robots">` — `index, follow` with snippet/image directives

### Open Graph (social sharing)

- `og:type` — `website` for homepage, `article` for blog posts
- `og:image` — 1200x630px, absolute URL
- `og:title` and `og:description` — can differ from page title/description for social optimization

### Twitter/X Cards

- `twitter:card` — `summary_large_image` for visual content
- `twitter:site` and `twitter:creator` — handle references

## Static Files

- `public/robots.txt` — allow all crawlers, reference sitemap
- `public/sitemap.xml` — list all indexable URLs (for single-page site, just the homepage)
- `public/llms.txt` — structured content summary for AI crawlers

## Best Practices

- Every page must have a unique `<title>` and `<meta description>`
- Use absolute URLs in all structured data and Open Graph tags
- JSON-LD should be in `<head>` via `<script type="application/ld+json">`
- Test structured data with Google Rich Results Test
- Ensure `BASE_URL` is accounted for in all canonical and og:url values
- Real estate keywords: focus on location + service type (e.g., "Bay Area real estate agent")

## Current Implementation

SEO is implemented in `src/layouts/BaseLayout.astro`:
- Full Open Graph + Twitter Card meta tags
- JSON-LD with Person + RealEstateAgent schema
- CSP headers via meta tags
- Canonical URL set to site root
