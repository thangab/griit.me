'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { ArrowRightIcon, CheckIcon } from '@phosphor-icons/react';
import { BillingIntervalToggle } from '@/components/billing/billing-interval-toggle';
import { subscriptionPlans } from '@/lib/constants/billing';
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

  return (
    <>
      <div className="mb-10 flex flex-col items-center gap-3">
        <BillingIntervalToggle
          value={billingInterval}
          onChange={setBillingInterval}
        />
        <p className="text-xs font-bold text-black/45">
          Pay annually and keep $12 for your next goal.
        </p>
      </div>
      <div className="mx-auto grid max-w-[1380px] gap-5 md:grid-cols-2 xl:grid-cols-3">
        {Object.entries(planDetails).map(([planId, plan]) => {
          const isPro = planId === 'pro';
          const isTeams = planId === 'teams';
          const price = isPro
            ? billingInterval === 'year'
              ? '$48'
              : '$5'
            : isTeams
              ? subscriptionPlans.teams.price
              : subscriptionPlans.free.price;
          const cadence = isPro
            ? billingInterval === 'year'
              ? 'per year'
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
                    ? 'Best value'
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
                <span
                  className={`max-w-36 pb-1 text-xs leading-4 ${isPro ? 'text-white/45' : 'text-black/45'}`}
                >
                  {cadence}
                </span>
              </div>
              {isPro && billingInterval === 'year' ? (
                <div className="mt-4 rounded-2xl border border-[#a9ed35]/25 bg-[#a9ed35]/10 p-4">
                  <p className="text-sm font-black text-[#a9ed35]">
                    Save $12 every year · 20% off
                  </p>
                  <p className="mt-1 text-xs text-white/55">
                    Just $4/month, billed once annually.
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
                      ? `Choose ${billingInterval === 'year' ? 'annual' : 'monthly'} Pro`
                      : 'Open dashboard'
                    : isPro
                      ? 'Start and upgrade'
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
