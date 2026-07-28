import type { Locale } from '@/lib/i18n/config';

const en = {
  badge: 'The link in bio built for athletes',
  heroLine1: 'Your next goal.',
  heroLine2: 'Your athlete',
  heroAccent: 'story.',
  heroDescription:
    'Build a powerful public profile around what you are chasing, what you have achieved, and where you are going next.',
  createProfile: 'Create your athlete profile',
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
  editorCta: 'Build your athlete profile',
  featuresEyebrow: 'More than a link in bio',
  featuresTitle: 'Everything an athlete needs to tell the full story.',
  features: [
    [
      'Put your next goal first',
      'Make the objective you are chasing obvious from the first screen, with a date, countdown, and dedicated link.',
    ],
    [
      'Build your athlete identity',
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
      'Made for every sport',
      'Running, HYROX, gym, cycling, combat sports, team sports, coaching, and everything in between.',
    ],
  ],
  templatesEyebrow: 'Every athlete is different',
  templatesTitle: 'A profile that looks like your ambition.',
  templatesDescription:
    'These are real Griit profile layouts. Start with a complete visual direction, then adapt every word, color, and block to your story.',
  templatesCta: 'Explore all templates',
  analyticsEyebrow: 'Grow your athlete presence',
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
      'Yes. The Free plan includes one public athlete profile, every core block, four templates, essential styles, and the key analytics you need to get started.',
    ],
    [
      'Is Griit only for professional athletes?',
      'Not at all. Griit is built for athletes at every level—from someone preparing for a first race to a professional building a stronger public presence.',
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
      'Can I manage more than one athlete profile?',
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
  badge: 'Le link in bio conçu pour les athlètes',
  heroLine1: 'Votre prochain objectif.',
  heroLine2: "Votre parcours d'athlète",
  heroAccent: 'mérite sa page.',
  heroDescription:
    'Créez un profil public puissant autour de vos objectifs, de vos réussites et de la suite de votre parcours.',
  createProfile: "Créer mon profil d'athlète",
  exploreTemplates: 'Découvrir les templates',
  launchAnnual: 'Pro annuel',
  firstAthletes: 'premiers athlètes',
  benefits: [
    'Gratuit pour commencer',
    'Pour tous les sports',
    'Pensé pour mobile',
    'Sans code',
  ],
  journey: [
    [
      "Mettez l'objectif en avant",
      'Donnez une vraie raison de suivre votre parcours.',
    ],
    [
      'Affirmez votre identité',
      'Construisez un profil qui ne ressemble qu’à vous.',
    ],
    ['Montrez le travail', 'Réunissez résultats, entraînements et contenus.'],
    [
      'Créez des opportunités',
      "Transformez l'attention en partenariats et en soutien.",
    ],
  ],
  editorEyebrow: 'Construit autour de votre histoire',
  editorTitle1: 'Tout ce qu’il vous faut.',
  editorTitle2: 'Un éditeur clair.',
  editorDescription:
    'Structurez votre profil, organisez vos contenus et visualisez chaque changement en direct. Sans code, sans outils dispersés et sans mauvaise surprise.',
  editorCta: "Créer mon profil d'athlète",
  featuresEyebrow: "Bien plus qu'un link in bio",
  featuresTitle: "Tout ce qu'il faut pour raconter votre parcours d'athlète.",
  features: [
    [
      'Votre prochain objectif en premier',
      'Affichez clairement ce que vous visez dès le premier écran, avec une date, un compte à rebours et un lien dédié.',
    ],
    [
      "Construisez votre identité d'athlète",
      'Choisissez une direction visuelle complète, puis adaptez chaque détail à votre personnalité et à votre discipline.',
    ],
    [
      'Racontez toute votre histoire',
      'Réunissez réussites, activités, photos, vidéos, liens et coulisses de votre progression.',
    ],
    [
      'Mesurez votre impact',
      'Suivez les vues, les clics, les sources de trafic, votre audience et l’engagement de chaque bloc.',
    ],
    [
      "Transformez l'attention en opportunités",
      'Présentez vos sponsors, partagez vos offres affiliées et montrez clairement que vous êtes ouvert aux partenariats.',
    ],
    [
      'Conçu pour tous les sports',
      'Running, HYROX, musculation, cyclisme, sports de combat, sports collectifs, coaching et bien plus.',
    ],
  ],
  templatesEyebrow: 'Chaque athlète est différent',
  templatesTitle: 'Un profil à la hauteur de votre ambition.',
  templatesDescription:
    'Partez d’une direction visuelle complète, puis adaptez chaque mot, chaque couleur et chaque bloc à votre histoire.',
  templatesCta: 'Voir tous les templates',
  analyticsEyebrow: 'Développez votre présence',
  analyticsTitle: 'Comprenez ce qui engage votre audience.',
  analyticsDescription:
    'Suivez les vues, les clics, les sources de trafic et le comportement de votre audience. Identifiez les objectifs et contenus qui génèrent un véritable engagement.',
  analyticsStats: [
    'Vues du profil',
    'Taux de clic',
    'Visiteurs uniques',
    'Clics sur les blocs',
  ],
  pricingEyebrow: 'Des tarifs simples',
  pricingTitle: 'Commencez gratuitement. Évoluez avec vos objectifs.',
  launchOffer: 'Offre de lancement pour les',
  withCode: 'avec le code',
  saveCompared: 'Économisez',
  comparedMonthly: 'par rapport à 12 mois de Pro mensuel.',
  compareFeatures: 'Comparer toutes les fonctionnalités',
  faqEyebrow: 'Vos questions, nos réponses',
  faqTitle: 'Tout savoir avant de commencer.',
  faqDescription:
    "L'essentiel pour créer, publier et développer votre profil d'athlète.",
  faq: [
    [
      'Puis-je créer et publier un profil gratuitement ?',
      'Oui. Le plan Free inclut un profil public, tous les blocs essentiels, quatre templates, les styles de base et les statistiques nécessaires pour démarrer.',
    ],
    [
      'Griit est-il réservé aux athlètes professionnels ?',
      'Non. Griit accompagne tous les niveaux, de la première compétition au développement d’une présence professionnelle.',
    ],
    [
      'Puis-je utiliser Griit pour n’importe quel sport ?',
      'Oui. Choisissez parmi un large catalogue, combinez plusieurs disciplines ou ajoutez votre propre sport.',
    ],
    [
      'Jusqu’où puis-je personnaliser mon profil ?',
      'Vous pouvez modifier le contenu, les textes, le template et la direction visuelle. Pro débloque tous les templates, typographies, couleurs, formes, textures et réglages avancés.',
    ],
    [
      'Quelles statistiques sont incluses ?',
      'Free inclut les vues, visiteurs uniques, clics et taux de clic. Pro ajoute les analyses détaillées de l’audience, des campagnes, réseaux sociaux et blocs.',
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
  finalTitle: 'Donnez une vraie place à votre prochain objectif.',
} as const;

export function getMarketingHomeContent(locale: Locale) {
  return locale === 'fr' ? fr : en;
}
