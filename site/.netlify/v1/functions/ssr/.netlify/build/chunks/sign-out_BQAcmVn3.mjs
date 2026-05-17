import { g as getSaleConfig, c as createSupabaseServerClient } from './supabase_D70iw1RZ.mjs';
import { g as getSaleAdminPath } from './paths_DxXsHVXg.mjs';
import { i as isSaleSlug } from './slug_DBGwFET-.mjs';

const prerender = false;
function redirectWithCookies(cookies, location) {
  const response = Response.redirect(location, 303);
  for (const headerValue of cookies.consume()) {
    response.headers.append("set-cookie", headerValue);
  }
  return response;
}
const POST = async ({ params, request, cookies }) => {
  if (!isSaleSlug(params.saleSlug)) {
    return new Response("Not found", { status: 404 });
  }
  getSaleConfig();
  const formData = await request.formData().catch(() => null);
  const next = String(formData?.get("next") ?? "").trim() || `${getSaleAdminPath()}?notice=signed-out`;
  const supabase = createSupabaseServerClient(cookies, request);
  await supabase.auth.signOut();
  return redirectWithCookies(cookies, next);
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
