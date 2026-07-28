import type { Locale } from '@/lib/i18n/config';

type LocalizedGoal = Record<Locale, string>;

export type GoalSuggestion = {
  id: string;
  title: string;
};

const goal = (en: string, fr: string): LocalizedGoal => ({ en, fr });

const goalFamilies = {
  football: [
    goal(
      'Earn a place in the starting lineup',
      'Gagner ma place dans le onze de départ',
    ),
    goal('Finish the season with 10 goals', 'Terminer la saison avec 10 buts'),
    goal(
      'Improve my weak foot this season',
      'Améliorer mon mauvais pied cette saison',
    ),
  ],
  basketball: [
    goal(
      'Earn a place in the starting five',
      'Gagner ma place dans le cinq majeur',
    ),
    goal(
      'Average 15 points this season',
      'Atteindre 15 points de moyenne cette saison',
    ),
    goal(
      'Improve my three-point percentage',
      'Améliorer mon pourcentage à trois points',
    ),
  ],
  running: [
    goal('Run my first 10K', 'Courir mon premier 10 km'),
    goal(
      'Break 3 hours in the marathon',
      'Passer sous les 3 heures au marathon',
    ),
    goal(
      'Run consistently three times a week',
      'Courir régulièrement trois fois par semaine',
    ),
  ],
  swimming: [
    goal(
      'Swim my first open-water race',
      'Participer à ma première course en eau libre',
    ),
    goal(
      'Improve my 100m personal best',
      'Améliorer mon record personnel sur 100 m',
    ),
    goal('Swim 10 km every week', 'Nager 10 km chaque semaine'),
  ],
  cycling: [
    goal(
      'Complete my first 100 km ride',
      'Terminer ma première sortie de 100 km',
    ),
    goal('Finish my next gran fondo', 'Terminer ma prochaine cyclosportive'),
    goal('Improve my climbing power', 'Améliorer ma puissance en montée'),
  ],
  racket: [
    goal('Win my first tournament', 'Remporter mon premier tournoi'),
    goal('Move up one ranking level', 'Gagner un niveau au classement'),
    goal(
      'Improve my consistency under pressure',
      'Gagner en régularité sous pression',
    ),
  ],
  fitness: [
    goal(
      'Train consistently four times a week',
      'M’entraîner régulièrement quatre fois par semaine',
    ),
    goal(
      'Reach my strongest form yet',
      'Atteindre ma meilleure forme physique',
    ),
    goal(
      'Complete a 12-week training cycle',
      'Terminer un cycle d’entraînement de 12 semaines',
    ),
  ],
  boxing: [
    goal('Win my next fight', 'Remporter mon prochain combat'),
    goal(
      'Complete my first fight camp',
      'Terminer mon premier camp d’entraînement',
    ),
    goal(
      'Improve my conditioning over every round',
      'Améliorer mon cardio sur chaque round',
    ),
  ],
  golf: [
    goal(
      'Break 80 for the first time',
      'Passer sous les 80 pour la première fois',
    ),
    goal('Lower my handicap this season', 'Réduire mon handicap cette saison'),
    goal('Improve my short game', 'Améliorer mon petit jeu'),
  ],
  rugby: [
    goal('Earn a regular starting position', 'Gagner une place de titulaire'),
    goal(
      'Reach the playoffs with my team',
      'Atteindre les phases finales avec mon équipe',
    ),
    goal(
      'Improve my speed and contact fitness',
      'Améliorer ma vitesse et mon endurance au contact',
    ),
  ],
  athletics: [
    goal(
      'Set a new personal best this season',
      'Battre mon record personnel cette saison',
    ),
    goal(
      'Qualify for the national championships',
      'Me qualifier pour les championnats nationaux',
    ),
    goal(
      'Complete a full season injury-free',
      'Terminer une saison complète sans blessure',
    ),
  ],
  baseball: [
    goal(
      'Earn a place in the starting lineup',
      'Gagner ma place dans l’équipe titulaire',
    ),
    goal('Improve my batting average', 'Améliorer ma moyenne au bâton'),
    goal(
      'Reach the playoffs with my team',
      'Atteindre les playoffs avec mon équipe',
    ),
  ],
  martialArts: [
    goal('Earn my next belt', 'Obtenir ma prochaine ceinture'),
    goal('Compete in my first tournament', 'Participer à mon premier tournoi'),
    goal(
      'Improve my technique and composure',
      'Améliorer ma technique et mon calme',
    ),
  ],
  team: [
    goal('Earn a regular starting position', 'Gagner une place de titulaire'),
    goal(
      'Reach the playoffs with my team',
      'Atteindre les phases finales avec mon équipe',
    ),
    goal(
      'Contribute more consistently every game',
      'Être plus régulier à chaque match',
    ),
  ],
  strength: [
    goal('Set a new personal record', 'Battre un nouveau record personnel'),
    goal(
      'Complete a 12-week strength cycle',
      'Terminer un cycle de force de 12 semaines',
    ),
    goal(
      'Qualify for my next competition',
      'Me qualifier pour ma prochaine compétition',
    ),
  ],
  crossfit: [
    goal(
      'Qualify for my next competition',
      'Me qualifier pour ma prochaine compétition',
    ),
    goal(
      'Complete my first RX competition',
      'Terminer ma première compétition en RX',
    ),
    goal(
      'Improve my engine and gymnastics skills',
      'Améliorer mon cardio et mes mouvements de gymnastique',
    ),
  ],
  hyrox: [
    goal('Finish my first HYROX', 'Terminer mon premier HYROX'),
    goal(
      'Finish HYROX in under 60 minutes',
      'Terminer un HYROX en moins de 60 minutes',
    ),
    goal(
      'Improve every station before race day',
      'Progresser sur chaque atelier avant la course',
    ),
  ],
  triathlon: [
    goal('Complete my first triathlon', 'Terminer mon premier triathlon'),
    goal(
      'Qualify for the Ironman World Championship',
      'Me qualifier pour les championnats du monde Ironman',
    ),
    goal(
      'Improve my bike-to-run transition',
      'Améliorer ma transition entre le vélo et la course',
    ),
  ],
  trail: [
    goal('Finish my first trail race', 'Terminer mon premier trail'),
    goal('Complete my first ultra-trail', 'Terminer mon premier ultra-trail'),
    goal(
      'Build confidence on technical descents',
      'Gagner en confiance dans les descentes techniques',
    ),
  ],
  climbing: [
    goal('Send my first V6 route', 'Réussir ma première voie cotée V6'),
    goal(
      'Complete my first outdoor project',
      'Réussir mon premier projet en extérieur',
    ),
    goal(
      'Improve my technique and grip endurance',
      'Améliorer ma technique et mon endurance de préhension',
    ),
  ],
  hiking: [
    goal(
      'Complete my first multi-day trek',
      'Terminer mon premier trek de plusieurs jours',
    ),
    goal('Reach my next summit', 'Atteindre mon prochain sommet'),
    goal('Hike 500 km this year', 'Parcourir 500 km cette année'),
  ],
  surfing: [
    goal(
      'Compete in my first surf contest',
      'Participer à ma première compétition de surf',
    ),
    goal('Catch my first barrel', 'Prendre mon premier tube'),
    goal(
      'Improve my turns in bigger waves',
      'Améliorer mes virages dans de plus grosses vagues',
    ),
  ],
  snow: [
    goal(
      'Complete my first competition season',
      'Terminer ma première saison de compétition',
    ),
    goal(
      'Land a new trick this season',
      'Réussir une nouvelle figure cette saison',
    ),
    goal(
      'Improve my confidence on technical terrain',
      'Gagner en confiance sur terrain technique',
    ),
  ],
  skateboarding: [
    goal(
      'Land my next trick consistently',
      'Plaquer régulièrement ma prochaine figure',
    ),
    goal(
      'Film my first full street part',
      'Filmer ma première vidéo street complète',
    ),
    goal('Compete in my first contest', 'Participer à ma première compétition'),
  ],
  rowing: [
    goal(
      'Set a new 2K personal best',
      'Battre mon record personnel sur 2 000 m',
    ),
    goal(
      'Qualify for the national regatta',
      'Me qualifier pour la régate nationale',
    ),
    goal(
      'Improve my power and stroke efficiency',
      'Améliorer ma puissance et mon efficacité de rame',
    ),
  ],
  gymnastics: [
    goal('Master my next skill', 'Maîtriser mon prochain mouvement'),
    goal(
      'Qualify for the national championships',
      'Me qualifier pour les championnats nationaux',
    ),
    goal(
      'Complete a clean competition routine',
      'Réaliser un enchaînement propre en compétition',
    ),
  ],
} as const;

type GoalFamily = keyof typeof goalFamilies;

const sportFamilies: Record<string, GoalFamily> = {
  football: 'football',
  basketball: 'basketball',
  running: 'running',
  swimming: 'swimming',
  cycling: 'cycling',
  tennis: 'racket',
  volleyball: 'team',
  gym: 'fitness',
  cricket: 'team',
  boxing: 'boxing',
  golf: 'golf',
  rugby: 'rugby',
  athletics: 'athletics',
  baseball: 'baseball',
  badminton: 'racket',
  'table-tennis': 'racket',
  'martial-arts': 'martialArts',
  mma: 'boxing',
  'american-football': 'team',
  handball: 'team',
  'ice-hockey': 'team',
  'field-hockey': 'team',
  padel: 'racket',
  gymnastics: 'gymnastics',
  weightlifting: 'strength',
  powerlifting: 'strength',
  crossfit: 'crossfit',
  hyrox: 'hyrox',
  triathlon: 'triathlon',
  'trail-running': 'trail',
  climbing: 'climbing',
  hiking: 'hiking',
  surfing: 'surfing',
  skiing: 'snow',
  snowboarding: 'snow',
  skateboarding: 'skateboarding',
  rowing: 'rowing',
};

const genericGoals = [
  goal('Set a new personal best', 'Battre un nouveau record personnel'),
  goal('Complete my first competition', 'Terminer ma première compétition'),
  goal(
    'Train consistently for the next 12 weeks',
    'M’entraîner régulièrement pendant 12 semaines',
  ),
];

export function getGoalSuggestions({
  locale,
  sportSlugs,
  limit = 6,
}: {
  locale: Locale;
  sportSlugs: readonly string[];
  limit?: number;
}) {
  const selectedFamilies = sportSlugs
    .map((slug) => sportFamilies[slug])
    .filter((family, index, families): family is GoalFamily =>
      Boolean(family && families.indexOf(family) === index),
    );
  const sources = selectedFamilies.length
    ? selectedFamilies.map((family) => goalFamilies[family])
    : [genericGoals];
  const suggestions: GoalSuggestion[] = [];

  for (
    let suggestionIndex = 0;
    suggestions.length < limit;
    suggestionIndex += 1
  ) {
    let foundSuggestion = false;

    sources.forEach((source, sourceIndex) => {
      const suggestion = source[suggestionIndex];
      if (!suggestion || suggestions.length >= limit) return;
      foundSuggestion = true;
      const title = suggestion[locale];
      if (!suggestions.some((item) => item.title === title)) {
        suggestions.push({
          id: `${selectedFamilies[sourceIndex] ?? 'general'}-${suggestionIndex}`,
          title,
        });
      }
    });

    if (!foundSuggestion) break;
  }

  for (const [index, suggestion] of genericGoals.entries()) {
    if (suggestions.length >= limit) break;
    const title = suggestion[locale];
    if (!suggestions.some((item) => item.title === title)) {
      suggestions.push({ id: `general-${index}`, title });
    }
  }

  return suggestions;
}
