import type { APIRoute } from 'astro';

import { clearSaleAdminSession } from '../../../../../lib/sale/admin';
import { getSaleAdminPath } from '../../../../../lib/sale/paths';
import { isSaleSlug } from '../../../../../lib/sale/slug';

export const prerender = false;

function redirectWithCookies(cookies: APIRoute['cookies'], location: string) {
  const response = Response.redirect(location, 303);

  for (const headerValue of cookies.consume()) {
    response.headers.append('set-cookie', headerValue);
  }

  return response;
}

export const POST: APIRoute = async (context) => {
  if (!isSaleSlug(context.params.saleSlug)) {
    return new Response('Not found', { status: 404 });
  }

  const formData = await context.request.formData().catch(() => null);
  const next =
    String(formData?.get('next') ?? '').trim() || `${getSaleAdminPath()}?notice=signed-out`;

  clearSaleAdminSession(context);
  return redirectWithCookies(context.cookies, next);
};
