import type { SubscriptionState } from '@/lib/types/billing';

const defaultSubscriptionState: SubscriptionState = {
  plan: 'free',
  status: 'free',
  isActive: true,
  features: ['basic_profile', 'basic_customization'],
};

export async function getSubscriptionState(): Promise<SubscriptionState> {
  return defaultSubscriptionState;
}

export async function canAccessFeature(feature: string, subscription: SubscriptionState) {
  const premiumFeatures = new Set(['customDomain', 'premiumThemes', 'unlimitedBlocks', 'advancedAnalytics']);

  if (!premiumFeatures.has(feature)) {
    return true;
  }

  return subscription.plan === 'pro' && subscription.isActive;
}
