'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { signUpAction, type AuthActionState } from '@/lib/actions/auth';
import { Button } from '@/components/ui/button';
import { GoogleSignInButton } from '@/components/auth/google-sign-in-button';
import { AuthFormMessage } from '@/components/auth/auth-form-message';

const initialState: AuthActionState = { success: false, message: '' };

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="h-12 w-full rounded-xl bg-[#151515] text-white hover:bg-[#151515]/90"
      disabled={pending}
    >
      {pending ? 'Creating account…' : 'Create account'}
    </Button>
  );
}

export function SignUpForm() {
  const [state, formAction] = useActionState(signUpAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <GoogleSignInButton />
      <div className="flex items-center gap-4 py-1">
        <span className="h-px flex-1 bg-black/10" />
        <span className="text-[11px] font-bold tracking-[0.12em] text-black/35 uppercase">
          or continue with email
        </span>
        <span className="h-px flex-1 bg-black/10" />
      </div>
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="h-12 w-full rounded-xl border border-black/12 bg-white px-4 text-sm transition outline-none focus:border-[#3157ff] focus:ring-3 focus:ring-[#3157ff]/10"
          placeholder="you@athlete.com"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="h-12 w-full rounded-xl border border-black/12 bg-white px-4 text-sm transition outline-none focus:border-[#3157ff] focus:ring-3 focus:ring-[#3157ff]/10"
          placeholder="••••••••"
        />
      </div>
      {state.message ? (
        <AuthFormMessage
          message={state.message}
          title={
            state.success ? 'Check your inbox' : 'Unable to create account'
          }
          type={state.success ? 'success' : 'error'}
        />
      ) : null}
      <SubmitButton />
    </form>
  );
}
