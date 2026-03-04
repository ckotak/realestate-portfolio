---
description: Visual design system and brand guidelines
globs: ["src/components/**/*.astro"]
---

# Design System

## Theme

Dark background (charcoal `#0f0f0f`) with gold (`#C9A84C`) accent. White text on dark backgrounds, charcoal text on light backgrounds.

## Section Pattern

1. Gold label: `text-xs font-semibold uppercase tracking-[0.2em] text-gold`
2. Display heading: `font-display text-[clamp(3rem,6vw,5rem)]` (Bebas Neue)
3. Content area with `max-w-6xl mx-auto` container

## Interactive Elements

- **Primary:** gold background with charcoal text (`bg-gold text-charcoal`)
- **Secondary:** white border outline (`border border-white/20 hover:border-gold`)
- **Cards:** `border border-white/10` with `hover:border-gold/60 transition-colors`

## Status Badges

- Active: `bg-gold/20 text-gold`
- Under Contract: `bg-charcoal ring-1 ring-white/20`
- Sold: `bg-neutral-500/20 text-neutral-400`

## Layout

- Responsive grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` (or `lg:grid-cols-4` for WhyMe)
- Section padding: `py-24 px-6`
- Content max-width: `max-w-6xl mx-auto`
- Staggered reveal: `transition-delay` based on index (`i * 100ms`)

## Typography Scale

- Labels: `text-xs`
- Body: `text-sm` or `text-base`
- Lead text: `text-lg` or `text-xl`
- Headings: `clamp()` fluid sizing with `font-display`
