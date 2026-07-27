'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { ArrowRightIcon, CheckIcon, CopyIcon } from '@phosphor-icons/react';
import { BillingIntervalToggle } from '@/components/billing/billing-interval-toggle';
import { launchOffer, subscriptionPlans } from '@/lib/constants/billing';
import type { BillingInterval } from '@/lib/types/billing';

const planDetails = {
  free: {
    name: subscriptionPlans.free.name,
    description:
      'Everything you need to publish a complete athlete profile and start sharing your story.',
    eyebrow: 'Start your profile',
    features: [
      '1 complete public profile',
      'Every core content and partnership block',
      '4 free templates and all quick color palettes',
      '1 goal plus 3 gallery images, achievements, and activities',
      'Views, visitors, clicks, and click-through rate',
    ],
  },
  pro: {
    name: subscriptionPlans.pro.name,
    description:
      'For athletes, coaches, teams, and creators who need more profiles, content, and insight.',
    eyebrow: 'Unlock your full toolkit',
    features: [
      'Up to 5 independent public profiles',
      'All 8 templates and all 4 typography styles',
      'Custom colors, advanced shapes, textures, and shadows',
      'Up to 3 goals and 50 gallery, achievement, and activity items',
      'Audience, campaign, social, and block analytics',
      'No Griit branding and priority support',
      'Custom domain and downloadable QR code — coming soon',
    ],
  },
  teams: {
    name: subscriptionPlans.teams.name,
    description:
      'For clubs, academies, agencies, and managers who need one shared athlete workspace.',
    eyebrow: 'Manage your roster',
    features: subscriptionPlans.teams.features,
  },
} as const;

export function PricingPlanCards({
  isAuthenticated,
}: {
  isAuthenticated: boolean;
}) {
  const [billingInterval, setBillingInterval] =
    useState<BillingInterval>('year');
  const [codeCopied, setCodeCopied] = useState(false);

  return (
    <>
      <div
        className="mx-auto mb-8 max-w-[920px] scroll-mt-32 overflow-hidden rounded-[1.75rem] border border-[#a9ed35]/70 bg-[#151515] text-white shadow-[0_24px_70px_rgba(21,21,21,0.16)]"
        id="launch-offer"
      >
        <div className="grid items-center gap-5 p-5 sm:p-6 md:grid-cols-[1fr_auto]">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#a9ed35] px-3 py-1 text-[10px] font-black tracking-[0.14em] text-[#151515] uppercase">
                Limited launch offer
              </span>
              <span className="text-xs font-bold text-white/45">
                Reserved for the first {launchOffer.athleteLimit} athletes
              </span>
            </div>
            <div className="mt-4 flex flex-wrap items-end gap-3">
              <p className="text-2xl font-black tracking-[-0.04em] sm:text-3xl">
                Pro Annual for {launchOffer.firstYearPrice}
              </p>
              <span className="pb-0.5 text-lg font-bold text-white/35 line-through">
                {launchOffer.regularAnnualPrice}
              </span>
            </div>
            <p className="mt-2 text-sm leading-6 text-white/55">
              {launchOffer.discount} the annual plan and{' '}
              <strong className="text-white">
                {launchOffer.savingsVsMonthly} less than 12 months of Pro
                Monthly
              </strong>
              .
            </p>
          </div>
          <button
            className="group rounded-2xl border border-white/12 bg-white/8 px-5 py-4 text-center transition-colors hover:bg-white/12"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(launchOffer.code);
                setCodeCopied(true);
                window.setTimeout(() => setCodeCopied(false), 1800);
              } catch {
                setCodeCopied(false);
              }
            }}
            type="button"
          >
            <p className="text-[9px] font-black tracking-[0.16em] text-white/40 uppercase">
              {codeCopied ? 'Copied to clipboard' : 'Copy for Stripe checkout'}
            </p>
            <p className="mt-1 flex items-center justify-center gap-2 font-mono text-lg font-black tracking-[0.12em] text-[#a9ed35]">
              {launchOffer.code}
              {codeCopied ? (
                <CheckIcon className="h-4 w-4" weight="bold" />
              ) : (
                <CopyIcon className="h-4 w-4" weight="bold" />
              )}
            </p>
          </button>
        </div>
      </div>
      <div className="mb-10 flex flex-col items-center gap-3">
        <BillingIntervalToggle
          value={billingInterval}
          onChange={setBillingInterval}
        />
        <p className="text-xs font-bold text-black/45">
          Annual Pro:{' '}
          <span className="text-black/30 line-through">
            {launchOffer.regularAnnualPrice}
          </span>{' '}
          → {launchOffer.firstYearPrice} with code {launchOffer.code}. Reserved
          for the first {launchOffer.athleteLimit} athletes.
        </p>
      </div>
      <div className="mx-auto grid max-w-[1380px] gap-5 md:grid-cols-2 xl:grid-cols-3">
        {Object.entries(planDetails).map(([planId, plan]) => {
          const isPro = planId === 'pro';
          const isTeams = planId === 'teams';
          const price = isPro
            ? billingInterval === 'year'
              ? launchOffer.firstYearPrice
              : '$5'
            : isTeams
              ? subscriptionPlans.teams.price
              : subscriptionPlans.free.price;
          const cadence = isPro
            ? billingInterval === 'year'
              ? 'for the first year'
              : 'per month'
            : isTeams
              ? 'tailored to your organization'
              : 'forever';
          const internalHref = (
            isAuthenticated
              ? isPro
                ? `/dashboard/subscribe?billing=${billingInterval === 'year' ? 'annual' : 'monthly'}`
                : '/dashboard'
              : '/sign-up'
          ) as Route;

          return (
            <article
              className={`relative flex flex-col rounded-[2rem] border p-7 sm:p-9 ${
                isPro
                  ? 'border-[#151515] bg-[#151515] text-white shadow-[0_30px_80px_rgba(20,20,20,0.22)]'
                  : isTeams
                    ? 'border-[#3157ff]/25 bg-[#e8edff] shadow-[0_30px_80px_rgba(49,87,255,0.12)]'
                    : 'border-black/10 bg-white'
              }`}
              key={planId}
            >
              {isPro ? (
                <span className="absolute top-6 right-6 rounded-full bg-[#a9ed35] px-3 py-1 text-[10px] font-black text-[#151515] uppercase">
                  {billingInterval === 'year'
                    ? 'Launch offer'
                    : 'Best for growth'}
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
                  {price}
                </span>
                {isPro && billingInterval === 'year' ? (
                  <span className="pb-1 text-sm font-bold text-white/35 line-through">
                    {launchOffer.regularAnnualPrice}
                  </span>
                ) : null}
                <span
                  className={`max-w-36 pb-1 text-xs leading-4 ${isPro ? 'text-white/45' : 'text-black/45'}`}
                >
                  {cadence}
                </span>
              </div>
              {isPro && billingInterval === 'year' ? (
                <div className="mt-4 rounded-2xl border border-[#a9ed35]/25 bg-[#a9ed35]/10 p-4">
                  <p className="text-sm font-black text-[#a9ed35]">
                    Save {launchOffer.savingsVsMonthly} vs Pro Monthly
                  </p>
                  <p className="mt-1 text-xs text-white/55">
                    40% less than paying monthly for 12 months. Use{' '}
                    {launchOffer.code} at checkout.
                  </p>
                </div>
              ) : isPro ? (
                <p className="mt-3 text-xs font-semibold text-white/45">
                  Flexible monthly billing. Cancel anytime.
                </p>
              ) : null}
              <p
                className={`mt-5 max-w-md text-sm leading-6 ${isPro ? 'text-white/55' : 'text-black/50'}`}
              >
                {plan.description}
              </p>
              <ul className="mt-8 flex-1 space-y-3.5">
                {plan.features.map((feature) => (
                  <li className="flex items-start gap-3 text-sm" key={feature}>
                    <span
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${isPro ? 'bg-[#a9ed35] text-black' : 'bg-[#e8edff] text-[#3157ff]'}`}
                    >
                      <CheckIcon className="h-3 w-3" weight="bold" />
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              {isTeams ? (
                <a
                  className="mt-9 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#151515] px-6 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
                  href="mailto:hello@griit.me?subject=Griit%20Teams"
                >
                  Talk to our team
                  <ArrowRightIcon className="h-4 w-4" weight="bold" />
                </a>
              ) : (
                <Link
                  className={`mt-9 inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-bold transition-transform hover:-translate-y-0.5 ${isPro ? 'bg-white text-black' : 'bg-[#3157ff] text-white'}`}
                  href={internalHref}
                >
                  {isAuthenticated
                    ? isPro
                      ? billingInterval === 'year'
                        ? 'Claim launch offer'
                        : 'Choose monthly Pro'
                      : 'Open dashboard'
                    : isPro
                      ? billingInterval === 'year'
                        ? 'Start and claim offer'
                        : 'Start and upgrade'
                      : 'Build for free'}
                  <ArrowRightIcon className="h-4 w-4" weight="bold" />
                </Link>
              )}
            </article>
          );
        })}
      </div>
    </>
  );
}
