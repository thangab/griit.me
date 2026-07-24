import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRightIcon,
  CreditCardIcon,
  EnvelopeSimpleIcon,
  LockKeyIcon,
  PaintBrushIcon,
  QuestionIcon,
} from '@phosphor-icons/react/ssr';

export const metadata: Metadata = {
  title: 'Support — Griit',
  description:
    'Get help with your Griit account, athlete profile, subscription, privacy, or public page.',
};

const helpTopics = [
  {
    icon: PaintBrushIcon,
    title: 'Profile and editor',
    description:
      'Publishing, profile content, images, templates, blocks, and public URLs.',
  },
  {
    icon: CreditCardIcon,
    title: 'Plans and billing',
    description:
      'Free and Pro features, invoices, subscriptions, upgrades, and cancellations.',
  },
  {
    icon: LockKeyIcon,
    title: 'Privacy and safety',
    description:
      'Account deletion, personal data requests, profile visibility, and reporting concerns.',
  },
] as const;

export default function SupportPage() {
  return (
    <main>
      <section className="px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#dff5b4]">
            <QuestionIcon className="h-7 w-7" weight="bold" />
          </div>
          <p className="mt-7 text-xs font-black tracking-[0.2em] text-[#3157ff] uppercase">
            Griit support
          </p>
          <h1 className="mx-auto mt-4 max-w-4xl text-5xl leading-[0.94] font-black tracking-[-0.065em] sm:text-7xl lg:text-8xl">
            Tell us where you are stuck.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-black/60 sm:text-lg">
            Include your account email, public username, and a screenshot when
            possible. Please never send a password or complete card number.
          </p>
          <a
            className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-[#151515] px-7 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
            href="mailto:support@griit.me?subject=Griit%20support%20request"
          >
            <EnvelopeSimpleIcon className="h-5 w-5" weight="bold" />
            Email support
          </a>
          <p className="mt-3 text-sm text-black/45">support@griit.me</p>
        </div>
      </section>

      <section className="px-5 pb-20 sm:px-8 sm:pb-28 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-4 md:grid-cols-3">
            {helpTopics.map(({ icon: Icon, title, description }) => (
              <article
                className="rounded-[1.75rem] border border-black/10 bg-white p-6"
                key={title}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eef2f7]">
                  <Icon className="h-5 w-5" weight="bold" />
                </div>
                <h2 className="mt-5 text-lg font-black tracking-[-0.03em]">
                  {title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-black/55">
                  {description}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-8 grid overflow-hidden rounded-[2rem] border border-black/10 bg-white lg:grid-cols-[1.15fr_0.85fr]">
            <div className="p-7 sm:p-10">
              <p className="text-xs font-black tracking-[0.18em] text-[#3157ff] uppercase">
                Before emailing
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-[-0.05em]">
                A few quick routes.
              </h2>
              <div className="mt-7 divide-y divide-black/10 border-y border-black/10">
                <Link
                  className="flex items-center justify-between gap-4 py-4 text-sm font-bold hover:text-[#3157ff]"
                  href="/forgot-password"
                >
                  Reset a forgotten password
                  <ArrowRightIcon className="h-4 w-4" weight="bold" />
                </Link>
                <Link
                  className="flex items-center justify-between gap-4 py-4 text-sm font-bold hover:text-[#3157ff]"
                  href="/dashboard"
                >
                  Open your dashboard
                  <ArrowRightIcon className="h-4 w-4" weight="bold" />
                </Link>
                <Link
                  className="flex items-center justify-between gap-4 py-4 text-sm font-bold hover:text-[#3157ff]"
                  href="/pricing"
                >
                  Compare plans and limits
                  <ArrowRightIcon className="h-4 w-4" weight="bold" />
                </Link>
              </div>
            </div>
            <aside className="bg-[#151515] p-7 text-white sm:p-10">
              <p className="text-xs font-black tracking-[0.18em] text-[#a9ed35] uppercase">
                Response times
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-[-0.05em]">
                Human support, not a maze.
              </h2>
              <p className="mt-5 text-sm leading-6 text-white/60">
                We aim to answer standard requests within two business days. Pro
                members receive priority support and should include “Pro” in the
                subject line.
              </p>
              <p className="mt-5 text-sm leading-6 text-white/60">
                Urgent safety, impersonation, or account-access concerns are
                reviewed as quickly as possible.
              </p>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
