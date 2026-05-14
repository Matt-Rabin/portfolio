import { a as getSaleAdminUser } from './supabase_CgPIPyeq.mjs';

async function requireSaleAdmin(context) {
  const user = await getSaleAdminUser(context);
  return Boolean(user);
}

export { requireSaleAdmin as r };
