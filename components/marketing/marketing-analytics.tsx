'use client';

import { useSyncExternalStore } from 'react';
import Link from 'next/link';
import { GoogleAnalytics } from '@next/third-parties/google';
import { useI18n } from '@/components/i18n/i18n-provider';

const consentStorageKey = 'griit_marketing_analytics_consent';
const consentChangeEvent = 'griit-marketing-analytics-consent-change';

type AnalyticsConsent = 'accepted' | 'declined' | 'loading' | null;

function readConsent(): AnalyticsConsent {
  const storedConsent = window.localStorage.getItem(consentStorageKey);
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
}: {
  measurementId?: string;
}) {
  const { locale } = useI18n();
  const isFrench = locale === 'fr';
  const consent = useSyncExternalStore(
    subscribeToConsent,
    readConsent,
    () => 'loading',
  );

  const saveConsent = (value: 'accepted' | 'declined') => {
    window.localStorage.setItem(consentStorageKey, value);
    window.dispatchEvent(new Event(consentChangeEvent));
  };

  if (!measurementId || consent === 'loading') return null;

  return (
    <>
      {consent === 'accepted' ? <GoogleAnalytics gaId={measurementId} /> : null}

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
                  ? 'Nous utilisons Google Analytics sur le site vitrine pour comprendre les visites et améliorer votre expérience. '
                  : 'We use Google Analytics on the marketing site to understand visits and improve the experience. '}
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
