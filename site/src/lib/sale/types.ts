export const SALE_CATEGORIES = [
  'Furniture',
  'Electronics',
  'Kitchen',
  'Clothing',
  'Books',
  'Sports & Gear',
  'Decor',
  'Other',
] as const;

export const SALE_CONDITIONS = ['Like New', 'Good', 'Fair', 'For Parts'] as const;

export const SALE_PICKUP_WINDOWS = [
  {
    id: 'now',
    label: 'Available Now',
    sublabel: 'Pick up ASAP',
    accent: '#c8f060',
  },
  {
    id: 'july',
    label: 'End of July',
    sublabel: 'Available around July 31',
    accent: '#60c8f0',
  },
] as const;

export const SALE_STATUSES = ['available', 'claimed', 'sold', 'archived'] as const;

export type SaleCategory = (typeof SALE_CATEGORIES)[number];
export type SaleCondition = (typeof SALE_CONDITIONS)[number];
export type SalePickupWindow = (typeof SALE_PICKUP_WINDOWS)[number]['id'];
export type SaleListingStatus = (typeof SALE_STATUSES)[number];

export interface SaleListingRecord {
  id: string;
  name: string;
  category: SaleCategory;
  priceCents: number;
  condition: SaleCondition;
  description: string;
  pickupWindow: SalePickupWindow;
  imageUrl: string | null;
  productUrl: string | null;
  status: SaleListingStatus;
  createdAt: string;
  updatedAt: string;
}

export interface SaleClaimRecord {
  id: string;
  listingId: string;
  buyerName: string;
  buyerEmail: string;
  buyerNote: string | null;
  paymentMode: 'venmo_now' | 'pay_later';
  createdAt: string;
}

export interface PublicSaleListing extends SaleListingRecord {}

export interface AdminSaleListing extends SaleListingRecord {
  claim: SaleClaimRecord | null;
}

export interface SaleSnapshot {
  listings: AdminSaleListing[];
  availableCount: number;
  claimedCount: number;
  soldCount: number;
  expectedRevenueCents: number;
}

export interface SaleConfig {
  routeSlug: string;
  venmoHandle: string | null;
  title: string;
  tagline: string;
}
