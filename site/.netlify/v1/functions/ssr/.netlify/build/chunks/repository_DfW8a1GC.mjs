import { a as createSupabaseAdminClient } from './supabase_B-8P-iQt.mjs';

class ListingUnavailableError extends Error {
}
function mapListing(row) {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    priceCents: row.price_cents,
    condition: row.condition,
    description: row.description ?? "",
    pickupWindow: row.pickup_window,
    imageUrl: row.image_url,
    productUrl: row.product_url,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}
function mapClaim(row) {
  return {
    id: row.id,
    listingId: row.listing_id,
    buyerName: row.buyer_name,
    buyerEmail: row.buyer_email,
    buyerNote: row.buyer_note,
    paymentMode: row.payment_mode,
    createdAt: row.created_at
  };
}
function normalizePostgrestError(error) {
  throw new Error(error?.message ?? "Supabase request failed");
}
async function getClaimsByListingId(listingIds) {
  if (listingIds.length === 0) {
    return /* @__PURE__ */ new Map();
  }
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.from("sale_claims").select("id, listing_id, buyer_name, buyer_email, buyer_note, payment_mode, created_at").in("listing_id", listingIds).order("created_at", { ascending: false });
  if (error) {
    normalizePostgrestError(error);
  }
  const claimMap = /* @__PURE__ */ new Map();
  for (const row of data ?? []) {
    if (!claimMap.has(row.listing_id)) {
      claimMap.set(row.listing_id, mapClaim(row));
    }
  }
  return claimMap;
}
async function listPublicListings() {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.from("sale_listings").select(
    "id, name, category, price_cents, condition, description, pickup_window, image_url, product_url, status, created_at, updated_at"
  ).neq("status", "archived").order("pickup_window", { ascending: true }).order("price_cents", { ascending: true });
  if (error) {
    normalizePostgrestError(error);
  }
  return (data ?? []).map(mapListing);
}
async function getAdminSnapshot() {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.from("sale_listings").select(
    "id, name, category, price_cents, condition, description, pickup_window, image_url, product_url, status, created_at, updated_at"
  ).order("updated_at", { ascending: false });
  if (error) {
    normalizePostgrestError(error);
  }
  const listings = (data ?? []).map(mapListing);
  const claimMap = await getClaimsByListingId(listings.map((listing) => listing.id));
  const adminListings = listings.map((listing) => ({
    ...listing,
    claim: claimMap.get(listing.id) ?? null
  }));
  return {
    listings: adminListings,
    availableCount: adminListings.filter((listing) => listing.status === "available").length,
    claimedCount: adminListings.filter((listing) => listing.status === "claimed").length,
    soldCount: adminListings.filter((listing) => listing.status === "sold").length,
    expectedRevenueCents: adminListings.filter((listing) => listing.status === "claimed" || listing.status === "sold").reduce((sum, listing) => sum + listing.priceCents, 0)
  };
}
async function createListing(input) {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("sale_listings").insert({
    name: input.name,
    category: input.category,
    price_cents: input.priceCents,
    condition: input.condition,
    description: input.description,
    pickup_window: input.pickupWindow,
    image_url: input.imageUrl,
    product_url: input.productUrl,
    status: "available"
  });
  if (error) {
    normalizePostgrestError(error);
  }
}
async function updateListing(id, input) {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("sale_listings").update({
    name: input.name,
    category: input.category,
    price_cents: input.priceCents,
    condition: input.condition,
    description: input.description,
    pickup_window: input.pickupWindow,
    image_url: input.imageUrl,
    product_url: input.productUrl
  }).eq("id", id);
  if (error) {
    normalizePostgrestError(error);
  }
}
async function setListingStatus(id, status) {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("sale_listings").update({ status }).eq("id", id);
  if (error) {
    normalizePostgrestError(error);
  }
}
async function unclaimListing(id) {
  const supabase = createSupabaseAdminClient();
  const { error: claimsError } = await supabase.from("sale_claims").delete().eq("listing_id", id);
  if (claimsError) {
    normalizePostgrestError(claimsError);
  }
  await setListingStatus(id, "available");
}
async function claimListing(input) {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.rpc("claim_sale_listing", {
    p_listing_id: input.listingId,
    p_buyer_name: input.buyerName,
    p_buyer_email: input.buyerEmail,
    p_buyer_note: input.buyerNote || null,
    p_payment_mode: input.paymentMode
  });
  if (error) {
    if (error.code === "P0001") {
      throw new ListingUnavailableError("This item has already been claimed.");
    }
    normalizePostgrestError(error);
  }
  const row = Array.isArray(data) ? data[0] : void 0;
  if (!row) {
    throw new ListingUnavailableError("This item is no longer available.");
  }
  return mapListing(row);
}

export { ListingUnavailableError as L, unclaimListing as a, claimListing as b, createListing as c, getAdminSnapshot as g, listPublicListings as l, setListingStatus as s, updateListing as u };
