import { r as requireSaleAdmin } from './admin_Dqq9wIuj.mjs';
import { p as parseListingForm } from './forms_CPReg9uO.mjs';
import { u as updateListing, a as unclaimListing, s as setListingStatus } from './repository_DfW8a1GC.mjs';
import { g as getSaleAdminPath } from './paths_BzNPkTRy.mjs';
import { r as redirectWithNotice } from './http_CIETM0_R.mjs';
import { i as isSaleSlug } from './slug_C0m22mp6.mjs';

const prerender = false;
const POST = async (context) => {
  if (!isSaleSlug(context.params.saleSlug)) {
    return new Response("Not found", { status: 404 });
  }
  const authorized = await requireSaleAdmin(context);
  const adminPath = getSaleAdminPath();
  if (!authorized) {
    return Response.redirect(adminPath, 303);
  }
  const id = context.params.id;
  if (!id) {
    return new Response("Missing listing id", { status: 400 });
  }
  const formData = await context.request.formData();
  const intent = String(formData.get("intent") ?? "update");
  if (intent === "update") {
    await updateListing(id, parseListingForm(formData));
    return redirectWithNotice(adminPath, "item-updated");
  }
  if (intent === "mark-available") {
    await unclaimListing(id);
    return redirectWithNotice(adminPath, "item-unclaimed");
  }
  if (intent === "mark-sold") {
    await setListingStatus(id, "sold");
    return redirectWithNotice(adminPath, "item-sold");
  }
  if (intent === "archive") {
    await setListingStatus(id, "archived");
    return redirectWithNotice(adminPath, "item-archived");
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
