import { c as createComponent } from './astro-component_BguUUyhl.mjs';
import 'piccolore';
import { i as renderComponent, r as renderTemplate, u as unescapeHTML, f as addAttribute, m as maybeRenderHead } from './ssr-function_C8hoiSj3.mjs';
import { $ as $$SaleLayout } from './SaleLayout_BhHriIyL.mjs';
import { l as listPublicListings } from './repository_CV3IC6Td.mjs';
import { g as getSaleConfig } from './supabase_D70iw1RZ.mjs';
import { i as isSaleSlug } from './slug_DBGwFET-.mjs';
import { b as SALE_PICKUP_WINDOWS, S as SALE_CATEGORIES } from './types_uCWmnLZG.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const prerender = false;
const $$saleSlug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$saleSlug;
  const config = getSaleConfig();
  const saleSlug = Astro2.params.saleSlug;
  const validSale = isSaleSlug(saleSlug);
  Astro2.response.headers.set("Cache-Control", "no-store");
  if (!validSale) {
    Astro2.response.status = 404;
  }
  const listings = validSale ? await listPublicListings() : [];
  const availableCount = listings.filter((listing) => listing.status === "available").length;
  const unavailableCount = listings.filter((listing) => listing.status !== "available").length;
  function formatPrice(cents) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: cents % 100 === 0 ? 0 : 2
    }).format(cents / 100);
  }
  const state = {
    saleSlug: config.routeSlug,
    venmoHandle: config.venmoHandle,
    listings
  };
  return renderTemplate`${renderComponent($$result, "SaleLayout", $$SaleLayout, { "title": `${config.title} | ${config.tagline}`, "description": "Private moving sale listings." }, { "default": async ($$result2) => renderTemplate`${validSale ? renderTemplate(_a || (_a = __template(["", '<div class="sale-page" data-sale-root> <div class="sale-topbar sale-panel"> <div class="sale-brand"> <span class="sale-brand-title">', '</span> <span class="sale-brand-tagline">', '</span> </div> <div class="sale-chip-row"> <span class="sale-chip is-active">', ' available</span> <span class="sale-chip">', ' taken</span> </div> </div> <div id="sale-banner" class="sale-banner" role="status" aria-live="polite"></div> <section class="sale-hero sale-panel"> <div class="sale-hero-grid"> <div> <h1 class="sale-headline">Everything must go before move-out.</h1> <p class="sale-copy">\nThis page is intentionally unlisted. Claiming an item only asks for your name and\n              email, then I’ll follow up to coordinate pickup. Mobile buyers can jump directly into\n              Venmo; everyone else can claim now and settle later.\n</p> </div> <div class="sale-stat-block"> <div class="sale-stat-card"> <span class="sale-stat-label">Pickup windows</span> <span class="sale-stat-value">2</span> </div> <div class="sale-stat-card"> <span class="sale-stat-label">First claim wins</span> <span class="sale-copy">Claims are confirmed server-side so two people can’t grab the same listing.</span> </div> </div> </div> <div class="sale-pickup-grid"> ', ' </div> <div class="sale-filter-row"> <button type="button" class="sale-chip is-active" data-category-filter="All">All</button> ', ' <button type="button" class="sale-chip is-active" data-availability-filter style="margin-left: auto;">\nAvailable only\n</button> </div> </section> <section class="sale-grid" data-sale-grid> ', ' </section> <div class="sale-empty sale-panel" data-empty-state hidden>No items match the current filters.</div> <div class="sale-modal-shell" id="sale-claim-modal" hidden> <div class="sale-modal sale-panel" role="dialog" aria-modal="true" aria-labelledby="sale-claim-title"> <button type="button" class="sale-modal-close" data-close-modal aria-label="Close claim form">\n×\n</button> <img class="sale-modal-image" id="sale-claim-image" alt="" hidden> <div class="sale-form-grid"> <div> <div id="sale-claim-title" class="sale-card-title">Claim item</div> <p class="sale-copy" id="sale-claim-summary"></p> </div> <div class="sale-form-grid columns-2"> <label class="sale-field"> <span class="sale-label">Your name</span> <input id="sale-claim-name" name="name" autocomplete="name" required> </label> <label class="sale-field"> <span class="sale-label">Email</span> <input id="sale-claim-email" name="email" type="email" autocomplete="email" required> </label> </div> <label class="sale-field"> <span class="sale-label">Note</span> <textarea id="sale-claim-note" name="note" placeholder="Pickup questions, timing, or message for me."></textarea> </label> <div class="sale-action-row"> <button type="button" class="sale-button sale-button-primary sale-button-full" id="sale-claim-submit">\nConfirm claim\n</button> <button type="button" class="sale-button sale-button-primary sale-button-full" id="sale-claim-venmo" hidden>\nClaim and open Venmo\n</button> <button type="button" class="sale-button sale-button-secondary sale-button-full" data-close-modal>\nCancel\n</button> </div> </div> </div> </div> <script type="application/json" id="sale-shop-data">', '<\/script> <script src="/sale-shop.js" defer><\/script> </div>'])), maybeRenderHead(), config.title, config.tagline, availableCount, unavailableCount, SALE_PICKUP_WINDOWS.map((pickupWindow) => {
    const count = listings.filter(
      (listing) => listing.pickupWindow === pickupWindow.id && listing.status === "available"
    ).length;
    return renderTemplate`<button type="button" class="sale-pickup-button"${addAttribute(pickupWindow.id, "data-pickup-filter")}${addAttribute(`--pickup-accent: ${pickupWindow.accent};`, "style")}> <div class="sale-pickup-meta"> <div> <div class="sale-pickup-title">${pickupWindow.label}</div> <div class="sale-pickup-subtitle">${pickupWindow.sublabel}</div> </div> <div class="sale-pickup-count"${addAttribute(`color: ${pickupWindow.accent};`, "style")}>${count}</div> </div> </button>`;
  }), SALE_CATEGORIES.map((category) => renderTemplate`<button type="button" class="sale-chip"${addAttribute(category, "data-category-filter")}>${category}</button>`), listings.map((listing) => {
    const pickupWindow = SALE_PICKUP_WINDOWS.find((window) => window.id === listing.pickupWindow);
    return renderTemplate`<article class="sale-card sale-panel" data-sale-card${addAttribute(listing.id, "data-listing-id")}${addAttribute(listing.category, "data-category")}${addAttribute(listing.pickupWindow, "data-pickup")}${addAttribute(listing.status, "data-status")}> ${listing.imageUrl ? renderTemplate`<img class="sale-card-image"${addAttribute(listing.imageUrl, "src")}${addAttribute(listing.name, "alt")} loading="lazy">` : null} <div class="sale-card-body"> <div class="sale-card-header"> <div> <div class="sale-card-title">${listing.name}</div> <div class="sale-card-meta">${listing.category}</div> </div> <div class="sale-price">${formatPrice(listing.priceCents)}</div> </div> <p class="sale-description">${listing.description || "No extra details yet."}</p> <div class="sale-tag-row"> <span class="sale-tag">${listing.condition}</span> <span class="sale-tag"${addAttribute(`border-color: ${pickupWindow.accent}40; color: ${pickupWindow.accent};`, "style")}> ${pickupWindow.label} </span> ${listing.status !== "available" ? renderTemplate`<span class="sale-tag">Unavailable</span>` : null} </div> <div class="sale-action-row"> ${listing.status === "available" ? renderTemplate`<button type="button" class="sale-button sale-button-primary" data-claim-button${addAttribute(listing.id, "data-listing-id")}>
Claim item
</button>` : renderTemplate`<span class="sale-tag">Already claimed</span>`} ${listing.productUrl ? renderTemplate`<a class="sale-button sale-button-secondary"${addAttribute(listing.productUrl, "href")} target="_blank" rel="noreferrer">
Product link
</a>` : null} </div> </div> </article>`;
  }), unescapeHTML(JSON.stringify(state))) : renderTemplate`<div class="sale-page"> <section class="sale-panel sale-hero"> <h1 class="sale-headline">Not found.</h1> <p class="sale-copy">This sale route is either disabled or the URL slug does not match the configured page.</p> </section> </div>`}` })}`;
}, "C:/Users/matth/OneDrive/Documents/GitHub/portfolio/site/src/pages/[saleSlug].astro", void 0);

const $$file = "C:/Users/matth/OneDrive/Documents/GitHub/portfolio/site/src/pages/[saleSlug].astro";
const $$url = "/[saleSlug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$saleSlug,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
