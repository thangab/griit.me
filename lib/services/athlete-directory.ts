import 'server-only';

import { unstable_cache } from 'next/cache';
import { createPublicSupabaseClient } from '@/lib/config/supabase-server';
import { defaultSports } from '@/lib/constants/sports';

export type AthleteDirectorySport = {
  name: string;
  slug: string;
};

export type AthleteDirectoryEntry = {
  id: number;
  username: string;
  displayName: string;
  bio: string;
  location: string;
  avatarUrl: string;
  coverUrl: string;
  theme: Record<string, unknown>;
  sports: AthleteDirectorySport[];
  goal: string;
};

export type AthleteDirectoryData = {
  athletes: AthleteDirectoryEntry[];
  sports: AthleteDirectorySport[];
};

type ProfileRow = {
  id: number;
  username: string;
  display_name: string;
  bio: string | null;
  location: string | null;
  avatar_url: string | null;
  cover_url: string | null;
  theme: Record<string, unknown> | null;
};

type ProfileSportRow = {
  profile_id: number;
  sort_order: number;
  sports:
    | { name: string; slug: string }
    | Array<{ name: string; slug: string }>
    | null;
};

type GoalRow = {
  profile_id: number;
  title: string;
};

async function loadAthleteDirectory(): Promise<AthleteDirectoryData> {
  const supabase = createPublicSupabaseClient();
  const [profilesResult, sportsResult] = await Promise.all([
    supabase
      .from('public_profiles')
      .select(
        'id, username, display_name, bio, location, avatar_url, cover_url, theme',
      )
      .eq('is_published', true)
      .order('updated_at', { ascending: false }),
    supabase
      .from('sports')
      .select('name, slug')
      .eq('is_enabled', true)
      .order('sort_order', { ascending: true }),
  ]);

  const profiles = (profilesResult.data ?? []) as ProfileRow[];
  const profileIds = profiles.map((profile) => profile.id);
  const sports = (
    sportsResult.data?.length ? sportsResult.data : defaultSports
  ) as AthleteDirectorySport[];

  if (!profileIds.length) {
    return { athletes: [], sports };
  }

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

  return {
    sports,
    athletes: profiles.map((profile) => ({
      id: profile.id,
      username: profile.username,
      displayName: profile.display_name,
      bio: profile.bio ?? '',
      location: profile.location ?? '',
      avatarUrl: profile.avatar_url ?? '',
      coverUrl: profile.cover_url ?? '',
      theme: profile.theme ?? {},
      sports: sportsByProfile.get(profile.id) ?? [],
      goal: goalByProfile.get(profile.id) ?? '',
    })),
  };
}

export const getAthleteDirectory = unstable_cache(
  loadAthleteDirectory,
  ['athlete-directory'],
  { revalidate: 60 },
);
