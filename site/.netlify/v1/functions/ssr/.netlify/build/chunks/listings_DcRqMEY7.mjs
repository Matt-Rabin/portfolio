import { j as jsonResponse } from './http_CIETM0_R.mjs';
import { l as listPublicListings } from './repository_CcQCl__c.mjs';
import { i as isSaleSlug } from './slug_DlF-GMGg.mjs';

const prerender = false;
const GET = async ({ params }) => {
  if (!isSaleSlug(params.saleSlug)) {
    return new Response("Not found", { status: 404 });
  }
  const listings = await listPublicListings();
  return jsonResponse({ listings });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
