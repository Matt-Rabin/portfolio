# Portfolio Site

Astro portfolio with an unlinked moving-sale microsite backed by Supabase.

## Commands

Run all commands from `site/`:

```sh
npm install
npm run dev
npm run build
npm run preview
```

## Hidden Sale Route

The sale page is served from a dynamic top-level route that only renders when the incoming slug
matches `SALE_ROUTE_SLUG`. Nothing in the main portfolio nav or footer links to it.

- Public route: `/<SALE_ROUTE_SLUG>`
- Admin route: `/<SALE_ROUTE_SLUG>/admin`
- Public claim API: `/api/sale/<SALE_ROUTE_SLUG>/claim`

## Required Environment Variables

Copy `.env.example` to `.env` locally, then fill in the values:

```env
PUBLIC_SUPABASE_URL=
PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SECRET_KEY=
SALE_ROUTE_SLUG=
SALE_ADMIN_PASSWORD=
# SALE_ADMIN_SESSION_SECRET=
SALE_VENMO_HANDLE=
# Optional:
# SALE_TITLE=
# SALE_TAGLINE=
```

Notes:

- `SUPABASE_SECRET_KEY` can be replaced with `SUPABASE_SERVICE_ROLE_KEY` if that is what your
  project currently uses.
- `SALE_ADMIN_PASSWORD` is the single admin password for the hidden sale page. It is checked
  server-side and stored in an `HttpOnly` signed session cookie after login.
- `SALE_ADMIN_SESSION_SECRET` is optional. If omitted, the app signs the admin session cookie
  with `SUPABASE_SECRET_KEY` or `SUPABASE_SERVICE_ROLE_KEY`.
- `SALE_ROUTE_SLUG` is the hidden direct URL path segment. For your production setup, use `mattslist`.
- `SALE_TITLE` and `SALE_TAGLINE` are optional overrides. If you omit them, the site already defaults
  to `mattslist` and `Moving Sale`.

## Supabase Setup

Run the SQL in [supabase/sale-schema.sql](/C:/Users/matth/OneDrive/Documents/GitHub/portfolio/site/supabase/sale-schema.sql:1)
against your Supabase project before using the sale route.

If you use the Supabase CLI later, the same schema is also stored as a migration at
[20260514_create_sale_tables.sql](/C:/Users/matth/OneDrive/Documents/GitHub/portfolio/site/supabase/migrations/20260514_create_sale_tables.sql:1).

That schema creates:

- `sale_listings`
- `sale_claims`
- `claim_sale_listing(...)` for atomic first-claim-wins writes

## Secrets And Deployment

Do not commit `.env` or any real keys to the repository.

- `.env.example` is safe to commit because it contains placeholders only.
- `PUBLIC_SUPABASE_ANON_KEY` is expected to be exposed to the browser.
- `SUPABASE_SECRET_KEY` must exist only in your hosting provider's server-side environment settings.
- Your hosting provider injects env vars during build/runtime; they do not need to live in the repo.

Typical deployment flow:

1. Keep real values only in local `.env` and in your host's environment-variable UI.
2. Add the same variables in production on the host.
3. Redeploy after adding them.
4. Never paste `SUPABASE_SECRET_KEY` into source files, client scripts, markdown examples, or committed config.

## Rendering Model

The portfolio pages remain prerendered. The moving-sale pages and APIs opt into on-demand server
rendering through `@astrojs/netlify`, which is required for the server-side admin password check,
signed admin session cookie, and protected claim data.
