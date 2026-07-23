'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { subscriptionPlans } from '@/lib/constants/billing';
import { Button } from '@/components/ui/button';
import type { SubscriptionState } from '@/lib/types/billing';

export function SubscriptionCard({
  subscription,
  proPriceLabel,
}: {
  subscription: SubscriptionState;
  proPriceLabel?: string;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO;

  const currentPlan = subscription.plan === 'pro' ? 'pro' : 'free';
  const currentPlanData = subscriptionPlans[currentPlan];
  const otherPlan = currentPlan === 'pro' ? 'free' : 'pro';
  const otherPlanData = subscriptionPlans[otherPlan];
  const currentPriceLabel =
    currentPlan === 'pro'
      ? (proPriceLabel ?? currentPlanData.price)
      : currentPlanData.price;
  const otherPriceLabel =
    otherPlan === 'pro'
      ? (proPriceLabel ?? otherPlanData.price)
      : otherPlanData.price;

  const handleCheckout = async () => {
    setError(null);
    if (!priceId) {
      setError('Stripe price is not configured.');
      return;
    }

    setIsLoading(true);

    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId }),
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

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-[0_20px_60px_rgba(21,21,21,0.06)] sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-muted-foreground text-sm font-medium">
              Current plan
            </p>
            <div className="mt-1 flex items-baseline gap-3">
              <h3 className="text-2xl font-semibold">{currentPlanData.name}</h3>
              <span className="text-muted-foreground text-sm font-medium">
                {currentPriceLabel}
              </span>
            </div>
            <p className="text-muted-foreground mt-2 text-sm">
              {currentPlanData.description}
            </p>
          </div>
          <div className="rounded-full bg-[#eef2ff] px-3 py-1 text-sm font-bold text-[#3157ff]">
            Active
          </div>
        </div>

        <ul className="text-muted-foreground mt-6 space-y-2 text-sm">
          {currentPlanData.features.map((feature) => (
            <li key={feature} className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#3157ff]" />
              {feature}
            </li>
          ))}
        </ul>

        <Button
          className="mt-6 w-full rounded-full border border-transparent bg-[#3157ff] text-white shadow-sm hover:bg-[#2447dc] hover:text-white disabled:bg-[#eef2ff] disabled:text-[#3157ff] disabled:opacity-100"
          variant="default"
          onClick={handleCheckout}
          disabled={isLoading || currentPlan === 'pro'}
        >
          {currentPlan === 'pro'
            ? 'Manage subscription'
            : isLoading
              ? 'Redirecting…'
              : 'Upgrade to Pro'}
        </Button>
        {error ? (
          <p className="text-destructive mt-3 text-sm">{error}</p>
        ) : null}
      </div>

      <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-[0_20px_60px_rgba(21,21,21,0.06)] sm:p-8">
        <div>
          <p className="text-sm font-medium text-black/55">Alternative plan</p>
          <div className="mt-1 flex items-baseline gap-3">
            <h3 className="text-2xl font-semibold">{otherPlanData.name}</h3>
            <span className="text-sm font-medium text-black/55">
              {otherPriceLabel}
            </span>
          </div>
          <p className="mt-2 text-sm text-black/55">
            {otherPlanData.description}
          </p>
        </div>

        <ul className="mt-6 space-y-2 text-sm text-black/60">
          {otherPlanData.features.map((feature) => (
            <li key={feature} className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#151515]/45" />
              {feature}
            </li>
          ))}
        </ul>

        <Button
          className="mt-6 w-full rounded-full border-black/15 bg-white text-[#151515] hover:bg-[#f4f6fb] hover:text-[#3157ff]"
          variant="outline"
          onClick={() => router.push('/dashboard/subscribe')}
        >
          {currentPlan === 'pro' ? 'View your plan' : 'Learn more'}
        </Button>
      </div>
    </div>
  );
}
