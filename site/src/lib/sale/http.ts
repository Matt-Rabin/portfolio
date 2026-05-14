export function redirectWithNotice(basePath: string, notice: string): Response {
  return Response.redirect(`${basePath}?notice=${encodeURIComponent(notice)}`, 303);
}

export function jsonResponse(payload: unknown, init?: ResponseInit): Response {
  return new Response(JSON.stringify(payload), {
    ...init,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...(init?.headers ?? {}),
    },
  });
}
