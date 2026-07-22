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
  spotlight: {
    discipline: 'Athlete identity',
    badge: 'NOW',
    eyebrow: 'What I’m building',
    profileLabel: 'About me',
    targetLabel: 'Next milestone',
    galleryLabel: 'Moments',
    achievementsLabel: 'Highlights',
    activityLabel: 'In progress',
    secondaryGoalLabel: 'On the horizon',
  },
  momentum: {
    discipline: 'Driven by progress',
    badge: 'MOVE',
    eyebrow: 'Keep moving forward',
    profileLabel: 'The journey',
    targetLabel: 'Next milestone',
    galleryLabel: 'In motion',
    achievementsLabel: 'Highlights',
    activityLabel: 'Latest update',
    secondaryGoalLabel: 'On the horizon',
  },
  impact: {
    discipline: 'Built to stand out',
    badge: 'IMPACT',
    eyebrow: 'Make every move count',
    profileLabel: 'About',
    targetLabel: 'Main objective',
    galleryLabel: 'Highlights',
    achievementsLabel: 'Milestones',
    activityLabel: 'Latest update',
    secondaryGoalLabel: 'Up next',
  },
  obsidian: {
    discipline: 'Focused. Unfiltered.',
    badge: 'CORE',
    eyebrow: 'Made in the work',
    profileLabel: 'The story',
    targetLabel: 'Current mission',
    galleryLabel: 'Behind the scenes',
    achievementsLabel: 'Milestones',
    activityLabel: 'Latest update',
    secondaryGoalLabel: 'Next missions',
  },
  midnight: {
    discipline: 'Progress in focus',
    badge: 'PROGRESS',
    eyebrow: 'Built with consistency',
    profileLabel: 'Profile',
    targetLabel: 'Current focus',
    galleryLabel: 'The process',
    achievementsLabel: 'Key moments',
    activityLabel: 'Latest update',
    secondaryGoalLabel: 'Next milestones',
  },
  pulse: {
    discipline: 'High energy',
    badge: 'PULSE',
    eyebrow: 'Momentum starts here',
    profileLabel: 'About',
    targetLabel: 'Current challenge',
    galleryLabel: 'Highlights',
    achievementsLabel: 'Wins',
    activityLabel: 'Latest update',
    secondaryGoalLabel: 'Coming next',
  },
  evergreen: {
    discipline: 'Growing with purpose',
    badge: 'GROW',
    eyebrow: 'A journey worth sharing',
    profileLabel: 'The story',
    targetLabel: 'Current focus',
    galleryLabel: 'Moments',
    achievementsLabel: 'Proud moments',
    activityLabel: 'Latest update',
    secondaryGoalLabel: "What's ahead",
  },
  horizon: {
    discipline: 'Always exploring',
    badge: 'EXPLORE',
    eyebrow: 'Follow the next chapter',
    profileLabel: 'About',
    targetLabel: 'Next objective',
    galleryLabel: 'Field notes',
    achievementsLabel: 'Highlights',
    activityLabel: 'Latest update',
    secondaryGoalLabel: 'On the horizon',
  },
};

function getText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

const templateWordingKeys = [
  'discipline',
  'badge',
  'eyebrow',
  'profileLabel',
  'targetLabel',
  'galleryLabel',
  'achievementsLabel',
  'activityLabel',
  'secondaryGoalLabel',
] as const satisfies readonly (keyof TemplateWording)[];

export function getDefaultTemplateWording(templateId: string): TemplateWording {
  const defaults = templateWordingDefaults[templateId];
  if (defaults) return { ...defaults };

  return {
    discipline: 'Personal profile',
    badge: 'FOCUS',
    eyebrow: 'Built for the next challenge',
    profileLabel: 'The story',
    targetLabel: 'Next objective',
    galleryLabel: 'Highlights',
    achievementsLabel: 'Milestones',
    activityLabel: 'Latest updates',
    secondaryGoalLabel: "What's next",
  };
}

export function resolveTemplateWording(
  theme: Record<string, unknown>,
  templateId = '',
): TemplateWording {
  const defaults = getDefaultTemplateWording(templateId);
  const overrides = getTemplateWordingOverrides(theme, templateId);

  return Object.fromEntries(
    Object.entries(defaults).map(([key, fallback]) => [
      key,
      Object.prototype.hasOwnProperty.call(overrides, key)
        ? overrides[key as keyof TemplateWording]
        : fallback,
    ]),
  ) as TemplateWording;
}

export function getTemplateWordingOverrides(
  theme: Record<string, unknown>,
  templateId = '',
): Partial<TemplateWording> {
  const hasExplicitOverrides = Object.prototype.hasOwnProperty.call(
    theme,
    'templateWordingOverrides',
  );
  const source = hasExplicitOverrides
    ? theme.templateWordingOverrides
    : (theme.templateWording ?? theme.sportTemplateText);
  const saved =
    source && typeof source === 'object'
      ? (source as Record<string, unknown>)
      : {};
  const defaults = getDefaultTemplateWording(templateId);

  return Object.fromEntries(
    templateWordingKeys.flatMap((key) => {
      if (!Object.prototype.hasOwnProperty.call(saved, key)) return [];

      const value = getText(saved[key]);

      // Older saves contained every default. Ignore those untouched legacy
      // values once, then persist only explicit overrides going forward.
      const isKnownDefault = Object.values(templateWordingDefaults).some(
        (wording) => wording[key] === value,
      );

      if (
        !hasExplicitOverrides &&
        (value === defaults[key] || isKnownDefault)
      ) {
        return [];
      }

      return [[key, value]];
    }),
  ) as Partial<TemplateWording>;
}
