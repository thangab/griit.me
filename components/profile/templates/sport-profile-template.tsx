import {
  ArrowUpRightIcon as ArrowUpRight,
  FlagIcon as Flag,
  MapPinIcon as MapPin,
  MedalIcon as Medal,
  PulseIcon as Activity,
  TargetIcon as Target,
} from '@phosphor-icons/react/ssr';
import Image from 'next/image';
import {
  BarbellIcon as Barbell,
  BicycleIcon as Bicycle,
  GaugeIcon as Gauge,
  LightningIcon as Lightning,
  ShieldIcon as Shield,
  TimerIcon as Timer,
  TrophyIcon as Trophy,
} from '@phosphor-icons/react/ssr';
import type { Icon as PhosphorIcon } from '@phosphor-icons/react';
import { MediaBlock } from '@/components/profile/media-block';
import { OfferBlock } from '@/components/profile/offer-block';
import { LinkBlock } from '@/components/profile/link-block';
import { ProfileDecorativeIcon } from '@/components/profile/decorative-icon';
import { ProfileHeader } from '@/components/profile/profile-header';
import {
  GoalDateBadge,
  GoalDateIcon,
} from '@/components/profile/goal-date-badge';
import { SocialPlatformIcon } from '@/components/profile/social-platform-icon';
import { SponsorsPartnershipsBlock } from '@/components/profile/sponsors-partnerships-block';
import type { ProfileTemplateVariant } from '@/components/profile/templates/goal-spotlight-template';
import { getSocialLinkHref } from '@/lib/constants/social-platforms';
import {
  resolveTemplateWording,
  type TemplateWording,
} from '@/lib/constants/template-wording';
import { getThemeRuntime } from '@/lib/constants/profile-theme';
import type {
  BuilderBlock,
  ProfileBuilderState,
} from '@/lib/types/profile-builder';
import { cn } from '@/lib/utils/cn';
import { formatProfileSummary } from '@/lib/utils/profile-format';

export type SportProfileTemplateId =
  | 'momentum'
  | 'impact'
  | 'obsidian'
  | 'midnight'
  | 'pulse'
  | 'evergreen'
  | 'horizon';

type SportTemplateConfig = {
  icon: PhosphorIcon;
};

type SportVisual = {
  accent: string;
  accentText: string;
  hero: string;
  heroText: string;
  heroMuted: string;
  canvas: string;
  surface: string;
  text: string;
  mutedText: string;
};

const sportTemplateConfigs: Record<
  SportProfileTemplateId,
  SportTemplateConfig
> = {
  momentum: {
    icon: Gauge,
  },
  impact: {
    icon: Shield,
  },
  obsidian: {
    icon: Lightning,
  },
  midnight: {
    icon: Barbell,
  },
  pulse: {
    icon: Timer,
  },
  evergreen: {
    icon: Trophy,
  },
  horizon: {
    icon: Bicycle,
  },
};

export function isSportProfileTemplateId(
  value: string,
): value is SportProfileTemplateId {
  return value in sportTemplateConfigs;
}

function getContentBlocks(builder: ProfileBuilderState) {
  const galleryItems = builder.galleryItems.filter((item) => item.isEnabled);
  const achievements = builder.achievements.filter((item) => item.isEnabled);
  const activities = builder.activities.filter((item) => item.isEnabled);
  const contentBlocks = builder.blocks
    .filter(
      (block) =>
        block.isEnabled &&
        [
          'gallery',
          'achievements',
          'activities',
          'sponsors',
          'media',
          'offer',
          'link',
        ].includes(block.type),
    )
    .map((block) => ({ ...block }));

  const ensureBlock = (type: string, title: string) => {
    if (!contentBlocks.some((block) => block.type === type)) {
      contentBlocks.push({
        id: null,
        analyticsKey: '',
        type,
        title,
        content: {},
        sortOrder: contentBlocks.length + 2,
        isEnabled: true,
      });
    }
  };

  if (galleryItems.length) ensureBlock('gallery', 'Gallery');
  if (achievements.length) ensureBlock('achievements', 'Achievements');
  if (activities.length) ensureBlock('activities', 'Activities');

  return contentBlocks;
}

function SportContentBlock({
  block,
  blockKey,
  builder,
  visual,
  text,
}: {
  block: BuilderBlock;
  blockKey: string | number;
  builder: ProfileBuilderState;
  visual: SportVisual;
  text: TemplateWording;
}) {
  const theme = getThemeRuntime(builder.profile.theme);
  const galleryItems = builder.galleryItems.filter(
    (item) => item.isEnabled && item.imageUrl,
  );
  const achievements = builder.achievements.filter((item) => item.isEnabled);
  const activities = builder.activities.filter((item) => item.isEnabled);

  if (block.type === 'media') {
    return <MediaBlock key={blockKey} block={block} builder={builder} />;
  }

  if (block.type === 'sponsors') {
    return <SponsorsPartnershipsBlock key={blockKey} builder={builder} />;
  }

  if (block.type === 'offer') {
    return <OfferBlock key={blockKey} block={block} builder={builder} />;
  }

  if (block.type === 'link') {
    return <LinkBlock key={blockKey} block={block} builder={builder} />;
  }

  if (block.type === 'gallery') {
    return galleryItems.length ? (
      <section
        key={blockKey}
        className="col-span-full p-4"
        style={{ backgroundColor: visual.surface, ...theme.blockStyle }}
      >
        {text.galleryLabel ? (
          <div className="mb-3 flex items-center gap-2">
            <Flag className="h-4 w-4" style={{ color: visual.accent }} />
            <h2 className="text-sm font-black tracking-[0.18em] uppercase">
              {text.galleryLabel}
            </h2>
          </div>
        ) : null}
        <div
          className={cn(
            'gap-2',
            theme.galleryLayout === 'carousel'
              ? 'flex snap-x overflow-x-auto'
              : 'grid grid-cols-2 sm:grid-cols-3',
            theme.galleryLayout === 'editorial' && 'sm:grid-cols-2',
          )}
        >
          {galleryItems.map((item, index) => (
            <div
              key={`${item.imageUrl}-${index}`}
              className={cn(
                'relative aspect-square overflow-hidden bg-slate-200',
                theme.radiusClass,
                theme.galleryLayout === 'carousel' &&
                  'w-52 shrink-0 snap-center',
              )}
            >
              <Image
                alt={item.altText || item.caption || ''}
                className="object-cover"
                fill
                sizes={
                  theme.galleryLayout === 'carousel'
                    ? '208px'
                    : '(max-width: 640px) 50vw, 320px'
                }
                src={item.imageUrl}
              />
            </div>
          ))}
        </div>
      </section>
    ) : null;
  }

  if (block.type === 'achievements') {
    return achievements.length ? (
      <section
        key={blockKey}
        className={cn(theme.radiusClass, 'border p-5')}
        style={{
          backgroundColor: visual.surface,
          color: visual.text,
          ...theme.blockStyle,
        }}
      >
        {text.achievementsLabel ? (
          <div className="flex items-center gap-2">
            <Medal className="h-4 w-4" style={{ color: visual.accent }} />
            <h2 className="text-sm font-black tracking-[0.16em] uppercase">
              {text.achievementsLabel}
            </h2>
          </div>
        ) : null}
        <div className={cn('space-y-4', text.achievementsLabel && 'mt-4')}>
          {achievements.map((item) => (
            <div key={`${item.title}-${item.sortOrder}`}>
              <p className="font-bold">{item.title}</p>
              {item.description ? (
                <p
                  className="mt-1 text-sm leading-6"
                  style={{ color: visual.mutedText }}
                >
                  {item.description}
                </p>
              ) : null}
              {item.dateLabel ? (
                <p className="mt-1 text-xs opacity-60">{item.dateLabel}</p>
              ) : null}
            </div>
          ))}
        </div>
      </section>
    ) : null;
  }

  return activities.length ? (
    <section
      key={blockKey}
      className={cn(theme.radiusClass, 'border p-5')}
      style={{
        backgroundColor: visual.hero,
        color: visual.heroText,
        ...theme.blockStyle,
      }}
    >
      {text.activityLabel ? (
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4" style={{ color: visual.accent }} />
          <h2 className="text-sm font-black tracking-[0.16em] uppercase">
            {text.activityLabel}
          </h2>
        </div>
      ) : null}
      <div className={cn('space-y-4', text.activityLabel && 'mt-4')}>
        {activities.map((item) => (
          <div key={`${item.title}-${item.sortOrder}`}>
            <p className="text-lg font-bold">{item.title}</p>
            {item.description || item.dateLabel ? (
              <p className="mt-1 text-sm" style={{ color: visual.heroMuted }}>
                {[item.description, item.dateLabel].filter(Boolean).join(' · ')}
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  ) : null;
}

export function SportProfileTemplate({
  builder,
  templateId,
  variant,
}: {
  builder: ProfileBuilderState;
  templateId: SportProfileTemplateId;
  variant: ProfileTemplateVariant;
}) {
  const config = sportTemplateConfigs[templateId];
  const text = resolveTemplateWording(
    builder.profile.theme,
    builder.profile.sports[0],
    templateId,
  );
  const theme = getThemeRuntime(builder.profile.theme);
  const goals = builder.goals.filter((goal) => goal.isEnabled);
  const primaryGoal = goals[0];
  const secondaryGoals = goals.slice(1);
  const socialLinks = builder.socialLinks.filter((link) => link.isEnabled);
  const contentBlocks = getContentBlocks(builder);
  const profileSummary =
    formatProfileSummary({ bio: builder.profile.bio }) ||
    `${builder.profile.displayName} is building the next chapter.`;
  const goalTitle = primaryGoal?.title || 'The next objective starts here';
  const goalDescription =
    primaryGoal?.description || 'Training with intent. Competing with purpose.';
  const goalTarget = primaryGoal?.targetLabel || 'Target in progress';
  const PrimaryGoalCard = primaryGoal?.url ? 'a' : 'div';
  const isPreview = variant !== 'full';
  const isMobilePreview = variant === 'mobile-preview';
  const visual: SportVisual = {
    canvas: theme.palette.background,
    hero: theme.coverColor,
    heroText: theme.palette.headerText,
    heroMuted: theme.palette.mutedHeaderText,
    accent: theme.palette.accent,
    accentText: theme.palette.accentText,
    surface: theme.palette.surface,
    text: theme.palette.text,
    mutedText: theme.palette.description,
  };
  const sportBuilder: ProfileBuilderState = {
    ...builder,
    profile: {
      ...builder.profile,
      theme: {
        ...builder.profile.theme,
        colorPreset: 'custom',
        customColors: {
          background: visual.canvas,
          surface: visual.surface,
          foreground: visual.text,
          accent: visual.accent,
          social: visual.surface,
          headerText: visual.heroText,
          headerMutedText: visual.heroMuted,
          blockTitle: visual.text,
          description: visual.mutedText,
          accentText: visual.accentText,
          socialText: visual.text,
        },
      },
    },
  };

  return (
    <main
      className={cn(
        isPreview ? 'h-full overflow-y-auto overscroll-contain' : 'min-h-dvh',
      )}
      style={{
        backgroundColor: visual.canvas,
        color: visual.text,
        fontFamily: theme.fontFamilies.body,
      }}
    >
      <ProfileHeader
        badgeIcon={config.icon}
        builder={builder}
        description={goalDescription}
        target={goalTarget}
        targetDisplay={primaryGoal?.dateDisplay}
        title={goalTitle}
        targetKey={primaryGoal?.analyticsKey}
        url={primaryGoal?.url}
        variant={variant}
        wording={text}
      />

      <section
        className={cn(
          'mx-auto max-w-6xl',
          'px-5 py-8',
          !isMobilePreview && 'sm:px-8 lg:px-12',
        )}
      >
        <div className="grid" style={{ gap: `${theme.blockGap}px` }}>
          <div
            className={cn(theme.radiusClass, 'border p-5 sm:p-6')}
            style={{
              backgroundColor: visual.surface,
              color: visual.text,
              ...theme.blockStyle,
            }}
          >
            {text.profileLabel ? (
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4" style={{ color: visual.accent }} />
                <p className="text-xs font-black tracking-[0.2em] uppercase">
                  {text.profileLabel}
                </p>
              </div>
            ) : null}
            <p
              className={cn(
                'leading-7 whitespace-pre-line',
                text.profileLabel && 'mt-4',
              )}
              style={{ color: visual.mutedText }}
            >
              {profileSummary}
            </p>
            {builder.profile.location ? (
              <p className="mt-4 flex items-center gap-2 text-xs font-semibold opacity-65">
                <MapPin className="h-3.5 w-3.5" />
                {builder.profile.location}
              </p>
            ) : null}
            {builder.profile.sports.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {builder.profile.sports.map((sport) => (
                  <span
                    key={sport}
                    className="rounded-full px-3 py-1.5 text-xs font-bold"
                    style={{
                      backgroundColor: visual.accent,
                      color: visual.accentText,
                    }}
                  >
                    {sport}
                  </span>
                ))}
              </div>
            ) : null}
            {socialLinks.length ? (
              <div className="mt-5 flex flex-wrap gap-2">
                {socialLinks.map((link, index) => (
                  <a
                    data-analytics-event="social_click"
                    data-analytics-target-key={link.analyticsKey}
                    data-analytics-target-type="social"
                    key={link.id ?? `social-${link.sortOrder}-${index}`}
                    aria-label={link.label || link.platform}
                    className="flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-bold transition hover:-translate-y-0.5"
                    href={getSocialLinkHref(link.platform, link.url)}
                    rel={
                      link.platform === 'email' || link.platform === 'phone'
                        ? undefined
                        : 'noreferrer'
                    }
                    style={{
                      borderColor: `color-mix(in srgb, ${visual.accent} 40%, transparent)`,
                    }}
                    target={
                      link.platform === 'email' || link.platform === 'phone'
                        ? undefined
                        : '_blank'
                    }
                  >
                    <SocialPlatformIcon platform={link.platform} />
                    {link.label ? <span>{link.label}</span> : null}
                    <ArrowUpRight className="h-3 w-3 opacity-50" />
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          <PrimaryGoalCard
            data-analytics-event={primaryGoal?.url ? 'goal_click' : undefined}
            data-analytics-target-key={
              primaryGoal?.url ? primaryGoal.analyticsKey : undefined
            }
            data-analytics-target-type={primaryGoal?.url ? 'goal' : undefined}
            className={cn(
              theme.radiusClass,
              'relative overflow-hidden p-5 sm:p-6',
            )}
            {...(primaryGoal?.url
              ? {
                  href: primaryGoal.url,
                  rel: 'noreferrer',
                  target: '_blank',
                }
              : {})}
            style={{
              backgroundColor: visual.accent,
              color: visual.accentText,
              ...theme.blockStyle,
            }}
          >
            <ProfileDecorativeIcon
              className="absolute -right-5 -bottom-5 h-36 w-36 opacity-10"
              fallback={config.icon}
              iconId={theme.decorativeIcon}
            />
            {text.targetLabel ? (
              <p className="text-xs font-black tracking-[0.2em] uppercase opacity-65">
                {text.targetLabel}
              </p>
            ) : null}
            <p
              className={cn(
                'relative text-2xl leading-tight font-black uppercase',
                text.targetLabel && 'mt-4',
              )}
            >
              <span>{goalTitle}</span>
              {primaryGoal?.url ? (
                <ArrowUpRight className="ml-1 inline h-5 w-5" />
              ) : null}
            </p>
            <p className="relative mt-5 flex items-center gap-2 text-sm font-bold">
              <GoalDateIcon
                className="h-4 w-4"
                display={primaryGoal?.dateDisplay ?? 'date'}
              />
              {goalTarget}
            </p>
          </PrimaryGoalCard>
        </div>

        {secondaryGoals.length ? (
          <div
            className="grid"
            style={{
              gap: `${theme.blockGap}px`,
              marginTop: `${theme.blockGap}px`,
            }}
          >
            {secondaryGoals.map((goal) => {
              const GoalCard = goal.url ? 'a' : 'div';

              return (
                <GoalCard
                  data-analytics-event={goal.url ? 'goal_click' : undefined}
                  data-analytics-target-key={
                    goal.url ? goal.analyticsKey : undefined
                  }
                  data-analytics-target-type={goal.url ? 'goal' : undefined}
                  key={`${goal.title}-${goal.sortOrder}`}
                  className={cn(theme.radiusClass, 'border p-5')}
                  {...(goal.url
                    ? { href: goal.url, rel: 'noreferrer', target: '_blank' }
                    : {})}
                  style={{
                    backgroundColor: visual.surface,
                    color: visual.text,
                    ...theme.blockStyle,
                  }}
                >
                  {text.secondaryGoalLabel ? (
                    <p className="text-xs font-black tracking-[0.16em] uppercase opacity-50">
                      {text.secondaryGoalLabel}
                    </p>
                  ) : null}
                  <p
                    className={cn(
                      'text-lg font-bold',
                      text.secondaryGoalLabel && 'mt-3',
                    )}
                  >
                    <span>{goal.title}</span>
                    {goal.url ? (
                      <ArrowUpRight className="ml-1 inline h-4 w-4" />
                    ) : null}
                  </p>
                  {goal.description ? (
                    <p className="mt-2 text-sm leading-6 opacity-70">
                      {goal.description}
                    </p>
                  ) : null}
                  <GoalDateBadge
                    builder={builder}
                    className="mt-4"
                    display={goal.dateDisplay}
                    label={goal.targetLabel}
                  />
                </GoalCard>
              );
            })}
          </div>
        ) : null}

        <div
          className="grid"
          style={{
            gap: `${theme.blockGap}px`,
            marginTop: `${theme.blockGap}px`,
          }}
        >
          {contentBlocks.map((block, index) => (
            <SportContentBlock
              key={block.id ?? `${block.type}-${block.sortOrder}-${index}`}
              block={block}
              blockKey={block.id ?? `${block.type}-${block.sortOrder}-${index}`}
              builder={sportBuilder}
              visual={visual}
              text={text}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
