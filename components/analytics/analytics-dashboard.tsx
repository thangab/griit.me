'use client';

import { useEffect, useMemo, useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowDownToLine,
  BarChart3,
  ChevronDown,
  ExternalLink,
  Globe2,
  Link2,
  LockKeyhole,
  MousePointerClick,
  Smartphone,
  Users,
} from 'lucide-react';
import type {
  AnalyticsBreakdownItem,
  AnalyticsDashboardData,
  AnalyticsFilters,
  AnalyticsInteraction,
  AnalyticsSeriesPoint,
} from '@/lib/services/analytics';
import { cn } from '@/lib/utils/cn';

const rangeOptions = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This week' },
  { value: 'month', label: 'This month' },
  { value: 'year', label: 'This year' },
  { value: 'custom', label: 'Custom range' },
] as const;

function formatNumber(value: number) {
  return new Intl.NumberFormat('en', { notation: 'compact' }).format(value);
}

function formatDate(
  value: string,
  granularity: AnalyticsFilters['granularity'],
) {
  return new Intl.DateTimeFormat('en', {
    weekday: granularity === 'weekly' ? 'short' : undefined,
    month: 'short',
    day: 'numeric',
    year: undefined,
  }).format(new Date(`${value}T12:00:00`));
}

function downloadCsv(filename: string, rows: Array<Array<string | number>>) {
  const csv = rows
    .map((row) =>
      row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(','),
    )
    .join('\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function AnalyticsChart({
  points,
  granularity,
}: {
  points: AnalyticsSeriesPoint[];
  granularity: AnalyticsFilters['granularity'];
}) {
  const width = 1000;
  const height = 320;
  const padding = { top: 24, right: 24, bottom: 48, left: 46 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const maxValue = Math.max(
    4,
    ...points.flatMap((point) => [
      point.views,
      point.blockClicks,
      point.socialClicks,
    ]),
  );
  const roundedMax = Math.ceil(maxValue / 4) * 4;
  const x = (index: number) =>
    padding.left +
    (points.length <= 1
      ? chartWidth / 2
      : (index / (points.length - 1)) * chartWidth);
  const y = (value: number) =>
    padding.top + chartHeight - (value / roundedMax) * chartHeight;
  const path = (key: keyof Omit<AnalyticsSeriesPoint, 'bucket'>) =>
    points
      .map(
        (point, index) => `${index ? 'L' : 'M'} ${x(index)} ${y(point[key])}`,
      )
      .join(' ');
  const labelIndexes = Array.from(
    new Set(
      Array.from({ length: Math.min(6, points.length) }, (_, index) =>
        Math.round(
          (index * (points.length - 1)) /
            Math.max(1, Math.min(5, points.length - 1)),
        ),
      ),
    ),
  );

  return (
    <div className="overflow-x-auto">
      <svg
        aria-label="Profile views and clicks chart"
        className="h-auto min-w-[680px]"
        role="img"
        viewBox={`0 0 ${width} ${height}`}
      >
        {Array.from({ length: 5 }, (_, index) => {
          const value = (roundedMax / 4) * index;
          const lineY = y(value);
          return (
            <g key={value}>
              <line
                className="stroke-border"
                x1={padding.left}
                x2={width - padding.right}
                y1={lineY}
                y2={lineY}
              />
              <text
                className="fill-muted-foreground text-[11px]"
                textAnchor="end"
                x={padding.left - 10}
                y={lineY + 4}
              >
                {formatNumber(value)}
              </text>
            </g>
          );
        })}
        {points.length ? (
          <>
            <path
              d={path('views')}
              fill="none"
              stroke="#10b981"
              strokeWidth="3"
            />
            <path
              d={path('blockClicks')}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="3"
            />
            <path
              d={path('socialClicks')}
              fill="none"
              stroke="#2563eb"
              strokeWidth="3"
            />
            {points.map((point, index) => (
              <g key={point.bucket}>
                {(['views', 'blockClicks', 'socialClicks'] as const)
                  .filter((key) => points.length <= 60 || point[key] > 0)
                  .map((key) => (
                    <circle
                      key={key}
                      cx={x(index)}
                      cy={y(point[key])}
                      fill="white"
                      r="3.5"
                      stroke={
                        key === 'views'
                          ? '#10b981'
                          : key === 'blockClicks'
                            ? '#f59e0b'
                            : '#2563eb'
                      }
                      strokeWidth="2"
                    >
                      <title>{`${formatDate(point.bucket, granularity)} · ${key}: ${point[key]}`}</title>
                    </circle>
                  ))}
              </g>
            ))}
            {labelIndexes.map((index) => (
              <text
                key={points[index].bucket}
                className="fill-muted-foreground text-[11px]"
                textAnchor="middle"
                x={x(index)}
                y={height - 14}
              >
                {formatDate(points[index].bucket, granularity)}
              </text>
            ))}
          </>
        ) : null}
      </svg>
    </div>
  );
}

function BreakdownCard({
  title,
  icon: Icon,
  items,
}: {
  title: string;
  icon: typeof Globe2;
  items: AnalyticsBreakdownItem[];
}) {
  const total = items.reduce((sum, item) => sum + item.value, 0);
  const max = Math.max(1, ...items.map((item) => item.value));

  return (
    <section className="border-border bg-card rounded-xl border p-5">
      <div className="flex items-center gap-2">
        <Icon className="text-muted-foreground h-4 w-4" />
        <h3 className="font-semibold">{title}</h3>
      </div>
      {items.length ? (
        <div className="mt-5 space-y-4">
          {items.map((item) => (
            <div key={item.label}>
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="truncate font-medium">{item.label}</span>
                <span className="text-muted-foreground shrink-0 text-xs">
                  {item.value} ·{' '}
                  {total ? Math.round((item.value / total) * 100) : 0}%
                </span>
              </div>
              <div className="bg-muted mt-2 h-1.5 overflow-hidden rounded-full">
                <div
                  className="bg-primary h-full rounded-full"
                  style={{ width: `${Math.max(4, (item.value / max) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-muted-foreground flex min-h-32 items-center justify-center text-sm">
          No data for this range yet.
        </div>
      )}
    </section>
  );
}

function InteractionTable({
  title,
  interactions,
}: {
  title: string;
  interactions: AnalyticsInteraction[];
}) {
  return (
    <section className="border-border bg-card overflow-hidden rounded-xl border">
      <div className="border-border flex items-center justify-between gap-4 border-b px-5 py-4">
        <h3 className="font-semibold">{title}</h3>
        <button
          className="border-border hover:bg-muted flex h-9 items-center gap-2 rounded-lg border px-3 text-xs font-semibold"
          type="button"
          onClick={() =>
            downloadCsv(`${title.toLowerCase().replaceAll(' ', '-')}.csv`, [
              ['Type', 'Name', 'Clicks', 'Last interaction'],
              ...interactions.map((item) => [
                item.eventType,
                item.label,
                item.clicks,
                item.lastInteraction,
              ]),
            ])
          }
        >
          <ArrowDownToLine className="h-3.5 w-3.5" />
          Export
        </button>
      </div>
      {interactions.length ? (
        <>
          <div className="divide-border divide-y md:hidden">
            {interactions.map((item) => (
              <div key={`${item.targetKey}-${item.eventType}`} className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {item.label}
                    </p>
                    <p className="text-muted-foreground mt-1 text-xs capitalize">
                      {item.targetType.replaceAll('_', ' ')}
                    </p>
                  </div>
                  <span className="bg-primary/10 text-primary rounded-full px-2.5 py-1 text-xs font-bold">
                    {item.clicks} clicks
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-muted/40 text-muted-foreground text-xs uppercase">
                <tr>
                  <th className="px-5 py-3 font-semibold">Type</th>
                  <th className="px-5 py-3 font-semibold">Name</th>
                  <th className="px-5 py-3 text-right font-semibold">Clicks</th>
                  <th className="px-5 py-3 text-right font-semibold">
                    Last activity
                  </th>
                </tr>
              </thead>
              <tbody className="divide-border divide-y">
                {interactions.map((item) => (
                  <tr key={`${item.targetKey}-${item.eventType}`}>
                    <td className="px-5 py-4 capitalize">
                      {item.targetType.replaceAll('_', ' ')}
                    </td>
                    <td className="max-w-sm truncate px-5 py-4 font-medium">
                      {item.label}
                    </td>
                    <td className="px-5 py-4 text-right font-semibold">
                      {item.clicks}
                    </td>
                    <td className="text-muted-foreground px-5 py-4 text-right text-xs">
                      {new Intl.DateTimeFormat('en', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      }).format(new Date(item.lastInteraction))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="text-muted-foreground flex min-h-36 items-center justify-center p-6 text-sm">
          No interactions for this range yet.
        </div>
      )}
    </section>
  );
}

export function AnalyticsDashboard({
  data,
  filters,
  hasAdvancedAnalytics,
}: {
  data: AnalyticsDashboardData;
  filters: AnalyticsFilters;
  hasAdvancedAnalytics: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [customStart, setCustomStart] = useState(filters.start ?? '');
  const [customEnd, setCustomEnd] = useState(filters.end ?? '');

  const updateFilters = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams({
      range: filters.range,
      granularity: filters.granularity,
      mode: filters.mode,
      timezone: filters.timezone,
    });
    if (filters.start) params.set('start', filters.start);
    if (filters.end) params.set('end', filters.end);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    startTransition(() => router.replace(`/dashboard/analytics?${params}`));
  };

  useEffect(() => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (timezone && timezone !== filters.timezone) updateFilters({ timezone });
    // The URL is intentionally synchronized once when the detected timezone changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.timezone]);

  const socialInteractions = useMemo(
    () => data.interactions.filter((item) => item.targetType === 'social'),
    [data.interactions],
  );
  const blockInteractions = useMemo(
    () => data.interactions.filter((item) => item.targetType !== 'social'),
    [data.interactions],
  );
  const summaryCards = [
    { label: 'Profile views', value: data.summary.views, icon: BarChart3 },
    {
      label: 'Unique visitors',
      value: data.summary.uniqueVisitors,
      icon: Users,
    },
    {
      label: 'Block clicks',
      value: data.summary.blockClicks,
      icon: MousePointerClick,
    },
    { label: 'Social clicks', value: data.summary.socialClicks, icon: Link2 },
    {
      label: 'Click-through rate',
      value: `${data.summary.clickThroughRate.toFixed(1)}%`,
      icon: ExternalLink,
    },
  ];

  return (
    <div
      className={cn('space-y-5 transition-opacity', isPending && 'opacity-65')}
    >
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-muted-foreground text-sm font-medium">
            Performance
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Analytics
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Understand how visitors discover and interact with @
            {data.profile.username}.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <label className="relative min-w-40 flex-1 sm:flex-none">
            <span className="sr-only">Date range</span>
            <select
              className="border-border bg-card h-11 w-full appearance-none rounded-lg border pr-9 pl-3 text-sm font-semibold outline-none"
              value={filters.range}
              onChange={(event) => {
                const range = event.target.value;
                if (range === 'custom') {
                  const end = new Date().toISOString().slice(0, 10);
                  const start = new Date(Date.now() - 29 * 86_400_000)
                    .toISOString()
                    .slice(0, 10);
                  setCustomStart(start);
                  setCustomEnd(end);
                  updateFilters({ range, start, end });
                } else {
                  updateFilters({ range, start: undefined, end: undefined });
                }
              }}
            >
              {rangeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="text-muted-foreground pointer-events-none absolute top-3.5 right-3 h-4 w-4" />
          </label>
          <label className="relative min-w-32 flex-1 sm:flex-none">
            <span className="sr-only">Grouping</span>
            <select
              className="border-border bg-card h-11 w-full appearance-none rounded-lg border pr-9 pl-3 text-sm font-semibold outline-none"
              value={filters.granularity}
              onChange={(event) =>
                updateFilters({ granularity: event.target.value })
              }
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
            <ChevronDown className="text-muted-foreground pointer-events-none absolute top-3.5 right-3 h-4 w-4" />
          </label>
          <div className="border-border bg-card grid h-11 grid-cols-2 rounded-lg border p-1">
            {(['totals', 'uniques'] as const).map((mode) => (
              <button
                key={mode}
                className={cn(
                  'rounded-md px-3 text-xs font-semibold capitalize transition',
                  filters.mode === mode
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground',
                )}
                type="button"
                onClick={() => updateFilters({ mode })}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filters.range === 'custom' ? (
        <div className="border-border bg-card flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-end">
          <label className="flex-1 space-y-1.5">
            <span className="text-xs font-semibold">Start date</span>
            <input
              className="border-border bg-background h-10 w-full rounded-lg border px-3 text-sm"
              max={customEnd || undefined}
              type="date"
              value={customStart}
              onChange={(event) => setCustomStart(event.target.value)}
            />
          </label>
          <label className="flex-1 space-y-1.5">
            <span className="text-xs font-semibold">End date</span>
            <input
              className="border-border bg-background h-10 w-full rounded-lg border px-3 text-sm"
              min={customStart || undefined}
              type="date"
              value={customEnd}
              onChange={(event) => setCustomEnd(event.target.value)}
            />
          </label>
          <button
            className="bg-primary text-primary-foreground h-10 rounded-lg px-5 text-sm font-semibold disabled:opacity-50"
            disabled={!customStart || !customEnd || customStart > customEnd}
            type="button"
            onClick={() =>
              updateFilters({ start: customStart, end: customEnd })
            }
          >
            Apply
          </button>
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-5">
        {summaryCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className={cn(
                'border-border bg-card rounded-xl border p-4 sm:p-5',
                index === summaryCards.length - 1 && 'col-span-2 xl:col-span-1',
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-muted-foreground text-xs font-medium">
                  {card.label}
                </p>
                <Icon className="text-muted-foreground h-4 w-4" />
              </div>
              <p className="mt-3 text-2xl font-semibold">
                {typeof card.value === 'number'
                  ? formatNumber(card.value)
                  : card.value}
              </p>
            </div>
          );
        })}
      </div>

      <section className="border-border bg-card overflow-hidden rounded-xl border">
        <div className="border-border flex flex-col gap-3 border-b px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold">Profile views & clicks</h2>
            <p className="text-muted-foreground mt-1 text-xs">
              {filters.mode === 'uniques' ? 'Unique visitors' : 'All events'}{' '}
              grouped {filters.granularity}.
            </p>
          </div>
          <button
            className="border-border hover:bg-muted flex h-9 items-center justify-center gap-2 rounded-lg border px-3 text-xs font-semibold"
            type="button"
            onClick={() =>
              downloadCsv('profile-analytics.csv', [
                ['Date', 'Profile views', 'Block clicks', 'Social clicks'],
                ...data.series.map((point) => [
                  point.bucket,
                  point.views,
                  point.blockClicks,
                  point.socialClicks,
                ]),
              ])
            }
          >
            <ArrowDownToLine className="h-3.5 w-3.5" />
            Export
          </button>
        </div>
        <div className="p-3 sm:p-5">
          <AnalyticsChart
            points={data.series}
            granularity={filters.granularity}
          />
          <div className="mt-2 flex flex-wrap justify-center gap-5 text-xs font-semibold">
            <span className="flex items-center gap-2 text-emerald-600">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> Profile
              views
            </span>
            <span className="flex items-center gap-2 text-amber-600">
              <span className="h-2 w-2 rounded-full bg-amber-500" /> Block
              clicks
            </span>
            <span className="flex items-center gap-2 text-blue-600">
              <span className="h-2 w-2 rounded-full bg-blue-600" /> Social
              clicks
            </span>
          </div>
        </div>
      </section>

      <InteractionTable
        title="Social clicks"
        interactions={socialInteractions}
      />

      {hasAdvancedAnalytics ? (
        <>
          <section>
            <div className="mb-3">
              <h2 className="text-lg font-semibold">Audience</h2>
              <p className="text-muted-foreground mt-1 text-sm">
                Where your visitors come from and how they browse.
              </p>
            </div>
            <div className="grid gap-3 lg:grid-cols-2">
              <BreakdownCard
                title="Locations"
                icon={Globe2}
                items={data.audience.locations}
              />
              <BreakdownCard
                title="Traffic sources"
                icon={ExternalLink}
                items={data.audience.trafficSources}
              />
              <BreakdownCard
                title="Top referrers"
                icon={Link2}
                items={data.audience.referrers}
              />
              <BreakdownCard
                title="Devices"
                icon={Smartphone}
                items={data.audience.devices}
              />
              <BreakdownCard
                title="Browsers"
                icon={Globe2}
                items={data.audience.browsers}
              />
              <BreakdownCard
                title="Campaigns"
                icon={BarChart3}
                items={data.audience.campaigns}
              />
            </div>
          </section>

          <InteractionTable
            title="Block interactions"
            interactions={blockInteractions}
          />
        </>
      ) : (
        <section className="border-border bg-card overflow-hidden rounded-xl border">
          <div className="flex flex-col items-center px-6 py-10 text-center sm:py-12">
            <span className="bg-primary/10 text-primary flex h-11 w-11 items-center justify-center rounded-full">
              <LockKeyhole className="h-5 w-5" />
            </span>
            <div className="mt-4 flex items-center gap-2">
              <h2 className="text-lg font-semibold">
                Audience & block interactions
              </h2>
              <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                Pro
              </span>
            </div>
            <p className="text-muted-foreground mt-2 max-w-md text-sm leading-6">
              Discover where your audience comes from, the devices they use,
              and which blocks generate the most engagement.
            </p>
            <Link
              className="bg-primary text-primary-foreground mt-5 inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-semibold transition-opacity hover:opacity-90"
              href="/dashboard/settings"
            >
              Upgrade to Pro
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
