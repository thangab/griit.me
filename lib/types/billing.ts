export type SubscriptionPlan = 'free' | 'pro';
export type SubscriptionStatus = 'free' | 'pro' | 'cancelled' | 'past_due';

export interface SubscriptionState {
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  isActive: boolean;
  features: readonly string[];
}
