'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import {
  createServerSupabaseClient,
  createServiceSupabaseClient,
} from '@/lib/config/supabase-server';
import {
  defaultProfileTemplateId,
  getProfileTemplate,
  isProfileTemplateId,
} from '@/lib/constants/profile-templates';
import { getSubscriptionState } from '@/lib/services/billing';
import {
  colorPresets,
  coverTypes,
  fontPresets,
  galleryLayouts,
  overlayPresets,
  radiusPresets,
} from '@/lib/constants/profile-theme';

export interface ProfileBuilderActionState {
  success: boolean;
  message: string;
}

const urlSchema = z
  .string()
  .trim()
  .url()
  .or(z.literal(''))
  .transform((value) => value || null);

const dateSchema = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Target date must be a valid date.')
  .or(z.literal(''))
  .transform((value) => value || null);

const builderSchema = z.object({
  displayName: z.string().trim().min(1, 'Display name is required.').max(120),
  bio: z.string().trim().max(300).optional(),
  sportSlugs: z.array(z.string().trim().max(80)).max(8),
  avatarUrl: urlSchema,
  isPublished: z.boolean(),
  socialPlatform: z.string().trim().max(48).optional(),
  socialLabel: z.string().trim().max(80).optional(),
  socialUrl: urlSchema,
  galleryUrls: z.array(urlSchema).max(50),
  achievements: z
    .array(
      z.object({
        title: z.string().trim().max(160),
        description: z.string().trim().max(500).optional(),
        achievedAt: dateSchema,
      }),
    )
    .max(3),
  activities: z
    .array(
      z.object({
        title: z.string().trim().max(160),
        activityType: z.string().trim().max(80).optional(),
        occurredAt: dateSchema,
      }),
    )
    .max(1),
  goals: z
    .array(
      z.object({
        title: z.string().trim().max(160),
        description: z.string().trim().max(500).optional(),
        targetAt: dateSchema,
        status: z
          .string()
          .trim()
          .max(32)
          .regex(/^[a-z_]*$/, 'Goal status is invalid.'),
      }),
    )
    .max(3),
});

const usernameSchema = z.object({
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, 'Username must be at least 3 characters.')
    .max(32, 'Username must be 32 characters or less.')
    .regex(
      /^[a-z0-9_]+$/,
      'Username can only contain lowercase letters, numbers, and underscores.',
    ),
});

const templateSchema = z.object({
  templateId: z.string().refine(isProfileTemplateId, 'Invalid template.'),
  coverUrl: urlSchema,
  colorPreset: z.string().refine(
    (value) => value === 'custom' || colorPresets.some((item) => item.id === value),
    'Invalid color preset.',
  ),
  fontPreset: z.enum(fontPresets.map((item) => item.id) as [string, ...string[]]),
  coverOverlay: z.enum(overlayPresets),
  radiusPreset: z.enum(radiusPresets),
  galleryLayout: z.enum(galleryLayouts),
  customBackground: z.string().regex(/^#[0-9a-f]{6}$/i, 'Invalid custom background color.'),
  customSurface: z.string().regex(/^#[0-9a-f]{6}$/i, 'Invalid custom block background color.'),
  customForeground: z.string().regex(/^#[0-9a-f]{6}$/i, 'Invalid custom text color.'),
  customAccent: z.string().regex(/^#[0-9a-f]{6}$/i, 'Invalid custom accent color.'),
  customSocial: z.string().regex(/^#[0-9a-f]{6}$/i, 'Invalid social link color.'),
  customHeaderText: z.string().regex(/^#[0-9a-f]{6}$/i, 'Invalid header text color.'),
  customBlockTitle: z.string().regex(/^#[0-9a-f]{6}$/i, 'Invalid block title color.'),
  customDescription: z.string().regex(/^#[0-9a-f]{6}$/i, 'Invalid description color.'),
  customAccentText: z.string().regex(/^#[0-9a-f]{6}$/i, 'Invalid accent text color.'),
  customSocialText: z.string().regex(/^#[0-9a-f]{6}$/i, 'Invalid social link text color.'),
  coverType: z.enum(coverTypes),
  coverColor: z.string().regex(/^#[0-9a-f]{6}$/i, 'Invalid cover color.'),
  coverGradientFrom: z.string().regex(/^#[0-9a-f]{6}$/i, 'Invalid gradient start color.'),
  coverGradientTo: z.string().regex(/^#[0-9a-f]{6}$/i, 'Invalid gradient end color.'),
});

function getString(formData: FormData, key: string) {
  return String(formData.get(key) ?? '').trim();
}

function getGalleryUrls(formData: FormData) {
  return Array.from(formData.entries())
    .filter(([key]) => /^galleryUrl\d+$/.test(key))
    .sort(([left], [right]) => {
      const leftIndex = Number(left.replace('galleryUrl', ''));
      const rightIndex = Number(right.replace('galleryUrl', ''));
      return leftIndex - rightIndex;
    })
    .map(([, value]) => String(value).trim());
}

function getGoals(formData: FormData) {
  return [1, 2, 3].map((index) => ({
    title: getString(formData, `goalTitle${index}`),
    description: getString(formData, `goalDescription${index}`),
    targetAt: getString(formData, `goalTargetAt${index}`),
    status: getString(formData, `goalStatus${index}`) || 'planned',
  }));
}

function getAchievements(formData: FormData) {
  return [1, 2, 3].map((number) => ({
    title: getString(formData, `achievementTitle${number}`),
    description: getString(formData, `achievementDescription${number}`),
    achievedAt: getString(formData, `achievementDate${number}`),
  }));
}

function getActivities(formData: FormData) {
  return [
    {
      title: getString(formData, 'activityTitle1'),
      activityType: getString(formData, 'activityType1'),
      occurredAt: getString(formData, 'activityDate1'),
    },
  ];
}

function getSportSlugs(formData: FormData) {
  return formData
    .getAll('sportSlugs')
    .map((value) => String(value).trim())
    .filter(Boolean);
}

function deriveUsername(email?: string | null) {
  return (
    email
      ?.split('@')[0]
      ?.toLowerCase()
      .replace(/[^a-z0-9_]/g, '') || 'athlete'
  );
}

async function ensurePrivateProfile(user: {
  id: string;
  email?: string | null;
  user_metadata?: Record<string, unknown>;
}) {
  const serviceSupabase = createServiceSupabaseClient();
  const fullName =
    typeof user.user_metadata?.full_name === 'string'
      ? user.user_metadata.full_name
      : typeof user.user_metadata?.name === 'string'
        ? user.user_metadata.name
        : null;
  const avatarUrl =
    typeof user.user_metadata?.avatar_url === 'string'
      ? user.user_metadata.avatar_url
      : null;

  await serviceSupabase.from('profiles').upsert(
    {
      id: user.id,
      email: user.email ?? `${user.id}@users.griit.local`,
      full_name: fullName,
      avatar_url: avatarUrl,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'id' },
  );
}

async function replaceSocialLinks(
  profileId: number,
  input: z.infer<typeof builderSchema>,
) {
  const serviceSupabase = createServiceSupabaseClient();
  await serviceSupabase
    .from('profile_social_links')
    .delete()
    .eq('profile_id', profileId);

  if (!input.socialUrl) {
    return;
  }

  await serviceSupabase.from('profile_social_links').insert({
    profile_id: profileId,
    platform: input.socialPlatform || 'website',
    label: input.socialLabel || input.socialPlatform || 'Website',
    url: input.socialUrl,
    sort_order: 0,
    is_enabled: true,
  });
}

async function replaceGalleryItems(
  profileId: number,
  input: z.infer<typeof builderSchema>,
) {
  const serviceSupabase = createServiceSupabaseClient();
  await serviceSupabase
    .from('profile_gallery_items')
    .delete()
    .eq('profile_id', profileId);

  const galleryRows = input.galleryUrls
    .filter((url): url is string => Boolean(url))
    .map((url, index) => ({
      profile_id: profileId,
      image_url: url,
      caption: `Gallery image ${index + 1}`,
      alt_text: 'Athlete gallery image',
      sort_order: index,
      is_enabled: true,
    }));

  if (galleryRows.length) {
    await serviceSupabase.from('profile_gallery_items').insert(galleryRows);
  }
}

async function replaceGoals(
  profileId: number,
  input: z.infer<typeof builderSchema>,
) {
  const serviceSupabase = createServiceSupabaseClient();
  await serviceSupabase
    .from('profile_goals')
    .delete()
    .eq('profile_id', profileId);

  const goalRows = input.goals
    .filter((goal) => goal.title)
    .map((goal, index) => ({
      profile_id: profileId,
      title: goal.title,
      description: goal.description || null,
      target_at: goal.targetAt,
      status: goal.status || 'planned',
      sort_order: index,
      is_enabled: true,
    }));

  if (goalRows.length) {
    await serviceSupabase.from('profile_goals').insert(goalRows);
  }
}

async function replaceAchievements(
  profileId: number,
  input: z.infer<typeof builderSchema>,
) {
  const serviceSupabase = createServiceSupabaseClient();
  await serviceSupabase
    .from('profile_achievements')
    .delete()
    .eq('profile_id', profileId);

  const rows = input.achievements
    .filter((item) => item.title)
    .map((item, index) => ({
      profile_id: profileId,
      title: item.title,
      description: item.description || null,
      achieved_at: item.achievedAt,
      sort_order: index,
      is_enabled: true,
    }));

  if (rows.length) {
    await serviceSupabase.from('profile_achievements').insert(rows);
  }
}

async function replaceActivities(
  profileId: number,
  input: z.infer<typeof builderSchema>,
) {
  const serviceSupabase = createServiceSupabaseClient();
  await serviceSupabase
    .from('profile_activities')
    .delete()
    .eq('profile_id', profileId);

  const rows = input.activities
    .filter((item) => item.title)
    .map((item, index) => ({
      profile_id: profileId,
      title: item.title,
      activity_type: item.activityType || null,
      occurred_at: item.occurredAt,
      metrics: {},
      sort_order: index,
      is_enabled: true,
    }));

  if (rows.length) {
    await serviceSupabase.from('profile_activities').insert(rows);
  }
}

async function replaceSports(
  profileId: number,
  input: z.infer<typeof builderSchema>,
) {
  const serviceSupabase = createServiceSupabaseClient();
  await serviceSupabase
    .from('profile_sports')
    .delete()
    .eq('profile_id', profileId);

  if (!input.sportSlugs.length) {
    return;
  }

  const { data: sportsData, error } = await serviceSupabase
    .from('sports')
    .select('id, slug')
    .in('slug', input.sportSlugs);

  if (error) {
    throw new Error(error.message);
  }

  const sportIdBySlug = new Map(
    ((sportsData ?? []) as { id: number; slug: string }[]).map((sport) => [
      sport.slug,
      sport.id,
    ]),
  );

  const sportRows = input.sportSlugs
    .map((slug, index) => {
      const sportId = sportIdBySlug.get(slug);

      if (!sportId) {
        return null;
      }

      return {
        profile_id: profileId,
        sport_id: sportId,
        sort_order: index,
        is_enabled: true,
      };
    })
    .filter((sport): sport is NonNullable<typeof sport> => Boolean(sport));

  if (sportRows.length) {
    await serviceSupabase.from('profile_sports').insert(sportRows);
  }
}

async function ensureHomePageAndBlocks(profileId: number) {
  const serviceSupabase = createServiceSupabaseClient();
  const { data: pageData, error: pageError } = await serviceSupabase
    .from('profile_pages')
    .upsert(
      {
        profile_id: profileId,
        slug: 'home',
        title: 'Home',
        sort_order: 0,
        is_home: true,
        is_published: true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'profile_id,slug' },
    )
    .select('id')
    .single();

  if (pageError || !pageData) {
    throw new Error(pageError?.message ?? 'Unable to save profile page.');
  }

  const homePageId = pageData.id as number;
  const { count } = await serviceSupabase
    .from('profile_blocks')
    .select('id', { count: 'exact', head: true })
    .eq('page_id', homePageId);

  if (count) {
    return;
  }

  await serviceSupabase.from('profile_blocks').insert([
    {
      page_id: homePageId,
      type: 'goals',
      title: 'Goals',
      content: {},
      sort_order: 0,
      is_enabled: true,
    },
    {
      page_id: homePageId,
      type: 'hero',
      title: 'Athlete intro',
      content: {},
      sort_order: 1,
      is_enabled: true,
    },
    {
      page_id: homePageId,
      type: 'gallery',
      title: 'Gallery',
      content: {},
      sort_order: 2,
      is_enabled: true,
    },
    {
      page_id: homePageId,
      type: 'achievements',
      title: 'Achievements',
      content: {},
      sort_order: 3,
      is_enabled: true,
    },
  ]);
}

export async function saveProfileBuilderAction(
  _prevState: ProfileBuilderActionState,
  formData: FormData,
): Promise<ProfileBuilderActionState> {
  const supabase = await createServerSupabaseClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    return {
      success: false,
      message: 'You need to be signed in to save your profile.',
    };
  }

  const parsed = builderSchema.safeParse({
    displayName: getString(formData, 'displayName'),
    bio: getString(formData, 'bio'),
    sportSlugs: getSportSlugs(formData),
    avatarUrl: getString(formData, 'avatarUrl'),
    isPublished: formData.get('isPublished') === 'on',
    socialPlatform: getString(formData, 'socialPlatform').toLowerCase(),
    socialLabel: getString(formData, 'socialLabel'),
    socialUrl: getString(formData, 'socialUrl'),
    galleryUrls: getGalleryUrls(formData),
    achievements: getAchievements(formData),
    activities: getActivities(formData),
    goals: getGoals(formData),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? 'Invalid profile data.',
    };
  }

  const input = parsed.data;
  const goalCount = input.goals.filter((goal) => goal.title).length;
  const galleryCount = input.galleryUrls.filter(Boolean).length;

  if (goalCount > 1 || galleryCount > 3) {
    const subscription = await getSubscriptionState();

    if (!subscription.isActive) {
      return {
        success: false,
        message:
          goalCount > 1
            ? 'Multiple goals require the Pro plan.'
            : 'More than 3 gallery images require the Pro plan.',
      };
    }
  }

  const serviceSupabase = createServiceSupabaseClient();

  await ensurePrivateProfile(userData.user);
  const { data: existingProfile } = await serviceSupabase
    .from('public_profiles')
    .select('username')
    .eq('user_id', userData.user.id)
    .maybeSingle();

  const username =
    existingProfile?.username ?? deriveUsername(userData.user.email);

  const now = new Date().toISOString();
  const { data: profileData, error: profileError } = await serviceSupabase
    .from('public_profiles')
    .upsert(
      {
        user_id: userData.user.id,
        username,
        display_name: input.displayName,
        bio: input.bio || null,
        avatar_url: input.avatarUrl,
        is_published: input.isPublished,
        updated_at: now,
      },
      { onConflict: 'user_id' },
    )
    .select('id')
    .single();

  if (profileError || !profileData) {
    return {
      success: false,
      message: profileError?.message ?? 'Unable to save profile.',
    };
  }

  const profileId = profileData.id as number;

  try {
    await Promise.all([
      ensureHomePageAndBlocks(profileId),
      replaceSocialLinks(profileId, input),
      replaceGalleryItems(profileId, input),
      replaceAchievements(profileId, input),
      replaceActivities(profileId, input),
      replaceGoals(profileId, input),
      replaceSports(profileId, input),
    ]);
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Unable to save profile content.',
    };
  }

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/design');
  revalidatePath(`/${username}`);

  return {
    success: true,
    message: 'Profile saved.',
  };
}

export async function updateProfileUrlAction(
  _prevState: ProfileBuilderActionState,
  formData: FormData,
): Promise<ProfileBuilderActionState> {
  const supabase = await createServerSupabaseClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    return {
      success: false,
      message: 'You need to be signed in to update your profile URL.',
    };
  }

  const parsed = usernameSchema.safeParse({
    username: getString(formData, 'username'),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? 'Invalid username.',
    };
  }

  const { username } = parsed.data;
  const serviceSupabase = createServiceSupabaseClient();

  await ensurePrivateProfile(userData.user);

  const { data: existingUsernameOwner } = await serviceSupabase
    .from('public_profiles')
    .select('user_id')
    .eq('username', username)
    .maybeSingle();

  if (
    existingUsernameOwner &&
    existingUsernameOwner.user_id !== userData.user.id
  ) {
    return {
      success: false,
      message: 'This username is already taken.',
    };
  }

  const { data: existingProfile } = await serviceSupabase
    .from('public_profiles')
    .select('username, display_name')
    .eq('user_id', userData.user.id)
    .maybeSingle();

  const previousUsername = existingProfile?.username;
  const fallbackDisplayName =
    existingProfile?.display_name ||
    userData.user.user_metadata?.full_name ||
    userData.user.user_metadata?.name ||
    username;

  const { error } = await serviceSupabase.from('public_profiles').upsert(
    {
      user_id: userData.user.id,
      username,
      display_name: String(fallbackDisplayName),
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' },
  );

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/design');
  revalidatePath('/dashboard/settings');
  revalidatePath(`/${username}`);

  if (previousUsername && previousUsername !== username) {
    revalidatePath(`/${previousUsername}`);
  }

  return {
    success: true,
    message: 'Public URL updated.',
  };
}

export async function updateProfileTemplateAction(
  _prevState: ProfileBuilderActionState,
  formData: FormData,
): Promise<ProfileBuilderActionState> {
  const supabase = await createServerSupabaseClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    return {
      success: false,
      message: 'You need to be signed in to update your template.',
    };
  }

  const parsed = templateSchema.safeParse({
    templateId: getString(formData, 'templateId'),
    coverUrl: getString(formData, 'coverUrl'),
    colorPreset: getString(formData, 'colorPreset'),
    fontPreset: getString(formData, 'fontPreset'),
    coverOverlay: getString(formData, 'coverOverlay'),
    radiusPreset: getString(formData, 'radiusPreset'),
    galleryLayout: getString(formData, 'galleryLayout'),
    customBackground: getString(formData, 'customBackground'),
    customSurface: getString(formData, 'customSurface'),
    customForeground: getString(formData, 'customForeground'),
    customAccent: getString(formData, 'customAccent'),
    customSocial: getString(formData, 'customSocial'),
    customHeaderText: getString(formData, 'customHeaderText'),
    customBlockTitle: getString(formData, 'customBlockTitle'),
    customDescription: getString(formData, 'customDescription'),
    customAccentText: getString(formData, 'customAccentText'),
    customSocialText: getString(formData, 'customSocialText'),
    coverType: getString(formData, 'coverType'),
    coverColor: getString(formData, 'coverColor'),
    coverGradientFrom: getString(formData, 'coverGradientFrom'),
    coverGradientTo: getString(formData, 'coverGradientTo'),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? 'Invalid template.',
    };
  }

  const template = getProfileTemplate(parsed.data.templateId);
  const subscription = await getSubscriptionState();

  if (template?.proOnly && !subscription.isActive) {
    return {
      success: false,
      message: 'This template requires the Pro plan.',
    };
  }

  const selectedColor = colorPresets.find((item) => item.id === parsed.data.colorPreset);
  const selectedFont = fontPresets.find((item) => item.id === parsed.data.fontPreset);
  const premiumSetting = [
    selectedColor?.proOnly ? `the ${selectedColor.name} color theme` : null,
    selectedFont?.proOnly ? `the ${selectedFont.name} typography` : null,
    parsed.data.galleryLayout !== 'grid'
      ? `the ${parsed.data.galleryLayout} gallery layout`
      : null,
  ].find(Boolean);

  if (!subscription.isActive && premiumSetting) {
    return {
      success: false,
      message: `${premiumSetting[0].toUpperCase()}${premiumSetting.slice(1)} requires the Pro plan.`,
    };
  }

  const serviceSupabase = createServiceSupabaseClient();
  const { data: existingProfile, error: existingError } = await serviceSupabase
    .from('public_profiles')
    .select('username, theme')
    .eq('user_id', userData.user.id)
    .maybeSingle();

  if (existingError || !existingProfile) {
    return {
      success: false,
      message:
        existingError?.message ??
        'Save your profile before selecting a template.',
    };
  }

  const existingTheme =
    existingProfile.theme && typeof existingProfile.theme === 'object'
      ? (existingProfile.theme as Record<string, unknown>)
      : {};
  const templateId = parsed.data.templateId || defaultProfileTemplateId;

  const { error } = await serviceSupabase
    .from('public_profiles')
    .update({
      theme: {
        ...existingTheme,
        templateId,
        coverImageUrl: parsed.data.coverUrl,
        colorPreset: parsed.data.colorPreset,
        customColors: {
          background: parsed.data.customBackground,
          surface: parsed.data.customSurface,
          foreground: parsed.data.customForeground,
          accent: parsed.data.customAccent,
          social: parsed.data.customSocial,
          headerText: parsed.data.customHeaderText,
          blockTitle: parsed.data.customBlockTitle,
          description: parsed.data.customDescription,
          accentText: parsed.data.customAccentText,
          socialText: parsed.data.customSocialText,
        },
        fontPreset: parsed.data.fontPreset,
        coverOverlay: parsed.data.coverOverlay,
        radiusPreset: parsed.data.radiusPreset,
        galleryLayout: parsed.data.galleryLayout,
        coverType: parsed.data.coverType,
        coverColor: parsed.data.coverColor,
        coverGradientFrom: parsed.data.coverGradientFrom,
        coverGradientTo: parsed.data.coverGradientTo,
      },
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userData.user.id);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/design');
  revalidatePath(`/${existingProfile.username}`);

  return {
    success: true,
    message: 'Template updated.',
  };
}

export async function setProfilePublishedAction(
  isPublished: boolean,
): Promise<ProfileBuilderActionState> {
  const supabase = await createServerSupabaseClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    return {
      success: false,
      message: 'You need to be signed in to publish your profile.',
    };
  }

  const serviceSupabase = createServiceSupabaseClient();
  const { data: profile, error } = await serviceSupabase
    .from('public_profiles')
    .update({
      is_published: isPublished,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userData.user.id)
    .select('username')
    .maybeSingle();

  if (error || !profile) {
    return {
      success: false,
      message:
        error?.message ?? 'Save your profile before changing its visibility.',
    };
  }

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/design');
  revalidatePath(`/${profile.username}`);

  return {
    success: true,
    message: isPublished ? 'Profile published.' : 'Profile unpublished.',
  };
}
