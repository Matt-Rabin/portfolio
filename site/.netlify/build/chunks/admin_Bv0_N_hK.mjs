import { c as createComponent } from './astro-component_DyHH2-5Q.mjs';
import 'piccolore';
import { i as renderComponent, r as renderTemplate, m as maybeRenderHead, f as addAttribute, j as Fragment } from './ssr-function_1OL0fpva.mjs';
import { $ as $$SaleLayout } from './SaleLayout_CTvMBjGg.mjs';
import { r as requireSaleAdmin } from './admin_Dqq9wIuj.mjs';
import { g as getSaleConfig } from './config_BSMUbtlk.mjs';
import { g as getSaleAdminPath } from './paths_Dz8ulodY.mjs';
import { g as getAdminSnapshot } from './repository_DfW8a1GC.mjs';
import { S as SALE_CATEGORIES, a as SALE_CONDITIONS, b as SALE_PICKUP_WINDOWS } from './types_uCWmnLZG.mjs';

const prerender = false;
const $$Admin = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Admin;
  const config = getSaleConfig();
  const adminPath = getSaleAdminPath();
  Astro2.response.headers.set("Cache-Control", "no-store");
  if (config.routeSlug !== "mattslist") {
    Astro2.response.status = 404;
  }
  let adminUser = false;
  let snapshot = null;
  let adminError = null;
  if (config.routeSlug === "mattslist") {
    try {
      adminUser = await requireSaleAdmin(Astro2);
      snapshot = adminUser ? await getAdminSnapshot() : null;
    } catch (error) {
      Astro2.response.status = 500;
      adminError = error instanceof Error ? error.message : "Unknown admin render error";
      console.error("Failed to render mattslist admin page.", error);
    }
  }
  const notice = Astro2.url.searchParams.get("notice");
  function formatPrice(cents) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: cents % 100 === 0 ? 0 : 2
    }).format(cents / 100);
  }
  function formatEditablePrice(cents) {
    return (cents / 100).toFixed(cents % 100 === 0 ? 0 : 2);
  }
  const noticeMessages = {
    "item-created": "Listing created.",
    "item-updated": "Listing updated.",
    "item-unclaimed": "Listing returned to available inventory.",
    "item-sold": "Listing marked as sold.",
    "item-archived": "Listing archived.",
    "signed-out": "Signed out.",
    "signed-in": "Signed in.",
    "invalid-password": "Incorrect password."
  };
  return renderTemplate`${renderComponent($$result, "SaleLayout", $$SaleLayout, { "title": `${config.title} admin | ${config.tagline}`, "description": "Protected moving sale admin." }, { "default": async ($$result2) => renderTemplate`${config.routeSlug === "mattslist" ? renderTemplate`${maybeRenderHead()}<div class="sale-admin-page"> <div class="sale-topbar sale-panel"> <div class="sale-brand"> <span class="sale-brand-title">${config.title} admin</span> <span class="sale-brand-tagline">${config.routeSlug}</span> </div> ${adminUser ? renderTemplate`<form class="sale-inline-form" method="post"${addAttribute(`/api/sale/${config.routeSlug}/auth/sign-out`, "action")}> <input type="hidden" name="next"${addAttribute(adminPath, "value")}> <button class="sale-button sale-button-secondary" type="submit">Sign out</button> </form>` : null} </div> ${notice && noticeMessages[notice] ? renderTemplate`<div class="sale-banner is-visible">${noticeMessages[notice]}</div>` : null} ${adminError ? renderTemplate`<section class="sale-login-box sale-panel"> <h1 class="sale-card-title" style="margin-bottom: 0.5rem;">Admin page failed to load</h1> <p class="sale-copy" style="margin-bottom: 1rem;">
The route is resolving, but the server hit an error while rendering this page.
</p> <div class="sale-banner is-visible is-error"> <strong>Server message:</strong> ${adminError} </div> <p class="sale-copy" style="margin-top: 1rem;">
If this persists, check the Netlify function log for the request to <code>${adminPath}</code>.
</p> </section>` : adminUser && snapshot ? renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate` <section class="sale-admin-metrics"> <div class="sale-metric sale-panel"> <span class="sale-metric-label">Available</span> <span class="sale-metric-value">${snapshot.availableCount}</span> </div> <div class="sale-metric sale-panel"> <span class="sale-metric-label">Claimed</span> <span class="sale-metric-value">${snapshot.claimedCount}</span> </div> <div class="sale-metric sale-panel"> <span class="sale-metric-label">Sold</span> <span class="sale-metric-value">${snapshot.soldCount}</span> </div> <div class="sale-metric sale-panel"> <span class="sale-metric-label">Expected revenue</span> <span class="sale-metric-value">${formatPrice(snapshot.expectedRevenueCents)}</span> </div> </section> <section class="sale-admin-grid"> <details class="sale-panel sale-admin-item" open> <summary> <div class="sale-admin-summary"> <span class="sale-card-title">Add listing</span> <span class="sale-admin-subtle">Create a new item in the hidden sale inventory.</span> </div> <span class="sale-tag">New</span> </summary> <div class="sale-admin-item-body"> <form method="post"${addAttribute(`/api/sale/${config.routeSlug}/admin/listings`, "action")}> <input type="hidden" name="intent" value="create"> <div class="sale-form-grid columns-2"> <label class="sale-field"> <span class="sale-label">Name</span> <input name="name" required> </label> <label class="sale-field"> <span class="sale-label">Price</span> <input name="price" type="number" min="0" step="0.01" required> </label> <label class="sale-field"> <span class="sale-label">Category</span> <select name="category"> ${SALE_CATEGORIES.map((category) => renderTemplate`<option${addAttribute(category, "value")}>${category}</option>`)} </select> </label> <label class="sale-field"> <span class="sale-label">Condition</span> <select name="condition"> ${SALE_CONDITIONS.map((condition) => renderTemplate`<option${addAttribute(condition, "value")}>${condition}</option>`)} </select> </label> <label class="sale-field"> <span class="sale-label">Pickup window</span> <select name="pickupWindow"> ${SALE_PICKUP_WINDOWS.map((pickupWindow) => renderTemplate`<option${addAttribute(pickupWindow.id, "value")}>${pickupWindow.label}</option>`)} </select> </label> <label class="sale-field"> <span class="sale-label">Image URL</span> <input name="imageUrl" type="url" placeholder="https://..."> </label> <label class="sale-field" style="grid-column: 1 / -1;"> <span class="sale-label">Product URL</span> <input name="productUrl" type="url" placeholder="https://..."> </label> <label class="sale-field" style="grid-column: 1 / -1;"> <span class="sale-label">Description</span> <textarea name="description" placeholder="Size, quirks, pickup notes, color, condition details."></textarea> </label> </div> <div class="sale-action-row" style="margin-top: 1rem;"> <button class="sale-button sale-button-primary" type="submit">Create listing</button> </div> </form> </div> </details> ${snapshot.listings.map((listing) => renderTemplate`<details class="sale-panel sale-admin-item"> <summary> <div class="sale-admin-summary"> <span class="sale-card-title">${listing.name}</span> <span class="sale-admin-subtle"> ${listing.category} · ${SALE_PICKUP_WINDOWS.find((pickupWindow) => pickupWindow.id === listing.pickupWindow)?.label} </span> </div> <div class="sale-chip-row"> <span class="sale-tag">${listing.status}</span> <span class="sale-tag">${formatPrice(listing.priceCents)}</span> </div> </summary> <div class="sale-admin-item-body"> ${listing.claim ? renderTemplate`<div class="sale-admin-claim" style="margin-bottom: 1rem;"> <strong>${listing.claim.buyerName}</strong> · ${listing.claim.buyerEmail} <br> <span class="sale-admin-subtle"> ${listing.claim.paymentMode === "venmo_now" ? "Venmo intent" : "Pay later"} ${listing.claim.buyerNote ? ` · ${listing.claim.buyerNote}` : ""} </span> </div>` : null} <form method="post"${addAttribute(`/api/sale/${config.routeSlug}/admin/listings/${listing.id}`, "action")}> <div class="sale-form-grid columns-2"> <label class="sale-field"> <span class="sale-label">Name</span> <input name="name"${addAttribute(listing.name, "value")} required> </label> <label class="sale-field"> <span class="sale-label">Price</span> <input name="price" type="number" min="0" step="0.01"${addAttribute(formatEditablePrice(listing.priceCents), "value")} required> </label> <label class="sale-field"> <span class="sale-label">Category</span> <select name="category"> ${SALE_CATEGORIES.map((category) => renderTemplate`<option${addAttribute(category, "value")}${addAttribute(category === listing.category, "selected")}>${category}</option>`)} </select> </label> <label class="sale-field"> <span class="sale-label">Condition</span> <select name="condition"> ${SALE_CONDITIONS.map((condition) => renderTemplate`<option${addAttribute(condition, "value")}${addAttribute(condition === listing.condition, "selected")}>${condition}</option>`)} </select> </label> <label class="sale-field"> <span class="sale-label">Pickup window</span> <select name="pickupWindow"> ${SALE_PICKUP_WINDOWS.map((pickupWindow) => renderTemplate`<option${addAttribute(pickupWindow.id, "value")}${addAttribute(pickupWindow.id === listing.pickupWindow, "selected")}> ${pickupWindow.label} </option>`)} </select> </label> <label class="sale-field"> <span class="sale-label">Image URL</span> <input name="imageUrl" type="url"${addAttribute(listing.imageUrl ?? "", "value")}> </label> <label class="sale-field" style="grid-column: 1 / -1;"> <span class="sale-label">Product URL</span> <input name="productUrl" type="url"${addAttribute(listing.productUrl ?? "", "value")}> </label> <label class="sale-field" style="grid-column: 1 / -1;"> <span class="sale-label">Description</span> <textarea name="description">${listing.description}</textarea> </label> </div> <div class="sale-action-row" style="margin-top: 1rem;"> <button class="sale-button sale-button-primary" name="intent" value="update" type="submit">
Save changes
</button> ${listing.status !== "available" ? renderTemplate`<button class="sale-button sale-button-secondary" name="intent" value="mark-available" type="submit">
Reopen listing
</button>` : null} ${listing.status !== "sold" ? renderTemplate`<button class="sale-button sale-button-secondary" name="intent" value="mark-sold" type="submit">
Mark sold
</button>` : null} ${listing.status !== "archived" ? renderTemplate`<button class="sale-button sale-button-danger" name="intent" value="archive" type="submit">
Archive
</button>` : null} </div> </form> </div> </details>`)} </section> ` })}` : renderTemplate`<section class="sale-login-box sale-panel"> <h1 class="sale-card-title" style="margin-bottom: 0.5rem;">Admin access</h1> <p class="sale-copy" style="margin-bottom: 1rem;">
Enter the admin password to unlock listing management. The password is checked
            server-side and the session stays in an HttpOnly cookie.
</p> <form class="sale-form-grid" method="post"${addAttribute(`/api/sale/${config.routeSlug}/auth/sign-in`, "action")}> <input type="hidden" name="next"${addAttribute(adminPath, "value")}> <label class="sale-field"> <span class="sale-label">Admin password</span> <input name="password" type="password" autocomplete="current-password" required> </label> <button class="sale-button sale-button-primary" type="submit">Sign in</button> </form> </section>`} </div>` : renderTemplate`<div class="sale-admin-page"> <section class="sale-panel sale-hero"> <h1 class="sale-headline">Not found.</h1> <p class="sale-copy">This admin route only exists for the configured hidden sale slug.</p> </section> </div>`}` })}`;
}, "C:/Users/matth/OneDrive/Documents/GitHub/portfolio/site/src/pages/mattslist/admin.astro", void 0);

const $$file = "C:/Users/matth/OneDrive/Documents/GitHub/portfolio/site/src/pages/mattslist/admin.astro";
const $$url = "/mattslist/admin";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Admin,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

export { $$Admin as $, _page as _ };
