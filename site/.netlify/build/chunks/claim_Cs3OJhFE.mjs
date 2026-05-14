import { a as parseClaimPayload } from './forms_CPReg9uO.mjs';
import { j as jsonResponse } from './http_CIETM0_R.mjs';
import { b as claimListing, L as ListingUnavailableError } from './repository_CI7S-sa6.mjs';
import { i as isSaleSlug } from './slug_AhDwt_Lt.mjs';

const prerender = false;
const POST = async ({ params, request }) => {
  if (!isSaleSlug(params.saleSlug)) {
    return new Response("Not found", { status: 404 });
  }
  try {
    const payload = parseClaimPayload(await request.json());
    const listing = await claimListing(payload);
    return jsonResponse({
      ok: true,
      listing,
      message: `${listing.name} is now claimed. I will follow up by email shortly.`
    });
  } catch (error) {
    if (error instanceof ListingUnavailableError) {
      return jsonResponse({ ok: false, message: error.message }, { status: 409 });
    }
    const message = error instanceof Error ? error.message : "Unable to claim this item right now.";
    return jsonResponse({ ok: false, message }, { status: 400 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
