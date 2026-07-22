'use client';

import { useState } from 'react';
import { createBrowserSupabaseClient } from '@/lib/config/supabase-client';
import { Button } from '@/components/ui/button';
import { AuthFormMessage } from '@/components/auth/auth-form-message';

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
      redirectTo: `${window.location.origin}/reset-password`,
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
          className="h-12 w-full rounded-xl border border-black/12 bg-white px-4 text-sm transition outline-none focus:border-[#3157ff] focus:ring-3 focus:ring-[#3157ff]/10"
          placeholder="you@athlete.com"
        />
      </div>

      {message ? (
        <AuthFormMessage
          message={message}
          title={status === 'error' ? 'Link not sent' : 'Check your inbox'}
          type={status === 'error' ? 'error' : 'success'}
        />
      ) : null}

      <Button
        type="submit"
        className="h-12 w-full rounded-xl bg-[#151515] text-white hover:bg-[#151515]/90"
        disabled={status === 'pending'}
      >
        {status === 'pending' ? 'Sending reset link…' : 'Send reset link'}
      </Button>
    </form>
  );
}
