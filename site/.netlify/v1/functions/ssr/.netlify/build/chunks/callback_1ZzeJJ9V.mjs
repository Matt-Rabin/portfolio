import { c as createComponent } from './astro-component_D0QzsuL4.mjs';
import 'piccolore';
import { m as maybeRenderHead, r as renderTemplate } from './ssr-function_D-TDlA5T.mjs';
import 'clsx';
import { c as createSupabaseServerClient } from './supabase_B-8P-iQt.mjs';
import { g as getSaleConfig } from './config_BSMUbtlk.mjs';
import { g as getSaleAdminPath } from './paths_BzNPkTRy.mjs';

const prerender = false;
const $$Callback = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Callback;
  const config = getSaleConfig();
  let callbackError = null;
  Astro2.response.headers.set("Cache-Control", "no-store");
  if (config.routeSlug !== "mattslist") {
    Astro2.response.status = 404;
  } else {
    const tokenHash = Astro2.url.searchParams.get("token_hash");
    const code = Astro2.url.searchParams.get("code");
    const type = Astro2.url.searchParams.get("type");
    const next = Astro2.url.searchParams.get("next") || getSaleAdminPath();
    try {
      const supabase = createSupabaseServerClient(Astro2.cookies, Astro2.request);
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          throw error;
        }
      } else if (tokenHash && type) {
        const { error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type
        });
        if (error) {
          throw error;
        }
      }
      return Astro2.redirect(next);
    } catch (error) {
      Astro2.response.status = 500;
      callbackError = error instanceof Error ? error.message : "Unknown auth callback error";
      console.error("Failed to complete mattslist auth callback.", error);
    }
  }
  return renderTemplate`<html lang="en"> ${maybeRenderHead()}<body> ${callbackError ? `Auth callback failed: ${callbackError}` : "Redirecting..."} </body></html>`;
}, "C:/Users/matth/OneDrive/Documents/GitHub/portfolio/site/src/pages/mattslist/auth/callback.astro", void 0);

const $$file = "C:/Users/matth/OneDrive/Documents/GitHub/portfolio/site/src/pages/mattslist/auth/callback.astro";
const $$url = "/mattslist/auth/callback";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Callback,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

export { $$Callback as $, _page as _ };
