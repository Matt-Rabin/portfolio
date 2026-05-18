import { v as verifySaleAdminPassword, s as setSaleAdminSession, c as clearSaleAdminSession } from './admin_Dqq9wIuj.mjs';
import { g as getSaleAdminPath } from './paths_BzNPkTRy.mjs';
import { i as isSaleSlug } from './slug_C0m22mp6.mjs';
import { g as getSaleConfig } from './config_BSMUbtlk.mjs';

function redirectWithCookies(cookies, location) {
  const response = Response.redirect(location, 303);
  for (const headerValue of cookies.consume()) {
    response.headers.append("set-cookie", headerValue);
  }
  return response;
}
function withError(basePath, notice, error) {
  const url = new URL(basePath, "https://sale.local");
  url.searchParams.set("notice", notice);
  url.searchParams.set("error", error);
  return `${url.pathname}${url.search}`;
}
async function handleSaleAdminSignIn(context, routeSlug) {
  const nextFallback = getSaleAdminPath();
  if (!isSaleSlug(routeSlug)) {
    const config = getSaleConfig();
    return redirectWithCookies(
      context.cookies,
      withError(
        nextFallback,
        "sign-in-error",
        `slug mismatch: route=${routeSlug ?? "missing"} env=${config.routeSlug}`
      )
    );
  }
  const formData = await context.request.formData();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "").trim() || nextFallback;
  try {
    if (!verifySaleAdminPassword(password)) {
      return redirectWithCookies(context.cookies, `${next}?notice=invalid-password`);
    }
    setSaleAdminSession(context, routeSlug);
    return redirectWithCookies(context.cookies, `${next}?notice=signed-in`);
  } catch (error) {
    console.error("Failed to sign into sale admin.", error);
    return redirectWithCookies(
      context.cookies,
      withError(
        next,
        "sign-in-error",
        error instanceof Error ? error.message : "unknown sign-in error"
      )
    );
  }
}
async function handleSaleAdminSignOut(context, routeSlug) {
  const nextFallback = `${getSaleAdminPath()}?notice=signed-out`;
  if (!isSaleSlug(routeSlug)) {
    const config = getSaleConfig();
    return redirectWithCookies(
      context.cookies,
      withError(
        getSaleAdminPath(),
        "sign-out-error",
        `slug mismatch: route=${routeSlug ?? "missing"} env=${config.routeSlug}`
      )
    );
  }
  const formData = await context.request.formData().catch(() => null);
  const next = String(formData?.get("next") ?? "").trim() || nextFallback;
  clearSaleAdminSession(context);
  return redirectWithCookies(context.cookies, next);
}

export { handleSaleAdminSignOut as a, handleSaleAdminSignIn as h };
