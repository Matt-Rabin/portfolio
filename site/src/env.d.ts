/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_SUPABASE_URL: string;
  readonly PUBLIC_SUPABASE_ANON_KEY: string;
  readonly SUPABASE_SERVICE_ROLE_KEY?: string;
  readonly SUPABASE_SECRET_KEY?: string;
  readonly SALE_ROUTE_SLUG: string;
  readonly SALE_ADMIN_PASSWORD: string;
  readonly SALE_ADMIN_SESSION_SECRET?: string;
  readonly SALE_VENMO_HANDLE?: string;
  readonly SALE_TITLE?: string;
  readonly SALE_TAGLINE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
