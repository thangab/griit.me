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

  return (
    <main
      className={cn(
        '',
        isPreview ? 'h-full overflow-y-auto overscroll-contain' : 'min-h-dvh',
      )}
      style={{ backgroundColor: theme.color.colors[0], color: theme.color.colors[1], fontFamily: theme.fontFamilies.body }}
    >
      <section
        className={cn(
          'mx-auto grid w-full max-w-6xl gap-6 px-5 py-6',
          isPreview ? 'min-h-full' : 'min-h-dvh sm:px-8 lg:px-12',
          isMobilePreview ? 'grid-cols-1' : 'lg:grid-cols-[1.1fr_0.9fr]',
        )}
      >
        <div className={cn('flex flex-col justify-between gap-10 border border-white/10 p-6', theme.radiusClass)} style={{ backgroundColor: theme.color.colors[1], color: theme.color.colors[0] }}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold">{profile.displayName}</p>
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
            <h1 className="mt-4 text-5xl leading-none font-black tracking-tight sm:text-6xl" style={{ fontFamily: theme.fontFamilies.heading }}>
              {goalTitle}
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-zinc-600">
              {goalDescription}
            </p>
          </div>

          <div>
            <div className="rounded-2xl bg-zinc-950 p-4 text-white">
              <p className="text-xs text-white/50 uppercase">Date</p>
              <p className="mt-2 font-semibold">{goalTarget}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          <div
            className={cn('min-h-[320px] bg-zinc-800 bg-cover bg-center', theme.radiusClass)}
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,${theme.overlayOpacity}), rgba(0,0,0,${theme.overlayOpacity})), url('${profile.coverUrl}')`,
            }}
          />
          <div className="rounded-[2rem] border border-white/10 bg-white/10 p-5">
            <p className="text-sm font-semibold">Athlete context</p>
            <p className="mt-3 text-sm leading-6 text-white/65">
              {profileSummary}
            </p>
            {sports.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {sports.map((sport) => (
                  <span
                    key={sport}
                    className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-zinc-950"
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
                  className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium"
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
              className="rounded-[2rem] border border-white/10 bg-white/10 p-5"
            >
              <p className="text-xs font-semibold tracking-[0.2em] text-white/50 uppercase">
                Achievement
              </p>
              <p className="mt-3 font-semibold">{item.title}</p>
              {item.description ? (
                <p className="mt-2 text-sm leading-6 text-white/65">
                  {item.description}
                </p>
              ) : null}
              <p className="mt-3 text-xs text-white/50">{item.dateLabel}</p>
            </div>
          ))}
          {activities.map((item) => (
            <div
              key={`${item.title}-${item.sortOrder}`}
              className="rounded-[2rem] border border-white/10 bg-white/10 p-5"
            >
              <p className="text-xs font-semibold tracking-[0.2em] text-white/50 uppercase">
                Recent activity
              </p>
              <p className="mt-3 font-semibold">{item.title}</p>
              <p className="mt-2 text-sm text-white/65">
                {[item.description, item.dateLabel].filter(Boolean).join(' · ')}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
