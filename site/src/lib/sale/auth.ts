import type { APIContext } from 'astro';

import {
  clearSaleAdminSession,
  setSaleAdminSession,
  verifySaleAdminPassword,
} from './admin';
import { getSaleAdminPath } from './paths';
import { isSaleSlug } from './slug';
import { getSaleConfig } from './config';

export function redirectWithCookies(cookies: APIContext['cookies'], location: string) {
  const response = Response.redirect(location, 303);

  for (const headerValue of cookies.consume()) {
    response.headers.append('set-cookie', headerValue);
  }

  return response;
}

function withError(basePath: string, notice: string, error: string): string {
  const url = new URL(basePath, 'https://sale.local');
  url.searchParams.set('notice', notice);
  url.searchParams.set('error', error);
  return `${url.pathname}${url.search}`;
}

export async function handleSaleAdminSignIn(
  context: APIContext,
  routeSlug: string | undefined,
): Promise<Response> {
  const nextFallback = getSaleAdminPath();

  if (!isSaleSlug(routeSlug)) {
    const config = getSaleConfig();
    return redirectWithCookies(
      context.cookies,
      withError(
        nextFallback,
        'sign-in-error',
        `slug mismatch: route=${routeSlug ?? 'missing'} env=${config.routeSlug}`,
      ),
    );
  }

  const formData = await context.request.formData();
  const password = String(formData.get('password') ?? '');
  const next = String(formData.get('next') ?? '').trim() || nextFallback;

  try {
    if (!verifySaleAdminPassword(password)) {
      return redirectWithCookies(context.cookies, `${next}?notice=invalid-password`);
    }

    setSaleAdminSession(context, routeSlug);
    return redirectWithCookies(context.cookies, `${next}?notice=signed-in`);
  } catch (error) {
    console.error('Failed to sign into sale admin.', error);
    return redirectWithCookies(
      context.cookies,
      withError(
        next,
        'sign-in-error',
        error instanceof Error ? error.message : 'unknown sign-in error',
      ),
    );
  }
}

export async function handleSaleAdminSignOut(
  context: APIContext,
  routeSlug: string | undefined,
): Promise<Response> {
  const nextFallback = `${getSaleAdminPath()}?notice=signed-out`;

  if (!isSaleSlug(routeSlug)) {
    const config = getSaleConfig();
    return redirectWithCookies(
      context.cookies,
      withError(
        getSaleAdminPath(),
        'sign-out-error',
        `slug mismatch: route=${routeSlug ?? 'missing'} env=${config.routeSlug}`,
      ),
    );
  }

  const formData = await context.request.formData().catch(() => null);
  const next = String(formData?.get('next') ?? '').trim() || nextFallback;

  clearSaleAdminSession(context);
  return redirectWithCookies(context.cookies, next);
}
