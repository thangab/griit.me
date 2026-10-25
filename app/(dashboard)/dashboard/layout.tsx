import type { Metadata } from 'next';
import { ProtectedLayout } from '@/components/layout/protected-layout';
import { AppShell } from '@/components/layout/app-shell';
import { JavaScriptRequired } from '@/components/layout/javascript-required';
import { I18nProvider } from '@/components/i18n/i18n-provider';
import { getRequestDictionary } from '@/lib/i18n/server';
import { MarketingAnalytics } from '@/components/marketing/marketing-analytics';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({
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
        id="griit-dashboard-app"
        title={dictionary['auth.javascript.title']}
      >
        <ProtectedLayout>
          <AppShell>{children}</AppShell>
        </ProtectedLayout>
      </JavaScriptRequired>
      <MarketingAnalytics measurementId={measurementId} locale={locale} />
    </I18nProvider>
  );
}
