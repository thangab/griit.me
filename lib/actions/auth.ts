'use server';

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import {
  createServerSupabaseClient,
  createServiceSupabaseClient,
} from '@/lib/config/supabase-server';

export interface AuthActionState {
  success: boolean;
  message: string;
}

async function getServerSupabaseClient() {
  return createServerSupabaseClient();
}

async function getAppOrigin() {
  const configuredOrigin = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '');
  if (configuredOrigin) return configuredOrigin;

  const requestHeaders = await headers();
  const host =
    requestHeaders.get('x-forwarded-host') ?? requestHeaders.get('host');

  if (!host) return 'http://localhost:3000';

  const protocol =
    requestHeaders.get('x-forwarded-proto') ??
    (host.startsWith('localhost') ? 'http' : 'https');

  return `${protocol}://${host}`;
}

export async function signInAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '').trim();

  if (!email || !password) {
    return {
      success: false,
      message: 'Please provide both email and password.',
    };
  }

  const supabase = await getServerSupabaseClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.session) {
    return { success: false, message: error?.message ?? 'Unable to sign in.' };
  }

  redirect('/dashboard');
}

export async function signUpAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '').trim();

  if (!email || !password) {
    return {
      success: false,
      message: 'Please provide both email and password.',
    };
  }

  const [supabase, appOrigin] = await Promise.all([
    getServerSupabaseClient(),
    getAppOrigin(),
  ]);
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${appOrigin}/auth/callback`,
    },
  });

  if (error) {
    return { success: false, message: error.message };
  }

  const userId = data.user?.id;

  if (userId) {
    const serviceSupabase = createServiceSupabaseClient();
    const { error: profileError } = await serviceSupabase
      .from('profiles')
      .upsert(
        {
          id: userId,
          email,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' },
      );

    if (profileError) {
      console.error('Failed to create profile after sign up:', profileError);
    }
  }

  if (!data.session) {
    return {
      success: true,
      message: 'Account created. Check your email to confirm your account.',
    };
  }

  redirect('/dashboard');
}

export async function signOutAction() {
  const supabase = await getServerSupabaseClient();
  await supabase.auth.signOut();
  redirect('/sign-in');
}

export async function getSession() {
  const supabase = await getServerSupabaseClient();
  const { data, error } = await supabase.auth.getSession();

  if (error || !data.session) {
    return null;
  }

  return {
    authenticated: true,
    user: data.session.user,
  };
}
