import Link from 'next/link';
import { ArrowLeftIcon } from '@phosphor-icons/react/ssr';
import { AuthShell } from '@/components/auth/auth-shell';
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      description="Enter your email and we’ll send you a secure reset link."
      title="Reset your password"
    >
      <ForgotPasswordForm />
      <Link
        className="mt-7 flex items-center justify-center gap-2 text-sm font-bold text-[#3157ff]"
        href="/sign-in"
      >
        <ArrowLeftIcon className="h-4 w-4" weight="bold" />
        Back to sign in
      </Link>
    </AuthShell>
  );
}
