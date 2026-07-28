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
import { launchOffer } from '@/lib/constants/billing';
import { getRequestLocale } from '@/lib/i18n/server';
import { getMarketingHomeContent } from '@/lib/i18n/marketing-home';
import {
  HeroProfileCollage,
  TemplateProfileGallery,
} from './athlete-profile-showcase';
import { EditorShowcase } from './editor-showcase';
import { LazyAnalyticsShowcase } from './lazy-analytics-showcase';
import { HomePricingCards } from './home-pricing-cards';

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

export default async function HomePage() {
  const locale = await getRequestLocale();
  const content = getMarketingHomeContent(locale);
  const localizedFeatures = featureCards.map((feature, index) => ({
    ...feature,
    title: content.features[index][0],
    description: content.features[index][1],
  }));

  return (
    <main className="overflow-hidden">
      <section className="relative border-b border-black/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_16%,rgba(169,237,53,0.35),transparent_25%),radial-gradient(circle_at_85%_30%,rgba(49,87,255,0.18),transparent_28%)]" />
        <div className="relative mx-auto grid min-h-[calc(100svh-4.5rem)] max-w-[1380px] items-center gap-14 px-5 py-16 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-12 lg:py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3 py-1.5 text-xs font-bold backdrop-blur">
              <SparkleIcon className="h-4 w-4 text-[#3157ff]" weight="fill" />
              {content.badge}
            </div>
            <h1 className="mt-7 text-[clamp(3.6rem,8vw,7.5rem)] leading-[0.86] font-black tracking-[-0.075em]">
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
                href="/sign-up"
              >
                {content.createProfile}
                <ArrowRightIcon className="h-4 w-4" weight="bold" />
              </Link>
              <a
                className="inline-flex h-13 items-center justify-center rounded-full border border-black/15 bg-white/55 px-7 text-sm font-bold transition-colors hover:bg-white"
                href="#templates"
              >
                {content.exploreTemplates}
              </a>
            </div>

            <Link
              className="mt-5 inline-flex items-center gap-2 text-xs font-black text-[#3157ff] hover:underline"
              href="/pricing#launch-offer"
            >
              <span className="rounded-full bg-[#a9ed35] px-2 py-1 text-[9px] tracking-[0.12em] text-[#151515] uppercase">
                {locale === 'fr' ? 'Lancement' : 'Launch'}
              </span>
              {content.launchAnnual}{' '}
              <span className="text-black/35 line-through">
                {launchOffer.regularAnnualPrice}
              </span>{' '}
              {launchOffer.firstYearPrice} · {launchOffer.athleteLimit}{' '}
              {content.firstAthletes}
            </Link>

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

      <section className="border-b border-black/10 bg-[#151515] text-white">
        <div className="mx-auto grid max-w-[1380px] grid-cols-1 px-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-4 lg:px-12">
          {content.journey.map((point, index) => (
            <div
              className={`flex gap-4 border-white/10 py-6 sm:px-6 lg:py-7 ${
                index > 0 ? 'border-t sm:border-t-0' : ''
              } ${index % 2 === 1 ? 'sm:border-l' : ''} ${
                index > 1 ? 'sm:border-t lg:border-t-0' : ''
              } ${index > 0 ? 'lg:border-l' : ''}`}
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

      <section className="px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
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
            >
              {content.editorCta}
              <ArrowRightIcon className="h-4 w-4" weight="bold" />
            </Link>
          </div>

          <EditorShowcase />
        </div>
      </section>

      <section
        className="bg-[#eeede7] px-5 py-24 sm:px-8 lg:px-12 lg:py-32"
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

      <section className="px-5 py-24 sm:px-8 lg:px-12 lg:py-32" id="templates">
        <div className="mx-auto max-w-[1280px]">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-3xl">
              <p className="text-xs font-black tracking-[0.18em] text-[#3157ff] uppercase">
                {content.templatesEyebrow}
              </p>
              <h2 className="mt-5 text-4xl leading-[0.95] font-black tracking-[-0.055em] sm:text-6xl">
                {content.templatesTitle}
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-black/50">
              {content.templatesDescription}
            </p>
          </div>
          <TemplateProfileGallery />
          <div className="mt-10 text-center">
            <Link
              className="inline-flex h-11 items-center gap-2 rounded-full border border-black/15 bg-white px-5 text-sm font-bold hover:bg-black hover:text-white"
              href="/sign-up"
            >
              {content.templatesCta}
              <ArrowRightIcon className="h-4 w-4" weight="bold" />
            </Link>
          </div>
        </div>
      </section>

      <section
        className="bg-[#3157ff] px-5 py-24 text-white sm:px-8 lg:px-12 lg:py-32"
        id="analytics"
      >
        <div className="mx-auto grid max-w-[1280px] items-center gap-14 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-black tracking-[0.18em] text-[#b9cdff] uppercase">
              {content.analyticsEyebrow}
            </p>
            <h2 className="mt-5 text-4xl leading-[0.95] font-black tracking-[-0.055em] sm:text-6xl">
              {content.analyticsTitle}
            </h2>
            <p className="mt-6 max-w-lg text-base leading-7 text-white/65">
              {content.analyticsDescription}
            </p>
            <div className="mt-8 grid max-w-md grid-cols-2 gap-3">
              {['2.4K', '18.6%', '742', '186'].map((value, index) => (
                <div
                  className="rounded-2xl bg-white/10 p-4"
                  key={content.analyticsStats[index]}
                >
                  <p className="text-2xl font-black">{value}</p>
                  <p className="mt-1 text-[10px] font-bold text-white/50 uppercase">
                    {content.analyticsStats[index]}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <LazyAnalyticsShowcase />
        </div>
      </section>

      <section className="px-5 py-24 sm:px-8 lg:px-12 lg:py-32" id="pricing">
        <div className="mx-auto max-w-[1050px]">
          <div className="text-center">
            <p className="text-xs font-black tracking-[0.18em] text-[#3157ff] uppercase">
              {content.pricingEyebrow}
            </p>
            <h2 className="mt-5 text-4xl font-black tracking-[-0.055em] sm:text-6xl">
              {content.pricingTitle}
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-black/50">
              {content.launchOffer} {launchOffer.athleteLimit}{' '}
              {content.firstAthletes}: Pro Annual{' '}
              <span className="line-through">
                {launchOffer.regularAnnualPrice}
              </span>{' '}
              <strong className="text-black">
                {launchOffer.firstYearPrice}
              </strong>{' '}
              {content.withCode}{' '}
              <strong className="font-mono text-[#3157ff]">
                {launchOffer.code}
              </strong>
              . {content.saveCompared} {launchOffer.savingsVsMonthly}{' '}
              {content.comparedMonthly}
            </p>
          </div>
          <HomePricingCards />
          <div className="mt-8 text-center">
            <Link
              className="inline-flex h-11 items-center gap-2 rounded-full border border-black/15 bg-white px-5 text-sm font-bold transition-colors hover:bg-black hover:text-white"
              href="/pricing"
            >
              {content.compareFeatures}
              <ArrowRightIcon className="h-4 w-4" weight="bold" />
            </Link>
          </div>
        </div>
      </section>

      <section
        className="border-t border-black/10 bg-white px-5 py-24 sm:px-8 lg:px-12 lg:py-32"
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
          <Link
            className="inline-flex h-13 shrink-0 items-center gap-2 rounded-full bg-[#151515] px-7 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
            href="/sign-up"
          >
            {content.createProfile}
            <ArrowRightIcon className="h-4 w-4" weight="bold" />
          </Link>
        </div>
      </section>
    </main>
  );
}
