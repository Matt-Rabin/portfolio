import type { APIRoute } from 'astro';

import { requireSaleAdmin } from '../../../../../lib/sale/admin';
import { parseListingForm } from '../../../../../lib/sale/forms';
import { createListing, getAdminSnapshot } from '../../../../../lib/sale/repository';
import { getSaleConfig } from '../../../../../lib/sale/config';
import { jsonResponse, redirectWithNotice } from '../../../../../lib/sale/http';
import { isSaleSlug } from '../../../../../lib/sale/slug';

export const prerender = false;

export const GET: APIRoute = async (context) => {
  if (!isSaleSlug(context.params.saleSlug)) {
    return new Response('Not found', { status: 404 });
  }

  const authorized = await requireSaleAdmin(context);

  if (!authorized) {
    return new Response('Unauthorized', { status: 401 });
  }

  const snapshot = await getAdminSnapshot();
  return jsonResponse(snapshot);
};

export const POST: APIRoute = async (context) => {
  if (!isSaleSlug(context.params.saleSlug)) {
    return new Response('Not found', { status: 404 });
  }

  const authorized = await requireSaleAdmin(context);
  const config = getSaleConfig();

  if (!authorized) {
    return Response.redirect(`/${config.routeSlug}/admin`, 303);
  }

  const formData = await context.request.formData();
  const intent = String(formData.get('intent') ?? '');

  if (intent !== 'create') {
    return new Response('Unsupported action', { status: 400 });
  }

  const input = parseListingForm(formData);
  await createListing(input);

  return redirectWithNotice(`/${config.routeSlug}/admin`, 'item-created');
};
