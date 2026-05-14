import { c as createComponent } from './astro-component_D_p4jkZm.mjs';
import 'piccolore';
import { m as maybeRenderHead, r as renderTemplate } from './ssr-function_CPTlrKnT.mjs';
import 'clsx';
import { g as getSaleConfig, i as isSaleSlug, c as createSupabaseServerClient } from './slug_ChKz0nzP.mjs';

const prerender = false;
const $$Callback = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Callback;
  const config = getSaleConfig();
  const saleSlug = Astro2.params.saleSlug;
  Astro2.response.headers.set("Cache-Control", "no-store");
  if (!isSaleSlug(saleSlug)) {
    Astro2.response.status = 404;
  } else {
    const tokenHash = Astro2.url.searchParams.get("token_hash");
    const type = Astro2.url.searchParams.get("type");
    const next = Astro2.url.searchParams.get("next") || `/${config.routeSlug}/admin`;
    if (tokenHash && type) {
      const supabase = createSupabaseServerClient(Astro2.cookies, Astro2.request);
      await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type
      });
    }
    return Astro2.redirect(next);
  }
  return renderTemplate`<html lang="en"> ${maybeRenderHead()}<body>Redirecting…</body></html>`;
}, "C:/Users/matth/OneDrive/Documents/GitHub/portfolio/site/src/pages/[saleSlug]/auth/callback.astro", void 0);

const $$file = "C:/Users/matth/OneDrive/Documents/GitHub/portfolio/site/src/pages/[saleSlug]/auth/callback.astro";
const $$url = "/[saleSlug]/auth/callback";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Callback,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
