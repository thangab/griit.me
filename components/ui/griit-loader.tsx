import { cn } from '@/lib/utils/cn';

export function GriitLoader({
  label,
  compact = false,
}: {
  label: string;
  compact?: boolean;
}) {
  return (
    <div
      aria-live="polite"
      className={cn(
        'bg-background flex w-full items-center justify-center overflow-hidden',
        compact ? 'min-h-[60dvh]' : 'min-h-dvh',
      )}
      role="status"
    >
      <div>
        <div className="relative h-9 w-9">
          <span className="border-border absolute inset-0 rounded-full border" />
          <span className="border-foreground absolute inset-0 animate-spin rounded-full border border-r-transparent border-b-transparent motion-reduce:animate-none" />
        </div>
        <span className="sr-only">{label}</span>
      </div>
    </div>
  );
}
