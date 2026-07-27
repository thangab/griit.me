'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CheckIcon } from '@phosphor-icons/react';
import { BillingIntervalToggle } from '@/components/billing/billing-interval-toggle';
import { launchOffer, subscriptionPlans } from '@/lib/constants/billing';
import type { BillingInterval } from '@/lib/types/billing';

export function HomePricingCards() {
  const [billingInterval, setBillingInterval] =
    useState<BillingInterval>('year');

  return (
    <>
      <div className="mt-10 flex flex-col items-center gap-3">
        <BillingIntervalToggle
          compact
          value={billingInterval}
          onChange={setBillingInterval}
        />
        <p className="text-center text-xs font-bold text-black/45">
          {billingInterval === 'year' ? (
            <>
              Save {launchOffer.savingsVsMonthly} compared with 12 months of Pro
              Monthly · first {launchOffer.athleteLimit} athletes
            </>
          ) : (
            'Flexible monthly billing · cancel anytime'
          )}
        </p>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {(['free', 'pro', 'teams'] as const).map((plan) => {
          const planData = subscriptionPlans[plan];
          const isPro = plan === 'pro';
          const isTeams = plan === 'teams';
          const annualPro = isPro && billingInterval === 'year';
          const price = isPro
            ? annualPro
              ? launchOffer.firstYearPrice
              : '$5'
            : planData.price;

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
                  {annualPro ? 'Launch offer' : 'Flexible monthly'}
                </span>
              ) : isTeams ? (
                <span className="absolute top-6 right-6 rounded-full bg-[#3157ff] px-3 py-1 text-[10px] font-black text-white uppercase">
                  Organizations
                </span>
              ) : null}

              <p className="text-sm font-black">{planData.name}</p>
              <div className="mt-4 flex flex-wrap items-end gap-2">
                <p className="text-4xl font-black tracking-tight">{price}</p>
                {annualPro ? (
                  <span className="pb-1 text-sm font-bold text-white/35 line-through">
                    {launchOffer.regularAnnualPrice}
                  </span>
                ) : null}
                {isPro ? (
                  <span className="pb-1 text-xs font-semibold text-white/45">
                    {annualPro ? 'first year' : 'per month'}
                  </span>
                ) : null}
              </div>

              {annualPro ? (
                <div className="mt-3 rounded-2xl border border-[#a9ed35]/25 bg-[#a9ed35]/10 p-3.5">
                  <p className="text-xs font-black text-[#a9ed35]">
                    First {launchOffer.athleteLimit} athletes ·{' '}
                    {launchOffer.code}
                  </p>
                  <p className="mt-1 text-[11px] leading-5 text-white/45">
                    Save {launchOffer.savingsVsMonthly} vs 12 months of Pro
                    Monthly.
                  </p>
                </div>
              ) : isPro ? (
                <p className="mt-3 text-xs font-semibold text-white/45">
                  $60 over 12 months. Switch to Annual to save.
                </p>
              ) : null}

              <p
                className={`mt-4 text-sm leading-6 ${
                  isPro ? 'text-white/55' : 'text-black/50'
                }`}
              >
                {planData.description}
              </p>
              <ul className="mt-8 flex-1 space-y-3">
                {planData.features.map((feature) => (
                  <li className="flex items-center gap-3 text-sm" key={feature}>
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                        isPro
                          ? 'bg-[#a9ed35] text-black'
                          : 'bg-[#e8edff] text-[#3157ff]'
                      }`}
                    >
                      <CheckIcon className="h-3 w-3" weight="bold" />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                className={`mt-9 inline-flex h-11 w-full items-center justify-center rounded-full text-sm font-bold ${
                  isPro
                    ? 'bg-white text-black'
                    : isTeams
                      ? 'bg-[#151515] text-white'
                      : 'bg-[#3157ff] text-white'
                }`}
                href={
                  isTeams
                    ? 'mailto:hello@griit.me?subject=Griit%20Teams'
                    : '/sign-up'
                }
              >
                {isTeams
                  ? 'Talk to us'
                  : isPro
                    ? annualPro
                      ? 'Claim launch offer'
                      : 'Choose monthly Pro'
                    : 'Build for free'}
              </Link>
            </article>
          );
        })}
      </div>
    </>
  );
}
