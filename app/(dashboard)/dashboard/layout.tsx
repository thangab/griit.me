import { ProtectedLayout } from '@/components/layout/protected-layout';
import { AppShell } from '@/components/layout/app-shell';
import { JavaScriptRequired } from '@/components/layout/javascript-required';
import { I18nProvider } from '@/components/i18n/i18n-provider';
import { getRequestDictionary } from '@/lib/i18n/server';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { dictionary, locale } = await getRequestDictionary();

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
    </I18nProvider>
  );
}
