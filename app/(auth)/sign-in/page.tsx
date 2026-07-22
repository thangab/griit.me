import Link from 'next/link';
import { AuthShell } from '@/components/auth/auth-shell';
import { SignInForm } from '@/components/auth/sign-in-form';

export default function SignInPage() {
  return (
    <AuthShell
      description="Welcome back. Continue building your athlete profile."
      title="Welcome back"
    >
      <SignInForm />
      <p className="mt-7 text-center text-sm text-black/45">
        New here?{' '}
        <Link href="/sign-up" className="font-bold text-[#3157ff]">
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}
