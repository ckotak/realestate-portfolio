# SCRUM-5: Headshot & OG Image Fix Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the "CK" placeholder in the About section with a real headshot (placeholder for now) using Astro's `<Picture />` component, and fix iMessage/social sharing by adding the missing `og:image:type` meta tag.

**Architecture:** Create a placeholder PNG in `src/assets/` using `sharp` (already available via Astro's dependencies). Update `About.astro` to import and render the image with Astro's `<Picture />` component. Add one meta tag to `BaseLayout.astro`. Work happens on a feature branch.

**Tech Stack:** Astro 5.2, Tailwind CSS v4, `sharp` (Node.js image library, bundled with Astro), GitHub Pages deployment.

---

## Chunk 1: Branch Setup

**Files:**
- No file changes — git operations only

- [ ] **Step 1: Create feature branch**

```bash
git checkout -b feat/scrum-5-headshot-og-image
```

Expected: switched to new branch `feat/scrum-5-headshot-og-image`

---

## Chunk 2: Create Placeholder Headshot Image

**Files:**
- Create: `src/assets/headshot.png`

> **Note:** `src/assets/` does not exist yet — it will be created when the file is written. Astro automatically processes images imported from `src/` through its image optimization pipeline. This directory is the correct location for build-time image optimization; `public/` would bypass optimization.

- [ ] **Step 1: Create the placeholder image using Node + sharp**

Run this one-liner from the project root. It creates a 900×1200px (3:4 portrait) dark-gradient PNG with "CK" centered in gold, matching the current placeholder div appearance:

```bash
node -e "
const sharp = require('sharp');
const width = 900, height = 1200;
// Build SVG overlay with gradient + text
const svg = \`<svg width='\${width}' height='\${height}' xmlns='http://www.w3.org/2000/svg'>
  <defs>
    <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0%' stop-color='#1a1a1a'/>
      <stop offset='100%' stop-color='#0f0f0f'/>
    </linearGradient>
  </defs>
  <rect width='100%' height='100%' fill='url(#g)'/>
  <text x='50%' y='50%' font-family='Arial Black,sans-serif' font-size='200'
        fill='#C9A84C' fill-opacity='0.3' text-anchor='middle'
        dominant-baseline='central' font-weight='900'>CK</text>
</svg>\`;
sharp(Buffer.from(svg)).png().toFile('src/assets/headshot.png')
  .then(() => console.log('Created src/assets/headshot.png'))
  .catch(e => { console.error(e); process.exit(1); });
"
```

Expected output: `Created src/assets/headshot.png`

- [ ] **Step 2: Verify the file was created and is a valid PNG**

```bash
file src/assets/headshot.png && ls -lh src/assets/headshot.png
```

Expected: output contains `PNG image data, 900 x 1200` and file size ~10–80KB.

- [ ] **Step 3: Commit the placeholder image**

```bash
git add src/assets/headshot.png
git commit -m "feat(scrum-5): add placeholder headshot to src/assets"
```

---

## Chunk 3: Update About.astro

**Files:**
- Modify: `src/components/About.astro`

Current state: The photo column contains a gradient div with "CK" initials and a gold offset border decoration. The `<Picture />` component replaces the inner gradient div only — the outer container and gold border decoration are unchanged.

- [ ] **Step 1: Open `src/components/About.astro` and read the current photo column markup**

Confirm you see this block (lines 13–22):

```astro
<!-- Photo column -->
<div class="reveal">
  <div class="aspect-[3/4] bg-lightgray relative overflow-hidden">
    <!-- Replace with actual headshot -->
    <div class="w-full h-full bg-gradient-to-br from-charcoal-90 to-charcoal flex items-center justify-center">
      <span class="font-display text-6xl text-gold/30">CK</span>
    </div>
    <!-- Gold accent border -->
    <div class="absolute inset-0 border-4 border-gold translate-x-4 translate-y-4 -z-10"></div>
  </div>
</div>
```

- [ ] **Step 2: Add the import statements to the frontmatter**

In the `---` frontmatter block (after the existing imports), add:

```astro
import { Picture } from 'astro:assets';
import headshot from '../assets/headshot.png';
```

Full updated frontmatter:

```astro
---
import { getEntry } from 'astro:content';
import { Picture } from 'astro:assets';
import headshot from '../assets/headshot.png';

const entry = await getEntry('about', 'bio');
const { heading, stats } = entry.data;
const { Content } = await entry.render();
---
```

- [ ] **Step 3: Replace the gradient div with `<Picture />`**

Replace the inner gradient div (the `<!-- Replace with actual headshot -->` comment and the div below it) with the `<Picture />` component. Leave the outer container and gold border decoration untouched.

Before (lines 15–18):
```astro
    <!-- Replace with actual headshot -->
    <div class="w-full h-full bg-gradient-to-br from-charcoal-90 to-charcoal flex items-center justify-center">
      <span class="font-display text-6xl text-gold/30">CK</span>
    </div>
```

After:
```astro
    <Picture
      src={headshot}
      formats={['webp', 'jpeg']}
      widths={[400, 600, 800]}
      sizes="(max-width: 768px) 100vw, min(576px, 50vw)"
      alt="Chetan Kotak, Real Estate Agent"
      class="w-full h-full object-cover"
      loading="eager"
    />
```

Full updated photo column for reference:
```astro
<!-- Photo column -->
<div class="reveal">
  <div class="aspect-[3/4] bg-lightgray relative overflow-hidden">
    <Picture
      src={headshot}
      formats={['webp', 'jpeg']}
      widths={[400, 600, 800]}
      sizes="(max-width: 768px) 100vw, min(576px, 50vw)"
      alt="Chetan Kotak, Real Estate Agent"
      class="w-full h-full object-cover"
      loading="eager"
    />
    <!-- Gold accent border -->
    <div class="absolute inset-0 border-4 border-gold translate-x-4 translate-y-4 -z-10"></div>
  </div>
</div>
```

- [ ] **Step 4: Run the dev build to verify no errors**

```bash
npm run build 2>&1 | tail -20
```

Expected: build completes with no errors. Look for lines like:
```
dist/index.html  X.XX kB
```
No `[ERROR]` lines should appear.

- [ ] **Step 5: Commit**

```bash
git add src/components/About.astro
git commit -m "feat(scrum-5): replace CK placeholder with Picture component in About"
```

---

## Chunk 4: Fix OG Image Meta Tag

**Files:**
- Modify: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Open `src/layouts/BaseLayout.astro` and locate the OG image tags**

Find this block (around line 100–103):

```html
<meta property="og:image" content={ogImage} />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="Chetan Kotak — Licensed Real Estate Agent" />
```

- [ ] **Step 2: Add `og:image:type` after `og:image:height`**

Insert one line so the block reads:

```html
<meta property="og:image" content={ogImage} />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:type" content="image/png" />
<meta property="og:image:alt" content="Chetan Kotak — Licensed Real Estate Agent" />
```

- [ ] **Step 3: Run the build to verify no errors**

```bash
npm run build 2>&1 | tail -10
```

Expected: clean build, no errors.

- [ ] **Step 4: Verify the tag appears in the built HTML**

```bash
grep -n "og:image:type" dist/index.html
```

Expected output:
```
N:  <meta property="og:image:type" content="image/png">
```

- [ ] **Step 5: Commit**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "fix(scrum-5): add og:image:type meta tag for iMessage social preview"
```

---

## Chunk 5: Final Verification & PR

**Files:**
- No file changes — verification and PR creation only

- [ ] **Step 1: Run a clean production build**

```bash
npm run build
```

Expected: exits with code 0, no errors or warnings about images.

- [ ] **Step 2: Confirm image variants were generated**

```bash
ls dist/_astro/ | grep headshot
```

Expected: multiple files like `headshot.HASH_400.webp`, `headshot.HASH_600.webp`, `headshot.HASH_800.webp`, and JPEG equivalents.

- [ ] **Step 3: Confirm OG image type tag in built output**

```bash
grep "og:image" dist/index.html
```

Expected: five lines — `og:image`, `og:image:width`, `og:image:height`, `og:image:type`, `og:image:alt`.

- [ ] **Step 4: Create pull request**

```bash
gh pr create \
  --title "feat(SCRUM-5): add headshot placeholder and fix OG image type" \
  --body "$(cat <<'EOF'
## Summary

- Replaces the 'CK' gradient placeholder in the About section with a proper `<Picture />` component pointing to `src/assets/headshot.png`
- Creates a styled placeholder PNG (900×1200, dark gradient + CK initials) that can be swapped for a real headshot by replacing the file and rebuilding
- Adds `og:image:type: image/png` meta tag to fix iMessage/social sharing previews

## Test plan

- [ ] Run `npm run build` — should complete with no errors
- [ ] Check `dist/_astro/` — confirm headshot WebP and JPEG variants were generated at 400/600/800px widths
- [ ] Check `dist/index.html` — confirm all five `og:image*` meta tags are present
- [ ] Open `npm run preview` — confirm About section shows the placeholder image with gold border decoration intact
- [ ] After deploy: share the site URL in a new iMessage thread — confirm preview card shows the OG image
- [ ] When real headshot is available: replace `src/assets/headshot.png`, rebuild, confirm new image renders

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

Expected: PR URL printed to terminal.
