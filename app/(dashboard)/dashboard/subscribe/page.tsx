import { SubscriptionCard } from '@/components/billing/subscription-card';
import { getSubscriptionState } from '@/lib/services/billing';
import { getStripePriceLabel } from '@/lib/services/stripe';
import { subscriptionPlans } from '@/lib/constants/billing';

export default async function SubscribePage() {
  const subscription = await getSubscriptionState();
  const proPriceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO;
  const proPriceLabel =
    (proPriceId && (await getStripePriceLabel(proPriceId))) ??
    subscriptionPlans.pro.price;

  return (
    <div className="mx-auto w-full max-w-[1180px] space-y-6">
      <div className="relative overflow-hidden rounded-[2rem] bg-[#151515] p-7 text-white sm:p-10">
        <div className="pointer-events-none absolute -top-28 -right-16 h-72 w-72 rounded-full border-[44px] border-[#3157ff]/25" />
        <div className="relative">
          <p className="text-[11px] font-black tracking-[0.22em] text-white/45 uppercase">
            Griit Pro
          </p>
          <h1 className="mt-5 max-w-2xl text-4xl font-black tracking-[-0.055em] sm:text-5xl">
            Every style. More content. Deeper insights.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-white/55 sm:text-base">
            Unlock all templates and design tools, higher content limits,
            advanced analytics, and up to five independent athlete profiles.
            Priority support is included. Custom domains and downloadable QR
            codes are coming soon.
          </p>
          <span className="mt-7 inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-black text-white">
            {proPriceLabel}
          </span>
        </div>
      </div>
      <SubscriptionCard
        subscription={subscription}
        proPriceLabel={proPriceLabel}
      />
    </div>
  );
}
