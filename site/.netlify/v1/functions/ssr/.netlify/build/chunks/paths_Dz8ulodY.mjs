import { g as getSaleConfig } from './config_BSMUbtlk.mjs';

function getSaleAdminPath() {
  const config = getSaleConfig();
  return config.routeSlug === "mattslist" ? "/mattslist-admin" : `/${config.routeSlug}/admin`;
}

export { getSaleAdminPath as g };
