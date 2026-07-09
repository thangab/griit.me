'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { signUpAction, type AuthActionState } from '@/lib/actions/auth';
import { Button } from '@/components/ui/button';
import { GoogleSignInButton } from '@/components/auth/google-sign-in-button';

const initialState: AuthActionState = { success: false, message: '' };

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? 'Creating account…' : 'Create account'}
    </Button>
  );
}

export function SignUpForm() {
  const [state, formAction] = useActionState(signUpAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="border-border bg-background h-10 w-full rounded-md border px-3 text-sm"
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
          className="border-border bg-background h-10 w-full rounded-md border px-3 text-sm"
          placeholder="••••••••"
        />
      </div>
      {state.message ? (
        <p className="text-muted-foreground text-sm">{state.message}</p>
      ) : null}
      <SubmitButton />
      <div className="mt-4">
        <GoogleSignInButton />
      </div>
    </form>
  );
}
