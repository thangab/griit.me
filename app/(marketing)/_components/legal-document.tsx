import Link from 'next/link';
import type { ReactNode } from 'react';

interface LegalDocumentProps {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}

export function LegalDocument({
  eyebrow,
  title,
  description,
  children,
}: LegalDocumentProps) {
  return (
    <main className="px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
      <div className="mx-auto max-w-4xl">
        <div className="border-b border-black/10 pb-10 sm:pb-14">
          <p className="text-xs font-black tracking-[0.2em] text-[#3157ff] uppercase">
            {eyebrow}
          </p>
          <h1 className="mt-4 max-w-3xl text-5xl leading-[0.95] font-black tracking-[-0.065em] sm:text-7xl">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-black/60 sm:text-lg">
            {description}
          </p>
          <p className="mt-5 text-xs font-semibold tracking-[0.08em] text-black/40 uppercase">
            Last updated July 24, 2026
          </p>
        </div>

        <article className="legal-document py-10 sm:py-14">{children}</article>

        <div className="flex flex-col gap-4 rounded-[2rem] bg-[#151515] p-7 text-white sm:flex-row sm:items-center sm:justify-between sm:p-9">
          <div>
            <p className="text-lg font-black tracking-[-0.03em]">
              Still have a question?
            </p>
            <p className="mt-1 text-sm leading-6 text-white/55">
              We are here to help with privacy, account, and product questions.
            </p>
          </div>
          <Link
            className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-white px-6 text-sm font-bold text-[#151515] transition-transform hover:-translate-y-0.5"
            href="/support"
          >
            Contact support
          </Link>
        </div>
      </div>
    </main>
  );
}
