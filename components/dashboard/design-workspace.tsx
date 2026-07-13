'use client';

import { useActionState, useState, useTransition } from 'react';
import {
  FileText,
  Lock,
  MonitorSmartphone,
  Palette,
  Save,
} from 'lucide-react';
import { ContentEditor } from '@/components/dashboard/content-editor';
import { DesignPreview } from '@/components/dashboard/design-preview';
import { Button } from '@/components/ui/button';
import {
  setProfilePublishedAction,
  updateProfileTemplateAction,
  type ProfileBuilderActionState,
} from '@/lib/actions/profile-builder';
import {
  profileTemplates,
  type ProfileTemplateId,
  resolveProfileTemplateId,
} from '@/lib/constants/profile-templates';
import { cn } from '@/lib/utils/cn';
import type { SubscriptionState } from '@/lib/types/billing';
import type { ProfileBuilderState } from '@/lib/types/profile-builder';
import {
  colorPresets,
  fontPresets,
  galleryLayouts,
  overlayPresets,
  radiusPresets,
  resolveThemeSettings,
  type ProfileThemeSettings,
} from '@/lib/constants/profile-theme';

const mobilePanels = [
  { id: 'content', label: 'Content', icon: FileText },
  { id: 'preview', label: 'Preview', icon: MonitorSmartphone },
  { id: 'styles', label: 'Styles', icon: Palette },
] as const;

type MobilePanel = (typeof mobilePanels)[number]['id'];

const initialTemplateState: ProfileBuilderActionState = {
  success: false,
  message: '',
};

function formatPreviewDate(value: string) {
  if (!value) {
    return 'No target date';
  }

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${value}T00:00:00`));
}

function createLivePreviewState(
  builder: ProfileBuilderState,
  form: HTMLFormElement,
): ProfileBuilderState {
  const data = new FormData(form);
  const getValue = (name: string) => String(data.get(name) ?? '').trim();
  const selectedSportSlugs = data
    .getAll('sportSlugs')
    .map(String)
    .filter(Boolean);
  const selectedSports = builder.availableSports.filter((sport) =>
    selectedSportSlugs.includes(sport.slug),
  );
  const goals = [1, 2, 3]
    .map((number, index) => {
      const title = getValue(`goalTitle${number}`);
      const targetDate = getValue(`goalTargetAt${number}`);

      if (!title) {
        return null;
      }

      return {
        id: builder.goals[index]?.id ?? null,
        title,
        description: getValue(`goalDescription${number}`),
        targetDate,
        targetLabel: formatPreviewDate(targetDate),
        status: getValue(`goalStatus${number}`) || 'planned',
        sortOrder: index,
        isEnabled: true,
      };
    })
    .filter((goal): goal is NonNullable<typeof goal> => Boolean(goal));
  const galleryItems = Array.from(data.entries())
    .filter(([key]) => /^galleryUrl\d+$/.test(key))
    .sort(([left], [right]) => {
      const leftIndex = Number(left.replace('galleryUrl', ''));
      const rightIndex = Number(right.replace('galleryUrl', ''));
      return leftIndex - rightIndex;
    })
    .map(([key, value], index) => {
      const imageUrl = String(value).trim();
      const sourceIndex = Number(key.replace('galleryUrl', '')) - 1;

      if (!imageUrl) {
        return null;
      }

      return {
        id: builder.galleryItems[sourceIndex]?.id ?? null,
        imageUrl,
        caption: builder.galleryItems[sourceIndex]?.caption ?? '',
        altText: builder.galleryItems[sourceIndex]?.altText ?? '',
        sortOrder: index,
        isEnabled: true,
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
  const socialUrl = getValue('socialUrl');
  const activityTitle = getValue('activityTitle1');
  const activityDate = getValue('activityDate1');
  const achievements = [1, 2, 3]
    .map((number, index) => {
      const title = getValue(`achievementTitle${number}`);
      const date = getValue(`achievementDate${number}`);

      if (!title) {
        return null;
      }

      return {
        id: builder.achievements[index]?.id ?? null,
        title,
        description: getValue(`achievementDescription${number}`),
        date,
        dateLabel: date ? formatPreviewDate(date) : 'Manual',
        sortOrder: index,
        isEnabled: true,
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return {
    ...builder,
    profile: {
      ...builder.profile,
      displayName: getValue('displayName'),
      bio: getValue('bio'),
      sports: selectedSports.map((sport) => sport.name),
      sportSlugs: selectedSports.map((sport) => sport.slug),
      avatarUrl: getValue('avatarUrl'),
      coverUrl: getValue('coverUrl'),
      isPublished: data.get('isPublished') === 'on',
    },
    goals,
    galleryItems,
    achievements,
    activities: activityTitle
      ? [
          {
            id: builder.activities[0]?.id ?? null,
            title: activityTitle,
            description: getValue('activityType1'),
            date: activityDate,
            dateLabel: activityDate ? formatPreviewDate(activityDate) : 'Manual',
            sortOrder: 0,
            isEnabled: true,
          },
        ]
      : [],
    socialLinks: socialUrl
      ? [
          {
            id: builder.socialLinks[0]?.id ?? null,
            platform: getValue('socialPlatform') || 'website',
            label:
              getValue('socialLabel') ||
              getValue('socialPlatform') ||
              'Website',
            url: socialUrl,
            sortOrder: 0,
            isEnabled: true,
          },
        ]
      : [],
  };
}

function ContentPanel({
  builder,
  subscription,
  onPreviewChange,
}: {
  builder: ProfileBuilderState;
  subscription: SubscriptionState;
  onPreviewChange: (form: HTMLFormElement) => void;
}) {
  return (
    <aside className="border-border bg-background/80 min-h-0 min-w-0 rounded-xl border xl:h-full xl:overflow-y-auto xl:[contain:size]">
      <div className="p-4 sm:p-5">
        <ContentEditor
          builder={builder}
          subscription={subscription}
          onPreviewChange={onPreviewChange}
        />
      </div>
    </aside>
  );
}

function PreviewPanel({
  builder,
  onPublishChange,
  publishMessage,
  publishPending,
}: {
  builder: ProfileBuilderState;
  onPublishChange: (isPublished: boolean) => void;
  publishMessage: string;
  publishPending: boolean;
}) {
  return (
    <section className="min-w-0 space-y-4 xl:h-full xl:min-h-0 xl:overflow-hidden">
      <DesignPreview
        builder={builder}
        onPublishChange={onPublishChange}
        publishMessage={publishMessage}
        publishPending={publishPending}
      />
    </section>
  );
}

function TemplateSelector({
  subscription,
  selectedTemplateId,
  coverUrl,
  themeSettings,
  onTemplateSelect,
  onCoverChange,
  onThemeChange,
}: {
  subscription: SubscriptionState;
  selectedTemplateId: ProfileTemplateId;
  coverUrl: string;
  themeSettings: ProfileThemeSettings;
  onTemplateSelect: (templateId: ProfileTemplateId) => void;
  onCoverChange: (coverUrl: string) => void;
  onThemeChange: (settings: ProfileThemeSettings) => void;
}) {
  const [state, formAction, pending] = useActionState(
    updateProfileTemplateAction,
    initialTemplateState,
  );
  const [feedbackDismissed, setFeedbackDismissed] = useState(false);

  const handleTemplateSelect = (templateId: ProfileTemplateId) => {
    setFeedbackDismissed(true);
    onTemplateSelect(templateId);
  };
  const handleCoverChange = (coverUrl: string) => {
    setFeedbackDismissed(true);
    onCoverChange(coverUrl);
  };
  const handleThemeChange = (settings: ProfileThemeSettings) => {
    setFeedbackDismissed(true);
    onThemeChange(settings);
  };

  return (
    <form
      action={formAction}
      className="border-border bg-card rounded-xl border p-4"
      onSubmit={() => setFeedbackDismissed(false)}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">Templates</p>
          <p className="text-muted-foreground mt-1 text-xs">
            Preview any template. Pro is required to save premium templates.
          </p>
        </div>
        <Button size="sm" type="submit" disabled={pending}>
          <Save className="h-4 w-4" />
          {pending ? 'Saving' : 'Save'}
        </Button>
      </div>

      {!feedbackDismissed && !pending && state.message ? (
        <p
          className={cn(
            'mt-3 rounded-md px-3 py-2 text-sm',
            state.success
              ? 'bg-emerald-50 text-emerald-900'
              : 'bg-red-50 text-red-900',
          )}
        >
          {state.message}
        </p>
      ) : null}

      <input name="colorPreset" type="hidden" value={themeSettings.colorPreset} />
      <input name="fontPreset" type="hidden" value={themeSettings.fontPreset} />
      <input name="coverOverlay" type="hidden" value={themeSettings.coverOverlay} />
      <input name="radiusPreset" type="hidden" value={themeSettings.radiusPreset} />
      <input name="galleryLayout" type="hidden" value={themeSettings.galleryLayout} />

      <label className="mt-4 block space-y-1.5">
        <span className="text-xs font-medium">Cover image URL</span>
        <input
          className="border-border bg-background focus:border-primary h-10 w-full rounded-md border px-3 text-sm transition outline-none"
          name="coverUrl"
          onChange={(event) => handleCoverChange(event.target.value)}
          placeholder="https://..."
          type="url"
          value={coverUrl}
        />
        <span className="text-muted-foreground block text-xs leading-5">
          Used as the main visual background of your profile template.
        </span>
      </label>

      <div className="border-border mt-4 space-y-2 border-t pt-4">
        {profileTemplates.map((template) => {
          const isLocked = template.proOnly && !subscription.isActive;

          return (
            <label
              key={template.id}
              className={cn(
                'border-border bg-background flex cursor-pointer gap-3 rounded-lg border p-3 transition',
                selectedTemplateId === template.id && 'border-primary/50',
              )}
            >
              <input
                className="mt-1 h-4 w-4"
                checked={selectedTemplateId === template.id}
                name="templateId"
                onChange={() => handleTemplateSelect(template.id)}
                type="radio"
                value={template.id}
              />
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2 text-sm font-semibold">
                  {template.name}
                  {template.proOnly ? (
                    <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-[11px] font-semibold">
                      Pro
                    </span>
                  ) : null}
                  {isLocked ? <Lock className="h-3.5 w-3.5" /> : null}
                </span>
                <span className="text-muted-foreground mt-1 block text-xs">
                  {template.description}
                  {isLocked ? ' Preview only on Free.' : ''}
                </span>
              </span>
            </label>
          );
        })}
      </div>

      <div className="border-border mt-4 space-y-4 border-t pt-4">
        <div>
          <p className="text-xs font-semibold">Color theme</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {colorPresets.map((preset) => (
              <button type="button" key={preset.id} onClick={() => handleThemeChange({ ...themeSettings, colorPreset: preset.id })} className={cn('border-border bg-background cursor-pointer rounded-lg border p-2.5 text-left', themeSettings.colorPreset === preset.id && 'border-primary/60')}>
                <span className="flex gap-1">{preset.colors.map((color) => <span key={color} className="h-4 flex-1 rounded-sm" style={{ backgroundColor: color }} />)}</span>
                <span className="mt-2 flex items-center gap-1 text-xs font-medium">{preset.name}{preset.proOnly ? <Lock className="h-3 w-3" /> : null}</span>
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold">Typography</p>
          <div className="mt-2 space-y-1.5">{fontPresets.map((preset) => <button type="button" key={preset.id} onClick={() => handleThemeChange({ ...themeSettings, fontPreset: preset.id })} className={cn('border-border bg-background flex w-full cursor-pointer items-center justify-between rounded-lg border px-3 py-2.5 text-left', themeSettings.fontPreset === preset.id && 'border-primary/60')}><span><span className="block text-sm font-semibold">{preset.name}</span><span className="text-muted-foreground text-xs">{preset.sample}</span></span>{preset.proOnly ? <Lock className="h-3.5 w-3.5" /> : null}</button>)}</div>
        </div>
        {[
          { label: 'Cover overlay', key: 'coverOverlay' as const, values: overlayPresets },
          { label: 'Corners', key: 'radiusPreset' as const, values: radiusPresets },
          { label: 'Gallery layout', key: 'galleryLayout' as const, values: galleryLayouts },
        ].map((group) => <div key={group.key}><p className="text-xs font-semibold">{group.label}</p><div className="bg-muted mt-2 grid grid-cols-3 gap-1 rounded-lg p-1">{group.values.map((value) => <button type="button" key={value} onClick={() => handleThemeChange({ ...themeSettings, [group.key]: value })} className={cn('cursor-pointer rounded-md px-2 py-2 text-center text-xs font-medium capitalize', themeSettings[group.key] === value ? 'bg-background shadow-sm' : 'text-muted-foreground')}>{value}{group.key === 'galleryLayout' && value !== 'grid' ? ' · Pro' : ''}</button>)}</div></div>)}
      </div>
    </form>
  );
}

function StylesPanel({
  subscription,
  selectedTemplateId,
  coverUrl,
  themeSettings,
  onTemplateSelect,
  onCoverChange,
  onThemeChange,
}: {
  subscription: SubscriptionState;
  selectedTemplateId: ProfileTemplateId;
  coverUrl: string;
  themeSettings: ProfileThemeSettings;
  onTemplateSelect: (templateId: ProfileTemplateId) => void;
  onCoverChange: (coverUrl: string) => void;
  onThemeChange: (settings: ProfileThemeSettings) => void;
}) {
  return (
    <aside className="border-border bg-background/80 min-h-0 min-w-0 space-y-5 rounded-xl border p-4 sm:p-5 xl:h-full xl:overflow-y-auto xl:[contain:size]">
      <div>
        <p className="text-muted-foreground text-xs tracking-[0.24em] uppercase">
          Styles
        </p>
        <p className="mt-2 font-semibold">Visual settings</p>
      </div>

      <TemplateSelector
        subscription={subscription}
        selectedTemplateId={selectedTemplateId}
        coverUrl={coverUrl}
        themeSettings={themeSettings}
        onTemplateSelect={onTemplateSelect}
        onCoverChange={onCoverChange}
        onThemeChange={onThemeChange}
      />

      <div className="border-border bg-card rounded-xl border p-4">
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

export function DesignWorkspace({
  builder,
  subscription,
}: {
  builder: ProfileBuilderState;
  subscription: SubscriptionState;
}) {
  const [activePanel, setActivePanel] = useState<MobilePanel>('preview');
  const [publishPending, startPublishTransition] = useTransition();
  const [publishMessage, setPublishMessage] = useState('');
  const [draftBuilder, setDraftBuilder] =
    useState<ProfileBuilderState>(builder);
  const [selectedTemplateId, setSelectedTemplateId] =
    useState<ProfileTemplateId>(() =>
      resolveProfileTemplateId(builder.profile.theme),
    );
  const [themeSettings, setThemeSettings] = useState<ProfileThemeSettings>(() =>
    resolveThemeSettings(builder.profile.theme),
  );
  const previewBuilder: ProfileBuilderState = {
    ...draftBuilder,
    profile: {
      ...draftBuilder.profile,
      theme: {
        ...draftBuilder.profile.theme,
        templateId: selectedTemplateId,
        ...themeSettings,
      },
    },
  };
  const handlePreviewChange = (form: HTMLFormElement) => {
    setDraftBuilder((current) => createLivePreviewState(current, form));
  };
  const handlePublishChange = (isPublished: boolean) => {
    const previousValue = draftBuilder.profile.isPublished;

    setPublishMessage('');
    setDraftBuilder((current) => ({
      ...current,
      profile: {
        ...current.profile,
        isPublished,
      },
    }));

    startPublishTransition(async () => {
      const result = await setProfilePublishedAction(isPublished);
      setPublishMessage(result.message);

      if (!result.success) {
        setDraftBuilder((current) => ({
          ...current,
          profile: {
            ...current.profile,
            isPublished: previousValue,
          },
        }));
      }
    });
  };
  const handleCoverChange = (coverUrl: string) => {
    setDraftBuilder((current) => ({
      ...current,
      profile: {
        ...current.profile,
        coverUrl,
      },
    }));
  };

  return (
    <div className="min-h-full xl:h-full xl:min-h-0 xl:flex-1 xl:overflow-hidden">
      <MobilePanelBar activePanel={activePanel} onSelect={setActivePanel} />

      <div className="xl:hidden">
        {activePanel === 'content' ? (
          <ContentPanel
            builder={draftBuilder}
            subscription={subscription}
            onPreviewChange={handlePreviewChange}
          />
        ) : null}
        {activePanel === 'preview' ? (
          <PreviewPanel
            builder={previewBuilder}
            onPublishChange={handlePublishChange}
            publishMessage={publishMessage}
            publishPending={publishPending}
          />
        ) : null}
        {activePanel === 'styles' ? (
          <StylesPanel
            subscription={subscription}
            selectedTemplateId={selectedTemplateId}
            coverUrl={draftBuilder.profile.coverUrl}
            themeSettings={themeSettings}
            onTemplateSelect={setSelectedTemplateId}
            onCoverChange={handleCoverChange}
            onThemeChange={setThemeSettings}
          />
        ) : null}
      </div>

      <div className="hidden min-w-0 gap-4 xl:grid xl:h-full xl:max-h-full xl:min-h-0 xl:grid-cols-[340px_minmax(0,1fr)_340px] xl:grid-rows-[minmax(0,1fr)] xl:overflow-hidden">
        <ContentPanel
          builder={draftBuilder}
          subscription={subscription}
          onPreviewChange={handlePreviewChange}
        />
        <PreviewPanel
          builder={previewBuilder}
          onPublishChange={handlePublishChange}
          publishMessage={publishMessage}
          publishPending={publishPending}
        />
        <StylesPanel
          subscription={subscription}
          selectedTemplateId={selectedTemplateId}
          coverUrl={draftBuilder.profile.coverUrl}
          themeSettings={themeSettings}
          onTemplateSelect={setSelectedTemplateId}
          onCoverChange={handleCoverChange}
          onThemeChange={setThemeSettings}
        />
      </div>
    </div>
  );
}
