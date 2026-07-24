'use client';

import { useState } from 'react';
import {
  CheckIcon,
  LightningIcon,
  ShieldCheckIcon,
} from '@phosphor-icons/react';
import { subscriptionPlans } from '@/lib/constants/billing';
import { Button } from '@/components/ui/button';
import { BillingIntervalToggle } from './billing-interval-toggle';
import type { BillingInterval, SubscriptionState } from '@/lib/types/billing';

export function SubscriptionCard({
  subscription,
  proPriceLabels,
  annualCheckoutAvailable,
  initialBillingInterval = 'month',
}: {
  subscription: SubscriptionState;
  proPriceLabels: Record<BillingInterval, string>;
  annualCheckoutAvailable: boolean;
  initialBillingInterval?: BillingInterval;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [billingInterval, setBillingInterval] = useState<BillingInterval>(
    initialBillingInterval,
  );

  const currentPlan = subscription.plan === 'pro' ? 'pro' : 'free';
  const currentPlanData = subscriptionPlans[currentPlan];
  const currentPriceLabel =
    currentPlan === 'pro'
      ? proPriceLabels[subscription.billingInterval ?? 'month']
      : currentPlanData.price;
  const selectedPriceLabel = proPriceLabels[billingInterval];

  const handleCheckout = async () => {
    setError(null);
    if (billingInterval === 'year' && !annualCheckoutAvailable) {
      setError('The annual Stripe price is not configured yet.');
      return;
    }

    setIsLoading(true);

    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ billingInterval }),
    });

    let data;
    try {
      data = await response.json();
    } catch {
      setError('Unable to parse server response.');
      setIsLoading(false);
      return;
    }

    if (!response.ok || !data.url) {
      setError(data?.error || 'Unable to start checkout.');
      setIsLoading(false);
      return;
    }

    window.location.href = data.url;
  };

  if (currentPlan === 'pro') {
    return (
      <section className="relative overflow-hidden rounded-[2rem] bg-[#151515] p-7 text-white shadow-[0_30px_80px_rgba(21,21,21,0.16)] sm:p-9">
        <div className="pointer-events-none absolute -top-24 -right-20 h-72 w-72 rounded-full border-[44px] border-[#a9ed35]/15" />
        <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-start">
          <div className="max-w-xl">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-[#a9ed35] px-3 py-1 text-[10px] font-black tracking-[0.12em] text-[#151515] uppercase">
                Active plan
              </span>
              <span className="text-xs font-semibold text-white/45">
                {subscription.billingInterval === 'year'
                  ? 'Annual billing'
                  : 'Monthly billing'}
              </span>
            </div>
            <h2 className="mt-5 text-4xl font-black tracking-[-0.055em]">
              You&apos;re on Griit Pro.
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/55">
              Every premium template, design control, advanced insight, and
              priority support tool is ready for your profiles.
            </p>
          </div>
          <div className="min-w-52 rounded-2xl border border-white/10 bg-white/8 p-5">
            <p className="text-xs font-bold text-white/45">Your subscription</p>
            <p className="mt-2 text-2xl font-black">{currentPriceLabel}</p>
            <p className="mt-2 flex items-center gap-2 text-xs font-semibold text-[#a9ed35]">
              <ShieldCheckIcon className="h-4 w-4" weight="fill" />
              Pro access enabled
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="grid items-stretch gap-5 lg:grid-cols-[0.72fr_1.28fr]">
      <section className="flex flex-col rounded-[2rem] border border-black/10 bg-white p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-black tracking-[0.16em] text-black/40 uppercase">
              Your current plan
            </p>
            <h2 className="mt-3 text-3xl font-black">Free</h2>
            <p className="mt-1 text-sm font-semibold text-black/45">Forever</p>
          </div>
          <div className="rounded-full bg-[#eef2ff] px-3 py-1 text-xs font-bold text-[#3157ff]">
            Active
          </div>
        </div>
        <p className="mt-5 text-sm leading-6 text-black/50">
          A complete public profile with the essentials to start sharing your
          athlete story.
        </p>
        <ul className="mt-7 flex-1 space-y-3 text-sm text-black/60">
          {currentPlanData.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5">
              <CheckIcon
                className="mt-0.5 h-4 w-4 shrink-0 text-[#3157ff]"
                weight="bold"
              />
              {feature}
            </li>
          ))}
        </ul>
        <p className="mt-7 text-xs leading-5 text-black/35">
          You can keep using Free for as long as you want.
        </p>
      </section>

      <section className="relative overflow-hidden rounded-[2rem] bg-[#151515] p-6 text-white shadow-[0_30px_80px_rgba(21,21,21,0.18)] sm:p-8">
        <div className="pointer-events-none absolute -top-24 -right-20 h-72 w-72 rounded-full border-[44px] border-[#3157ff]/20" />
        <div className="relative">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-black tracking-[0.18em] text-[#a9ed35] uppercase">
                Upgrade your profile
              </p>
              <h2 className="mt-3 text-4xl font-black tracking-[-0.055em]">
                Griit Pro
              </h2>
            </div>
            <span className="rounded-full bg-[#a9ed35] px-3 py-1.5 text-[10px] font-black tracking-[0.1em] text-[#151515] uppercase">
              Best for growth
            </span>
          </div>
          <p className="mt-4 max-w-xl text-sm leading-6 text-white/55">
            Build more profiles, unlock every visual option, and understand
            exactly what turns visitors into opportunities.
          </p>
          <div className="mt-7 rounded-[1.5rem] bg-white p-2 text-[#151515]">
            <BillingIntervalToggle
              value={billingInterval}
              onChange={(value) => {
                setBillingInterval(value);
                setError(null);
              }}
            />
            <div className="flex flex-col justify-between gap-4 px-4 pt-6 pb-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-4xl font-black tracking-[-0.055em] sm:text-5xl">
                  {selectedPriceLabel}
                </p>
                <p className="mt-2 text-xs font-semibold text-black/45">
                  {billingInterval === 'year'
                    ? `${subscriptionPlans.pro.annualMonthlyEquivalent}, billed annually`
                    : 'Flexible monthly billing · cancel anytime'}
                </p>
              </div>
              {billingInterval === 'year' ? (
                <div className="rounded-2xl bg-[#dff5b4] px-4 py-3 sm:text-right">
                  <p className="text-sm font-black">
                    {subscriptionPlans.pro.annualSavings}
                  </p>
                  <p className="mt-0.5 text-[10px] font-bold uppercase">
                    {subscriptionPlans.pro.annualDiscount}
                  </p>
                </div>
              ) : null}
            </div>
          </div>

          <ul className="mt-7 grid gap-3 text-sm text-white/75 sm:grid-cols-2">
            {subscriptionPlans.pro.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2.5">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#a9ed35] text-[#151515]">
                  <CheckIcon className="h-3 w-3" weight="bold" />
                </span>
                {feature}
              </li>
            ))}
          </ul>

          <Button
            className="mt-8 h-12 w-full rounded-full border-0 bg-[#a9ed35] text-sm font-black text-[#151515] shadow-none hover:bg-[#b8f256] hover:text-[#151515]"
            onClick={handleCheckout}
            disabled={isLoading}
          >
            <LightningIcon className="h-4 w-4" weight="fill" />
            {isLoading
              ? 'Redirecting…'
              : `Get Pro ${billingInterval === 'year' ? 'annually' : 'monthly'}`}
          </Button>
          <p className="mt-3 flex items-center justify-center gap-2 text-center text-[11px] text-white/35">
            <ShieldCheckIcon className="h-4 w-4" weight="bold" />
            Secure checkout powered by Stripe
          </p>
          {error ? (
            <p className="mt-3 text-center text-sm font-semibold text-[#ff8c8c]">
              {error}
            </p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
