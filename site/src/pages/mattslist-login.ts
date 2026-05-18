import type { APIRoute } from 'astro';

import { handleSaleAdminSignIn } from '../lib/sale/auth';

export const prerender = false;

export const POST: APIRoute = async (context) => handleSaleAdminSignIn(context, 'mattslist');
