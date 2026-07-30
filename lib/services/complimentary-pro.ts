import 'server-only';

import { createServiceSupabaseClient } from '@/lib/config/supabase-server';
import { isCurrentUserAdmin } from '@/lib/services/athlete-directory-review';

export type AdminComplimentaryProAccount = {
  userId: string;
  email: string;
  fullName: string;
  publicProfiles: string[];
  granted: boolean;
  active: boolean;
  expiresAt: string | null;
  note: string;
};

type AccountRow = {
  id: string;
  email: string | null;
  full_name: string | null;
};

type AccessRow = {
  user_id: string;
  expires_at: string | null;
  note: string | null;
};

export async function getAdminComplimentaryProAccounts(): Promise<
  AdminComplimentaryProAccount[] | null
> {
  if (!(await isCurrentUserAdmin())) return null;

  const supabase = createServiceSupabaseClient();
  const [{ data: accountData }, { data: accessData }, { data: profileData }] =
    await Promise.all([
      supabase
        .from('profiles')
        .select('id, email, full_name')
        .order('created_at', { ascending: false }),
      supabase
        .from('complimentary_pro_access')
        .select('user_id, expires_at, note'),
      supabase
        .from('public_profiles')
        .select('user_id, display_name, username')
        .order('created_at', { ascending: true }),
    ]);

  const accessByUserId = new Map(
    ((accessData ?? []) as AccessRow[]).map((access) => [
      access.user_id,
      access,
    ]),
  );
  const profilesByUserId = new Map<string, string[]>();

  for (const profile of profileData ?? []) {
    const profiles = profilesByUserId.get(profile.user_id) ?? [];
    profiles.push(`${profile.display_name} (@${profile.username})`);
    profilesByUserId.set(profile.user_id, profiles);
  }

  const now = Date.now();
  return ((accountData ?? []) as AccountRow[]).map((account) => {
    const access = accessByUserId.get(account.id);
    const expiresAt = access?.expires_at ?? null;

    return {
      userId: account.id,
      email: account.email ?? '',
      fullName: account.full_name ?? '',
      publicProfiles: profilesByUserId.get(account.id) ?? [],
      granted: Boolean(access),
      active:
        Boolean(access) && (!expiresAt || new Date(expiresAt).getTime() > now),
      expiresAt,
      note: access?.note ?? '',
    };
  });
}
