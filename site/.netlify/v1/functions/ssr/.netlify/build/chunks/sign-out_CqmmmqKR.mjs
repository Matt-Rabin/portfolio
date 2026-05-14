import { i as isSaleSlug, g as getSaleConfig, c as createSupabaseServerClient } from './slug_DlF-GMGg.mjs';

const prerender = false;
const POST = async ({ params, request, cookies }) => {
  if (!isSaleSlug(params.saleSlug)) {
    return new Response("Not found", { status: 404 });
  }
  const config = getSaleConfig();
  const supabase = createSupabaseServerClient(cookies, request);
  await supabase.auth.signOut();
  return Response.redirect(`/${config.routeSlug}/admin?notice=signed-out`, 303);
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
