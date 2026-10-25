'use client';

import { useEffect } from 'react';
import {
  trackMarketingFunnelEvent,
  analyticsReadyEvent,
  type MarketingFunnelEventName,
} from '@/lib/analytics/marketing-funnel';

export function MarketingFunnelEvent({
  name,
  parameters,
}: {
  name: MarketingFunnelEventName;
  parameters?: Record<string, string | number | boolean | undefined>;
}) {
  useMarketingFunnelEvent(name, parameters);
  return null;
}

export function useMarketingFunnelEvent(
  name: MarketingFunnelEventName,
  parameters?: Record<string, string | number | boolean | undefined>,
) {
  const serializedParameters = JSON.stringify(parameters ?? {});

  useEffect(() => {
    let tracked = false;
    const track = () => {
      if (tracked) return;
      tracked = trackMarketingFunnelEvent(
        name,
        JSON.parse(serializedParameters),
      );
    };
    track();
    window.addEventListener(analyticsReadyEvent, track);
    return () => window.removeEventListener(analyticsReadyEvent, track);
  }, [name, serializedParameters]);
}
