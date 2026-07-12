import { cn } from '@/lib/utils/cn';
import { formatProfileSummary } from '@/lib/utils/profile-format';
import type { ProfileBuilderState } from '@/lib/types/profile-builder';

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
  const goalTitle = primaryGoal?.title ?? 'Next goal coming soon';
  const goalDescription =
    primaryGoal?.description ?? 'This athlete is preparing the next objective.';
  const goalTarget = primaryGoal?.targetLabel ?? 'No target date';
  const profileSummary =
    formatProfileSummary({
      bio: profile.bio,
      location: profile.location,
      sports: profile.sports,
    }) || 'More context coming soon.';
  const sports = profile.sports;
  const isPreview = variant !== 'full';
  const isMobilePreview = variant === 'mobile-preview';
  const isDesktopPreview = variant === 'desktop-preview';

  return (
    <main
      className={cn(
        'bg-slate-50 text-slate-950',
        isPreview ? 'h-full overflow-y-auto overscroll-contain' : 'min-h-dvh',
      )}
    >
      <section
        className={cn(
          'relative flex items-end overflow-hidden bg-slate-950 bg-cover bg-center text-white',
          isPreview
            ? 'min-h-[360px] px-5 py-6'
            : 'min-h-[78dvh] px-5 py-8 sm:px-8 lg:px-12',
          isMobilePreview && 'min-h-[360px] px-4 py-5',
        )}
        style={{ backgroundImage: `url('${profile.coverUrl}')` }}
      >
        <div className="absolute inset-0 bg-slate-950/60" />
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
              <p className="text-sm text-white/70">@{profile.username}</p>
            </div>
          </div>

          <div className="max-w-4xl">
            <p className="text-xs font-semibold tracking-[0.28em] text-white/70 uppercase">
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
            >
              {goalTitle}
            </h1>
            <p
              className={cn(
                'mt-6 max-w-2xl leading-7 text-white/80',
                isPreview ? 'text-base' : 'text-base sm:text-lg',
              )}
            >
              {goalDescription}
            </p>
            <div className="mt-7 flex flex-wrap gap-2 text-sm font-medium">
              <span className="rounded-full bg-white px-4 py-2 text-slate-950">
                {goalTarget}
              </span>
              <span className="rounded-full bg-white/15 px-4 py-2 text-white">
                {primaryGoal?.status ?? 'planned'}
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
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold">Athlete context</p>
            <p className="mt-3 leading-7 text-slate-600">{profileSummary}</p>
            {sports.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {sports.map((sport) => (
                  <span
                    key={sport}
                    className="rounded-full bg-slate-950 px-3 py-1.5 text-xs font-medium text-white"
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
                    className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
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
                  className="rounded-3xl bg-white p-5 shadow-sm"
                >
                  <p className="text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase">
                    Also chasing
                  </p>
                  <p className="mt-3 text-lg font-semibold">{goal.title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {goal.description}
                  </p>
                  <p className="mt-4 text-sm font-medium text-slate-500">
                    {goal.targetLabel}
                  </p>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {galleryItems.length ? (
          <div
            className={cn(
              'grid grid-cols-3 gap-2',
              isDesktopPreview && 'grid-cols-1',
              !isMobilePreview && 'lg:grid-cols-1',
            )}
          >
            {galleryItems.slice(0, 3).map((item, index) => (
              <div
                key={`${item.imageUrl}-${index}`}
                className="aspect-square rounded-3xl bg-slate-200 bg-cover bg-center"
                style={{ backgroundImage: `url('${item.imageUrl}')` }}
              />
            ))}
          </div>
        ) : null}
      </section>
    </main>
  );
}
