import { a as getSaleAdminUser } from './slug_ChKz0nzP.mjs';

async function requireSaleAdmin(context) {
  const user = await getSaleAdminUser(context);
  return Boolean(user);
}

export { requireSaleAdmin as r };
