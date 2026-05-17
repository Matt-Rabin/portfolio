import { c as createComponent } from './astro-component_nxZAq9te.mjs';
import 'piccolore';
import { f as addAttribute, k as renderHead, l as renderSlot, r as renderTemplate } from './ssr-function_ti51K92L.mjs';
import 'clsx';

const $$SaleLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$SaleLayout;
  const { title, description = "Private moving sale listings for direct visitors only." } = Astro2.props;
  return renderTemplate`<html lang="en"> <head><meta charset="utf-8"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="icon" href="/favicon.ico"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description"${addAttribute(description, "content")}><meta name="robots" content="noindex, nofollow"><meta name="generator"${addAttribute(Astro2.generator, "content")}><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Inter:wght@300;400;500;600;700&family=Unbounded:wght@500;700;800&display=swap" rel="stylesheet"><title>${title}</title>${renderHead()}</head> <body class="sale-shell"> <main> ${renderSlot($$result, $$slots["default"])} </main> </body></html>`;
}, "C:/Users/matth/OneDrive/Documents/GitHub/portfolio/site/src/layouts/SaleLayout.astro", void 0);

export { $$SaleLayout as $ };
