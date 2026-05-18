import { a as handleSaleAdminSignOut } from './auth_V0Kid9hT.mjs';

const prerender = false;
const POST = async (context) => handleSaleAdminSignOut(context, context.params.saleSlug);

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
