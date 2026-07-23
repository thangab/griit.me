'use server';

import { revalidatePath, updateTag } from 'next/cache';
import { z } from 'zod';
import {
  createServerSupabaseClient,
  createServiceSupabaseClient,
} from '@/lib/config/supabase-server';
import {
  defaultProfileTemplateId,
  getProfileTemplate,
  isProfileTemplateId,
  resolveProfileTemplateId,
} from '@/lib/constants/profile-templates';
import { getSubscriptionState } from '@/lib/services/billing';
import { ensureAccountProfile } from '@/lib/services/account-profile';
import {
  athleteDirectoryCacheTag,
  getPublicProfileCacheTag,
} from '@/lib/cache/profile-cache';
import {
  avatarShapes,
  blockShadowStyles,
  colorPresets,
  coverTypes,
  fontPresets,
  freeHeaderGeometries,
  freeHeaderTextures,
  galleryLayouts,
  headerGeometries,
  headerLayouts,
  headerTextures,
  radiusPresets,
  resolveProfileThemeSettings,
} from '@/lib/constants/profile-theme';
import {
  isSocialPlatformId,
  socialPlatforms,
} from '@/lib/constants/social-platforms';
import { parseMediaUrl } from '@/lib/utils/media-embed';
import { goalDateDisplays } from '@/lib/utils/goal-date';
import { createSportSlug } from '@/lib/constants/sports';

export interface ProfileBuilderActionState {
  success: boolean;
  message: string;
  profileId?: number;
}

export interface UsernameAvailabilityResult {
  available: boolean;
  message: string;
  username?: string;
}

const contentSaveSections = [
  'profile',
  'sports',
  'goals',
  'socials',
  'blocks',
  'gallery',
  'sponsors',
  'achievements',
  'activities',
] as const;

type ContentSaveSection = (typeof contentSaveSections)[number];

function getDirtySections(formData: FormData) {
  const allowedSections = new Set<string>(contentSaveSections);
  const sections = getString(formData, 'dirtySections')
    .split(',')
    .filter((section): section is ContentSaveSection =>
      allowedSections.has(section),
    );

  return new Set<ContentSaveSection>(
    sections.length ? sections : contentSaveSections,
  );
}

function getProfileId(formData: FormData) {
  const value = Number(getString(formData, 'profileId'));
  return Number.isInteger(value) && value > 0 ? value : null;
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

const persistedIdSchema = z.number().int().positive().nullable();

const socialLinkSchema = z
  .object({
    id: persistedIdSchema,
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

const customSportSchema = z
  .object({
    name: z.string().trim().min(2).max(32),
    slug: z
      .string()
      .trim()
      .min(1)
      .max(80)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  })
  .refine((sport) => createSportSlug(sport.name) === sport.slug, {
    message: 'Invalid custom sport.',
  });

const builderSchema = z.object({
  displayName: z.string().trim().min(1, 'Display name is required.').max(120),
  bio: z.string().trim().max(300).optional(),
  location: z.string().trim().max(120).optional(),
  sportSlugs: z.array(z.string().trim().max(80)).max(8),
  customSports: z.array(customSportSchema).max(8),
  avatarUrl: urlSchema,
  isPublished: z.boolean(),
  socialLinks: z.array(socialLinkSchema).max(socialPlatforms.length),
  contentBlockOrder: z
    .array(
      z
        .string()
        .regex(
          /^(gallery|achievements|activities|sponsors|media-\d+|offer-\d+|link-\d+)$/,
          'Invalid content block.',
        ),
    )
    .max(54),
  mediaBlocks: z
    .array(
      z.object({
        id: persistedIdSchema,
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
        id: persistedIdSchema,
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
  linkBlocks: z
    .array(
      z.object({
        id: persistedIdSchema,
        slot: z.number().int().positive(),
        url: urlSchema,
        title: z.string().trim().max(160),
        description: z.string().trim().max(500),
        imageUrl: urlSchema,
      }),
    )
    .max(50),
  galleryItems: z
    .array(
      z.object({
        id: persistedIdSchema,
        url: urlSchema,
      }),
    )
    .max(50),
  sponsors: z
    .array(
      z.object({
        id: persistedIdSchema,
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
        id: persistedIdSchema,
        title: z.string().trim().max(160),
        description: z.string().trim().max(500).optional(),
        achievedAt: dateSchema,
      }),
    )
    .max(50),
  activities: z
    .array(
      z.object({
        id: persistedIdSchema,
        title: z.string().trim().max(160),
        activityType: z.string().trim().max(80).optional(),
        occurredAt: dateSchema,
      }),
    )
    .max(50),
  goals: z
    .array(
      z.object({
        id: persistedIdSchema,
        title: z.string().trim().max(160),
        description: z.string().trim().max(500).optional(),
        url: urlSchema,
        targetAt: dateSchema,
        dateDisplay: z.enum(goalDateDisplays),
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

const createProfileSchema = usernameSchema.extend({
  displayName: z.string().trim().min(1, 'Profile name is required.').max(120),
  sportSlugs: z.array(z.string().trim().max(80)).max(3),
  customSports: z.array(customSportSchema).max(3),
  objective: z.string().trim().max(160),
  templateId: z.string().refine(isProfileTemplateId, 'Invalid template.'),
});

const profileSettingsSchema = z.object({
  seoTitle: z.string().trim().max(70, 'SEO title is too long.'),
  seoDescription: z.string().trim().max(160, 'SEO description is too long.'),
  shareImageUrl: urlSchema,
});

const profileVisibilitySchema = z.object({
  isPublished: z.boolean(),
  isDiscoverable: z.boolean(),
  allowIndexing: z.boolean(),
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
  coverOverlayColor: z
    .string()
    .regex(/^#[0-9a-f]{6}$/i, 'Invalid photo overlay color.'),
  coverOverlayOpacity: z.coerce.number().min(0).max(100),
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
  headerAvatarShape: z.enum(avatarShapes),
  headerSheetColor: z
    .string()
    .regex(/^#[0-9a-f]{6}$/i, 'Invalid header sheet color.'),
  headerSheetCoverage: z.coerce.number().min(0).max(100),
  headerGeometry: z.enum(headerGeometries),
  headerTexture: z.enum(headerTextures),
  blockCorner: z.coerce.number().min(0).max(100),
  blockBorder: z.coerce.number().min(0).max(100),
  blockBorderColor: z
    .string()
    .regex(/^#[0-9a-f]{6}$/i, 'Invalid block border color.'),
  blockShadow: z.coerce.number().min(0).max(100),
  blockShadowStyle: z.enum(blockShadowStyles),
  blockSpacing: z.coerce.number().min(0).max(100),
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

function getPersistedId(formData: FormData, key: string) {
  const value = Number(getString(formData, key));
  return Number.isInteger(value) && value > 0 ? value : null;
}

function getGalleryItems(formData: FormData) {
  return Array.from(formData.entries())
    .filter(([key]) => /^galleryUrl\d+$/.test(key))
    .sort(([left], [right]) => {
      const leftIndex = Number(left.replace('galleryUrl', ''));
      const rightIndex = Number(right.replace('galleryUrl', ''));
      return leftIndex - rightIndex;
    })
    .map(([key, value]) => {
      const index = Number(key.replace('galleryUrl', ''));
      return {
        id: getPersistedId(formData, `galleryId${index}`),
        url: String(value).trim(),
      };
    });
}

function getSponsors(formData: FormData) {
  return Array.from(formData.entries())
    .filter(([key]) => /^sponsorName\d+$/.test(key))
    .map(([key, value]) => {
      const index = Number(key.replace('sponsorName', ''));

      return {
        index,
        id: getPersistedId(formData, `sponsorId${index}`),
        name: String(value).trim(),
        logoUrl: getString(formData, `sponsorLogoUrl${index}`),
        websiteUrl: getString(formData, `sponsorWebsiteUrl${index}`),
      };
    })
    .sort((left, right) => left.index - right.index)
    .map(({ id, name, logoUrl, websiteUrl }) => ({
      id,
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
        id: getPersistedId(formData, `socialId${index}`),
        platform: String(value).trim().toLowerCase(),
        label: getString(formData, `socialLabel${index}`),
        url: getString(formData, `socialUrl${index}`),
      };
    })
    .sort((left, right) => left.index - right.index)
    .map(({ id, platform, label, url }) => ({ id, platform, label, url }));
}

function getGoals(formData: FormData) {
  return [1, 2, 3].map((index) => ({
    id: getPersistedId(formData, `goalId${index}`),
    title: getString(formData, `goalTitle${index}`),
    description: getString(formData, `goalDescription${index}`),
    url: getString(formData, `goalUrl${index}`),
    targetAt: getString(formData, `goalTargetAt${index}`),
    dateDisplay: getString(formData, `goalDateDisplay${index}`) || 'date',
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
        id: getPersistedId(formData, `achievementId${index}`),
        title: String(value).trim(),
        description: getString(formData, `achievementDescription${index}`),
        achievedAt: getString(formData, `achievementDate${index}`),
      };
    })
    .sort((left, right) => left.index - right.index)
    .map(({ id, title, description, achievedAt }) => ({
      id,
      title,
      description,
      achievedAt,
    }));
}

function getActivities(formData: FormData) {
  return Array.from(formData.entries())
    .filter(([key]) => /^activityTitle\d+$/.test(key))
    .map(([key, value]) => {
      const index = Number(key.replace('activityTitle', ''));

      return {
        index,
        id: getPersistedId(formData, `activityId${index}`),
        title: String(value).trim(),
        activityType: getString(formData, `activityType${index}`),
        occurredAt: getString(formData, `activityDate${index}`),
      };
    })
    .sort((left, right) => left.index - right.index)
    .map(({ id, title, activityType, occurredAt }) => ({
      id,
      title,
      activityType,
      occurredAt,
    }));
}

function getSportSlugs(formData: FormData) {
  return formData
    .getAll('sportSlugs')
    .map((value) => String(value).trim())
    .filter(Boolean);
}

function getCustomSports(formData: FormData) {
  return formData.getAll('customSport').flatMap((value) => {
    try {
      return [JSON.parse(String(value))];
    } catch {
      return [];
    }
  });
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
        id: getPersistedId(formData, `contentBlockId-media-${slot}`),
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
        id: getPersistedId(formData, `contentBlockId-offer-${slot}`),
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

function getLinkBlocks(formData: FormData) {
  return Array.from(formData.entries())
    .filter(([key]) => /^linkUrl\d+$/.test(key))
    .sort(([left], [right]) => {
      const leftSlot = Number(left.replace('linkUrl', ''));
      const rightSlot = Number(right.replace('linkUrl', ''));
      return leftSlot - rightSlot;
    })
    .map(([key, value]) => {
      const slot = Number(key.replace('linkUrl', ''));

      return {
        id: getPersistedId(formData, `contentBlockId-link-${slot}`),
        slot,
        url: String(value).trim(),
        title: getString(formData, `linkTitle${slot}`),
        description: getString(formData, `linkDescription${slot}`),
        imageUrl: getString(formData, `linkImageUrl${slot}`),
      };
    });
}

type PersistedContentInput = {
  id: number | null;
  values: Record<string, unknown>;
};

async function reconcileProfileContentRows(
  table:
    | 'profile_social_links'
    | 'profile_gallery_items'
    | 'profile_goals'
    | 'profile_achievements'
    | 'profile_activities'
    | 'profile_sponsors',
  profileId: number,
  rows: PersistedContentInput[],
) {
  const serviceSupabase = createServiceSupabaseClient();
  const { data, error } = await serviceSupabase
    .from(table)
    .select('id, sort_order, deleted_at')
    .eq('profile_id', profileId)
    .order('sort_order', { ascending: true });

  if (error) throw new Error(error.message);

  const existingRows = (data ?? []) as Array<{
    id: number;
    sort_order: number;
    deleted_at: string | null;
  }>;
  const existingIds = new Set(existingRows.map((row) => row.id));
  const claimedIds = new Set<number>();

  for (const [sortOrder, row] of rows.entries()) {
    if (row.id && (!existingIds.has(row.id) || claimedIds.has(row.id))) {
      throw new Error(
        'Unable to update content that does not belong to this profile.',
      );
    }

    const fallback = row.id
      ? null
      : existingRows.find(
          (existing) =>
            !existing.deleted_at &&
            existing.sort_order === sortOrder &&
            !claimedIds.has(existing.id),
        );
    const persistedId = row.id ?? fallback?.id ?? null;
    const values = {
      ...row.values,
      sort_order: sortOrder,
      is_enabled: true,
      deleted_at: null,
      updated_at: new Date().toISOString(),
    };

    if (persistedId) {
      const { error: updateError } = await serviceSupabase
        .from(table)
        .update(values)
        .eq('id', persistedId)
        .eq('profile_id', profileId);
      if (updateError) throw new Error(updateError.message);
      claimedIds.add(persistedId);
    } else {
      const { error: insertError } = await serviceSupabase.from(table).insert({
        profile_id: profileId,
        ...values,
      });
      if (insertError) throw new Error(insertError.message);
    }
  }

  const idsToArchive = existingRows
    .filter((row) => !row.deleted_at && !claimedIds.has(row.id))
    .map((row) => row.id);

  if (idsToArchive.length) {
    const { error: archiveError } = await serviceSupabase
      .from(table)
      .update({
        is_enabled: false,
        deleted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('profile_id', profileId)
      .in('id', idsToArchive);
    if (archiveError) throw new Error(archiveError.message);
  }
}

async function replaceSocialLinks(
  profileId: number,
  input: z.infer<typeof builderSchema>,
) {
  const socialRows = input.socialLinks
    .filter((link): link is typeof link & { url: string } => Boolean(link.url))
    .map((link) => ({
      id: link.id,
      values: {
        platform: link.platform,
        label: link.label || null,
        url: link.url,
      },
    }));

  await reconcileProfileContentRows(
    'profile_social_links',
    profileId,
    socialRows,
  );
}

async function replaceGalleryItems(
  profileId: number,
  input: z.infer<typeof builderSchema>,
) {
  const galleryRows = input.galleryItems
    .filter((item): item is typeof item & { url: string } => Boolean(item.url))
    .map((item, index) => ({
      id: item.id,
      values: {
        image_url: item.url,
        caption: `Gallery image ${index + 1}`,
        alt_text: 'Athlete gallery image',
      },
    }));

  await reconcileProfileContentRows(
    'profile_gallery_items',
    profileId,
    galleryRows,
  );
}

async function replaceGoals(
  profileId: number,
  input: z.infer<typeof builderSchema>,
) {
  const goalRows = input.goals
    .filter((goal) => goal.title)
    .map((goal) => ({
      id: goal.id,
      values: {
        title: goal.title,
        description: goal.description || null,
        url: goal.url,
        target_at: goal.targetAt,
        date_display: goal.dateDisplay,
        status: goal.status || 'planned',
      },
    }));

  await reconcileProfileContentRows('profile_goals', profileId, goalRows);
}

async function replaceAchievements(
  profileId: number,
  input: z.infer<typeof builderSchema>,
) {
  const rows = input.achievements
    .filter((item) => item.title)
    .map((item) => ({
      id: item.id,
      values: {
        title: item.title,
        description: item.description || null,
        achieved_at: item.achievedAt,
      },
    }));

  await reconcileProfileContentRows('profile_achievements', profileId, rows);
}

async function replaceActivities(
  profileId: number,
  input: z.infer<typeof builderSchema>,
) {
  const rows = input.activities
    .filter((item) => item.title)
    .map((item) => ({
      id: item.id,
      values: {
        title: item.title,
        activity_type: item.activityType || null,
        occurred_at: item.occurredAt,
        metrics: {},
      },
    }));

  await reconcileProfileContentRows('profile_activities', profileId, rows);
}

async function replaceSponsors(
  profileId: number,
  input: z.infer<typeof builderSchema>,
) {
  const rows = input.sponsors
    .filter((sponsor) => sponsor.name)
    .map((sponsor) => ({
      id: sponsor.id,
      values: {
        name: sponsor.name,
        logo_url: sponsor.logoUrl,
        website_url: sponsor.websiteUrl,
      },
    }));

  await reconcileProfileContentRows('profile_sponsors', profileId, rows);
}

async function replaceSports(
  profileId: number,
  input: z.infer<typeof builderSchema>,
) {
  const serviceSupabase = createServiceSupabaseClient();
  const customSports = input.customSports.filter((sport) =>
    input.sportSlugs.includes(sport.slug),
  );

  if (customSports.length) {
    const { error: customSportsError } = await serviceSupabase
      .from('sports')
      .upsert(
        customSports.map((sport) => ({
          name: sport.name,
          slug: sport.slug,
          sort_order: 1000,
          is_enabled: true,
          is_custom: true,
          updated_at: new Date().toISOString(),
        })),
        { onConflict: 'slug', ignoreDuplicates: true },
      );

    if (customSportsError) throw new Error(customSportsError.message);
  }

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

async function reconcileProfileBlocks(
  profileId: number,
  contentBlockOrder: string[],
  mediaBlocks: Array<{
    id: number | null;
    slot: number;
    sourceUrl: string;
    caption?: string;
  }>,
  offerBlocks: Array<{
    id: number | null;
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
  linkBlocks: Array<{
    id: number | null;
    slot: number;
    url: string | null;
    title: string;
    description: string;
    imageUrl: string | null;
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
  const { data: existingBlocks } = await serviceSupabase
    .from('profile_blocks')
    .select('type')
    .eq('profile_id', profileId);
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
        profile_id: profileId,
        ...block,
        content: {},
        is_enabled: true,
      })),
    );
  }

  const managedTypes = [
    'gallery',
    'achievements',
    'activities',
    'sponsors',
    'media',
    'offer',
    'link',
  ];
  const { data: managedBlockData, error: managedBlockError } =
    await serviceSupabase
      .from('profile_blocks')
      .select('id, type, sort_order, deleted_at')
      .eq('profile_id', profileId)
      .in('type', managedTypes)
      .order('sort_order', { ascending: true });

  if (managedBlockError) throw new Error(managedBlockError.message);

  const managedBlocks = (managedBlockData ?? []) as Array<{
    id: number;
    type: string;
    sort_order: number;
    deleted_at: string | null;
  }>;
  const managedIds = new Set(managedBlocks.map((block) => block.id));
  const claimedIds = new Set<number>();
  const titles = {
    gallery: 'Image gallery',
    achievements: 'Achievements',
    activities: 'Activities',
    sponsors: 'Sponsors & partnerships',
  };
  const mediaBySlot = new Map(mediaBlocks.map((media) => [media.slot, media]));
  const offerBySlot = new Map(offerBlocks.map((offer) => [offer.slot, offer]));
  const linkBySlot = new Map(linkBlocks.map((link) => [link.slot, link]));

  const desiredBlocks = contentBlockOrder.map((blockKey, index) => {
    if (blockKey.startsWith('media-')) {
      const media = mediaBySlot.get(Number(blockKey.replace('media-', '')));
      const parsedMedia = media ? parseMediaUrl(media.sourceUrl) : null;
      if (!media || !parsedMedia) {
        throw new Error('Unable to save an invalid media block.');
      }
      return {
        id: media.id,
        type: 'media',
        title: 'Media',
        content: {
          builderManaged: true,
          sourceUrl: media.sourceUrl,
          caption: media.caption,
          provider: parsedMedia.provider,
          mediaId: parsedMedia.mediaId,
        },
        sortOrder: index + 2,
      };
    }

    if (blockKey.startsWith('offer-')) {
      const offer = offerBySlot.get(Number(blockKey.replace('offer-', '')));
      if (!offer) throw new Error('Unable to save an invalid offer block.');
      return {
        id: offer.id,
        type: 'offer',
        title: offer.title || 'Offer',
        content: {
          builderManaged: true,
          url: offer.url,
          title: offer.title,
          description: offer.description,
          imageUrl: offer.imageUrl,
          siteName: offer.siteName,
          promoCode: offer.promoCode,
          promoText: offer.promoText,
          ctaLabel: offer.ctaLabel || 'View offer',
          displaySize: offer.displaySize,
          isAffiliate: offer.isAffiliate,
        },
        sortOrder: index + 2,
      };
    }

    if (blockKey.startsWith('link-')) {
      const link = linkBySlot.get(Number(blockKey.replace('link-', '')));
      if (!link) throw new Error('Unable to save an invalid link block.');
      return {
        id: link.id,
        type: 'link',
        title: link.title || 'Link',
        content: {
          builderManaged: true,
          url: link.url,
          title: link.title,
          description: link.description,
          imageUrl: link.imageUrl,
        },
        sortOrder: index + 2,
      };
    }

    const type = blockKey as keyof typeof titles;
    const existing = managedBlocks.find(
      (block) =>
        block.type === type && !block.deleted_at && !claimedIds.has(block.id),
    );
    return {
      id: existing?.id ?? null,
      type,
      title: titles[type],
      content:
        type === 'sponsors'
          ? { builderManaged: true, ...partnership }
          : { builderManaged: true },
      sortOrder: index + 2,
    };
  });

  for (const block of desiredBlocks) {
    if (block.id && (!managedIds.has(block.id) || claimedIds.has(block.id))) {
      throw new Error(
        'Unable to update a block that does not belong to this profile.',
      );
    }

    const fallback = block.id
      ? null
      : managedBlocks.find(
          (existing) =>
            existing.type === block.type &&
            !existing.deleted_at &&
            !claimedIds.has(existing.id),
        );
    const persistedId = block.id ?? fallback?.id ?? null;
    const values = {
      type: block.type,
      title: block.title,
      content: block.content,
      sort_order: block.sortOrder,
      is_enabled: true,
      deleted_at: null,
      updated_at: new Date().toISOString(),
    };

    if (persistedId) {
      const { error } = await serviceSupabase
        .from('profile_blocks')
        .update(values)
        .eq('id', persistedId)
        .eq('profile_id', profileId);
      if (error) throw new Error(error.message);
      claimedIds.add(persistedId);
    } else {
      const { error } = await serviceSupabase.from('profile_blocks').insert({
        profile_id: profileId,
        ...values,
      });
      if (error) throw new Error(error.message);
    }
  }

  const blockIdsToArchive = managedBlocks
    .filter((block) => !block.deleted_at && !claimedIds.has(block.id))
    .map((block) => block.id);
  if (blockIdsToArchive.length) {
    const { error } = await serviceSupabase
      .from('profile_blocks')
      .update({
        is_enabled: false,
        deleted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('profile_id', profileId)
      .in('id', blockIdsToArchive);
    if (error) throw new Error(error.message);
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

  const profileId = getProfileId(formData);
  if (!profileId) {
    return { success: false, message: 'Invalid profile.' };
  }

  const parsed = builderSchema.safeParse({
    displayName: getString(formData, 'displayName'),
    bio: getString(formData, 'bio'),
    location: getString(formData, 'location'),
    sportSlugs: getSportSlugs(formData),
    customSports: getCustomSports(formData),
    avatarUrl: getString(formData, 'avatarUrl'),
    isPublished: formData.get('isPublished') === 'on',
    socialLinks: getSocialLinks(formData),
    contentBlockOrder: getContentBlockOrder(formData),
    mediaBlocks: getMediaBlocks(formData),
    offerBlocks: getOfferBlocks(formData),
    linkBlocks: getLinkBlocks(formData),
    galleryItems: getGalleryItems(formData),
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
  const dirtySections = getDirtySections(formData);
  const goalCount = input.goals.filter((goal) => goal.title).length;
  const galleryCount = input.galleryItems.filter((item) => item.url).length;
  const achievementCount = input.achievements.filter(
    (achievement) => achievement.title,
  ).length;
  const activityCount = input.activities.filter(
    (activity) => activity.title,
  ).length;

  if (
    goalCount > 1 ||
    galleryCount > 3 ||
    achievementCount > 3 ||
    activityCount > 3
  ) {
    const subscription = await getSubscriptionState();

    if (!subscription.isActive) {
      return {
        success: false,
        message:
          goalCount > 1
            ? 'Multiple goals require the Pro plan.'
            : galleryCount > 3
              ? 'More than 3 gallery images require the Pro plan.'
              : achievementCount > 3
                ? 'More than 3 achievements require the Pro plan.'
                : 'More than 3 activities require the Pro plan.',
      };
    }
  }

  const serviceSupabase = createServiceSupabaseClient();

  const { data: existingProfile } = await serviceSupabase
    .from('public_profiles')
    .select('id, username')
    .eq('id', profileId)
    .eq('user_id', userData.user.id)
    .maybeSingle();

  if (!existingProfile) {
    return {
      success: false,
      message: 'This profile does not exist or does not belong to you.',
    };
  }

  const username = existingProfile.username;

  if (dirtySections.has('profile')) {
    const { error: profileError } = await serviceSupabase
      .from('public_profiles')
      .update({
        display_name: input.displayName,
        bio: input.bio || null,
        location: input.location || null,
        avatar_url: input.avatarUrl,
        is_published: input.isPublished,
        updated_at: new Date().toISOString(),
      })
      .eq('id', profileId)
      .eq('user_id', userData.user.id);

    if (profileError) {
      return {
        success: false,
        message: profileError?.message ?? 'Unable to save profile.',
      };
    }
  }

  try {
    const updates: Promise<void>[] = [];

    if (dirtySections.has('blocks')) {
      updates.push(
        reconcileProfileBlocks(
          profileId,
          input.contentBlockOrder,
          input.mediaBlocks,
          input.offerBlocks,
          input.linkBlocks,
          {
            mode: input.partnershipMode,
            headline: input.partnershipHeadline,
            description: input.partnershipDescription,
            contact: input.partnershipContact,
            ctaLabel: input.partnershipCtaLabel || "Let's work together",
          },
        ),
      );
    }
    if (dirtySections.has('socials'))
      updates.push(replaceSocialLinks(profileId, input));
    if (dirtySections.has('gallery'))
      updates.push(replaceGalleryItems(profileId, input));
    if (dirtySections.has('sponsors'))
      updates.push(replaceSponsors(profileId, input));
    if (dirtySections.has('achievements'))
      updates.push(replaceAchievements(profileId, input));
    if (dirtySections.has('activities'))
      updates.push(replaceActivities(profileId, input));
    if (dirtySections.has('goals'))
      updates.push(replaceGoals(profileId, input));
    if (dirtySections.has('sports'))
      updates.push(replaceSports(profileId, input));

    await Promise.all(updates);
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
  revalidatePath(`/dashboard/profiles/${profileId}`);
  revalidatePath(`/dashboard/profiles/${profileId}/design`);
  revalidatePath(`/${username}`);
  updateTag(getPublicProfileCacheTag(username));
  updateTag(athleteDirectoryCacheTag);

  return {
    success: true,
    message: 'Profile saved.',
  };
}

export async function checkUsernameAvailabilityAction(
  profileId: number,
  value: string,
): Promise<UsernameAvailabilityResult> {
  const supabase = await createServerSupabaseClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    return {
      available: false,
      message: 'Sign in to check username availability.',
    };
  }

  const parsed = usernameSchema.safeParse({ username: value });
  if (!parsed.success) {
    return {
      available: false,
      message: parsed.error.issues[0]?.message ?? 'Invalid username.',
    };
  }

  const { username } = parsed.data;
  const serviceSupabase = createServiceSupabaseClient();
  const { data: existingProfile, error } = await serviceSupabase
    .from('public_profiles')
    .select('id')
    .eq('username', username)
    .maybeSingle();

  if (error) {
    return {
      available: false,
      message: 'Unable to check this username right now.',
    };
  }

  const available = !existingProfile || existingProfile.id === profileId;

  return {
    available,
    username,
    message: available
      ? existingProfile
        ? 'This is your current username.'
        : 'This username is available.'
      : 'This username is already taken.',
  };
}

export async function createProfileAction(
  _prevState: ProfileBuilderActionState,
  formData: FormData,
): Promise<ProfileBuilderActionState> {
  const supabase = await createServerSupabaseClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    return {
      success: false,
      message: 'You need to be signed in to create a profile.',
    };
  }

  const parsed = createProfileSchema.safeParse({
    displayName: getString(formData, 'displayName'),
    username: getString(formData, 'username'),
    sportSlugs: getSportSlugs(formData),
    customSports: getCustomSports(formData),
    objective: getString(formData, 'objective'),
    templateId: getString(formData, 'templateId') || defaultProfileTemplateId,
  });

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? 'Invalid profile.',
    };
  }

  const serviceSupabase = createServiceSupabaseClient();
  const [{ count }, subscription] = await Promise.all([
    serviceSupabase
      .from('public_profiles')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userData.user.id),
    getSubscriptionState(),
  ]);
  const limit = subscription.isActive ? 5 : 1;

  if ((count ?? 0) >= limit) {
    return {
      success: false,
      message: subscription.isActive
        ? 'The Pro plan supports up to 5 profiles.'
        : 'The Free plan supports 1 profile. Upgrade to Pro to create more.',
    };
  }

  const { data: usernameOwner } = await serviceSupabase
    .from('public_profiles')
    .select('id')
    .eq('username', parsed.data.username)
    .maybeSingle();

  if (usernameOwner) {
    return { success: false, message: 'This username is already taken.' };
  }

  try {
    await ensureAccountProfile(userData.user);
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Unable to initialize your account profile.',
    };
  }
  const { data: profile, error } = await serviceSupabase
    .from('public_profiles')
    .insert({
      user_id: userData.user.id,
      username: parsed.data.username,
      display_name: parsed.data.displayName,
      avatar_url: null,
      theme: { templateId: parsed.data.templateId },
      is_published: false,
    })
    .select('id')
    .single();

  if (error || !profile) {
    return {
      success: false,
      message: error?.message ?? 'Unable to create this profile.',
    };
  }

  try {
    if (parsed.data.sportSlugs.length) {
      const customSports = parsed.data.customSports.filter((sport) =>
        parsed.data.sportSlugs.includes(sport.slug),
      );

      if (customSports.length) {
        const { error: customSportsError } = await serviceSupabase
          .from('sports')
          .upsert(
            customSports.map((sport) => ({
              name: sport.name,
              slug: sport.slug,
              sort_order: 1000,
              is_enabled: true,
              is_custom: true,
              updated_at: new Date().toISOString(),
            })),
            { onConflict: 'slug', ignoreDuplicates: true },
          );

        if (customSportsError) throw new Error(customSportsError.message);
      }

      const { data: sports, error: sportsError } = await serviceSupabase
        .from('sports')
        .select('id, slug')
        .eq('is_enabled', true)
        .in('slug', parsed.data.sportSlugs);

      if (sportsError) throw new Error(sportsError.message);

      const sportIdBySlug = new Map(
        ((sports ?? []) as Array<{ id: number; slug: string }>).map((sport) => [
          sport.slug,
          sport.id,
        ]),
      );
      const sportRows = parsed.data.sportSlugs.flatMap((slug, index) => {
        const sportId = sportIdBySlug.get(slug);

        return sportId
          ? [
              {
                profile_id: profile.id,
                sport_id: sportId,
                sort_order: index,
                is_enabled: true,
              },
            ]
          : [];
      });

      if (sportRows.length !== parsed.data.sportSlugs.length) {
        throw new Error('One of the selected sports is unavailable.');
      }

      const { error: profileSportsError } = await serviceSupabase
        .from('profile_sports')
        .insert(sportRows);

      if (profileSportsError) throw new Error(profileSportsError.message);
    }

    if (parsed.data.objective) {
      const { error: goalError } = await serviceSupabase
        .from('profile_goals')
        .insert({
          profile_id: profile.id,
          title: parsed.data.objective,
          description: null,
          target_at: null,
          date_display: 'date',
          status: 'planned',
          sort_order: 0,
          is_enabled: true,
        });

      if (goalError) throw new Error(goalError.message);
    }
  } catch (relatedContentError) {
    await serviceSupabase.from('public_profiles').delete().eq('id', profile.id);

    return {
      success: false,
      message:
        relatedContentError instanceof Error
          ? relatedContentError.message
          : 'Unable to finish setting up this profile.',
    };
  }

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/onboard');
  revalidatePath('/dashboard/profiles');

  return {
    success: true,
    message: 'Profile created.',
    profileId: profile.id,
  };
}

export async function deleteProfileAction(
  profileId: number,
): Promise<ProfileBuilderActionState> {
  const supabase = await createServerSupabaseClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user || !Number.isInteger(profileId)) {
    return { success: false, message: 'Unable to delete this profile.' };
  }

  const serviceSupabase = createServiceSupabaseClient();
  const { data: profile } = await serviceSupabase
    .from('public_profiles')
    .select('username')
    .eq('id', profileId)
    .eq('user_id', userData.user.id)
    .maybeSingle();

  if (!profile) {
    return {
      success: false,
      message: 'This profile does not exist or does not belong to you.',
    };
  }

  const { error } = await serviceSupabase
    .from('public_profiles')
    .delete()
    .eq('id', profileId)
    .eq('user_id', userData.user.id);

  if (error) return { success: false, message: error.message };

  revalidatePath('/dashboard');
  revalidatePath(`/${profile.username}`);
  updateTag(getPublicProfileCacheTag(profile.username));
  updateTag(athleteDirectoryCacheTag);

  return { success: true, message: 'Profile deleted.' };
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

  const profileId = getProfileId(formData);
  if (!profileId) {
    return { success: false, message: 'Invalid profile.' };
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

  const { data: existingUsernameOwner } = await serviceSupabase
    .from('public_profiles')
    .select('id')
    .eq('username', username)
    .maybeSingle();

  if (existingUsernameOwner && existingUsernameOwner.id !== profileId) {
    return {
      success: false,
      message: 'This username is already taken.',
    };
  }

  const { data: existingProfile } = await serviceSupabase
    .from('public_profiles')
    .select('username')
    .eq('id', profileId)
    .eq('user_id', userData.user.id)
    .maybeSingle();

  if (!existingProfile) {
    return {
      success: false,
      message: 'This profile does not exist or does not belong to you.',
    };
  }

  const previousUsername = existingProfile?.username;
  const { error } = await serviceSupabase
    .from('public_profiles')
    .update({
      username,
      updated_at: new Date().toISOString(),
    })
    .eq('id', profileId)
    .eq('user_id', userData.user.id);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  revalidatePath('/dashboard');
  revalidatePath(`/dashboard/profiles/${profileId}`);
  revalidatePath(`/dashboard/profiles/${profileId}/design`);
  revalidatePath(`/dashboard/profiles/${profileId}/settings`);
  revalidatePath(`/${username}`);
  updateTag(getPublicProfileCacheTag(username));
  updateTag(athleteDirectoryCacheTag);

  if (previousUsername && previousUsername !== username) {
    revalidatePath(`/${previousUsername}`);
    updateTag(getPublicProfileCacheTag(previousUsername));
  }

  return {
    success: true,
    message: 'Public URL updated.',
  };
}

export async function updateProfileSettingsAction(
  _prevState: ProfileBuilderActionState,
  formData: FormData,
): Promise<ProfileBuilderActionState> {
  const supabase = await createServerSupabaseClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    return {
      success: false,
      message: 'You need to be signed in to update profile settings.',
    };
  }

  const profileId = getProfileId(formData);
  if (!profileId) return { success: false, message: 'Invalid profile.' };

  const parsed = profileSettingsSchema.safeParse({
    seoTitle: getString(formData, 'seoTitle'),
    seoDescription: getString(formData, 'seoDescription'),
    shareImageUrl: getString(formData, 'shareImageUrl'),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? 'Invalid profile settings.',
    };
  }

  const serviceSupabase = createServiceSupabaseClient();
  const { data: profile, error } = await serviceSupabase
    .from('public_profiles')
    .update({
      seo_title: parsed.data.seoTitle || null,
      seo_description: parsed.data.seoDescription || null,
      share_image_url: parsed.data.shareImageUrl,
      updated_at: new Date().toISOString(),
    })
    .eq('id', profileId)
    .eq('user_id', userData.user.id)
    .select('username')
    .maybeSingle();

  if (error || !profile) {
    return {
      success: false,
      message: error?.message ?? 'Unable to update profile settings.',
    };
  }

  revalidatePath('/dashboard');
  revalidatePath(`/dashboard/profiles/${profileId}`);
  revalidatePath(`/dashboard/profiles/${profileId}/settings`);
  revalidatePath(`/${profile.username}`);
  revalidatePath('/athletes');
  updateTag(getPublicProfileCacheTag(profile.username));
  updateTag(athleteDirectoryCacheTag);

  return { success: true, message: 'Profile settings saved.' };
}

export async function updateProfileVisibilityAction(
  _prevState: ProfileBuilderActionState,
  formData: FormData,
): Promise<ProfileBuilderActionState> {
  const supabase = await createServerSupabaseClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    return {
      success: false,
      message: 'You need to be signed in to update profile visibility.',
    };
  }

  const profileId = getProfileId(formData);
  if (!profileId) return { success: false, message: 'Invalid profile.' };

  const parsed = profileVisibilitySchema.safeParse({
    isPublished: formData.get('isPublished') === 'on',
    isDiscoverable: formData.get('isDiscoverable') === 'on',
    allowIndexing: formData.get('allowIndexing') === 'on',
  });

  if (!parsed.success) {
    return { success: false, message: 'Invalid visibility settings.' };
  }

  const serviceSupabase = createServiceSupabaseClient();
  const { data: profile, error } = await serviceSupabase
    .from('public_profiles')
    .update({
      is_published: parsed.data.isPublished,
      is_discoverable: parsed.data.isDiscoverable,
      allow_indexing: parsed.data.allowIndexing,
      updated_at: new Date().toISOString(),
    })
    .eq('id', profileId)
    .eq('user_id', userData.user.id)
    .select('username')
    .maybeSingle();

  if (error || !profile) {
    return {
      success: false,
      message: error?.message ?? 'Unable to update profile visibility.',
    };
  }

  revalidatePath('/dashboard');
  revalidatePath(`/dashboard/profiles/${profileId}`);
  revalidatePath(`/dashboard/profiles/${profileId}/settings`);
  revalidatePath(`/${profile.username}`);
  revalidatePath('/athletes');
  updateTag(getPublicProfileCacheTag(profile.username));
  updateTag(athleteDirectoryCacheTag);

  return { success: true, message: 'Visibility saved.' };
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

  const profileId = getProfileId(formData);
  if (!profileId) {
    return { success: false, message: 'Invalid profile.' };
  }

  const parsed = templateSchema.safeParse({
    templateId: getString(formData, 'templateId'),
    coverUrl: getString(formData, 'coverUrl'),
    colorPreset: getString(formData, 'colorPreset'),
    fontPreset: getString(formData, 'fontPreset'),
    coverOverlayColor: getString(formData, 'coverOverlayColor'),
    coverOverlayOpacity: getString(formData, 'coverOverlayOpacity'),
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
    headerAvatarShape: getString(formData, 'headerAvatarShape'),
    headerSheetColor: getString(formData, 'headerSheetColor'),
    headerSheetCoverage: getString(formData, 'headerSheetCoverage'),
    headerGeometry: getString(formData, 'headerGeometry'),
    headerTexture: getString(formData, 'headerTexture'),
    blockCorner: getString(formData, 'blockCorner'),
    blockBorder: getString(formData, 'blockBorder'),
    blockBorderColor: getString(formData, 'blockBorderColor'),
    blockShadow: getString(formData, 'blockShadow'),
    blockShadowStyle: getString(formData, 'blockShadowStyle'),
    blockSpacing: getString(formData, 'blockSpacing'),
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
    .eq('id', profileId)
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
  const existingTemplateId = resolveProfileTemplateId(existingTheme);

  if (!subscription.isActive && templateId === existingTemplateId) {
    const existingSettings = resolveProfileThemeSettings(existingTheme);
    const submittedCustomColors = {
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
    };
    const customColorsChanged =
      JSON.stringify(submittedCustomColors) !==
      JSON.stringify(existingSettings.customColors);
    const advancedSetting = [
      parsed.data.colorPreset === 'custom' && customColorsChanged
        ? 'Custom colors'
        : null,
      parsed.data.headerGeometry !== existingSettings.headerGeometry &&
      !freeHeaderGeometries.includes(parsed.data.headerGeometry)
        ? 'Header geometry'
        : null,
      parsed.data.headerTexture !== existingSettings.headerTexture &&
      !freeHeaderTextures.includes(parsed.data.headerTexture)
        ? 'Header texture'
        : null,
      parsed.data.headerAvatarShape !== existingSettings.headerAvatarShape &&
      ['diamond', 'shield'].includes(parsed.data.headerAvatarShape)
        ? 'Advanced profile picture shapes'
        : null,
      parsed.data.blockBorderColor !== existingSettings.blockBorderColor
        ? 'Custom block border color'
        : null,
      parsed.data.blockShadowStyle !== existingSettings.blockShadowStyle &&
      parsed.data.blockShadowStyle === 'solid'
        ? 'Solid block shadow'
        : null,
    ].find(Boolean);

    if (advancedSetting) {
      return {
        success: false,
        message: `${advancedSetting} requires the Pro plan.`,
      };
    }
  }

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
        coverOverlayColor: parsed.data.coverOverlayColor,
        coverOverlayOpacity: parsed.data.coverOverlayOpacity,
        radiusPreset: parsed.data.radiusPreset,
        galleryLayout: parsed.data.galleryLayout,
        coverType: parsed.data.coverType,
        coverColor: parsed.data.coverColor,
        coverGradientFrom: parsed.data.coverGradientFrom,
        coverGradientTo: parsed.data.coverGradientTo,
        headerLayout: parsed.data.headerLayout,
        headerAvatarSize: parsed.data.headerAvatarSize,
        headerAvatarShape: parsed.data.headerAvatarShape,
        headerSheetColor: parsed.data.headerSheetColor,
        headerSheetCoverage: parsed.data.headerSheetCoverage,
        headerGeometry: parsed.data.headerGeometry,
        headerTexture: parsed.data.headerTexture,
        blockCorner: parsed.data.blockCorner,
        blockBorder: parsed.data.blockBorder,
        blockBorderColor: parsed.data.blockBorderColor,
        blockShadow: parsed.data.blockShadow,
        blockShadowStyle: parsed.data.blockShadowStyle,
        blockSpacing: parsed.data.blockSpacing,
        templateWordingOverrides,
      },
      updated_at: new Date().toISOString(),
    })
    .eq('id', profileId)
    .eq('user_id', userData.user.id);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  revalidatePath('/dashboard');
  revalidatePath(`/dashboard/profiles/${profileId}`);
  revalidatePath(`/dashboard/profiles/${profileId}/design`);
  revalidatePath(`/${existingProfile.username}`);
  updateTag(getPublicProfileCacheTag(existingProfile.username));
  updateTag(athleteDirectoryCacheTag);

  return {
    success: true,
    message: 'Template updated.',
  };
}

export async function setProfilePublishedAction(
  profileId: number,
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
    .eq('id', profileId)
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
  revalidatePath(`/dashboard/profiles/${profileId}`);
  revalidatePath(`/dashboard/profiles/${profileId}/design`);
  revalidatePath(`/${profile.username}`);
  updateTag(getPublicProfileCacheTag(profile.username));
  updateTag(athleteDirectoryCacheTag);

  return {
    success: true,
    message: isPublished ? 'Profile published.' : 'Profile unpublished.',
  };
}
