import { subscriptionPlans } from '@/lib/constants/billing';
import { createServerSupabaseClient } from '@/lib/config/supabase-server';
import type { SubscriptionState } from '@/lib/types/billing';

const defaultSubscriptionState: SubscriptionState = {
  plan: 'free',
  status: 'free',
  isActive: false,
  billingInterval: null,
  accessSource: 'free',
  complimentaryAccessExpiresAt: null,
  features: subscriptionPlans.free.features,
};

export async function getSubscriptionState(): Promise<SubscriptionState> {
  const supabase = await createServerSupabaseClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    return defaultSubscriptionState;
  }

  const userId = userData.user.id;
  const [{ data: subscription }, { data: complimentaryAccess }] =
    await Promise.all([
      supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .limit(1)
        .maybeSingle(),
      supabase
        .from('complimentary_pro_access')
        .select('expires_at')
        .eq('user_id', userId)
        .maybeSingle(),
    ]);

  if (subscription) {
    const plan = subscription.plan === 'pro' ? 'pro' : 'free';
    const status = ['past_due', 'cancelled'].includes(subscription.status)
      ? subscription.status
      : plan;
    const isActive =
      plan === 'pro' && status !== 'past_due' && status !== 'cancelled';

    if (isActive) {
      return {
        plan,
        status,
        isActive,
        billingInterval:
          subscription.price_id === process.env.STRIPE_PRICE_ID_PRO_ANNUAL
            ? 'year'
            : 'month',
        accessSource: 'stripe',
        complimentaryAccessExpiresAt: null,
        features: subscriptionPlans.pro.features,
      };
    }
  }

  const complimentaryAccessExpiresAt = complimentaryAccess?.expires_at ?? null;
  const hasActiveComplimentaryAccess =
    Boolean(complimentaryAccess) &&
    (!complimentaryAccessExpiresAt ||
      new Date(complimentaryAccessExpiresAt).getTime() > Date.now());

  if (hasActiveComplimentaryAccess) {
    return {
      plan: 'pro',
      status: 'pro',
      isActive: true,
      billingInterval: null,
      accessSource: 'complimentary',
      complimentaryAccessExpiresAt,
      features: subscriptionPlans.pro.features,
    };
  }

  return defaultSubscriptionState;
}

export async function canAccessFeature(
  feature: string,
  subscription: SubscriptionState,
) {
  const premiumFeatures = new Set([
    'customDomain',
    'premiumThemes',
    'unlimitedBlocks',
    'advancedAnalytics',
    'multipleProfiles',
  ]);

  if (!premiumFeatures.has(feature)) {
    return true;
  }

  return subscription.plan === 'pro' && subscription.isActive;
}
