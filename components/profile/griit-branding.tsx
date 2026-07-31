import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

export type GriitBrandingVariant = 'made-with' | 'partner';

export function GriitBranding({
  className,
  variant = 'made-with',
}: {
  className?: string;
  variant?: GriitBrandingVariant;
}) {
  const isPartner = variant === 'partner';

  return (
    <Link
      aria-label={
        isPartner
          ? 'Griit partner profile'
          : 'Create your athlete profile with Griit'
      }
      className={cn(
        'rounded-full border px-3 py-1.5 text-[10px] font-medium whitespace-nowrap text-[#151515] shadow-lg backdrop-blur-sm transition-transform hover:-translate-y-0.5',
        isPartner
          ? 'border-[#151515]/20 bg-[#A9ED35] shadow-[#A9ED35]/25'
          : 'border-black/10 bg-white/90',
        className,
      )}
      href="/"
    >
      {isPartner ? (
        <>
          <span className="font-black tracking-[-0.03em]">GRIIT.</span> Partner
        </>
      ) : (
        <>
          Made with{' '}
          <span className="font-black tracking-[-0.03em]">GRIIT.</span>
        </>
      )}
    </Link>
  );
}
