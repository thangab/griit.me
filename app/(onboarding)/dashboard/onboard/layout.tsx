import type { Metadata } from 'next';
import { ProtectedLayout } from '@/components/layout/protected-layout';
import { JavaScriptRequired } from '@/components/layout/javascript-required';
import { I18nProvider } from '@/components/i18n/i18n-provider';
import { getRequestDictionary } from '@/lib/i18n/server';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { dictionary, locale } = await getRequestDictionary();

  return (
    <I18nProvider dictionary={dictionary} locale={locale}>
      <JavaScriptRequired
        description={dictionary['auth.javascript.description']}
        id="griit-onboarding-app"
        title={dictionary['auth.javascript.title']}
      >
        <ProtectedLayout>{children}</ProtectedLayout>
      </JavaScriptRequired>
    </I18nProvider>
  );
}
