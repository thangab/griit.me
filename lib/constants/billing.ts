export const subscriptionPlans = {
  free: {
    name: 'Free',
    description: 'Publish a complete athlete profile with every core tool.',
    price: 'Free',
    features: [
      '1 public profile',
      'All core blocks and 4 free templates',
      'Quick color palettes and core styles',
      'Profile views, visitors, clicks, and CTR',
      '1 goal and up to 3 gallery images, achievements, and activities',
    ],
  },
  pro: {
    name: 'Pro',
    description:
      'Unlock every design option, deeper analytics, and more profiles.',
    price: '$5 / month',
    prices: {
      month: '$5 / month',
      year: '$48 / year',
    },
    annualSavings: 'Save $12/year',
    annualDiscount: '20% off',
    annualMonthlyEquivalent: '$4 / month',
    features: [
      'Up to 5 public profiles',
      'All 8 templates and 4 typography styles',
      'Custom colors, shapes, textures, and gallery layouts',
      'Up to 3 goals and 50 gallery, achievement, and activity items',
      'Audience, campaign, social, and block analytics',
      'No Griit branding and priority support',
      'Custom domain and downloadable QR code — coming soon',
    ],
  },
  teams: {
    name: 'Teams',
    description:
      'A shared workspace for clubs, academies, agencies, and athlete managers.',
    price: 'Custom',
    features: [
      'A tailored number of athlete profiles',
      'Multiple workspace members with roles and permissions',
      'Shared templates, branding, and media resources',
      'Organization-wide analytics and exports',
      'Centralized profile management and billing',
      'Guided onboarding and dedicated priority support',
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
