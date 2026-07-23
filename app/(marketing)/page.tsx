import Link from 'next/link';
import {
  ArrowRightIcon,
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
import { EditorShowcase } from './editor-showcase';

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

const templateCards = [
  {
    name: 'Spotlight',
    background: 'bg-[#f5f2ea]',
    accent: 'bg-[#3157ff]',
    text: 'text-[#151515]',
  },
  {
    name: 'Obsidian',
    background: 'bg-[#151515]',
    accent: 'bg-[#b7f43c]',
    text: 'text-white',
  },
  {
    name: 'Impact',
    background: 'bg-[#be2e35]',
    accent: 'bg-[#fff4e8]',
    text: 'text-white',
  },
  {
    name: 'Horizon',
    background: 'bg-[#f2e7d3]',
    accent: 'bg-[#ed6b2f]',
    text: 'text-[#172554]',
  },
] as const;

function ProfilePhone({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`relative mx-auto w-full overflow-hidden rounded-[2.6rem] border-[9px] border-[#171717] bg-[#f3efe5] shadow-[0_30px_80px_rgba(20,20,20,0.28)] ${
        compact ? 'max-w-[250px]' : 'max-w-[330px]'
      }`}
    >
      <div className="h-7 bg-[#171717]" />
      <div className="relative overflow-hidden bg-[#3157ff] px-5 pt-7 pb-8 text-white">
        <div className="absolute -top-14 -right-12 h-40 w-40 rounded-full border-[28px] border-[#a9ed35]/90" />
        <div className="relative flex items-start justify-between">
          <div className="h-16 w-16 rounded-full border-4 border-white bg-[linear-gradient(135deg,#f0c2a0,#7a4d34)]" />
          <div className="flex gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-xs">
              +
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-xs">
              ↗
            </span>
          </div>
        </div>
        <p className="relative mt-5 text-xl font-black tracking-tight">
          Maya Chen
        </p>
        <p className="relative mt-1 text-xs text-white/70">
          Building toward the next finish line.
        </p>
        <div className="relative mt-4 flex gap-1.5">
          <span className="rounded-full bg-white/15 px-2.5 py-1 text-[9px] font-bold">
            RUNNING
          </span>
          <span className="rounded-full bg-white/15 px-2.5 py-1 text-[9px] font-bold">
            BANGKOK
          </span>
        </div>
      </div>
      <div className="space-y-3 p-4">
        <div className="rounded-2xl bg-[#a9ed35] p-4 text-[#151515]">
          <p className="text-[9px] font-black tracking-[0.2em] uppercase">
            Next objective
          </p>
          <p className="mt-2 text-lg font-black">First marathon</p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-black/15">
            <div className="h-full w-3/4 rounded-full bg-black" />
          </div>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-sm font-bold">My latest training update</p>
          <p className="mt-1 text-[10px] text-black/45">
            The work behind the goal.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="h-20 rounded-2xl bg-[linear-gradient(135deg,#ffb174,#f05e49)]" />
          <div className="h-20 rounded-2xl bg-[linear-gradient(135deg,#bfd1ff,#536edb)]" />
        </div>
      </div>
    </div>
  );
}

function TemplateMiniature({
  template,
}: {
  template: (typeof templateCards)[number];
}) {
  return (
    <article>
      <div
        className={`${template.background} ${template.text} aspect-[9/16] overflow-hidden rounded-[2rem] border-[5px] border-[#151515] p-4 shadow-[0_18px_35px_rgba(20,20,20,0.15)]`}
      >
        <div className="flex items-center justify-between text-[10px]">
          <span>+</span>
          <span>↗</span>
        </div>
        <div className="mx-auto mt-7 h-16 w-16 rounded-full bg-[linear-gradient(135deg,#dab08d,#593b2c)] ring-4 ring-white/30" />
        <p className="mt-4 text-center text-sm font-black">Jordan Lee</p>
        <p className="mx-auto mt-2 max-w-36 text-center text-[8px] leading-4 opacity-60">
          Training, goals, results, and everything happening next.
        </p>
        <div className="mt-6 space-y-2.5">
          <div className={`${template.accent} h-12 rounded-xl`} />
          <div className="h-12 rounded-xl bg-white/70" />
          <div className="grid grid-cols-2 gap-2.5">
            <div className="h-16 rounded-xl bg-white/50" />
            <div className={`${template.accent} h-16 rounded-xl opacity-75`} />
          </div>
        </div>
      </div>
      <p className="mt-4 text-center text-sm font-bold">{template.name}</p>
    </article>
  );
}

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

          <div className="relative mx-auto w-full max-w-[610px] py-6 lg:py-0">
            <div className="absolute top-12 left-4 hidden w-[250px] -rotate-8 opacity-85 sm:block lg:left-0">
              <div className="aspect-[9/16] rounded-[2.6rem] border-[9px] border-[#171717] bg-[#f0c8ba] p-5 shadow-2xl">
                <div className="h-32 rounded-3xl bg-[#be2e35]" />
                <div className="mx-auto -mt-9 h-18 w-18 rounded-full border-4 border-[#f0c8ba] bg-[#f6dbb5]" />
                <div className="mx-auto mt-5 h-3 w-24 rounded-full bg-black/75" />
                <div className="mx-auto mt-3 h-2 w-32 rounded-full bg-black/20" />
                <div className="mt-8 space-y-3">
                  <div className="h-14 rounded-2xl bg-white/80" />
                  <div className="h-14 rounded-2xl bg-[#be2e35]" />
                  <div className="h-14 rounded-2xl bg-white/80" />
                </div>
              </div>
            </div>
            <div className="relative z-10 ml-auto max-w-[330px] sm:mr-4 lg:mr-8">
              <ProfilePhone />
            </div>
            <div className="absolute right-0 bottom-20 z-20 rounded-2xl border border-black/10 bg-white p-4 shadow-xl sm:right-[-1rem]">
              <p className="text-[10px] font-bold tracking-wider text-black/40 uppercase">
                This month
              </p>
              <p className="mt-1 text-2xl font-black">2.4K</p>
              <p className="mt-1 text-[10px] font-bold text-emerald-600">
                ↑ 28% profile views
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-black/10 bg-[#151515] py-5 text-white">
        <div className="mx-auto flex max-w-[1380px] flex-wrap justify-center gap-x-10 gap-y-3 px-5 text-xs font-bold tracking-[0.14em] text-white/55 uppercase sm:px-8 lg:px-12">
          <span>Running</span>
          <span>HYROX</span>
          <span>Gym & CrossFit</span>
          <span>Cycling & Triathlon</span>
          <span>Boxing & MMA</span>
          <span>Football & Team sports</span>
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
              Start with a visual direction, then adapt every word, color, and
              block to your sport and personality.
            </p>
          </div>
          <div className="mt-14 grid grid-cols-2 gap-5 sm:grid-cols-4 lg:gap-8">
            {templateCards.map((template) => (
              <TemplateMiniature key={template.name} template={template} />
            ))}
          </div>
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

          <div className="rounded-[2rem] bg-[#f9f9f6] p-5 text-[#151515] shadow-2xl sm:p-7">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-black">Profile performance</p>
                <p className="mt-1 text-[10px] text-black/40">Last 30 days</p>
              </div>
              <span className="rounded-full bg-[#e8edff] px-3 py-1.5 text-[10px] font-bold text-[#3157ff]">
                Daily
              </span>
            </div>
            <div className="mt-8 flex h-64 items-end gap-2 border-b border-black/10 sm:gap-3">
              {[28, 38, 32, 48, 44, 62, 55, 72, 65, 84, 76, 94].map(
                (height, index) => (
                  <div
                    className="flex h-full flex-1 items-end"
                    key={`${height}-${index}`}
                  >
                    <div
                      className={`w-full rounded-t-lg ${index > 8 ? 'bg-[#a9ed35]' : 'bg-[#3157ff]'}`}
                      style={{ height: `${height}%` }}
                    />
                  </div>
                ),
              )}
            </div>
            <div className="mt-5 flex flex-wrap gap-5 text-[10px] font-bold text-black/45">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#3157ff]" /> Views
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#a9ed35]" /> Clicks
              </span>
              <span className="ml-auto flex items-center gap-1 text-emerald-600">
                <ChartLineUpIcon className="h-4 w-4" weight="bold" /> +28%
              </span>
            </div>
          </div>
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
          <div className="mt-14 grid gap-5 md:grid-cols-2">
            {(['free', 'pro'] as const).map((plan) => {
              const planData = subscriptionPlans[plan];
              const isPro = plan === 'pro';
              return (
                <article
                  className={`relative rounded-[2rem] border p-7 sm:p-9 ${
                    isPro
                      ? 'border-[#151515] bg-[#151515] text-white shadow-2xl'
                      : 'border-black/10 bg-white'
                  }`}
                  key={plan}
                >
                  {isPro ? (
                    <span className="absolute top-6 right-6 rounded-full bg-[#a9ed35] px-3 py-1 text-[10px] font-black text-[#151515] uppercase">
                      Most flexible
                    </span>
                  ) : null}
                  <p className="text-sm font-black">{planData.name}</p>
                  <p className="mt-4 text-4xl font-black tracking-tight">
                    {planData.price}
                  </p>
                  <p
                    className={`mt-4 text-sm leading-6 ${isPro ? 'text-white/55' : 'text-black/50'}`}
                  >
                    {planData.description}
                  </p>
                  <ul className="mt-8 space-y-3">
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
                    className={`mt-9 inline-flex h-11 w-full items-center justify-center rounded-full text-sm font-bold ${isPro ? 'bg-white text-black' : 'bg-[#3157ff] text-white'}`}
                    href="/sign-up"
                  >
                    {isPro ? 'Start with Pro' : 'Build for free'}
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
