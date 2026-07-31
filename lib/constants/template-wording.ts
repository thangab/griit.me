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

export type TemplateWordingLocale = 'en' | 'fr';

const englishTemplateWordingDefaults: Record<string, TemplateWording> = {
  spotlight: {
    discipline: 'Built for what’s next',
    badge: 'FOCUS',
    eyebrow: 'Current focus',
    profileLabel: 'About',
    targetLabel: 'Target',
    galleryLabel: 'Moments',
    achievementsLabel: 'Achievements',
    activityLabel: 'Latest activity',
    secondaryGoalLabel: 'Up next',
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

const frenchTemplateWordingDefaults: Record<string, TemplateWording> = {
  spotlight: {
    discipline: 'Cap sur la suite',
    badge: 'EN VUE',
    eyebrow: 'Le prochain cap',
    profileLabel: 'À propos',
    targetLabel: 'Objectif',
    galleryLabel: 'Moments',
    achievementsLabel: 'Réussites',
    activityLabel: 'Dernière activité',
    secondaryGoalLabel: 'À suivre',
  },
  momentum: {
    discipline: 'Toujours en mouvement',
    badge: 'ÉLAN',
    eyebrow: 'Continuer d’avancer',
    profileLabel: 'Le parcours',
    targetLabel: 'Prochain cap',
    galleryLabel: 'En action',
    achievementsLabel: 'Temps forts',
    activityLabel: 'Dernière activité',
    secondaryGoalLabel: 'Prochaine étape',
  },
  impact: {
    discipline: 'Prêt à marquer les esprits',
    badge: 'IMPACT',
    eyebrow: 'Faire la différence',
    profileLabel: 'À propos',
    targetLabel: 'Objectif majeur',
    galleryLabel: 'Temps forts',
    achievementsLabel: 'Réussites',
    activityLabel: 'Dernière activité',
    secondaryGoalLabel: 'Prochain défi',
  },
  obsidian: {
    discipline: 'Focus total',
    badge: 'FOCUS',
    eyebrow: 'Le travail parle',
    profileLabel: 'Mon histoire',
    targetLabel: 'Mission actuelle',
    galleryLabel: 'Dans les coulisses',
    achievementsLabel: 'Réussites',
    activityLabel: 'Dernière activité',
    secondaryGoalLabel: 'Prochains défis',
  },
  midnight: {
    discipline: 'Cap sur la progression',
    badge: 'PROGRÈS',
    eyebrow: 'La régularité fait la différence',
    profileLabel: 'Mon profil',
    targetLabel: 'Objectif actuel',
    galleryLabel: 'La préparation',
    achievementsLabel: 'Moments clés',
    activityLabel: 'Dernière activité',
    secondaryGoalLabel: 'Prochains caps',
  },
  pulse: {
    discipline: 'À pleine intensité',
    badge: 'ÉNERGIE',
    eyebrow: 'Tout commence maintenant',
    profileLabel: 'À propos',
    targetLabel: 'Défi actuel',
    galleryLabel: 'Temps forts',
    achievementsLabel: 'Victoires',
    activityLabel: 'Dernière activité',
    secondaryGoalLabel: 'Prochain défi',
  },
  evergreen: {
    discipline: 'Grandir à chaque étape',
    badge: 'ÉVOLUTION',
    eyebrow: 'Le chemin compte autant que l’arrivée',
    profileLabel: 'Mon parcours',
    targetLabel: 'Cap actuel',
    galleryLabel: 'Moments',
    achievementsLabel: 'Fiertés',
    activityLabel: 'Dernière activité',
    secondaryGoalLabel: 'La suite',
  },
  horizon: {
    discipline: 'Toujours plus loin',
    badge: 'AVENTURE',
    eyebrow: 'Vers un nouveau chapitre',
    profileLabel: 'À propos',
    targetLabel: 'Prochain objectif',
    galleryLabel: 'Carnet de route',
    achievementsLabel: 'Temps forts',
    activityLabel: 'Dernière activité',
    secondaryGoalLabel: 'À l’horizon',
  },
};

const templateWordingDefaults = {
  en: englishTemplateWordingDefaults,
  fr: frenchTemplateWordingDefaults,
} satisfies Record<TemplateWordingLocale, Record<string, TemplateWording>>;

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

export function normalizeTemplateWordingOverrides(
  overrides: Partial<TemplateWording>,
  templateId: string,
  locale: TemplateWordingLocale = 'en',
): Partial<TemplateWording> {
  const defaults = getDefaultTemplateWording(templateId, locale);

  return Object.fromEntries(
    templateWordingKeys.flatMap((key) => {
      if (!Object.prototype.hasOwnProperty.call(overrides, key)) return [];

      const value = overrides[key];
      if (typeof value !== 'string') return [];
      if (value.trim() === defaults[key].trim()) return [];

      return [[key, value]];
    }),
  ) as Partial<TemplateWording>;
}

export function getDefaultTemplateWording(
  templateId: string,
  locale: TemplateWordingLocale = 'en',
): TemplateWording {
  const defaults = templateWordingDefaults[locale][templateId];
  if (defaults) return { ...defaults };

  return locale === 'fr'
    ? {
        discipline: 'Profil sportif',
        badge: 'OBJECTIF',
        eyebrow: 'Prêt pour le prochain défi',
        profileLabel: 'Le parcours',
        targetLabel: 'Prochain objectif',
        galleryLabel: 'Temps forts',
        achievementsLabel: 'Étapes franchies',
        activityLabel: 'Dernières actualités',
        secondaryGoalLabel: 'La suite',
      }
    : {
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
  locale?: TemplateWordingLocale,
): TemplateWording {
  const resolvedLocale =
    locale ?? (theme.templateWordingLocale === 'fr' ? 'fr' : 'en');
  const defaults = getDefaultTemplateWording(templateId, resolvedLocale);
  const overrides = getTemplateWordingOverrides(
    theme,
    templateId,
    resolvedLocale,
  );

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
  locale?: TemplateWordingLocale,
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
  const resolvedLocale =
    locale ?? (theme.templateWordingLocale === 'fr' ? 'fr' : 'en');
  const defaults = getDefaultTemplateWording(templateId, resolvedLocale);

  return Object.fromEntries(
    templateWordingKeys.flatMap((key) => {
      if (!Object.prototype.hasOwnProperty.call(saved, key)) return [];

      const value = typeof saved[key] === 'string' ? saved[key] : '';
      const normalizedValue = value.trim();

      // Older saves contained every default. Ignore those untouched legacy
      // values once, then persist only explicit overrides going forward.
      const isKnownDefault = Object.values(templateWordingDefaults).some(
        (localizedDefaults) =>
          Object.values(localizedDefaults).some(
            (wording) => wording[key] === normalizedValue,
          ),
      );

      if (
        normalizedValue === defaults[key] ||
        (!hasExplicitOverrides && isKnownDefault)
      ) {
        return [];
      }

      return [[key, value]];
    }),
  ) as Partial<TemplateWording>;
}
