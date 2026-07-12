import { cn } from '@/lib/utils/cn';
import { formatProfileSummary } from '@/lib/utils/profile-format';
import type { ProfileBuilderState } from '@/lib/types/profile-builder';
import type { ProfileTemplateVariant } from '@/components/profile/templates/goal-spotlight-template';

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
  const isPreview = variant !== 'full';
  const isMobilePreview = variant === 'mobile-preview';
  const goalTitle = primaryGoal?.title ?? 'Next event coming soon';
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

  return (
    <main
      className={cn(
        'bg-zinc-950 text-white',
        isPreview ? 'h-full overflow-y-auto overscroll-contain' : 'min-h-dvh',
      )}
    >
      <section
        className={cn(
          'mx-auto grid w-full max-w-6xl gap-6 px-5 py-6',
          isPreview ? 'min-h-full' : 'min-h-dvh sm:px-8 lg:px-12',
          isMobilePreview ? 'grid-cols-1' : 'lg:grid-cols-[1.1fr_0.9fr]',
        )}
      >
        <div className="flex flex-col justify-between gap-10 rounded-[2rem] border border-white/10 bg-white p-6 text-zinc-950">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold">{profile.displayName}</p>
              <p className="text-xs text-zinc-500">@{profile.username}</p>
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
            <h1 className="mt-4 text-5xl leading-none font-black tracking-tight sm:text-6xl">
              {goalTitle}
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-zinc-600">
              {goalDescription}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-zinc-950 p-4 text-white">
              <p className="text-xs text-white/50 uppercase">Date</p>
              <p className="mt-2 font-semibold">{goalTarget}</p>
            </div>
            <div className="rounded-2xl bg-zinc-100 p-4">
              <p className="text-xs text-zinc-500 uppercase">Status</p>
              <p className="mt-2 font-semibold">
                {primaryGoal?.status ?? 'planned'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          <div
            className="min-h-[320px] rounded-[2rem] bg-zinc-800 bg-cover bg-center"
            style={{ backgroundImage: `url('${profile.coverUrl}')` }}
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
            <div className="grid grid-cols-3 gap-2">
              {galleryItems.slice(0, 3).map((item, index) => (
                <div
                  key={`${item.imageUrl}-${index}`}
                  className="aspect-square rounded-2xl bg-zinc-800 bg-cover bg-center"
                  style={{ backgroundImage: `url('${item.imageUrl}')` }}
                />
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
