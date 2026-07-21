import { subscriptionPlans } from '@/lib/constants/billing';
import { createServerSupabaseClient } from '@/lib/config/supabase-server';
import type { SubscriptionState } from '@/lib/types/billing';

const defaultSubscriptionState: SubscriptionState = {
  plan: 'free',
  status: 'free',
  isActive: false,
  features: subscriptionPlans.free.features,
};

export async function getSubscriptionState(): Promise<SubscriptionState> {
  const supabase = await createServerSupabaseClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    return defaultSubscriptionState;
  }

  const userId = userData.user.id;
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .limit(1)
    .single();

  if (error || !data) {
    return defaultSubscriptionState;
  }

  const plan = data.plan === 'pro' ? 'pro' : 'free';
  const status = ['past_due', 'cancelled'].includes(data.status)
    ? data.status
    : plan;

  return {
    plan,
    status,
    isActive: plan === 'pro' && status !== 'past_due' && status !== 'cancelled',
    features:
      plan === 'pro'
        ? subscriptionPlans.pro.features
        : subscriptionPlans.free.features,
  };
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
