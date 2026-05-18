import { g as getSaleConfig } from './config_BSMUbtlk.mjs';

function getSaleAdminPath() {
  const config = getSaleConfig();
  return config.routeSlug === "mattslist" ? "/mattslist-admin" : `/${config.routeSlug}/admin`;
}
function getSaleAdminSignInPath() {
  const config = getSaleConfig();
  return config.routeSlug === "mattslist" ? "/mattslist-login" : `/api/sale/${config.routeSlug}/auth/sign-in`;
}
function getSaleAdminSignOutPath() {
  const config = getSaleConfig();
  return config.routeSlug === "mattslist" ? "/mattslist-logout" : `/api/sale/${config.routeSlug}/auth/sign-out`;
}

export { getSaleAdminSignInPath as a, getSaleAdminSignOutPath as b, getSaleAdminPath as g };
