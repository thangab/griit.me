import { unstable_cache } from 'next/cache';
import type { SupabaseClient } from '@supabase/supabase-js';
import {
  createPublicSupabaseClient,
  createServerSupabaseClient,
} from '@/lib/config/supabase-server';
import { getPublicProfileCacheTag } from '@/lib/cache/profile-cache';
import { defaultSports } from '@/lib/constants/sports';
import type {
  BuilderBlock,
  BuilderGalleryItem,
  BuilderGoalItem,
  BuilderSocialLink,
  BuilderSponsor,
  BuilderTimelineItem,
  ProfileBuilderState,
} from '@/lib/types/profile-builder';
import {
  formatGoalDate,
  goalDateDisplays,
  type GoalDateDisplay,
} from '@/lib/utils/goal-date';

interface PublicProfileRow {
  id: number;
  username: string;
  display_name: string;
  bio: string | null;
  location: string | null;
  avatar_url: string | null;
  cover_url: string | null;
  theme: Record<string, unknown> | null;
  is_published: boolean;
  show_branding: boolean;
  is_discoverable: boolean;
  allow_indexing: boolean;
  seo_title: string | null;
  seo_description: string | null;
  share_image_url: string | null;
}

interface BlockRow {
  id: number;
  analytics_key: string;
  type: string;
  title: string | null;
  content: Record<string, unknown> | null;
  sort_order: number;
  is_enabled: boolean;
}

interface SocialLinkRow {
  id: number;
  analytics_key: string;
  platform: string;
  label: string | null;
  url: string;
  sort_order: number;
  is_enabled: boolean;
}

interface SportRow {
  id: number;
  name: string;
  slug: string;
  is_enabled: boolean;
  is_custom: boolean;
}

interface ProfileSportRow {
  sort_order: number;
  is_enabled: boolean;
  sports: SportRow | SportRow[] | null;
}

interface GalleryItemRow {
  id: number;
  analytics_key: string;
  image_url: string;
  caption: string | null;
  alt_text: string | null;
  sort_order: number;
  is_enabled: boolean;
}

interface AchievementRow {
  id: number;
  analytics_key: string;
  title: string;
  description: string | null;
  achieved_at: string | null;
  sort_order: number;
  is_enabled: boolean;
}

interface SponsorRow {
  id: number;
  analytics_key: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  sort_order: number;
  is_enabled: boolean;
}

interface ActivityRow {
  id: number;
  analytics_key: string;
  title: string;
  activity_type: string | null;
  occurred_at: string | null;
  sort_order: number;
  is_enabled: boolean;
}

interface GoalRow {
  id: number;
  analytics_key: string;
  title: string;
  description: string | null;
  url: string | null;
  target_at: string | null;
  date_display: string;
  status: string;
  sort_order: number;
  is_enabled: boolean;
}

function formatDateLabel(
  value: string | null,
  display: GoalDateDisplay = 'date',
) {
  if (!value) {
    return '';
  }

  return formatGoalDate(value, display);
}

function formatDateInput(value: string | null) {
  return value ? value.slice(0, 10) : '';
}

function mapProfile(row: PublicProfileRow): ProfileBuilderState['profile'] {
  const theme = row.theme ?? {};
  const hasThemeCoverUrl = Object.prototype.hasOwnProperty.call(
    theme,
    'coverImageUrl',
  );
  const themeCoverUrl =
    typeof theme.coverImageUrl === 'string' ? theme.coverImageUrl : null;

  return {
    id: row.id,
    username: row.username,
    displayName: row.display_name,
    bio: row.bio ?? '',
    sports: [],
    sportSlugs: [],
    location: row.location ?? '',
    avatarUrl: row.avatar_url ?? '',
    coverUrl: hasThemeCoverUrl ? themeCoverUrl || '' : row.cover_url || '',
    isPublished: row.is_published,
    showBranding: row.show_branding,
    isDiscoverable: row.is_discoverable ?? true,
    allowIndexing: row.allow_indexing ?? true,
    seoTitle: row.seo_title ?? '',
    seoDescription: row.seo_description ?? '',
    shareImageUrl: row.share_image_url ?? '',
    theme,
  };
}

function mapBlock(row: BlockRow): BuilderBlock {
  return {
    id: row.id,
    analyticsKey: row.analytics_key,
    type: row.type,
    title: row.title ?? row.type,
    content: row.content ?? {},
    sortOrder: row.sort_order,
    isEnabled: row.is_enabled,
  };
}

function mapSocialLink(row: SocialLinkRow): BuilderSocialLink {
  return {
    id: row.id,
    analyticsKey: row.analytics_key,
    platform: row.platform,
    label: row.label ?? '',
    url: row.url,
    sortOrder: row.sort_order,
    isEnabled: row.is_enabled,
  };
}

function mapGalleryItem(row: GalleryItemRow): BuilderGalleryItem {
  return {
    id: row.id,
    analyticsKey: row.analytics_key,
    imageUrl: row.image_url,
    caption: row.caption ?? '',
    altText: row.alt_text ?? '',
    sortOrder: row.sort_order,
    isEnabled: row.is_enabled,
  };
}

function mapSponsor(row: SponsorRow): BuilderSponsor {
  return {
    id: row.id,
    analyticsKey: row.analytics_key,
    name: row.name,
    logoUrl: row.logo_url ?? '',
    websiteUrl: row.website_url ?? '',
    sortOrder: row.sort_order,
    isEnabled: row.is_enabled,
  };
}

function mapAchievement(row: AchievementRow): BuilderTimelineItem {
  return {
    id: row.id,
    analyticsKey: row.analytics_key,
    title: row.title,
    description: row.description ?? '',
    dateLabel: formatDateLabel(row.achieved_at),
    date: formatDateInput(row.achieved_at),
    sortOrder: row.sort_order,
    isEnabled: row.is_enabled,
  };
}

function mapActivity(row: ActivityRow): BuilderTimelineItem {
  return {
    id: row.id,
    analyticsKey: row.analytics_key,
    title: row.title,
    description: row.activity_type ?? '',
    dateLabel: formatDateLabel(row.occurred_at, 'countdown'),
    date: formatDateInput(row.occurred_at),
    sortOrder: row.sort_order,
    isEnabled: row.is_enabled,
  };
}

function mapGoal(row: GoalRow): BuilderGoalItem {
  const dateDisplay = goalDateDisplays.includes(
    row.date_display as GoalDateDisplay,
  )
    ? (row.date_display as GoalDateDisplay)
    : 'date';

  return {
    id: row.id,
    analyticsKey: row.analytics_key,
    title: row.title,
    description: row.description ?? '',
    url: row.url ?? '',
    targetDate: formatDateInput(row.target_at),
    targetLabel: formatGoalDate(row.target_at, dateDisplay),
    dateDisplay,
    status: row.status,
    sortOrder: row.sort_order,
    isEnabled: row.is_enabled,
  };
}

function getProfileSport(row: ProfileSportRow) {
  return Array.isArray(row.sports) ? row.sports[0] : row.sports;
}

async function mapProfileBuilderState(
  supabase: SupabaseClient,
  profileRow: PublicProfileRow,
  includeAvailableSports = true,
): Promise<ProfileBuilderState> {
  const [
    blocksResult,
    socialsResult,
    availableSportsResult,
    sportsResult,
    galleryResult,
    sponsorsResult,
    achievementsResult,
    activitiesResult,
    goalsResult,
  ] = await Promise.all([
    supabase
      .from('profile_blocks')
      .select('*')
      .eq('profile_id', profileRow.id)
      .is('deleted_at', null)
      .order('sort_order', { ascending: true }),
    supabase
      .from('profile_social_links')
      .select('*')
      .eq('profile_id', profileRow.id)
      .is('deleted_at', null)
      .order('sort_order', { ascending: true }),
    includeAvailableSports
      ? supabase
          .from('sports')
          .select('*')
          .eq('is_enabled', true)
          .eq('is_custom', false)
          .order('sort_order', { ascending: true })
      : Promise.resolve({ data: [] }),
    supabase
      .from('profile_sports')
      .select('sort_order, is_enabled, sports(*)')
      .eq('profile_id', profileRow.id)
      .eq('is_enabled', true)
      .order('sort_order', { ascending: true }),
    supabase
      .from('profile_gallery_items')
      .select('*')
      .eq('profile_id', profileRow.id)
      .is('deleted_at', null)
      .order('sort_order', { ascending: true }),
    supabase
      .from('profile_sponsors')
      .select('*')
      .eq('profile_id', profileRow.id)
      .is('deleted_at', null)
      .order('sort_order', { ascending: true }),
    supabase
      .from('profile_achievements')
      .select('*')
      .eq('profile_id', profileRow.id)
      .is('deleted_at', null)
      .order('sort_order', { ascending: true }),
    supabase
      .from('profile_activities')
      .select('*')
      .eq('profile_id', profileRow.id)
      .is('deleted_at', null)
      .order('sort_order', { ascending: true }),
    supabase
      .from('profile_goals')
      .select('*')
      .eq('profile_id', profileRow.id)
      .is('deleted_at', null)
      .order('sort_order', { ascending: true }),
  ]);

  const availableSports = (
    (availableSportsResult.data ?? []) as SportRow[]
  ).map((sport) => ({
    name: sport.name,
    slug: sport.slug,
    isCustom: sport.is_custom,
  }));
  const selectedSports = ((sportsResult.data ?? []) as ProfileSportRow[])
    .map(getProfileSport)
    .filter((sport): sport is SportRow => Boolean(sport));
  const selectableSports = [...availableSports];
  for (const sport of selectedSports) {
    if (!selectableSports.some((item) => item.slug === sport.slug)) {
      selectableSports.push({
        name: sport.name,
        slug: sport.slug,
        isCustom: sport.is_custom,
      });
    }
  }

  return {
    source: 'database',
    profile: {
      ...mapProfile(profileRow),
      sports: selectedSports.map((sport) => sport.name),
      sportSlugs: selectedSports.map((sport) => sport.slug),
    },
    blocks: ((blocksResult.data ?? []) as BlockRow[]).map(mapBlock),
    socialLinks: ((socialsResult.data ?? []) as SocialLinkRow[]).map(
      mapSocialLink,
    ),
    galleryItems: ((galleryResult.data ?? []) as GalleryItemRow[]).map(
      mapGalleryItem,
    ),
    sponsors: ((sponsorsResult.data ?? []) as SponsorRow[]).map(mapSponsor),
    achievements: ((achievementsResult.data ?? []) as AchievementRow[]).map(
      mapAchievement,
    ),
    activities: ((activitiesResult.data ?? []) as ActivityRow[]).map(
      mapActivity,
    ),
    goals: ((goalsResult.data ?? []) as GoalRow[]).map(mapGoal),
    availableSports: selectableSports.length
      ? selectableSports
      : [...defaultSports],
  };
}

export type OwnedProfileSummary = {
  id: number;
  username: string;
  displayName: string;
  avatarUrl: string;
  isPublished: boolean;
  updatedAt: string;
};

export async function getOwnedProfiles(): Promise<OwnedProfileSummary[]> {
  const supabase = await createServerSupabaseClient();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  if (!user) return [];

  const { data } = await supabase
    .from('public_profiles')
    .select('id, username, display_name, avatar_url, is_published, updated_at')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });

  return (
    (data ?? []) as Array<{
      id: number;
      username: string;
      display_name: string;
      avatar_url: string | null;
      is_published: boolean;
      updated_at: string;
    }>
  ).map((profile) => ({
    id: profile.id,
    username: profile.username,
    displayName: profile.display_name,
    avatarUrl: profile.avatar_url ?? '',
    isPublished: profile.is_published,
    updatedAt: profile.updated_at,
  }));
}

export async function getProfileBuilderState(
  profileId: number,
): Promise<ProfileBuilderState | null> {
  const supabase = await createServerSupabaseClient();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  if (!user) {
    return null;
  }

  const { data: profileData } = await supabase
    .from('public_profiles')
    .select('*')
    .eq('id', profileId)
    .eq('user_id', user.id)
    .maybeSingle();

  const profileRow = profileData as PublicProfileRow | null;

  if (!profileRow) {
    return null;
  }

  return mapProfileBuilderState(supabase, profileRow);
}

async function loadPublicProfileBuilderState(username: string) {
  // Public profiles do not need the visitor's cookies. The anonymous client
  // keeps RLS active (so disabled content stays private) and is safe to cache.
  const supabase = createPublicSupabaseClient();
  const { data: profileData } = await supabase
    .from('public_profiles')
    .select('*')
    .eq('username', username)
    .eq('is_published', true)
    .maybeSingle();

  const profileRow = profileData as PublicProfileRow | null;

  if (!profileRow) {
    return null;
  }

  return mapProfileBuilderState(supabase, profileRow, false);
}

export function getPublicProfileBuilderState(username: string) {
  const normalizedUsername = username.toLowerCase();

  return unstable_cache(
    () => loadPublicProfileBuilderState(normalizedUsername),
    ['public-profile-builder', normalizedUsername],
    {
      revalidate: 300,
      tags: [getPublicProfileCacheTag(normalizedUsername)],
    },
  )();
}
