import { createHmac, randomUUID } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createServiceSupabaseClient } from '@/lib/config/supabase-server';

const visitorCookieName = 'griit_visitor';

const analyticsEventSchema = z
  .object({
    profileId: z.number().int().positive(),
    eventType: z.enum([
      'profile_view',
      'block_click',
      'social_click',
      'goal_click',
      'sponsor_click',
      'gallery_open',
      'promo_copy',
      'media_open',
    ]),
    targetType: z
      .enum(['block', 'social', 'goal', 'sponsor', 'gallery'])
      .optional(),
    targetKey: z.string().uuid().optional(),
    referrer: z.string().trim().max(1000).optional(),
    utmSource: z.string().trim().max(120).optional(),
    utmMedium: z.string().trim().max(120).optional(),
    utmCampaign: z.string().trim().max(160).optional(),
  })
  .superRefine((event, context) => {
    if (event.eventType === 'profile_view') return;
    if (!event.targetType || !event.targetKey) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'A target is required for interaction events.',
      });
    }
  });

const expectedTargetType = {
  block_click: 'block',
  social_click: 'social',
  goal_click: 'goal',
  sponsor_click: 'sponsor',
  gallery_open: 'gallery',
  promo_copy: 'block',
  media_open: 'block',
} as const;

function cleanHeader(value: string | null, maxLength: number) {
  if (!value) return null;
  try {
    return decodeURIComponent(value).trim().slice(0, maxLength) || null;
  } catch {
    return value.trim().slice(0, maxLength) || null;
  }
}

function getReferrerHost(value?: string) {
  if (!value) return null;
  try {
    return new URL(value).hostname.replace(/^www\./, '').slice(0, 255) || null;
  } catch {
    return null;
  }
}

function getClientDetails(userAgent: string) {
  const browser = /Edg\//i.test(userAgent)
    ? 'Edge'
    : /OPR\//i.test(userAgent)
      ? 'Opera'
      : /Chrome\//i.test(userAgent)
        ? 'Chrome'
        : /Firefox\//i.test(userAgent)
          ? 'Firefox'
          : /Safari\//i.test(userAgent)
            ? 'Safari'
            : 'Other';
  const os = /iPhone|iPad|iPod/i.test(userAgent)
    ? 'iOS'
    : /Android/i.test(userAgent)
      ? 'Android'
      : /Windows/i.test(userAgent)
        ? 'Windows'
        : /Macintosh|Mac OS X/i.test(userAgent)
          ? 'macOS'
          : /Linux/i.test(userAgent)
            ? 'Linux'
            : 'Other';
  const deviceType = /iPad|Tablet/i.test(userAgent)
    ? 'tablet'
    : /Mobile|iPhone|iPod|Android/i.test(userAgent)
      ? 'mobile'
      : 'desktop';

  return { browser, os, deviceType };
}

function getVisitorHash(visitorId: string) {
  const secret =
    process.env.ANALYTICS_HASH_SECRET ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secret) throw new Error('Missing analytics hashing secret.');
  return createHmac('sha256', secret).update(visitorId).digest('hex');
}

async function resolveTarget(
  profileId: number,
  targetType: Exclude<
    z.infer<typeof analyticsEventSchema>['targetType'],
    undefined
  >,
  targetKey: string,
) {
  const supabase = createServiceSupabaseClient();

  if (targetType === 'block') {
    const { data } = await supabase
      .from('profile_blocks')
      .select('analytics_key, type, title, content')
      .eq('profile_id', profileId)
      .eq('analytics_key', targetKey)
      .eq('is_enabled', true)
      .is('deleted_at', null)
      .maybeSingle();
    if (!data) return null;
    const content = (data.content ?? {}) as Record<string, unknown>;
    const contentTitle =
      typeof content.title === 'string' ? content.title.trim() : '';
    return {
      label: (contentTitle || data.title || data.type).slice(0, 160),
    };
  }

  if (targetType === 'social') {
    const { data } = await supabase
      .from('profile_social_links')
      .select('platform, label')
      .eq('profile_id', profileId)
      .eq('analytics_key', targetKey)
      .eq('is_enabled', true)
      .is('deleted_at', null)
      .maybeSingle();
    if (!data) return null;
    return { label: (data.label || data.platform).slice(0, 160) };
  }

  if (targetType === 'goal') {
    const { data } = await supabase
      .from('profile_goals')
      .select('title')
      .eq('profile_id', profileId)
      .eq('analytics_key', targetKey)
      .eq('is_enabled', true)
      .is('deleted_at', null)
      .maybeSingle();
    return data ? { label: data.title.slice(0, 160) } : null;
  }

  if (targetType === 'sponsor') {
    const { data } = await supabase
      .from('profile_sponsors')
      .select('name')
      .eq('profile_id', profileId)
      .eq('analytics_key', targetKey)
      .eq('is_enabled', true)
      .is('deleted_at', null)
      .maybeSingle();
    return data ? { label: data.name.slice(0, 160) } : null;
  }

  const { data } = await supabase
    .from('profile_gallery_items')
    .select('caption')
    .eq('profile_id', profileId)
    .eq('analytics_key', targetKey)
    .eq('is_enabled', true)
    .is('deleted_at', null)
    .maybeSingle();
  return data
    ? { label: (data.caption || 'Gallery image').slice(0, 160) }
    : null;
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 });
  }

  const parsed = analyticsEventSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid analytics event.' },
      { status: 400 },
    );
  }

  const event = parsed.data;
  const supabase = createServiceSupabaseClient();
  const { data: profile } = await supabase
    .from('public_profiles')
    .select('id')
    .eq('id', event.profileId)
    .eq('is_published', true)
    .maybeSingle();
  if (!profile) {
    return NextResponse.json({ error: 'Profile not found.' }, { status: 404 });
  }

  const requiredTarget =
    event.eventType === 'profile_view'
      ? null
      : expectedTargetType[event.eventType];
  if (requiredTarget && event.targetType !== requiredTarget) {
    return NextResponse.json(
      { error: 'Invalid analytics target.' },
      { status: 400 },
    );
  }

  const target =
    event.targetType && event.targetKey
      ? await resolveTarget(event.profileId, event.targetType, event.targetKey)
      : null;
  if (requiredTarget && !target) {
    return NextResponse.json(
      { error: 'Analytics target not found.' },
      { status: 404 },
    );
  }

  const existingVisitorId = request.cookies.get(visitorCookieName)?.value;
  const visitorId =
    existingVisitorId && /^[0-9a-f-]{36}$/i.test(existingVisitorId)
      ? existingVisitorId
      : randomUUID();
  const visitorHash = getVisitorHash(visitorId);
  const thirtySecondsAgo = new Date(Date.now() - 30_000).toISOString();
  const oneMinuteAgo = new Date(Date.now() - 60_000).toISOString();

  const { count: recentEventCount } = await supabase
    .from('profile_analytics_events')
    .select('id', { count: 'exact', head: true })
    .eq('profile_id', event.profileId)
    .eq('visitor_hash', visitorHash)
    .gte('occurred_at', oneMinuteAgo);
  if ((recentEventCount ?? 0) >= 120) {
    return NextResponse.json({ error: 'Too many events.' }, { status: 429 });
  }

  if (event.eventType === 'profile_view') {
    const { count } = await supabase
      .from('profile_analytics_events')
      .select('id', { count: 'exact', head: true })
      .eq('profile_id', event.profileId)
      .eq('event_type', 'profile_view')
      .eq('visitor_hash', visitorHash)
      .gte('occurred_at', thirtySecondsAgo);
    if (count) {
      return NextResponse.json({ tracked: false, reason: 'duplicate' });
    }
  }

  const userAgent = request.headers.get('user-agent') ?? '';
  const { browser, os, deviceType } = getClientDetails(userAgent);
  const { error } = await supabase.from('profile_analytics_events').insert({
    profile_id: event.profileId,
    event_type: event.eventType,
    target_type: event.targetType ?? null,
    target_key: event.targetKey ?? null,
    target_label: target?.label ?? null,
    visitor_hash: visitorHash,
    referrer_host: getReferrerHost(event.referrer),
    utm_source: event.utmSource || null,
    utm_medium: event.utmMedium || null,
    utm_campaign: event.utmCampaign || null,
    country_code: cleanHeader(request.headers.get('x-vercel-ip-country'), 2),
    region: cleanHeader(request.headers.get('x-vercel-ip-country-region'), 120),
    city: cleanHeader(request.headers.get('x-vercel-ip-city'), 120),
    browser,
    os,
    device_type: deviceType,
  });

  if (error) {
    return NextResponse.json(
      { error: 'Unable to track event.' },
      { status: 500 },
    );
  }

  const response = NextResponse.json({ tracked: true });
  if (!existingVisitorId) {
    response.cookies.set(visitorCookieName, visitorId, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
    });
  }
  return response;
}
