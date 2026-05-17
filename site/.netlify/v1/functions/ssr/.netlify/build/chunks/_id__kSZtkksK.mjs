import { r as requireSaleAdmin } from './admin_IcPCBuYE.mjs';
import { p as parseListingForm } from './forms_CPReg9uO.mjs';
import { u as updateListing, a as unclaimListing, s as setListingStatus } from './repository_CV3IC6Td.mjs';
import { g as getSaleConfig } from './supabase_D70iw1RZ.mjs';
import { r as redirectWithNotice } from './http_CIETM0_R.mjs';
import { i as isSaleSlug } from './slug_DBGwFET-.mjs';

const prerender = false;
const POST = async (context) => {
  if (!isSaleSlug(context.params.saleSlug)) {
    return new Response("Not found", { status: 404 });
  }
  const authorized = await requireSaleAdmin(context);
  const config = getSaleConfig();
  if (!authorized) {
    return Response.redirect(`/${config.routeSlug}/admin`, 303);
  }
  const id = context.params.id;
  if (!id) {
    return new Response("Missing listing id", { status: 400 });
  }
  const formData = await context.request.formData();
  const intent = String(formData.get("intent") ?? "update");
  if (intent === "update") {
    await updateListing(id, parseListingForm(formData));
    return redirectWithNotice(`/${config.routeSlug}/admin`, "item-updated");
  }
  if (intent === "mark-available") {
    await unclaimListing(id);
    return redirectWithNotice(`/${config.routeSlug}/admin`, "item-unclaimed");
  }
  if (intent === "mark-sold") {
    await setListingStatus(id, "sold");
    return redirectWithNotice(`/${config.routeSlug}/admin`, "item-sold");
  }
  if (intent === "archive") {
    await setListingStatus(id, "archived");
    return redirectWithNotice(`/${config.routeSlug}/admin`, "item-archived");
  }
  return new Response("Unsupported action", { status: 400 });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
