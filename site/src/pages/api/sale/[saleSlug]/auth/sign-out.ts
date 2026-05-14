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
  const supabase = createSupabaseServerClient(cookies, request);
  await supabase.auth.signOut();

  return Response.redirect(`/${config.routeSlug}/admin?notice=signed-out`, 303);
};
