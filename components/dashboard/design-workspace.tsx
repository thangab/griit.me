'use client';

import { useState } from 'react';
import { FileText, MonitorSmartphone, Palette } from 'lucide-react';
import { ContentEditor } from '@/components/dashboard/content-editor';
import { DesignPreview } from '@/components/dashboard/design-preview';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';
import type { ProfileBuilderState } from '@/lib/types/profile-builder';

const pageSections = [
  { label: 'Header', subtitle: 'Cover and intro' },
  { label: 'Socials', subtitle: 'Link your profiles' },
  { label: 'Blocks', subtitle: 'Content cards and links' },
];

const styleSections = [
  'Templates',
  'General Styles',
  'Block Styles',
  'Fonts',
  'Colors',
  'Social & Sharing',
  'All Styles',
  'Media Gallery',
];

const mobilePanels = [
  { id: 'content', label: 'Content', icon: FileText },
  { id: 'preview', label: 'Preview', icon: MonitorSmartphone },
  { id: 'styles', label: 'Styles', icon: Palette },
] as const;

type MobilePanel = (typeof mobilePanels)[number]['id'];

function ContentPanel({ builder }: { builder: ProfileBuilderState }) {
  return (
    <aside className="border-border bg-background/80 min-w-0 space-y-4 rounded-2xl border p-4 sm:rounded-3xl sm:p-5 xl:h-full xl:overflow-y-auto">
      <ContentEditor builder={builder} />

      <div className="border-border border-t pt-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-muted-foreground text-xs tracking-[0.24em] uppercase">
              Page
            </p>
            <p className="mt-2 font-semibold">
              {builder.pages.find((page) => page.isHome)?.title ?? 'Home'}
            </p>
          </div>
          <Button size="sm" variant="outline">
            Add page
          </Button>
        </div>
      </div>

      <div className="border-border bg-card space-y-3 rounded-3xl border p-4">
        <p className="text-sm font-semibold">Content</p>
        {pageSections.map((section) => (
          <div
            key={section.label}
            className="border-border bg-background rounded-2xl border p-4"
          >
            <p className="text-sm font-semibold">{section.label}</p>
            <p className="text-muted-foreground text-sm">{section.subtitle}</p>
          </div>
        ))}
      </div>

      <div className="border-border bg-card rounded-3xl border p-4">
        <p className="text-sm font-semibold">Sections</p>
        <p className="text-muted-foreground mt-2 text-sm">
          Blocks will use the profile data saved above and render in the preview
          timeline.
        </p>
      </div>
    </aside>
  );
}

function PreviewPanel({ builder }: { builder: ProfileBuilderState }) {
  return (
    <section className="min-w-0 space-y-4 xl:h-full xl:min-h-0 xl:overflow-hidden">
      <DesignPreview builder={builder} />
    </section>
  );
}

function StylesPanel() {
  return (
    <aside className="border-border bg-background/80 min-w-0 space-y-5 rounded-2xl border p-4 sm:rounded-3xl sm:p-5 xl:h-full xl:overflow-y-auto">
      <div>
        <p className="text-muted-foreground text-xs tracking-[0.24em] uppercase">
          Styles
        </p>
        <p className="mt-2 font-semibold">Visual settings</p>
      </div>

      <div className="space-y-2">
        {styleSections.map((section) => (
          <button
            key={section}
            className="border-border bg-card hover:border-primary/40 flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-left transition"
            type="button"
          >
            <span className="font-medium">{section}</span>
            <span className="text-muted-foreground">›</span>
          </button>
        ))}
      </div>

      <div className="border-border bg-card rounded-3xl border p-4">
        <p className="text-sm font-semibold">Need more?</p>
        <p className="text-muted-foreground mt-2 text-sm">
          Pro unlocks more page styles, fonts, and advanced sharing options.
        </p>
      </div>
    </aside>
  );
}

function MobilePanelBar({
  activePanel,
  onSelect,
}: {
  activePanel: MobilePanel;
  onSelect: (panel: MobilePanel) => void;
}) {
  return (
    <div className="border-border bg-background/95 sticky top-16 z-30 -mx-4 mb-4 border-b px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 xl:hidden">
      <div className="bg-muted grid grid-cols-3 gap-1 rounded-xl p-1">
        {mobilePanels.map((panel) => {
          const Icon = panel.icon;
          const isActive = activePanel === panel.id;

          return (
            <button
              key={panel.id}
              className={cn(
                'flex h-10 min-w-0 items-center justify-center gap-2 rounded-lg px-2 text-xs font-medium transition sm:text-sm',
                isActive
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
              type="button"
              onClick={() => onSelect(panel.id)}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{panel.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function DesignWorkspace({ builder }: { builder: ProfileBuilderState }) {
  const [activePanel, setActivePanel] = useState<MobilePanel>('preview');

  return (
    <div className="xl:h-[calc(100dvh-3rem)] xl:overflow-hidden">
      <MobilePanelBar activePanel={activePanel} onSelect={setActivePanel} />

      <div className="xl:hidden">
        {activePanel === 'content' ? <ContentPanel builder={builder} /> : null}
        {activePanel === 'preview' ? <PreviewPanel builder={builder} /> : null}
        {activePanel === 'styles' ? <StylesPanel /> : null}
      </div>

      <div className="hidden min-w-0 gap-4 xl:grid xl:h-full xl:min-h-0 xl:grid-cols-[280px_1fr_280px]">
        <ContentPanel builder={builder} />
        <PreviewPanel builder={builder} />
        <StylesPanel />
      </div>
    </div>
  );
}
