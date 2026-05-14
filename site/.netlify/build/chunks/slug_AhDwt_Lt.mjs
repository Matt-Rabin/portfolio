import { g as getSaleConfig } from './supabase_CgPIPyeq.mjs';

function isSaleSlug(slug) {
  return Boolean(slug) && slug === getSaleConfig().routeSlug;
}

export { isSaleSlug as i };
