import { notFound } from 'next/navigation';
import { AnalyticsDashboard } from '@/components/analytics/analytics-dashboard';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  analyticsGranularities,
  analyticsMetricModes,
  analyticsRangePresets,
  getAnalyticsDashboardData,
  type AnalyticsFilters,
} from '@/lib/services/analytics';
import { canAccessFeature, getSubscriptionState } from '@/lib/services/billing';

type Props = {
  params: Promise<{ profileId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function isDate(value: string | undefined) {
  return Boolean(value && /^\d{4}-\d{2}-\d{2}$/.test(value));
}

export default async function ProfileAnalyticsPage({
  params,
  searchParams,
}: Props) {
  const profileId = Number((await params).profileId);
  if (!Number.isInteger(profileId) || profileId <= 0) notFound();
  const query = await searchParams;
  const requestedRange = firstValue(query.range);
  const requestedGranularity = firstValue(query.granularity);
  const requestedMode = firstValue(query.mode);
  const start = firstValue(query.start);
  const end = firstValue(query.end);
  const filters: AnalyticsFilters = {
    range: analyticsRangePresets.includes(
      requestedRange as AnalyticsFilters['range'],
    )
      ? (requestedRange as AnalyticsFilters['range'])
      : 'month',
    granularity: analyticsGranularities.includes(
      requestedGranularity as AnalyticsFilters['granularity'],
    )
      ? (requestedGranularity as AnalyticsFilters['granularity'])
      : 'daily',
    mode: analyticsMetricModes.includes(
      requestedMode as AnalyticsFilters['mode'],
    )
      ? (requestedMode as AnalyticsFilters['mode'])
      : 'totals',
    start: isDate(start) ? start : undefined,
    end: isDate(end) ? end : undefined,
    timezone: firstValue(query.timezone) || 'UTC',
  };
  const [data, subscription] = await Promise.all([
    getAnalyticsDashboardData(profileId, filters),
    getSubscriptionState(),
  ]);

  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Analytics</CardTitle>
          <CardDescription>
            Profile not found or no analytics are available yet.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const hasAdvancedAnalytics = await canAccessFeature(
    'advancedAnalytics',
    subscription,
  );
  const visibleData = hasAdvancedAnalytics
    ? data
    : {
        ...data,
        audience: {
          locations: [],
          trafficSources: [],
          referrers: [],
          devices: [],
          browsers: [],
          campaigns: [],
        },
        interactions: [],
      };

  return (
    <AnalyticsDashboard
      data={visibleData}
      filters={filters}
      hasAdvancedAnalytics={hasAdvancedAnalytics}
    />
  );
}
