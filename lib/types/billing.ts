export type SubscriptionPlan = 'free' | 'pro';
export type SubscriptionStatus = 'free' | 'pro' | 'cancelled' | 'past_due';
export type BillingInterval = 'month' | 'year';

export interface SubscriptionState {
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  isActive: boolean;
  billingInterval: BillingInterval | null;
  features: readonly string[];
}
