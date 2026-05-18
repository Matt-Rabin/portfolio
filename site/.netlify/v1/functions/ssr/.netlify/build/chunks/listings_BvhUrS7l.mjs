import { r as requireSaleAdmin } from './admin_Dqq9wIuj.mjs';
import { p as parseListingForm } from './forms_CPReg9uO.mjs';
import { g as getAdminSnapshot, c as createListing } from './repository_DfW8a1GC.mjs';
import { g as getSaleAdminPath } from './paths_BPjKTxtN.mjs';
import { j as jsonResponse, r as redirectWithNotice } from './http_CIETM0_R.mjs';
import { i as isSaleSlug } from './slug_C0m22mp6.mjs';

const prerender = false;
const GET = async (context) => {
  if (!isSaleSlug(context.params.saleSlug)) {
    return new Response("Not found", { status: 404 });
  }
  const authorized = await requireSaleAdmin(context);
  if (!authorized) {
    return new Response("Unauthorized", { status: 401 });
  }
  const snapshot = await getAdminSnapshot();
  return jsonResponse(snapshot);
};
const POST = async (context) => {
  if (!isSaleSlug(context.params.saleSlug)) {
    return new Response("Not found", { status: 404 });
  }
  const authorized = await requireSaleAdmin(context);
  const adminPath = getSaleAdminPath();
  if (!authorized) {
    return Response.redirect(adminPath, 303);
  }
  const formData = await context.request.formData();
  const intent = String(formData.get("intent") ?? "");
  if (intent !== "create") {
    return new Response("Unsupported action", { status: 400 });
  }
  const input = parseListingForm(formData);
  await createListing(input);
  return redirectWithNotice(adminPath, "item-created");
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
