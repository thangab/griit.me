import {
  ArrowUpRightIcon as ArrowUpRight,
  MapPinIcon as MapPin,
} from '@phosphor-icons/react/ssr';
import Image from 'next/image';
import { cn } from '@/lib/utils/cn';
import { formatProfileSummary } from '@/lib/utils/profile-format';
import type { ProfileBuilderState } from '@/lib/types/profile-builder';
import { getThemeRuntime } from '@/lib/constants/profile-theme';
import { SocialPlatformIcon } from '@/components/profile/social-platform-icon';
import { getSocialLinkHref } from '@/lib/constants/social-platforms';
import { SponsorsPartnershipsBlock } from '@/components/profile/sponsors-partnerships-block';
import { MediaBlock } from '@/components/profile/media-block';
import { OfferBlock } from '@/components/profile/offer-block';
import { LinkBlock } from '@/components/profile/link-block';
import { ProfileHeader } from '@/components/profile/profile-header';
import { GoalDateBadge } from '@/components/profile/goal-date-badge';
import { resolveTemplateWording } from '@/lib/constants/template-wording';

export type ProfileTemplateVariant =
  'full' | 'mobile-preview' | 'desktop-preview';

type GoalSpotlightTemplateProps = {
  builder: ProfileBuilderState;
  variant: ProfileTemplateVariant;
};

export function GoalSpotlightTemplate({
  builder,
  variant,
}: GoalSpotlightTemplateProps) {
  const { profile } = builder;
  const goals = builder.goals.filter((goal) => goal.isEnabled);
  const primaryGoal = goals[0];
  const secondaryGoals = goals.slice(1);
  const galleryItems = builder.galleryItems.filter((item) => item.isEnabled);
  const socialLinks = builder.socialLinks.filter((link) => link.isEnabled);
  const achievements = builder.achievements.filter((item) => item.isEnabled);
  const activities = builder.activities.filter((item) => item.isEnabled);
  const goalTitle = primaryGoal?.title ?? 'Next goal coming soon';
  const goalDescription =
    primaryGoal?.description ?? 'This athlete is preparing the next objective.';
  const goalTarget = primaryGoal?.targetLabel ?? 'No target date';
  const profileSummary =
    formatProfileSummary({
      bio: profile.bio,
    }) || 'More context coming soon.';
  const sports = profile.sports;
  const isPreview = variant !== 'full';
  const isMobilePreview = variant === 'mobile-preview';
  const theme = getThemeRuntime(profile.theme);
  const wording = resolveTemplateWording(
    profile.theme,
    profile.sports[0],
    'spotlight',
  );
  const contentBlocks = builder.blocks
    .filter((block) =>
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
    .filter((block) => block.isEnabled);
  const ensureContentBlock = (type: string, title: string) => {
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
  if (galleryItems.length) ensureContentBlock('gallery', 'Image gallery');
  if (achievements.length) ensureContentBlock('achievements', 'Achievements');
  if (activities.length) ensureContentBlock('activities', 'Activities');

  return (
    <main
      className={cn(
        '',
        isPreview ? 'h-full overflow-y-auto overscroll-contain' : 'min-h-dvh',
      )}
      style={{
        backgroundColor: theme.palette.background,
        color: theme.palette.text,
        fontFamily: theme.fontFamilies.body,
      }}
    >
      <ProfileHeader
        builder={builder}
        description={goalDescription}
        target={goalTarget}
        targetDisplay={primaryGoal?.dateDisplay}
        title={goalTitle}
        targetKey={primaryGoal?.analyticsKey}
        url={primaryGoal?.url}
        variant={variant}
        wording={wording}
      />

      <section
        className={cn(
          'mx-auto',
          'max-w-6xl px-5 py-8',
          !isMobilePreview && 'sm:px-8 lg:px-12',
        )}
      >
        <div className="flex flex-col" style={{ gap: `${theme.blockGap}px` }}>
          <div
            className={cn(theme.radiusClass, 'p-6 shadow-sm')}
            style={{
              backgroundColor: theme.palette.surface,
              color: theme.palette.text,
              ...theme.blockStyle,
            }}
          >
            {wording.profileLabel ? (
              <p
                className="text-sm font-semibold"
                style={{ color: theme.palette.blockTitle }}
              >
                {wording.profileLabel}
              </p>
            ) : null}
            <p
              className={cn(
                'leading-7 whitespace-pre-line',
                wording.profileLabel && 'mt-3',
              )}
              style={{ color: theme.palette.mutedText }}
            >
              {profileSummary}
            </p>
            {profile.location ? (
              <p
                className="mt-4 flex items-center gap-2 text-xs font-medium"
                style={{ color: theme.palette.description }}
              >
                <MapPin className="h-3.5 w-3.5" />
                {profile.location}
              </p>
            ) : null}
            {sports.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {sports.map((sport) => (
                  <span
                    key={sport}
                    className="rounded-full px-3 py-1.5 text-xs font-medium"
                    style={{
                      backgroundColor: theme.palette.accent,
                      color: theme.palette.accentText,
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
                    className="flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition"
                    style={{
                      backgroundColor: theme.palette.social,
                      color: theme.palette.socialText,
                    }}
                    href={getSocialLinkHref(link.platform, link.url)}
                    rel={
                      link.platform === 'email' || link.platform === 'phone'
                        ? undefined
                        : 'noreferrer'
                    }
                    target={
                      link.platform === 'email' || link.platform === 'phone'
                        ? undefined
                        : '_blank'
                    }
                  >
                    <SocialPlatformIcon platform={link.platform} />
                    {link.label ? <span>{link.label}</span> : null}
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          {secondaryGoals.length ? (
            <div className="grid" style={{ gap: `${theme.blockGap}px` }}>
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
                    className={cn(theme.radiusClass, 'p-5 shadow-sm')}
                    {...(goal.url
                      ? { href: goal.url, rel: 'noreferrer', target: '_blank' }
                      : {})}
                    style={{
                      backgroundColor: theme.palette.surface,
                      color: theme.palette.text,
                      ...theme.blockStyle,
                    }}
                  >
                    {wording.secondaryGoalLabel ? (
                      <p
                        className="text-xs font-semibold tracking-[0.2em] uppercase"
                        style={{ color: theme.palette.description }}
                      >
                        {wording.secondaryGoalLabel}
                      </p>
                    ) : null}
                    <p
                      className={cn(
                        'text-lg font-semibold',
                        wording.secondaryGoalLabel && 'mt-3',
                      )}
                      style={{ color: theme.palette.blockTitle }}
                    >
                      <span>{goal.title}</span>
                      {goal.url ? (
                        <ArrowUpRight className="ml-1 inline h-4 w-4" />
                      ) : null}
                    </p>
                    <p
                      className="mt-2 text-sm leading-6"
                      style={{ color: theme.palette.description }}
                    >
                      {goal.description}
                    </p>
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

          {contentBlocks.map((block, blockIndex) => {
            const { type } = block;
            const blockKey =
              block.id ?? `${type}-${block.sortOrder}-${blockIndex}`;

            if (type === 'gallery') {
              return galleryItems.length ? (
                <section
                  key={blockKey}
                  className="p-4"
                  style={{
                    backgroundColor: theme.palette.surface,
                    ...theme.blockStyle,
                  }}
                >
                  {wording.galleryLabel ? (
                    <p
                      className="mb-3 text-sm font-semibold"
                      style={{ color: theme.palette.blockTitle }}
                    >
                      {wording.galleryLabel}
                    </p>
                  ) : null}
                  <div
                    className={cn(
                      'gap-2',
                      theme.galleryLayout === 'carousel'
                        ? 'flex snap-x overflow-x-auto'
                        : 'grid grid-cols-3',
                      theme.galleryLayout === 'editorial' && 'grid-cols-2',
                    )}
                  >
                    {galleryItems.map((item, index) => (
                      <div
                        key={`${item.imageUrl}-${index}`}
                        className={cn(
                          'relative aspect-square overflow-hidden bg-slate-200',
                          theme.galleryLayout === 'carousel' &&
                            'w-52 shrink-0 snap-center',
                        )}
                        style={theme.blockInnerStyle}
                      >
                        <Image
                          alt={item.altText || item.caption || ''}
                          className="object-cover"
                          fill
                          sizes={
                            theme.galleryLayout === 'carousel'
                              ? '208px'
                              : '(max-width: 640px) 33vw, 320px'
                          }
                          src={item.imageUrl}
                        />
                      </div>
                    ))}
                  </div>
                </section>
              ) : null;
            }

            if (type === 'achievements') {
              return achievements.length ? (
                <div
                  key={blockKey}
                  className={cn(theme.radiusClass, 'p-6 shadow-sm')}
                  style={{
                    backgroundColor: theme.palette.surface,
                    color: theme.palette.text,
                    ...theme.blockStyle,
                  }}
                >
                  {wording.achievementsLabel ? (
                    <p
                      className="text-sm font-semibold"
                      style={{ color: theme.palette.blockTitle }}
                    >
                      {wording.achievementsLabel}
                    </p>
                  ) : null}
                  {achievements.map((item) => (
                    <div
                      key={`${item.title}-${item.sortOrder}`}
                      className={wording.achievementsLabel ? 'mt-4' : undefined}
                    >
                      <p
                        className="font-semibold"
                        style={{ color: theme.palette.blockTitle }}
                      >
                        {item.title}
                      </p>
                      {item.description ? (
                        <p
                          className="mt-1 text-sm leading-6"
                          style={{ color: theme.palette.description }}
                        >
                          {item.description}
                        </p>
                      ) : null}
                      {item.dateLabel ? (
                        <p
                          className="mt-2 text-xs font-medium"
                          style={{ color: theme.palette.mutedDescription }}
                        >
                          {item.dateLabel}
                        </p>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : null;
            }

            if (type === 'sponsors') {
              return (
                <SponsorsPartnershipsBlock key={blockKey} builder={builder} />
              );
            }

            if (type === 'media') {
              return (
                <MediaBlock key={blockKey} block={block} builder={builder} />
              );
            }

            if (type === 'offer') {
              return (
                <OfferBlock key={blockKey} block={block} builder={builder} />
              );
            }

            if (type === 'link') {
              return (
                <LinkBlock key={blockKey} block={block} builder={builder} />
              );
            }

            return activities.length ? (
              <div
                key={blockKey}
                className={cn(theme.radiusClass, 'p-6 shadow-sm')}
                style={{
                  backgroundColor: theme.palette.surface,
                  color: theme.palette.text,
                  ...theme.blockStyle,
                }}
              >
                {wording.activityLabel ? (
                  <p
                    className="text-sm font-semibold"
                    style={{ color: theme.palette.blockTitle }}
                  >
                    {wording.activityLabel}
                  </p>
                ) : null}
                {activities.map((item) => (
                  <div
                    key={`${item.title}-${item.sortOrder}`}
                    className={wording.activityLabel ? 'mt-4' : undefined}
                  >
                    <p
                      className="font-semibold"
                      style={{ color: theme.palette.blockTitle }}
                    >
                      {item.title}
                    </p>
                    {item.description || item.dateLabel ? (
                      <p
                        className="mt-1 text-sm"
                        style={{ color: theme.palette.description }}
                      >
                        {[item.description, item.dateLabel]
                          .filter(Boolean)
                          .join(' · ')}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : null;
          })}
        </div>
      </section>
    </main>
  );
}
