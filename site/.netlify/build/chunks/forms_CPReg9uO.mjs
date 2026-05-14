import { S as SALE_CATEGORIES, a as SALE_CONDITIONS, b as SALE_PICKUP_WINDOWS } from './types_uCWmnLZG.mjs';

function readTrimmed(formData, key) {
  return String(formData.get(key) ?? "").trim();
}
function parseMoneyToCents(raw) {
  const value = Number(raw);
  if (!Number.isFinite(value) || value < 0) {
    throw new Error("Price must be a positive number.");
  }
  return Math.round(value * 100);
}
function parseListingForm(formData) {
  const name = readTrimmed(formData, "name");
  const category = readTrimmed(formData, "category");
  const price = readTrimmed(formData, "price");
  const condition = readTrimmed(formData, "condition");
  const description = readTrimmed(formData, "description");
  const pickupWindow = readTrimmed(formData, "pickupWindow");
  const imageUrl = readTrimmed(formData, "imageUrl");
  const productUrl = readTrimmed(formData, "productUrl");
  if (!name) {
    throw new Error("Name is required.");
  }
  if (!SALE_CATEGORIES.includes(category)) {
    throw new Error("Invalid category.");
  }
  if (!SALE_CONDITIONS.includes(condition)) {
    throw new Error("Invalid condition.");
  }
  if (!SALE_PICKUP_WINDOWS.some((window) => window.id === pickupWindow)) {
    throw new Error("Invalid pickup window.");
  }
  return {
    name,
    category,
    priceCents: parseMoneyToCents(price),
    condition,
    description,
    pickupWindow,
    imageUrl: imageUrl || null,
    productUrl: productUrl || null
  };
}
function parseClaimPayload(body) {
  if (!body || typeof body !== "object") {
    throw new Error("Invalid claim payload.");
  }
  const payload = body;
  const listingId = String(payload.listingId ?? "").trim();
  const buyerName = String(payload.buyerName ?? "").trim();
  const buyerEmail = String(payload.buyerEmail ?? "").trim().toLowerCase();
  const buyerNote = String(payload.buyerNote ?? "").trim();
  const paymentMode = payload.paymentMode === "venmo_now" ? "venmo_now" : "pay_later";
  if (!listingId) {
    throw new Error("Listing id is required.");
  }
  if (!buyerName) {
    throw new Error("Name is required.");
  }
  if (!buyerEmail || !buyerEmail.includes("@")) {
    throw new Error("A valid email is required.");
  }
  return {
    listingId,
    buyerName,
    buyerEmail,
    buyerNote,
    paymentMode
  };
}

export { parseClaimPayload as a, parseListingForm as p };
