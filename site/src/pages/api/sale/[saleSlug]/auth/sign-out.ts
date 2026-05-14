import type { APIRoute } from 'astro';

import { getSaleConfig } from '../../../../../lib/sale/config';
import { getSaleAdminPath } from '../../../../../lib/sale/paths';
import { isSaleSlug } from '../../../../../lib/sale/slug';
import { createSupabaseServerClient } from '../../../../../lib/supabase';

export const prerender = false;

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

  return Response.redirect(next, 303);
};
