import type { APIRoute } from 'astro';

import { requireSaleAdmin } from '../../../../../../lib/sale/admin';
import { parseListingForm } from '../../../../../../lib/sale/forms';
import {
  setListingStatus,
  unclaimListing,
  updateListing,
} from '../../../../../../lib/sale/repository';
import { getSaleAdminPath } from '../../../../../../lib/sale/paths';
import { redirectWithNotice } from '../../../../../../lib/sale/http';
import { isSaleSlug } from '../../../../../../lib/sale/slug';

export const prerender = false;

export const POST: APIRoute = async (context) => {
  if (!isSaleSlug(context.params.saleSlug)) {
    return new Response('Not found', { status: 404 });
  }

  const authorized = await requireSaleAdmin(context);
  const adminPath = getSaleAdminPath();

  if (!authorized) {
    return Response.redirect(adminPath, 303);
  }

  const id = context.params.id;

  if (!id) {
    return new Response('Missing listing id', { status: 400 });
  }

  const formData = await context.request.formData();
  const intent = String(formData.get('intent') ?? 'update');

  if (intent === 'update') {
    await updateListing(id, parseListingForm(formData));
    return redirectWithNotice(adminPath, 'item-updated');
  }

  if (intent === 'mark-available') {
    await unclaimListing(id);
    return redirectWithNotice(adminPath, 'item-unclaimed');
  }

  if (intent === 'mark-sold') {
    await setListingStatus(id, 'sold');
    return redirectWithNotice(adminPath, 'item-sold');
  }

  if (intent === 'archive') {
    await setListingStatus(id, 'archived');
    return redirectWithNotice(adminPath, 'item-archived');
  }

  return new Response('Unsupported action', { status: 400 });
};
