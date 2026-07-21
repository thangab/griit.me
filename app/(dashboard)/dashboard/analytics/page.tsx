import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AnalyticsDashboard } from '@/components/analytics/analytics-dashboard';
import {
  analyticsGranularities,
  analyticsMetricModes,
  analyticsRangePresets,
  getAnalyticsDashboardData,
  type AnalyticsFilters,
} from '@/lib/services/analytics';
import { canAccessFeature, getSubscriptionState } from '@/lib/services/billing';

type AnalyticsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function isDate(value: string | undefined) {
  return Boolean(value && /^\d{4}-\d{2}-\d{2}$/.test(value));
}

export default async function AnalyticsPage({
  searchParams,
}: AnalyticsPageProps) {
  const params = await searchParams;
  const requestedRange = firstValue(params.range);
  const requestedGranularity = firstValue(params.granularity);
  const requestedMode = firstValue(params.mode);
  const start = firstValue(params.start);
  const end = firstValue(params.end);
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
    timezone: firstValue(params.timezone) || 'UTC',
  };
  const [data, subscription] = await Promise.all([
    getAnalyticsDashboardData(filters),
    getSubscriptionState(),
  ]);

  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Analytics</CardTitle>
          <CardDescription>
            Publish your profile to start collecting traffic and engagement
            data.
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
        interactions: data.interactions.filter(
          (interaction) => interaction.targetType === 'social',
        ),
      };

  return (
    <AnalyticsDashboard
      data={visibleData}
      filters={filters}
      hasAdvancedAnalytics={hasAdvancedAnalytics}
    />
  );
}
