import { r as requireSaleAdmin } from './admin_jxoO-Rry.mjs';
import { p as parseListingForm } from './forms_CPReg9uO.mjs';
import { g as getAdminSnapshot, c as createListing } from './repository_DdBuxHa4.mjs';
import { i as isSaleSlug, g as getSaleConfig } from './slug_ChKz0nzP.mjs';
import { j as jsonResponse, r as redirectWithNotice } from './http_CIETM0_R.mjs';

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
  const config = getSaleConfig();
  if (!authorized) {
    return Response.redirect(`/${config.routeSlug}/admin`, 303);
  }
  const formData = await context.request.formData();
  const intent = String(formData.get("intent") ?? "");
  if (intent !== "create") {
    return new Response("Unsupported action", { status: 400 });
  }
  const input = parseListingForm(formData);
  await createListing(input);
  return redirectWithNotice(`/${config.routeSlug}/admin`, "item-created");
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
