'use client';

import { GoogleLogoIcon } from '@phosphor-icons/react/ssr';
import { createBrowserSupabaseClient } from '@/lib/config/supabase-client';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/components/i18n/i18n-provider';
import { trackMarketingFunnelEvent } from '@/lib/analytics/marketing-funnel';

export function GoogleSignInButton({
  profile,
  source,
  templateId,
}: {
  profile?: string;
  source?: string;
  templateId?: string;
}) {
  const { t } = useI18n();
  const handleGoogleSignIn = async () => {
    trackMarketingFunnelEvent('signup_submit', {
      method: 'google',
      profile,
      source,
      template: templateId,
    });
    const callbackUrl = new URL('/auth/callback', window.location.origin);
    if (templateId) callbackUrl.searchParams.set('template', templateId);
    if (source) callbackUrl.searchParams.set('source', source);
    if (profile) callbackUrl.searchParams.set('profile', profile);
    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: callbackUrl.toString(),
      },
    });

    if (error) {
      window.alert(error.message);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="h-12 w-full gap-2 rounded-xl border-black/12 bg-white font-bold hover:bg-black/[0.03]"
      onClick={handleGoogleSignIn}
    >
      <GoogleLogoIcon className="h-5 w-5" weight="bold" />
      {t('auth.google')}
    </Button>
  );
}
