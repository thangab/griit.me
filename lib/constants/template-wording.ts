export type TemplateWording = {
  discipline: string;
  badge: string;
  eyebrow: string;
  profileLabel: string;
  targetLabel: string;
  galleryLabel: string;
  achievementsLabel: string;
  activityLabel: string;
  secondaryGoalLabel: string;
};

const templateWordingDefaults: Record<string, TemplateWording> = {
  goal_spotlight: {
    discipline: 'Athlete profile',
    badge: 'GOAL',
    eyebrow: 'Next goal',
    profileLabel: 'About',
    targetLabel: 'Target',
    galleryLabel: 'Gallery',
    achievementsLabel: 'Achievements',
    activityLabel: 'Recent activities',
    secondaryGoalLabel: 'Also chasing',
  },
  event_poster: {
    discipline: 'Athlete profile',
    badge: 'EVENT',
    eyebrow: 'Target',
    profileLabel: 'About',
    targetLabel: 'Date',
    galleryLabel: 'Gallery',
    achievementsLabel: 'Achievement',
    activityLabel: 'Recent activity',
    secondaryGoalLabel: 'Also chasing',
  },
  sport_running: {
    discipline: 'Running',
    badge: 'RUN',
    eyebrow: 'Miles with purpose',
    profileLabel: 'Runner profile',
    targetLabel: 'Race target',
    galleryLabel: 'On the road',
    achievementsLabel: 'Race results',
    activityLabel: 'Latest session',
    secondaryGoalLabel: 'Also chasing',
  },
  sport_boxing: {
    discipline: 'Boxing',
    badge: 'BOX',
    eyebrow: 'Built round by round',
    profileLabel: 'Fighter profile',
    targetLabel: 'Next bout',
    galleryLabel: 'In the ring',
    achievementsLabel: 'Fight record',
    activityLabel: 'Fight camp',
    secondaryGoalLabel: 'Next challenges',
  },
  sport_mma: {
    discipline: 'Mixed Martial Arts',
    badge: 'MMA',
    eyebrow: 'Every range. Every round.',
    profileLabel: 'Fighter profile',
    targetLabel: 'Fight target',
    galleryLabel: 'Inside the cage',
    achievementsLabel: 'Fight record',
    activityLabel: 'Training camp',
    secondaryGoalLabel: 'Next challenges',
  },
  sport_strength: {
    discipline: 'Strength',
    badge: 'LIFT',
    eyebrow: 'Progress under pressure',
    profileLabel: 'Athlete profile',
    targetLabel: 'Strength target',
    galleryLabel: 'In the gym',
    achievementsLabel: 'Personal records',
    activityLabel: 'Latest lift',
    secondaryGoalLabel: 'Next milestones',
  },
  sport_hyrox: {
    discipline: 'Hyrox',
    badge: 'HYROX',
    eyebrow: 'Eight runs. Eight stations.',
    profileLabel: 'Athlete profile',
    targetLabel: 'Race target',
    galleryLabel: 'Race mode',
    achievementsLabel: 'Race results',
    activityLabel: 'Latest station',
    secondaryGoalLabel: 'Next milestones',
  },
  sport_football: {
    discipline: 'Football',
    badge: 'XI',
    eyebrow: 'Play for the badge',
    profileLabel: 'Player profile',
    targetLabel: 'Season target',
    galleryLabel: 'Matchday',
    achievementsLabel: 'Honours',
    activityLabel: 'Latest match',
    secondaryGoalLabel: 'Season objectives',
  },
  sport_cycling: {
    discipline: 'Cycling',
    badge: 'RIDE',
    eyebrow: 'Chase the next summit',
    profileLabel: 'Rider profile',
    targetLabel: 'Next objective',
    galleryLabel: 'On the bike',
    achievementsLabel: 'Results',
    activityLabel: 'Latest ride',
    secondaryGoalLabel: 'Also chasing',
  },
};

function getText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

export function getDefaultTemplateWording(
  templateId: string,
  primarySport?: string,
): TemplateWording {
  const defaults = templateWordingDefaults[templateId];
  if (defaults) return { ...defaults };

  const discipline = primarySport || 'Athlete';
  return {
    discipline,
    badge: discipline.replace(/\s+/g, '').slice(0, 6).toUpperCase(),
    eyebrow: 'Built for the next challenge',
    profileLabel: 'Athlete profile',
    targetLabel: 'Next objective',
    galleryLabel: 'Gallery',
    achievementsLabel: 'Achievements',
    activityLabel: 'Latest activity',
    secondaryGoalLabel: 'Also chasing',
  };
}

export function resolveTemplateWording(
  theme: Record<string, unknown>,
  primarySport?: string,
  templateId = '',
): TemplateWording {
  const source = theme.templateWording ?? theme.sportTemplateText;
  const saved =
    source && typeof source === 'object'
      ? (source as Record<string, unknown>)
      : {};
  const defaults = getDefaultTemplateWording(templateId, primarySport);

  return Object.fromEntries(
    Object.entries(defaults).map(([key, fallback]) => [
      key,
      Object.prototype.hasOwnProperty.call(saved, key)
        ? getText(saved[key])
        : fallback,
    ]),
  ) as TemplateWording;
}
