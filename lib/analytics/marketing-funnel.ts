'use client';

export const analyticsReadyEvent = 'griit-marketing-analytics-ready';
export const consentStorageKey = 'griit_marketing_analytics_consent';
export const consentChangeEvent = 'griit-marketing-analytics-consent-change';
const attributionStorageKey = 'griit_marketing_attribution';

type EventParameters = Record<string, string | number | boolean | undefined>;
type AnalyticsWindow = Window & {
  gtag?: (...args: unknown[]) => void;
  griitAnalyticsReady?: boolean;
};

export type MarketingFunnelEventName =
  | 'marketing_cta_click'
  | 'marketing_page_view'
  | 'public_profile_view'
  | 'signup_view'
  | 'signup_submit'
  | 'onboarding_started'
  | 'onboarding_step_view'
  | 'profile_created'
  | 'profile_published';

export function trackMarketingFunnelEvent(
  name: MarketingFunnelEventName,
  parameters: EventParameters = {},
): boolean {
  if (typeof window === 'undefined') return false;
  const analyticsWindow = window as AnalyticsWindow;
  try {
    if (window.localStorage.getItem(consentStorageKey) !== 'accepted')
      return false;
    if (!analyticsWindow.griitAnalyticsReady || !analyticsWindow.gtag)
      return false;

    // Attribution stays in this tab and is only saved after analytics consent.
    const query = new URLSearchParams(window.location.search);
    const attribution = JSON.parse(
      window.sessionStorage.getItem(attributionStorageKey) || '{}',
    ) as EventParameters;
    for (const key of [
      'source',
      'profile',
      'utm_source',
      'utm_medium',
      'utm_campaign',
    ]) {
      const value = query.get(key);
      if (value && /^[a-z0-9_-]{1,160}$/i.test(value)) attribution[key] = value;
    }
    window.sessionStorage.setItem(
      attributionStorageKey,
      JSON.stringify(attribution),
    );
    const definedParameters = Object.fromEntries(
      Object.entries(parameters).filter(([, value]) => value !== undefined),
    );
    analyticsWindow.gtag('event', name, {
      ...attribution,
      ...definedParameters,
    });
    return true;
  } catch {
    // Storage may be unavailable in a private or restricted browser.
    return false;
  }
}

export function markMarketingAnalyticsReady() {
  // Inline Script.onReady can run before Next inserts the script element.
  // Wait until that insertion has executed the gtag initialization.
  queueMicrotask(() => {
    const analyticsWindow = window as AnalyticsWindow;
    if (!analyticsWindow.gtag) return;
    analyticsWindow.griitAnalyticsReady = true;
    window.dispatchEvent(new Event(analyticsReadyEvent));
  });
}
