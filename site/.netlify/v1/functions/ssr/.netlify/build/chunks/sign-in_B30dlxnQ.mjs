import { g as getSaleConfig, c as createSupabaseServerClient } from './supabase_D70iw1RZ.mjs';
import { g as getSaleAdminPath, a as getSaleAuthCallbackPath } from './paths_DxXsHVXg.mjs';
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
  const config = getSaleConfig();
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const next = String(formData.get("next") ?? "").trim() || getSaleAdminPath();
  if (!email || email !== config.adminEmail) {
    return redirectWithCookies(cookies, next);
  }
  const origin = new URL(request.url).origin;
  const callbackUrl = new URL(getSaleAuthCallbackPath(), origin);
  callbackUrl.searchParams.set("next", next);
  const supabase = createSupabaseServerClient(cookies, request);
  await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false,
      emailRedirectTo: callbackUrl.toString()
    }
  });
  return redirectWithCookies(cookies, `${next}?sent=1`);
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
