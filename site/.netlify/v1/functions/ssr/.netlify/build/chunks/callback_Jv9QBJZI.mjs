import { c as createComponent } from './astro-component_DyHH2-5Q.mjs';
import 'piccolore';
import { i as renderComponent, r as renderTemplate } from './ssr-function_1OL0fpva.mjs';
import { $ as $$Callback$1 } from './callback_BciBNedY.mjs';

const prerender = false;
const $$Callback = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "CallbackPage", $$Callback$1, {})}`;
}, "C:/Users/matth/OneDrive/Documents/GitHub/portfolio/site/src/pages/mattslist-auth/callback.astro", void 0);

const $$file = "C:/Users/matth/OneDrive/Documents/GitHub/portfolio/site/src/pages/mattslist-auth/callback.astro";
const $$url = "/mattslist-auth/callback";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Callback,
	file: $$file,
	prerender,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
