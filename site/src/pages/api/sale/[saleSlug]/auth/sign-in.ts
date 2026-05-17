import type { APIRoute } from 'astro';

import { getSaleConfig } from '../../../../../lib/sale/config';
import { getSaleAdminPath, getSaleAuthCallbackPath } from '../../../../../lib/sale/paths';
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
  const formData = await request.formData();
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const next = String(formData.get('next') ?? '').trim() || getSaleAdminPath();

  if (!email || email !== config.adminEmail) {
    return redirectWithCookies(cookies, next);
  }

  const origin = new URL(request.url).origin;
  const callbackUrl = new URL(getSaleAuthCallbackPath(), origin);
  callbackUrl.searchParams.set('next', next);

  const supabase = createSupabaseServerClient(cookies, request);
  await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false,
      emailRedirectTo: callbackUrl.toString(),
    },
  });

  return redirectWithCookies(cookies, `${next}?sent=1`);
};
