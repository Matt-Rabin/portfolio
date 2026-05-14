import type { APIContext } from 'astro';

import { getSaleAdminUser } from '../supabase';

export async function requireSaleAdmin(context: APIContext): Promise<boolean> {
  const user = await getSaleAdminUser(context);
  return Boolean(user);
}
