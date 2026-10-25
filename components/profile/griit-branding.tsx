import Link from 'next/link';
import type { Route } from 'next';
import { ArrowUpRightIcon } from '@phosphor-icons/react/ssr';
import type { Locale } from '@/lib/i18n/config';
import { cn } from '@/lib/utils/cn';

export type GriitBrandingVariant = 'made-with' | 'partner';

export function GriitBranding({
  className,
  variant = 'made-with',
  locale = 'en',
  username,
}: {
  className?: string;
  variant?: GriitBrandingVariant;
  locale?: Locale;
  username?: string;
}) {
  const isPartner = variant === 'partner';
  const isFrench = locale === 'fr';
  const source = isPartner ? 'partner_profile' : 'public_profile';
  const context = new URLSearchParams({ source });
  if (username) context.set('profile', username);

  return (
    <Link
      className={cn(
        'flex w-max max-w-[calc(100%-1.5rem)] items-center gap-2 rounded-full border px-4 py-2.5 text-xs font-bold whitespace-nowrap shadow-md transition hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#3157ff]',
        isPartner
          ? 'border-white/15 bg-[#3157ff] text-white shadow-[#3157ff]/25 hover:bg-[#2445db]'
          : 'border-black/10 bg-[#a9ed35] text-[#151515] shadow-black/15 hover:bg-[#b7f34f]',
        className,
      )}
      href={`/sign-up?${context}` as Route}
      data-marketing-cta="create_free_profile"
      data-marketing-source={source}
      data-marketing-profile={username}
    >
      <span>
        {isFrench ? 'Créer mon profil gratuit' : 'Create my free profile'}
      </span>
      <ArrowUpRightIcon
        aria-hidden="true"
        className="h-3.5 w-3.5 shrink-0"
        weight="bold"
      />
    </Link>
  );
}
