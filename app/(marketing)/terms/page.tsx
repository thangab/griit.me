import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalDocument } from '../_components/legal-document';
import { getRequestLocale } from '@/lib/i18n/server';

export const metadata: Metadata = {
  title: 'Terms of Service — Griit',
  description:
    'The terms that apply when creating, publishing, and managing a Griit athlete profile.',
};

function FrenchTermsContent() {
  return (
    <>
      <h2>1. Acceptation</h2>
      <p>
        En créant un compte ou en utilisant Griit, vous acceptez les présentes
        Conditions d’utilisation et notre{' '}
        <Link href="/privacy">Politique de confidentialité</Link>. Si vous
        utilisez Griit pour un athlète, une équipe ou une organisation, vous
        confirmez être autorisé à accepter ces conditions en son nom.
      </p>

      <h2>2. Comptes et éligibilité</h2>
      <p>
        Vous devez fournir des informations exactes, protéger vos identifiants
        et nous signaler rapidement toute utilisation non autorisée. Vous êtes
        responsable de l’activité réalisée depuis votre compte. Si vous ne
        pouvez pas accepter légalement ces conditions, un parent, tuteur ou
        représentant autorisé doit le faire pour vous.
      </p>

      <h2>3. Profils publics</h2>
      <p>
        Griit vous permet de publier du contenu à une adresse publique. Vous
        contrôlez sa publication et son apparition dans l’annuaire des athlètes.
        Le contenu public peut être consulté, partagé, capturé ou indexé par des
        tiers. Ne publiez aucune information que vous souhaitez garder privée.
      </p>
      <p>
        Les noms d’utilisateur sont attribués selon leur disponibilité. Nous
        pouvons en récupérer ou modifier un s’il enfreint des droits, usurpe une
        identité ou crée un risque pour le service.
      </p>

      <h2>4. Votre contenu</h2>
      <p>
        Vous restez propriétaire de votre contenu. Vous accordez à Griit une
        licence non exclusive et mondiale pour l’héberger, le stocker, le
        reproduire, l’adapter et l’afficher uniquement afin d’exploiter et
        sécuriser les fonctionnalités utilisées. Elle prend fin à la
        suppression, sous réserve des sauvegardes temporaires et obligations
        légales.
      </p>
      <p>
        Vous garantissez disposer des droits nécessaires sur les images, logos,
        musiques, contenus de sponsors et liens. Vous êtes responsable des
        mentions requises pour les partenariats, affiliations et contenus
        sponsorisés.
      </p>

      <h2>5. Utilisation acceptable</h2>
      <p>Vous ne pouvez pas utiliser Griit pour :</p>
      <ul>
        <li>enfreindre la loi ou les droits d’une autre personne ;</li>
        <li>usurper une identité, harceler, menacer, exploiter ou tromper ;</li>
        <li>publier du contenu illégal, haineux, abusif ou dangereux ;</li>
        <li>envoyer un logiciel malveillant ou perturber le service ;</li>
        <li>
          extraire les données, contourner les accès ou limitations de plan ;
        </li>
        <li>
          générer artificiellement des statistiques ou manipuler l’engagement ;
        </li>
        <li>envoyer du spam ou faciliter une offre frauduleuse.</li>
      </ul>
      <p>
        Nous pouvons retirer du contenu ou limiter un compte lorsque cela est
        raisonnablement nécessaire pour appliquer ces règles, protéger les
        utilisateurs ou respecter la loi.
      </p>

      <h2>6. Services et liens tiers</h2>
      <p>
        Les profils peuvent contenir des liens ou services tiers que Griit ne
        contrôle pas. Nous ne sommes pas responsables de leur disponibilité,
        contenu, produits, transactions ou pratiques de confidentialité. Leur
        utilisation est régie par leurs propres conditions.
      </p>

      <h2>7. Plans Gratuit, Pro et fonctionnalités futures</h2>
      <p>
        Les fonctionnalités et limites sont décrites sur notre{' '}
        <Link href="/pricing">page Tarifs</Link>. Elles peuvent évoluer. Les
        fonctionnalités indiquées comme « bientôt disponibles », en aperçu, bêta
        ou en déploiement progressif ne sont pas garanties à une date précise.
      </p>

      <h2>8. Abonnements, facturation et résiliation</h2>
      <p>
        Les abonnements payants sont facturés à l’avance par Stripe, chaque mois
        ou chaque année selon votre choix. Sauf résiliation, ils sont renouvelés
        automatiquement. Les prix et taxes applicables sont affichés avant le
        paiement.
      </p>
      <p>
        Vous pouvez résilier depuis les options du compte ou en contactant le
        support. La résiliation prend effet à la fin de la période payée. Les
        paiements ne sont pas remboursables, sauf obligation légale ou offre
        expresse de Griit. En cas d’échec de paiement, les fonctions payantes
        peuvent être suspendues ou rétrogradées.
      </p>

      <h2>9. Suspension et fermeture</h2>
      <p>
        Vous pouvez cesser d’utiliser Griit et supprimer votre compte depuis les
        paramètres. Nous pouvons suspendre ou fermer un accès en cas de
        violation importante, de risque, de dommage, d’impayé ou d’obligation
        légale. Dans la mesure du raisonnable, nous vous informerons et vous
        laisserons la possibilité de corriger le problème.
      </p>

      <h2>10. Propriété intellectuelle de Griit</h2>
      <p>
        Le logiciel, les modèles, la marque, l’interface et les contenus
        originaux de Griit appartiennent à Griit ou à ses concédants. Ces
        conditions vous accordent uniquement un droit d’utilisation limité et
        révocable.
      </p>

      <h2>11. Disponibilité et garanties</h2>
      <p>
        Nous cherchons à rendre Griit fiable, mais le service est fourni selon
        sa disponibilité. Des changements ou interruptions peuvent survenir.
        Griit ne garantit aucun sponsoring, croissance d’audience, résultat
        sportif ou revenu. Le service ne constitue pas un conseil médical,
        juridique, financier ou d’entraînement professionnel.
      </p>

      <h2>12. Responsabilité</h2>
      <p>
        Dans les limites autorisées par la loi, Griit n’est pas responsable des
        dommages indirects, accessoires, spéciaux, consécutifs ou pertes de
        profits liés au service. La responsabilité totale de Griit ne dépassera
        pas le montant payé au cours des douze mois précédant l’événement, sauf
        lorsque la loi interdit cette limitation.
      </p>

      <h2>13. Modifications</h2>
      <p>
        Nous pouvons mettre à jour ces conditions avec le produit et les règles
        applicables. Nous publierons la nouvelle version et actualiserons la
        date. Si un changement important requiert un consentement
        supplémentaire, nous vous le demanderons.
      </p>

      <h2>14. Contact</h2>
      <p>
        Envoyez vos questions à{' '}
        <a href="mailto:support@griit.me">support@griit.me</a> ou utilisez notre{' '}
        <Link href="/support">page de support</Link>.
      </p>
    </>
  );
}

export default async function TermsPage() {
  const locale = await getRequestLocale();

  if (locale === 'fr') {
    return (
      <LegalDocument
        locale="fr"
        eyebrow="Informations légales"
        title="Des conditions claires pour raconter votre parcours."
        description="Ces conditions encadrent votre accès à Griit, notamment les profils publics, abonnements, statistiques et outils de contenu."
      >
        <FrenchTermsContent />
      </LegalDocument>
    );
  }

  return (
    <LegalDocument
      eyebrow="Legal"
      title="Clear terms for building your athlete story."
      description="These terms govern your access to Griit, including public profiles, subscriptions, analytics, and content tools."
    >
      <h2>1. Agreement</h2>
      <p>
        By creating an account or using Griit, you agree to these Terms of
        Service and our <Link href="/privacy">Privacy Policy</Link>. If you use
        Griit for an athlete, team, organization, or business, you confirm that
        you are authorized to accept these terms on their behalf.
      </p>

      <h2>2. Accounts and eligibility</h2>
      <p>
        You must provide accurate information, keep your login credentials
        secure, and promptly tell us about unauthorized account use. You are
        responsible for activity performed through your account. If you are not
        legally able to accept these terms, a parent, guardian, or authorized
        representative must do so for you.
      </p>

      <h2>3. Public profiles</h2>
      <p>
        Griit lets you publish profile content at a public address. You control
        whether a profile is published and whether it appears in Griit’s athlete
        directory. Public content can be viewed, shared, captured, or indexed by
        third parties. Do not publish information you are not comfortable making
        public.
      </p>
      <p>
        Usernames are provided on a first-available basis. We may reclaim or
        change a username that infringes rights, impersonates another person,
        creates security risk, or is needed to protect the service.
      </p>

      <h2>4. Your content</h2>
      <p>
        You retain ownership of content you submit. You grant Griit a
        non-exclusive, worldwide license to host, store, reproduce, adapt, and
        display that content only as needed to operate, secure, and promote the
        features you choose to use. This license ends when the content is
        deleted, except for temporary backups, legal requirements, and content
        already shared outside Griit.
      </p>
      <p>
        You confirm that you have the rights and permissions needed for your
        content, including athlete images, logos, music, sponsor material, and
        links. You are responsible for disclosures required for sponsorships,
        affiliate links, endorsements, and paid partnerships.
      </p>

      <h2>5. Acceptable use</h2>
      <p>You may not use Griit to:</p>
      <ul>
        <li>break the law or violate another person’s rights;</li>
        <li>impersonate, harass, threaten, exploit, or deceive anyone;</li>
        <li>
          publish illegal, hateful, sexually exploitative, or harmful content;
        </li>
        <li>
          upload malware or interfere with the service or another account;
        </li>
        <li>
          scrape, reverse engineer, or bypass access and plan restrictions;
        </li>
        <li>
          artificially generate analytics events or manipulate engagement; or
        </li>
        <li>use Griit to send spam or facilitate fraudulent offers.</li>
      </ul>
      <p>
        We may remove content or restrict an account when reasonably necessary
        to enforce these rules, protect users, or comply with law.
      </p>

      <h2>6. Third-party services and links</h2>
      <p>
        Profiles may link to or embed third-party services. Griit does not own
        or control those services and is not responsible for their availability,
        content, products, transactions, or privacy practices. Your use of them
        is governed by their terms.
      </p>

      <h2>7. Free, Pro, and future plans</h2>
      <p>
        The features and limits of each plan are described on our{' '}
        <Link href="/pricing">pricing page</Link>. We may improve or adjust
        features over time. Features labeled “coming soon”, preview, beta, or
        guided rollout are not guaranteed to be available by a particular date.
      </p>

      <h2>8. Subscriptions, billing, and cancellation</h2>
      <p>
        Paid subscriptions are billed in advance through Stripe on the monthly
        or annual interval you select. Unless canceled, a subscription renews
        automatically at the end of each billing period. Prices and applicable
        taxes are shown before checkout.
      </p>
      <p>
        You may cancel a subscription using the account options made available
        by Griit or by contacting support. Cancellation takes effect at the end
        of the paid period unless stated otherwise. Payments are non-refundable
        except where required by law or expressly offered by Griit. If payment
        fails, paid features may be suspended or downgraded.
      </p>

      <h2>9. Suspension and termination</h2>
      <p>
        You may stop using Griit at any time and can delete your account from
        dashboard settings. We may suspend or terminate access when you
        materially breach these terms, create risk or harm, fail to pay, or when
        required by law. Where reasonable, we will give notice and an
        opportunity to resolve the issue.
      </p>

      <h2>10. Griit intellectual property</h2>
      <p>
        Griit’s software, templates, branding, interface, and original materials
        are owned by Griit or its licensors. These terms give you a limited,
        revocable right to use the service; they do not transfer ownership of
        Griit intellectual property.
      </p>

      <h2>11. Service availability and disclaimers</h2>
      <p>
        We work to keep Griit reliable, but the service is provided on an “as
        available” basis. Features may change and interruptions can occur. Griit
        does not guarantee sponsorships, audience growth, athletic results,
        revenue, or the accuracy of third-party content. Nothing in Griit is
        medical, legal, financial, or professional training advice.
      </p>

      <h2>12. Liability</h2>
      <p>
        To the fullest extent permitted by law, Griit is not liable for
        indirect, incidental, special, consequential, or lost-profit damages
        arising from use of the service. Griit’s total liability for a claim
        will not exceed the amount you paid to Griit during the twelve months
        before the event giving rise to the claim. These limits do not apply
        where they are prohibited by law.
      </p>

      <h2>13. Changes</h2>
      <p>
        We may update these terms as the product and applicable rules evolve. We
        will publish the new version and update the date above. Continued use
        after an update takes effect means you accept the revised terms. If a
        material change requires additional consent, we will ask for it.
      </p>

      <h2>14. Contact</h2>
      <p>
        Questions about these terms can be sent to{' '}
        <a href="mailto:support@griit.me">support@griit.me</a> or through our{' '}
        <Link href="/support">support page</Link>.
      </p>
    </LegalDocument>
  );
}
