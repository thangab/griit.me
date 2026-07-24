'use client';

import { useEffect, useRef, useState } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

const analyticsSnapshots = [
  {
    summary: {
      views: 2438,
      visitors: 742,
      blockClicks: 186,
      socialClicks: 267,
      rate: 18.6,
    },
    series: [
      [112, 12, 18],
      [138, 18, 24],
      [126, 15, 20],
      [164, 22, 31],
      [151, 19, 27],
      [188, 29, 36],
      [172, 24, 34],
      [216, 35, 43],
      [198, 28, 39],
      [242, 41, 51],
      [226, 36, 47],
      [265, 48, 58],
    ],
    locations: [68, 47, 31],
    devices: [79, 16, 5],
  },
  {
    summary: {
      views: 2516,
      visitors: 781,
      blockClicks: 201,
      socialClicks: 284,
      rate: 19.3,
    },
    series: [
      [126, 15, 20],
      [147, 20, 26],
      [139, 17, 23],
      [178, 25, 34],
      [169, 23, 31],
      [204, 32, 41],
      [187, 28, 37],
      [231, 39, 48],
      [219, 34, 45],
      [258, 44, 55],
      [247, 41, 53],
      [281, 52, 63],
    ],
    locations: [71, 44, 35],
    devices: [81, 14, 5],
  },
  {
    summary: {
      views: 2642,
      visitors: 816,
      blockClicks: 214,
      socialClicks: 301,
      rate: 19.5,
    },
    series: [
      [132, 17, 22],
      [158, 23, 29],
      [149, 20, 27],
      [189, 28, 37],
      [181, 26, 35],
      [218, 36, 45],
      [205, 33, 43],
      [246, 43, 52],
      [232, 38, 49],
      [274, 49, 61],
      [263, 46, 58],
      [296, 57, 69],
    ],
    locations: [74, 48, 38],
    devices: [82, 13, 5],
  },
] as const;

const dayLabels = [
  '1',
  '3',
  '5',
  '8',
  '10',
  '13',
  '15',
  '18',
  '20',
  '23',
  '26',
  '30',
];

function compactNumber(value: number) {
  return new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

function AnimatedMetric({
  value,
  suffix = '',
  decimals = 0,
}: {
  value: number;
  suffix?: string;
  decimals?: number;
}) {
  const previousValue = useRef(value);
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    const startValue = previousValue.current;
    const difference = value - startValue;
    const startedAt = window.performance.now();
    let animationFrame = 0;

    const update = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / 700);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(startValue + difference * easedProgress);

      if (progress < 1) animationFrame = window.requestAnimationFrame(update);
    };

    animationFrame = window.requestAnimationFrame(update);
    previousValue.current = value;
    return () => window.cancelAnimationFrame(animationFrame);
  }, [value]);

  const output = decimals
    ? displayValue.toFixed(decimals)
    : compactNumber(Math.round(displayValue));

  return `${output}${suffix}`;
}

function BreakdownBars({
  title,
  labels,
  values,
  colors,
}: {
  title: string;
  labels: string[];
  values: readonly number[];
  colors: string[];
}) {
  return (
    <div className="rounded-xl border border-black/8 bg-white p-3">
      <p className="text-[10px] font-bold text-black/70">{title}</p>
      <div className="mt-3 space-y-2.5">
        {labels.map((label, index) => (
          <div key={label}>
            <div className="mb-1 flex justify-between gap-2 text-[8px] font-medium text-black/45">
              <span>{label}</span>
              <span>{values[index]}%</span>
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-black/[0.06]">
              <div
                className="h-full rounded-full transition-[width] duration-1000 ease-out"
                style={{
                  backgroundColor: colors[index],
                  width: `${values[index]}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AnalyticsShowcase() {
  const [snapshotIndex, setSnapshotIndex] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');

    const syncMotionPreference = () => {
      setPrefersReducedMotion(media.matches);
    };

    syncMotionPreference();
    media.addEventListener('change', syncMotionPreference);

    return () => media.removeEventListener('change', syncMotionPreference);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const interval = window.setInterval(() => {
      setSnapshotIndex((current) => (current + 1) % analyticsSnapshots.length);
    }, 3200);

    return () => window.clearInterval(interval);
  }, [prefersReducedMotion]);

  const snapshot = analyticsSnapshots[snapshotIndex];
  const chartData = snapshot.series.map(
    ([views, blockClicks, socialClicks], index) => ({
      day: dayLabels[index],
      views,
      blockClicks,
      socialClicks,
    }),
  );
  const summary = [
    ['Profile views', snapshot.summary.views, '', 0],
    ['Unique visitors', snapshot.summary.visitors, '', 0],
    ['Block clicks', snapshot.summary.blockClicks, '', 0],
    ['Social clicks', snapshot.summary.socialClicks, '', 0],
    ['Click-through rate', snapshot.summary.rate, '%', 1],
  ] as const;

  return (
    <div className="overflow-hidden rounded-[2rem] border border-white/15 bg-[#f4f5f7] p-2.5 text-[#151515] shadow-[0_35px_100px_rgba(8,15,52,0.35)] sm:p-4">
      <div className="relative overflow-hidden rounded-[1.4rem] bg-[#151515] p-4 text-white sm:p-5">
        <div className="pointer-events-none absolute -top-12 -right-6 h-32 w-32 rounded-full border-[22px] border-[#3157ff]/30" />
        <div className="relative flex items-end justify-between gap-4">
          <div>
            <p className="text-[8px] font-black tracking-[0.2em] text-white/40 uppercase">
              Performance
            </p>
            <p className="mt-1 text-xl font-black tracking-[-0.04em] sm:text-2xl">
              Analytics
            </p>
            <p className="mt-1 text-[9px] text-white/45">
              Understand how visitors interact with @zara_fightforward.
            </p>
          </div>
          <div className="hidden items-center gap-1.5 sm:flex">
            <span className="rounded-lg bg-white px-2.5 py-2 text-[8px] font-bold text-black">
              This month
            </span>
            <span className="rounded-lg bg-white px-2.5 py-2 text-[8px] font-bold text-black">
              Daily
            </span>
            <span className="rounded-lg bg-[#3157ff] px-2.5 py-2 text-[8px] font-bold">
              Totals
            </span>
          </div>
        </div>
      </div>

      <div className="mt-2.5 grid grid-cols-2 gap-2 sm:grid-cols-5">
        {summary.map(([label, value, suffix, decimals], index) => (
          <div
            className={`rounded-xl border bg-white p-2.5 ${
              index === summary.length - 1
                ? 'col-span-2 border-[#3157ff]/20 sm:col-span-1'
                : 'border-black/8'
            }`}
            key={label}
          >
            <p className="truncate text-[8px] font-medium text-black/40">
              {label}
            </p>
            <p className="mt-1.5 text-base font-bold tracking-tight">
              <AnimatedMetric
                decimals={decimals}
                suffix={suffix}
                value={value}
              />
            </p>
          </div>
        ))}
      </div>

      <div className="mt-2.5 overflow-hidden rounded-xl border border-black/8 bg-white">
        <div className="flex items-center justify-between border-b border-black/8 px-3.5 py-2.5">
          <div>
            <p className="text-[10px] font-bold">Profile views & clicks</p>
            <p className="mt-0.5 text-[8px] text-black/35">
              All events grouped daily
            </p>
          </div>
          <span className="flex items-center gap-1.5 text-[8px] font-bold text-emerald-600">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500 motion-reduce:animate-none" />
            Updating
          </span>
        </div>
        <div className="h-[190px] px-1 pt-2 sm:h-[220px] sm:px-2">
          <ResponsiveContainer height="100%" width="100%">
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 10, bottom: 0, left: -22 }}
            >
              <CartesianGrid stroke="#e8e8e5" vertical={false} />
              <XAxis
                axisLine={false}
                dataKey="day"
                interval={2}
                tick={{ fill: '#9a9a96', fontSize: 8 }}
                tickLine={false}
              />
              <YAxis
                axisLine={false}
                tick={{ fill: '#9a9a96', fontSize: 8 }}
                tickLine={false}
              />
              <Line
                animationDuration={900}
                dataKey="views"
                dot={false}
                isAnimationActive={!prefersReducedMotion}
                stroke="#10b981"
                strokeWidth={2.5}
                type="monotone"
              />
              <Line
                animationDuration={1000}
                dataKey="blockClicks"
                dot={false}
                isAnimationActive={!prefersReducedMotion}
                stroke="#f59e0b"
                strokeWidth={2.5}
                type="monotone"
              />
              <Line
                animationDuration={1100}
                dataKey="socialClicks"
                dot={false}
                isAnimationActive={!prefersReducedMotion}
                stroke="#2563eb"
                strokeWidth={2.5}
                type="monotone"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap justify-center gap-4 px-3 pb-3 text-[8px] font-semibold text-black/45">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Profile views
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            Block clicks
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
            Social clicks
          </span>
        </div>
      </div>

      <div className="mt-2.5 grid grid-cols-2 gap-2">
        <BreakdownBars
          colors={['#3157ff', '#6480ff', '#a9b7ff']}
          labels={['France', 'United Kingdom', 'United States']}
          title="Locations"
          values={snapshot.locations}
        />
        <BreakdownBars
          colors={['#10b981', '#64d3ad', '#a5ead1']}
          labels={['Mobile', 'Desktop', 'Tablet']}
          title="Devices"
          values={snapshot.devices}
        />
      </div>
    </div>
  );
}
