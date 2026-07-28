import { ProtectedLayout } from '@/components/layout/protected-layout';
import { AppShell } from '@/components/layout/app-shell';
import { JavaScriptRequired } from '@/components/layout/javascript-required';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <JavaScriptRequired id="griit-dashboard-app">
      <ProtectedLayout>
        <AppShell>{children}</AppShell>
      </ProtectedLayout>
    </JavaScriptRequired>
  );
}
