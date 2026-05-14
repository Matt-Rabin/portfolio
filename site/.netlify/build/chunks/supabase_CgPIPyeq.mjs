import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';

function readEnv(name) {
  const value = process.env[name];
  if (!value || value.trim().length === 0) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value.trim();
}
function getSaleConfig() {
  return {
    routeSlug: readEnv("SALE_ROUTE_SLUG"),
    adminEmail: readEnv("SALE_ADMIN_EMAIL").toLowerCase(),
    venmoHandle: process.env.SALE_VENMO_HANDLE?.trim() || null,
    title: process.env.SALE_TITLE?.trim() || "mattslist",
    tagline: process.env.SALE_TAGLINE?.trim() || "Moving Sale"
  };
}

function readServerEnv(name) {
  const value = process.env[name];
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : void 0;
}
function getProjectUrl() {
  const value = readServerEnv("PUBLIC_SUPABASE_URL");
  if (!value) {
    throw new Error("Missing required environment variable: PUBLIC_SUPABASE_URL");
  }
  return value;
}
function getPublishableKey() {
  const value = readServerEnv("PUBLIC_SUPABASE_ANON_KEY");
  if (!value) {
    throw new Error("Missing required environment variable: PUBLIC_SUPABASE_ANON_KEY");
  }
  return value;
}
function getServiceKey() {
  const value = readServerEnv("SUPABASE_SECRET_KEY") || readServerEnv("SUPABASE_SERVICE_ROLE_KEY");
  if (!value) {
    throw new Error(
      "Missing required environment variable: SUPABASE_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY"
    );
  }
  return value;
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

export { getSaleAdminUser as a, createSupabaseAdminClient as b, createSupabaseServerClient as c, getSaleConfig as g };
