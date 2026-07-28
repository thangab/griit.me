import { ProtectedLayout } from '@/components/layout/protected-layout';
import { JavaScriptRequired } from '@/components/layout/javascript-required';

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <JavaScriptRequired id="griit-onboarding-app">
      <ProtectedLayout>{children}</ProtectedLayout>
    </JavaScriptRequired>
  );
}
