'use client';

import { useState } from 'react';
import {
  DesktopProfileFrame,
  MobileProfileFrame,
} from '@/components/dashboard/mobile-profile-frame';
import { Button } from '@/components/ui/button';
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

export function DesignPreview({ builder }: { builder: ProfileBuilderState }) {
  const [mode, setMode] = useState<'mobile' | 'desktop'>('mobile');
  const activeMobile = mode === 'mobile';
  const activeDesktop = mode === 'desktop';

  return (
    <div className="flex min-h-0 flex-col gap-4 xl:h-full">
      <div className="border-border bg-card flex shrink-0 flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold">Preview</p>
          <p className="text-muted-foreground text-sm">
            Toggle mobile or desktop to inspect your public page layout.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={activeMobile ? 'default' : 'outline'}
            onClick={() => setMode('mobile')}
          >
            Mobile
          </Button>
          <Button
            size="sm"
            variant={activeDesktop ? 'default' : 'outline'}
            onClick={() => setMode('desktop')}
          >
            Desktop
          </Button>
        </div>
      </div>

      <div className="max-w-full overflow-hidden p-2 sm:p-4 xl:flex xl:min-h-0 xl:flex-1 xl:items-center">
        {mode === 'mobile' ? (
          <MobileProfileFrame
            builder={builder}
            className="mx-auto sm:max-w-[360px] xl:h-full xl:max-h-full"
            fillHeight
            viewportClassName={previewStyles.mobile.frame}
          />
        ) : (
          <DesktopProfileFrame
            builder={builder}
            className="mx-auto xl:h-full"
            viewportClassName={previewStyles.desktop.frame}
          />
        )}
      </div>
    </div>
  );
}
