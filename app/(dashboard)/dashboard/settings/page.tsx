import { SubscriptionCard } from '@/components/billing/subscription-card';
import { getSubscriptionState } from '@/lib/services/billing';

export default async function SettingsPage() {
  const subscription = await getSubscriptionState();

  return (
    <div className="space-y-6">
      <div className="border-border bg-background rounded-2xl border p-6">
        <h2 className="text-2xl font-semibold">Billing & subscription</h2>
        <p className="text-muted-foreground mt-2 text-sm">
          The architecture is prepared for Stripe Checkout and future plan
          expansion.
        </p>
      </div>
      <SubscriptionCard subscription={subscription} />
    </div>
  );
}
