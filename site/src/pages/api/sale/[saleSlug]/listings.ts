import type { APIRoute } from 'astro';

import { jsonResponse } from '../../../../lib/sale/http';
import { listPublicListings } from '../../../../lib/sale/repository';
import { isSaleSlug } from '../../../../lib/sale/slug';

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  if (!isSaleSlug(params.saleSlug)) {
    return new Response('Not found', { status: 404 });
  }

  const listings = await listPublicListings();
  return jsonResponse({ listings });
};
