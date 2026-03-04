---
name: conversion-ux
description: Conversion-focused UX patterns for real estate sites. Use when optimizing CTAs, trust signals, social proof, and lead generation.
user-invocable: true
---

# Conversion UX

Apply conversion-focused UX principles to maximize lead generation and client engagement on a real estate portfolio site.

## When to Use

- Designing or improving call-to-action elements
- Adding trust signals or social proof
- Optimizing the page flow for conversions
- Reviewing above-the-fold content effectiveness
- Improving contact friction reduction

## CTA Hierarchy

### Primary CTA (one per viewport)

The single most important action — typically "Get in Touch" or "Schedule a Consultation."

```html
<a href="#contact"
   class="inline-block px-8 py-4 bg-gold text-charcoal font-semibold
          text-lg rounded-lg hover:bg-gold-hover transition-colors">
  Schedule a Free Consultation
</a>
```

- Large, gold background, high contrast
- Action-oriented verb + clear value ("Free Consultation" not just "Contact")
- Placed in Hero section and repeated at page bottom

### Secondary CTA

Supporting actions like "View Listings" or "Learn More."

```html
<a href="#listings"
   class="inline-block px-6 py-3 border border-white/20 text-white
          rounded-lg hover:border-gold hover:text-gold transition-colors">
  View Active Listings
</a>
```

- Outline style, lower visual weight than primary
- Used alongside primary CTA or within sections

## Trust Signals

### Statistics Bar

Already implemented via the About collection's `stats` array. Effective pattern:

```html
<div class="grid grid-cols-3 gap-8 text-center">
  <div>
    <p class="text-4xl font-display text-gold">15+</p>
    <p class="text-xs uppercase tracking-wider text-white/60">Years Experience</p>
  </div>
  <!-- More stats -->
</div>
```

- Place high on page (About section) — numbers build immediate credibility
- Use specific numbers, not vague claims ("$200M+ in Sales" not "Lots of sales")

### Professional Credentials

- Display DRE license number visibly (footer or About section)
- Mention brokerage affiliation
- Include professional headshot

### Testimonials (future addition)

```html
<blockquote class="border-l-2 border-gold pl-6">
  <p class="text-lg text-white/90 italic">"Quote from client..."</p>
  <footer class="mt-3 text-sm text-white/60">— Client Name, City</footer>
</blockquote>
```

## Page Flow Optimization

### F-Pattern / Z-Pattern

Users scan in an F or Z pattern. Place key elements accordingly:

1. **Hero** — Name + tagline + primary CTA (above the fold)
2. **About** — Stats bar for quick credibility scan
3. **WhyMe** — Value propositions in scannable card grid
4. **Listings** — Visual proof of active business
5. **Contact** — Final CTA with minimal friction

### Above-the-Fold Checklist

- [ ] Clear value proposition (who you are, what you do)
- [ ] Primary CTA visible without scrolling
- [ ] Professional imagery or visual identity
- [ ] No clutter — one message, one action

## Listing Status as Urgency Signals

The current status badges serve as urgency/social proof:
- **Active** (gold) — available, encourages inquiry
- **Under Contract** (neutral) — social proof of demand
- **Sold** (dimmed) — track record evidence

Display mix of all three statuses to show both availability and track record.

## Contact Friction Reduction

- Minimize required form fields (name + email + message is sufficient)
- Offer multiple contact methods (form, phone, email)
- Set clear response time expectation ("Responds within 2 hours")
- Pre-fill property interest if clicking from a listing card
- Mobile: use `tel:` link for one-tap calling

## Whitespace as Focus Tool

- Generous padding between sections (`py-24`)
- Limit content width (`max-w-6xl`) to maintain readable line lengths
- Use whitespace to isolate CTAs and draw attention
- Avoid visual clutter — each section has one purpose

## Mobile Conversion

- Sticky header with CTA button visible on scroll
- Phone number as tappable `tel:` link
- Full-width CTAs on mobile (easier to tap)
- Minimize text; maximize scannable elements (stats, cards, badges)
