import { g as getSaleConfig } from './supabase_D70iw1RZ.mjs';

function isSaleSlug(slug) {
  return Boolean(slug) && slug === getSaleConfig().routeSlug;
}

export { isSaleSlug as i };
