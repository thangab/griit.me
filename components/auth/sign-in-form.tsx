'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { signInAction, type AuthActionState } from '@/lib/actions/auth';
import { Button } from '@/components/ui/button';
import { GoogleSignInButton } from '@/components/auth/google-sign-in-button';
import { AuthFormMessage } from '@/components/auth/auth-form-message';
import Link from 'next/link';
import { useI18n } from '@/components/i18n/i18n-provider';

const initialState: AuthActionState = { success: false, message: '' };

function SubmitButton() {
  const { pending } = useFormStatus();
  const { t } = useI18n();

  return (
    <Button
      type="submit"
      className="h-12 w-full rounded-xl bg-[#151515] text-white hover:bg-[#151515]/90"
      disabled={pending}
    >
      {pending ? `${t('auth.continue')}…` : t('auth.continue')}
    </Button>
  );
}

export function SignInForm() {
  const { t } = useI18n();
  const [state, formAction] = useActionState(signInAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <GoogleSignInButton />
      <div className="flex items-center gap-4 py-1">
        <span className="h-px flex-1 bg-black/10" />
        <span className="text-[11px] font-bold tracking-[0.12em] text-black/35 uppercase">
          {t('auth.or')}
        </span>
        <span className="h-px flex-1 bg-black/10" />
      </div>
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          {t('auth.email')}
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
          {t('auth.password')}
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
          title={t('auth.signInError')}
          type="error"
        />
      ) : null}
      <SubmitButton />
      <p className="text-center text-sm text-black/45">
        <Link href="/forgot-password" className="font-bold text-[#3157ff]">
          {t('auth.forgotPassword')}
        </Link>
      </p>
    </form>
  );
}
