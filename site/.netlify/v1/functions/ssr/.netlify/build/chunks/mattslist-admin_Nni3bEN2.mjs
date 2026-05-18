import { c as createComponent } from './astro-component_X1M1mvdV.mjs';
import 'piccolore';
import { i as renderComponent, r as renderTemplate } from './ssr-function_CVO_rAja.mjs';
import { $ as $$Admin } from './admin_7YDqX8-5.mjs';

const prerender = false;
const $$MattslistAdmin = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "AdminPage", $$Admin, {})}`;
}, "C:/Users/matth/OneDrive/Documents/GitHub/portfolio/site/src/pages/mattslist-admin.astro", void 0);

const $$file = "C:/Users/matth/OneDrive/Documents/GitHub/portfolio/site/src/pages/mattslist-admin.astro";
const $$url = "/mattslist-admin";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$MattslistAdmin,
	file: $$file,
	prerender,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
