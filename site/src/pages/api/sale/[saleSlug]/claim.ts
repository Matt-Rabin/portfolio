import type { APIRoute } from 'astro';

import { parseClaimPayload } from '../../../../lib/sale/forms';
import { jsonResponse } from '../../../../lib/sale/http';
import { claimListing, ListingUnavailableError } from '../../../../lib/sale/repository';
import { isSaleSlug } from '../../../../lib/sale/slug';

export const prerender = false;

export const POST: APIRoute = async ({ params, request }) => {
  if (!isSaleSlug(params.saleSlug)) {
    return new Response('Not found', { status: 404 });
  }

  try {
    const payload = parseClaimPayload(await request.json());
    const listing = await claimListing(payload);

    return jsonResponse({
      ok: true,
      listing,
      message: `${listing.name} is now claimed. I will follow up by email shortly.`,
    });
  } catch (error) {
    if (error instanceof ListingUnavailableError) {
      return jsonResponse({ ok: false, message: error.message }, { status: 409 });
    }

    const message = error instanceof Error ? error.message : 'Unable to claim this item right now.';
    return jsonResponse({ ok: false, message }, { status: 400 });
  }
};
