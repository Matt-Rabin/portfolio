import { g as getSaleConfig, c as createSupabaseServerClient } from './supabase_CgPIPyeq.mjs';
import { i as isSaleSlug } from './slug_AhDwt_Lt.mjs';

const prerender = false;
const POST = async ({ params, request, cookies }) => {
  if (!isSaleSlug(params.saleSlug)) {
    return new Response("Not found", { status: 404 });
  }
  const config = getSaleConfig();
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email || email !== config.adminEmail) {
    return Response.redirect(`/${config.routeSlug}/admin`, 303);
  }
  const origin = new URL(request.url).origin;
  const callbackUrl = new URL(`/${config.routeSlug}/auth/callback`, origin);
  callbackUrl.searchParams.set("next", `/${config.routeSlug}/admin`);
  const supabase = createSupabaseServerClient(cookies, request);
  await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false,
      emailRedirectTo: callbackUrl.toString()
    }
  });
  return Response.redirect(`/${config.routeSlug}/admin?sent=1`, 303);
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
