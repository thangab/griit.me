'use client';

import { useEffect, useSyncExternalStore } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { usePathname } from 'next/navigation';
import type { Locale } from '@/lib/i18n/config';
import {
  trackMarketingFunnelEvent,
  markMarketingAnalyticsReady,
  analyticsReadyEvent,
  consentStorageKey,
  consentChangeEvent,
} from '@/lib/analytics/marketing-funnel';

type AnalyticsConsent = 'accepted' | 'declined' | 'loading' | null;

function readConsent(): AnalyticsConsent {
  let storedConsent: string | null = null;
  try {
    storedConsent = window.localStorage.getItem(consentStorageKey);
  } catch {
    return 'declined';
  }
  return storedConsent === 'accepted' || storedConsent === 'declined'
    ? storedConsent
    : null;
}

function subscribeToConsent(onStoreChange: () => void) {
  window.addEventListener('storage', onStoreChange);
  window.addEventListener(consentChangeEvent, onStoreChange);

  return () => {
    window.removeEventListener('storage', onStoreChange);
    window.removeEventListener(consentChangeEvent, onStoreChange);
  };
}

export function MarketingAnalytics({
  measurementId,
  locale,
}: {
  measurementId?: string;
  locale: Locale;
}) {
  const pathname = usePathname();
  const isFrench = locale === 'fr';
  const consent = useSyncExternalStore(
    subscribeToConsent,
    readConsent,
    () => 'loading',
  );

  const saveConsent = (value: 'accepted' | 'declined') => {
    try {
      window.localStorage.setItem(consentStorageKey, value);
    } catch {
      return;
    }
    window.dispatchEvent(new Event(consentChangeEvent));
  };

  useEffect(() => {
    if (consent !== 'accepted' || !measurementId) return;

    const handleClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest<HTMLElement>('[data-marketing-cta]');
      if (!link) return;

      trackMarketingFunnelEvent('marketing_cta_click', {
        cta: link.dataset.marketingCta,
        source: link.dataset.marketingSource,
        template: link.dataset.marketingTemplate,
        profile: link.dataset.marketingProfile,
      });
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [consent, measurementId]);

  useEffect(() => {
    if (consent !== 'accepted' || !measurementId) return;
    let tracked = false;
    const trackView = () => {
      if (!tracked)
        tracked = trackMarketingFunnelEvent('marketing_page_view', {
          page_path: pathname,
        });
    };
    trackView();
    window.addEventListener(analyticsReadyEvent, trackView);
    return () => window.removeEventListener(analyticsReadyEvent, trackView);
  }, [consent, measurementId, pathname]);

  if (!measurementId || consent === 'loading') return null;

  return (
    <>
      {consent === 'accepted' ? (
        <>
          <Script
            id="griit-ga-init"
            onReady={markMarketingAnalyticsReady}
            dangerouslySetInnerHTML={{
              __html: `
          window.dataLayer = window.dataLayer || [];
          window.gtag = function(){window.dataLayer.push(arguments);};
          window.gtag('js', new Date());
          window.gtag('config', ${JSON.stringify(measurementId)});
        `,
            }}
          />
          <Script
            id="griit-ga"
            src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`}
          />
        </>
      ) : null}

      {consent === null ? (
        <aside
          aria-label={
            isFrench
              ? 'Préférences des cookies de mesure d’audience'
              : 'Analytics cookie preferences'
          }
          className="fixed right-4 bottom-4 left-4 z-[100] mx-auto max-w-2xl rounded-[1.5rem] border border-white/10 bg-[#151515] p-4 text-white shadow-[0_24px_80px_rgba(0,0,0,0.3)] sm:right-6 sm:bottom-6 sm:left-auto sm:p-5"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-md">
              <p className="text-sm font-black">
                {isFrench
                  ? 'Aidez-nous à améliorer Griit'
                  : 'Help us improve Griit'}
              </p>
              <p className="mt-1 text-xs leading-5 text-white/55">
                {isFrench
                  ? 'Nous utilisons Google Analytics pour comprendre le parcours d’inscription et améliorer votre expérience. '
                  : 'We use Google Analytics to understand the signup journey and improve your experience. '}
                <Link className="text-white underline" href="/privacy">
                  {isFrench ? 'Politique de confidentialité' : 'Privacy policy'}
                </Link>
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                className="h-10 flex-1 rounded-full border border-white/15 px-4 text-xs font-bold text-white/70 transition-colors hover:bg-white/10 hover:text-white sm:flex-none"
                onClick={() => saveConsent('declined')}
                type="button"
              >
                {isFrench ? 'Refuser' : 'Decline'}
              </button>
              <button
                className="h-10 flex-1 rounded-full bg-[#a9ed35] px-5 text-xs font-black text-[#151515] transition-transform hover:-translate-y-0.5 sm:flex-none"
                onClick={() => saveConsent('accepted')}
                type="button"
              >
                {isFrench ? 'Accepter' : 'Accept analytics'}
              </button>
            </div>
          </div>
        </aside>
      ) : null}
    </>
  );
}
