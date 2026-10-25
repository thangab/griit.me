import type { Metadata } from 'next';
import { JavaScriptRequired } from '@/components/layout/javascript-required';
import { I18nProvider } from '@/components/i18n/i18n-provider';
import { getRequestDictionary } from '@/lib/i18n/server';
import { MarketingAnalytics } from '@/components/marketing/marketing-analytics';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { dictionary, locale } = await getRequestDictionary();
  const configuredMeasurementId =
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
  const measurementId = configuredMeasurementId?.startsWith('G-')
    ? configuredMeasurementId
    : undefined;

  return (
    <I18nProvider dictionary={dictionary} locale={locale}>
      <JavaScriptRequired
        description={dictionary['auth.javascript.description']}
        id="griit-auth-app"
        title={dictionary['auth.javascript.title']}
      >
        {children}
      </JavaScriptRequired>
      <MarketingAnalytics measurementId={measurementId} />
    </I18nProvider>
  );
}
