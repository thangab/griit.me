'use client';

import { useState } from 'react';
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

const mobileScrollTestBlocks = [
  {
    title: 'Latest training',
    text: 'Morning intervals, strength work, and recovery notes for the week.',
  },
  {
    title: 'Race goals',
    text: 'Sub-90 half marathon build with steady long runs and tempo blocks.',
  },
  {
    title: 'Featured link',
    text: 'Coaching plan, event calendar, and current gear rotation.',
  },
  {
    title: 'Timeline',
    text: 'Upcoming races, recent results, and milestones from the season.',
  },
];

export function DesignPreview({ builder }: { builder: ProfileBuilderState }) {
  const [mode, setMode] = useState<'mobile' | 'desktop'>('mobile');
  const activeMobile = mode === 'mobile';
  const activeDesktop = mode === 'desktop';
  const { profile } = builder;
  const galleryItems = builder.galleryItems.length
    ? builder.galleryItems
    : [
        {
          imageUrl: profile.coverUrl,
          altText: '',
          caption: '',
          id: null,
          sortOrder: 0,
          isEnabled: true,
        },
      ];
  const socialLinks = builder.socialLinks.filter((link) => link.isEnabled);
  const profileLines = [profile.bio, profile.location, profile.sport].filter(
    Boolean,
  );

  return (
    <div className="flex min-h-0 flex-col gap-4 xl:h-full">
      <div className="border-border bg-card flex shrink-0 flex-col gap-3 rounded-3xl border p-4 sm:flex-row sm:items-center sm:justify-between">
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

      <div className="border-border max-w-full overflow-hidden rounded-2xl border bg-slate-950 p-2 shadow-xl sm:rounded-4xl sm:p-4 xl:flex xl:min-h-0 xl:flex-1 xl:items-center">
        <div
          className={`relative overflow-hidden rounded-2xl bg-white shadow-xl sm:rounded-4xl ${previewStyles[mode].wrapper}`}
        >
          {mode === 'desktop' && (
            <div className="absolute top-0 left-0 h-12 w-full bg-slate-950/90" />
          )}
          <div
            className={`relative overflow-hidden rounded-2xl border border-white/10 bg-slate-50 sm:rounded-4xl ${previewStyles[mode].frame}`}
          >
            {mode === 'desktop' ? (
              <div className="flex h-full flex-col">
                <div className="shrink-0 border-b border-slate-200 bg-white px-5 py-4 text-sm font-medium text-slate-800">
                  griit.me/{profile.username}
                </div>
                <div className="flex min-h-0 flex-1 flex-col items-center justify-start gap-4 overflow-y-auto overscroll-contain p-4 sm:p-6">
                  <div
                    className="h-32 w-32 shrink-0 overflow-hidden rounded-full border-4 border-white bg-slate-200 bg-cover bg-center"
                    style={{
                      backgroundImage: `url('${profile.avatarUrl}')`,
                    }}
                  />
                  <div className="max-w-xl shrink-0 text-center">
                    <p className="text-2xl font-semibold text-slate-900">
                      {profile.displayName}
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      {profileLines.map((line) => (
                        <span key={line}>
                          {line}
                          <br />
                        </span>
                      ))}
                      @{profile.username}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center justify-center gap-3 text-slate-800">
                    {socialLinks.slice(0, 3).map((link) => (
                      <div
                        key={`${link.platform}-${link.url}`}
                        className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-xs font-semibold shadow-sm"
                      >
                        {link.platform.slice(0, 1).toUpperCase()}
                      </div>
                    ))}
                  </div>
                  <div className="grid w-full shrink-0 grid-cols-3 gap-2 px-2 sm:gap-3 sm:px-4">
                    {galleryItems.slice(0, 3).map((item, index) => (
                      <div
                        key={`${item.imageUrl}-${index}`}
                        className="aspect-square rounded-3xl bg-slate-200 bg-cover bg-center"
                        style={{
                          backgroundImage: `url('${item.imageUrl}')`,
                        }}
                      />
                    ))}
                  </div>
                  <div
                    className="mt-4 h-56 w-full shrink-0 rounded-4xl bg-cover bg-center"
                    style={{ backgroundImage: `url('${profile.coverUrl}')` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex h-full min-h-0 flex-col items-center overflow-y-auto overscroll-contain text-center">
                <div
                  className="h-24 w-full shrink-0 bg-slate-200 bg-cover bg-center"
                  style={{ backgroundImage: `url('${profile.coverUrl}')` }}
                />
                <div className="mx-auto -mt-14 flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full border-8 border-white bg-slate-100 shadow-lg sm:-mt-16 sm:h-32 sm:w-32">
                  <div
                    className="h-full w-full bg-cover bg-center"
                    style={{ backgroundImage: `url('${profile.avatarUrl}')` }}
                  />
                </div>
                <div className="mt-4 shrink-0 px-4 sm:px-6">
                  <p className="text-xl font-semibold">{profile.displayName}</p>
                  <p className="mt-2 text-sm text-slate-600">
                    {profileLines.map((line) => (
                      <span key={line}>
                        {line}
                        <br />
                      </span>
                    ))}
                    @{profile.username}
                  </p>
                </div>
                <div className="mt-4 flex shrink-0 items-center justify-center gap-3 text-slate-800">
                  {socialLinks.slice(0, 3).map((link) => (
                    <div
                      key={`${link.platform}-${link.url}`}
                      className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-xs font-semibold shadow-sm"
                    >
                      {link.platform.slice(0, 1).toUpperCase()}
                    </div>
                  ))}
                </div>
                <div className="mt-6 grid w-full shrink-0 grid-cols-3 gap-2 px-3 sm:gap-3 sm:px-4">
                  {galleryItems.slice(0, 3).map((item, index) => (
                    <div
                      key={`${item.imageUrl}-${index}`}
                      className="aspect-square rounded-2xl bg-slate-200 bg-cover bg-center sm:rounded-3xl"
                      style={{
                        backgroundImage: `url('${item.imageUrl}')`,
                      }}
                    />
                  ))}
                </div>
                <div
                  className="mt-4 h-48 w-full shrink-0 rounded-3xl bg-cover bg-center sm:h-56 sm:rounded-4xl"
                  style={{ backgroundImage: `url('${profile.coverUrl}')` }}
                />
                <div className="w-full shrink-0 space-y-3 px-3 py-4 sm:px-4">
                  {mobileScrollTestBlocks.map((block) => (
                    <div
                      key={block.title}
                      className="rounded-2xl bg-white p-4 text-left shadow-sm"
                    >
                      <p className="text-sm font-semibold text-slate-900">
                        {block.title}
                      </p>
                      <p className="mt-2 text-sm leading-5 text-slate-600">
                        {block.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
