import { c as createComponent } from './astro-component_D0QzsuL4.mjs';
import 'piccolore';
import { i as renderComponent, r as renderTemplate } from './ssr-function_D-TDlA5T.mjs';
import { $ as $$Callback$1 } from './callback_1ZzeJJ9V.mjs';

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
