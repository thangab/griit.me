'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { subscriptionPlans } from '@/lib/constants/billing';
import { Button } from '@/components/ui/button';
import type { SubscriptionState } from '@/lib/types/billing';

export function SubscriptionCard({
  subscription,
}: {
  subscription: SubscriptionState;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO;

  const currentPlan = subscription.plan === 'pro' ? 'pro' : 'free';
  const currentPlanData = subscriptionPlans[currentPlan];
  const otherPlan = currentPlan === 'pro' ? 'free' : 'pro';
  const otherPlanData = subscriptionPlans[otherPlan];

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
    } catch (error) {
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
      <div className="border-primary/20 bg-card rounded-2xl border p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-muted-foreground text-sm font-medium">
              Current plan
            </p>
            <h3 className="mt-1 text-2xl font-semibold">
              {currentPlanData.name}
            </h3>
            <p className="text-muted-foreground mt-2 text-sm">
              {currentPlanData.description}
            </p>
          </div>
          <div className="border-primary/20 bg-primary/10 text-primary rounded-full border px-3 py-1 text-sm font-medium">
            Active
          </div>
        </div>

        <ul className="text-muted-foreground mt-6 space-y-2 text-sm">
          {currentPlanData.features.map((feature) => (
            <li key={feature} className="flex items-center gap-2">
              <span className="bg-primary h-2 w-2 rounded-full" />
              {feature}
            </li>
          ))}
        </ul>

        <Button
          className="mt-6 w-full"
          variant={currentPlan === 'pro' ? 'default' : 'outline'}
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

      <div className="border-border bg-background rounded-2xl border p-6 shadow-sm">
        <div>
          <p className="text-muted-foreground text-sm font-medium">
            Alternative plan
          </p>
          <h3 className="mt-1 text-2xl font-semibold">{otherPlanData.name}</h3>
          <p className="text-muted-foreground mt-2 text-sm">
            {otherPlanData.description}
          </p>
        </div>

        <ul className="text-muted-foreground mt-6 space-y-2 text-sm">
          {otherPlanData.features.map((feature) => (
            <li key={feature} className="flex items-center gap-2">
              <span className="bg-muted-foreground/50 h-2 w-2 rounded-full" />
              {feature}
            </li>
          ))}
        </ul>

        <Button
          className="mt-6 w-full"
          variant={currentPlan === 'pro' ? 'outline' : 'default'}
          onClick={() => router.push('/dashboard/settings')}
        >
          {currentPlan === 'pro' ? 'View your plan' : 'Learn more'}
        </Button>
      </div>
    </div>
  );
}
