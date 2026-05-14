import { getSaleConfig } from './config';

export function isSaleSlug(slug: string | undefined): boolean {
  return Boolean(slug) && slug === getSaleConfig().routeSlug;
}

export function assertSaleSlug(slug: string | undefined): void {
  if (!isSaleSlug(slug)) {
    throw new Error('Sale route not found');
  }
}
