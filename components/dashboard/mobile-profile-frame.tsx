import { PublicProfileView } from '@/components/profile/public-profile-view';
import { GriitBranding } from '@/components/profile/griit-branding';
import { cn } from '@/lib/utils/cn';
import type { ProfileBuilderState } from '@/lib/types/profile-builder';

type MobileProfileFrameProps = {
  builder: ProfileBuilderState;
  className?: string;
  fillHeight?: boolean;
  showBranding?: boolean;
  viewportClassName?: string;
};

export function MobileProfileFrame({
  builder,
  className,
  fillHeight = false,
  showBranding = false,
  viewportClassName,
}: MobileProfileFrameProps) {
  return (
    <div
      className={cn(
        'flex w-full max-w-[360px] flex-col overflow-hidden rounded-xl bg-slate-950 p-2 shadow-2xl',
        fillHeight && 'min-h-0',
        className,
      )}
    >
      <div className="mb-2 flex h-8 shrink-0 items-center gap-2 rounded-full bg-white/15 px-3 text-[11px] text-white/70">
        <span className="h-2 w-2 rounded-full bg-white/45" />
        <span className="min-w-0 flex-1 truncate">
          griit.me/{builder.profile.username}
        </span>
      </div>
      <div
        className={cn(
          'relative overflow-hidden rounded-xl bg-slate-50',
          fillHeight ? 'min-h-0 flex-1' : 'h-[560px]',
          viewportClassName,
        )}
      >
        <PublicProfileView builder={builder} variant="mobile-preview" />
        {showBranding ? (
          <GriitBranding className="pointer-events-none absolute bottom-3 left-1/2 z-30 -translate-x-1/2" />
        ) : null}
      </div>
    </div>
  );
}

type DesktopProfileFrameProps = {
  builder: ProfileBuilderState;
  className?: string;
  showBranding?: boolean;
  viewportClassName?: string;
};

export function DesktopProfileFrame({
  builder,
  className,
  showBranding = false,
  viewportClassName,
}: DesktopProfileFrameProps) {
  return (
    <div
      className={cn(
        'border-border flex w-full max-w-[900px] flex-col overflow-hidden rounded-xl border bg-white shadow-xl',
        className,
      )}
    >
      <div className="border-border flex h-11 shrink-0 items-center gap-3 border-b bg-slate-100 px-4">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        </div>
        <div className="min-w-0 flex-1 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-center text-xs font-medium text-slate-500">
          griit.me/{builder.profile.username}
        </div>
        <div className="h-5 w-12 shrink-0" />
      </div>

      <div
        className={cn(
          'relative min-h-0 flex-1 overflow-hidden bg-slate-50',
          viewportClassName,
        )}
      >
        <PublicProfileView builder={builder} variant="desktop-preview" />
        {showBranding ? (
          <GriitBranding className="pointer-events-none absolute bottom-3 left-1/2 z-30 -translate-x-1/2" />
        ) : null}
      </div>
    </div>
  );
}
