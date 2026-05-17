import { v as verifySaleAdminPassword, s as setSaleAdminSession } from './admin_Dqq9wIuj.mjs';
import { g as getSaleAdminPath } from './paths_Dz8ulodY.mjs';
import { i as isSaleSlug } from './slug_C0m22mp6.mjs';

const prerender = false;
function redirectWithCookies(cookies, location) {
  const response = Response.redirect(location, 303);
  for (const headerValue of cookies.consume()) {
    response.headers.append("set-cookie", headerValue);
  }
  return response;
}
const POST = async (context) => {
  if (!isSaleSlug(context.params.saleSlug)) {
    return new Response("Not found", { status: 404 });
  }
  const formData = await context.request.formData();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "").trim() || getSaleAdminPath();
  try {
    if (!verifySaleAdminPassword(password)) {
      return redirectWithCookies(context.cookies, `${next}?notice=invalid-password`);
    }
    setSaleAdminSession(context, context.params.saleSlug);
    return redirectWithCookies(context.cookies, `${next}?notice=signed-in`);
  } catch (error) {
    console.error("Failed to sign into sale admin.", error);
    return redirectWithCookies(context.cookies, `${next}?notice=invalid-password`);
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
