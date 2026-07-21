export const defaultProfileTemplateId = 'spotlight';

export const profileTemplates = [
  {
    id: 'spotlight',
    name: 'Spotlight',
    description: 'Put your next objective front and center.',
    proOnly: false,
  },
  {
    id: 'momentum',
    name: 'Momentum',
    description: 'Warm accents and an energetic sense of movement.',
    proOnly: false,
  },
  {
    id: 'impact',
    name: 'Impact',
    description: 'Sharp contrasts designed to make a strong impression.',
    proOnly: false,
  },
  {
    id: 'obsidian',
    name: 'Obsidian',
    description: 'A dark, immersive direction with vivid highlights.',
    proOnly: false,
  },
  {
    id: 'midnight',
    name: 'Midnight',
    description: 'A structured blue layout with depth and confidence.',
    proOnly: false,
  },
  {
    id: 'pulse',
    name: 'Pulse',
    description: 'Electric accents in a focused, high-energy layout.',
    proOnly: false,
  },
  {
    id: 'evergreen',
    name: 'Evergreen',
    description: 'A calm, rounded layout with a welcoming character.',
    proOnly: false,
  },
  {
    id: 'horizon',
    name: 'Horizon',
    description: 'A bright editorial style with an adventurous feel.',
    proOnly: false,
  },
] as const;

export type ProfileTemplateId = (typeof profileTemplates)[number]['id'];

export function isProfileTemplateId(
  value: unknown,
): value is ProfileTemplateId {
  return profileTemplates.some((template) => template.id === value);
}

export function getProfileTemplate(templateId: unknown) {
  return profileTemplates.find((template) => template.id === templateId);
}

export function resolveProfileTemplateId(theme: Record<string, unknown>) {
  return isProfileTemplateId(theme.templateId)
    ? theme.templateId
    : defaultProfileTemplateId;
}
