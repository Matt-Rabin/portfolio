import { c as createComponent } from './astro-component_CXi9v1mS.mjs';
import 'piccolore';
import { k as renderHead, r as renderTemplate } from './ssr-function_9gJIHixD.mjs';
import 'clsx';
import { a as handleSaleAdminSignOut } from './auth_V0Kid9hT.mjs';
import { g as getSaleConfig } from './config_BSMUbtlk.mjs';
import { b as getSaleAdminSignOutPath, g as getSaleAdminPath } from './paths_BzNPkTRy.mjs';

const prerender = false;
const $$MattslistLogout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$MattslistLogout;
  if (Astro2.request.method === "POST") {
    return await handleSaleAdminSignOut(Astro2, "mattslist");
  }
  const config = getSaleConfig();
  return renderTemplate`<html lang="en" data-astro-cid-p7r26kek> <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>mattslist logout diagnostics</title>${renderHead()}</head> <body data-astro-cid-p7r26kek> <div class="panel" data-astro-cid-p7r26kek> <h1 data-astro-cid-p7r26kek>mattslist logout diagnostics</h1> <p data-astro-cid-p7r26kek>This route is reachable. The sign-out form should POST here, not navigate here with GET.</p> <pre data-astro-cid-p7r26kek>${JSON.stringify(
    {
      method: Astro2.request.method,
      requestPath: Astro2.url.pathname,
      configuredSlug: config.routeSlug,
      adminPath: getSaleAdminPath(),
      signOutPath: getSaleAdminSignOutPath(),
      query: Object.fromEntries(Astro2.url.searchParams.entries())
    },
    null,
    2
  )}</pre> </div> </body></html>`;
}, "C:/Users/matth/OneDrive/Documents/GitHub/portfolio/site/src/pages/mattslist-logout.astro", void 0);

const $$file = "C:/Users/matth/OneDrive/Documents/GitHub/portfolio/site/src/pages/mattslist-logout.astro";
const $$url = "/mattslist-logout";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$MattslistLogout,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
