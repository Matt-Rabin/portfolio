import type { APIRoute } from 'astro';

import {
  setSaleAdminSession,
  verifySaleAdminPassword,
} from '../../../../../lib/sale/admin';
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

  const formData = await context.request.formData();
  const password = String(formData.get('password') ?? '');
  const next = String(formData.get('next') ?? '').trim() || getSaleAdminPath();

  try {
    if (!verifySaleAdminPassword(password)) {
      return redirectWithCookies(context.cookies, `${next}?notice=invalid-password`);
    }

    setSaleAdminSession(context, context.params.saleSlug);
    return redirectWithCookies(context.cookies, `${next}?notice=signed-in`);
  } catch (error) {
    console.error('Failed to sign into sale admin.', error);
    return redirectWithCookies(context.cookies, `${next}?notice=invalid-password`);
  }
};
