'use client';

import { useState } from 'react';
import {
  ArrowSquareOutIcon as ExternalLink,
  DeviceMobileIcon as Smartphone,
  EyeIcon as Eye,
  EyeSlashIcon as EyeOff,
  GlobeIcon as Globe2,
  MonitorIcon as Monitor,
} from '@phosphor-icons/react/ssr';
import {
  DesktopProfileFrame,
  MobileProfileFrame,
} from '@/components/dashboard/mobile-profile-frame';
import type { GriitBrandingVariant } from '@/components/profile/griit-branding';
import { useUiCopy } from '@/components/i18n/use-ui-copy';
import type { ProfileBuilderState } from '@/lib/types/profile-builder';
import { cn } from '@/lib/utils/cn';

const previewStyles = {
  mobile: {
    frame:
      'h-[clamp(320px,calc(100dvh-250px),560px)] sm:h-[clamp(360px,calc(100dvh-270px),640px)] xl:h-auto',
  },
  desktop: {
    frame:
      'h-[clamp(300px,calc(100dvh-250px),420px)] sm:h-[clamp(320px,calc(100dvh-270px),520px)] xl:h-auto',
  },
};

export function DesignPreview({
  builder,
  showBranding,
  brandingVariant,
  onPublishChange,
  publishMessage,
  publishPending,
}: {
  builder: ProfileBuilderState;
  showBranding: boolean;
  brandingVariant?: GriitBrandingVariant;
  onPublishChange: (isPublished: boolean) => void;
  publishMessage: string;
  publishPending: boolean;
}) {
  const ui = useUiCopy();
  const [mode, setMode] = useState<'mobile' | 'desktop'>('mobile');
  const activeMobile = mode === 'mobile';
  const activeDesktop = mode === 'desktop';

  return (
    <div className="flex min-h-0 flex-col gap-4 xl:h-full">
      <div className="border-border bg-card flex shrink-0 flex-wrap items-center justify-between gap-3 rounded-xl border p-3">
        <div
          aria-label="Preview device"
          className="border-border bg-muted/60 relative hidden h-11 w-[216px] grid-cols-2 rounded-full border p-1 sm:grid"
          role="group"
        >
          <span
            aria-hidden="true"
            className={cn(
              'bg-foreground pointer-events-none absolute top-1 bottom-1 left-1 w-[calc(50%-0.25rem)] rounded-full shadow-sm transition-transform duration-300 ease-out',
              activeDesktop && 'translate-x-full',
            )}
          />
          <button
            aria-pressed={activeMobile}
            className={cn(
              'relative z-10 flex min-w-0 items-center justify-center gap-2 rounded-full px-3 text-sm font-semibold transition-colors duration-300',
              activeMobile
                ? 'text-background'
                : 'text-muted-foreground hover:text-foreground',
            )}
            type="button"
            onClick={() => setMode('mobile')}
          >
            <Smartphone
              className="h-4 w-4"
              weight={activeMobile ? 'fill' : 'regular'}
            />
            {ui('Mobile')}
          </button>
          <button
            aria-pressed={activeDesktop}
            className={cn(
              'relative z-10 flex min-w-0 items-center justify-center gap-2 rounded-full px-3 text-sm font-semibold transition-colors duration-300',
              activeDesktop
                ? 'text-background'
                : 'text-muted-foreground hover:text-foreground',
            )}
            type="button"
            onClick={() => setMode('desktop')}
          >
            <Monitor
              className="h-4 w-4"
              weight={activeDesktop ? 'fill' : 'regular'}
            />
            {ui('Desktop')}
          </button>
        </div>

        <div className="flex min-w-0 flex-1 items-center justify-between gap-3 sm:flex-initial sm:justify-end">
          <div className="flex min-w-0 items-center gap-2.5">
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                builder.profile.isPublished
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-amber-100 text-amber-700'
              }`}
            >
              {builder.profile.isPublished ? (
                <Globe2 className="h-4 w-4" weight="bold" />
              ) : (
                <EyeOff className="h-4 w-4" weight="bold" />
              )}
            </span>
            <span className="min-w-0">
              <span className="flex items-center gap-1.5 text-sm font-semibold">
                {builder.profile.isPublished ? ui('Profile live') : ui('Draft')}
                {builder.profile.isPublished ? (
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                ) : null}
              </span>
              <span
                className="text-muted-foreground hidden max-w-52 truncate text-xs lg:block"
                title={publishMessage || undefined}
              >
                {publishPending
                  ? ui('Updating visibility…')
                  : builder.profile.isPublished
                    ? ui('Visible to everyone.')
                    : ui('Only you can see this version.')}
              </span>
            </span>
          </div>

          {builder.profile.isPublished ? (
            <div className="flex shrink-0 items-center gap-2">
              <a
                className="bg-foreground text-background hover:bg-foreground/90 flex h-9 items-center gap-1.5 rounded-full px-3 text-xs font-semibold transition-colors sm:text-sm"
                href={`/${builder.profile.username}`}
                rel="noreferrer"
                target="_blank"
              >
                {ui('View profile')}
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
              <button
                aria-label="Move profile back to draft"
                className="border-border text-muted-foreground hover:bg-muted hover:text-foreground flex h-9 items-center gap-1.5 rounded-full border px-2.5 text-xs font-semibold transition-colors sm:px-3"
                type="button"
                disabled={publishPending}
                onClick={() => {
                  if (
                    !window.confirm(
                      ui(
                        'Move your profile back to draft? It will no longer be publicly accessible.',
                      ),
                    )
                  ) {
                    return;
                  }

                  onPublishChange(false);
                }}
              >
                <EyeOff className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{ui('Unpublish')}</span>
              </button>
            </div>
          ) : (
            <button
              className="flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:cursor-wait disabled:opacity-60"
              type="button"
              disabled={publishPending}
              onClick={() => onPublishChange(true)}
            >
              <Eye className="h-3.5 w-3.5" weight="bold" />
              {publishPending ? ui('Publishing…') : ui('Publish profile')}
            </button>
          )}
        </div>
      </div>

      <div className="max-w-full overflow-hidden p-2 sm:p-4 xl:flex xl:min-h-0 xl:flex-1 xl:items-center">
        {mode === 'mobile' ? (
          <MobileProfileFrame
            builder={builder}
            className="mx-auto sm:max-w-[360px] xl:h-full xl:max-h-full"
            fillHeight
            showBranding={showBranding}
            brandingVariant={brandingVariant}
            viewportClassName={previewStyles.mobile.frame}
          />
        ) : (
          <DesktopProfileFrame
            builder={builder}
            className="mx-auto xl:h-full"
            showBranding={showBranding}
            brandingVariant={brandingVariant}
            viewportClassName={previewStyles.desktop.frame}
          />
        )}
      </div>
    </div>
  );
}
