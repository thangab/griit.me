'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

const AnalyticsShowcase = dynamic(
  () =>
    import('./analytics-showcase').then((module) => module.AnalyticsShowcase),
  {
    loading: () => <AnalyticsPlaceholder />,
    ssr: false,
  },
);

function AnalyticsPlaceholder() {
  return (
    <div
      aria-hidden="true"
      className="min-h-[570px] animate-pulse overflow-hidden rounded-[2rem] border border-white/15 bg-[#f4f5f7] p-2.5 shadow-[0_35px_100px_rgba(8,15,52,0.2)] motion-reduce:animate-none sm:min-h-[530px] sm:p-4"
    >
      <div className="h-24 rounded-[1.4rem] bg-[#151515]" />
      <div className="mt-2.5 grid grid-cols-2 gap-2 sm:grid-cols-5">
        {Array.from({ length: 5 }, (_, index) => (
          <div
            className={`h-16 rounded-xl bg-white ${index === 4 ? 'col-span-2 sm:col-span-1' : ''}`}
            key={index}
          />
        ))}
      </div>
      <div className="mt-2.5 h-64 rounded-xl bg-white" />
      <div className="mt-2.5 grid grid-cols-2 gap-2">
        <div className="h-28 rounded-xl bg-white" />
        <div className="h-28 rounded-xl bg-white" />
      </div>
    </div>
  );
}

export function LazyAnalyticsShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const element = containerRef.current;
    if (!element || shouldLoad) return;

    if (!('IntersectionObserver' in window)) {
      const timeout = setTimeout(() => setShouldLoad(true), 0);
      return () => clearTimeout(timeout);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;

        setShouldLoad(true);
        observer.disconnect();
      },
      { rootMargin: '350px 0px' },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [shouldLoad]);

  return (
    <div ref={containerRef}>
      {shouldLoad ? <AnalyticsShowcase /> : <AnalyticsPlaceholder />}
    </div>
  );
}
