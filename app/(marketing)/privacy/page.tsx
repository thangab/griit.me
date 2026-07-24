import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalDocument } from '../_components/legal-document';

export const metadata: Metadata = {
  title: 'Privacy Policy — Griit',
  description:
    'Learn what information Griit collects, why we use it, and the choices available to you.',
};

export default function PrivacyPage() {
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
        and our hosting and delivery providers for serving the application and
        deriving approximate request location. Google processes information if
        you choose Google sign-in. Those providers process information under
        their own terms and privacy commitments.
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
