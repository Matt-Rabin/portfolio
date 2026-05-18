import { v as verifySaleAdminPassword, s as setSaleAdminSession, c as clearSaleAdminSession } from './admin_Dqq9wIuj.mjs';
import { g as getSaleAdminPath } from './paths_BzNPkTRy.mjs';
import { i as isSaleSlug } from './slug_C0m22mp6.mjs';

function redirectWithCookies(cookies, location) {
  const response = Response.redirect(location, 303);
  for (const headerValue of cookies.consume()) {
    response.headers.append("set-cookie", headerValue);
  }
  return response;
}
async function handleSaleAdminSignIn(context, routeSlug) {
  if (!isSaleSlug(routeSlug)) {
    return new Response("Not found", { status: 404 });
  }
  const formData = await context.request.formData();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "").trim() || getSaleAdminPath();
  try {
    if (!verifySaleAdminPassword(password)) {
      return redirectWithCookies(context.cookies, `${next}?notice=invalid-password`);
    }
    setSaleAdminSession(context, routeSlug);
    return redirectWithCookies(context.cookies, `${next}?notice=signed-in`);
  } catch (error) {
    console.error("Failed to sign into sale admin.", error);
    return redirectWithCookies(context.cookies, `${next}?notice=invalid-password`);
  }
}
async function handleSaleAdminSignOut(context, routeSlug) {
  if (!isSaleSlug(routeSlug)) {
    return new Response("Not found", { status: 404 });
  }
  const formData = await context.request.formData().catch(() => null);
  const next = String(formData?.get("next") ?? "").trim() || `${getSaleAdminPath()}?notice=signed-out`;
  clearSaleAdminSession(context);
  return redirectWithCookies(context.cookies, next);
}

export { handleSaleAdminSignOut as a, handleSaleAdminSignIn as h };
