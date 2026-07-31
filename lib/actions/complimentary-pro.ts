'use server';

import { revalidatePath, updateTag } from 'next/cache';
import {
  createServerSupabaseClient,
  createServiceSupabaseClient,
} from '@/lib/config/supabase-server';
import { getPublicProfileCacheTag } from '@/lib/cache/profile-cache';

export type ComplimentaryProActionState = {
  success: boolean;
  message: string;
};

async function getAdminUser() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return null;

  const serviceSupabase = createServiceSupabaseClient();
  const { data: profile } = await serviceSupabase
    .from('profiles')
    .select('is_admin')
    .eq('id', data.user.id)
    .maybeSingle();

  return profile?.is_admin === true ? data.user : null;
}

export async function manageComplimentaryProAction(
  _previousState: ComplimentaryProActionState,
  formData: FormData,
): Promise<ComplimentaryProActionState> {
  const admin = await getAdminUser();
  if (!admin) {
    return { success: false, message: 'Administrator access required.' };
  }

  const userId = String(formData.get('userId') ?? '').trim();
  const intent = String(formData.get('intent') ?? 'grant');
  const note = String(formData.get('note') ?? '')
    .trim()
    .slice(0, 500);
  const expirationDate = String(formData.get('expirationDate') ?? '').trim();

  if (!/^[0-9a-f-]{36}$/i.test(userId)) {
    return { success: false, message: 'Invalid account.' };
  }

  const supabase = createServiceSupabaseClient();
  const { data: account } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', userId)
    .maybeSingle();
  if (!account) return { success: false, message: 'Account not found.' };

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('plan, status')
    .eq('user_id', userId)
    .maybeSingle();
  const hasPaidPro =
    subscription?.plan === 'pro' &&
    !['past_due', 'cancelled'].includes(subscription.status);

  const refreshAccountProfiles = async () => {
    const { data: profiles } = await supabase
      .from('public_profiles')
      .select('username')
      .eq('user_id', userId);
    for (const profile of profiles ?? []) {
      updateTag(getPublicProfileCacheTag(profile.username));
    }
  };

  if (intent === 'revoke') {
    const { error } = await supabase
      .from('complimentary_pro_access')
      .delete()
      .eq('user_id', userId);

    if (error) return { success: false, message: error.message };
    const { error: brandingError } = await supabase
      .from('public_profiles')
      .update({
        show_branding: !hasPaidPro,
        is_complimentary_pro: false,
        complimentary_pro_expires_at: null,
      })
      .eq('user_id', userId);
    if (brandingError) {
      return { success: false, message: brandingError.message };
    }
    await refreshAccountProfiles();
    revalidatePath('/dashboard/admin/pro-access');
    return { success: true, message: 'Complimentary Pro access removed.' };
  }

  let expiresAt: string | null = null;
  if (expirationDate) {
    const parsedExpiration = new Date(`${expirationDate}T23:59:59.999Z`);
    if (
      Number.isNaN(parsedExpiration.getTime()) ||
      parsedExpiration.getTime() <= Date.now()
    ) {
      return { success: false, message: 'Choose a future expiration date.' };
    }
    expiresAt = parsedExpiration.toISOString();
  }

  const now = new Date().toISOString();
  const { error } = await supabase.from('complimentary_pro_access').upsert(
    {
      user_id: userId,
      expires_at: expiresAt,
      note: note || null,
      granted_by: admin.id,
      updated_at: now,
    },
    { onConflict: 'user_id' },
  );

  if (error) return { success: false, message: error.message };

  const { error: brandingError } = await supabase
    .from('public_profiles')
    .update({
      show_branding: false,
      is_complimentary_pro: !hasPaidPro,
      complimentary_pro_expires_at: hasPaidPro ? null : expiresAt,
    })
    .eq('user_id', userId);
  if (brandingError) {
    await supabase
      .from('complimentary_pro_access')
      .delete()
      .eq('user_id', userId);
    return { success: false, message: brandingError.message };
  }

  await refreshAccountProfiles();
  revalidatePath('/dashboard/admin/pro-access');
  revalidatePath('/dashboard/subscribe');
  return {
    success: true,
    message: expiresAt
      ? 'Partner note and expiration saved.'
      : 'Partner note saved with no expiration date.',
  };
}
