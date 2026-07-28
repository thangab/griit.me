import Link from 'next/link';
import { AuthShell } from '@/components/auth/auth-shell';
import { SignInForm } from '@/components/auth/sign-in-form';
import { AuthFormMessage } from '@/components/auth/auth-form-message';
import { getRequestDictionary } from '@/lib/i18n/server';

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ authError?: string }>;
}) {
  const { authError } = await searchParams;
  const { dictionary } = await getRequestDictionary();

  return (
    <AuthShell
      description={dictionary['auth.signIn.description']}
      title={dictionary['auth.signIn.title']}
    >
      {authError ? (
        <div className="mb-4">
          <AuthFormMessage
            message="The confirmation link is invalid or has expired. Request a new link or sign in if your account is already confirmed."
            title="Unable to confirm your account"
            type="error"
          />
        </div>
      ) : null}
      <SignInForm />
      <p className="mt-7 text-center text-sm text-black/45">
        {dictionary['auth.signIn.newHere']}{' '}
        <Link href="/sign-up" className="font-bold text-[#3157ff]">
          {dictionary['auth.signIn.createAccount']}
        </Link>
      </p>
    </AuthShell>
  );
}
