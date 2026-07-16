import { cn } from '@/lib/utils/cn';
import { formatProfileSummary } from '@/lib/utils/profile-format';
import type { ProfileBuilderState } from '@/lib/types/profile-builder';
import type { ProfileTemplateVariant } from '@/components/profile/templates/goal-spotlight-template';
import { getThemeRuntime } from '@/lib/constants/profile-theme';
import { SocialPlatformIcon } from '@/components/profile/social-platform-icon';
import { getSocialLinkHref } from '@/lib/constants/social-platforms';
import { SponsorsPartnershipsBlock } from '@/components/profile/sponsors-partnerships-block';
import { MediaBlock } from '@/components/profile/media-block';
import { OfferBlock } from '@/components/profile/offer-block';
import { resolveTemplateWording } from '@/lib/constants/template-wording';

type EventPosterTemplateProps = {
  builder: ProfileBuilderState;
  variant: ProfileTemplateVariant;
};

export function EventPosterTemplate({
  builder,
  variant,
}: EventPosterTemplateProps) {
  const { profile } = builder;
  const goals = builder.goals.filter((goal) => goal.isEnabled);
  const primaryGoal = goals[0];
  const secondaryGoals = goals.slice(1);
  const galleryItems = builder.galleryItems.filter((item) => item.isEnabled);
  const socialLinks = builder.socialLinks.filter((link) => link.isEnabled);
  const achievements = builder.achievements.filter((item) => item.isEnabled);
  const activities = builder.activities.filter((item) => item.isEnabled);
  const isPreview = variant !== 'full';
  const goalTitle = primaryGoal?.title ?? 'Next event coming soon';
  const goalDescription =
    primaryGoal?.description ?? 'This athlete is preparing the next objective.';
  const goalTarget = primaryGoal?.targetLabel ?? 'No target date';
  const profileSummary =
    formatProfileSummary({
      bio: profile.bio,
    }) || 'More context coming soon.';
  const sports = profile.sports;
  const theme = getThemeRuntime(profile.theme);
  const wording = resolveTemplateWording(
    profile.theme,
    profile.sports[0],
    'event_poster',
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
      ].includes(block.type),
    )
    .filter((block) => block.isEnabled);
  const ensureContentBlock = (type: string, title: string) => {
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
  if (galleryItems.length) ensureContentBlock('gallery', 'Image gallery');
  if (achievements.length) ensureContentBlock('achievements', 'Achievements');
  if (activities.length) ensureContentBlock('activities', 'Activities');
  const coverBackgroundImage =
    theme.coverType === 'image'
      ? `linear-gradient(color-mix(in srgb, ${theme.coverColor} ${theme.overlayOpacity * 100}%, transparent), color-mix(in srgb, ${theme.coverColor} ${theme.overlayOpacity * 100}%, transparent)), url('${profile.coverUrl}')`
      : theme.coverType === 'gradient'
        ? `linear-gradient(135deg, ${theme.coverGradientFrom}, ${theme.coverGradientTo})`
        : undefined;

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
      <section
        className={cn(
          'mx-auto grid w-full max-w-6xl gap-6 px-5 py-6',
          isPreview ? 'min-h-full' : 'min-h-dvh sm:px-8 lg:px-12',
          'grid-cols-1',
        )}
      >
        <div
          className={cn(
            'flex flex-col justify-between gap-10 border p-6',
            theme.radiusClass,
          )}
          style={{
            backgroundColor: theme.palette.surface,
            borderColor: theme.palette.border,
            color: theme.palette.text,
          }}
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p
                className="text-sm font-semibold"
                style={{ color: theme.palette.blockTitle }}
              >
                {profile.displayName}
              </p>
              {wording.discipline ? (
                <p
                  className="mt-1 text-xs"
                  style={{ color: theme.palette.description }}
                >
                  {wording.discipline}
                </p>
              ) : null}
            </div>
            <div className="flex items-center gap-3">
              {wording.badge ? (
                <span className="text-xs font-bold tracking-[0.18em] uppercase">
                  {wording.badge}
                </span>
              ) : null}
              <div
                className="h-12 w-12 rounded-full bg-zinc-200 bg-cover bg-center"
                style={{ backgroundImage: `url('${profile.avatarUrl}')` }}
              />
            </div>
          </div>

          <div>
            {wording.eyebrow ? (
              <p className="text-xs font-bold tracking-[0.3em] uppercase">
                {wording.eyebrow}
              </p>
            ) : null}
            <h1
              className={cn(
                'text-5xl leading-none font-black tracking-tight sm:text-6xl',
                wording.eyebrow && 'mt-4',
              )}
              style={{
                color: theme.palette.blockTitle,
                fontFamily: theme.fontFamilies.heading,
              }}
            >
              {goalTitle}
            </h1>
            <p
              className="mt-6 max-w-xl text-base leading-7"
              style={{ color: theme.palette.mutedText }}
            >
              {goalDescription}
            </p>
          </div>

          <div>
            <div
              className="rounded-2xl p-4"
              style={{
                backgroundColor: theme.palette.accent,
                color: theme.palette.accentText,
              }}
            >
              {wording.targetLabel ? (
                <p
                  className="text-xs uppercase opacity-65"
                  style={{ color: theme.palette.accentText }}
                >
                  {wording.targetLabel}
                </p>
              ) : null}
              <p className={cn('font-semibold', wording.targetLabel && 'mt-2')}>
                {goalTarget}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          <div
            className={cn(
              'min-h-[320px] bg-zinc-800 bg-cover bg-center',
              theme.radiusClass,
            )}
            style={{
              backgroundColor:
                theme.coverType === 'color' ? theme.coverColor : undefined,
              backgroundImage: coverBackgroundImage,
            }}
          />
          <div
            className={cn(theme.radiusClass, 'border p-5')}
            style={{
              backgroundColor: theme.palette.surface,
              borderColor: theme.palette.border,
              color: theme.palette.text,
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
                'text-sm leading-6 whitespace-pre-line',
                wording.profileLabel && 'mt-3',
              )}
              style={{ color: theme.palette.mutedText }}
            >
              {profileSummary}
            </p>
            {sports.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {sports.map((sport) => (
                  <span
                    key={sport}
                    className="rounded-full px-3 py-1.5 text-xs font-semibold"
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
            <div className="mt-4 flex flex-wrap gap-2">
              {socialLinks.map((link) => (
                <a
                  key={`${link.platform}-${link.url}`}
                  aria-label={link.label || link.platform}
                  className="flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium"
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
          </div>
          {secondaryGoals.map((goal) => (
            <div
              key={`${goal.title}-${goal.sortOrder}`}
              className={cn(theme.radiusClass, 'border p-5')}
              style={{
                backgroundColor: theme.palette.surface,
                borderColor: theme.palette.border,
                color: theme.palette.text,
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
                  'font-semibold',
                  wording.secondaryGoalLabel && 'mt-3',
                )}
                style={{ color: theme.palette.blockTitle }}
              >
                {goal.title}
              </p>
              {goal.description ? (
                <p
                  className="mt-2 text-sm leading-6"
                  style={{ color: theme.palette.description }}
                >
                  {goal.description}
                </p>
              ) : null}
            </div>
          ))}
          {contentBlocks.map((block, blockIndex) => {
            const { type } = block;
            const blockKey =
              block.id ?? `${type}-${block.sortOrder}-${blockIndex}`;

            if (type === 'gallery') {
              return galleryItems.length ? (
                <section key={blockKey}>
                  {wording.galleryLabel ? (
                    <p
                      className="mb-3 text-xs font-semibold tracking-[0.2em] uppercase"
                      style={{ color: theme.palette.description }}
                    >
                      {wording.galleryLabel}
                    </p>
                  ) : null}
                  <div
                    className={cn(
                      'gap-2',
                      theme.galleryLayout === 'carousel'
                        ? 'flex overflow-x-auto'
                        : 'grid grid-cols-3',
                      theme.galleryLayout === 'editorial' && 'grid-cols-2',
                    )}
                  >
                    {galleryItems.map((item, index) => (
                      <div
                        key={`${item.imageUrl}-${index}`}
                        className={cn(
                          'aspect-square bg-zinc-800 bg-cover bg-center',
                          theme.radiusClass,
                          theme.galleryLayout === 'carousel' && 'w-52 shrink-0',
                        )}
                        style={{ backgroundImage: `url('${item.imageUrl}')` }}
                      />
                    ))}
                  </div>
                </section>
              ) : null;
            }

            if (type === 'achievements') {
              return (
                <div key={blockKey} className="contents">
                  {achievements.map((item) => (
                    <div
                      key={`${item.title}-${item.sortOrder}`}
                      className={cn(theme.radiusClass, 'border p-5')}
                      style={{
                        backgroundColor: theme.palette.surface,
                        borderColor: theme.palette.border,
                        color: theme.palette.text,
                      }}
                    >
                      {wording.achievementsLabel ? (
                        <p
                          className="text-xs font-semibold tracking-[0.2em] uppercase"
                          style={{ color: theme.palette.description }}
                        >
                          {wording.achievementsLabel}
                        </p>
                      ) : null}
                      <p
                        className={cn(
                          'font-semibold',
                          wording.achievementsLabel && 'mt-3',
                        )}
                        style={{ color: theme.palette.blockTitle }}
                      >
                        {item.title}
                      </p>
                      {item.description ? (
                        <p
                          className="mt-2 text-sm leading-6"
                          style={{ color: theme.palette.description }}
                        >
                          {item.description}
                        </p>
                      ) : null}
                      {item.dateLabel ? (
                        <p
                          className="mt-3 text-xs"
                          style={{ color: theme.palette.mutedDescription }}
                        >
                          {item.dateLabel}
                        </p>
                      ) : null}
                    </div>
                  ))}
                </div>
              );
            }

            if (type === 'sponsors') {
              return (
                <SponsorsPartnershipsBlock
                  key={blockKey}
                  builder={builder}
                  presentation="poster"
                />
              );
            }

            if (type === 'media') {
              return (
                <MediaBlock
                  key={blockKey}
                  block={block}
                  builder={builder}
                  presentation="poster"
                />
              );
            }

            if (type === 'offer') {
              return (
                <OfferBlock
                  key={blockKey}
                  block={block}
                  builder={builder}
                  presentation="poster"
                />
              );
            }

            return (
              <div key={blockKey} className="contents">
                {activities.map((item) => (
                  <div
                    key={`${item.title}-${item.sortOrder}`}
                    className={cn(theme.radiusClass, 'border p-5')}
                    style={{
                      backgroundColor: theme.palette.surface,
                      borderColor: theme.palette.border,
                      color: theme.palette.text,
                    }}
                  >
                    {wording.activityLabel ? (
                      <p
                        className="text-xs font-semibold tracking-[0.2em] uppercase"
                        style={{ color: theme.palette.description }}
                      >
                        {wording.activityLabel}
                      </p>
                    ) : null}
                    <p
                      className={cn(
                        'font-semibold',
                        wording.activityLabel && 'mt-3',
                      )}
                      style={{ color: theme.palette.blockTitle }}
                    >
                      {item.title}
                    </p>
                    {item.description || item.dateLabel ? (
                      <p
                        className="mt-2 text-sm"
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
            );
          })}
        </div>
      </section>
    </main>
  );
}
