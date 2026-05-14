import { g as getSaleConfig, c as createSupabaseServerClient } from './supabase_CgPIPyeq.mjs';
import { g as getSaleAdminPath } from './paths_kYRNYCpp.mjs';
import { i as isSaleSlug } from './slug_AhDwt_Lt.mjs';

const prerender = false;
const POST = async ({ params, request, cookies }) => {
  if (!isSaleSlug(params.saleSlug)) {
    return new Response("Not found", { status: 404 });
  }
  getSaleConfig();
  const formData = await request.formData().catch(() => null);
  const next = String(formData?.get("next") ?? "").trim() || `${getSaleAdminPath()}?notice=signed-out`;
  const supabase = createSupabaseServerClient(cookies, request);
  await supabase.auth.signOut();
  return Response.redirect(next, 303);
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
