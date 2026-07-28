import type { Metadata } from 'next';
import { JavaScriptRequired } from '@/components/layout/javascript-required';
import { I18nProvider } from '@/components/i18n/i18n-provider';
import { getRequestDictionary } from '@/lib/i18n/server';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { dictionary, locale } = await getRequestDictionary();

  return (
    <I18nProvider dictionary={dictionary} locale={locale}>
      <JavaScriptRequired
        description={dictionary['auth.javascript.description']}
        id="griit-auth-app"
        title={dictionary['auth.javascript.title']}
      >
        {children}
      </JavaScriptRequired>
    </I18nProvider>
  );
}
