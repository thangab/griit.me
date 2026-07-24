import { SubscriptionCard } from '@/components/billing/subscription-card';
import { getSubscriptionState } from '@/lib/services/billing';
import { getStripePriceLabel } from '@/lib/services/stripe';
import { subscriptionPlans } from '@/lib/constants/billing';

export default async function SubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ billing?: string }>;
}) {
  const subscription = await getSubscriptionState();
  const params = await searchParams;
  const monthlyPriceId = process.env.STRIPE_PRICE_ID_PRO_MONTHLY;
  const annualPriceId = process.env.STRIPE_PRICE_ID_PRO_ANNUAL;
  const [monthlyPriceLabel, annualPriceLabel] = await Promise.all([
    monthlyPriceId ? getStripePriceLabel(monthlyPriceId) : null,
    annualPriceId ? getStripePriceLabel(annualPriceId) : null,
  ]);
  const proPriceLabels = {
    month: monthlyPriceLabel ?? subscriptionPlans.pro.prices.month,
    year: annualPriceLabel ?? subscriptionPlans.pro.prices.year,
  };

  return (
    <div className="mx-auto w-full max-w-[1180px] space-y-6">
      <header className="relative overflow-hidden rounded-[2rem] border border-black/8 bg-white p-7 sm:p-10">
        <div className="pointer-events-none absolute -top-24 -right-16 h-64 w-64 rounded-full bg-[#dff5b4]/70 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-[#dce4ff]/80 blur-3xl" />
        <div className="relative">
          <p className="text-[11px] font-black tracking-[0.22em] text-[#3157ff] uppercase">
            Upgrade to Griit Pro
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl leading-[0.95] font-black tracking-[-0.055em] sm:text-5xl">
            More freedom for every athlete story.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-black/50 sm:text-base">
            Choose the billing rhythm that works for you. Annual Pro gives you
            the complete toolkit for $4 per month and saves $12 every year.
          </p>
          <div className="mt-7 flex flex-wrap gap-2">
            {[
              'All premium styles',
              'Advanced analytics',
              'Priority support',
            ].map((benefit) => (
              <span
                className="rounded-full border border-black/8 bg-white/75 px-3 py-1.5 text-xs font-bold text-black/65"
                key={benefit}
              >
                {benefit}
              </span>
            ))}
          </div>
        </div>
      </header>
      <SubscriptionCard
        annualCheckoutAvailable={Boolean(annualPriceId)}
        initialBillingInterval={
          params.billing === 'monthly'
            ? 'month'
            : annualPriceId
              ? 'year'
              : 'month'
        }
        proPriceLabels={proPriceLabels}
        subscription={subscription}
      />
      <section className="relative overflow-hidden rounded-[2rem] border border-[#3157ff]/20 bg-[#e8edff] p-7 sm:p-9">
        <div className="pointer-events-none absolute -right-16 -bottom-24 h-56 w-56 rounded-full border-[36px] border-[#3157ff]/10" />
        <div className="relative flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="text-[11px] font-black tracking-[0.2em] text-[#3157ff] uppercase">
              Griit Teams
            </p>
            <h2 className="mt-4 max-w-2xl text-3xl font-black tracking-[-0.04em]">
              Managing a club, agency, academy, or athlete roster?
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-black/55">
              Bring profiles, collaborators, shared branding, analytics, and
              centralized management into one tailored workspace.
            </p>
          </div>
          <a
            className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-[#151515] px-6 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
            href="mailto:hello@griit.me?subject=Griit%20Teams"
          >
            Talk to us
          </a>
        </div>
      </section>
    </div>
  );
}
