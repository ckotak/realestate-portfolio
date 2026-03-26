# Admin Interface Design

**Date:** 2026-03-25
**Status:** Draft
**Goal:** Add a CMS admin interface to the portfolio site so a non-technical user (the real estate agent) can manage all content and brand configuration via a browser.

## Architecture Overview

```
┌─────────────────────────────────────────────────┐
│              GitHub Pages                        │
│                                                  │
│  /realestate-portfolio/        (Astro site)      │
│  /realestate-portfolio/admin/  (Sveltia CMS)     │
└──────────────┬───────────────────────────────────┘
               │ GitHub API (read/write files)
               ▼
┌──────────────────────────┐
│    GitHub Repository     │
│  src/content/listings/   │
│  src/content/about/      │
│  src/content/whyme/      │
│  src/config/brand.json   │
└──────────┬───────────────┘
           │ push to main triggers
           ▼
┌──────────────────────────┐
│    GitHub Actions         │
│  Build Astro → Deploy    │
└──────────────────────────┘

┌──────────────────────────┐
│  Cloudflare Worker       │
│  (OAuth proxy only)      │
└──────────────────────────┘
```

- The admin UI is two static files (`index.html` + `config.yml`) in `public/admin/`, deployed alongside the main site on GitHub Pages.
- Sveltia CMS loads from a CDN and communicates directly with the GitHub API to read/write content files.
- A Cloudflare Worker (~50 lines, free tier) handles the GitHub OAuth token exchange. No content passes through it.
- Commits from the CMS trigger the existing GitHub Actions deploy pipeline. No changes to the build/deploy workflow.
- GitHub's PKCE support for SPAs is on their roadmap. When it ships, Sveltia CMS will support fully client-side auth and the Cloudflare Worker can be retired.

## Technology Choice: Sveltia CMS

Sveltia CMS is an actively maintained, open-source, drop-in replacement for Decap/Netlify CMS. It was chosen because:

- Purpose-built for git-backed static sites
- Declarative config maps directly to Astro content collections
- Rich editing UI (markdown editor, image upload, list/object widgets)
- Provides a Cloudflare Worker template (`sveltia-cms-auth`) for OAuth
- Future-proofed: when GitHub ships SPA PKCE, the OAuth proxy becomes unnecessary

## Authentication

### Flow

1. Chetan navigates to `chetankotak.github.io/realestate-portfolio/admin/`
2. Clicks "Sign in with GitHub"
3. OAuth popup opens → GitHub login/authorize → popup closes via `postMessage`
4. CMS dashboard loads with full access

### Setup (one-time)

1. Register a GitHub OAuth App at `github.com/settings/developers`
   - Callback URL: `https://<worker-name>.<account>.workers.dev/callback`
2. Deploy `sveltia-cms-auth` Cloudflare Worker with OAuth client ID + secret
3. Configure `base_url` in `config.yml` to point to the Worker URL
4. Add Chetan as a collaborator on the repo (write access)

### Session

- Token stored in `localStorage` — persists until browser data is cleared or token expires
- Access control is GitHub repo permissions — only collaborators with write access can commit

## Content Collection Mapping

### Listings — `folder` collection

- Path: `src/content/listings/*.md`
- Fields (must match all fields in `src/content/config.ts` to prevent data loss on save):
  - `address` — string
  - `price` — string
  - `beds` — number
  - `baths` — number
  - `sqft` — number
  - `status` — select widget: "Active", "Under Contract", "Sold"
  - `order` — number
  - `photo` — file widget (media folder: `public/listings/`, public folder: `/realestate-portfolio/listings/`)
  - `description` — string (textarea)
  - `url` — string (pattern-validated as URL)
  - `gallery` — list widget of strings (image paths)
  - `propertyType` — string
  - `yearBuilt` — number
  - `lotSize` — string
  - `garages` — number
  - `hoa` — string
  - `highlights` — list widget of strings
  - `mlsNumber` — string
- All optional fields must be declared in `config.yml` even if hidden in the UI, to prevent Sveltia from stripping them on save.
- Slug: auto-generated kebab-case from address
- Create/edit/delete supported
- Image uploads: accepts SVG, PNG, JPG, WebP. Existing listing images are SVGs; components must handle mixed formats.

### About — `file` collection

- Path: `src/content/about/bio.md`
- Fields:
  - `heading` — string
  - `stats` — list widget, each item has `number` (string) and `label` (string)
- Body: markdown editor
- Edit only (no create/delete)

### WhyMe — `folder` collection

- Path: `src/content/whyme/*.md`
- Fields:
  - `icon` — string (emoji)
  - `title` — string
  - `body` — string (textarea)
  - `order` — number
- Create/edit/delete supported

### Brand Config — `file` collection

- Path: `src/config/brand.json` (colocated with existing `brand.ts`)
- Sections (nested object fields):
  - **Agent:** name, title, DRE number
  - **Contact:** phone, phoneRaw, email
  - **Social:** twitter handle, twitter URL, LinkedIn URL
  - **Location:** city, region, country, area served
  - **Site:** name, URL, OG image path, twitter card type
  - **Theme colors:** primary, primaryLight, accent, accentHover, background, backgroundAlt
  - **Theme fonts:** display, body
- Edit only (no create/delete)
- Note: changing font names requires the font files/imports to already exist in the codebase. The CMS can change the string but adding a new font still requires a code change.

### Out of Scope

- Editorial workflow (draft → review → publish) — unnecessary for a single-user site
- Creating new content collection types — requires code changes to schemas

## Brand Config Refactor

Currently `src/config/brand.ts` contains both the TypeScript interface and the data. To make it CMS-editable:

1. Extract data to `src/config/brand.json` (colocated with existing `brand.ts`)
2. Keep the `BrandConfig` interface for type safety. Simplify `brand.ts` to:

```ts
import type { BrandConfig } from './brand.types';
import brandData from './brand.json';
export type { BrandConfig };
export const brand: BrandConfig = brandData;
```

3. Extract the interface to `src/config/brand.types.ts` so the JSON import is cast against it. This preserves union types like `"summary" | "summary_large_image"` and catches invalid CMS edits at build time.
4. All existing imports of `brand` continue to work unchanged.
5. Remove or update `src/config/brand.example.ts` to reference the new JSON format.

### Theme Token Generation

The `scripts/generate-theme.ts` script generates `src/styles/theme-tokens.css` from brand config. After the refactor:

- The script continues to work as-is since it imports from `src/config/brand.ts`, which re-exports the JSON data.
- The `npm run theme` command must be run after brand config changes to regenerate CSS tokens.
- Consider adding `npm run theme` as a step in the GitHub Actions build workflow so that CMS edits to theme colors automatically regenerate the CSS tokens during deploy. Without this, color/font changes made via the CMS will not take effect.

## File Structure

### New files in the main repo

```
public/admin/
  index.html              ← loads Sveltia CMS from CDN
  config.yml              ← collection definitions, auth config
admin/worker/
  worker.js               ← sveltia-cms-auth OAuth proxy
  wrangler.toml           ← Cloudflare Worker config
src/config/
  brand.json              ← extracted from brand.ts
  brand.types.ts          ← BrandConfig interface (extracted from brand.ts)
.github/workflows/
  deploy-auth-worker.yml  ← manual workflow to deploy the Worker
```

### Modified files

```
src/config/brand.ts       ← simplified to import from brand.json
```

## GitHub Actions: Worker Deployment

A separate manual workflow deploys the Cloudflare Worker:

```yaml
# .github/workflows/deploy-auth-worker.yml
name: Deploy Auth Worker
on: workflow_dispatch

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          workingDirectory: admin/worker
```

### Required GitHub repo secrets

- `CLOUDFLARE_API_TOKEN` — Cloudflare API token with Workers permissions
- OAuth client ID and secret are configured as Cloudflare Worker secrets (via `wrangler secret put`), not GitHub secrets

## What Is and Isn't CMS-Editable

### Editable via CMS

- All content collections (listings, about, whyme)
- Brand configuration (agent info, contact, social, location, theme colors/fonts)
- Listing images (upload via CMS media library)

### Not editable via CMS (code-only)

- Component layout and structure
- Tailwind configuration
- Navigation links
- Deployment configuration
- Adding new font families (requires code change for imports)
- Content collection schemas (adding/removing fields)

## Rollback

If a bad edit is published:

1. Revert the commit on GitHub (via UI or CLI)
2. GitHub Actions rebuilds and deploys the previous state
3. CMS reflects the reverted state on next page load (reads from repo)

No additional rollback mechanism needed — git history is the safety net.

## Deploy Flow (unchanged)

The existing pipeline is untouched:

1. CMS commits a file change to `main`
2. GitHub Actions triggers (`push` to `main`)
3. Astro builds the site (now reading from `brand.json` instead of `brand.ts` data)
4. Deploys to GitHub Pages

The admin page (`public/admin/`) is copied as-is to the output — no Astro processing needed.

**Build workflow update:** Add `npm run theme` before the Astro build step so that CMS edits to theme colors/fonts regenerate the CSS tokens automatically.

## Media Configuration

Sveltia CMS `config.yml` must configure media paths to account for the `/realestate-portfolio` base path:

- `media_folder`: `public/listings` — where files are stored in the repo
- `public_folder`: `/realestate-portfolio/listings` — the URL prefix written into frontmatter

This ensures photo paths in frontmatter match how Astro components resolve them at runtime.

## Build Failure Handling

If a CMS edit creates content that fails Zod validation (e.g., missing required field, malformed URL), the GitHub Actions build will fail silently from the CMS user's perspective. Mitigations:

- Enable GitHub Actions failure email notifications for the repo
- Consider adding a simple status badge or deploy-status check on the admin page in a future iteration
- The CMS `url` field should use a pattern validator in `config.yml` to catch malformed URLs before commit

## Security Considerations

- GitHub repo permissions serve as the sole access control layer
- The Cloudflare Worker stores the OAuth client secret as an encrypted environment variable, never exposed to the browser
- If the GitHub OAuth token were compromised, an attacker could commit to the repo. Consider enabling branch protection on `main` (require status checks) as an additional safeguard
