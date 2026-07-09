'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/config/supabase-server';

export interface AuthActionState {
  success: boolean;
  message: string;
}

async function getServerSupabaseClient() {
  return createServerSupabaseClient();
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

  const supabase = await getServerSupabaseClient();
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return { success: false, message: error.message };
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
  redirect('/auth/sign-in');
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
