'use client';

import { useEffect, useRef } from 'react';

type AnalyticsEventType =
  | 'block_click'
  | 'social_click'
  | 'goal_click'
  | 'sponsor_click'
  | 'gallery_open'
  | 'promo_copy'
  | 'media_open';

type AnalyticsTargetType = 'block' | 'social' | 'goal' | 'sponsor' | 'gallery';

function sendEvent(payload: Record<string, unknown>) {
  void fetch('/api/analytics/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    keepalive: true,
    credentials: 'same-origin',
  }).catch(() => undefined);
}

export function ProfileAnalyticsTracker({ profileId }: { profileId: number }) {
  const trackedViewRef = useRef(false);

  useEffect(() => {
    if (!trackedViewRef.current) {
      trackedViewRef.current = true;
      const params = new URLSearchParams(window.location.search);
      sendEvent({
        profileId,
        eventType: 'profile_view',
        referrer: document.referrer || undefined,
        utmSource: params.get('utm_source') || undefined,
        utmMedium: params.get('utm_medium') || undefined,
        utmCampaign: params.get('utm_campaign') || undefined,
      });
    }

    const handleClick = (event: MouseEvent) => {
      const element = (
        event.target as HTMLElement | null
      )?.closest<HTMLElement>(
        '[data-analytics-event][data-analytics-target-key]',
      );
      if (!element) return;

      const eventType = element.dataset.analyticsEvent as
        AnalyticsEventType | undefined;
      const targetType = element.dataset.analyticsTargetType as
        AnalyticsTargetType | undefined;
      const targetKey = element.dataset.analyticsTargetKey;
      if (!eventType || !targetType || !targetKey) return;

      sendEvent({ profileId, eventType, targetType, targetKey });
    };

    document.addEventListener('click', handleClick, { capture: true });
    return () =>
      document.removeEventListener('click', handleClick, { capture: true });
  }, [profileId]);

  return null;
}
