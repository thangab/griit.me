'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserSupabaseClient } from '@/lib/config/supabase-client';
import { Button } from '@/components/ui/button';

export function ResetPasswordForm() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<
    'idle' | 'pending' | 'success' | 'error'
  >('idle');
  const [message, setMessage] = useState('');
  const [sessionLoaded, setSessionLoaded] = useState(false);

  useEffect(() => {
    async function handleSession() {
      const supabase = createBrowserSupabaseClient();
      const auth = supabase.auth as any;

      if (typeof auth.getSessionFromUrl === 'function') {
        await auth.getSessionFromUrl();
      }

      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        setStatus('error');
        setMessage(
          'Unable to validate password reset session. Please retry from the email link.',
        );
        return;
      }

      setSessionLoaded(true);
    }

    handleSession();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (newPassword.length < 8) {
      setStatus('error');
      setMessage('Password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatus('error');
      setMessage('Passwords do not match.');
      return;
    }

    setStatus('pending');
    setMessage('Updating password...');

    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setStatus('error');
      setMessage(error.message || 'Unable to update password.');
      return;
    }

    setStatus('success');
    setMessage(
      'Password updated successfully. Redirecting to your dashboard...',
    );

    window.setTimeout(() => {
      router.replace('/dashboard');
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <div className="border-border bg-background rounded-2xl border p-6">
        <h1 className="text-2xl font-semibold">Reset your password</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Enter a new password to complete the reset process.
        </p>
      </div>

      {status === 'error' && (
        <div className="border-destructive/20 bg-destructive/5 text-destructive rounded-2xl border p-4 text-sm">
          {message}
        </div>
      )}

      {!sessionLoaded ? (
        <div className="border-border bg-background text-muted-foreground space-y-4 rounded-2xl border p-6 text-sm">
          <p>
            {status === 'error'
              ? 'Failed to validate the reset session. Please return to the link in your email or request a new reset.'
              : 'Validating reset link...'}
          </p>
          {status === 'error' ? (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push('/auth/forgot-password')}
            >
              Request a new reset link
            </Button>
          ) : null}
        </div>
      ) : status === 'success' ? (
        <div className="border-border bg-background text-foreground rounded-2xl border p-6 text-sm">
          <p>{message}</p>
          <div className="mt-4">
            <Button
              className="w-full"
              onClick={() => router.replace('/dashboard')}
            >
              Continue to dashboard
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="new-password" className="text-sm font-medium">
              New password
            </label>
            <input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              required
              minLength={8}
              className="border-border bg-background h-10 w-full rounded-md border px-3 text-sm"
              placeholder="••••••••"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="confirm-password" className="text-sm font-medium">
              Confirm password
            </label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
              minLength={8}
              className="border-border bg-background h-10 w-full rounded-md border px-3 text-sm"
              placeholder="••••••••"
            />
          </div>

          {message && status !== 'error' ? (
            <p className="text-muted-foreground text-sm">{message}</p>
          ) : null}

          <Button
            type="submit"
            className="w-full"
            disabled={status === 'pending'}
          >
            {status === 'pending' ? 'Updating password…' : 'Update password'}
          </Button>
        </form>
      )}
    </div>
  );
}
