'use client';

import { useEffect } from 'react';
import {
  trackMarketingFunnelEvent,
  type MarketingFunnelEventName,
} from '@/lib/analytics/marketing-funnel';

export function MarketingFunnelEvent({
  name,
  parameters,
}: {
  name: MarketingFunnelEventName;
  parameters?: Record<string, string | number | boolean | undefined>;
}) {
  const serializedParameters = JSON.stringify(parameters ?? {});

  useEffect(() => {
    trackMarketingFunnelEvent(
      name,
      JSON.parse(serializedParameters) as Record<
        string,
        string | number | boolean
      >,
    );
  }, [name, serializedParameters]);

  return null;
}
