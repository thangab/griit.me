import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalDocument } from '../_components/legal-document';
import { getRequestLocale } from '@/lib/i18n/server';
import { createMarketingMetadata } from '@/lib/seo/metadata';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const isFrench = locale === 'fr';

  return createMarketingMetadata({
    title: isFrench
      ? 'Politique de confidentialité — Griit'
      : 'Privacy Policy — Griit',
    description: isFrench
      ? 'Découvrez quelles informations Griit collecte, pourquoi elles sont utilisées et les choix dont vous disposez.'
      : 'Learn what information Griit collects, why we use it, and the choices available to you.',
    path: '/privacy',
    locale,
  });
}

function FrenchPrivacyContent() {
  return (
    <>
      <h2>1. Qui sommes-nous ?</h2>
      <p>
        Griit fournit des outils pour créer et gérer des profils publics
        d’athlètes. Dans cette politique, « Griit », « nous » et « notre »
        désignent le service Griit. Vous pouvez nous contacter à l’adresse{' '}
        <a href="mailto:support@griit.me">support@griit.me</a>.
      </p>

      <h2>2. Informations que vous nous transmettez</h2>
      <p>Nous traitons les informations que vous choisissez de fournir :</p>
      <ul>
        <li>
          adresse email, données d’authentification et paramètres du compte ;
        </li>
        <li>
          noms, identifiants, biographies, lieux, sports, objectifs, réussites,
          activités, liens et comptes sociaux ;
        </li>
        <li>
          images, vidéos, sponsors, partenariats et autres contenus importés ou
          liés à un profil ;
        </li>
        <li>messages et informations envoyés au support ;</li>
        <li>
          statut d’abonnement et références de facturation. Les coordonnées
          bancaires complètes sont traitées par Stripe et ne sont pas stockées
          par Griit.
        </li>
      </ul>

      <h2>3. Informations collectées automatiquement</h2>
      <p>
        Lorsqu’une personne consulte ou utilise un profil public, nous pouvons
        collecter les vues, clics sur les liens et blocs, horodatages, site
        référent, campagnes UTM, localisation approximative, navigateur, système
        d’exploitation et type d’appareil.
      </p>
      <p>
        Griit utilise un identifiant visiteur aléatoire conservé jusqu’à un an
        dans un cookie HTTP-only. Avant stockage, cet identifiant est transformé
        en empreinte irréversible. Il sert à compter les visiteurs uniques et
        limiter les doublons ; les propriétaires de profils n’ont accès ni à cet
        identifiant ni à l’identité directe du visiteur.
      </p>
      <p>
        Nous recevons aussi les informations techniques nécessaires à la
        sécurité et au fonctionnement du produit, comme les métadonnées de
        requêtes, événements de sécurité et journaux de diagnostic.
      </p>
      <p>
        Sur le site vitrine, Google Analytics ne collecte des données de
        navigation qu’après votre accord. Il n’est pas chargé si vous refusez.
      </p>

      <h2>4. Utilisation des informations</h2>
      <ul>
        <li>fournir, sécuriser et maintenir Griit ;</li>
        <li>authentifier les comptes et enregistrer les modifications ;</li>
        <li>publier les profils selon leurs paramètres de visibilité ;</li>
        <li>
          afficher des statistiques agrégées aux propriétaires de profils ;
        </li>
        <li>gérer les abonnements et fournir le support client ;</li>
        <li>détecter les abus, fraudes et problèmes techniques ;</li>
        <li>améliorer le produit et communiquer les changements importants.</li>
      </ul>

      <h2>5. Profils publics et annuaire</h2>
      <p>
        Un profil publié est public par nature. Son identifiant, son contenu,
        ses images, ses liens et ses objectifs peuvent être consultés, partagés
        ou indexés par des moteurs de recherche. Si l’annuaire est activé, le
        profil peut aussi apparaître dans l’annuaire des athlètes Griit. Vous
        pouvez modifier ces réglages depuis le tableau de bord.
      </p>

      <h2>6. Prestataires</h2>
      <p>
        Nous utilisons notamment Supabase pour l’authentification, la base de
        données et le stockage ; Stripe pour la facturation ; Google Analytics
        pour la mesure consentie du site vitrine ; ainsi que nos prestataires
        d’hébergement et de diffusion. Google traite également des informations
        si vous choisissez la connexion Google. Chaque prestataire applique ses
        propres engagements de confidentialité.
      </p>
      <p>
        Un profil peut contenir des liens ou intégrations YouTube, Vimeo,
        TikTok, Instagram ou Strava. Leur chargement peut permettre à ces
        services de collecter des informations selon leur propre politique.
      </p>

      <h2>7. Partage des informations</h2>
      <p>
        Nous ne vendons pas vos informations personnelles. Nous les partageons
        uniquement pour exploiter le service, traiter les paiements, suivre vos
        instructions, protéger Griit et ses utilisateurs ou respecter une
        obligation légale valable. Elles peuvent être transférées dans le cadre
        d’une fusion, acquisition, levée de fonds ou cession.
      </p>

      <h2>8. Conservation et suppression</h2>
      <p>
        Nous conservons les données du compte et des profils tant que le compte
        est actif, puis pendant la durée raisonnablement nécessaire au service,
        aux obligations légales, à la résolution des litiges et à la prévention
        des abus. Certaines informations peuvent subsister temporairement dans
        des sauvegardes chiffrées.
      </p>
      <p>
        Vous pouvez supprimer un profil ou votre compte complet depuis les
        paramètres. La suppression du compte retire les profils publics et lance
        la suppression des données et médias associés, sous réserve des durées
        de conservation légales et opérationnelles.
      </p>

      <h2>9. Vos choix et vos droits</h2>
      <p>
        Selon votre lieu de résidence, vous pouvez demander l’accès, la
        rectification, l’export, la limitation ou la suppression de vos données,
        ou vous opposer à certains traitements. Pour toute demande, écrivez à{' '}
        <a href="mailto:support@griit.me">support@griit.me</a>. Une vérification
        d’identité peut être nécessaire.
      </p>
      <p>
        Vous pouvez refuser la mesure d’audience du site vitrine. Ce choix est
        enregistré dans votre navigateur et peut être réinitialisé en effaçant
        les données du site Griit.
      </p>

      <h2>10. Mineurs</h2>
      <p>
        Si vous n’avez pas l’âge requis pour consentir seul à un service en
        ligne, un parent ou représentant légal doit autoriser votre utilisation
        de Griit. Il peut nous contacter pour consulter ou supprimer les
        informations d’un jeune athlète.
      </p>

      <h2>11. Sécurité et transferts internationaux</h2>
      <p>
        Nous appliquons des mesures techniques et organisationnelles
        raisonnables, sans qu’aucun service en ligne puisse garantir une
        sécurité absolue. Griit et ses prestataires peuvent traiter des données
        dans d’autres pays, avec les garanties prévues par la loi applicable.
      </p>

      <h2>12. Modifications de cette politique</h2>
      <p>
        Cette politique peut évoluer avec Griit. Nous publierons la nouvelle
        version ici et modifierons la date ci-dessus. Une information
        supplémentaire sera fournie si un changement affecte sensiblement vos
        droits.
      </p>

      <h2>13. Contact</h2>
      <p>
        Envoyez vos questions ou demandes à{' '}
        <a href="mailto:support@griit.me">support@griit.me</a>, ou utilisez
        notre <Link href="/support">page de support</Link>.
      </p>
    </>
  );
}

export default async function PrivacyPage() {
  const locale = await getRequestLocale();

  if (locale === 'fr') {
    return (
      <LegalDocument
        locale="fr"
        eyebrow="Informations légales"
        title="La confidentialité, en toute clarté."
        description="Cette politique explique les informations traitées par Griit lorsque vous créez, publiez ou consultez un profil d’athlète, ainsi que leur utilisation."
      >
        <FrenchPrivacyContent />
      </LegalDocument>
    );
  }

  return (
    <LegalDocument
      eyebrow="Legal"
      title="Privacy, without the fine-print maze."
      description="This policy explains what Griit collects when you create, publish, and visit athlete profiles, and how that information is used."
    >
      <h2>1. Who we are</h2>
      <p>
        Griit provides tools for creating and managing public athlete profiles.
        In this policy, “Griit”, “we”, “us”, and “our” refer to the Griit
        service. You can contact us at{' '}
        <a href="mailto:support@griit.me">support@griit.me</a>.
      </p>

      <h2>2. Information you give us</h2>
      <p>We process information you choose to provide, including:</p>
      <ul>
        <li>
          your email address, authentication details, and account settings;
        </li>
        <li>
          profile names, usernames, biographies, locations, sports, goals,
          achievements, activities, links, and social accounts;
        </li>
        <li>
          images, videos, sponsor details, partnership information, and other
          content uploaded or linked from a profile;
        </li>
        <li>messages and information you send to support; and</li>
        <li>
          subscription status and billing references. Complete payment card
          details are handled by Stripe and are not stored by Griit.
        </li>
      </ul>

      <h2>3. Information collected automatically</h2>
      <p>
        When someone visits or interacts with a public profile, we may collect
        profile views, link and block clicks, timestamps, referring website, UTM
        campaign information, approximate country, region and city, browser,
        operating system, and device type.
      </p>
      <p>
        Griit uses a random visitor identifier stored in an HTTP-only cookie for
        up to one year. Before analytics are stored, that identifier is
        transformed into a one-way hash. We use it to count unique visitors and
        reduce duplicate events; profile owners do not receive the identifier
        itself or a visitor’s direct identity.
      </p>
      <p>
        We also receive standard technical information needed to serve and
        protect the product, such as request metadata, security events, and
        diagnostic logs.
      </p>
      <p>
        On Griit&apos;s marketing pages, and only after you accept analytics
        cookies, Google Analytics may collect page views, referral information,
        approximate location, and browser or device information. We use this to
        understand how the website is used and improve it. Google Analytics is
        not loaded when you decline.
      </p>

      <h2>4. How we use information</h2>
      <ul>
        <li>provide, secure, and maintain Griit;</li>
        <li>authenticate accounts and save profile changes;</li>
        <li>publish profiles according to their visibility settings;</li>
        <li>
          show profile owners aggregated audience and interaction analytics;
        </li>
        <li>process subscriptions and provide customer support;</li>
        <li>detect abuse, fraud, and technical problems; and</li>
        <li>improve the product and communicate important service changes.</li>
      </ul>

      <h2>5. Public profiles and discovery</h2>
      <p>
        A published profile is public by design. Its username, content, images,
        links, goals, and selected information may be visible to anyone and may
        be shared or indexed by search engines. If profile discovery is enabled,
        the profile may also appear in Griit’s athlete directory. You can change
        publication and discovery settings from your dashboard.
      </p>

      <h2>6. Service providers</h2>
      <p>
        We use specialist providers to operate Griit. These currently include
        Supabase for authentication, database, and storage; Stripe for billing;
        Google Analytics for consented marketing-site measurement; and our
        hosting and delivery providers for serving the application and deriving
        approximate request location. Google also processes information if you
        choose Google sign-in. Those providers process information under their
        own terms and privacy commitments.
      </p>
      <p>
        A profile can contain links or embeds from services such as YouTube,
        Vimeo, TikTok, Instagram, or Strava. Opening or loading a third-party
        service may allow that service to collect information under its own
        privacy policy.
      </p>

      <h2>7. When information is shared</h2>
      <p>
        We do not sell personal information. We share information only when
        necessary to operate the service, process payments, follow your
        instructions, protect Griit and its users, or comply with a valid legal
        obligation. If Griit is involved in a merger, acquisition, financing, or
        sale, information may be transferred as part of that transaction.
      </p>

      <h2>8. Retention and deletion</h2>
      <p>
        We keep account and profile information while your account is active and
        for as long as reasonably necessary to provide the service, meet legal
        obligations, resolve disputes, and prevent abuse. Analytics are retained
        to provide historical reporting. Some limited information may remain
        temporarily in encrypted backups after deletion.
      </p>
      <p>
        You can delete an individual profile or your complete account from the
        dashboard settings. Account deletion removes public profiles and starts
        deletion of associated account data and uploaded media, subject to
        required legal and operational retention.
      </p>

      <h2>9. Your choices and rights</h2>
      <p>
        Depending on where you live, you may have rights to access, correct,
        export, restrict, object to, or delete personal information. You can
        update most profile information directly in Griit. For any other
        request, email <a href="mailto:support@griit.me">support@griit.me</a>.
        We may need to verify your identity before completing a request.
      </p>
      <p>
        You can decline marketing analytics when prompted. Your choice is saved
        in your browser and can be reset by clearing Griit&apos;s site data.
      </p>

      <h2>10. Children</h2>
      <p>
        If you are not old enough to consent to online services where you live,
        a parent or legal guardian must authorize your use of Griit. Guardians
        can contact us to review or remove a young athlete’s information. Griit
        is not intended to collect personal information from children without
        the authorization required by applicable law.
      </p>

      <h2>11. Security and international processing</h2>
      <p>
        We use reasonable technical and organizational safeguards, but no online
        service can guarantee absolute security. Griit and its providers may
        process information in countries other than your own, with safeguards
        required by applicable law.
      </p>

      <h2>12. Changes to this policy</h2>
      <p>
        We may update this policy as Griit evolves. We will publish the revised
        version here and change the date above. If a change materially affects
        your rights, we will provide an additional notice where appropriate.
      </p>

      <h2>13. Contact</h2>
      <p>
        Questions or privacy requests can be sent to{' '}
        <a href="mailto:support@griit.me">support@griit.me</a>. You can also use
        our <Link href="/support">support page</Link>.
      </p>
    </LegalDocument>
  );
}
