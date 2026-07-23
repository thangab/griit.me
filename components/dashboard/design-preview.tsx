'use client';

import { useState } from 'react';
import {
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
import type { ProfileBuilderState } from '@/lib/types/profile-builder';

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
  onPublishChange,
  publishMessage,
  publishPending,
}: {
  builder: ProfileBuilderState;
  showBranding: boolean;
  onPublishChange: (isPublished: boolean) => void;
  publishMessage: string;
  publishPending: boolean;
}) {
  const [mode, setMode] = useState<'mobile' | 'desktop'>('mobile');
  const activeMobile = mode === 'mobile';
  const activeDesktop = mode === 'desktop';

  return (
    <div className="flex min-h-0 flex-col gap-4 xl:h-full">
      <div className="border-border bg-card flex shrink-0 flex-wrap items-center justify-between gap-3 rounded-xl border p-3">
        <div
          className="bg-muted flex rounded-lg p-1"
          aria-label="Preview device"
        >
          <button
            className={`flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium transition ${
              activeMobile
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            type="button"
            onClick={() => setMode('mobile')}
          >
            <Smartphone className="h-4 w-4" />
            Mobile
          </button>
          <button
            className={`flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium transition ${
              activeDesktop
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            type="button"
            onClick={() => setMode('desktop')}
          >
            <Monitor className="h-4 w-4" />
            Desktop
          </button>
        </div>

        <div className="flex items-center gap-3">
          <Globe2 className="text-muted-foreground hidden h-4 w-4 shrink-0 sm:block" />
          <span className="hidden min-w-0 sm:block">
            <span className="block text-sm font-medium">
              Profile visibility
            </span>
            <span
              className="text-muted-foreground block text-xs"
              title={publishMessage || undefined}
            >
              {publishPending
                ? 'Updating visibility…'
                : builder.profile.isPublished
                  ? 'Your page is visible to everyone.'
                  : 'Make your page visible to everyone.'}
            </span>
          </span>
          <div
            className={`bg-muted flex rounded-lg p-1 ${publishPending ? 'opacity-60' : ''}`}
            aria-label="Profile visibility"
          >
            <button
              className={`flex h-9 items-center gap-1.5 rounded-md px-3 text-sm font-medium transition ${
                !builder.profile.isPublished
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              type="button"
              disabled={publishPending || !builder.profile.isPublished}
              onClick={() => {
                if (
                  !window.confirm(
                    'Move your profile back to draft? It will no longer be publicly accessible.',
                  )
                ) {
                  return;
                }

                onPublishChange(false);
              }}
            >
              <EyeOff className="h-3.5 w-3.5" />
              Draft
            </button>
            <button
              className={`flex h-9 items-center gap-1.5 rounded-md px-3 text-sm font-medium transition ${
                builder.profile.isPublished
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              type="button"
              disabled={publishPending || builder.profile.isPublished}
              onClick={() => onPublishChange(true)}
            >
              <Eye className="h-3.5 w-3.5" />
              {publishPending && !builder.profile.isPublished
                ? 'Publishing…'
                : 'Live'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-full overflow-hidden p-2 sm:p-4 xl:flex xl:min-h-0 xl:flex-1 xl:items-center">
        {mode === 'mobile' ? (
          <MobileProfileFrame
            builder={builder}
            className="mx-auto sm:max-w-[360px] xl:h-full xl:max-h-full"
            fillHeight
            showBranding={showBranding}
            viewportClassName={previewStyles.mobile.frame}
          />
        ) : (
          <DesktopProfileFrame
            builder={builder}
            className="mx-auto xl:h-full"
            showBranding={showBranding}
            viewportClassName={previewStyles.desktop.frame}
          />
        )}
      </div>
    </div>
  );
}
