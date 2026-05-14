function redirectWithNotice(basePath, notice) {
  return Response.redirect(`${basePath}?notice=${encodeURIComponent(notice)}`, 303);
}
function jsonResponse(payload, init) {
  return new Response(JSON.stringify(payload), {
    ...init,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...init?.headers ?? {}
    }
  });
}

export { jsonResponse as j, redirectWithNotice as r };
