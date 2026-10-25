'use client';

import { sendGAEvent } from '@next/third-parties/google';

const consentStorageKey = 'griit_marketing_analytics_consent';

export type MarketingFunnelEventName =
  | 'marketing_cta_click'
  | 'signup_view'
  | 'signup_submit'
  | 'onboarding_step_view'
  | 'profile_created'
  | 'profile_published';

export function trackMarketingFunnelEvent(
  name: MarketingFunnelEventName,
  parameters: Record<string, string | number | boolean | undefined> = {},
) {
  if (typeof window === 'undefined') return;
  if (window.localStorage.getItem(consentStorageKey) !== 'accepted') return;

  sendGAEvent('event', name, parameters);
}
