import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRightIcon,
  CaretDownIcon,
  ChartLineUpIcon,
  CheckIcon,
  DeviceMobileIcon,
  GlobeIcon,
  LightningIcon,
  LinkIcon,
  PaletteIcon,
  SparkleIcon,
  SquaresFourIcon,
} from '@phosphor-icons/react/ssr';
import { getRequestLocale } from '@/lib/i18n/server';
import { getMarketingHomeContent } from '@/lib/i18n/marketing-home';
import { HeroProfileCollage } from './athlete-profile-showcase';
import { PublicProfilePreviewCard } from '@/components/marketing/public-profile-preview-card';
import { getThemeRuntime } from '@/lib/constants/profile-theme';
import { getInspirationProfiles } from '@/lib/services/inspiration-gallery';
import type { AthleteDirectoryEntry } from '@/lib/services/athlete-directory';
import { EditorShowcase } from './editor-showcase';
import { JsonLd } from '@/components/seo/json-ld';
import { createMarketingMetadata, getSiteUrl } from '@/lib/seo/metadata';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const isFrench = locale === 'fr';

  return createMarketingMetadata({
    title: isFrench
      ? 'Griit — Votre parcours sportif, un seul lien dans votre bio'
      : 'Griit — Your sporting journey, one link in your bio',
    description: isFrench
      ? 'Créez et publiez gratuitement un profil sportif public, quel que soit votre niveau. Sans carte bancaire.'
      : 'Build and publish a free public sports profile at any level. No card required.',
    path: '/',
    locale,
  });
}

const featureCards = [
  {
    icon: SquaresFourIcon,
    title: 'Put your next goal first',
    description:
      'Make the objective you are chasing obvious from the first screen, with a date, countdown, and dedicated link.',
    color: 'bg-[#e8e0ff]',
  },
  {
    icon: PaletteIcon,
    title: 'Build your athlete identity',
    description:
      'Choose a complete visual direction, then customize every detail to match your personality and discipline.',
    color: 'bg-[#ffe0ce]',
  },
  {
    icon: LightningIcon,
    title: 'Tell the full story',
    description:
      'Bring together achievements, activities, photos, videos, personal links, and the work behind your progress.',
    color: 'bg-[#dff5b4]',
  },
  {
    icon: ChartLineUpIcon,
    title: 'Show your impact',
    description:
      'Understand profile views, clicks, traffic sources, audience, and block engagement.',
    color: 'bg-[#cfe4ff]',
  },
  {
    icon: LinkIcon,
    title: 'Turn attention into opportunities',
    description:
      'Show existing sponsors, promote affiliate offers, and make it clear when you are open to partnerships.',
    color: 'bg-[#fff0ae]',
  },
  {
    icon: GlobeIcon,
    title: 'Made for every sport',
    description:
      'Running, HYROX, gym, cycling, combat sports, team sports, coaching, and everything in between.',
    color: 'bg-[#ffdce7]',
  },
] as const;

function colorChannels(color: string) {
  const normalized = color.trim().replace('#', '');
  const hex =
    normalized.length === 3
      ? normalized
          .split('')
          .map((character) => character + character)
          .join('')
      : normalized;

  if (!/^[0-9a-f]{6}$/i.test(hex)) return [127, 127, 127] as const;

  return [
    Number.parseInt(hex.slice(0, 2), 16),
    Number.parseInt(hex.slice(2, 4), 16),
    Number.parseInt(hex.slice(4, 6), 16),
  ] as const;
}

function colorDistance(first: string, second: string) {
  const firstChannels = colorChannels(first);
  const secondChannels = colorChannels(second);

  return firstChannels.reduce((distance, channel, index) => {
    const difference = channel - secondChannels[index];
    return distance + difference * difference;
  }, 0);
}

function profilePaletteDistance(
  first: AthleteDirectoryEntry,
  second: AthleteDirectoryEntry,
) {
  const firstTheme = getThemeRuntime(first.theme);
  const secondTheme = getThemeRuntime(second.theme);

  return (
    colorDistance(
      firstTheme.palette.background,
      secondTheme.palette.background,
    ) + colorDistance(firstTheme.palette.accent, secondTheme.palette.accent)
  );
}

function selectRandomDiverseProfiles(
  profiles: AthleteDirectoryEntry[],
  count: number,
) {
  const profilesWithPreviews = profiles.filter(
    (profile) => profile.previewImageUrl,
  );
  const pool =
    profilesWithPreviews.length >= count ? profilesWithPreviews : profiles;
  if (pool.length <= count) return pool;

  const firstProfile = pool[Math.floor(Math.random() * pool.length)];
  const selected = [firstProfile];

  while (selected.length < count) {
    const candidates = pool.filter(
      (profile) => !selected.some((item) => item.id === profile.id),
    );
    const nextProfile = candidates.reduce((best, candidate) => {
      const candidateDistance = Math.min(
        ...selected.map((profile) =>
          profilePaletteDistance(profile, candidate),
        ),
      );
      const bestDistance = Math.min(
        ...selected.map((profile) => profilePaletteDistance(profile, best)),
      );

      return candidateDistance > bestDistance ? candidate : best;
    });

    selected.push(nextProfile);
  }

  return selected;
}

export default async function HomePage() {
  const locale = await getRequestLocale();
  const inspirationProfiles = selectRandomDiverseProfiles(
    await getInspirationProfiles(),
    3,
  );
  const content = getMarketingHomeContent(locale);
  const siteUrl = getSiteUrl();
  const localizedFeatures = featureCards
    .map((feature, index) => ({
      ...feature,
      title: content.features[index][0],
      description: content.features[index][1],
    }))
    .filter((_, index) => [0, 2, 5].includes(index));

  return (
    <main className="overflow-hidden">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'Organization',
              '@id': `${siteUrl}/#organization`,
              name: 'Griit',
              url: siteUrl,
              logo: `${siteUrl}/favicon.ico`,
              email: 'support@griit.me',
            },
            {
              '@type': 'WebSite',
              '@id': `${siteUrl}/#website`,
              url: siteUrl,
              name: 'Griit',
              publisher: { '@id': `${siteUrl}/#organization` },
              inLanguage: locale,
            },
            {
              '@type': 'SoftwareApplication',
              name: 'Griit',
              applicationCategory: 'SocialNetworkingApplication',
              operatingSystem: 'Web',
              url: siteUrl,
              description: content.heroDescription,
              offers: [
                {
                  '@type': 'Offer',
                  name: 'Griit Free',
                  price: '0',
                  priceCurrency: 'USD',
                },
                {
                  '@type': 'Offer',
                  name: 'Griit Pro Monthly',
                  price: '5',
                  priceCurrency: 'USD',
                },
              ],
            },
            {
              '@type': 'FAQPage',
              mainEntity: content.faq.map(([question, answer]) => ({
                '@type': 'Question',
                name: question,
                acceptedAnswer: { '@type': 'Answer', text: answer },
              })),
            },
          ],
        }}
      />
      <section className="relative border-b border-black/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_16%,rgba(169,237,53,0.35),transparent_25%),radial-gradient(circle_at_85%_30%,rgba(49,87,255,0.18),transparent_28%)]" />
        <div className="relative mx-auto grid max-w-[1380px] items-center gap-14 px-5 py-16 sm:px-8 lg:min-h-[calc(100svh-4.5rem)] lg:grid-cols-[1.05fr_0.95fr] lg:px-12 lg:py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3 py-1.5 text-xs font-bold backdrop-blur">
              <SparkleIcon className="h-4 w-4 text-[#3157ff]" weight="fill" />
              {content.badge}
            </div>
            <h1 className="mt-7 text-[clamp(2.75rem,6vw,6rem)] leading-[0.98] font-black tracking-[-0.075em]">
              {content.heroLine1}
              <br />
              {content.heroLine2}{' '}
              <span className="text-[#3157ff]">{content.heroAccent}</span>
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-8 text-black/58 sm:text-xl">
              {content.heroDescription}
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                className="inline-flex h-13 items-center justify-center gap-2 rounded-full bg-[#151515] px-7 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
                data-marketing-cta="create_free_profile"
                data-marketing-source="home_hero"
                href="/sign-up"
              >
                {content.createProfile}
                <ArrowRightIcon className="h-4 w-4" weight="bold" />
              </Link>
              <a
                className="inline-flex h-13 items-center justify-center rounded-full border border-black/15 bg-white/55 px-7 text-sm font-bold transition-colors hover:bg-white"
                href="#templates"
                data-marketing-cta="explore_examples"
                data-marketing-source="home_hero"
              >
                {content.exploreTemplates}
              </a>
            </div>

            <p className="mt-5 flex items-center gap-2 text-xs font-black text-[#3157ff]">
              <CheckIcon className="h-4 w-4" weight="bold" />
              {content.freeNote}
            </p>

            <div className="mt-9 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-black/48">
              {content.benefits.map((item) => (
                <span className="flex items-center gap-1.5" key={item}>
                  <CheckIcon
                    className="h-3.5 w-3.5 text-[#3157ff]"
                    weight="bold"
                  />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <HeroProfileCollage />
        </div>
      </section>

      <section className="px-5 py-14 sm:px-8 lg:px-12 lg:py-20" id="templates">
        <div className="mx-auto max-w-[1280px]">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-3xl">
              <p className="text-xs font-black tracking-[0.18em] text-[#3157ff] uppercase">
                {locale === 'fr' ? 'Inspiration' : 'Built with Griit'}
              </p>
              <h2 className="mt-5 text-4xl leading-[0.95] font-black tracking-[-0.055em] sm:text-6xl">
                {locale === 'fr'
                  ? 'Chaque parcours mérite sa propre direction.'
                  : 'Every athlete. A different way to stand out.'}
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-black/50">
              {locale === 'fr'
                ? 'Explorez des profils complets, des identités visuelles et des façons concrètes de raconter un objectif sportif.'
                : 'Explore complete profiles, visual identities, and real ways to turn an athletic goal into a memorable story.'}
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {[
              [
                'athletes',
                locale === 'fr'
                  ? 'Sportifs, tous niveaux'
                  : 'Athletes, every level',
              ],
              ['coaches', locale === 'fr' ? 'Coachs' : 'Coaches'],
              [
                'transformations',
                locale === 'fr' ? 'Transformations' : 'Transformations',
              ],
            ].map(([focus, label]) => (
              <Link
                key={focus}
                href={`/inspiration?focus=${focus}` as '/inspiration'}
                className="rounded-full border border-black/15 px-4 py-2 text-xs font-bold transition hover:bg-[#151515] hover:text-white"
                data-marketing-cta="explore_audience"
                data-marketing-source="home_examples"
              >
                {label}
              </Link>
            ))}
          </div>
          <div className="-mx-5 mt-14 flex snap-x snap-mandatory [scrollbar-width:none] gap-4 overflow-x-auto px-5 pt-2 pb-8 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0 [&::-webkit-scrollbar]:hidden">
            {inspirationProfiles.map((athlete, index) => (
              <div
                className={`w-[82vw] max-w-[340px] shrink-0 snap-center sm:w-auto sm:max-w-none ${
                  index === 1 ? 'sm:translate-y-8' : ''
                }`}
                key={athlete.id}
              >
                <PublicProfilePreviewCard athlete={athlete} locale={locale} />
              </div>
            ))}
          </div>
          <div className="mt-14 text-center sm:mt-20">
            <Link
              className="inline-flex h-12 items-center gap-2 rounded-full bg-[#151515] px-6 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
              href="/inspiration"
            >
              {locale === 'fr'
                ? 'Explorer la galerie d’inspiration'
                : 'Explore the inspiration gallery'}
              <ArrowRightIcon className="h-4 w-4" weight="bold" />
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-black/10 bg-[#151515] text-white">
        <div className="mx-auto grid max-w-[1380px] grid-cols-1 px-5 sm:grid-cols-3 sm:px-8 lg:grid-cols-3 lg:px-12">
          {content.journey.map((point, index) => (
            <div
              className={`flex gap-4 border-white/10 py-6 sm:px-6 lg:py-7 ${
                index > 0 ? 'border-t sm:border-t-0' : ''
              } ${index > 0 ? 'sm:border-l' : ''}`}
              key={point[0]}
            >
              <span className="pt-0.5 text-[10px] font-black tracking-[0.14em] text-[#a9ed35]">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <p className="text-sm font-black">{point[0]}</p>
                <p className="mt-1 text-xs leading-5 text-white/45">
                  {point[1]}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-5 py-14 sm:px-8 lg:px-12 lg:py-20">
        <div className="mx-auto grid max-w-[1280px] items-center gap-14 lg:grid-cols-[0.72fr_1.28fr]">
          <div>
            <p className="text-xs font-black tracking-[0.18em] text-[#3157ff] uppercase">
              {content.editorEyebrow}
            </p>
            <h2 className="mt-5 text-4xl leading-[0.95] font-black tracking-[-0.055em] sm:text-6xl">
              {content.editorTitle1}
              <br />
              {content.editorTitle2}
            </h2>
            <p className="mt-6 max-w-lg text-base leading-7 text-black/55">
              {content.editorDescription}
            </p>
            <Link
              className="mt-7 inline-flex items-center gap-2 text-sm font-black"
              href="/sign-up"
              data-marketing-cta="create_free_profile"
              data-marketing-source="home_editor"
            >
              {content.editorCta}
              <ArrowRightIcon className="h-4 w-4" weight="bold" />
            </Link>
          </div>

          <EditorShowcase />
        </div>
      </section>

      <section
        className="bg-[#eeede7] px-5 py-14 sm:px-8 lg:px-12 lg:py-20"
        id="features"
      >
        <div className="mx-auto max-w-[1280px]">
          <div className="max-w-3xl">
            <p className="text-xs font-black tracking-[0.18em] text-[#3157ff] uppercase">
              {content.featuresEyebrow}
            </p>
            <h2 className="mt-5 text-4xl leading-[0.95] font-black tracking-[-0.055em] sm:text-6xl">
              {content.featuresTitle}
            </h2>
          </div>
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {localizedFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <article
                  className="rounded-[1.75rem] border border-black/8 bg-white p-6 sm:p-7"
                  key={feature.title}
                >
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${feature.color}`}
                  >
                    <Icon className="h-5 w-5" weight="bold" />
                  </span>
                  <h3 className="mt-8 text-xl font-black tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-black/50">
                    {feature.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section
        className="bg-[#3157ff] px-5 py-10 text-white sm:px-8 lg:px-12"
        id="analytics"
      >
        <div className="mx-auto flex max-w-[1280px] flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
              {locale === 'fr'
                ? 'Découvrez ce qui intéresse votre audience.'
                : 'See what interests your audience.'}
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/80">
              {locale === 'fr'
                ? 'Vues, visiteurs et clics : les statistiques essentielles sont incluses pour comprendre comment votre profil est consulté.'
                : 'Views, visitors, and clicks: essential analytics are included to understand how people use your profile.'}
            </p>
          </div>
          <Link
            className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-black text-[#151515]"
            href="/sign-up"
            data-marketing-cta="create_free_profile"
            data-marketing-source="home_analytics"
          >
            {content.createProfile}
            <ArrowRightIcon className="h-4 w-4" weight="bold" />
          </Link>
        </div>
      </section>

      <section className="px-5 py-14 sm:px-8 lg:px-12 lg:py-20" id="pricing">
        <div className="mx-auto grid max-w-[1050px] gap-8 rounded-[2rem] bg-[#eaf8d1] p-7 sm:p-12 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="text-xs font-black tracking-[0.14em] text-[#3157ff] uppercase">
              {locale === 'fr'
                ? 'Tout pour commencer'
                : 'Everything to get started'}
            </p>
            <h2 className="mt-4 text-4xl font-black tracking-tight">
              {locale === 'fr'
                ? 'Votre profil complet. Gratuit.'
                : 'Your complete profile. Free.'}
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-black/65">
              {locale === 'fr'
                ? 'Un profil public, 4 modèles, vos objectifs, résultats, photos, liens et statistiques essentielles. Sans période d’essai ni carte bancaire.'
                : 'One public profile, 4 templates, your goals, results, photos, links, and essential analytics. No trial or card required.'}
            </p>
            <p className="mt-3 text-xs leading-5 text-black/55">
              {locale === 'fr'
                ? 'Envie de plus de personnalisation ? Vous pourrez passer Pro plus tard.'
                : 'Want more customization? You can upgrade to Pro later.'}
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <Link
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#151515] px-6 text-sm font-black text-white"
              href="/sign-up"
              data-marketing-cta="create_free_profile"
              data-marketing-source="home_free_offer"
            >
              {content.createProfile}
              <ArrowRightIcon className="h-4 w-4" weight="bold" />
            </Link>
            <Link
              className="text-center text-xs font-bold underline underline-offset-4"
              href="/pricing"
              data-marketing-cta="compare_plans"
              data-marketing-source="home_free_offer"
            >
              {locale === 'fr'
                ? 'Comparer les offres Free et Pro'
                : 'Compare Free and Pro'}
            </Link>
          </div>
        </div>
      </section>

      <section
        className="border-t border-black/10 bg-white px-5 py-14 sm:px-8 lg:px-12 lg:py-20"
        id="faq"
      >
        <div className="mx-auto grid max-w-[1180px] gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="text-xs font-black tracking-[0.18em] text-[#3157ff] uppercase">
              {content.faqEyebrow}
            </p>
            <h2 className="mt-5 max-w-lg text-4xl leading-[0.95] font-black tracking-[-0.055em] sm:text-6xl">
              {content.faqTitle}
            </h2>
            <p className="mt-6 max-w-md text-sm leading-6 text-black/50">
              {content.faqDescription}
            </p>
          </div>

          <div className="border-t border-black/12">
            {content.faq.map((item, index) => (
              <details
                className="group border-b border-black/12"
                key={item[0]}
                name="homepage-faq"
                open={index === 0}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-left marker:hidden sm:py-7 [&::-webkit-details-marker]:hidden">
                  <span className="text-base font-black tracking-[-0.02em] sm:text-lg">
                    {item[0]}
                  </span>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-black/12 bg-[#f7f6f1] transition-[transform,background-color,color] duration-300 group-open:rotate-180 group-open:bg-[#151515] group-open:text-white">
                    <CaretDownIcon className="h-4 w-4" weight="bold" />
                  </span>
                </summary>
                <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 group-open:grid-rows-[1fr]">
                  <div className="overflow-hidden">
                    <p className="max-w-2xl pr-12 pb-7 text-sm leading-7 text-black/52 sm:text-base">
                      {item[1]}
                    </p>
                  </div>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-black/10 bg-[#a9ed35] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto flex max-w-[1180px] flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <DeviceMobileIcon className="h-9 w-9" weight="fill" />
            <h2 className="mt-6 max-w-4xl text-5xl leading-[0.9] font-black tracking-[-0.065em] sm:text-7xl">
              {content.finalTitle}
            </h2>
          </div>
          <div className="shrink-0">
            <Link
              className="inline-flex h-13 items-center gap-2 rounded-full bg-[#151515] px-7 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
              href="/sign-up"
              data-marketing-cta="create_free_profile"
              data-marketing-source="home_final"
            >
              {content.createProfile}
              <ArrowRightIcon className="h-4 w-4" weight="bold" />
            </Link>
            <p className="mt-3 text-center text-xs font-bold text-black/55">
              {content.freeNote}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
