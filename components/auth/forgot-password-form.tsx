'use client';

import { useState } from 'react';
import { createBrowserSupabaseClient } from '@/lib/config/supabase-client';
import { Button } from '@/components/ui/button';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<
    'idle' | 'pending' | 'success' | 'error'
  >('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('pending');
    setMessage('');

    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
      setStatus('error');
      setMessage(error.message || 'Unable to send reset link.');
      return;
    }

    setStatus('success');
    setMessage('A password reset link has been sent to your email.');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="forgot-email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="forgot-email"
          name="email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="border-border bg-background h-10 w-full rounded-md border px-3 text-sm"
          placeholder="you@athlete.com"
        />
      </div>

      {message ? (
        <p
          className={`text-sm ${status === 'error' ? 'text-destructive' : 'text-foreground'}`}
        >
          {message}
        </p>
      ) : null}

      <Button type="submit" className="w-full" disabled={status === 'pending'}>
        {status === 'pending' ? 'Sending reset link…' : 'Send reset link'}
      </Button>
    </form>
  );
}
