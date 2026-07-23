'use server';

import { redirect } from 'next/navigation';
import { revalidatePath, updateTag } from 'next/cache';
import { headers } from 'next/headers';
import {
  createServerSupabaseClient,
  createServiceSupabaseClient,
} from '@/lib/config/supabase-server';
import { ensureAccountProfile } from '@/lib/services/account-profile';
import {
  cancelStripeSubscription,
  deleteStripeCustomer,
} from '@/lib/services/stripe';
import {
  athleteDirectoryCacheTag,
  getPublicProfileCacheTag,
} from '@/lib/cache/profile-cache';

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

  if (data.user) {
    try {
      await ensureAccountProfile(data.user);
    } catch (profileError) {
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

async function removeAccountMedia(userId: string) {
  const serviceSupabase = createServiceSupabaseClient();
  const folders = [
    'avatars',
    'covers',
    'gallery',
    'sponsors',
    'offers',
    'links',
    'sharing',
  ];

  for (const folder of folders) {
    const directory = `${userId}/${folder}`;

    while (true) {
      const { data, error } = await serviceSupabase.storage
        .from('profile-media')
        .list(directory, { limit: 100 });

      if (error) throw new Error(error.message);
      const paths = (data ?? [])
        .filter((entry) => entry.id)
        .map((entry) => `${directory}/${entry.name}`);

      if (!paths.length) break;
      const { error: removeError } = await serviceSupabase.storage
        .from('profile-media')
        .remove(paths);
      if (removeError) throw new Error(removeError.message);
    }
  }
}

export async function deleteAccountAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  if (String(formData.get('confirmation') ?? '').trim() !== 'DELETE MY ACCOUNT') {
    return {
      success: false,
      message: 'Type DELETE MY ACCOUNT exactly to confirm.',
    };
  }

  const supabase = await getServerSupabaseClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    return { success: false, message: 'You need to be signed in.' };
  }

  const userId = userData.user.id;
  const serviceSupabase = createServiceSupabaseClient();
  const [
    { data: publicProfiles, error: profilesError },
    subscriptionResult,
    customerResult,
  ] = await Promise.all([
      serviceSupabase
        .from('public_profiles')
        .select('username')
        .eq('user_id', userId),
      serviceSupabase
        .from('subscriptions')
        .select('stripe_subscription_id')
        .eq('user_id', userId),
      serviceSupabase
        .from('stripe_customers')
        .select('stripe_customer_id')
        .eq('user_id', userId)
        .maybeSingle(),
    ]);

  if (profilesError || subscriptionResult.error || customerResult.error) {
    return {
      success: false,
      message:
        profilesError?.message ??
        subscriptionResult.error?.message ??
        customerResult.error?.message ??
        'Unable to prepare account deletion.',
    };
  }

  try {
    for (const subscription of subscriptionResult.data ?? []) {
      try {
        await cancelStripeSubscription(subscription.stripe_subscription_id);
      } catch (error) {
        if (process.env.NODE_ENV === 'production') throw error;
        console.warn('Skipping local Stripe subscription cleanup:', error);
      }
    }
    if (customerResult.data?.stripe_customer_id) {
      try {
        await deleteStripeCustomer(customerResult.data.stripe_customer_id);
      } catch (error) {
        if (process.env.NODE_ENV === 'production') throw error;
        console.warn('Skipping local Stripe customer cleanup:', error);
      }
    }
    await removeAccountMedia(userId);
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Unable to safely delete this account.',
    };
  }

  const { error: profileDeleteError } = await serviceSupabase
    .from('profiles')
    .delete()
    .eq('id', userId);

  if (profileDeleteError) {
    return { success: false, message: profileDeleteError.message };
  }

  const { error: authDeleteError } =
    await serviceSupabase.auth.admin.deleteUser(userId);
  if (authDeleteError) {
    return { success: false, message: authDeleteError.message };
  }

  for (const profile of publicProfiles ?? []) {
    updateTag(getPublicProfileCacheTag(profile.username));
  }
  updateTag(athleteDirectoryCacheTag);
  revalidatePath('/');
  revalidatePath('/athletes');
  await supabase.auth.signOut();

  return { success: true, message: 'Account deleted.' };
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
