import { notFound } from 'next/navigation';
import { ShieldCheckIcon } from '@phosphor-icons/react/ssr';
import { AthleteDirectoryReviewCard } from '@/components/admin/athlete-directory-review-card';
import { getAdminDirectoryReviews } from '@/lib/services/athlete-directory-review';
import { getRequestLocale } from '@/lib/i18n/server';

export default async function AthleteDirectoryAdminPage() {
  const reviews = await getAdminDirectoryReviews();
  if (!reviews) notFound();
  const locale = await getRequestLocale();
  const fr = locale === 'fr';

  const pending = reviews.filter((review) => review.status === 'pending');
  const reviewed = reviews.filter((review) => review.status !== 'pending');

  return (
    <div className="mx-auto w-full max-w-[1380px] space-y-6">
      <header className="relative overflow-hidden rounded-[2rem] bg-[#151515] p-7 text-white shadow-[0_24px_70px_rgba(21,21,21,0.12)] sm:p-9">
        <div className="pointer-events-none absolute -top-24 right-8 h-60 w-60 rounded-full border-[38px] border-[#3157ff]/25" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-black tracking-[0.22em] text-white/45 uppercase">
              Admin
            </p>
            <h1 className="mt-4 text-4xl font-black tracking-[-0.05em] sm:text-5xl">
              {fr ? 'Vérification des athlètes' : 'Athlete reviews'}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/55">
              {fr
                ? 'Vérifiez les profils en ligne avant leur apparition dans l’annuaire public des athlètes.'
                : 'Review live profiles before they appear in the public athlete directory.'}
            </p>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-bold">
            <ShieldCheckIcon className="h-4 w-4" />
            {pending.length}{' '}
            {fr ? 'en attente de vérification' : 'awaiting review'}
          </span>
        </div>
      </header>

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-black tracking-[-0.035em]">
            {fr ? 'En attente de vérification' : 'Awaiting review'}
          </h2>
          <p className="mt-1 text-sm text-black/45">
            {fr
              ? 'La validation d’un profil le rend immédiatement visible sur `/athletes`.'
              : 'Approving a profile makes it eligible for `/athletes` immediately.'}
          </p>
        </div>
        {pending.length ? (
          <div className="grid gap-4 xl:grid-cols-2">
            {pending.map((review) => (
              <AthleteDirectoryReviewCard
                key={review.profileId}
                review={review}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-[1.75rem] border border-dashed border-black/15 bg-white/60 px-6 py-12 text-center">
            <ShieldCheckIcon className="mx-auto h-8 w-8 text-emerald-600" />
            <p className="mt-3 font-bold">
              {fr ? 'Tout a été vérifié.' : 'Everything is reviewed.'}
            </p>
            <p className="mt-1 text-sm text-black/45">
              {fr
                ? 'Les nouveaux profils en ligne apparaîtront ici automatiquement.'
                : 'New live profiles will appear here automatically.'}
            </p>
          </div>
        )}
      </section>

      {reviewed.length ? (
        <section className="space-y-4 pt-4">
          <div>
            <h2 className="text-2xl font-black tracking-[-0.035em]">
              {fr ? 'Historique des vérifications' : 'Review history'}
            </h2>
            <p className="mt-1 text-sm text-black/45">
              {fr
                ? 'Vous pouvez retirer ou valider à nouveau un profil à tout moment.'
                : 'You can revoke or approve a profile again at any time.'}
            </p>
          </div>
          <div className="grid gap-4 xl:grid-cols-2">
            {reviewed.map((review) => (
              <AthleteDirectoryReviewCard
                key={review.profileId}
                review={review}
              />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
