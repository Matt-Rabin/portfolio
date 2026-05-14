import type { PostgrestError } from '@supabase/supabase-js';

import { createSupabaseAdminClient } from '../supabase';
import type {
  AdminSaleListing,
  PublicSaleListing,
  SaleClaimRecord,
  SaleCondition,
  SaleListingRecord,
  SaleListingStatus,
  SalePickupWindow,
  SaleSnapshot,
} from './types';

interface ListingRow {
  id: string;
  name: string;
  category: string;
  price_cents: number;
  condition: string;
  description: string | null;
  pickup_window: string;
  image_url: string | null;
  product_url: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

interface ClaimRow {
  id: string;
  listing_id: string;
  buyer_name: string;
  buyer_email: string;
  buyer_note: string | null;
  payment_mode: 'venmo_now' | 'pay_later';
  created_at: string;
}

export interface SaleListingInput {
  name: string;
  category: string;
  priceCents: number;
  condition: string;
  description: string;
  pickupWindow: string;
  imageUrl: string | null;
  productUrl: string | null;
}

export interface ClaimListingInput {
  listingId: string;
  buyerName: string;
  buyerEmail: string;
  buyerNote: string;
  paymentMode: 'venmo_now' | 'pay_later';
}

export class ListingUnavailableError extends Error {}

function mapListing(row: ListingRow): SaleListingRecord {
  return {
    id: row.id,
    name: row.name,
    category: row.category as SaleListingRecord['category'],
    priceCents: row.price_cents,
    condition: row.condition as SaleCondition,
    description: row.description ?? '',
    pickupWindow: row.pickup_window as SalePickupWindow,
    imageUrl: row.image_url,
    productUrl: row.product_url,
    status: row.status as SaleListingStatus,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapClaim(row: ClaimRow): SaleClaimRecord {
  return {
    id: row.id,
    listingId: row.listing_id,
    buyerName: row.buyer_name,
    buyerEmail: row.buyer_email,
    buyerNote: row.buyer_note,
    paymentMode: row.payment_mode,
    createdAt: row.created_at,
  };
}

function normalizePostgrestError(error: PostgrestError | null): never {
  throw new Error(error?.message ?? 'Supabase request failed');
}

async function getClaimsByListingId(listingIds: string[]): Promise<Map<string, SaleClaimRecord>> {
  if (listingIds.length === 0) {
    return new Map();
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from('sale_claims')
    .select('id, listing_id, buyer_name, buyer_email, buyer_note, payment_mode, created_at')
    .in('listing_id', listingIds)
    .order('created_at', { ascending: false });

  if (error) {
    normalizePostgrestError(error);
  }

  const claimMap = new Map<string, SaleClaimRecord>();

  for (const row of (data ?? []) as ClaimRow[]) {
    if (!claimMap.has(row.listing_id)) {
      claimMap.set(row.listing_id, mapClaim(row));
    }
  }

  return claimMap;
}

export async function listPublicListings(): Promise<PublicSaleListing[]> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from('sale_listings')
    .select(
      'id, name, category, price_cents, condition, description, pickup_window, image_url, product_url, status, created_at, updated_at',
    )
    .neq('status', 'archived')
    .order('pickup_window', { ascending: true })
    .order('price_cents', { ascending: true });

  if (error) {
    normalizePostgrestError(error);
  }

  return ((data ?? []) as ListingRow[]).map(mapListing);
}

export async function getAdminSnapshot(): Promise<SaleSnapshot> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from('sale_listings')
    .select(
      'id, name, category, price_cents, condition, description, pickup_window, image_url, product_url, status, created_at, updated_at',
    )
    .order('updated_at', { ascending: false });

  if (error) {
    normalizePostgrestError(error);
  }

  const listings = ((data ?? []) as ListingRow[]).map(mapListing);
  const claimMap = await getClaimsByListingId(listings.map((listing) => listing.id));

  const adminListings: AdminSaleListing[] = listings.map((listing) => ({
    ...listing,
    claim: claimMap.get(listing.id) ?? null,
  }));

  return {
    listings: adminListings,
    availableCount: adminListings.filter((listing) => listing.status === 'available').length,
    claimedCount: adminListings.filter((listing) => listing.status === 'claimed').length,
    soldCount: adminListings.filter((listing) => listing.status === 'sold').length,
    expectedRevenueCents: adminListings
      .filter((listing) => listing.status === 'claimed' || listing.status === 'sold')
      .reduce((sum, listing) => sum + listing.priceCents, 0),
  };
}

export async function createListing(input: SaleListingInput): Promise<void> {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from('sale_listings').insert({
    name: input.name,
    category: input.category,
    price_cents: input.priceCents,
    condition: input.condition,
    description: input.description,
    pickup_window: input.pickupWindow,
    image_url: input.imageUrl,
    product_url: input.productUrl,
    status: 'available',
  });

  if (error) {
    normalizePostgrestError(error);
  }
}

export async function updateListing(id: string, input: SaleListingInput): Promise<void> {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from('sale_listings')
    .update({
      name: input.name,
      category: input.category,
      price_cents: input.priceCents,
      condition: input.condition,
      description: input.description,
      pickup_window: input.pickupWindow,
      image_url: input.imageUrl,
      product_url: input.productUrl,
    })
    .eq('id', id);

  if (error) {
    normalizePostgrestError(error);
  }
}

export async function setListingStatus(id: string, status: SaleListingStatus): Promise<void> {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from('sale_listings').update({ status }).eq('id', id);

  if (error) {
    normalizePostgrestError(error);
  }
}

export async function unclaimListing(id: string): Promise<void> {
  const supabase = createSupabaseAdminClient();
  const { error: claimsError } = await supabase.from('sale_claims').delete().eq('listing_id', id);

  if (claimsError) {
    normalizePostgrestError(claimsError);
  }

  await setListingStatus(id, 'available');
}

export async function claimListing(input: ClaimListingInput): Promise<PublicSaleListing> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.rpc('claim_sale_listing', {
    p_listing_id: input.listingId,
    p_buyer_name: input.buyerName,
    p_buyer_email: input.buyerEmail,
    p_buyer_note: input.buyerNote || null,
    p_payment_mode: input.paymentMode,
  });

  if (error) {
    if (error.code === 'P0001') {
      throw new ListingUnavailableError('This item has already been claimed.');
    }

    normalizePostgrestError(error);
  }

  const row = Array.isArray(data) ? (data[0] as ListingRow | undefined) : undefined;

  if (!row) {
    throw new ListingUnavailableError('This item is no longer available.');
  }

  return mapListing(row);
}
