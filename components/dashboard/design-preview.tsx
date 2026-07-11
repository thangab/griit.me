'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { ProfileBuilderState } from '@/lib/types/profile-builder';

const previewStyles = {
  mobile: {
    wrapper: 'mx-auto w-80 sm:w-90',
    frame: 'h-160',
  },
  desktop: {
    wrapper: 'mx-auto w-full max-w-[900px]',
    frame: 'h-[520px]',
  },
};

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
    <div className="space-y-4">
      <div className="border-border bg-card flex flex-col gap-3 rounded-3xl border p-4 sm:flex-row sm:items-center sm:justify-between">
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

      <div className="border-border rounded-4xl border bg-slate-950 p-4 shadow-xl">
        <div
          className={`relative overflow-hidden rounded-4xl bg-white shadow-xl ${previewStyles[mode].wrapper}`}
        >
          {mode === 'desktop' && (
            <div className="absolute top-0 left-0 h-12 w-full bg-slate-950/90" />
          )}
          <div
            className={`relative overflow-hidden rounded-4xl border border-white/10 bg-slate-50 ${previewStyles[mode].frame}`}
          >
            {mode === 'desktop' ? (
              <div className="flex h-full flex-col">
                <div className="border-b border-slate-200 bg-white px-5 py-4 text-sm font-medium text-slate-800">
                  griit.me/{profile.username}
                </div>
                <div className="flex flex-1 flex-col items-center justify-start gap-4 overflow-hidden p-6">
                  <div
                    className="h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-slate-200 bg-cover bg-center"
                    style={{
                      backgroundImage: `url('${profile.avatarUrl}')`,
                    }}
                  />
                  <div className="max-w-xl text-center">
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
                  <div className="flex items-center justify-center gap-3 text-slate-800">
                    {socialLinks.slice(0, 3).map((link) => (
                      <div
                        key={`${link.platform}-${link.url}`}
                        className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-xs font-semibold shadow-sm"
                      >
                        {link.platform.slice(0, 1).toUpperCase()}
                      </div>
                    ))}
                  </div>
                  <div className="grid w-full grid-cols-3 gap-3 px-4">
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
                    className="mt-4 h-56 w-full rounded-4xl bg-cover bg-center"
                    style={{ backgroundImage: `url('${profile.coverUrl}')` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex h-full flex-col items-center overflow-hidden text-center">
                <div
                  className="h-24 w-full bg-slate-200 bg-cover bg-center"
                  style={{ backgroundImage: `url('${profile.coverUrl}')` }}
                />
                <div className="mx-auto -mt-16 flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-8 border-white bg-slate-100 shadow-lg">
                  <div
                    className="h-full w-full bg-cover bg-center"
                    style={{ backgroundImage: `url('${profile.avatarUrl}')` }}
                  />
                </div>
                <div className="mt-4 px-6">
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
                <div className="mt-4 flex items-center justify-center gap-3 text-slate-800">
                  {socialLinks.slice(0, 3).map((link) => (
                    <div
                      key={`${link.platform}-${link.url}`}
                      className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-xs font-semibold shadow-sm"
                    >
                      {link.platform.slice(0, 1).toUpperCase()}
                    </div>
                  ))}
                </div>
                <div className="mt-6 grid w-full gap-3 px-4 sm:grid-cols-3">
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
                  className="mt-4 h-56 w-full rounded-4xl bg-cover bg-center"
                  style={{ backgroundImage: `url('${profile.coverUrl}')` }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
