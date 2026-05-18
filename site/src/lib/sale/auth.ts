import type { APIContext } from 'astro';

import {
  clearSaleAdminSession,
  setSaleAdminSession,
  verifySaleAdminPassword,
} from './admin';
import { getSaleAdminPath } from './paths';
import { isSaleSlug } from './slug';

export function redirectWithCookies(cookies: APIContext['cookies'], location: string) {
  const response = Response.redirect(location, 303);

  for (const headerValue of cookies.consume()) {
    response.headers.append('set-cookie', headerValue);
  }

  return response;
}

export async function handleSaleAdminSignIn(
  context: APIContext,
  routeSlug: string | undefined,
): Promise<Response> {
  if (!isSaleSlug(routeSlug)) {
    return new Response('Not found', { status: 404 });
  }

  const formData = await context.request.formData();
  const password = String(formData.get('password') ?? '');
  const next = String(formData.get('next') ?? '').trim() || getSaleAdminPath();

  try {
    if (!verifySaleAdminPassword(password)) {
      return redirectWithCookies(context.cookies, `${next}?notice=invalid-password`);
    }

    setSaleAdminSession(context, routeSlug);
    return redirectWithCookies(context.cookies, `${next}?notice=signed-in`);
  } catch (error) {
    console.error('Failed to sign into sale admin.', error);
    return redirectWithCookies(context.cookies, `${next}?notice=invalid-password`);
  }
}

export async function handleSaleAdminSignOut(
  context: APIContext,
  routeSlug: string | undefined,
): Promise<Response> {
  if (!isSaleSlug(routeSlug)) {
    return new Response('Not found', { status: 404 });
  }

  const formData = await context.request.formData().catch(() => null);
  const next =
    String(formData?.get('next') ?? '').trim() || `${getSaleAdminPath()}?notice=signed-out`;

  clearSaleAdminSession(context);
  return redirectWithCookies(context.cookies, next);
}
