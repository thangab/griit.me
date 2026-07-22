import type { EmailOtpType } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import {
  createServerSupabaseClient,
  createServiceSupabaseClient,
} from '@/lib/config/supabase-server';

const emailOtpTypes: EmailOtpType[] = [
  'email',
  'signup',
  'invite',
  'magiclink',
  'recovery',
  'email_change',
];

function getMetadataString(metadata: Record<string, unknown>, key: string) {
  const value = metadata[key];
  return typeof value === 'string' ? value : null;
}

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
  const metadata = user.user_metadata;
  const serviceSupabase = createServiceSupabaseClient();
  const { error: profileError } = await serviceSupabase.from('profiles').upsert(
    {
      id: user.id,
      email: user.email,
      full_name:
        getMetadataString(metadata, 'full_name') ??
        getMetadataString(metadata, 'name'),
      avatar_url: getMetadataString(metadata, 'avatar_url'),
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'id' },
  );

  if (profileError) {
    console.error('Failed to sync profile after auth callback:', profileError);
  }

  const dashboardUrl = request.nextUrl.clone();
  dashboardUrl.pathname = '/dashboard';
  dashboardUrl.search = '';
  return NextResponse.redirect(dashboardUrl);
}
