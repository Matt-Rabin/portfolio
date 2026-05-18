import { h as handleSaleAdminSignIn } from './auth_V0Kid9hT.mjs';
import { g as getSaleConfig } from './config_BSMUbtlk.mjs';
import { a as getSaleAdminSignInPath, g as getSaleAdminPath } from './paths_BzNPkTRy.mjs';

const prerender = false;
const GET = async ({ request }) => {
  const config = getSaleConfig();
  const url = new URL(request.url);
  return new Response(
    `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>mattslist login diagnostics</title>
    <style>
      body { background:#0d0d0d; color:#e8e8e0; font:16px/1.5 Inter, system-ui, sans-serif; padding:32px; }
      code, pre { font:14px/1.5 ui-monospace, SFMono-Regular, Consolas, monospace; }
      .panel { max-width:860px; margin:0 auto; background:#141414; border:1px solid #252525; border-radius:16px; padding:24px; }
      h1 { margin:0 0 12px; font-size:24px; }
      p { color:#aaa; }
      pre { white-space:pre-wrap; background:#101010; padding:16px; border-radius:12px; border:1px solid #1e1e1e; }
    </style>
  </head>
  <body>
    <div class="panel">
      <h1>mattslist login diagnostics</h1>
      <p>This route is reachable. The sign-in form should POST here, not navigate here with GET.</p>
      <pre>${JSON.stringify(
      {
        method: request.method,
        requestPath: url.pathname,
        configuredSlug: config.routeSlug,
        adminPath: getSaleAdminPath(),
        signInPath: getSaleAdminSignInPath(),
        query: Object.fromEntries(url.searchParams.entries())
      },
      null,
      2
    )}</pre>
    </div>
  </body>
</html>`,
    {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store"
      }
    }
  );
};
const POST = async (context) => handleSaleAdminSignIn(context, "mattslist");

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
