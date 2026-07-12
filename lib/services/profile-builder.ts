import { createServerSupabaseClient } from '@/lib/config/supabase-server';
import { defaultProfileTemplateId } from '@/lib/constants/profile-templates';
import { defaultSports } from '@/lib/constants/sports';
import type {
  BuilderBlock,
  BuilderGalleryItem,
  BuilderGoalItem,
  BuilderPage,
  BuilderSocialLink,
  BuilderTimelineItem,
  ProfileBuilderState,
} from '@/lib/types/profile-builder';

const defaultAvatarUrl =
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=500&q=60';
const defaultCoverUrl =
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=60';
const defaultGalleryUrl =
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=500&q=60';

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
}

interface PageRow {
  id: number;
  slug: string;
  title: string;
  sort_order: number;
  is_home: boolean;
  is_published: boolean;
}

interface BlockRow {
  id: number;
  type: string;
  title: string | null;
  content: Record<string, unknown> | null;
  sort_order: number;
  is_enabled: boolean;
}

interface SocialLinkRow {
  id: number;
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
}

interface ProfileSportRow {
  sort_order: number;
  is_enabled: boolean;
  sports: SportRow | SportRow[] | null;
}

interface GalleryItemRow {
  id: number;
  image_url: string;
  caption: string | null;
  alt_text: string | null;
  sort_order: number;
  is_enabled: boolean;
}

interface AchievementRow {
  id: number;
  title: string;
  description: string | null;
  achieved_at: string | null;
  sort_order: number;
  is_enabled: boolean;
}

interface ActivityRow {
  id: number;
  title: string;
  activity_type: string | null;
  occurred_at: string | null;
  sort_order: number;
  is_enabled: boolean;
}

interface GoalRow {
  id: number;
  title: string;
  description: string | null;
  target_at: string | null;
  status: string;
  sort_order: number;
  is_enabled: boolean;
}

function deriveUsername(email?: string | null) {
  return (
    email
      ?.split('@')[0]
      ?.toLowerCase()
      .replace(/[^a-z0-9_]/g, '') || 'athlete'
  );
}

function formatDateLabel(value: string | null) {
  if (!value) {
    return 'Manual';
  }

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}

function formatDateInput(value: string | null) {
  return value ? value.slice(0, 10) : '';
}

function formatGoalTargetLabel(value: string | null) {
  return value ? formatDateLabel(value) : 'No target date';
}

function createInitialBuilderState(email?: string | null): ProfileBuilderState {
  const username = deriveUsername(email);

  return {
    source: 'initial',
    profile: {
      id: null,
      username,
      displayName: username,
      bio: 'I run and build my athlete story.',
      sports: ['Running'],
      sportSlugs: ['running'],
      location: 'Bangkok',
      avatarUrl: defaultAvatarUrl,
      coverUrl: defaultCoverUrl,
      isPublished: false,
      theme: {
        templateId: defaultProfileTemplateId,
      },
    },
    pages: [
      {
        id: null,
        slug: 'home',
        title: 'Home',
        sortOrder: 0,
        isHome: true,
        isPublished: true,
      },
    ],
    blocks: [
      {
        id: null,
        type: 'goals',
        title: 'Goals',
        content: {},
        sortOrder: 0,
        isEnabled: true,
      },
      {
        id: null,
        type: 'hero',
        title: 'Athlete intro',
        content: {},
        sortOrder: 1,
        isEnabled: true,
      },
      {
        id: null,
        type: 'gallery',
        title: 'Gallery',
        content: {},
        sortOrder: 2,
        isEnabled: true,
      },
      {
        id: null,
        type: 'achievements',
        title: 'Achievements',
        content: {},
        sortOrder: 3,
        isEnabled: true,
      },
    ],
    socialLinks: [
      {
        id: null,
        platform: 'instagram',
        label: '@' + username,
        url: `https://instagram.com/${username}`,
        sortOrder: 0,
        isEnabled: true,
      },
    ],
    galleryItems: Array.from({ length: 3 }, (_, index) => ({
      id: null,
      imageUrl: defaultGalleryUrl,
      caption: `Training moment ${index + 1}`,
      altText: 'Athlete training moment',
      sortOrder: index,
      isEnabled: true,
    })),
    achievements: [
      {
        id: null,
        title: 'First milestone',
        description: 'Add your race, event, or personal achievement.',
        dateLabel: 'Manual',
        sortOrder: 0,
        isEnabled: true,
      },
    ],
    activities: [
      {
        id: null,
        title: 'Recent activity',
        description: 'Add a manual workout or future integration activity.',
        dateLabel: 'Manual',
        sortOrder: 0,
        isEnabled: true,
      },
    ],
    goals: [
      {
        id: null,
        title: 'Run 10K under 40 minutes',
        description:
          'A clear performance goal to guide the next training block.',
        targetDate: '',
        targetLabel: 'No target date',
        status: 'planned',
        sortOrder: 0,
        isEnabled: true,
      },
    ],
    availableSports: [...defaultSports],
  };
}

function mapProfile(row: PublicProfileRow): ProfileBuilderState['profile'] {
  return {
    id: row.id,
    username: row.username,
    displayName: row.display_name,
    bio: row.bio ?? '',
    sports: [],
    sportSlugs: [],
    location: row.location ?? '',
    avatarUrl: row.avatar_url ?? defaultAvatarUrl,
    coverUrl: row.cover_url ?? defaultCoverUrl,
    isPublished: row.is_published,
    theme: row.theme ?? {},
  };
}

function mapPage(row: PageRow): BuilderPage {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    sortOrder: row.sort_order,
    isHome: row.is_home,
    isPublished: row.is_published,
  };
}

function mapBlock(row: BlockRow): BuilderBlock {
  return {
    id: row.id,
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
    platform: row.platform,
    label: row.label ?? row.platform,
    url: row.url,
    sortOrder: row.sort_order,
    isEnabled: row.is_enabled,
  };
}

function mapGalleryItem(row: GalleryItemRow): BuilderGalleryItem {
  return {
    id: row.id,
    imageUrl: row.image_url,
    caption: row.caption ?? '',
    altText: row.alt_text ?? '',
    sortOrder: row.sort_order,
    isEnabled: row.is_enabled,
  };
}

function mapAchievement(row: AchievementRow): BuilderTimelineItem {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? '',
    dateLabel: formatDateLabel(row.achieved_at),
    sortOrder: row.sort_order,
    isEnabled: row.is_enabled,
  };
}

function mapActivity(row: ActivityRow): BuilderTimelineItem {
  return {
    id: row.id,
    title: row.title,
    description: row.activity_type ?? '',
    dateLabel: formatDateLabel(row.occurred_at),
    sortOrder: row.sort_order,
    isEnabled: row.is_enabled,
  };
}

function mapGoal(row: GoalRow): BuilderGoalItem {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? '',
    targetDate: formatDateInput(row.target_at),
    targetLabel: formatGoalTargetLabel(row.target_at),
    status: row.status,
    sortOrder: row.sort_order,
    isEnabled: row.is_enabled,
  };
}

function getProfileSport(row: ProfileSportRow) {
  return Array.isArray(row.sports) ? row.sports[0] : row.sports;
}

async function mapProfileBuilderState(
  supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>,
  profileRow: PublicProfileRow,
): Promise<ProfileBuilderState> {
  const [
    pagesResult,
    socialsResult,
    availableSportsResult,
    sportsResult,
    galleryResult,
    achievementsResult,
    activitiesResult,
    goalsResult,
  ] = await Promise.all([
    supabase
      .from('profile_pages')
      .select('*')
      .eq('profile_id', profileRow.id)
      .order('sort_order', { ascending: true }),
    supabase
      .from('profile_social_links')
      .select('*')
      .eq('profile_id', profileRow.id)
      .order('sort_order', { ascending: true }),
    supabase
      .from('sports')
      .select('*')
      .eq('is_enabled', true)
      .order('sort_order', { ascending: true }),
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
      .order('sort_order', { ascending: true }),
    supabase
      .from('profile_achievements')
      .select('*')
      .eq('profile_id', profileRow.id)
      .order('sort_order', { ascending: true }),
    supabase
      .from('profile_activities')
      .select('*')
      .eq('profile_id', profileRow.id)
      .order('sort_order', { ascending: true }),
    supabase
      .from('profile_goals')
      .select('*')
      .eq('profile_id', profileRow.id)
      .order('sort_order', { ascending: true }),
  ]);

  const pages = (pagesResult.data ?? []) as PageRow[];
  const homePage = pages.find((page) => page.is_home) ?? pages[0];

  const { data: blockData } = homePage
    ? await supabase
        .from('profile_blocks')
        .select('*')
        .eq('page_id', homePage.id)
        .order('sort_order', { ascending: true })
    : { data: [] };

  const availableSports = (
    (availableSportsResult.data ?? []) as SportRow[]
  ).map((sport) => ({
    name: sport.name,
    slug: sport.slug,
  }));
  const selectedSports = ((sportsResult.data ?? []) as ProfileSportRow[])
    .map(getProfileSport)
    .filter((sport): sport is SportRow => Boolean(sport));

  return {
    source: 'database',
    profile: {
      ...mapProfile(profileRow),
      sports: selectedSports.map((sport) => sport.name),
      sportSlugs: selectedSports.map((sport) => sport.slug),
    },
    pages: pages.map(mapPage),
    blocks: ((blockData ?? []) as BlockRow[]).map(mapBlock),
    socialLinks: ((socialsResult.data ?? []) as SocialLinkRow[]).map(
      mapSocialLink,
    ),
    galleryItems: ((galleryResult.data ?? []) as GalleryItemRow[]).map(
      mapGalleryItem,
    ),
    achievements: ((achievementsResult.data ?? []) as AchievementRow[]).map(
      mapAchievement,
    ),
    activities: ((activitiesResult.data ?? []) as ActivityRow[]).map(
      mapActivity,
    ),
    goals: ((goalsResult.data ?? []) as GoalRow[]).map(mapGoal),
    availableSports: availableSports.length
      ? availableSports
      : [...defaultSports],
  };
}

export async function getProfileBuilderState(): Promise<ProfileBuilderState> {
  const supabase = await createServerSupabaseClient();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  if (!user) {
    return createInitialBuilderState();
  }

  const { data: profileData } = await supabase
    .from('public_profiles')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  const profileRow = profileData as PublicProfileRow | null;

  if (!profileRow) {
    return createInitialBuilderState(user.email);
  }

  return mapProfileBuilderState(supabase, profileRow);
}

export async function getPublicProfileBuilderState(username: string) {
  const supabase = await createServerSupabaseClient();
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

  return mapProfileBuilderState(supabase, profileRow);
}
