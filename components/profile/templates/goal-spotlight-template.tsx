import { cn } from '@/lib/utils/cn';
import { formatProfileSummary } from '@/lib/utils/profile-format';
import type { ProfileBuilderState } from '@/lib/types/profile-builder';
import { getThemeRuntime } from '@/lib/constants/profile-theme';

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
  const isDesktopPreview = variant === 'desktop-preview';
  const theme = getThemeRuntime(profile.theme);
  const coverStyle = theme.coverType === 'image'
    ? { backgroundImage: `url('${profile.coverUrl}')` }
    : theme.coverType === 'gradient'
      ? { backgroundImage: `linear-gradient(135deg, ${theme.coverGradientFrom}, ${theme.coverGradientTo})` }
      : { backgroundColor: theme.coverColor };

  return (
    <main
      className={cn(
        '',
        isPreview ? 'h-full overflow-y-auto overscroll-contain' : 'min-h-dvh',
      )}
      style={{ backgroundColor: theme.palette.background, color: theme.palette.text, fontFamily: theme.fontFamilies.body }}
    >
      <section
        className={cn(
          'relative flex items-end overflow-hidden bg-slate-950 bg-cover bg-center',
          isPreview
            ? 'min-h-[360px] px-5 py-6'
            : 'min-h-[78dvh] px-5 py-8 sm:px-8 lg:px-12',
          isMobilePreview && 'min-h-[360px] px-4 py-5',
        )}
        style={{ ...coverStyle, color: theme.palette.headerText }}
      >
        {theme.coverType === 'image' ? (
          <div className="absolute inset-0 bg-slate-950" style={{ opacity: theme.overlayOpacity }} />
        ) : null}
        <div
          className={cn(
            'relative mx-auto flex w-full flex-col',
            isPreview ? 'max-w-4xl gap-7' : 'max-w-6xl gap-10',
          )}
        >
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'shrink-0 rounded-full border-2 border-white/80 bg-slate-200 bg-cover bg-center',
                isMobilePreview ? 'h-12 w-12' : 'h-14 w-14',
              )}
              style={{ backgroundImage: `url('${profile.avatarUrl}')` }}
            />
            <div>
              <p className="font-semibold">{profile.displayName}</p>
            </div>
          </div>

          <div className="max-w-4xl">
            <p className="text-xs font-semibold tracking-[0.28em] uppercase" style={{ color: theme.palette.mutedHeaderText }}>
              Next goal
            </p>
            <h1
              className={cn(
                'mt-4 max-w-4xl leading-[1.02] font-semibold',
                isMobilePreview
                  ? 'text-4xl'
                  : isPreview
                    ? 'text-5xl'
                    : 'text-5xl sm:text-6xl lg:text-7xl',
              )}
              style={{ fontFamily: theme.fontFamilies.heading }}
            >
              {goalTitle}
            </h1>
            <p
              className={cn(
                'mt-6 max-w-2xl leading-7',
                isPreview ? 'text-base' : 'text-base sm:text-lg',
              )}
              style={{ color: theme.palette.mutedHeaderText }}
            >
              {goalDescription}
            </p>
            <div className="mt-7 flex flex-wrap gap-2 text-sm font-medium">
              <span className="rounded-full px-4 py-2" style={{ backgroundColor: theme.palette.accent, color: theme.palette.accentText }}>
                {goalTarget}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section
        className={cn(
          'mx-auto grid gap-6',
          isPreview
            ? 'max-w-4xl px-4 py-5'
            : 'max-w-6xl px-5 py-8 sm:px-8 lg:grid-cols-[1fr_320px] lg:px-12',
          isDesktopPreview && 'grid-cols-[1fr_260px]',
        )}
      >
        <div className="space-y-6">
          <div className={cn(theme.radiusClass, 'p-6 shadow-sm')} style={{ backgroundColor: theme.palette.surface, color: theme.palette.text }}>
            <p className="text-sm font-semibold" style={{ color: theme.palette.blockTitle }}>Athlete context</p>
            <p className="mt-3 whitespace-pre-line leading-7" style={{ color: theme.palette.mutedText }}>{profileSummary}</p>
            {sports.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {sports.map((sport) => (
                  <span
                    key={sport}
                    className="rounded-full px-3 py-1.5 text-xs font-medium"
                    style={{ backgroundColor: theme.palette.accent, color: theme.palette.accentText }}
                  >
                    {sport}
                  </span>
                ))}
              </div>
            ) : null}
            {socialLinks.length ? (
              <div className="mt-5 flex flex-wrap gap-2">
                {socialLinks.map((link) => (
                  <a
                    key={`${link.platform}-${link.url}`}
                    className="rounded-full px-4 py-2 text-sm font-medium transition"
                    style={{ backgroundColor: theme.palette.social, color: theme.palette.socialText }}
                    href={link.url}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {link.label || link.platform}
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          {secondaryGoals.length ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {secondaryGoals.map((goal) => (
                <div
                  key={`${goal.title}-${goal.sortOrder}`}
                  className={cn(theme.radiusClass, 'p-5 shadow-sm')}
                  style={{ backgroundColor: theme.palette.surface, color: theme.palette.text }}
                >
                  <p className="text-xs font-semibold tracking-[0.2em] uppercase" style={{ color: theme.palette.description }}>
                    Also chasing
                  </p>
                  <p className="mt-3 text-lg font-semibold" style={{ color: theme.palette.blockTitle }}>{goal.title}</p>
                  <p className="mt-2 text-sm leading-6" style={{ color: theme.palette.description }}>
                    {goal.description}
                  </p>
                  <p className="mt-4 text-sm font-medium" style={{ color: theme.palette.mutedDescription }}>
                    {goal.targetLabel}
                  </p>
                </div>
              ))}
            </div>
          ) : null}

          {achievements.length ? (
            <div className={cn(theme.radiusClass, 'p-6 shadow-sm')} style={{ backgroundColor: theme.palette.surface, color: theme.palette.text }}>
              <p className="text-sm font-semibold" style={{ color: theme.palette.blockTitle }}>Achievements</p>
              {achievements.map((item) => (
                <div key={`${item.title}-${item.sortOrder}`} className="mt-4">
                  <p className="font-semibold" style={{ color: theme.palette.blockTitle }}>{item.title}</p>
                  {item.description ? (
                    <p className="mt-1 text-sm leading-6" style={{ color: theme.palette.description }}>
                      {item.description}
                    </p>
                  ) : null}
                  {item.dateLabel ? (
                    <p className="mt-2 text-xs font-medium" style={{ color: theme.palette.mutedDescription }}>
                      {item.dateLabel}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}

          {activities.length ? (
            <div className={cn(theme.radiusClass, 'p-6 shadow-sm')} style={{ backgroundColor: theme.palette.surface, color: theme.palette.text }}>
              <p className="text-sm font-semibold" style={{ color: theme.palette.blockTitle }}>Recent activities</p>
              {activities.map((item) => (
                <div key={`${item.title}-${item.sortOrder}`} className="mt-4">
                  <p className="font-semibold" style={{ color: theme.palette.blockTitle }}>{item.title}</p>
                  {item.description || item.dateLabel ? (
                    <p className="mt-1 text-sm" style={{ color: theme.palette.description }}>
                      {[item.description, item.dateLabel]
                        .filter(Boolean)
                        .join(' · ')}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {galleryItems.length ? (
          <div
            className={cn(
              'gap-2',
              theme.galleryLayout === 'carousel' ? 'flex snap-x overflow-x-auto' : 'grid grid-cols-3',
              theme.galleryLayout === 'editorial' && 'grid-cols-2',
              theme.galleryLayout === 'grid' && isDesktopPreview && 'grid-cols-1',
              theme.galleryLayout === 'grid' && !isMobilePreview && 'lg:grid-cols-1',
            )}
          >
            {galleryItems.map((item, index) => (
              <div
                key={`${item.imageUrl}-${index}`}
                className={cn('aspect-square bg-slate-200 bg-cover bg-center', theme.radiusClass, theme.galleryLayout === 'carousel' && 'w-52 shrink-0 snap-center')}
                style={{ backgroundImage: `url('${item.imageUrl}')` }}
              />
            ))}
          </div>
        ) : null}
      </section>
    </main>
  );
}
