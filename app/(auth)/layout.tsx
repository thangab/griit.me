import { JavaScriptRequired } from '@/components/layout/javascript-required';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <JavaScriptRequired id="griit-auth-app">{children}</JavaScriptRequired>
  );
}
