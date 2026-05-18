import type { APIRoute } from 'astro';

import { handleSaleAdminSignOut } from '../../../lib/sale/auth';

export const prerender = false;

export const POST: APIRoute = async (context) => handleSaleAdminSignOut(context, 'mattslist');
