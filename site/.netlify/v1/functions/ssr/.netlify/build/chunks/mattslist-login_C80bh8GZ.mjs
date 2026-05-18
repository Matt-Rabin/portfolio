import { c as createComponent } from './astro-component_CXi9v1mS.mjs';
import 'piccolore';
import { k as renderHead, r as renderTemplate } from './ssr-function_9gJIHixD.mjs';
import 'clsx';
import { h as handleSaleAdminSignIn } from './auth_V0Kid9hT.mjs';
import { g as getSaleConfig } from './config_BSMUbtlk.mjs';
import { a as getSaleAdminSignInPath, g as getSaleAdminPath } from './paths_BzNPkTRy.mjs';

const prerender = false;
const $$MattslistLogin = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$MattslistLogin;
  if (Astro2.request.method === "POST") {
    return await handleSaleAdminSignIn(Astro2, "mattslist");
  }
  const config = getSaleConfig();
  return renderTemplate`<html lang="en" data-astro-cid-qdeiatf3> <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>mattslist login diagnostics</title>${renderHead()}</head> <body data-astro-cid-qdeiatf3> <div class="panel" data-astro-cid-qdeiatf3> <h1 data-astro-cid-qdeiatf3>mattslist login diagnostics</h1> <p data-astro-cid-qdeiatf3>This route is reachable. The sign-in form should POST here, not navigate here with GET.</p> <pre data-astro-cid-qdeiatf3>${JSON.stringify(
    {
      method: Astro2.request.method,
      requestPath: Astro2.url.pathname,
      configuredSlug: config.routeSlug,
      adminPath: getSaleAdminPath(),
      signInPath: getSaleAdminSignInPath(),
      query: Object.fromEntries(Astro2.url.searchParams.entries())
    },
    null,
    2
  )}</pre> </div> </body></html>`;
}, "C:/Users/matth/OneDrive/Documents/GitHub/portfolio/site/src/pages/mattslist-login.astro", void 0);

const $$file = "C:/Users/matth/OneDrive/Documents/GitHub/portfolio/site/src/pages/mattslist-login.astro";
const $$url = "/mattslist-login";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$MattslistLogin,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
