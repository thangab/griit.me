import 'server-only';

import { createServiceSupabaseClient } from '@/lib/config/supabase-server';

type AccountUser = {
  id: string;
  email?: string | null;
  user_metadata?: Record<string, unknown>;
};

function getMetadataString(
  metadata: Record<string, unknown> | undefined,
  key: string,
) {
  const value = metadata?.[key];
  return typeof value === 'string' ? value : null;
}

export async function ensureAccountProfile(user: AccountUser) {
  const serviceSupabase = createServiceSupabaseClient();
  const email = user.email?.trim() || `${user.id}@users.griit.local`;
  const { data: existingEmailOwner, error: lookupError } = await serviceSupabase
    .from('profiles')
    .select('id')
    .eq('email', email)
    .maybeSingle();

  if (lookupError) throw new Error(lookupError.message);

  if (existingEmailOwner && existingEmailOwner.id !== user.id) {
    const { count, error: profileCountError } = await serviceSupabase
      .from('public_profiles')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', existingEmailOwner.id);

    if (profileCountError) throw new Error(profileCountError.message);

    if ((count ?? 0) > 0) {
      throw new Error(
        'This email is still linked to another account with public profiles.',
      );
    }

    const { error: deleteError } = await serviceSupabase
      .from('profiles')
      .delete()
      .eq('id', existingEmailOwner.id);

    if (deleteError) throw new Error(deleteError.message);
  }

  const { error: upsertError } = await serviceSupabase.from('profiles').upsert(
    {
      id: user.id,
      email,
      full_name:
        getMetadataString(user.user_metadata, 'full_name') ??
        getMetadataString(user.user_metadata, 'name'),
      avatar_url: getMetadataString(user.user_metadata, 'avatar_url'),
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'id' },
  );

  if (upsertError) throw new Error(upsertError.message);
}
