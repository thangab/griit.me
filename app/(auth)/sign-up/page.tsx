import Link from 'next/link';
import { AuthShell } from '@/components/auth/auth-shell';
import { SignUpForm } from '@/components/auth/sign-up-form';

export default function SignUpPage() {
  return (
    <AuthShell
      description="Create your public profile and start sharing your journey."
      title="Create your account"
    >
      <SignUpForm />
      <p className="mt-7 text-center text-sm text-black/45">
        Already have an account?{' '}
        <Link href="/sign-in" className="font-bold text-[#3157ff]">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
