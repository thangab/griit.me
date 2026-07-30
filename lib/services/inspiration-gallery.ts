import 'server-only';

import { unstable_cache } from 'next/cache';
import { createPublicSupabaseClient } from '@/lib/config/supabase-server';
import { athleteDirectoryCacheTag } from '@/lib/cache/profile-cache';
import type {
  AthleteDirectoryEntry,
  AthleteDirectorySport,
} from '@/lib/services/athlete-directory';

type ProfileRow = {
  id: number;
  username: string;
  display_name: string;
  bio: string | null;
  location: string | null;
  avatar_url: string | null;
  cover_url: string | null;
  preview_image_url: string | null;
  theme: Record<string, unknown> | null;
};

type ProfileSportRow = {
  profile_id: number;
  sports:
    | { name: string; slug: string }
    | Array<{ name: string; slug: string }>
    | null;
};

type GoalRow = {
  profile_id: number;
  title: string;
};

async function loadInspirationProfiles(): Promise<AthleteDirectoryEntry[]> {
  const supabase = createPublicSupabaseClient();
  const profilesResult = await supabase
    .from('public_profiles')
    .select(
      'id, username, display_name, bio, location, avatar_url, cover_url, preview_image_url, theme',
    )
    .like('username', 'demo\\_%')
    .eq('is_published', true)
    .order('id', { ascending: true });

  if (profilesResult.error) {
    console.error(
      'Unable to load inspiration profiles:',
      profilesResult.error.message,
    );
    throw new Error('Unable to load inspiration profiles.');
  }

  const profiles = (profilesResult.data ?? []) as ProfileRow[];
  const profileIds = profiles.map((profile) => profile.id);

  if (!profileIds.length) return [];

  const [profileSportsResult, goalsResult] = await Promise.all([
    supabase
      .from('profile_sports')
      .select('profile_id, sort_order, sports(name, slug)')
      .in('profile_id', profileIds)
      .eq('is_enabled', true)
      .order('sort_order', { ascending: true }),
    supabase
      .from('profile_goals')
      .select('profile_id, title')
      .in('profile_id', profileIds)
      .eq('is_enabled', true)
      .order('sort_order', { ascending: true }),
  ]);

  if (profileSportsResult.error) {
    console.error(
      'Unable to load inspiration sports:',
      profileSportsResult.error.message,
    );
  }
  if (goalsResult.error) {
    console.error(
      'Unable to load inspiration goals:',
      goalsResult.error.message,
    );
  }
  const sportsByProfile = new Map<number, AthleteDirectorySport[]>();

  for (const row of (profileSportsResult.data ?? []) as ProfileSportRow[]) {
    const sport = Array.isArray(row.sports) ? row.sports[0] : row.sports;
    if (!sport) continue;
    sportsByProfile.set(row.profile_id, [
      ...(sportsByProfile.get(row.profile_id) ?? []),
      sport,
    ]);
  }

  const goalByProfile = new Map<number, string>();
  for (const goal of (goalsResult.data ?? []) as GoalRow[]) {
    if (!goalByProfile.has(goal.profile_id)) {
      goalByProfile.set(goal.profile_id, goal.title);
    }
  }

  return profiles.map((profile) => ({
    id: profile.id,
    username: profile.username,
    displayName: profile.display_name,
    bio: profile.bio ?? '',
    location: profile.location ?? '',
    avatarUrl: profile.avatar_url ?? '',
    coverUrl: profile.cover_url ?? '',
    previewImageUrl: profile.preview_image_url ?? '',
    theme: profile.theme ?? {},
    sports: sportsByProfile.get(profile.id) ?? [],
    goal: goalByProfile.get(profile.id) ?? '',
  }));
}

export const getInspirationProfiles = unstable_cache(
  loadInspirationProfiles,
  ['inspiration-gallery-v2'],
  { revalidate: 300, tags: [athleteDirectoryCacheTag] },
);
