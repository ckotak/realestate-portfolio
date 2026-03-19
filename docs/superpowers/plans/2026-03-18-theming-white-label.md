# SCRUM-8: Theming & White-Label System Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Centralize all brand tokens into `src/config/brand.ts` so the site can be re-branded by editing one file, running `npm run theme`, and rebuilding.

**Architecture:** A TypeScript config file defines all brand values (identity, contact, theme colors/fonts). A generator script converts theme tokens into a CSS file that Tailwind v4's `@theme` consumes. All components import the config instead of hardcoding brand values.

**Tech Stack:** TypeScript, Astro 5.2, Tailwind CSS v4 (CSS-first), tsx (script runner)

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `src/config/brand.ts` | Create | Live brand config with BrandConfig type and current Chetan Kotak values |
| `src/config/brand.example.ts` | Create | Starter template with placeholder values and inline comments |
| `scripts/generate-theme.ts` | Create | Reads brand.ts, writes theme-tokens.css |
| `src/styles/theme-tokens.css` | Create (generated) | Tailwind v4 `@theme` block with CSS custom properties |
| `src/styles/global.css` | Modify | Replace inline `@theme` with `@import "./theme-tokens.css"` |
| `src/layouts/BaseLayout.astro` | Modify | Import brand config, replace all hardcoded identity/meta values |
| `src/components/Nav.astro` | Modify | Import brand config for agent name |
| `src/components/About.astro` | Modify | Import brand config for image alt text |
| `src/components/Contact.astro` | Modify | Import brand config for phone, email, copyright name |
| `package.json` | Modify | Add `"theme"` script, add `tsx` dev dependency |
| `docs/THEMING.md` | Create | Theming instructions documentation |

**No changes needed:**
- `src/components/Hero.astro` — tagline is marketing copy, not brand config (per spec non-goals)
- `.github/workflows/deploy.yml` — uses `withastro/action@v5` which runs `npm run build`; since `theme-tokens.css` is committed to git, no workflow changes needed
- `src/styles/theme-tokens.css` — generated file, do NOT add to `.gitignore` (must be committed so the site builds without running the generator)

---

### Task 1: Add tsx dev dependency and theme script

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install tsx as dev dependency**

Run: `npm install --save-dev tsx`

- [ ] **Step 2: Add theme script to package.json**

Add to the `"scripts"` section:

```json
"theme": "tsx scripts/generate-theme.ts"
```

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore(scrum-8): add tsx dev dependency and theme script"
```

---

### Task 2: Create brand config with BrandConfig type

**Files:**
- Create: `src/config/brand.ts`

- [ ] **Step 1: Create the brand config file**

```ts
/** Brand configuration — edit this file to re-brand the site. */

export interface BrandConfig {
  agent: {
    name: string;
    title: string;
    dreNumber: string;
  };
  contact: {
    phone: string;
    phoneRaw: string;
    email: string;
  };
  social: {
    twitter: string;
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
    name: string;
    url: string;
    ogImage: string;
    twitterCard: "summary" | "summary_large_image";
  };
  theme: {
    colors: {
      primary: string;
      primaryLight: string;
      accent: string;
      accentHover: string;
      background: string;
      backgroundAlt: string;
    };
    fonts: {
      display: string;
      body: string;
    };
  };
}

export const brand: BrandConfig = {
  agent: {
    name: "Chetan Kotak",
    title: "Licensed Real Estate Agent",
    dreNumber: "DRE #XXXXXXX",
  },
  contact: {
    phone: "+1 (415) 555-0100",
    phoneRaw: "+1-415-555-0100",
    email: "chetan@example.com",
  },
  social: {
    twitter: "@chetankotak",
    twitterUrl: "https://twitter.com/chetankotak",
    linkedinUrl: "https://linkedin.com/in/chetankotak",
  },
  location: {
    city: "San Francisco",
    region: "CA",
    country: "US",
    areaServed: "Bay Area, California",
  },
  site: {
    name: "Chetan Kotak Real Estate",
    url: "https://chetankotak.github.io/realestate-portfolio",
    ogImage: "/og-image.png",
    twitterCard: "summary_large_image",
  },
  theme: {
    colors: {
      primary: "#0f0f0f",
      primaryLight: "#1a1a1a",
      accent: "#C9A84C",
      accentHover: "#dbb96a",
      background: "#f9f9f7",
      backgroundAlt: "#f2f2f0",
    },
    fonts: {
      display: "'Bebas Neue', 'Arial Narrow', sans-serif",
      body: "'Inter', ui-sans-serif, system-ui, sans-serif",
    },
  },
};
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsx -e "import { brand } from './src/config/brand.ts'; console.log(brand.agent.name)"`
Expected: `Chetan Kotak`

- [ ] **Step 3: Commit**

```bash
git add src/config/brand.ts
git commit -m "feat(scrum-8): add brand config with BrandConfig type"
```

---

### Task 3: Create brand.example.ts starter template

**Files:**
- Create: `src/config/brand.example.ts`

- [ ] **Step 1: Create the example config**

```ts
/**
 * Brand configuration starter template.
 * Copy this file to brand.ts and fill in your values.
 */
import type { BrandConfig } from './brand';

export const brand: BrandConfig = {
  agent: {
    name: "Your Name",                    // Agent's full name
    title: "Licensed Real Estate Agent",  // Professional title
    dreNumber: "DRE #0000000",            // License number
  },
  contact: {
    phone: "+1 (555) 555-0000",           // Display format
    phoneRaw: "+1-555-555-0000",          // For tel: links and schema.org
    email: "you@example.com",
  },
  social: {
    twitter: "@yourhandle",
    twitterUrl: "https://twitter.com/yourhandle",
    linkedinUrl: "https://linkedin.com/in/yourprofile",
  },
  location: {
    city: "Your City",
    region: "ST",                          // Two-letter state/region code
    country: "US",
    areaServed: "Your Area, State",
  },
  site: {
    name: "Your Name Real Estate",         // og:site_name
    url: "https://yourdomain.com",         // Canonical URL (no trailing slash)
    ogImage: "/og-image.png",              // Path relative to site root
    twitterCard: "summary_large_image",
  },
  theme: {
    colors: {
      primary: "#0f0f0f",                  // Main dark background
      primaryLight: "#1a1a1a",             // Lighter dark variant
      accent: "#C9A84C",                   // Brand accent color
      accentHover: "#dbb96a",              // Accent hover state
      background: "#f9f9f7",               // Light background
      backgroundAlt: "#f2f2f0",            // Alternate light background
    },
    fonts: {
      display: "'Bebas Neue', 'Arial Narrow', sans-serif",  // Full CSS font-family for headings
      body: "'Inter', ui-sans-serif, system-ui, sans-serif", // Full CSS font-family for body
    },
  },
};
```

- [ ] **Step 2: Commit**

```bash
git add src/config/brand.example.ts
git commit -m "feat(scrum-8): add brand.example.ts starter template"
```

---

### Task 4: Create CSS token generator script

**Files:**
- Create: `scripts/generate-theme.ts`

- [ ] **Step 1: Create the generator script**

```ts
/**
 * Generates src/styles/theme-tokens.css from src/config/brand.ts.
 * Run: npm run theme
 */
import { writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { brand } from "../src/config/brand.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = resolve(__dirname, "../src/styles/theme-tokens.css");

const { colors, fonts } = brand.theme;

const css = `/* Auto-generated from src/config/brand.ts — do not edit manually */
@theme {
  /* Brand colors */
  --color-charcoal: ${colors.primary};
  --color-charcoal-90: ${colors.primaryLight};
  --color-gold: ${colors.accent};
  --color-gold-hover: ${colors.accentHover};
  --color-offwhite: ${colors.background};
  --color-lightgray: ${colors.backgroundAlt};

  /* Typography */
  --font-display: ${fonts.display};
  --font-body: ${fonts.body};

  /* Custom animation */
  --animate-fade-up: fade-up 0.6s ease-out forwards;
}
`;

writeFileSync(outPath, css);
console.log("✔ Generated", outPath);
```

- [ ] **Step 2: Run the generator and verify output**

Run: `npm run theme`
Expected: `✔ Generated .../src/styles/theme-tokens.css`

- [ ] **Step 3: Verify the generated file matches expected content**

Read `src/styles/theme-tokens.css` and confirm it contains the correct `@theme` block with all current brand values.

- [ ] **Step 4: Commit**

```bash
git add scripts/generate-theme.ts src/styles/theme-tokens.css
git commit -m "feat(scrum-8): add CSS token generator script"
```

---

### Task 5: Update global.css to import generated tokens

**Files:**
- Modify: `src/styles/global.css:1-19`

- [ ] **Step 1: Replace inline @theme with import**

Replace lines 1-19 of `global.css` (the `@import "tailwindcss"` line and the entire `@theme { ... }` block) with:

```css
@import "tailwindcss";
@import "./theme-tokens.css";
```

Keep the `@keyframes fade-up` block and everything below unchanged.

- [ ] **Step 2: Verify build still works**

Run: `npm run build`
Expected: Build completes with zero errors.

- [ ] **Step 3: Commit**

```bash
git add src/styles/global.css
git commit -m "refactor(scrum-8): use generated theme-tokens.css in global.css"
```

---

### Task 6: Update BaseLayout.astro to use brand config

**Files:**
- Modify: `src/layouts/BaseLayout.astro:1-57` (frontmatter and meta tags)

- [ ] **Step 1: Import brand config and replace all hardcoded values**

In the frontmatter (`---` block):
- Add: `import { brand } from '../config/brand';`
- Replace default title `"Chetan Kotak | Real Estate Agent"` with `` `${brand.agent.name} | ${brand.agent.title}` ``
- Replace `siteUrl` hardcoded string with `brand.site.url`
- Replace `ogImage` construction with `` `${brand.site.url}${brand.site.ogImage}` ``
- Replace the entire `schema` object to use `brand.agent`, `brand.contact`, `brand.social`, `brand.location`

In the HTML template:
- Replace `og:site_name` content with `brand.site.name`
- Replace `og:image:alt` content with `` `${brand.agent.name} — ${brand.agent.title}` ``
- Replace `twitter:card` content `"summary_large_image"` with `brand.site.twitterCard`
- Replace `twitter:site` and `twitter:creator` with `brand.social.twitter`
- Replace `twitter:image:alt` with `` `${brand.agent.name} — ${brand.agent.title}` ``

- [ ] **Step 2: Verify build works**

Run: `npm run build`
Expected: Zero errors.

- [ ] **Step 3: Commit**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "refactor(scrum-8): use brand config in BaseLayout meta/schema"
```

---

### Task 7: Update Nav.astro to use brand config

**Files:**
- Modify: `src/components/Nav.astro:1-14`

- [ ] **Step 1: Import brand and replace hardcoded name**

Add to frontmatter:
```ts
import { brand } from '../config/brand';
```

Replace line 14 (`CHETAN KOTAK`) with:
```astro
{brand.agent.name.toUpperCase()}
```

- [ ] **Step 2: Verify build works**

Run: `npm run build`
Expected: Zero errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/Nav.astro
git commit -m "refactor(scrum-8): use brand config for agent name in Nav"
```

---

### Task 8: Update About.astro to use brand config

**Files:**
- Modify: `src/components/About.astro:1-22`

- [ ] **Step 1: Import brand and replace hardcoded alt text**

Add to frontmatter:
```ts
import { brand } from '../config/brand';
```

Replace line 22 alt text `"Chetan Kotak, Real Estate Agent"` with:
```astro
alt={`${brand.agent.name}, ${brand.agent.title.replace('Licensed ', '')}`}
```

- [ ] **Step 2: Verify build works**

Run: `npm run build`
Expected: Zero errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/About.astro
git commit -m "refactor(scrum-8): use brand config for alt text in About"
```

---

### Task 9: Update Contact.astro to use brand config

**Files:**
- Modify: `src/components/Contact.astro:1-47`

- [ ] **Step 1: Import brand and replace hardcoded values**

Replace frontmatter:
```ts
---
import { brand } from '../config/brand';

const phone = brand.contact.phone;
const phoneRaw = brand.contact.phoneRaw;
const email = brand.contact.email;
---
```

Update the `tel:` link href (line 36) to use `phoneRaw` instead of `phone`:
```astro
<a href={`tel:${phoneRaw}`} class="hover:text-gold transition-colors">
```

Replace line 47 (`Chetan Kotak`) with:
```astro
{brand.agent.name}
```

- [ ] **Step 2: Verify build works**

Run: `npm run build`
Expected: Zero errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/Contact.astro
git commit -m "refactor(scrum-8): use brand config for contact info"
```

---

### Task 10: Create THEMING.md documentation

**Files:**
- Create: `docs/THEMING.md`

- [ ] **Step 1: Write theming instructions**

Cover:
1. **Overview** — what the theming system controls (identity, contact, colors, fonts)
2. **Quick Start** — copy `brand.example.ts` to `brand.ts`, fill in values
3. **Regenerate CSS tokens** — run `npm run theme` after changing theme colors/fonts
4. **Customize fonts** — update `theme.fonts` values, update Google Fonts link in `BaseLayout.astro`, install/replace `@fontsource` packages if applicable
5. **Build and deploy** — `npm run build` to verify, push to main to deploy
6. **File reference** — what each file does (`brand.ts`, `brand.example.ts`, `generate-theme.ts`, `theme-tokens.css`)

- [ ] **Step 2: Commit**

```bash
git add docs/THEMING.md
git commit -m "docs(scrum-8): add theming instructions"
```

---

### Task 11: Final verification

- [ ] **Step 1: Full build check**

Run: `npm run build`
Expected: Zero errors, zero warnings.

- [ ] **Step 2: Dev server visual check**

Run: `npm run dev` and verify the site looks identical to before — same colors, same name, same contact info. The values are just sourced from the config now.

- [ ] **Step 3: Token regeneration test**

Temporarily change `brand.theme.colors.accent` to `"#ff0000"`, run `npm run theme`, run `npm run build`, verify the gold accent is now red. Revert the change and regenerate.

- [ ] **Step 4: Verify brand.example.ts has no real values**

Read `brand.example.ts` and confirm all values are generic placeholders.
