import { h as handleSaleAdminSignIn } from './auth_CcgVKkdV.mjs';

const prerender = false;
const POST = async (context) => handleSaleAdminSignIn(context, "mattslist");

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	POST,
	prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
