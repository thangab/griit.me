import type { Locale } from '@/lib/i18n/config';

const en = {
  badge: 'More than a link in bio for athletes',
  heroLine1: 'Your journey deserves',
  heroLine2: 'more',
  heroAccent: 'visibility.',
  heroDescription:
    'Whether you are getting started, chasing a record, or coaching others, build a powerful public profile around your journey and expertise.',
  createProfile: 'Create your profile',
  exploreTemplates: 'Explore templates',
  launchAnnual: 'Pro Annual',
  firstAthletes: 'athletes',
  benefits: [
    'Free to start',
    'Works for every sport',
    'Mobile first',
    'No code',
  ],
  journey: [
    ['Lead with the goal', 'Give people a reason to follow the journey.'],
    ['Own your identity', 'Build a profile that feels unmistakably yours.'],
    ['Show the work', 'Bring results, training, and content together.'],
    ['Create opportunities', 'Turn attention into partnerships and support.'],
  ],
  editorEyebrow: 'Built around your story',
  editorTitle1: 'Everything you need.',
  editorTitle2: 'One clear editor.',
  editorDescription:
    'Shape your profile, organize your content, and see every change as it happens. No code, no disconnected tools, and no guessing what visitors will see.',
  editorCta: 'Build your profile',
  featuresEyebrow: 'More than a link in bio',
  featuresTitle: 'Everything you need to show your journey and expertise.',
  features: [
    [
      'Put your next goal first',
      'Make the objective you are chasing obvious from the first screen, with a date, countdown, and dedicated link.',
    ],
    [
      'Build your sporting identity',
      'Choose a complete visual direction, then customize every detail to match your personality and discipline.',
    ],
    [
      'Tell the full story',
      'Bring together achievements, activities, photos, videos, personal links, and the work behind your progress.',
    ],
    [
      'Show your impact',
      'Understand profile views, clicks, traffic sources, audience, and block engagement.',
    ],
    [
      'Turn attention into opportunities',
      'Show existing sponsors, promote affiliate offers, and make it clear when you are open to partnerships.',
    ],
    [
      'Every sport. Every level.',
      'From first-time athletes to experienced coaches: running, HYROX, gym, cycling, combat sports, team sports, and everything in between.',
    ],
  ],
  templatesEyebrow: 'Every journey is different',
  templatesTitle: 'A profile that looks like your ambition.',
  templatesDescription:
    'These are real Griit profile layouts. Start with a complete visual direction, then adapt every word, color, and block to your story.',
  templatesCta: 'Explore all templates',
  analyticsEyebrow: 'Grow your sporting presence',
  analyticsTitle: 'See what moves your audience.',
  analyticsDescription:
    'Track views, clicks, traffic sources, and audience behavior. See which goals, partnerships, and stories create real engagement.',
  analyticsStats: [
    'Profile views',
    'Click-through rate',
    'Unique visitors',
    'Block clicks',
  ],
  pricingEyebrow: 'Simple pricing',
  pricingTitle: 'Start free. Grow with your goals.',
  launchOffer: 'Launch offer for the first',
  withCode: 'with code',
  saveCompared: 'Save',
  comparedMonthly: 'compared with 12 months of Pro Monthly.',
  compareFeatures: 'Compare every feature',
  faqEyebrow: 'Questions, answered',
  faqTitle: 'Everything before your first rep.',
  faqDescription:
    'The essentials about creating, publishing, and growing your athlete profile.',
  faq: [
    [
      'Can I build and publish a profile for free?',
      'Yes. The Free plan includes one public profile, every core block, four templates, essential styles, and the key analytics you need to get started.',
    ],
    [
      'Is Griit only for professional athletes?',
      'Not at all. Griit is for athletes at every level, from a first goal to the professional circuit, as well as coaches who want to share their expertise and services.',
    ],
    [
      'Can I use Griit for any sport?',
      'Yes. You can select from a broad sport directory, combine multiple disciplines, or add your own sport when it is not listed.',
    ],
    [
      'How much can I customize my profile?',
      'Every profile lets you change its content, wording, template, and core visual direction. Pro unlocks every template and typography style, plus custom colors, shapes, textures, gallery layouts, and advanced appearance controls.',
    ],
    [
      'What analytics are included?',
      'Free includes profile views, unique visitors, clicks, and click-through rate. Pro adds deeper audience, campaign, social, and individual block analytics.',
    ],
    [
      'Can I manage more than one public profile?',
      'Yes. Pro lets you create and manage up to five independent public profiles from the same account, each with its own content, design, URL, and analytics.',
    ],
    [
      'Can I pay for Pro annually?',
      'Yes. Pro is $5 per month or $48 per year. The launch offer reduces the first annual payment to $36 for the first 100 athletes.',
    ],
    [
      'Can I use my own domain?',
      'Custom domains and downloadable QR codes are planned for Pro. They are marked as coming soon while we finish making the setup reliable and simple.',
    ],
    [
      'What if I manage a club or a group of athletes?',
      'Griit Teams is designed for clubs, academies, agencies, coaches, and athlete managers, with a tailored collaborative workspace.',
    ],
  ],
  finalTitle: 'Give your next goal a place to live.',
} as const;

const fr = {
  badge: 'Bien plus qu’un link in bio pour les sportifs.',
  heroLine1: 'Votre parcours mérite',
  heroLine2: 'plus de',
  heroAccent: 'visibilité.',
  heroDescription:
    'Que vous débutiez, visiez un record ou accompagniez d’autres sportifs, réunissez votre parcours et votre expertise sur un profil qui vous ressemble.',
  createProfile: 'Créer mon profil',
  exploreTemplates: 'Voir les templates',
  launchAnnual: 'Pro Annual',
  firstAthletes: 'premiers athlètes',
  benefits: [
    '0 $ pour se lancer',
    'Tous sports, tous niveaux',
    'Mobile-first',
    'Zéro code',
  ],
  journey: [
    [
      'Annoncez votre prochain objectif',
      'Donnez à votre audience une raison de suivre la progression.',
    ],
    [
      'Posez votre identité',
      'Créez un profil reconnaissable au premier regard.',
    ],
    [
      'Montrez le travail derrière le résultat',
      'Rassemblez entraînements, performances et contenus au même endroit.',
    ],
    [
      'Ouvrez le jeu',
      'Transformez votre visibilité en contacts, soutien et partenariats.',
    ],
  ],
  editorEyebrow: 'Votre parcours, votre espace',
  editorTitle1: 'Tout votre profil.',
  editorTitle2: 'Un seul studio.',
  editorDescription:
    'Ajoutez vos contenus, construisez votre identité visuelle et voyez chaque changement en live. Aucun code, aucun outil dispersé, juste votre parcours au bon format.',
  editorCta: 'Lancer mon profil',
  featuresEyebrow: "Plus qu'un link in bio",
  featuresTitle:
    'Tout le nécessaire pour montrer votre parcours et votre expertise.',
  features: [
    [
      'Votre prochain objectif, dès le premier écran',
      'Affichez clairement la performance que vous visez avec une date, un countdown et un lien dédié.',
    ],
    [
      'Un personal branding qui vous ressemble',
      'Choisissez un template fort, puis adaptez chaque détail à votre personnalité, votre discipline et votre énergie.',
    ],
    [
      'Montrez plus que le résultat final',
      'Réunissez achievements, activités, photos, vidéos et coulisses de votre progression.',
    ],
    [
      'Pilotez votre progression avec les analytics',
      'Suivez les vues, les clics, les sources de trafic et les contenus qui font vraiment réagir votre audience.',
    ],
    [
      'Transformez l’attention en opportunités',
      'Mettez vos sponsors en avant, partagez vos offres et indiquez clairement que vous êtes ouvert aux collaborations.',
    ],
    [
      'Tous les sports. Tous les niveaux.',
      'Du premier objectif au coaching confirmé : running, HYROX, gym, cycling, sports de combat, sports collectifs et tout ce qui vous fait bouger.',
    ],
  ],
  templatesEyebrow: 'Votre énergie, votre direction',
  templatesTitle: 'Un template aussi fort que votre ambition.',
  templatesDescription:
    'Choisissez une base qui donne le ton, puis personnalisez chaque mot, couleur et bloc pour construire un profil vraiment à vous.',
  templatesCta: 'Explorer les templates',
  analyticsEyebrow: 'Pilotez votre présence',
  analyticsTitle: 'Voyez ce qui fait bouger votre audience.',
  analyticsDescription:
    'Suivez les vues, les clics et les sources de trafic. Repérez les objectifs, contenus et partenariats qui créent le plus d’engagement.',
  analyticsStats: [
    'Vues du profil',
    'Taux de clic',
    'Visiteurs uniques',
    'Clics sur les blocs',
  ],
  pricingEyebrow: 'Des offres sans prise de tête',
  pricingTitle: 'Start free. Passez Pro quand votre ambition grandit.',
  launchOffer: 'Offre de lancement pour les',
  withCode: 'avec le code',
  saveCompared: 'Économisez',
  comparedMonthly: 'par rapport à 12 mois de Pro mensuel.',
  compareFeatures: 'Comparer toutes les offres',
  faqEyebrow: 'Avant le départ',
  faqTitle: 'Les réponses avant votre première rep.',
  faqDescription:
    'Tout ce qu’il faut savoir pour créer, publier et faire grandir votre profil.',
  faq: [
    [
      'Puis-je créer et publier un profil gratuitement ?',
      'Oui. Le plan Free inclut un profil public, tous les blocs essentiels, quatre templates, les styles de base et les analytics nécessaires pour prendre le départ.',
    ],
    [
      'Griit est-il réservé aux athlètes professionnels ?',
      'Non. Griit est fait pour les sportifs de tous niveaux, du premier objectif au circuit pro, ainsi que pour les coachs qui veulent présenter leur expertise et leurs services.',
    ],
    [
      'Puis-je utiliser Griit pour n’importe quel sport ?',
      'Oui. Choisissez parmi un large catalogue, combinez plusieurs disciplines ou ajoutez votre propre sport.',
    ],
    [
      'Jusqu’où puis-je personnaliser mon profil ?',
      'Vous pouvez modifier le contenu, les textes, le template et toute la direction visuelle. Pro débloque l’ensemble des templates, typographies, couleurs, formes, textures et réglages avancés.',
    ],
    [
      'Quelles statistiques sont incluses ?',
      'Free inclut les vues, visiteurs uniques, clics et taux de clic. Pro ajoute des analytics détaillées sur l’audience, les campagnes, les réseaux et chaque bloc.',
    ],
    [
      'Puis-je gérer plusieurs profils ?',
      'Oui. Pro permet de gérer jusqu’à cinq profils publics indépendants avec leur propre contenu, design, URL et statistiques.',
    ],
    [
      'Puis-je payer Pro à l’année ?',
      'Oui. Pro coûte 5 $ par mois ou 48 $ par an. L’offre de lancement ramène le premier paiement annuel à 36 $ pour les 100 premiers athlètes.',
    ],
    [
      'Puis-je utiliser mon propre domaine ?',
      'Les domaines personnalisés et QR codes téléchargeables sont prévus pour Pro et indiqués comme bientôt disponibles.',
    ],
    [
      'Et si je gère un club ou plusieurs athlètes ?',
      'Griit Teams est pensé pour les clubs, académies, agences, coachs et managers avec un espace collaboratif sur mesure.',
    ],
  ],
  finalTitle:
    'Votre prochain objectif mérite plus qu’une ligne dans votre bio.',
} as const;

export function getMarketingHomeContent(locale: Locale) {
  return locale === 'fr' ? fr : en;
}
