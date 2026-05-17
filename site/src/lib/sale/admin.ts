import { createHmac, timingSafeEqual } from 'node:crypto';
import type { APIContext } from 'astro';

const SESSION_COOKIE_NAME = 'sale_admin_session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 14;

function readServerEnv(name: string): string | undefined {
  const value = process.env[name];
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined;
}

function getAdminPassword(): string {
  const value = readServerEnv('SALE_ADMIN_PASSWORD');

  if (!value) {
    throw new Error('Missing required environment variable: SALE_ADMIN_PASSWORD');
  }

  return value;
}

function getSessionSecret(): string {
  return (
    readServerEnv('SALE_ADMIN_SESSION_SECRET') ||
    readServerEnv('SUPABASE_SECRET_KEY') ||
    readServerEnv('SUPABASE_SERVICE_ROLE_KEY') ||
    (() => {
      throw new Error(
        'Missing required environment variable: SALE_ADMIN_SESSION_SECRET, SUPABASE_SECRET_KEY, or SUPABASE_SERVICE_ROLE_KEY',
      );
    })()
  );
}

function sign(value: string): string {
  return createHmac('sha256', getSessionSecret()).update(value).digest('base64url');
}

function createSessionValue(routeSlug: string): string {
  const expiresAt = Date.now() + SESSION_MAX_AGE * 1000;
  const payload = `${routeSlug}:${expiresAt}`;
  return `${payload}.${sign(payload)}`;
}

function verifySessionValue(value: string, routeSlug: string): boolean {
  const separatorIndex = value.lastIndexOf('.');

  if (separatorIndex === -1) {
    return false;
  }

  const payload = value.slice(0, separatorIndex);
  const signature = value.slice(separatorIndex + 1);
  const expectedSignature = sign(payload);
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (actualBuffer.length !== expectedBuffer.length) {
    return false;
  }

  if (!timingSafeEqual(actualBuffer, expectedBuffer)) {
    return false;
  }

  const [sessionSlug, expiresAtRaw] = payload.split(':');
  const expiresAt = Number(expiresAtRaw);

  if (sessionSlug !== routeSlug || !Number.isFinite(expiresAt)) {
    return false;
  }

  return expiresAt > Date.now();
}

export function verifySaleAdminPassword(password: string): boolean {
  const actualBuffer = createHmac('sha256', getSessionSecret()).update(password).digest();
  const expectedBuffer = createHmac('sha256', getSessionSecret()).update(getAdminPassword()).digest();
  return timingSafeEqual(actualBuffer, expectedBuffer);
}

export function setSaleAdminSession(context: APIContext, routeSlug: string): void {
  context.cookies.set(SESSION_COOKIE_NAME, createSessionValue(routeSlug), {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: context.url.protocol === 'https:',
    maxAge: SESSION_MAX_AGE,
  });
}

export function clearSaleAdminSession(context: APIContext): void {
  context.cookies.delete(SESSION_COOKIE_NAME, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: context.url.protocol === 'https:',
  });
}

export async function requireSaleAdmin(context: APIContext): Promise<boolean> {
  const session = context.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (!session) {
    return false;
  }

  const routeSlug = context.params.saleSlug ?? process.env.SALE_ROUTE_SLUG?.trim();

  if (!routeSlug) {
    return false;
  }

  try {
    return verifySessionValue(session, routeSlug);
  } catch {
    return false;
  }
}
