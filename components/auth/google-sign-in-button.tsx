'use client';

import { GoogleLogoIcon } from '@phosphor-icons/react/ssr';
import { createBrowserSupabaseClient } from '@/lib/config/supabase-client';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/components/i18n/i18n-provider';

export function GoogleSignInButton() {
  const { t } = useI18n();
  const handleGoogleSignIn = async () => {
    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
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
