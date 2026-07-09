'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export interface AuthActionState {
  success: boolean;
  message: string;
}

export async function signInAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '').trim();

  if (!email || !password) {
    return { success: false, message: 'Please provide both email and password.' };
  }

  const cookieStore = await cookies();
  cookieStore.set('auth_session', JSON.stringify({ email, authenticated: true }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });

  redirect('/dashboard');
}

export async function signOutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('auth_session');
  redirect('/auth/sign-in');
}

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get('auth_session');

  if (!session?.value) {
    return null;
  }

  try {
    return JSON.parse(session.value) as { email: string; authenticated: boolean };
  } catch {
    return null;
  }
}
