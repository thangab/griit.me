import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRightIcon,
  PaintBrushIcon,
  SquaresFourIcon,
  TargetIcon,
} from '@phosphor-icons/react/ssr';
import { InspirationGallery } from '@/components/marketing/inspiration-gallery';
import { JsonLd } from '@/components/seo/json-ld';
import { getRequestLocale } from '@/lib/i18n/server';
import { getInspirationProfiles } from '@/lib/services/inspiration-gallery';
import { createMarketingMetadata, getSiteUrl } from '@/lib/seo/metadata';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const isFrench = locale === 'fr';

  return createMarketingMetadata({
    title: isFrench
      ? 'Inspiration — Exemples de profils Griit'
      : 'Inspiration — Griit profile examples',
    description: isFrench
      ? 'Explorez des profils de démonstration, des templates et des mises en page pour imaginer votre propre profil sportif Griit.'
      : 'Explore demo profiles, templates, and layouts to imagine your own Griit athlete profile.',
    path: '/inspiration',
    locale,
  });
}

export default async function InspirationPage() {
  const locale = await getRequestLocale();
  const isFrench = locale === 'fr';
  const profiles = await getInspirationProfiles();

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Griit profile inspiration',
          description:
            'Fictional demo athlete profiles showing what can be built with Griit.',
          url: `${getSiteUrl()}/inspiration`,
          isPartOf: { '@type': 'WebSite', url: getSiteUrl(), name: 'Griit' },
        }}
      />
      <main className="overflow-hidden">
        <section className="relative bg-[#151515] px-5 pt-20 pb-18 text-white sm:px-8 lg:px-12 lg:pt-28 lg:pb-24">
          <div className="absolute inset-0 opacity-80 [background:radial-gradient(circle_at_18%_16%,rgba(169,237,53,0.28),transparent_25%),radial-gradient(circle_at_85%_24%,rgba(49,87,255,0.45),transparent_28%)]" />
          <div className="relative mx-auto max-w-[1180px]">
            <p className="inline-flex rounded-full border border-white/15 bg-white/8 px-3 py-1.5 text-xs font-black tracking-[0.14em] text-[#a9ed35] uppercase">
              {isFrench ? 'Galerie d’inspiration' : 'Inspiration gallery'}
            </p>
            <h1 className="mt-7 max-w-5xl text-[clamp(3.8rem,8vw,7.5rem)] leading-[0.84] font-black tracking-[-0.075em]">
              {isFrench ? (
                <>
                  Voyez tout ce que votre profil peut devenir
                  <span className="text-[#a9ed35]">.</span>
                </>
              ) : (
                <>
                  See what your profile could become
                  <span className="text-[#a9ed35]">.</span>
                </>
              )}
            </h1>
            <div className="mt-9 flex max-w-4xl flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
              <p className="max-w-2xl text-lg leading-8 text-white/62">
                {isFrench
                  ? `${profiles.length || 50} exemples pour explorer les templates, les couleurs, les objectifs et les blocs disponibles dans Griit — sans partir d’une page blanche.`
                  : `${profiles.length || 50} examples to explore Griit templates, colors, goals, and blocks—without starting from a blank page.`}
              </p>
              <Link
                className="inline-flex h-13 shrink-0 items-center justify-center gap-2 self-start rounded-full bg-[#a9ed35] px-7 text-sm font-black text-[#151515] transition hover:-translate-y-0.5"
                href="/sign-up"
              >
                {isFrench ? 'Créer mon profil' : 'Create my profile'}
                <ArrowRightIcon className="h-4 w-4" weight="bold" />
              </Link>
            </div>
          </div>
        </section>

        <section className="border-b border-black/10 bg-white px-5 py-8 sm:px-8 lg:px-12">
          <div className="mx-auto grid max-w-[1180px] gap-3 md:grid-cols-3">
            {[
              {
                icon: TargetIcon,
                title: isFrench
                  ? 'Mettez l’objectif en tête'
                  : 'Lead with the goal',
                text: isFrench
                  ? 'Compte à rebours, date cible et récit de progression.'
                  : 'Countdowns, target dates, and a clear progress story.',
              },
              {
                icon: SquaresFourIcon,
                title: isFrench ? 'Montrez votre parcours' : 'Show the journey',
                text: isFrench
                  ? 'Résultats, activités, médias, sponsors et liens.'
                  : 'Results, activities, media, sponsors, and links.',
              },
              {
                icon: PaintBrushIcon,
                title: isFrench ? 'Créez votre univers' : 'Make it yours',
                text: isFrench
                  ? 'Templates, couleurs, typographies et compositions.'
                  : 'Templates, colors, typography, and layouts.',
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <article
                  className="rounded-[1.5rem] border border-black/10 bg-[#f7f6f1] p-5"
                  key={item.title}
                >
                  <Icon className="h-6 w-6 text-[#3157ff]" weight="duotone" />
                  <h2 className="mt-5 text-lg font-black">{item.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-black/48">
                    {item.text}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
          <div className="mx-auto max-w-[1280px]">
            <div className="mb-12 max-w-3xl">
              <p className="text-xs font-black tracking-[0.16em] text-[#3157ff] uppercase">
                {isFrench ? 'Explorez à votre rythme' : 'Explore your way'}
              </p>
              <h2 className="mt-4 text-5xl leading-[0.92] font-black tracking-[-0.06em] sm:text-6xl">
                {isFrench
                  ? 'Un sport, un objectif, une identité différente.'
                  : 'Different sports. Different goals. Different energy.'}
              </h2>
              <p className="mt-5 text-base leading-7 text-black/48">
                {isFrench
                  ? 'Recherchez une discipline, comparez les templates et ouvrez chaque page pour découvrir le rendu complet.'
                  : 'Search by discipline, compare templates, and open any page to see the complete experience.'}
              </p>
            </div>
            <InspirationGallery athletes={profiles} locale={locale} />
          </div>
        </section>

        <section className="bg-[#3157ff] px-5 py-18 text-white sm:px-8 lg:px-12 lg:py-24">
          <div className="mx-auto flex max-w-[1180px] flex-col items-start justify-between gap-9 lg:flex-row lg:items-end">
            <div>
              <p className="text-xs font-black tracking-[0.18em] text-white/65 uppercase">
                {isFrench
                  ? 'Votre page, votre énergie'
                  : 'Your page, your energy'}
              </p>
              <h2 className="mt-5 max-w-4xl text-5xl leading-[0.9] font-black tracking-[-0.065em] sm:text-7xl">
                {isFrench
                  ? 'Inspirez-vous. Puis faites complètement autrement.'
                  : 'Take inspiration. Then make something entirely yours.'}
              </h2>
            </div>
            <Link
              className="inline-flex h-13 shrink-0 items-center gap-2 rounded-full bg-white px-7 text-sm font-black text-[#151515] transition hover:-translate-y-0.5"
              href="/sign-up"
            >
              {isFrench ? 'Prendre le départ' : 'Start building'}
              <ArrowRightIcon className="h-4 w-4" weight="bold" />
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
