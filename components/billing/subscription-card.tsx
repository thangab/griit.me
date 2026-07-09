import { subscriptionPlans } from '@/lib/constants/billing';
import { Button } from '@/components/ui/button';
import type { SubscriptionState } from '@/lib/types/billing';

export function SubscriptionCard({
  subscription,
}: {
  subscription: SubscriptionState;
}) {
  const currentPlan = subscription.plan === 'pro' ? 'pro' : 'free';
  const currentPlanData = subscriptionPlans[currentPlan];
  const otherPlan = currentPlan === 'pro' ? 'free' : 'pro';
  const otherPlanData = subscriptionPlans[otherPlan];

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

        <Button className="mt-6 w-full" variant="outline">
          {currentPlan === 'pro' ? 'Manage subscription' : 'Upgrade to Pro'}
        </Button>
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
          variant={currentPlan === 'pro' ? 'default' : 'outline'}
        >
          {currentPlan === 'pro' ? 'Downgrade to Free' : 'Upgrade to Pro'}
        </Button>
      </div>
    </div>
  );
}
