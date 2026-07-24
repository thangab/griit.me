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
import { subscriptionPlans } from '@/lib/constants/billing';
import {
  HeroProfileCollage,
  TemplateProfileGallery,
} from './athlete-profile-showcase';
import { EditorShowcase } from './editor-showcase';
import { LazyAnalyticsShowcase } from './lazy-analytics-showcase';

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

const journeyPoints = [
  {
    number: '01',
    title: 'Lead with the goal',
    description: 'Give people a reason to follow the journey.',
  },
  {
    number: '02',
    title: 'Own your identity',
    description: 'Build a profile that feels unmistakably yours.',
  },
  {
    number: '03',
    title: 'Show the work',
    description: 'Bring results, training, and content together.',
  },
  {
    number: '04',
    title: 'Create opportunities',
    description: 'Turn attention into partnerships and support.',
  },
] as const;

const faqItems = [
  {
    question: 'Can I build and publish a profile for free?',
    answer:
      'Yes. The Free plan includes one public athlete profile, every core block, four templates, essential styles, and the key analytics you need to get started.',
  },
  {
    question: 'Is Griit only for professional athletes?',
    answer:
      'Not at all. Griit is built for athletes at every level—from someone preparing for a first race to a professional building a stronger public presence.',
  },
  {
    question: 'Can I use Griit for any sport?',
    answer:
      'Yes. You can select from a broad sport directory, combine multiple disciplines, or add your own sport when it is not listed.',
  },
  {
    question: 'How much can I customize my profile?',
    answer:
      'Every profile lets you change its content, wording, template, and core visual direction. Pro unlocks every template and typography style, plus custom colors, shapes, textures, gallery layouts, and advanced appearance controls.',
  },
  {
    question: 'What analytics are included?',
    answer:
      'Free includes profile views, unique visitors, clicks, and click-through rate. Pro adds deeper audience, campaign, social, and individual block analytics.',
  },
  {
    question: 'Can I manage more than one athlete profile?',
    answer:
      'Yes. Pro lets you create and manage up to five independent public profiles from the same account, each with its own content, design, URL, and analytics.',
  },
  {
    question: 'Can I pay for Pro annually?',
    answer:
      'Yes. Pro is $5 per month or $48 per year. Annual billing works out to $4 per month and saves $12 every year, which is 20% off.',
  },
  {
    question: 'Can I use my own domain?',
    answer:
      'Custom domains and downloadable QR codes are planned for Pro. They are marked as coming soon while we finish making the setup reliable and simple.',
  },
  {
    question: 'What if I manage a club or a group of athletes?',
    answer:
      'Griit Teams is designed for clubs, academies, agencies, coaches, and athlete managers. It offers a tailored workspace with multiple members, shared branding, organization analytics, and centralized management.',
  },
] as const;

export default function HomePage() {
  return (
    <main className="overflow-hidden">
      <section className="relative border-b border-black/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_16%,rgba(169,237,53,0.35),transparent_25%),radial-gradient(circle_at_85%_30%,rgba(49,87,255,0.18),transparent_28%)]" />
        <div className="relative mx-auto grid min-h-[calc(100svh-4.5rem)] max-w-[1380px] items-center gap-14 px-5 py-16 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-12 lg:py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3 py-1.5 text-xs font-bold backdrop-blur">
              <SparkleIcon className="h-4 w-4 text-[#3157ff]" weight="fill" />
              The link in bio built for athletes
            </div>
            <h1 className="mt-7 text-[clamp(3.6rem,8vw,7.5rem)] leading-[0.86] font-black tracking-[-0.075em]">
              Your next goal.
              <br />
              Your athlete <span className="text-[#3157ff]">story.</span>
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-8 text-black/58 sm:text-xl">
              Build a powerful public profile around what you are chasing, what
              you have achieved, and where you are going next.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                className="inline-flex h-13 items-center justify-center gap-2 rounded-full bg-[#151515] px-7 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
                href="/sign-up"
              >
                Create your athlete profile
                <ArrowRightIcon className="h-4 w-4" weight="bold" />
              </Link>
              <a
                className="inline-flex h-13 items-center justify-center rounded-full border border-black/15 bg-white/55 px-7 text-sm font-bold transition-colors hover:bg-white"
                href="#templates"
              >
                Explore templates
              </a>
            </div>

            <div className="mt-9 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-black/48">
              {[
                'Free to start',
                'Works for every sport',
                'Mobile first',
                'No code',
              ].map((item) => (
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
          {journeyPoints.map((point, index) => (
            <div
              className={`flex gap-4 border-white/10 py-6 sm:px-6 lg:py-7 ${
                index > 0 ? 'border-t sm:border-t-0' : ''
              } ${index % 2 === 1 ? 'sm:border-l' : ''} ${
                index > 1 ? 'sm:border-t lg:border-t-0' : ''
              } ${index > 0 ? 'lg:border-l' : ''}`}
              key={point.number}
            >
              <span className="pt-0.5 text-[10px] font-black tracking-[0.14em] text-[#a9ed35]">
                {point.number}
              </span>
              <div>
                <p className="text-sm font-black">{point.title}</p>
                <p className="mt-1 text-xs leading-5 text-white/45">
                  {point.description}
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
              Built around your story
            </p>
            <h2 className="mt-5 text-4xl leading-[0.95] font-black tracking-[-0.055em] sm:text-6xl">
              Everything you need.
              <br />
              One clear editor.
            </h2>
            <p className="mt-6 max-w-lg text-base leading-7 text-black/55">
              Shape your profile, organize your content, and see every change as
              it happens. No code, no disconnected tools, and no guessing what
              visitors will see.
            </p>
            <Link
              className="mt-7 inline-flex items-center gap-2 text-sm font-black"
              href="/sign-up"
            >
              Build your athlete profile
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
              More than a link in bio
            </p>
            <h2 className="mt-5 text-4xl leading-[0.95] font-black tracking-[-0.055em] sm:text-6xl">
              Everything an athlete needs to tell the full story.
            </h2>
          </div>
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featureCards.map((feature) => {
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
                Every athlete is different
              </p>
              <h2 className="mt-5 text-4xl leading-[0.95] font-black tracking-[-0.055em] sm:text-6xl">
                A profile that looks like your ambition.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-black/50">
              These are real Griit profile layouts. Start with a complete visual
              direction, then adapt every word, color, and block to your story.
            </p>
          </div>
          <TemplateProfileGallery />
          <div className="mt-10 text-center">
            <Link
              className="inline-flex h-11 items-center gap-2 rounded-full border border-black/15 bg-white px-5 text-sm font-bold hover:bg-black hover:text-white"
              href="/sign-up"
            >
              Explore all templates
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
              Grow your athlete presence
            </p>
            <h2 className="mt-5 text-4xl leading-[0.95] font-black tracking-[-0.055em] sm:text-6xl">
              See what moves your audience.
            </h2>
            <p className="mt-6 max-w-lg text-base leading-7 text-white/65">
              Track views, clicks, traffic sources, and audience behavior. See
              which goals, partnerships, and stories create real engagement.
            </p>
            <div className="mt-8 grid max-w-md grid-cols-2 gap-3">
              {[
                ['2.4K', 'Profile views'],
                ['18.6%', 'Click-through rate'],
                ['742', 'Unique visitors'],
                ['186', 'Block clicks'],
              ].map(([value, label]) => (
                <div className="rounded-2xl bg-white/10 p-4" key={label}>
                  <p className="text-2xl font-black">{value}</p>
                  <p className="mt-1 text-[10px] font-bold text-white/50 uppercase">
                    {label}
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
              Simple pricing
            </p>
            <h2 className="mt-5 text-4xl font-black tracking-[-0.055em] sm:text-6xl">
              Start free. Grow with your goals.
            </h2>
          </div>
          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {(['free', 'pro', 'teams'] as const).map((plan) => {
              const planData = subscriptionPlans[plan];
              const isPro = plan === 'pro';
              const isTeams = plan === 'teams';
              return (
                <article
                  className={`relative flex flex-col rounded-[2rem] border p-7 sm:p-9 ${
                    isPro
                      ? 'border-[#151515] bg-[#151515] text-white shadow-2xl'
                      : isTeams
                        ? 'border-[#3157ff]/25 bg-[#e8edff]'
                        : 'border-black/10 bg-white'
                  }`}
                  key={plan}
                >
                  {isPro ? (
                    <span className="absolute top-6 right-6 rounded-full bg-[#a9ed35] px-3 py-1 text-[10px] font-black text-[#151515] uppercase">
                      Most flexible
                    </span>
                  ) : isTeams ? (
                    <span className="absolute top-6 right-6 rounded-full bg-[#3157ff] px-3 py-1 text-[10px] font-black text-white uppercase">
                      Organizations
                    </span>
                  ) : null}
                  <p className="text-sm font-black">{planData.name}</p>
                  <p className="mt-4 text-4xl font-black tracking-tight">
                    {planData.price}
                  </p>
                  {isPro ? (
                    <p className="mt-2 text-xs font-bold text-[#a9ed35]">
                      Or {subscriptionPlans.pro.prices.year} ·{' '}
                      {subscriptionPlans.pro.annualSavings}
                    </p>
                  ) : null}
                  <p
                    className={`mt-4 text-sm leading-6 ${isPro ? 'text-white/55' : 'text-black/50'}`}
                  >
                    {planData.description}
                  </p>
                  <ul className="mt-8 flex-1 space-y-3">
                    {planData.features.map((feature) => (
                      <li
                        className="flex items-center gap-3 text-sm"
                        key={feature}
                      >
                        <span
                          className={`flex h-5 w-5 items-center justify-center rounded-full ${isPro ? 'bg-[#a9ed35] text-black' : 'bg-[#e8edff] text-[#3157ff]'}`}
                        >
                          <CheckIcon className="h-3 w-3" weight="bold" />
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    className={`mt-9 inline-flex h-11 w-full items-center justify-center rounded-full text-sm font-bold ${isPro ? 'bg-white text-black' : isTeams ? 'bg-[#151515] text-white' : 'bg-[#3157ff] text-white'}`}
                    href={
                      isTeams
                        ? 'mailto:hello@griit.me?subject=Griit%20Teams'
                        : '/sign-up'
                    }
                  >
                    {isTeams
                      ? 'Talk to us'
                      : isPro
                        ? 'Start with Pro'
                        : 'Build for free'}
                  </Link>
                </article>
              );
            })}
          </div>
          <div className="mt-8 text-center">
            <Link
              className="inline-flex h-11 items-center gap-2 rounded-full border border-black/15 bg-white px-5 text-sm font-bold transition-colors hover:bg-black hover:text-white"
              href="/pricing"
            >
              Compare every feature
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
              Questions, answered
            </p>
            <h2 className="mt-5 max-w-lg text-4xl leading-[0.95] font-black tracking-[-0.055em] sm:text-6xl">
              Everything before your first rep.
            </h2>
            <p className="mt-6 max-w-md text-sm leading-6 text-black/50">
              The essentials about creating, publishing, and growing your
              athlete profile.
            </p>
          </div>

          <div className="border-t border-black/12">
            {faqItems.map((item, index) => (
              <details
                className="group border-b border-black/12"
                key={item.question}
                name="homepage-faq"
                open={index === 0}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-left marker:hidden sm:py-7 [&::-webkit-details-marker]:hidden">
                  <span className="text-base font-black tracking-[-0.02em] sm:text-lg">
                    {item.question}
                  </span>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-black/12 bg-[#f7f6f1] transition-[transform,background-color,color] duration-300 group-open:rotate-180 group-open:bg-[#151515] group-open:text-white">
                    <CaretDownIcon className="h-4 w-4" weight="bold" />
                  </span>
                </summary>
                <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 group-open:grid-rows-[1fr]">
                  <div className="overflow-hidden">
                    <p className="max-w-2xl pr-12 pb-7 text-sm leading-7 text-black/52 sm:text-base">
                      {item.answer}
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
              Give your next goal a place to live.
            </h2>
          </div>
          <Link
            className="inline-flex h-13 shrink-0 items-center gap-2 rounded-full bg-[#151515] px-7 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
            href="/sign-up"
          >
            Create your athlete profile
            <ArrowRightIcon className="h-4 w-4" weight="bold" />
          </Link>
        </div>
      </section>
    </main>
  );
}
