export const defaultProfileTemplateId = 'goal_spotlight';

export const profileTemplates = [
  {
    id: 'goal_spotlight',
    name: 'Goal Spotlight',
    description: 'Lead with the athlete next objective.',
    proOnly: false,
  },
  {
    id: 'event_poster',
    name: 'Event Poster',
    description: 'A more editorial layout for dated goals and events.',
    proOnly: true,
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
