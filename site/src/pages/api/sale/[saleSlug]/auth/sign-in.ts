import type { APIRoute } from 'astro';

import { getSaleConfig } from '../../../../../lib/sale/config';
import { isSaleSlug } from '../../../../../lib/sale/slug';
import { createSupabaseServerClient } from '../../../../../lib/supabase';

export const prerender = false;

export const POST: APIRoute = async ({ params, request, cookies }) => {
  if (!isSaleSlug(params.saleSlug)) {
    return new Response('Not found', { status: 404 });
  }

  const config = getSaleConfig();
  const formData = await request.formData();
  const email = String(formData.get('email') ?? '').trim().toLowerCase();

  if (!email || email !== config.adminEmail) {
    return Response.redirect(`/${config.routeSlug}/admin`, 303);
  }

  const origin = new URL(request.url).origin;
  const callbackUrl = new URL(`/${config.routeSlug}/auth/callback`, origin);
  callbackUrl.searchParams.set('next', `/${config.routeSlug}/admin`);

  const supabase = createSupabaseServerClient(cookies, request);
  await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false,
      emailRedirectTo: callbackUrl.toString(),
    },
  });

  return Response.redirect(`/${config.routeSlug}/admin?sent=1`, 303);
};
