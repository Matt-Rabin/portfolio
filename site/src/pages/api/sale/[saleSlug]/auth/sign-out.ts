import type { APIRoute } from 'astro';

import { getSaleConfig } from '../../../../../lib/sale/config';
import { getSaleAdminPath } from '../../../../../lib/sale/paths';
import { isSaleSlug } from '../../../../../lib/sale/slug';
import { createSupabaseServerClient } from '../../../../../lib/supabase';

export const prerender = false;

function redirectWithCookies(cookies: APIRoute['cookies'], location: string) {
  const response = Response.redirect(location, 303);

  for (const headerValue of cookies.consume()) {
    response.headers.append('set-cookie', headerValue);
  }

  return response;
}

export const POST: APIRoute = async ({ params, request, cookies }) => {
  if (!isSaleSlug(params.saleSlug)) {
    return new Response('Not found', { status: 404 });
  }

  const config = getSaleConfig();
  const formData = await request.formData().catch(() => null);
  const next =
    String(formData?.get('next') ?? '').trim() || `${getSaleAdminPath()}?notice=signed-out`;
  const supabase = createSupabaseServerClient(cookies, request);
  await supabase.auth.signOut();

  return redirectWithCookies(cookies, next);
};
