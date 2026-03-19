# SCRUM-8: Theming & White-Label System — Design Spec

## Summary

Centralize all brand tokens (colors, fonts, agent identity, contact info, credentials, social links) into a single TypeScript config file (`src/config/brand.ts`) so the entire site can be re-branded by editing one file, regenerating CSS tokens, and rebuilding.

## Goals

- Single config file contains all brand-specific values
- All components reference the config instead of hardcoded values
- Swapping the config produces a fully re-branded site after rebuild
- Tailwind v4 `@theme` block is generated from the config
- Documentation on how to create a new brand theme

## Non-Goals

- Multi-tenant support (one site = one agent)
- Marketing copy in the config (taglines, section descriptions stay in components)
- Runtime theme switching

## Architecture

### Config File: `src/config/brand.ts`

Single exported `brand` object with typed sections:

```ts
export interface BrandConfig {
  agent: {
    name: string;
    title: string;
    dreNumber: string;
  };
  contact: {
    phone: string;       // display format: "+1 (415) 555-0100"
    phoneRaw: string;    // tel: links and schema.org: "+1-415-555-0100"
    email: string;
  };
  social: {
    twitter: string;     // handle: "@chetankotak"
    twitterUrl: string;
    linkedinUrl: string;
  };
  location: {
    city: string;
    region: string;
    country: string;
    areaServed: string;
  };
  site: {
    name: string;        // og:site_name, e.g. "Chetan Kotak Real Estate"
    url: string;
    ogImage: string;     // path relative to site root
    twitterCard: "summary" | "summary_large_image";
  };
  theme: {
    colors: {
      primary: string;      // main dark background (charcoal)
      primaryLight: string;  // lighter variant (charcoal-90)
      accent: string;       // brand accent (gold)
      accentHover: string;  // accent hover state
      background: string;   // light background (offwhite)
      backgroundAlt: string; // alternate light background (lightgray)
    };
    fonts: {
      display: string;  // CSS font-family for headings
      body: string;     // CSS font-family for body text
    };
  };
}
```

Two files:
- `src/config/brand.ts` — live config with current Chetan Kotak values
- `src/config/brand.example.ts` — starter template with placeholder values and comments

### CSS Token Generation: `scripts/generate-theme.ts`

Node script that reads `brand.ts` and writes `src/styles/theme-tokens.css`:

```css
/* Auto-generated from src/config/brand.ts — do not edit manually */
@theme {
  --color-charcoal: #0f0f0f;
  --color-charcoal-90: #1a1a1a;
  --color-gold: #C9A84C;
  --color-gold-hover: #dbb96a;
  --color-offwhite: #f9f9f7;
  --color-lightgray: #f2f2f0;
  --font-display: 'Bebas Neue', 'Arial Narrow', sans-serif;
  --font-body: 'Inter', ui-sans-serif, system-ui, sans-serif;
  --animate-fade-up: fade-up 0.6s ease-out forwards;
}
```

Token name mapping (config key → CSS variable):
- `primary` → `--color-charcoal`
- `primaryLight` → `--color-charcoal-90`
- `accent` → `--color-gold`
- `accentHover` → `--color-gold-hover`
- `background` → `--color-offwhite`
- `backgroundAlt` → `--color-lightgray`
- `fonts.display` → `--font-display`
- `fonts.body` → `--font-body`

Font values store the full CSS `font-family` string (including fallbacks) so white-label users have full control.

Integration:
- `global.css` changes from inline `@theme` block to `@import "./theme-tokens.css"`. Import order matters:
  ```css
  @import "tailwindcss";
  @import "./theme-tokens.css";
  ```
- New npm script: `"theme": "npx tsx scripts/generate-theme.ts"`
- `tsx` added as a dev dependency (avoids interactive `npx` prompts in CI)
- Generated file is committed to git (site builds without running generator)
- Animation keyframes (`fade-up`) stay in `global.css` (not brand-specific)

### Component Updates

Components import `brand` and use its values instead of hardcoded strings:

| File | Changes |
|------|---------|
| `BaseLayout.astro` | Default `title`, `siteUrl`, `ogImage`, entire JSON-LD `schema` object, all OG meta tags, all Twitter meta tags — all derived from `brand` |
| `Nav.astro` | Agent name in header reads from `brand.agent.name` |
| `About.astro` | Image alt text reads from `brand.agent.name` |
| `Contact.astro` | Phone, email, and footer copyright name read from `brand.contact` and `brand.agent` |
| `Hero.astro` | No change — tagline is marketing copy, not config |

### Documentation: `docs/THEMING.md`

Markdown file covering:
1. Overview of what the theming system controls
2. How to edit `brand.ts` (copy from `brand.example.ts`)
3. How to run `npm run theme` to regenerate CSS tokens
4. How to customize fonts (what to install/change in Google Fonts link)
5. How to rebuild and deploy

### GitHub Actions

Assess whether `.github/workflows/deploy.yml` needs a `npm run theme` step before build. Since `theme-tokens.css` is committed to git, the workflow should not need changes — but will verify during implementation and add the step if needed for safety.

## Files Created

- `src/config/brand.ts` — live brand config (current values)
- `src/config/brand.example.ts` — starter template
- `scripts/generate-theme.ts` — CSS token generator
- `src/styles/theme-tokens.css` — generated CSS (committed)
- `docs/THEMING.md` — theming instructions

## Files Modified

- `src/styles/global.css` — replace inline `@theme` with `@import "./theme-tokens.css"`
- `src/layouts/BaseLayout.astro` — import brand config, replace all hardcoded values
- `src/components/Nav.astro` — import brand config for agent name
- `src/components/About.astro` — import brand config for alt text
- `src/components/Contact.astro` — import brand config for phone/email
- `package.json` — add `"theme"` script and `tsx` dev dependency

## Testing Strategy

- Run `npm run theme` and verify `theme-tokens.css` matches expected output
- Run `npm run build` and verify zero errors
- Visual check that the site looks identical before and after (same values, just centralized)
- Edit one config value (e.g., accent color), regenerate, rebuild, verify it propagates
