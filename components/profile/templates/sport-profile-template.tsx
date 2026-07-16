import {
  Activity,
  ArrowUpRight,
  Bike,
  Dumbbell,
  Flag,
  Gauge,
  MapPin,
  Medal,
  Shield,
  Target,
  Timer,
  Trophy,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { MediaBlock } from '@/components/profile/media-block';
import { OfferBlock } from '@/components/profile/offer-block';
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
  | 'sport_running'
  | 'sport_boxing'
  | 'sport_mma'
  | 'sport_strength'
  | 'sport_hyrox'
  | 'sport_football'
  | 'sport_cycling';

type SportFamily = 'endurance' | 'fight' | 'power' | 'team';

type SportTemplateConfig = {
  id: SportProfileTemplateId;
  family: SportFamily;
  icon: LucideIcon;
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
  pattern: string;
};

const sportTemplateConfigs: Record<
  SportProfileTemplateId,
  SportTemplateConfig
> = {
  sport_running: {
    id: 'sport_running',
    family: 'endurance',
    icon: Gauge,
  },
  sport_boxing: {
    id: 'sport_boxing',
    family: 'fight',
    icon: Shield,
  },
  sport_mma: {
    id: 'sport_mma',
    family: 'fight',
    icon: Zap,
  },
  sport_strength: {
    id: 'sport_strength',
    family: 'power',
    icon: Dumbbell,
  },
  sport_hyrox: {
    id: 'sport_hyrox',
    family: 'power',
    icon: Timer,
  },
  sport_football: {
    id: 'sport_football',
    family: 'team',
    icon: Trophy,
  },
  sport_cycling: {
    id: 'sport_cycling',
    family: 'endurance',
    icon: Bike,
  },
};

function getSportPattern(family: SportFamily, accent: string) {
  const line = `color-mix(in srgb, ${accent} 20%, transparent)`;

  if (family === 'fight') {
    return `repeating-linear-gradient(0deg, transparent 0 62px, ${line} 62px 65px)`;
  }

  if (family === 'power') {
    return `linear-gradient(${line} 1px, transparent 1px), linear-gradient(90deg, ${line} 1px, transparent 1px)`;
  }

  if (family === 'team') {
    return `linear-gradient(90deg, transparent 49.7%, ${line} 49.7% 50.3%, transparent 50.3%), radial-gradient(circle at 50% 50%, transparent 0 70px, ${line} 71px 73px, transparent 74px)`;
  }

  return `repeating-linear-gradient(112deg, transparent 0 48px, ${line} 48px 50px)`;
}

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
        ].includes(block.type),
    )
    .map((block) => ({ ...block }));

  const ensureBlock = (type: string, title: string) => {
    if (!contentBlocks.some((block) => block.type === type)) {
      contentBlocks.push({
        id: null,
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

function AthleteAvatar({
  avatarUrl,
  displayName,
  className,
}: {
  avatarUrl: string;
  displayName: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/15 bg-cover bg-center font-black text-white uppercase',
        className,
      )}
      style={avatarUrl ? { backgroundImage: `url('${avatarUrl}')` } : undefined}
    >
      {!avatarUrl ? displayName.slice(0, 2) : null}
    </div>
  );
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

  if (block.type === 'gallery') {
    return galleryItems.length ? (
      <section key={blockKey} className="col-span-full">
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
                'aspect-square bg-slate-200 bg-cover bg-center',
                theme.radiusClass,
                theme.galleryLayout === 'carousel' &&
                  'w-52 shrink-0 snap-center',
              )}
              style={{ backgroundImage: `url('${item.imageUrl}')` }}
            />
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
          borderColor: `color-mix(in srgb, ${visual.accent} 34%, transparent)`,
          color: visual.text,
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
        borderColor: visual.hero,
        color: visual.heroText,
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
  const SportIcon = config.icon;
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
    pattern: getSportPattern(config.family, theme.palette.accent),
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
  const coverStyle =
    theme.coverType === 'image' && builder.profile.coverUrl
      ? {
          backgroundImage: `linear-gradient(90deg, ${visual.hero} 0%, color-mix(in srgb, ${visual.hero} 88%, transparent) 48%, color-mix(in srgb, ${visual.hero} 35%, transparent) 100%), url('${builder.profile.coverUrl}')`,
        }
      : theme.coverType === 'gradient'
        ? {
            backgroundImage: `linear-gradient(135deg, ${theme.coverGradientFrom}, ${theme.coverGradientTo})`,
          }
        : { backgroundImage: visual.pattern };
  const familyLayout =
    config.family === 'fight'
      ? 'lg:grid-cols-[0.85fr_1.15fr]'
      : config.family === 'team'
        ? 'lg:grid-cols-[1fr_1fr]'
        : 'lg:grid-cols-[1.15fr_0.85fr]';

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
      <section
        className={cn(
          'relative overflow-hidden bg-cover bg-center',
          isPreview ? 'px-4 py-5' : 'px-5 py-6 sm:px-8 lg:px-12',
        )}
        style={{ ...coverStyle, backgroundColor: visual.hero }}
      >
        <div
          className="absolute inset-0 opacity-60"
          style={{ backgroundImage: visual.pattern }}
        />
        <div
          className="relative mx-auto max-w-6xl"
          style={{ color: visual.heroText }}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AthleteAvatar
                avatarUrl={builder.profile.avatarUrl}
                className="h-11 w-11 text-xs"
                displayName={builder.profile.displayName}
              />
              <div>
                <p className="text-sm font-bold">
                  {builder.profile.displayName}
                </p>
                {text.discipline ? (
                  <p
                    className="text-[10px] font-bold tracking-[0.2em] uppercase"
                    style={{ color: visual.heroMuted }}
                  >
                    {text.discipline}
                  </p>
                ) : null}
              </div>
            </div>
            {text.badge ? (
              <span
                className="flex items-center gap-2 rounded-full px-3 py-2 text-[10px] font-black tracking-[0.18em] uppercase"
                style={{
                  backgroundColor: visual.accent,
                  color: visual.accentText,
                }}
              >
                <SportIcon className="h-3.5 w-3.5" />
                {text.badge}
              </span>
            ) : null}
          </div>

          <div
            className={cn(
              'mt-10 grid items-end gap-8',
              !isMobilePreview && familyLayout,
              isPreview ? 'min-h-[320px]' : 'min-h-[520px]',
            )}
          >
            <div className={cn(config.family === 'fight' && 'lg:order-2')}>
              {text.eyebrow ? (
                <p
                  className="text-xs font-black tracking-[0.28em] uppercase"
                  style={{ color: visual.accent }}
                >
                  {text.eyebrow}
                </p>
              ) : null}
              <h1
                className={cn(
                  'max-w-4xl leading-[0.94] font-black tracking-[-0.05em] uppercase',
                  text.eyebrow && 'mt-4',
                  isMobilePreview
                    ? 'text-4xl'
                    : isPreview
                      ? 'text-5xl'
                      : 'text-5xl sm:text-7xl',
                )}
                style={{ fontFamily: theme.fontFamilies.heading }}
              >
                {goalTitle}
              </h1>
              <p
                className="mt-5 max-w-xl text-sm leading-6 sm:text-base"
                style={{ color: visual.heroMuted }}
              >
                {goalDescription}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <span
                  className="rounded-full px-4 py-2 text-xs font-bold"
                  style={{
                    backgroundColor: visual.accent,
                    color: visual.accentText,
                  }}
                >
                  {goalTarget}
                </span>
                {builder.profile.sports.slice(0, 2).map((sport) => (
                  <span
                    key={sport}
                    className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold"
                  >
                    {sport}
                  </span>
                ))}
              </div>
            </div>

            <div
              className={cn(
                'relative hidden min-h-64 overflow-hidden border border-white/15 bg-white/5 lg:block',
                theme.radiusClass,
                config.family === 'fight' && 'lg:order-1',
              )}
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={
                  theme.coverType === 'image' && builder.profile.coverUrl
                    ? { backgroundImage: `url('${builder.profile.coverUrl}')` }
                    : theme.coverType === 'gradient'
                      ? {
                          backgroundImage: `linear-gradient(135deg, ${theme.coverGradientFrom}, ${theme.coverGradientTo})`,
                        }
                      : { backgroundImage: visual.pattern }
                }
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              {text.badge ? (
                <p className="absolute right-5 bottom-3 text-[clamp(4rem,11vw,9rem)] leading-none font-black tracking-[-0.08em] text-white/15 uppercase">
                  {text.badge}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section
        className={cn(
          'mx-auto max-w-6xl',
          isPreview ? 'px-4 py-5' : 'px-5 py-8 sm:px-8 lg:px-12',
        )}
      >
        <div className="grid gap-4">
          <div
            className={cn(theme.radiusClass, 'border p-5 sm:p-6')}
            style={{
              backgroundColor: visual.surface,
              borderColor: `color-mix(in srgb, ${visual.accent} 27%, transparent)`,
              color: visual.text,
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
            {socialLinks.length ? (
              <div className="mt-5 flex flex-wrap gap-2">
                {socialLinks.map((link) => (
                  <a
                    key={`${link.platform}-${link.url}`}
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

          <div
            className={cn(
              theme.radiusClass,
              'relative overflow-hidden p-5 sm:p-6',
            )}
            style={{
              backgroundColor: visual.accent,
              color: visual.accentText,
            }}
          >
            <SportIcon className="absolute -right-5 -bottom-5 h-36 w-36 opacity-10" />
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
              {goalTitle}
            </p>
            <p className="relative mt-5 flex items-center gap-2 text-sm font-bold">
              <Timer className="h-4 w-4" />
              {goalTarget}
            </p>
          </div>
        </div>

        {secondaryGoals.length ? (
          <div className="mt-4 grid gap-4">
            {secondaryGoals.map((goal) => (
              <div
                key={`${goal.title}-${goal.sortOrder}`}
                className={cn(theme.radiusClass, 'border p-5')}
                style={{
                  backgroundColor: visual.surface,
                  borderColor: `color-mix(in srgb, ${visual.accent} 27%, transparent)`,
                  color: visual.text,
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
                  {goal.title}
                </p>
                {goal.description ? (
                  <p className="mt-2 text-sm leading-6 opacity-70">
                    {goal.description}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        ) : null}

        <div className="mt-4 grid gap-4">
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
