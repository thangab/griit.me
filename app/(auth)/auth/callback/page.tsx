'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserSupabaseClient } from '@/lib/config/supabase-client';
import { Button } from '@/components/ui/button';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [message, setMessage] = useState('Completing Google sign-in...');

  useEffect(() => {
    async function handleCallback() {
      const supabase = createBrowserSupabaseClient();
      const auth = supabase.auth as any;

      if (typeof auth.getSessionFromUrl === 'function') {
        await auth.getSessionFromUrl();
      }

      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        setMessage('Unable to confirm Google sign-in. Please try again.');
        return;
      }

      const user = data.session.user;
      const payload = {
        userId: user.id,
        email: user.email,
        full_name:
          (user.user_metadata as any)?.full_name ||
          (user.user_metadata as any)?.name ||
          null,
        avatar_url: user.user_metadata?.avatar_url || user.avatar_url || null,
      };

      await fetch('/api/profile-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      router.replace('/dashboard');
    }

    handleCallback();
  }, [router]);

  return (
    <main className="bg-background flex min-h-screen items-center justify-center px-6">
      <div className="border-border bg-card w-full max-w-lg rounded-3xl border p-8 text-center">
        <p className="text-muted-foreground text-sm">{message}</p>
        {message.includes('Unable') ? (
          <div className="mt-6">
            <Button onClick={() => router.push('/auth/sign-in')}>
              Return to sign in
            </Button>
          </div>
        ) : null}
      </div>
    </main>
  );
}
