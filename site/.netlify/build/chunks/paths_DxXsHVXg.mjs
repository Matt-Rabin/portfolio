import { g as getSaleConfig } from './supabase_D70iw1RZ.mjs';

function getSaleAdminPath() {
  const config = getSaleConfig();
  return config.routeSlug === "mattslist" ? "/mattslist-admin" : `/${config.routeSlug}/admin`;
}
function getSaleAuthCallbackPath() {
  const config = getSaleConfig();
  return config.routeSlug === "mattslist" ? "/mattslist-auth/callback" : `/${config.routeSlug}/auth/callback`;
}

export { getSaleAuthCallbackPath as a, getSaleAdminPath as g };
