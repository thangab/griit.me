'use client';

import { SignInIcon as LogIn } from '@phosphor-icons/react/ssr';
import { createBrowserSupabaseClient } from '@/lib/config/supabase-client';
import { Button } from '@/components/ui/button';

export function GoogleSignInButton() {
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
      className="w-full gap-2"
      onClick={handleGoogleSignIn}
    >
      <LogIn className="h-4 w-4" />
      Continue with Google
    </Button>
  );
}
