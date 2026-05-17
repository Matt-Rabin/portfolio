import { createServerClient } from '@supabase/ssr';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { APIContext } from 'astro';
import { parse as parseCookieHeader } from 'cookie';

type CookieStore = APIContext['cookies'];

function readServerEnv(name: string): string | undefined {
  const value = process.env[name];
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined;
}

function getProjectUrl(): string {
  const value = readServerEnv('PUBLIC_SUPABASE_URL');

  if (!value) {
    throw new Error('Missing required environment variable: PUBLIC_SUPABASE_URL');
  }

  return value;
}

function getPublishableKey(): string {
  const value = readServerEnv('PUBLIC_SUPABASE_ANON_KEY');

  if (!value) {
    throw new Error('Missing required environment variable: PUBLIC_SUPABASE_ANON_KEY');
  }

  return value;
}

function getServiceKey(): string {
  const value = readServerEnv('SUPABASE_SECRET_KEY') || readServerEnv('SUPABASE_SERVICE_ROLE_KEY');

  if (!value) {
    throw new Error(
      'Missing required environment variable: SUPABASE_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY',
    );
  }

  return value;
}

export function createSupabaseServerClient(cookies: CookieStore, request: Request) {
  const requestCookies = parseCookieHeader(request.headers.get('cookie') ?? '');

  return createServerClient(getProjectUrl(), getPublishableKey(), {
    request,
    cookies: {
      getAll() {
        return Object.entries(requestCookies).map(([name, value]) => ({ name, value }));
      },
      setAll(cookiesToSet) {
        for (const { name, value, options } of cookiesToSet) {
          cookies.set(name, value, options);
        }
      },
    },
  });
}

export function createSupabaseAdminClient(): SupabaseClient {
  return createClient(getProjectUrl(), getServiceKey(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
