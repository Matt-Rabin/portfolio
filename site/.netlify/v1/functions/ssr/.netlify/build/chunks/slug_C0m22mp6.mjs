import { g as getSaleConfig } from './config_BSMUbtlk.mjs';

function isSaleSlug(slug) {
  return Boolean(slug) && slug === getSaleConfig().routeSlug;
}

export { isSaleSlug as i };
