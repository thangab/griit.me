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
  {
    id: 'sport_running',
    name: 'Running',
    description: 'Pace, movement and race-day energy.',
    proOnly: false,
  },
  {
    id: 'sport_boxing',
    name: 'Boxing',
    description: 'A bold fight-card identity built for the ring.',
    proOnly: false,
  },
  {
    id: 'sport_mma',
    name: 'MMA',
    description: 'Dark, technical and inspired by the cage.',
    proOnly: false,
  },
  {
    id: 'sport_strength',
    name: 'Strength',
    description: 'A powerful layout for lifting and bodybuilding.',
    proOnly: false,
  },
  {
    id: 'sport_hyrox',
    name: 'Hyrox',
    description: 'Competition lanes, stations and hybrid intensity.',
    proOnly: false,
  },
  {
    id: 'sport_football',
    name: 'Football',
    description: 'A team-focused profile inspired by the pitch.',
    proOnly: false,
  },
  {
    id: 'sport_cycling',
    name: 'Cycling',
    description: 'Speed, elevation and open-road precision.',
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
