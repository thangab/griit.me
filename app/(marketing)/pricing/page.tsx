import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRightIcon,
  ChartLineUpIcon,
  CheckIcon,
  GlobeIcon,
  LightningIcon,
  LinkIcon,
  PaletteIcon,
  SparkleIcon,
  SquaresFourIcon,
} from '@phosphor-icons/react/ssr';
import { subscriptionPlans } from '@/lib/constants/billing';
import { createServerSupabaseClient } from '@/lib/config/supabase-server';

export const metadata: Metadata = {
  title: 'Pricing — Griit',
  description:
    'Compare Griit Free and Pro plans. Build an athlete profile for free, then unlock multiple profiles, advanced customization, and detailed analytics.',
};

const plans = [
  {
    id: 'free',
    name: subscriptionPlans.free.name,
    price: subscriptionPlans.free.price,
    cadence: 'forever',
    description:
      'Everything you need to publish a complete athlete profile and start sharing your story.',
    eyebrow: 'Start your profile',
    features: [
      '1 complete public profile',
      'Goals, activities, achievements, and gallery',
      'Social, media, sponsor, and affiliate blocks',
      'Core templates and customization',
      'Profile views and click overview',
    ],
  },
  {
    id: 'pro',
    name: subscriptionPlans.pro.name,
    price: subscriptionPlans.pro.price.replace(' / month', ''),
    cadence: 'per month',
    description:
      'For athletes, coaches, teams, and creators who need more profiles, content, and insight.',
    eyebrow: 'Unlock your full toolkit',
    features: [
      'Up to 5 independent public profiles',
      'Multiple goals and expanded content limits',
      'All typography and advanced style options',
      'Audience, source, device, and browser analytics',
      'Detailed social and block interaction data',
    ],
  },
] as const;

const comparisonRows = [
  { label: 'Public profiles', free: '1', pro: 'Up to 5' },
  { label: 'Public griit.me address', free: true, pro: true },
  { label: 'Core content blocks', free: true, pro: true },
  { label: 'Goals', free: '1', pro: 'Multiple' },
  { label: 'Gallery images', free: 'Up to 3', pro: 'Expanded' },
  { label: 'Achievements', free: 'Up to 3', pro: 'Expanded' },
  { label: 'Activities', free: 'Up to 3', pro: 'Expanded' },
  { label: 'Templates', free: true, pro: true },
  { label: 'Advanced typography and layouts', free: false, pro: true },
  { label: 'Views and clicks overview', free: true, pro: true },
  { label: 'Audience and traffic analytics', free: false, pro: true },
  { label: 'Block and social interaction details', free: false, pro: true },
  { label: 'Profile management and switching', free: false, pro: true },
] as const;

const sharedBenefits = [
  {
    icon: SquaresFourIcon,
    title: 'A complete athlete page',
    description:
      'Bring goals, results, activities, media, links, sponsors, and offers into one focused profile.',
    color: 'bg-[#e8e0ff]',
  },
  {
    icon: PaletteIcon,
    title: 'A design that feels like you',
    description:
      'Start from a template, then adjust the header, colors, type, shapes, and blocks around your identity.',
    color: 'bg-[#ffe0ce]',
  },
  {
    icon: ChartLineUpIcon,
    title: 'Analytics from day one',
    description:
      'Understand whether people view your profile and which links or content turn attention into action.',
    color: 'bg-[#cfe4ff]',
  },
  {
    icon: LinkIcon,
    title: 'Built for opportunities',
    description:
      'Show current partners, share affiliate offers, and make it easy for a future sponsor to reach you.',
    color: 'bg-[#dff5b4]',
  },
] as const;

const faqs = [
  {
    question: 'Can I build a useful profile on Free?',
    answer:
      'Yes. Free includes one complete public profile with every core content type, templates, customization, and a basic analytics overview.',
  },
  {
    question: 'What happens when I upgrade?',
    answer:
      'Your existing profile stays exactly as it is. Pro immediately unlocks multiple profiles, higher content limits, advanced style options, and detailed analytics.',
  },
  {
    question: 'Who needs multiple profiles?',
    answer:
      'They are useful for coaches, teams, managers, multi-discipline creators, or anyone managing separate public identities from one account.',
  },
  {
    question: 'Does each Pro profile have separate analytics?',
    answer:
      'Yes. Every public profile keeps its own username, content, design, publication status, and analytics history.',
  },
] as const;

function ComparisonValue({ value }: { value: boolean | string }) {
  if (typeof value === 'string') {
    return <span className="text-sm font-semibold">{value}</span>;
  }

  return value ? (
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#dff5b4] text-[#151515]">
      <CheckIcon className="h-3.5 w-3.5" weight="bold" />
      <span className="sr-only">Included</span>
    </span>
  ) : (
    <span className="text-lg text-black/25" aria-label="Not included">
      —
    </span>
  );
}

export default async function PricingPage() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.auth.getSession();
  const isAuthenticated = Boolean(data.session);

  return (
    <main className="overflow-hidden">
      <section className="relative border-b border-black/10 px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(169,237,53,0.4),transparent_24%),radial-gradient(circle_at_82%_28%,rgba(49,87,255,0.2),transparent_26%)]" />
        <div className="relative mx-auto max-w-[1180px] text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3 py-1.5 text-xs font-bold backdrop-blur">
            <SparkleIcon className="h-4 w-4 text-[#3157ff]" weight="fill" />
            Simple plans. No complicated tiers.
          </div>
          <h1 className="mx-auto mt-7 max-w-5xl text-[clamp(3.4rem,8vw,7rem)] leading-[0.88] font-black tracking-[-0.07em]">
            Start free. Go further with{' '}
            <span className="text-[#3157ff]">Pro.</span>
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-black/55">
            Build a profile around your next goal today. Upgrade only when you
            need more profiles, more freedom, and deeper insight.
          </p>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto grid max-w-[1080px] gap-5 md:grid-cols-2">
          {plans.map((plan) => {
            const isPro = plan.id === 'pro';
            const href = isAuthenticated
              ? isPro
                ? '/dashboard/settings'
                : '/dashboard'
              : '/sign-up';

            return (
              <article
                className={`relative flex flex-col rounded-[2rem] border p-7 sm:p-9 ${
                  isPro
                    ? 'border-[#151515] bg-[#151515] text-white shadow-[0_30px_80px_rgba(20,20,20,0.22)]'
                    : 'border-black/10 bg-white'
                }`}
                key={plan.id}
              >
                {isPro ? (
                  <span className="absolute top-6 right-6 rounded-full bg-[#a9ed35] px-3 py-1 text-[10px] font-black text-[#151515] uppercase">
                    Best for growth
                  </span>
                ) : null}
                <p
                  className={`text-xs font-black tracking-[0.16em] uppercase ${isPro ? 'text-[#a9ed35]' : 'text-[#3157ff]'}`}
                >
                  {plan.eyebrow}
                </p>
                <h2 className="mt-5 text-3xl font-black">{plan.name}</h2>
                <div className="mt-5 flex items-end gap-2">
                  <span className="text-5xl font-black tracking-[-0.055em]">
                    {plan.price}
                  </span>
                  <span
                    className={`pb-1 text-sm ${isPro ? 'text-white/45' : 'text-black/45'}`}
                  >
                    {plan.cadence}
                  </span>
                </div>
                <p
                  className={`mt-5 max-w-md text-sm leading-6 ${isPro ? 'text-white/55' : 'text-black/50'}`}
                >
                  {plan.description}
                </p>
                <ul className="mt-8 flex-1 space-y-3.5">
                  {plan.features.map((feature) => (
                    <li
                      className="flex items-start gap-3 text-sm"
                      key={feature}
                    >
                      <span
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${isPro ? 'bg-[#a9ed35] text-black' : 'bg-[#e8edff] text-[#3157ff]'}`}
                      >
                        <CheckIcon className="h-3 w-3" weight="bold" />
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  className={`mt-9 inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-bold transition-transform hover:-translate-y-0.5 ${isPro ? 'bg-white text-black' : 'bg-[#3157ff] text-white'}`}
                  href={href}
                >
                  {isAuthenticated
                    ? isPro
                      ? 'Upgrade to Pro'
                      : 'Open dashboard'
                    : isPro
                      ? 'Start and upgrade'
                      : 'Build for free'}
                  <ArrowRightIcon className="h-4 w-4" weight="bold" />
                </Link>
              </article>
            );
          })}
        </div>
        <p className="mx-auto mt-5 max-w-xl text-center text-xs leading-5 text-black/40">
          Create your account for free. Pro subscriptions are securely handled
          through Stripe.
        </p>
      </section>

      <section className="border-y border-black/10 bg-white px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-[1180px]">
          <div className="max-w-3xl">
            <p className="text-xs font-black tracking-[0.18em] text-[#3157ff] uppercase">
              Included from day one
            </p>
            <h2 className="mt-5 text-4xl leading-[0.95] font-black tracking-[-0.055em] sm:text-6xl">
              Free does not mean unfinished.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-7 text-black/50">
              Every Griit account starts with the tools required to build and
              publish a profile worth sharing.
            </p>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {sharedBenefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <article
                  className={`${benefit.color} rounded-[1.75rem] p-6`}
                  key={benefit.title}
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/70">
                    <Icon className="h-5 w-5" weight="bold" />
                  </span>
                  <h3 className="mt-6 text-lg font-black">{benefit.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-black/55">
                    {benefit.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-[1080px]">
          <div className="text-center">
            <p className="text-xs font-black tracking-[0.18em] text-[#3157ff] uppercase">
              Full comparison
            </p>
            <h2 className="mt-5 text-4xl font-black tracking-[-0.055em] sm:text-6xl">
              Choose what fits now.
            </h2>
          </div>
          <div className="mt-12 overflow-x-auto rounded-[1.75rem] border border-black/10 bg-white">
            <table className="w-full min-w-[680px] border-collapse text-left">
              <thead>
                <tr className="border-b border-black/10">
                  <th className="p-5 text-sm font-black sm:p-6">Feature</th>
                  <th className="w-48 p-5 text-center text-sm font-black sm:p-6">
                    Free
                  </th>
                  <th className="w-48 bg-[#151515] p-5 text-center text-sm font-black text-white sm:p-6">
                    Pro
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr
                    className="border-b border-black/8 last:border-0"
                    key={row.label}
                  >
                    <th className="p-5 text-sm font-semibold sm:px-6">
                      {row.label}
                    </th>
                    <td className="p-5 text-center text-black/60">
                      <ComparisonValue value={row.free} />
                    </td>
                    <td className="bg-[#151515] p-5 text-center text-white">
                      <ComparisonValue value={row.pro} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="bg-[#3157ff] px-5 py-20 text-white sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto grid max-w-[1180px] items-center gap-12 lg:grid-cols-[1fr_0.8fr]">
          <div>
            <LightningIcon className="h-9 w-9 text-[#a9ed35]" weight="fill" />
            <h2 className="mt-6 max-w-3xl text-5xl leading-[0.9] font-black tracking-[-0.065em] sm:text-7xl">
              Pro is built for more than one chapter.
            </h2>
            <p className="mt-7 max-w-xl text-base leading-7 text-white/65">
              Manage separate athlete identities, publish more of the work
              behind each goal, and understand which stories create momentum.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {[
              ['01', 'Up to five profiles, each with its own public address.'],
              [
                '02',
                'Detailed audience, traffic, social, and block analytics.',
              ],
              [
                '03',
                'More goals, achievements, activities, and gallery content.',
              ],
            ].map(([number, text]) => (
              <div className="rounded-2xl bg-white/10 p-5" key={number}>
                <span className="text-xs font-black text-[#a9ed35]">
                  {number}
                </span>
                <p className="mt-2 text-sm leading-6 text-white/80">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto grid max-w-[1080px] gap-12 lg:grid-cols-[0.65fr_1fr]">
          <div>
            <GlobeIcon className="h-8 w-8 text-[#3157ff]" weight="bold" />
            <h2 className="mt-5 text-4xl font-black tracking-[-0.055em] sm:text-5xl">
              Questions, answered.
            </h2>
            <p className="mt-5 text-sm leading-6 text-black/50">
              Start with the plan that matches your needs today. Your profile
              and content stay with you when you upgrade.
            </p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <details
                className="group rounded-2xl border border-black/10 bg-white p-5"
                key={faq.question}
                open={index === 0}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold [&::-webkit-details-marker]:hidden">
                  {faq.question}
                  <span className="text-xl font-light transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-black/50">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-black/10 bg-[#a9ed35] px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto flex max-w-[1180px] flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-black tracking-[0.18em] uppercase">
              Your profile can start today
            </p>
            <h2 className="mt-5 max-w-4xl text-5xl leading-[0.9] font-black tracking-[-0.065em] sm:text-7xl">
              Give your next goal a place to live.
            </h2>
          </div>
          <Link
            className="inline-flex h-13 shrink-0 items-center gap-2 rounded-full bg-[#151515] px-7 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
            href={isAuthenticated ? '/dashboard' : '/sign-up'}
          >
            {isAuthenticated ? 'Open dashboard' : 'Create your free profile'}
            <ArrowRightIcon className="h-4 w-4" weight="bold" />
          </Link>
        </div>
      </section>
    </main>
  );
}
