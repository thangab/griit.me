import { SubscriptionCard } from '@/components/billing/subscription-card';
import { getSubscriptionState } from '@/lib/services/billing';
import { getStripePriceLabel } from '@/lib/services/stripe';
import { subscriptionPlans } from '@/lib/constants/billing';

export default async function SettingsPage() {
  const subscription = await getSubscriptionState();
  const proPriceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO;
  const proPriceLabel =
    (proPriceId && (await getStripePriceLabel(proPriceId))) ??
    subscriptionPlans.pro.price;

  return (
    <div className="space-y-6">
      <div className="border-border bg-background rounded-2xl border p-6">
        <h2 className="text-2xl font-semibold">Billing & subscription</h2>
        <p className="text-foreground mt-2 text-sm font-semibold">
          Pro plan price: <span className="text-primary">{proPriceLabel}</span>
        </p>
        <p className="text-muted-foreground mt-2 text-sm">
          The architecture is prepared for Stripe Checkout and future plan
          expansion.
        </p>
      </div>
      <SubscriptionCard
        subscription={subscription}
        proPriceLabel={proPriceLabel}
      />
    </div>
  );
}
