'use client';

import { useState } from 'react';
import { PublicProfileView } from '@/components/profile/public-profile-view';
import { Button } from '@/components/ui/button';
import type { ProfileBuilderState } from '@/lib/types/profile-builder';

const previewStyles = {
  mobile: {
    wrapper: 'mx-auto w-full max-w-[320px] sm:max-w-[360px] xl:h-full',
    frame:
      'h-[clamp(320px,calc(100dvh-250px),560px)] sm:h-[clamp(360px,calc(100dvh-270px),640px)] xl:h-full',
  },
  desktop: {
    wrapper: 'mx-auto w-full max-w-[900px] xl:h-full',
    frame:
      'h-[clamp(300px,calc(100dvh-250px),420px)] sm:h-[clamp(320px,calc(100dvh-270px),520px)] xl:h-full',
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
        <div
          className={`relative overflow-hidden rounded-xl bg-white shadow-xl ${previewStyles[mode].wrapper}`}
        >
          {mode === 'desktop' ? (
            <div className="absolute top-0 left-0 z-10 h-12 w-full bg-slate-950/90" />
          ) : null}
          <div
            className={`relative overflow-hidden rounded-xl border border-white/10 bg-slate-50 ${previewStyles[mode].frame}`}
          >
            {mode === 'desktop' ? (
              <div className="flex h-full flex-col">
                <div className="shrink-0 border-b border-slate-200 bg-white px-5 py-4 text-sm font-medium text-slate-800">
                  griit.me/{builder.profile.username}
                </div>
                <div className="min-h-0 flex-1">
                  <PublicProfileView
                    builder={builder}
                    variant="desktop-preview"
                  />
                </div>
              </div>
            ) : (
              <PublicProfileView builder={builder} variant="mobile-preview" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
