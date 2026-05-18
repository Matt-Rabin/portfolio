import { getSaleConfig } from './config';

export function getSalePublicPath(): string {
  return `/${getSaleConfig().routeSlug}`;
}

export function getSaleAdminPath(): string {
  const config = getSaleConfig();
  return config.routeSlug === 'mattslist' ? '/mattslist-admin' : `/${config.routeSlug}/admin`;
}

export function getSaleAuthCallbackPath(): string {
  const config = getSaleConfig();
  return config.routeSlug === 'mattslist'
    ? '/mattslist-auth/callback'
    : `/${config.routeSlug}/auth/callback`;
}

export function getSaleAdminSignInPath(): string {
  const config = getSaleConfig();
  return config.routeSlug === 'mattslist'
    ? '/api/mattslist-admin/sign-in'
    : `/api/sale/${config.routeSlug}/auth/sign-in`;
}

export function getSaleAdminSignOutPath(): string {
  const config = getSaleConfig();
  return config.routeSlug === 'mattslist'
    ? '/api/mattslist-admin/sign-out'
    : `/api/sale/${config.routeSlug}/auth/sign-out`;
}
