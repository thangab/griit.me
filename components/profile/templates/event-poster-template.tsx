import { cn } from '@/lib/utils/cn';
import { formatProfileSummary } from '@/lib/utils/profile-format';
import type { ProfileBuilderState } from '@/lib/types/profile-builder';
import type { ProfileTemplateVariant } from '@/components/profile/templates/goal-spotlight-template';
import { getThemeRuntime } from '@/lib/constants/profile-theme';

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
  const galleryItems = builder.galleryItems.filter((item) => item.isEnabled);
  const socialLinks = builder.socialLinks.filter((link) => link.isEnabled);
  const achievements = builder.achievements.filter((item) => item.isEnabled);
  const activities = builder.activities.filter((item) => item.isEnabled);
  const isPreview = variant !== 'full';
  const isMobilePreview = variant === 'mobile-preview';
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
  const coverBackgroundImage = theme.coverType === 'image'
    ? `linear-gradient(rgba(0,0,0,${theme.overlayOpacity}), rgba(0,0,0,${theme.overlayOpacity})), url('${profile.coverUrl}')`
    : theme.coverType === 'gradient'
      ? `linear-gradient(135deg, ${theme.coverGradientFrom}, ${theme.coverGradientTo})`
      : undefined;

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
          'mx-auto grid w-full max-w-6xl gap-6 px-5 py-6',
          isPreview ? 'min-h-full' : 'min-h-dvh sm:px-8 lg:px-12',
          isMobilePreview ? 'grid-cols-1' : 'lg:grid-cols-[1.1fr_0.9fr]',
        )}
      >
        <div
          className={cn('flex flex-col justify-between gap-10 border p-6', theme.radiusClass)}
          style={{ backgroundColor: theme.palette.surface, borderColor: theme.palette.border, color: theme.palette.text }}
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold" style={{ color: theme.palette.blockTitle }}>{profile.displayName}</p>
            </div>
            <div
              className="h-12 w-12 rounded-full bg-zinc-200 bg-cover bg-center"
              style={{ backgroundImage: `url('${profile.avatarUrl}')` }}
            />
          </div>

          <div>
            <p className="text-xs font-bold tracking-[0.3em] uppercase">
              Target
            </p>
            <h1 className="mt-4 text-5xl leading-none font-black tracking-tight sm:text-6xl" style={{ color: theme.palette.blockTitle, fontFamily: theme.fontFamilies.heading }}>
              {goalTitle}
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7" style={{ color: theme.palette.mutedText }}>
              {goalDescription}
            </p>
          </div>

          <div>
            <div className="rounded-2xl p-4" style={{ backgroundColor: theme.palette.accent, color: theme.palette.accentText }}>
              <p className="text-xs uppercase opacity-65" style={{ color: theme.palette.accentText }}>Date</p>
              <p className="mt-2 font-semibold">{goalTarget}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          <div
            className={cn('min-h-[320px] bg-zinc-800 bg-cover bg-center', theme.radiusClass)}
            style={{
              backgroundColor: theme.coverType === 'color' ? theme.coverColor : undefined,
              backgroundImage: coverBackgroundImage,
            }}
          />
          <div className={cn(theme.radiusClass, 'border p-5')} style={{ backgroundColor: theme.palette.surface, borderColor: theme.palette.border, color: theme.palette.text }}>
            <p className="text-sm font-semibold" style={{ color: theme.palette.blockTitle }}>Athlete context</p>
            <p className="mt-3 whitespace-pre-line text-sm leading-6" style={{ color: theme.palette.mutedText }}>
              {profileSummary}
            </p>
            {sports.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {sports.map((sport) => (
                  <span
                    key={sport}
                    className="rounded-full px-3 py-1.5 text-xs font-semibold"
                    style={{ backgroundColor: theme.palette.accent, color: theme.palette.accentText }}
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
                  className="rounded-full px-3 py-1.5 text-xs font-medium"
                  style={{ backgroundColor: theme.palette.social, color: theme.palette.socialText }}
                  href={link.url}
                  rel="noreferrer"
                  target="_blank"
                >
                  {link.label || link.platform}
                </a>
              ))}
            </div>
          </div>
          {galleryItems.length ? (
            <div className={cn('gap-2', theme.galleryLayout === 'carousel' ? 'flex overflow-x-auto' : 'grid grid-cols-3', theme.galleryLayout === 'editorial' && 'grid-cols-2')}>
              {galleryItems.map((item, index) => (
                <div
                  key={`${item.imageUrl}-${index}`}
                  className={cn('aspect-square bg-zinc-800 bg-cover bg-center', theme.radiusClass, theme.galleryLayout === 'carousel' && 'w-52 shrink-0')}
                  style={{ backgroundImage: `url('${item.imageUrl}')` }}
                />
              ))}
            </div>
          ) : null}
          {achievements.map((item) => (
            <div
              key={`${item.title}-${item.sortOrder}`}
              className={cn(theme.radiusClass, 'border p-5')}
              style={{ backgroundColor: theme.palette.surface, borderColor: theme.palette.border, color: theme.palette.text }}
            >
              <p className="text-xs font-semibold tracking-[0.2em] uppercase" style={{ color: theme.palette.description }}>
                Achievement
              </p>
              <p className="mt-3 font-semibold" style={{ color: theme.palette.blockTitle }}>{item.title}</p>
              {item.description ? (
                <p className="mt-2 text-sm leading-6" style={{ color: theme.palette.description }}>
                  {item.description}
                </p>
              ) : null}
              {item.dateLabel ? (
                <p className="mt-3 text-xs" style={{ color: theme.palette.mutedDescription }}>{item.dateLabel}</p>
              ) : null}
            </div>
          ))}
          {activities.map((item) => (
            <div
              key={`${item.title}-${item.sortOrder}`}
              className={cn(theme.radiusClass, 'border p-5')}
              style={{ backgroundColor: theme.palette.surface, borderColor: theme.palette.border, color: theme.palette.text }}
            >
              <p className="text-xs font-semibold tracking-[0.2em] uppercase" style={{ color: theme.palette.description }}>
                Recent activity
              </p>
              <p className="mt-3 font-semibold" style={{ color: theme.palette.blockTitle }}>{item.title}</p>
              {item.description || item.dateLabel ? (
                <p className="mt-2 text-sm" style={{ color: theme.palette.description }}>
                  {[item.description, item.dateLabel].filter(Boolean).join(' · ')}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
