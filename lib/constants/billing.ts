export const subscriptionPlans = {
  free: {
    name: 'Free',
    description: 'Create a polished athlete profile with essential tools.',
    price: 'Free',
    features: [
      '1 public profile',
      'Core blocks and templates',
      'Core customization',
      'Basic analytics',
      '1 goal and up to 3 gallery, achievement, and activity items',
    ],
  },
  pro: {
    name: 'Pro',
    description:
      'Manage multiple profiles and unlock the complete athlete toolkit.',
    price: '€3.99 / month',
    features: [
      'Up to 5 public profiles',
      'Profile management and switching',
      'Multiple goals and expanded content limits',
      'Advanced customization',
      'Advanced analytics',
    ],
  },
} as const;

export const premiumFeatureFlags = {
  customDomain: 'customDomain',
  premiumThemes: 'premiumThemes',
  unlimitedBlocks: 'unlimitedBlocks',
  advancedAnalytics: 'advancedAnalytics',
  multipleProfiles: 'multipleProfiles',
} as const;
