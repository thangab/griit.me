import { lookup } from 'node:dns/promises';
import { isIP } from 'node:net';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  createServerSupabaseClient,
  createServiceSupabaseClient,
} from '@/lib/config/supabase-server';

export const runtime = 'nodejs';

const requestSchema = z.object({
  url: z.string().trim().url().max(1000),
});
const maxHtmlBytes = 2 * 1024 * 1024;
const maxImageBytes = 5 * 1024 * 1024;
const imageExtensions: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
};

function isPrivateAddress(address: string) {
  if (isIP(address) === 4) {
    const [a, b] = address.split('.').map(Number);
    return (
      a === 0 ||
      a === 10 ||
      a === 127 ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      a >= 224
    );
  }

  const normalized = address.toLowerCase();
  return (
    normalized === '::' ||
    normalized === '::1' ||
    normalized.startsWith('fc') ||
    normalized.startsWith('fd') ||
    normalized.startsWith('fe8') ||
    normalized.startsWith('fe9') ||
    normalized.startsWith('fea') ||
    normalized.startsWith('feb') ||
    normalized.startsWith('::ffff:127.') ||
    normalized.startsWith('::ffff:10.') ||
    normalized.startsWith('::ffff:192.168.')
  );
}

async function assertSafeUrl(value: string) {
  const url = new URL(value);
  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error('Only HTTP and HTTPS links are supported.');
  }
  if (url.username || url.password || url.hostname === 'localhost') {
    throw new Error('This link cannot be previewed.');
  }

  const addresses = isIP(url.hostname)
    ? [{ address: url.hostname }]
    : await lookup(url.hostname, { all: true });
  if (
    !addresses.length ||
    addresses.some(({ address }) => isPrivateAddress(address))
  ) {
    throw new Error('This link cannot be previewed.');
  }

  return url;
}

async function safeFetch(value: string, accept: string, maxRedirects = 3) {
  let current = value;

  for (let index = 0; index <= maxRedirects; index += 1) {
    const url = await assertSafeUrl(current);
    const response = await fetch(url, {
      redirect: 'manual',
      headers: {
        Accept: accept,
        'User-Agent': 'Griit-Link-Preview/1.0',
      },
      signal: AbortSignal.timeout(8000),
    });

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location');
      if (!location || index === maxRedirects) {
        throw new Error('Too many redirects.');
      }
      current = new URL(location, url).toString();
      continue;
    }

    return { response, finalUrl: url.toString() };
  }

  throw new Error('Unable to load this link.');
}

async function readLimited(response: Response, maxBytes: number) {
  const declaredLength = Number(response.headers.get('content-length') || 0);
  if (declaredLength > maxBytes) throw new Error('The response is too large.');

  const reader = response.body?.getReader();
  if (!reader) return new Uint8Array();
  const chunks: Uint8Array[] = [];
  let size = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > maxBytes) {
      await reader.cancel();
      throw new Error('The response is too large.');
    }
    chunks.push(value);
  }

  const output = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    output.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return output;
}

function decodeHtml(value: string) {
  return value
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&#(\d+);/g, (_, code: string) =>
      String.fromCodePoint(Number(code)),
    )
    .trim();
}

function getMeta(html: string, names: string[]) {
  const tags = html.match(/<meta\s+[^>]*>/gi) ?? [];
  for (const tag of tags) {
    const attributes = Object.fromEntries(
      Array.from(tag.matchAll(/([\w:-]+)\s*=\s*["']([^"']*)["']/g)).map(
        ([, key, value]) => [key.toLowerCase(), value],
      ),
    );
    const key = (attributes.property || attributes.name || '').toLowerCase();
    if (names.includes(key) && attributes.content) {
      return decodeHtml(attributes.content);
    }
  }
  return '';
}

async function storePreviewImage(imageUrl: string, userId: string) {
  if (!imageUrl) return '';

  try {
    const { response } = await safeFetch(imageUrl, 'image/*');
    if (!response.ok) return '';
    const contentType =
      response.headers.get('content-type')?.split(';')[0] ?? '';
    const extension = imageExtensions[contentType];
    if (!extension) return '';
    const bytes = await readLimited(response, maxImageBytes);
    const path = `${userId}/offers/${crypto.randomUUID()}.${extension}`;
    const supabase = createServiceSupabaseClient();
    const { error } = await supabase.storage
      .from('profile-media')
      .upload(path, bytes, { contentType, cacheControl: '31536000' });
    if (error) return '';
    return supabase.storage.from('profile-media').getPublicUrl(path).data
      .publicUrl;
  } catch {
    return '';
  }
}

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return NextResponse.json(
      { error: 'You need to be signed in.' },
      { status: 401 },
    );
  }

  try {
    const parsed = requestSchema.parse(await request.json());
    const { response, finalUrl } = await safeFetch(
      parsed.url,
      'text/html,application/xhtml+xml',
    );
    if (!response.ok)
      throw new Error('The website did not return a valid page.');
    const contentType = response.headers.get('content-type') ?? '';
    if (!contentType.includes('text/html'))
      throw new Error('This URL is not a web page.');

    const html = new TextDecoder().decode(
      await readLimited(response, maxHtmlBytes),
    );
    const pageUrl = new URL(finalUrl);
    const title =
      getMeta(html, ['og:title', 'twitter:title']) ||
      decodeHtml(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? '');
    const description = getMeta(html, [
      'og:description',
      'twitter:description',
      'description',
    ]);
    const rawImage = getMeta(html, [
      'og:image',
      'twitter:image',
      'twitter:image:src',
    ]);
    const imageUrl = await storePreviewImage(
      rawImage ? new URL(rawImage, pageUrl).toString() : '',
      userData.user.id,
    );

    return NextResponse.json({
      title: title.slice(0, 160),
      description: description.slice(0, 500),
      siteName: (getMeta(html, ['og:site_name']) || pageUrl.hostname).slice(
        0,
        100,
      ),
      imageUrl,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Unable to preview this link.',
      },
      { status: 400 },
    );
  }
}
