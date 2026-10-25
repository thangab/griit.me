import Link from 'next/link';
import { AuthShell } from '@/components/auth/auth-shell';
import { SignUpForm } from '@/components/auth/sign-up-form';
import { getRequestDictionary } from '@/lib/i18n/server';
import { MarketingFunnelEvent } from '@/components/marketing/marketing-funnel-event';

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{
    template?: string;
    source?: string;
    profile?: string;
  }>;
}) {
  const { dictionary } = await getRequestDictionary();
  const { template, source, profile } = await searchParams;

  return (
    <AuthShell
      description={dictionary['auth.signUp.description']}
      title={dictionary['auth.signUp.title']}
    >
      <MarketingFunnelEvent
        name="signup_view"
        parameters={{ template, source, profile }}
      />
      <SignUpForm profile={profile} source={source} templateId={template} />
      <p className="mt-7 text-center text-sm text-black/45">
        {dictionary['auth.signUp.hasAccount']}{' '}
        <Link href="/sign-in" className="font-bold text-[#3157ff]">
          {dictionary['auth.signUp.signIn']}
        </Link>
      </p>
    </AuthShell>
  );
}
