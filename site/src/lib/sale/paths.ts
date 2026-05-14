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
