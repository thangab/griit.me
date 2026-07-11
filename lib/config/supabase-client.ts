import { createBrowserClient } from '@supabase/auth-helpers-nextjs';

function getSupabaseUrl() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!url) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable.');
  }

  return url;
}

function getSupabaseAnonKey() {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!key) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable.',
    );
  }

  return key;
}

function parseDocumentCookies() {
  return document.cookie
    .split('; ')
    .filter(Boolean)
    .map((cookie) => {
      const index = cookie.indexOf('=');
      const name = cookie.slice(0, index);
      const value = cookie.slice(index + 1);
      return { name, value: decodeURIComponent(value) };
    });
}

interface BrowserCookieOptions {
  path?: string;
  domain?: string;
  maxAge?: number;
  expires?: string | number | Date;
  sameSite?: boolean | 'lax' | 'strict' | 'none' | 'Lax' | 'Strict' | 'None';
  secure?: boolean;
}

function serializeCookie(
  name: string,
  value: string,
  options: BrowserCookieOptions = {},
) {
  let cookie = `${name}=${encodeURIComponent(value)}`;

  if (options.path) {
    cookie += `; Path=${options.path}`;
  } else {
    cookie += '; Path=/';
  }

  if (options.domain) {
    cookie += `; Domain=${options.domain}`;
  }

  if (options.maxAge !== undefined) {
    cookie += `; Max-Age=${options.maxAge}`;
  }

  if (options.expires) {
    cookie += `; Expires=${new Date(options.expires).toUTCString()}`;
  }

  if (options.sameSite) {
    const sameSite =
      typeof options.sameSite === 'boolean'
        ? options.sameSite
          ? 'Strict'
          : 'Lax'
        : options.sameSite;
    cookie += `; SameSite=${sameSite}`;
  } else {
    cookie += '; SameSite=Lax';
  }

  if (options.secure) {
    cookie += '; Secure';
  }

  return cookie;
}

export function createBrowserSupabaseClient() {
  return createBrowserClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    cookies: {
      getAll: async () => parseDocumentCookies(),
      setAll: async (cookies) => {
        cookies.forEach(({ name, value, options }) => {
          document.cookie = serializeCookie(name, value, options);
        });
      },
    },
  });
}
