import { a as getSaleAdminUser } from './supabase_D70iw1RZ.mjs';

async function requireSaleAdmin(context) {
  const user = await getSaleAdminUser(context);
  return Boolean(user);
}

export { requireSaleAdmin as r };
