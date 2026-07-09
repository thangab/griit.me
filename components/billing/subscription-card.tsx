import { subscriptionPlans } from '@/lib/constants/billing';
import { Button } from '@/components/ui/button';
import type { SubscriptionState } from '@/lib/types/billing';

export function SubscriptionCard({ subscription }: { subscription: SubscriptionState }) {
  const planKey = subscription.plan === 'pro' ? 'pro' : 'free';
  const plan = subscriptionPlans[planKey];

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Current plan</p>
          <h3 className="mt-1 text-2xl font-semibold">{plan.name}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
        </div>
        <div className="rounded-full border border-border px-3 py-1 text-sm font-medium">
          {subscription.status}
        </div>
      </div>

      <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary" />
            {feature}
          </li>
        ))}
      </ul>

      <Button className="mt-6 w-full" variant={subscription.plan === 'pro' ? 'outline' : 'default'}>
        {subscription.plan === 'pro' ? 'Manage subscription' : 'Upgrade to Pro'}
      </Button>
    </div>
  );
}
