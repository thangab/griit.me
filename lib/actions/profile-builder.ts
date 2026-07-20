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
  decorativeIconIds,
  fontPresets,
  galleryLayouts,
  headerLayouts,
  overlayPresets,
  radiusPresets,
} from '@/lib/constants/profile-theme';
import {
  isSocialPlatformId,
  socialPlatforms,
} from '@/lib/constants/social-platforms';
import { parseMediaUrl } from '@/lib/utils/media-embed';

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

const socialLinkSchema = z
  .object({
    platform: z.string().refine(isSocialPlatformId, 'Invalid social platform.'),
    label: z.string().trim().max(80).optional(),
    url: z.string().trim().max(500),
  })
  .superRefine((link, context) => {
    if (!link.url) return;

    if (
      link.platform === 'email' &&
      !z.string().email().safeParse(link.url).success
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['url'],
        message: 'Email address is invalid.',
      });
    } else if (
      link.platform === 'phone' &&
      !/^\+?[\d\s().-]{6,30}$/.test(link.url)
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['url'],
        message: 'Phone number is invalid.',
      });
    } else if (
      link.platform !== 'email' &&
      link.platform !== 'phone' &&
      !z.string().url().safeParse(link.url).success
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['url'],
        message: 'Social profile URL is invalid.',
      });
    }
  });

const builderSchema = z.object({
  displayName: z.string().trim().min(1, 'Display name is required.').max(120),
  bio: z.string().trim().max(300).optional(),
  sportSlugs: z.array(z.string().trim().max(80)).max(8),
  avatarUrl: urlSchema,
  isPublished: z.boolean(),
  socialLinks: z.array(socialLinkSchema).max(socialPlatforms.length),
  contentBlockOrder: z
    .array(
      z
        .string()
        .regex(
          /^(gallery|achievements|activities|sponsors|media-\d+|offer-\d+)$/,
          'Invalid content block.',
        ),
    )
    .max(54),
  mediaBlocks: z
    .array(
      z.object({
        slot: z.number().int().positive(),
        sourceUrl: z
          .string()
          .trim()
          .url('Media URL is invalid.')
          .max(500)
          .refine(
            (value) => Boolean(parseMediaUrl(value)),
            'Use a valid YouTube, Vimeo, or TikTok video URL.',
          ),
        caption: z.string().trim().max(500).optional(),
      }),
    )
    .max(50),
  offerBlocks: z
    .array(
      z.object({
        slot: z.number().int().positive(),
        url: z.string().trim().url('Offer URL is invalid.').max(1000),
        title: z.string().trim().max(160),
        description: z.string().trim().max(500),
        imageUrl: urlSchema,
        siteName: z.string().trim().max(100),
        promoCode: z.string().trim().max(40),
        promoText: z.string().trim().max(160),
        ctaLabel: z.string().trim().max(60),
        displaySize: z.enum(['small', 'medium', 'large']),
        isAffiliate: z.boolean(),
      }),
    )
    .max(50),
  galleryUrls: z.array(urlSchema).max(50),
  sponsors: z
    .array(
      z.object({
        name: z.string().trim().max(120),
        logoUrl: urlSchema,
        websiteUrl: urlSchema,
      }),
    )
    .max(20),
  partnershipMode: z.enum(['sponsors', 'seeking', 'both']),
  partnershipHeadline: z.string().trim().max(120).optional(),
  partnershipDescription: z.string().trim().max(500).optional(),
  partnershipContact: z.string().trim().max(500).optional(),
  partnershipCtaLabel: z.string().trim().max(80).optional(),
  achievements: z
    .array(
      z.object({
        title: z.string().trim().max(160),
        description: z.string().trim().max(500).optional(),
        achievedAt: dateSchema,
      }),
    )
    .max(50),
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
  colorPreset: z
    .string()
    .refine(
      (value) =>
        value === 'custom' || colorPresets.some((item) => item.id === value),
      'Invalid color preset.',
    ),
  fontPreset: z.enum(
    fontPresets.map((item) => item.id) as [string, ...string[]],
  ),
  coverOverlay: z.enum(overlayPresets),
  radiusPreset: z.enum(radiusPresets),
  galleryLayout: z.enum(galleryLayouts),
  customBackground: z
    .string()
    .regex(/^#[0-9a-f]{6}$/i, 'Invalid custom background color.'),
  customSurface: z
    .string()
    .regex(/^#[0-9a-f]{6}$/i, 'Invalid custom block background color.'),
  customForeground: z
    .string()
    .regex(/^#[0-9a-f]{6}$/i, 'Invalid custom text color.'),
  customAccent: z
    .string()
    .regex(/^#[0-9a-f]{6}$/i, 'Invalid custom accent color.'),
  customSocial: z
    .string()
    .regex(/^#[0-9a-f]{6}$/i, 'Invalid social link color.'),
  customHeaderText: z
    .string()
    .regex(/^#[0-9a-f]{6}$/i, 'Invalid header text color.'),
  customHeaderMutedText: z
    .string()
    .regex(/^#[0-9a-f]{6}$/i, 'Invalid secondary header text color.'),
  customBlockTitle: z
    .string()
    .regex(/^#[0-9a-f]{6}$/i, 'Invalid block title color.'),
  customDescription: z
    .string()
    .regex(/^#[0-9a-f]{6}$/i, 'Invalid description color.'),
  customAccentText: z
    .string()
    .regex(/^#[0-9a-f]{6}$/i, 'Invalid accent text color.'),
  customSocialText: z
    .string()
    .regex(/^#[0-9a-f]{6}$/i, 'Invalid social link text color.'),
  coverType: z.enum(coverTypes),
  coverColor: z.string().regex(/^#[0-9a-f]{6}$/i, 'Invalid cover color.'),
  coverGradientFrom: z
    .string()
    .regex(/^#[0-9a-f]{6}$/i, 'Invalid gradient start color.'),
  coverGradientTo: z
    .string()
    .regex(/^#[0-9a-f]{6}$/i, 'Invalid gradient end color.'),
  headerLayout: z.enum(headerLayouts),
  headerAvatarSize: z.coerce.number().int().min(56).max(144),
  headerSheetColor: z
    .string()
    .regex(/^#[0-9a-f]{6}$/i, 'Invalid header sheet color.'),
  headerSheetFade: z.boolean(),
  decorativeIcon: z.enum(decorativeIconIds),
  templateWordingOverrideKeys: z.string().max(500),
  templateWordingDiscipline: z.string().trim().max(60),
  templateWordingBadge: z.string().trim().max(12),
  templateWordingEyebrow: z.string().trim().max(120),
  templateWordingProfileLabel: z.string().trim().max(80),
  templateWordingTargetLabel: z.string().trim().max(80),
  templateWordingGalleryLabel: z.string().trim().max(80),
  templateWordingAchievementsLabel: z.string().trim().max(80),
  templateWordingActivityLabel: z.string().trim().max(80),
  templateWordingSecondaryGoalLabel: z.string().trim().max(80),
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

function getSponsors(formData: FormData) {
  return Array.from(formData.entries())
    .filter(([key]) => /^sponsorName\d+$/.test(key))
    .map(([key, value]) => {
      const index = Number(key.replace('sponsorName', ''));

      return {
        index,
        name: String(value).trim(),
        logoUrl: getString(formData, `sponsorLogoUrl${index}`),
        websiteUrl: getString(formData, `sponsorWebsiteUrl${index}`),
      };
    })
    .sort((left, right) => left.index - right.index)
    .map(({ name, logoUrl, websiteUrl }) => ({
      name,
      logoUrl,
      websiteUrl,
    }));
}

function getSocialLinks(formData: FormData) {
  return Array.from(formData.entries())
    .filter(([key]) => /^socialPlatform\d+$/.test(key))
    .map(([key, value]) => {
      const index = Number(key.replace('socialPlatform', ''));

      return {
        index,
        platform: String(value).trim().toLowerCase(),
        label: getString(formData, `socialLabel${index}`),
        url: getString(formData, `socialUrl${index}`),
      };
    })
    .sort((left, right) => left.index - right.index)
    .map(({ platform, label, url }) => ({ platform, label, url }));
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
  return Array.from(formData.entries())
    .filter(([key]) => /^achievementTitle\d+$/.test(key))
    .map(([key, value]) => {
      const index = Number(key.replace('achievementTitle', ''));

      return {
        index,
        title: String(value).trim(),
        description: getString(formData, `achievementDescription${index}`),
        achievedAt: getString(formData, `achievementDate${index}`),
      };
    })
    .sort((left, right) => left.index - right.index)
    .map(({ title, description, achievedAt }) => ({
      title,
      description,
      achievedAt,
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

function getContentBlockOrder(formData: FormData) {
  return formData
    .getAll('contentBlockOrder')
    .map((value) => String(value).trim());
}

function getMediaBlocks(formData: FormData) {
  return Array.from(formData.entries())
    .filter(([key]) => /^mediaUrl\d+$/.test(key))
    .sort(([left], [right]) => {
      const leftSlot = Number(left.replace('mediaUrl', ''));
      const rightSlot = Number(right.replace('mediaUrl', ''));
      return leftSlot - rightSlot;
    })
    .map(([key, value]) => {
      const slot = Number(key.replace('mediaUrl', ''));

      return {
        slot,
        sourceUrl: String(value).trim(),
        caption: getString(formData, `mediaCaption${slot}`),
      };
    });
}

function getOfferBlocks(formData: FormData) {
  return Array.from(formData.entries())
    .filter(([key]) => /^offerUrl\d+$/.test(key))
    .sort(([left], [right]) => {
      const leftSlot = Number(left.replace('offerUrl', ''));
      const rightSlot = Number(right.replace('offerUrl', ''));
      return leftSlot - rightSlot;
    })
    .map(([key, value]) => {
      const slot = Number(key.replace('offerUrl', ''));

      return {
        slot,
        url: String(value).trim(),
        title: getString(formData, `offerTitle${slot}`),
        description: getString(formData, `offerDescription${slot}`),
        imageUrl: getString(formData, `offerImageUrl${slot}`),
        siteName: getString(formData, `offerSiteName${slot}`),
        promoCode: getString(formData, `offerPromoCode${slot}`),
        promoText: getString(formData, `offerPromoText${slot}`),
        ctaLabel: getString(formData, `offerCtaLabel${slot}`),
        displaySize: getString(formData, `offerDisplaySize${slot}`) || 'medium',
        isAffiliate: formData.get(`offerIsAffiliate${slot}`) === 'on',
      };
    });
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

  const socialRows = input.socialLinks
    .filter((link): link is typeof link & { url: string } => Boolean(link.url))
    .map((link, index) => ({
      profile_id: profileId,
      platform: link.platform,
      label: link.label || null,
      url: link.url,
      sort_order: index,
      is_enabled: true,
    }));

  if (!socialRows.length) {
    return;
  }

  await serviceSupabase.from('profile_social_links').insert(socialRows);
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

async function replaceSponsors(
  profileId: number,
  input: z.infer<typeof builderSchema>,
) {
  const serviceSupabase = createServiceSupabaseClient();
  const { error: deleteError } = await serviceSupabase
    .from('profile_sponsors')
    .delete()
    .eq('profile_id', profileId);

  if (deleteError) {
    throw new Error(deleteError.message);
  }

  const rows = input.sponsors
    .filter((sponsor) => sponsor.name)
    .map((sponsor, index) => ({
      profile_id: profileId,
      name: sponsor.name,
      logo_url: sponsor.logoUrl,
      website_url: sponsor.websiteUrl,
      sort_order: index,
      is_enabled: true,
    }));

  if (rows.length) {
    const { error: insertError } = await serviceSupabase
      .from('profile_sponsors')
      .insert(rows);

    if (insertError) {
      throw new Error(insertError.message);
    }
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

async function ensureHomePageAndBlocks(
  profileId: number,
  contentBlockOrder: string[],
  mediaBlocks: Array<{
    slot: number;
    sourceUrl: string;
    caption?: string;
  }>,
  offerBlocks: Array<{
    slot: number;
    url: string;
    title: string;
    description: string;
    imageUrl: string | null;
    siteName: string;
    promoCode: string;
    promoText: string;
    ctaLabel: string;
    displaySize: 'small' | 'medium' | 'large';
    isAffiliate: boolean;
  }>,
  partnership: {
    mode: 'sponsors' | 'seeking' | 'both';
    headline?: string;
    description?: string;
    contact?: string;
    ctaLabel?: string;
  },
) {
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
  const { data: existingBlocks } = await serviceSupabase
    .from('profile_blocks')
    .select('type')
    .eq('page_id', homePageId);
  const existingTypes = new Set(
    ((existingBlocks ?? []) as Array<{ type: string }>).map(
      (block) => block.type,
    ),
  );
  const baseBlocks = [
    { type: 'goals', title: 'Goals', sort_order: 0 },
    { type: 'hero', title: 'Athlete intro', sort_order: 1 },
  ].filter((block) => !existingTypes.has(block.type));

  if (baseBlocks.length) {
    await serviceSupabase.from('profile_blocks').insert(
      baseBlocks.map((block) => ({
        page_id: homePageId,
        ...block,
        content: {},
        is_enabled: true,
      })),
    );
  }

  await serviceSupabase
    .from('profile_blocks')
    .delete()
    .eq('page_id', homePageId)
    .in('type', [
      'gallery',
      'achievements',
      'activities',
      'sponsors',
      'media',
      'offer',
    ]);

  if (contentBlockOrder.length) {
    const titles = {
      gallery: 'Image gallery',
      achievements: 'Achievements',
      activities: 'Activities',
      sponsors: 'Sponsors & partnerships',
    };
    const mediaBySlot = new Map(
      mediaBlocks.map((media) => [media.slot, media]),
    );
    const offerBySlot = new Map(
      offerBlocks.map((offer) => [offer.slot, offer]),
    );

    await serviceSupabase.from('profile_blocks').insert(
      contentBlockOrder.map((blockKey, index) => {
        if (blockKey.startsWith('media-')) {
          const media = mediaBySlot.get(Number(blockKey.replace('media-', '')));
          const parsedMedia = media ? parseMediaUrl(media.sourceUrl) : null;

          if (!media || !parsedMedia) {
            throw new Error('Unable to save an invalid media block.');
          }

          return {
            page_id: homePageId,
            type: 'media',
            title: 'Media',
            content: {
              builderManaged: true,
              sourceUrl: media.sourceUrl,
              caption: media.caption,
              provider: parsedMedia.provider,
              mediaId: parsedMedia.mediaId,
            },
            sort_order: index + 2,
            is_enabled: true,
          };
        }

        if (blockKey.startsWith('offer-')) {
          const offer = offerBySlot.get(Number(blockKey.replace('offer-', '')));
          if (!offer) throw new Error('Unable to save an invalid offer block.');

          return {
            page_id: homePageId,
            type: 'offer',
            title: offer.title || 'Offer',
            content: {
              builderManaged: true,
              ...offer,
              ctaLabel: offer.ctaLabel || 'View offer',
            },
            sort_order: index + 2,
            is_enabled: true,
          };
        }

        const type = blockKey as keyof typeof titles;

        return {
          page_id: homePageId,
          type,
          title: titles[type],
          content:
            type === 'sponsors'
              ? { builderManaged: true, ...partnership }
              : { builderManaged: true },
          sort_order: index + 2,
          is_enabled: true,
        };
      }),
    );
  }
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
    socialLinks: getSocialLinks(formData),
    contentBlockOrder: getContentBlockOrder(formData),
    mediaBlocks: getMediaBlocks(formData),
    offerBlocks: getOfferBlocks(formData),
    galleryUrls: getGalleryUrls(formData),
    sponsors: getSponsors(formData),
    partnershipMode: getString(formData, 'partnershipMode') || 'seeking',
    partnershipHeadline: getString(formData, 'partnershipHeadline'),
    partnershipDescription: getString(formData, 'partnershipDescription'),
    partnershipContact: getString(formData, 'partnershipContact'),
    partnershipCtaLabel: getString(formData, 'partnershipCtaLabel'),
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
  const achievementCount = input.achievements.filter(
    (achievement) => achievement.title,
  ).length;

  if (goalCount > 1 || galleryCount > 3 || achievementCount > 3) {
    const subscription = await getSubscriptionState();

    if (!subscription.isActive) {
      return {
        success: false,
        message:
          goalCount > 1
            ? 'Multiple goals require the Pro plan.'
            : galleryCount > 3
              ? 'More than 3 gallery images require the Pro plan.'
              : 'More than 3 achievements require the Pro plan.',
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
      ensureHomePageAndBlocks(
        profileId,
        input.contentBlockOrder,
        input.mediaBlocks,
        input.offerBlocks,
        {
          mode: input.partnershipMode,
          headline: input.partnershipHeadline,
          description: input.partnershipDescription,
          contact: input.partnershipContact,
          ctaLabel: input.partnershipCtaLabel || "Let's work together",
        },
      ),
      replaceSocialLinks(profileId, input),
      replaceGalleryItems(profileId, input),
      replaceSponsors(profileId, input),
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
    customHeaderMutedText: getString(formData, 'customHeaderMutedText'),
    customBlockTitle: getString(formData, 'customBlockTitle'),
    customDescription: getString(formData, 'customDescription'),
    customAccentText: getString(formData, 'customAccentText'),
    customSocialText: getString(formData, 'customSocialText'),
    coverType: getString(formData, 'coverType'),
    coverColor: getString(formData, 'coverColor'),
    coverGradientFrom: getString(formData, 'coverGradientFrom'),
    coverGradientTo: getString(formData, 'coverGradientTo'),
    headerLayout: getString(formData, 'headerLayout'),
    headerAvatarSize: getString(formData, 'headerAvatarSize'),
    headerSheetColor: getString(formData, 'headerSheetColor'),
    headerSheetFade: formData.get('headerSheetFade') === 'true',
    decorativeIcon: getString(formData, 'decorativeIcon'),
    templateWordingOverrideKeys: getString(
      formData,
      'templateWordingOverrideKeys',
    ),
    templateWordingDiscipline: getString(formData, 'templateWordingDiscipline'),
    templateWordingBadge: getString(formData, 'templateWordingBadge'),
    templateWordingEyebrow: getString(formData, 'templateWordingEyebrow'),
    templateWordingProfileLabel: getString(
      formData,
      'templateWordingProfileLabel',
    ),
    templateWordingTargetLabel: getString(
      formData,
      'templateWordingTargetLabel',
    ),
    templateWordingGalleryLabel: getString(
      formData,
      'templateWordingGalleryLabel',
    ),
    templateWordingAchievementsLabel: getString(
      formData,
      'templateWordingAchievementsLabel',
    ),
    templateWordingActivityLabel: getString(
      formData,
      'templateWordingActivityLabel',
    ),
    templateWordingSecondaryGoalLabel: getString(
      formData,
      'templateWordingSecondaryGoalLabel',
    ),
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

  const selectedColor = colorPresets.find(
    (item) => item.id === parsed.data.colorPreset,
  );
  const selectedFont = fontPresets.find(
    (item) => item.id === parsed.data.fontPreset,
  );
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
  const wordingOverrideKeys = new Set(
    parsed.data.templateWordingOverrideKeys.split(',').filter(Boolean),
  );
  const templateWordingOverrides = {
    ...(wordingOverrideKeys.has('discipline')
      ? { discipline: parsed.data.templateWordingDiscipline }
      : {}),
    ...(wordingOverrideKeys.has('badge')
      ? { badge: parsed.data.templateWordingBadge }
      : {}),
    ...(wordingOverrideKeys.has('eyebrow')
      ? { eyebrow: parsed.data.templateWordingEyebrow }
      : {}),
    ...(wordingOverrideKeys.has('profileLabel')
      ? { profileLabel: parsed.data.templateWordingProfileLabel }
      : {}),
    ...(wordingOverrideKeys.has('targetLabel')
      ? { targetLabel: parsed.data.templateWordingTargetLabel }
      : {}),
    ...(wordingOverrideKeys.has('galleryLabel')
      ? { galleryLabel: parsed.data.templateWordingGalleryLabel }
      : {}),
    ...(wordingOverrideKeys.has('achievementsLabel')
      ? {
          achievementsLabel: parsed.data.templateWordingAchievementsLabel,
        }
      : {}),
    ...(wordingOverrideKeys.has('activityLabel')
      ? { activityLabel: parsed.data.templateWordingActivityLabel }
      : {}),
    ...(wordingOverrideKeys.has('secondaryGoalLabel')
      ? {
          secondaryGoalLabel: parsed.data.templateWordingSecondaryGoalLabel,
        }
      : {}),
  };

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
          headerMutedText: parsed.data.customHeaderMutedText,
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
        headerLayout: parsed.data.headerLayout,
        headerAvatarSize: parsed.data.headerAvatarSize,
        headerSheetColor: parsed.data.headerSheetColor,
        headerSheetFade: parsed.data.headerSheetFade,
        decorativeIcon: parsed.data.decorativeIcon,
        templateWordingOverrides,
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
