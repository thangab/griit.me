import { createServerSupabaseClient } from '@/lib/config/supabase-server';
import type {
  BuilderBlock,
  BuilderGalleryItem,
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
  sport: string | null;
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

function createInitialBuilderState(email?: string | null): ProfileBuilderState {
  const username = deriveUsername(email);

  return {
    source: 'initial',
    profile: {
      id: null,
      username,
      displayName: username,
      bio: 'I run and build my athlete story.',
      sport: 'Running',
      location: 'Bangkok',
      avatarUrl: defaultAvatarUrl,
      coverUrl: defaultCoverUrl,
      isPublished: false,
      theme: {},
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
        type: 'hero',
        title: 'Athlete intro',
        content: {},
        sortOrder: 0,
        isEnabled: true,
      },
      {
        id: null,
        type: 'gallery',
        title: 'Gallery',
        content: {},
        sortOrder: 1,
        isEnabled: true,
      },
      {
        id: null,
        type: 'achievements',
        title: 'Achievements',
        content: {},
        sortOrder: 2,
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
  };
}

function mapProfile(row: PublicProfileRow): ProfileBuilderState['profile'] {
  return {
    id: row.id,
    username: row.username,
    displayName: row.display_name,
    bio: row.bio ?? '',
    sport: row.sport ?? '',
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

  const [
    pagesResult,
    socialsResult,
    galleryResult,
    achievementsResult,
    activitiesResult,
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

  return {
    source: 'database',
    profile: mapProfile(profileRow),
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
  };
}
