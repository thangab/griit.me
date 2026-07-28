import Link from 'next/link';
import { ArrowLeftIcon } from '@phosphor-icons/react/ssr';
import { AuthShell } from '@/components/auth/auth-shell';
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';
import { getRequestDictionary } from '@/lib/i18n/server';

export default async function ForgotPasswordPage() {
  const { dictionary } = await getRequestDictionary();

  return (
    <AuthShell
      description={dictionary['auth.forgot.description']}
      title={dictionary['auth.forgot.title']}
    >
      <ForgotPasswordForm />
      <Link
        className="mt-7 flex items-center justify-center gap-2 text-sm font-bold text-[#3157ff]"
        href="/sign-in"
      >
        <ArrowLeftIcon className="h-4 w-4" weight="bold" />
        {dictionary['auth.forgot.back']}
      </Link>
    </AuthShell>
  );
}
