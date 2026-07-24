import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalDocument } from '../_components/legal-document';

export const metadata: Metadata = {
  title: 'Terms of Service — Griit',
  description:
    'The terms that apply when creating, publishing, and managing a Griit athlete profile.',
};

export default function TermsPage() {
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
