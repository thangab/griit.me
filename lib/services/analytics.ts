import 'server-only';

import { getPostgresPool } from '@/lib/config/postgres';
import { createServerSupabaseClient } from '@/lib/config/supabase-server';

export const analyticsRangePresets = [
  'today',
  'week',
  'month',
  'year',
  'custom',
] as const;
export const analyticsGranularities = ['daily', 'weekly'] as const;
export const analyticsMetricModes = ['totals', 'uniques'] as const;

export type AnalyticsRangePreset = (typeof analyticsRangePresets)[number];
export type AnalyticsGranularity = (typeof analyticsGranularities)[number];
export type AnalyticsMetricMode = (typeof analyticsMetricModes)[number];

export type AnalyticsFilters = {
  range: AnalyticsRangePreset;
  granularity: AnalyticsGranularity;
  mode: AnalyticsMetricMode;
  start?: string;
  end?: string;
  timezone: string;
};

export type AnalyticsSeriesPoint = {
  bucket: string;
  views: number;
  blockClicks: number;
  socialClicks: number;
};

export type AnalyticsBreakdownItem = {
  label: string;
  value: number;
};

export type AnalyticsInteraction = {
  targetKey: string;
  targetType: string;
  eventType: string;
  label: string;
  clicks: number;
  lastInteraction: string;
};

export type AnalyticsDashboardData = {
  profile: { id: number; username: string };
  summary: {
    views: number;
    uniqueVisitors: number;
    blockClicks: number;
    socialClicks: number;
    totalClicks: number;
    clickThroughRate: number;
  };
  series: AnalyticsSeriesPoint[];
  audience: {
    locations: AnalyticsBreakdownItem[];
    trafficSources: AnalyticsBreakdownItem[];
    referrers: AnalyticsBreakdownItem[];
    devices: AnalyticsBreakdownItem[];
    browsers: AnalyticsBreakdownItem[];
    campaigns: AnalyticsBreakdownItem[];
  };
  interactions: AnalyticsInteraction[];
};

const rangeCte = `
  settings AS (
    SELECT
      $2::text AS timezone,
      now() AT TIME ZONE $2::text AS local_now
  ),
  selected_range AS (
    SELECT
      CASE $3::text
        WHEN 'today' THEN date_trunc('day', local_now)
        WHEN 'week' THEN date_trunc('week', local_now)
        WHEN 'year' THEN date_trunc('year', local_now)
        WHEN 'custom' THEN COALESCE($4::date, local_now::date)::timestamp
        ELSE date_trunc('month', local_now)
      END AS start_local,
      CASE $3::text
        WHEN 'today' THEN date_trunc('day', local_now) + interval '1 day'
        WHEN 'week' THEN date_trunc('week', local_now) + interval '1 week'
        WHEN 'year' THEN date_trunc('year', local_now) + interval '1 year'
        WHEN 'custom' THEN (COALESCE($5::date, local_now::date) + 1)::timestamp
        ELSE date_trunc('month', local_now) + interval '1 month'
      END AS end_local,
      timezone
    FROM settings
  ),
  filtered_events AS (
    SELECT
      event_type,
      target_type,
      target_key,
      target_label,
      visitor_hash,
      referrer_host,
      utm_source,
      utm_campaign,
      country_code,
      city,
      browser,
      device_type,
      occurred_at,
      occurred_at AT TIME ZONE selected_range.timezone AS occurred_local
    FROM profile_analytics_events
    CROSS JOIN selected_range
    WHERE profile_id = $1
      AND occurred_at >= start_local AT TIME ZONE selected_range.timezone
      AND occurred_at < end_local AT TIME ZONE selected_range.timezone
  )`;

const blockEventTypes =
  "'block_click', 'goal_click', 'sponsor_click', 'gallery_open', 'promo_copy', 'media_open'";

function toNumber(value: unknown) {
  const number = Number(value ?? 0);
  return Number.isFinite(number) ? number : 0;
}

function normalizeTimezone(value: string) {
  try {
    new Intl.DateTimeFormat('en', { timeZone: value }).format();
    return value;
  } catch {
    return 'UTC';
  }
}

function queryValues(profileId: number, filters: AnalyticsFilters) {
  return [
    profileId,
    normalizeTimezone(filters.timezone),
    filters.range,
    filters.start ?? null,
    filters.end ?? null,
  ];
}

export async function getAnalyticsDashboardData(
  profileId: number,
  filters: AnalyticsFilters,
): Promise<AnalyticsDashboardData | null> {
  const supabase = await createServerSupabaseClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return null;

  const pool = getPostgresPool();
  const profileResult = await pool.query<{
    id: number;
    username: string;
  }>(
    `SELECT id, username
     FROM public_profiles
     WHERE id = $1 AND user_id = $2
     LIMIT 1`,
    [profileId, userData.user.id],
  );
  const profile = profileResult.rows[0];
  if (!profile) return null;

  const values = queryValues(profile.id, filters);
  const countExpression =
    filters.mode === 'uniques' ? 'count(DISTINCT visitor_hash)' : 'count(*)';
  const bucketExpression =
    filters.granularity === 'weekly'
      ? "date_trunc('week', occurred_local)"
      : "date_trunc('day', occurred_local)";
  const seriesStep =
    filters.granularity === 'weekly' ? "interval '1 week'" : "interval '1 day'";

  const [summaryResult, seriesResult, audienceResult, interactionsResult] =
    await Promise.all([
      pool.query(
        `WITH ${rangeCte}
         SELECT
           count(*) FILTER (WHERE event_type = 'profile_view') AS total_views,
           count(DISTINCT visitor_hash) FILTER (WHERE event_type = 'profile_view') AS unique_visitors,
           ${countExpression} FILTER (WHERE event_type IN (${blockEventTypes})) AS block_clicks,
           ${countExpression} FILTER (WHERE event_type = 'social_click') AS social_clicks,
           ${countExpression} FILTER (WHERE event_type <> 'profile_view') AS total_clicks
         FROM filtered_events`,
        values,
      ),
      pool.query(
        `WITH ${rangeCte},
         buckets AS (
           SELECT generate_series(
             ${filters.granularity === 'weekly' ? "date_trunc('week', start_local)" : 'start_local'},
             ${filters.granularity === 'weekly' ? "date_trunc('week', end_local - interval '1 microsecond')" : "end_local - interval '1 day'"},
             ${seriesStep}
           ) AS bucket
           FROM selected_range
         ),
         grouped AS (
           SELECT
             ${bucketExpression} AS bucket,
             ${countExpression} FILTER (WHERE event_type = 'profile_view') AS views,
             ${countExpression} FILTER (WHERE event_type IN (${blockEventTypes})) AS block_clicks,
             ${countExpression} FILTER (WHERE event_type = 'social_click') AS social_clicks
           FROM filtered_events
           GROUP BY 1
         )
         SELECT
           to_char(buckets.bucket, 'YYYY-MM-DD') AS bucket,
           COALESCE(grouped.views, 0) AS views,
           COALESCE(grouped.block_clicks, 0) AS block_clicks,
           COALESCE(grouped.social_clicks, 0) AS social_clicks
         FROM buckets
         LEFT JOIN grouped USING (bucket)
         ORDER BY buckets.bucket`,
        values,
      ),
      pool.query(
        `WITH ${rangeCte},
         views AS (
           SELECT * FROM filtered_events WHERE event_type = 'profile_view'
         ),
         dimensions AS (
           SELECT 'location' AS dimension,
             COALESCE(
               NULLIF(concat_ws(', ', NULLIF(city, ''), NULLIF(country_code, '')), ''),
               'Unknown'
             ) AS label,
             ${countExpression} AS value
           FROM views GROUP BY 2
           UNION ALL
           SELECT 'source', COALESCE(NULLIF(utm_source, ''), NULLIF(referrer_host, ''), 'Direct'),
             ${countExpression} FROM views GROUP BY 2
           UNION ALL
           SELECT 'referrer', COALESCE(NULLIF(referrer_host, ''), 'Direct'),
             ${countExpression} FROM views GROUP BY 2
           UNION ALL
           SELECT 'device', COALESCE(NULLIF(device_type, ''), 'Unknown'),
             ${countExpression} FROM views GROUP BY 2
           UNION ALL
           SELECT 'browser', COALESCE(NULLIF(browser, ''), 'Unknown'),
             ${countExpression} FROM views GROUP BY 2
           UNION ALL
           SELECT 'campaign', utm_campaign,
             ${countExpression} FROM views
             WHERE NULLIF(utm_campaign, '') IS NOT NULL GROUP BY 2
         )
         SELECT dimension, label, value
         FROM (
           SELECT *, row_number() OVER (PARTITION BY dimension ORDER BY value DESC, label) AS rank
           FROM dimensions
         ) ranked
         WHERE rank <= 8
         ORDER BY dimension, value DESC`,
        values,
      ),
      pool.query(
        `WITH ${rangeCte}
         SELECT
           target_key::text AS target_key,
           COALESCE(target_type, 'unknown') AS target_type,
           event_type,
           COALESCE(
             (
               array_agg(NULLIF(target_label, '') ORDER BY occurred_at DESC)
               FILTER (WHERE NULLIF(target_label, '') IS NOT NULL)
             )[1],
             'Untitled'
           ) AS label,
           ${countExpression} AS clicks,
           max(occurred_at) AS last_interaction
         FROM filtered_events
         WHERE event_type <> 'profile_view' AND target_key IS NOT NULL
         GROUP BY target_key, COALESCE(target_type, 'unknown'), event_type
         ORDER BY clicks DESC, last_interaction DESC
         LIMIT 100`,
        values,
      ),
    ]);

  const summaryRow = summaryResult.rows[0] ?? {};
  const totalViews = toNumber(summaryRow.total_views);
  const uniqueVisitors = toNumber(summaryRow.unique_visitors);
  const displayedViews =
    filters.mode === 'uniques' ? uniqueVisitors : totalViews;
  const totalClicks = toNumber(summaryRow.total_clicks);
  const breakdown = (dimension: string) =>
    audienceResult.rows
      .filter((row) => row.dimension === dimension)
      .map((row) => ({ label: String(row.label), value: toNumber(row.value) }));

  return {
    profile,
    summary: {
      views: displayedViews,
      uniqueVisitors,
      blockClicks: toNumber(summaryRow.block_clicks),
      socialClicks: toNumber(summaryRow.social_clicks),
      totalClicks,
      clickThroughRate: displayedViews
        ? (totalClicks / displayedViews) * 100
        : 0,
    },
    series: seriesResult.rows.map((row) => ({
      bucket: String(row.bucket),
      views: toNumber(row.views),
      blockClicks: toNumber(row.block_clicks),
      socialClicks: toNumber(row.social_clicks),
    })),
    audience: {
      locations: breakdown('location'),
      trafficSources: breakdown('source'),
      referrers: breakdown('referrer'),
      devices: breakdown('device'),
      browsers: breakdown('browser'),
      campaigns: breakdown('campaign'),
    },
    interactions: interactionsResult.rows.map((row) => ({
      targetKey: String(row.target_key),
      targetType: String(row.target_type),
      eventType: String(row.event_type),
      label: String(row.label),
      clicks: toNumber(row.clicks),
      lastInteraction: new Date(row.last_interaction).toISOString(),
    })),
  };
}
