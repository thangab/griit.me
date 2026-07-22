import type { EmailOtpType } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/config/supabase-server';
import { ensureAccountProfile } from '@/lib/services/account-profile';

const emailOtpTypes: EmailOtpType[] = [
  'email',
  'signup',
  'invite',
  'magiclink',
  'recovery',
  'email_change',
];

function redirectToSignIn(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = '/sign-in';
  url.search = '?authError=confirmation_failed';
  return NextResponse.redirect(url);
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  const tokenHash = request.nextUrl.searchParams.get('token_hash');
  const requestedType = request.nextUrl.searchParams.get('type');
  const supabase = await createServerSupabaseClient();

  const result = code
    ? await supabase.auth.exchangeCodeForSession(code)
    : tokenHash &&
        requestedType &&
        emailOtpTypes.includes(requestedType as EmailOtpType)
      ? await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: requestedType as EmailOtpType,
        })
      : await supabase.auth.getUser();

  if (result.error || !result.data.user) {
    return redirectToSignIn(request);
  }

  const user = result.data.user;
  try {
    await ensureAccountProfile(user);
  } catch (error) {
    console.error('Failed to sync profile after auth callback:', error);
  }

  const onboardingUrl = request.nextUrl.clone();
  onboardingUrl.pathname = '/dashboard/onboard';
  onboardingUrl.search = '';
  return NextResponse.redirect(onboardingUrl);
}
