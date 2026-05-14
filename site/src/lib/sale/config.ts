import type { SaleConfig } from './types';

function readEnv(name: keyof ImportMetaEnv): string {
  const value = import.meta.env[name];

  if (!value || value.trim().length === 0) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value.trim();
}

export function getSaleConfig(): SaleConfig {
  return {
    routeSlug: readEnv('SALE_ROUTE_SLUG'),
    adminEmail: readEnv('SALE_ADMIN_EMAIL').toLowerCase(),
    venmoHandle: import.meta.env.SALE_VENMO_HANDLE?.trim() || null,
    title: import.meta.env.SALE_TITLE?.trim() || 'mattslist',
    tagline: import.meta.env.SALE_TAGLINE?.trim() || 'Moving Sale',
  };
}
