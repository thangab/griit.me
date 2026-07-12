'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import {
  createServerSupabaseClient,
  createServiceSupabaseClient,
} from '@/lib/config/supabase-server';

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

const builderSchema = z.object({
  displayName: z.string().trim().min(1, 'Display name is required.').max(120),
  bio: z.string().trim().max(300).optional(),
  sport: z.string().trim().max(80).optional(),
  location: z.string().trim().max(120).optional(),
  avatarUrl: urlSchema,
  coverUrl: urlSchema,
  isPublished: z.boolean(),
  socialPlatform: z.string().trim().max(48).optional(),
  socialLabel: z.string().trim().max(80).optional(),
  socialUrl: urlSchema,
  galleryUrls: z.array(urlSchema).max(3),
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

function getString(formData: FormData, key: string) {
  return String(formData.get(key) ?? '').trim();
}

function getGalleryUrls(formData: FormData) {
  return ['galleryUrl1', 'galleryUrl2', 'galleryUrl3'].map((key) =>
    getString(formData, key),
  );
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
      type: 'hero',
      title: 'Athlete intro',
      content: {},
      sort_order: 0,
      is_enabled: true,
    },
    {
      page_id: homePageId,
      type: 'gallery',
      title: 'Gallery',
      content: {},
      sort_order: 1,
      is_enabled: true,
    },
    {
      page_id: homePageId,
      type: 'achievements',
      title: 'Achievements',
      content: {},
      sort_order: 2,
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
    sport: getString(formData, 'sport'),
    location: getString(formData, 'location'),
    avatarUrl: getString(formData, 'avatarUrl'),
    coverUrl: getString(formData, 'coverUrl'),
    isPublished: formData.get('isPublished') === 'on',
    socialPlatform: getString(formData, 'socialPlatform').toLowerCase(),
    socialLabel: getString(formData, 'socialLabel'),
    socialUrl: getString(formData, 'socialUrl'),
    galleryUrls: getGalleryUrls(formData),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? 'Invalid profile data.',
    };
  }

  const input = parsed.data;
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
        sport: input.sport || null,
        location: input.location || null,
        avatar_url: input.avatarUrl,
        cover_url: input.coverUrl,
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
