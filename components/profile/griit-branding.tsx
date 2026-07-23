import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

export function GriitBranding({ className }: { className?: string }) {
  return (
    <Link
      aria-label="Create your athlete profile with Griit"
      className={cn(
        'rounded-full border border-black/10 bg-white/90 px-3 py-1.5 text-[10px] font-medium whitespace-nowrap text-[#151515] shadow-lg backdrop-blur-sm transition-transform hover:-translate-y-0.5',
        className,
      )}
      href="/"
    >
      Made with <span className="font-black tracking-[-0.03em]">GRIIT.</span>
    </Link>
  );
}
