import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRightIcon,
  ChartLineUpIcon,
  CheckIcon,
  GlobeIcon,
  LightningIcon,
  LinkIcon,
  PaletteIcon,
  SparkleIcon,
  SquaresFourIcon,
} from '@phosphor-icons/react/ssr';
import { createServerSupabaseClient } from '@/lib/config/supabase-server';
import { PricingPlanCards } from './pricing-plan-cards';
import { launchOffer } from '@/lib/constants/billing';
import { getRequestLocale } from '@/lib/i18n/server';

const pricingFr: Record<string, string> = {
  'Public profiles': 'Profils athlètes',
  'Up to 5': 'Jusqu’à 5',
  Tailored: 'Sur mesure',
  'Billing frequency': 'Rythme de facturation',
  'Free forever': 'Gratuit pour toujours',
  'Monthly or annual': 'Mensuelle ou annuelle',
  Custom: 'Sur mesure',
  'Launch offer': 'Offre de lancement',
  'Public griit.me address': 'Adresse publique griit.me',
  'Content and partnership blocks': 'Blocs de contenu et de partenariat',
  'All types': 'Tous les types',
  'Active goals': 'Objectifs actifs',
  'Up to 3': 'Jusqu’à 3',
  'Gallery images': 'Images de galerie',
  'Up to 50': 'Jusqu’à 50',
  Achievements: 'Achievements',
  Activities: 'Activités',
  Templates: 'Templates',
  '4 core': '4 essentiels',
  'All 8': 'Les 8',
  'Typography styles': 'Styles typographiques',
  'All 4': 'Les 4',
  'Quick color palettes': 'Palettes de couleurs rapides',
  'Custom colors': 'Couleurs personnalisées',
  'Header geometry and textures': 'Formes et textures de l’en-tête',
  'Core selection': 'Sélection essentielle',
  'All options': 'Toutes les options',
  'Profile picture shapes': 'Formes de la photo de profil',
  '2 shapes': '2 formes',
  'Gallery layouts': 'Dispositions de galerie',
  Grid: 'Grille',
  'Grid, editorial, carousel': 'Grille, éditoriale et carrousel',
  'All layouts': 'Toutes les dispositions',
  'Solid shadows and custom border color':
    'Ombres pleines et couleur de bordure personnalisée',
  'Views, visitors, clicks, and CTR': 'Vues, visiteurs, clics et taux de clic',
  'Audience, traffic, and campaign analytics':
    'Analytics audience, trafic et campagnes',
  'Block and social interaction details':
    'Détails des interactions avec les blocs et réseaux',
  'Profile management and switching': 'Gestion et changement de profil',
  'Organization workspace and member roles':
    'Espace d’organisation et rôles des membres',
  'Guided rollout': 'Déploiement accompagné',
  'Consolidated analytics and exports': 'Statistiques consolidées et exports',
  'Shared templates and branding': 'Modèles et identité visuelle partagés',
  'Centralized billing': 'Facturation centralisée',
  'Griit branding': 'Signature Griit',
  Included: 'Incluse',
  Removed: 'Retirée',
  Support: 'Support',
  Standard: 'Standard',
  Priority: 'Prioritaire',
  'Dedicated priority': 'Prioritaire dédié',
  'Custom domain': 'Domaine personnalisé',
  'Coming soon': 'Bientôt disponible',
  'Downloadable QR code': 'Code QR téléchargeable',
  'A complete athlete page': 'Tout votre parcours, une seule page',
  'Bring goals, results, activities, media, links, sponsors, and offers into one focused profile.':
    'Objectifs, résultats, activités, médias, sponsors et offres : tout est réuni dans un profil clair.',
  'A design that feels like you': 'Un design qui porte votre identité',
  'Start from a template, then adjust the header, colors, type, shapes, and blocks around your identity.':
    'Partez d’un template, puis adaptez le header, les couleurs, la typographie, les formes et les blocs à votre énergie.',
  'Analytics from day one': 'Vos analytics dès le départ',
  'Understand whether people view your profile and which links or content turn attention into action.':
    'Repérez les visites, les clics et les contenus qui transforment l’attention en action.',
  'Built for opportunities': 'Prêt pour les opportunités',
  'Show current partners, share affiliate offers, and make it easy for a future sponsor to reach you.':
    'Mettez vos partenaires en avant, partagez vos offres et facilitez le premier contact avec de futurs sponsors.',
  'Can I build a useful profile on Free?':
    'Puis-je créer un profil complet gratuitement ?',
  'Yes. Free includes one complete public profile, every core block type, four templates, all quick color palettes, and essential analytics.':
    'Oui. Free inclut un profil complet, tous les blocs essentiels, quatre templates, toutes les palettes rapides et les analytics principales.',
  'What happens when I upgrade?': 'Que se passe-t-il lorsque je passe à Pro ?',
  'Your existing profile stays exactly as it is. Pro immediately unlocks every template and typography style, custom colors, advanced design controls, higher content limits, multiple profiles, and detailed analytics.':
    'Votre profil reste intact. Pro débloque immédiatement tous les templates et styles typographiques, les couleurs personnalisées, les réglages avancés, plusieurs profils et des analytics détaillées.',
  'Can I pay for Pro annually?': 'Puis-je payer Pro à l’année ?',
  'Who needs multiple profiles?': 'À qui servent les profils multiples ?',
  'They are useful for coaches, teams, managers, multi-discipline creators, or anyone managing separate public identities from one account.':
    'Ils sont utiles aux coachs, équipes, managers, créateurs multidisciplinaires et à toute personne qui gère plusieurs identités publiques depuis un même compte.',
  'Does each Pro profile have separate analytics?':
    'Chaque profil Pro possède-t-il ses propres statistiques ?',
  'Yes. Every public profile keeps its own username, content, design, publication status, and analytics history.':
    'Oui. Chaque profil public conserve son propre nom d’utilisateur, contenu, design, statut de publication et historique statistique.',
  'Are custom domains and QR codes already available?':
    'Les domaines personnalisés et codes QR sont-ils déjà disponibles ?',
  'Not yet. Both features are planned for Pro and marked as coming soon. Custom domains will let you connect your own address, while QR codes will provide a downloadable shortcut to your profile.':
    'Pas encore. Ces deux fonctionnalités sont prévues pour Pro et indiquées comme bientôt disponibles. Vous pourrez connecter votre propre domaine et télécharger un code QR vers votre profil.',
  'Does Pro include priority support?':
    'Pro inclut-il un support prioritaire ?',
  'Yes. Pro members receive priority support, so their requests are reviewed before standard Free plan requests.':
    'Oui. Les demandes des membres Pro sont traitées en priorité par rapport à celles du plan Gratuit.',
  'What is included in Griit Teams?': 'Que comprend Griit Équipes ?',
  'Teams is a tailored workspace for clubs, academies, agencies, and managers. It brings athlete profiles, collaborators, shared branding, organization analytics, and centralized management together through a guided rollout.':
    'Équipes est un espace sur mesure pour les clubs, académies, agences et managers. Il réunit les profils d’athlètes, les collaborateurs, l’identité visuelle partagée, les statistiques de l’organisation et une gestion centralisée.',
  'Up to five profiles, each with its own public address.':
    'Jusqu’à cinq profils, chacun avec sa propre adresse publique.',
  'All templates, typography, colors, shapes, textures, and gallery layouts.':
    'Tous les modèles, typographies, couleurs, formes, textures et dispositions de galerie.',
  'More goals and content, plus detailed audience and interaction analytics.':
    'Plus d’objectifs et de contenu, avec des statistiques détaillées sur l’audience et les interactions.',
  'Priority support, with custom domains and downloadable QR codes coming soon.':
    'Support prioritaire, avec les domaines personnalisés et codes QR téléchargeables bientôt disponibles.',
};

export const metadata: Metadata = {
  title: 'Pricing — Griit',
  description:
    'Compare Griit Free, Pro, and Teams. Build an athlete profile, unlock advanced tools, or manage a complete athlete organization.',
};

const comparisonRows = [
  { label: 'Public profiles', free: '1', pro: 'Up to 5', teams: 'Tailored' },
  {
    label: 'Billing frequency',
    free: 'Free forever',
    pro: 'Monthly or annual',
    teams: 'Custom',
  },
  {
    label: 'Launch offer',
    free: '—',
    pro: '$48 → $36 for the first 100 athletes',
    teams: '—',
  },
  { label: 'Public griit.me address', free: true, pro: true, teams: true },
  {
    label: 'Content and partnership blocks',
    free: 'All types',
    pro: 'All types',
    teams: 'All types',
  },
  { label: 'Active goals', free: '1', pro: 'Up to 3', teams: 'Tailored' },
  {
    label: 'Gallery images',
    free: 'Up to 3',
    pro: 'Up to 50',
    teams: 'Tailored',
  },
  {
    label: 'Achievements',
    free: 'Up to 3',
    pro: 'Up to 50',
    teams: 'Tailored',
  },
  {
    label: 'Activities',
    free: 'Up to 3',
    pro: 'Up to 50',
    teams: 'Tailored',
  },
  { label: 'Templates', free: '4 core', pro: 'All 8', teams: 'All 8' },
  {
    label: 'Typography styles',
    free: 'Clean',
    pro: 'All 4',
    teams: 'All 4',
  },
  { label: 'Quick color palettes', free: true, pro: true, teams: true },
  { label: 'Custom colors', free: false, pro: true, teams: true },
  {
    label: 'Header geometry and textures',
    free: 'Core selection',
    pro: 'All options',
    teams: 'All options',
  },
  {
    label: 'Profile picture shapes',
    free: '2 shapes',
    pro: 'All 4',
    teams: 'All 4',
  },
  {
    label: 'Gallery layouts',
    free: 'Grid',
    pro: 'Grid, editorial, carousel',
    teams: 'All layouts',
  },
  {
    label: 'Solid shadows and custom border color',
    free: false,
    pro: true,
    teams: true,
  },
  {
    label: 'Views, visitors, clicks, and CTR',
    free: true,
    pro: true,
    teams: true,
  },
  {
    label: 'Audience, traffic, and campaign analytics',
    free: false,
    pro: true,
    teams: true,
  },
  {
    label: 'Block and social interaction details',
    free: false,
    pro: true,
    teams: true,
  },
  {
    label: 'Profile management and switching',
    free: false,
    pro: true,
    teams: true,
  },
  {
    label: 'Organization workspace and member roles',
    free: false,
    pro: false,
    teams: 'Guided rollout',
  },
  {
    label: 'Consolidated analytics and exports',
    free: false,
    pro: false,
    teams: 'Guided rollout',
  },
  {
    label: 'Shared templates and branding',
    free: false,
    pro: false,
    teams: 'Guided rollout',
  },
  {
    label: 'Centralized billing',
    free: false,
    pro: false,
    teams: 'Guided rollout',
  },
  {
    label: 'Griit branding',
    free: 'Included',
    pro: 'Removed',
    teams: 'Removed',
  },
  {
    label: 'Support',
    free: 'Standard',
    pro: 'Priority',
    teams: 'Dedicated priority',
  },
  {
    label: 'Custom domain',
    free: false,
    pro: 'Coming soon',
    teams: 'Coming soon',
  },
  {
    label: 'Downloadable QR code',
    free: false,
    pro: 'Coming soon',
    teams: 'Coming soon',
  },
] as const;

const sharedBenefits = [
  {
    icon: SquaresFourIcon,
    title: 'A complete athlete page',
    description:
      'Bring goals, results, activities, media, links, sponsors, and offers into one focused profile.',
    color: 'bg-[#e8e0ff]',
  },
  {
    icon: PaletteIcon,
    title: 'A design that feels like you',
    description:
      'Start from a template, then adjust the header, colors, type, shapes, and blocks around your identity.',
    color: 'bg-[#ffe0ce]',
  },
  {
    icon: ChartLineUpIcon,
    title: 'Analytics from day one',
    description:
      'Understand whether people view your profile and which links or content turn attention into action.',
    color: 'bg-[#cfe4ff]',
  },
  {
    icon: LinkIcon,
    title: 'Built for opportunities',
    description:
      'Show current partners, share affiliate offers, and make it easy for a future sponsor to reach you.',
    color: 'bg-[#dff5b4]',
  },
] as const;

const faqs = [
  {
    question: 'Can I build a useful profile on Free?',
    answer:
      'Yes. Free includes one complete public profile, every core block type, four templates, all quick color palettes, and essential analytics.',
  },
  {
    question: 'What happens when I upgrade?',
    answer:
      'Your existing profile stays exactly as it is. Pro immediately unlocks every template and typography style, custom colors, advanced design controls, higher content limits, multiple profiles, and detailed analytics.',
  },
  {
    question: 'Can I pay for Pro annually?',
    answer: `Yes. Pro costs $5 monthly or $48 annually. For the first 100 athletes, code ${launchOffer.code} reduces the first annual payment from $48 to $36. That is $24 less than paying for 12 months of Pro Monthly.`,
  },
  {
    question: 'Who needs multiple profiles?',
    answer:
      'They are useful for coaches, teams, managers, multi-discipline creators, or anyone managing separate public identities from one account.',
  },
  {
    question: 'Does each Pro profile have separate analytics?',
    answer:
      'Yes. Every public profile keeps its own username, content, design, publication status, and analytics history.',
  },
  {
    question: 'Are custom domains and QR codes already available?',
    answer:
      'Not yet. Both features are planned for Pro and marked as coming soon. Custom domains will let you connect your own address, while QR codes will provide a downloadable shortcut to your profile.',
  },
  {
    question: 'Does Pro include priority support?',
    answer:
      'Yes. Pro members receive priority support, so their requests are reviewed before standard Free plan requests.',
  },
  {
    question: 'What is included in Griit Teams?',
    answer:
      'Teams is a tailored workspace for clubs, academies, agencies, and managers. It brings athlete profiles, collaborators, shared branding, organization analytics, and centralized management together through a guided rollout.',
  },
] as const;

function ComparisonValue({
  value,
  inverse = false,
  translate = (text) => text,
}: {
  value: boolean | string;
  inverse?: boolean;
  translate?: (text: string) => string;
}) {
  if (typeof value === 'string') {
    return <span className="text-sm font-semibold">{translate(value)}</span>;
  }

  return value ? (
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#dff5b4] text-[#151515]">
      <CheckIcon className="h-3.5 w-3.5" weight="bold" />
      <span className="sr-only">Included</span>
    </span>
  ) : (
    <span
      className={`text-lg ${inverse ? 'text-white/30' : 'text-black/25'}`}
      aria-label="Not included"
    >
      —
    </span>
  );
}

export default async function PricingPage() {
  const isFrench = (await getRequestLocale()) === 'fr';
  const t = (text: string) => (isFrench ? (pricingFr[text] ?? text) : text);
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.auth.getSession();
  const isAuthenticated = Boolean(data.session);

  return (
    <main className="overflow-hidden">
      <section className="relative border-b border-black/10 px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(169,237,53,0.4),transparent_24%),radial-gradient(circle_at_82%_28%,rgba(49,87,255,0.2),transparent_26%)]" />
        <div className="relative mx-auto max-w-[1180px] text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3 py-1.5 text-xs font-bold backdrop-blur">
            <SparkleIcon className="h-4 w-4 text-[#3157ff]" weight="fill" />
            {isFrench
              ? 'Des offres claires. Aucun détour.'
              : 'Simple plans. No complicated tiers.'}
          </div>
          <h1 className="mx-auto mt-7 max-w-5xl text-[clamp(3.4rem,8vw,7rem)] leading-[0.88] font-black tracking-[-0.07em]">
            {isFrench ? 'Un profil ou tout un ' : 'One profile or a whole '}
            <span className="text-[#3157ff]">roster.</span>
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-black/55">
            {isFrench
              ? 'Prenez le départ avec Free, passez au niveau supérieur avec Pro ou pilotez tout votre collectif depuis un espace partagé.'
              : 'Start around your next goal, unlock more freedom with Pro, or bring your organization into one shared athlete workspace.'}
          </p>
          <a
            className="mx-auto mt-8 grid max-w-2xl gap-3 rounded-[1.5rem] border border-black/10 bg-white/80 p-4 text-left shadow-[0_18px_55px_rgba(21,21,21,0.08)] backdrop-blur transition-transform hover:-translate-y-0.5 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:p-5"
            href="#launch-offer"
          >
            <span className="w-fit rounded-full bg-[#a9ed35] px-3 py-1 text-[10px] font-black tracking-[0.14em] uppercase">
              {isFrench ? 'Offre de lancement' : 'Launch offer'}
            </span>
            <span>
              <strong className="block text-sm">
                Pro Annual:{' '}
                <span className="text-black/35 line-through">
                  {launchOffer.regularAnnualPrice}
                </span>{' '}
                {launchOffer.firstYearPrice}
              </strong>
              <span className="mt-0.5 block text-xs text-black/45">
                {isFrench ? 'Économisez' : 'Save'}{' '}
                {launchOffer.savingsVsMonthly}{' '}
                {isFrench
                  ? 'par rapport à Pro mensuel ·'
                  : 'vs Pro Monthly · first'}{' '}
                {launchOffer.athleteLimit}{' '}
                {isFrench ? 'premiers athlètes' : 'athletes'}
              </span>
            </span>
            <span className="font-mono text-sm font-black text-[#3157ff]">
              {launchOffer.code} →
            </span>
          </a>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <PricingPlanCards isAuthenticated={isAuthenticated} />
        <p className="mx-auto mt-5 max-w-xl text-center text-xs leading-5 text-black/40">
          {isFrench
            ? 'Créez votre profil gratuitement. Le checkout Pro est sécurisé par Stripe et l’offre Teams est construite sur mesure.'
            : 'Create your account for free. Pro subscriptions are securely handled through Stripe. Teams is offered through a tailored rollout.'}
        </p>
      </section>

      <section className="border-y border-black/10 bg-white px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-[1180px]">
          <div className="max-w-3xl">
            <p className="text-xs font-black tracking-[0.18em] text-[#3157ff] uppercase">
              {isFrench ? 'Dans le starter pack' : 'Included from day one'}
            </p>
            <h2 className="mt-5 text-4xl leading-[0.95] font-black tracking-[-0.055em] sm:text-6xl">
              {isFrench
                ? 'Free ne veut pas dire au rabais.'
                : 'Free does not mean unfinished.'}
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-7 text-black/50">
              {isFrench
                ? 'Dès le départ, vous avez tout le nécessaire pour publier un profil solide et commencer à raconter votre progression.'
                : 'Every Griit account starts with the tools required to build and publish a profile worth sharing.'}
            </p>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {sharedBenefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <article
                  className={`${benefit.color} rounded-[1.75rem] p-6`}
                  key={benefit.title}
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/70">
                    <Icon className="h-5 w-5" weight="bold" />
                  </span>
                  <h3 className="mt-6 text-lg font-black">
                    {t(benefit.title)}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-black/55">
                    {t(benefit.description)}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-[1080px]">
          <div className="text-center">
            <p className="text-xs font-black tracking-[0.18em] text-[#3157ff] uppercase">
              {isFrench ? 'Choisissez votre formule' : 'Full comparison'}
            </p>
            <h2 className="mt-5 text-4xl font-black tracking-[-0.055em] sm:text-6xl">
              {isFrench
                ? 'Le bon plan pour votre niveau de jeu actuel.'
                : 'Choose what fits now.'}
            </h2>
          </div>
          <div className="mt-12 overflow-x-auto rounded-[1.75rem] border border-black/10 bg-white">
            <table className="w-full min-w-[860px] border-collapse text-left">
              <thead>
                <tr className="border-b border-black/10">
                  <th className="p-5 text-sm font-black sm:p-6">
                    {isFrench ? 'Fonctionnalité' : 'Feature'}
                  </th>
                  <th className="w-48 p-5 text-center text-sm font-black sm:p-6">
                    Free
                  </th>
                  <th className="w-48 bg-[#151515] p-5 text-center text-sm font-black text-white sm:p-6">
                    Pro
                  </th>
                  <th className="w-48 bg-[#e8edff] p-5 text-center text-sm font-black text-[#3157ff] sm:p-6">
                    Teams
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr
                    className="border-b border-black/8 last:border-0"
                    key={row.label}
                  >
                    <th className="p-5 text-sm font-semibold sm:px-6">
                      {t(row.label)}
                    </th>
                    <td className="p-5 text-center text-black/60">
                      <ComparisonValue value={row.free} translate={t} />
                    </td>
                    <td className="bg-[#151515] p-5 text-center text-white">
                      <ComparisonValue inverse value={row.pro} translate={t} />
                    </td>
                    <td className="bg-[#e8edff] p-5 text-center text-[#151515]">
                      <ComparisonValue value={row.teams} translate={t} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="bg-[#3157ff] px-5 py-20 text-white sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto grid max-w-[1180px] items-center gap-12 lg:grid-cols-[1fr_0.8fr]">
          <div>
            <LightningIcon className="h-9 w-9 text-[#a9ed35]" weight="fill" />
            <h2 className="mt-6 max-w-3xl text-5xl leading-[0.9] font-black tracking-[-0.065em] sm:text-7xl">
              {isFrench
                ? 'Pro est fait pour passer un cap.'
                : 'Pro is built for more than one chapter.'}
            </h2>
            <p className="mt-7 max-w-xl text-base leading-7 text-white/65">
              {isFrench
                ? 'Gérez plusieurs profils, montrez les entraînements derrière chaque objectif, personnalisez sans limites et comprenez ce qui crée vraiment de l’élan.'
                : 'Manage separate athlete identities, publish more of the work behind each goal, design without limits, and understand which stories create momentum.'}
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {[
              ['01', 'Up to five profiles, each with its own public address.'],
              [
                '02',
                'All templates, typography, colors, shapes, textures, and gallery layouts.',
              ],
              [
                '03',
                'More goals and content, plus detailed audience and interaction analytics.',
              ],
              [
                '04',
                'Priority support, with custom domains and downloadable QR codes coming soon.',
              ],
            ].map(([number, text]) => (
              <div className="rounded-2xl bg-white/10 p-5" key={number}>
                <span className="text-xs font-black text-[#a9ed35]">
                  {number}
                </span>
                <p className="mt-2 text-sm leading-6 text-white/80">
                  {t(text)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto grid max-w-[1080px] gap-12 lg:grid-cols-[0.65fr_1fr]">
          <div>
            <GlobeIcon className="h-8 w-8 text-[#3157ff]" weight="bold" />
            <h2 className="mt-5 text-4xl font-black tracking-[-0.055em] sm:text-5xl">
              {isFrench
                ? 'Le briefing avant de choisir.'
                : 'Questions, answered.'}
            </h2>
            <p className="mt-5 text-sm leading-6 text-black/50">
              {isFrench
                ? 'Commencez avec le plan adapté à votre rythme. Votre profil, votre contenu et vos données restent intacts quand vous passez Pro.'
                : 'Start with the plan that matches your needs today. Your profile and content stay with you when you upgrade.'}
            </p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <details
                className="group rounded-2xl border border-black/10 bg-white p-5"
                key={faq.question}
                open={index === 0}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold [&::-webkit-details-marker]:hidden">
                  {t(faq.question)}
                  <span className="text-xl font-light transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-black/50">
                  {isFrench && index === 2
                    ? `Oui. Pro coûte 5 $ par mois ou 48 $ par an. Pour les 100 premiers athlètes, le code ${launchOffer.code} réduit le premier paiement annuel de 48 $ à 36 $, soit 24 $ de moins que 12 mensualités Pro.`
                    : t(faq.answer)}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-black/10 bg-[#a9ed35] px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto flex max-w-[1180px] flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-black tracking-[0.18em] uppercase">
              {isFrench
                ? 'La ligne de départ est ici'
                : 'Your profile can start today'}
            </p>
            <h2 className="mt-5 max-w-4xl text-5xl leading-[0.9] font-black tracking-[-0.065em] sm:text-7xl">
              {isFrench
                ? 'Donnez à votre prochain objectif une page à sa hauteur.'
                : 'Give your next goal a place to live.'}
            </h2>
          </div>
          <Link
            className="inline-flex h-13 shrink-0 items-center gap-2 rounded-full bg-[#151515] px-7 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
            href={isAuthenticated ? '/dashboard' : '/sign-up'}
          >
            {isAuthenticated
              ? isFrench
                ? 'Ouvrir le Studio'
                : 'Open dashboard'
              : isFrench
                ? 'Créer mon profil gratuitement'
                : 'Create your free profile'}
            <ArrowRightIcon className="h-4 w-4" weight="bold" />
          </Link>
        </div>
      </section>
    </main>
  );
}
