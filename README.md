# realestate-portfolio

Single-page real estate portfolio site built with Astro, Tailwind CSS v4, and TypeScript.

## Getting Started

```bash
npm install
npm run dev        # Dev server on http://localhost:4321
npm run build      # Production build to dist/
npm run preview    # Preview production build
npm run theme      # Regenerate CSS tokens from brand config
```

## CMS Admin Interface

The site includes a browser-based content manager powered by [Sveltia CMS](https://github.com/sveltia/sveltia-cms). Once configured, the admin UI is accessible at `/realestate-portfolio/admin/`.

### What Can Be Edited via CMS

- **Listings** — create, edit, delete property listings with all fields
- **About** — edit bio heading, stats, and markdown body
- **Why Me** — create, edit, delete feature/value proposition cards
- **Brand Config** — agent info, contact details, social links, theme colors and fonts

### Setup (One-Time)

The CMS requires a GitHub OAuth App and a Cloudflare Worker to handle authentication.

#### 1. Register a GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Fill in:
   - **Application name:** `Sveltia CMS` (or any name)
   - **Homepage URL:** `https://chetankotak.github.io/realestate-portfolio/admin/`
   - **Authorization callback URL:** `https://sveltia-cms-auth.<your-account>.workers.dev/callback`
4. Click **Register application**
5. Note the **Client ID** and generate a **Client Secret**

#### 2. Deploy the Cloudflare Worker

The OAuth proxy worker lives in `admin/worker/`. It exchanges GitHub OAuth codes for access tokens.

1. Install [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/): `npm install -g wrangler`
2. Authenticate: `wrangler login`
3. Set the OAuth secrets:
   ```bash
   cd admin/worker
   npx wrangler secret put GITHUB_CLIENT_ID    # Paste the Client ID from step 1
   npx wrangler secret put GITHUB_CLIENT_SECRET # Paste the Client Secret from step 1
   ```
4. Deploy the worker:
   ```bash
   npx wrangler deploy
   ```
5. Note the deployed worker URL (e.g., `https://sveltia-cms-auth.<account>.workers.dev`)

Alternatively, add a `CLOUDFLARE_API_TOKEN` secret to the GitHub repo and use the **Deploy Auth Worker** workflow (Actions > Deploy Auth Worker > Run workflow).

#### 3. Update CMS Config

Edit `public/admin/config.yml` and replace the `base_url` placeholder:

```yaml
backend:
  name: github
  repo: chetankotak/realestate-portfolio
  branch: main
  base_url: https://sveltia-cms-auth.<your-account>.workers.dev  # <-- your actual Worker URL
```

#### 4. Add Collaborators

Any user who needs CMS access must be added as a **collaborator** on the GitHub repo with write access.

### How It Works

1. User navigates to `/realestate-portfolio/admin/` and clicks "Sign in with GitHub"
2. OAuth popup opens, user authorizes, popup closes
3. CMS dashboard loads — user can edit content
4. Saving in the CMS commits changes directly to the `main` branch via the GitHub API
5. The commit triggers GitHub Actions, which rebuilds and deploys the site
6. Theme color/font changes are automatically regenerated during the build

### Rollback

If a bad edit is published, revert the commit on GitHub (via UI or CLI). GitHub Actions will rebuild and deploy the previous state.
