export const subscriptionPlans = {
  free: {
    name: 'Free',
    description: 'Create a polished athlete profile with essential tools.',
    price: 'Free',
    features: [
      '1 public profile',
      'Basic customization',
      'Basic analytics',
      'Limited blocks',
    ],
  },
  pro: {
    name: 'Pro',
    description: 'Unlock premium tools for a fully custom athlete experience.',
    price: '€3.99 / month',
    features: [
      'Unlimited customization',
      'Premium themes',
      'Unlimited blocks',
      'Advanced analytics',
      'Custom domain',
      'Remove branding',
    ],
  },
} as const;

export const premiumFeatureFlags = {
  customDomain: 'customDomain',
  premiumThemes: 'premiumThemes',
  unlimitedBlocks: 'unlimitedBlocks',
  advancedAnalytics: 'advancedAnalytics',
} as const;
