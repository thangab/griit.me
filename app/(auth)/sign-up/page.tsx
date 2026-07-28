import Link from 'next/link';
import { AuthShell } from '@/components/auth/auth-shell';
import { SignUpForm } from '@/components/auth/sign-up-form';
import { getRequestDictionary } from '@/lib/i18n/server';

export default async function SignUpPage() {
  const { dictionary } = await getRequestDictionary();

  return (
    <AuthShell
      description={dictionary['auth.signUp.description']}
      title={dictionary['auth.signUp.title']}
    >
      <SignUpForm />
      <p className="mt-7 text-center text-sm text-black/45">
        {dictionary['auth.signUp.hasAccount']}{' '}
        <Link href="/sign-in" className="font-bold text-[#3157ff]">
          {dictionary['auth.signUp.signIn']}
        </Link>
      </p>
    </AuthShell>
  );
}
