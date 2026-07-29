import Link from 'next/link';
import { ArrowRightIcon, HouseIcon, PathIcon } from '@phosphor-icons/react/ssr';
import { getRequestLocale } from '@/lib/i18n/server';

const notFoundCopy = {
  en: {
    badge: '404 · Off course',
    title: 'This page missed the starting line.',
    description:
      'The link may have changed or the page may no longer exist. Head home or discover athlete profiles that are still moving forward.',
    home: 'Back to home',
    athletes: 'Explore athletes',
    caption: 'Wrong turn. Same momentum.',
  },
  fr: {
    badge: '404 · Hors parcours',
    title: "Cette page n'est plus sur la ligne de départ.",
    description:
      'Le lien a peut-être changé ou la page n’existe plus. Revenez à l’accueil ou découvrez les profils de sportifs qui avancent vers leur prochain objectif.',
    home: 'Retour à l’accueil',
    athletes: 'Découvrir les sportifs',
    caption: 'Mauvaise direction. Même élan.',
  },
} as const;

export default async function NotFound() {
  const locale = await getRequestLocale();
  const copy = notFoundCopy[locale];

  return (
    <main className="relative isolate flex min-h-svh overflow-hidden bg-[#f7f6f1] text-[#151515]">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_12%_18%,rgba(169,237,53,0.34),transparent_26%),radial-gradient(circle_at_88%_72%,rgba(49,87,255,0.2),transparent_30%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(21,21,21,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(21,21,21,0.045)_1px,transparent_1px)] [mask-image:linear-gradient(to_bottom,black,transparent_82%)] bg-[size:42px_42px]" />

      <div className="mx-auto flex w-full max-w-[1380px] flex-col px-5 py-7 sm:px-8 sm:py-9 lg:px-12">
        <Link
          aria-label="Griit"
          className="w-fit text-xl font-black tracking-[-0.06em]"
          href="/"
        >
          GRIIT<span className="text-[#3157ff]">.</span>
        </Link>

        <div className="grid flex-1 items-center gap-14 py-14 lg:grid-cols-[0.92fr_1.08fr] lg:gap-20 lg:py-10">
          <section className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3 py-1.5 text-xs font-bold backdrop-blur">
              <PathIcon className="h-4 w-4 text-[#3157ff]" weight="bold" />
              {copy.badge}
            </div>

            <h1 className="mt-7 text-[clamp(3.2rem,7vw,6.8rem)] leading-[0.88] font-black tracking-[-0.075em]">
              {copy.title}
            </h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-black/58 sm:text-lg sm:leading-8">
              {copy.description}
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                className="inline-flex h-13 items-center justify-center gap-2 rounded-full bg-[#151515] px-7 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
                href="/"
              >
                <HouseIcon className="h-4 w-4" weight="bold" />
                {copy.home}
              </Link>
              <Link
                className="inline-flex h-13 items-center justify-center gap-2 rounded-full border border-black/15 bg-white/60 px-7 text-sm font-bold transition-colors hover:bg-white"
                href="/athletes"
              >
                {copy.athletes}
                <ArrowRightIcon className="h-4 w-4" weight="bold" />
              </Link>
            </div>
          </section>

          <section
            aria-hidden="true"
            className="relative mx-auto w-full max-w-[660px] lg:mx-0"
          >
            <div className="relative aspect-[1.12] overflow-hidden rounded-[2rem] border-[7px] border-[#151515] bg-[#151515] shadow-[0_32px_80px_rgba(21,21,21,0.2)] sm:rounded-[2.75rem] sm:border-[10px]">
              <div className="absolute inset-[10px] overflow-hidden rounded-[1.25rem] bg-[#3157ff] sm:inset-[14px] sm:rounded-[1.8rem]">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.16)_1px,transparent_1px)] bg-[size:38px_38px]" />
                <div className="absolute -top-[28%] -right-[18%] h-[82%] w-[82%] rounded-full border-[clamp(2.4rem,7vw,5.5rem)] border-[#a9ed35] opacity-95" />
                <div className="absolute -bottom-[30%] -left-[18%] h-[65%] w-[65%] rotate-12 bg-[#151515]" />

                <div className="absolute inset-0 flex items-center justify-center px-4">
                  <p className="text-[clamp(6.5rem,19vw,13rem)] leading-none font-black tracking-[-0.1em] text-white drop-shadow-[8px_8px_0_rgba(21,21,21,0.22)]">
                    404
                  </p>
                </div>

                <div className="absolute right-5 bottom-5 left-5 flex items-center justify-between border-t border-white/35 pt-4 text-[10px] font-black tracking-[0.2em] text-white uppercase sm:right-8 sm:bottom-7 sm:left-8 sm:text-xs">
                  <span>{copy.caption}</span>
                  <ArrowRightIcon
                    className="h-5 w-5 -rotate-45"
                    weight="bold"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
