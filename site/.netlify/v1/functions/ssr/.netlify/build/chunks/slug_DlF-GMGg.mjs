import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';

const __vite_import_meta_env__ = {"ASSETS_PREFIX": undefined, "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "SITE": undefined, "SSR": true};
function readEnv(name) {
  const value = Object.assign(__vite_import_meta_env__, {})[name];
  if (!value || value.trim().length === 0) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value.trim();
}
function getSaleConfig() {
  return {
    routeSlug: readEnv("SALE_ROUTE_SLUG"),
    adminEmail: readEnv("SALE_ADMIN_EMAIL").toLowerCase(),
    venmoHandle: Object.assign(__vite_import_meta_env__, {}).SALE_VENMO_HANDLE?.trim() || null,
    title: Object.assign(__vite_import_meta_env__, {}).SALE_TITLE?.trim() || "mattslist",
    tagline: Object.assign(__vite_import_meta_env__, {}).SALE_TAGLINE?.trim() || "Moving Sale"
  };
}

function getProjectUrl() {
  {
    throw new Error("Missing required environment variable: PUBLIC_SUPABASE_URL");
  }
}
function getPublishableKey() {
  {
    throw new Error("Missing required environment variable: PUBLIC_SUPABASE_ANON_KEY");
  }
}
function getServiceKey() {
  {
    throw new Error(
      "Missing required environment variable: SUPABASE_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY"
    );
  }
}
function createSupabaseServerClient(cookies, request) {
  return createServerClient(getProjectUrl(), getPublishableKey(), {
    request,
    cookies: {
      getAll() {
        return cookies.getAll().map(({ name, value }) => ({ name, value }));
      },
      setAll(cookiesToSet) {
        for (const { name, value, options } of cookiesToSet) {
          cookies.set(name, value, options);
        }
      }
    }
  });
}
function createSupabaseAdminClient() {
  return createClient(getProjectUrl(), getServiceKey(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}
async function getSaleAdminUser(context) {
  const supabase = createSupabaseServerClient(context.cookies, context.request);
  const {
    data: { user },
    error
  } = await supabase.auth.getUser();
  if (error) {
    return null;
  }
  const config = getSaleConfig();
  if (!user?.email || user.email.toLowerCase() !== config.adminEmail) {
    return null;
  }
  return user;
}

function isSaleSlug(slug) {
  return Boolean(slug) && slug === getSaleConfig().routeSlug;
}

export { getSaleAdminUser as a, createSupabaseAdminClient as b, createSupabaseServerClient as c, getSaleConfig as g, isSaleSlug as i };
