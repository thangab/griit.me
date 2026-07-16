'use client';

import { useActionState, useState, useTransition } from 'react';
import {
  ChevronDown,
  FileText,
  ImageIcon,
  LayoutTemplate,
  Lock,
  MonitorSmartphone,
  Palette,
  Save,
  SlidersHorizontal,
  Type as TypeIcon,
  type LucideIcon,
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
  coverTypes,
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

const colorGroups = [
  {
    title: 'Page',
    description: 'Global canvas and default text',
    colors: [
      { key: 'background', label: 'Background' },
      { key: 'foreground', label: 'Text' },
    ],
  },
  {
    title: 'Blocks',
    description: 'Cards and content hierarchy',
    colors: [
      { key: 'surface', label: 'Background' },
      { key: 'blockTitle', label: 'Titles' },
      { key: 'description', label: 'Descriptions' },
    ],
  },
  {
    title: 'Accent',
    description: 'Sport tags and highlighted actions',
    colors: [
      { key: 'accent', label: 'Background' },
      { key: 'accentText', label: 'Text' },
    ],
  },
  {
    title: 'Social links',
    description: 'Link pills and their labels',
    colors: [
      { key: 'social', label: 'Background' },
      { key: 'socialText', label: 'Text' },
    ],
  },
  {
    title: 'Header',
    description: 'Text displayed over the cover',
    colors: [{ key: 'headerText', label: 'Text' }],
  },
] as const;

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

      return {
        id: builder.galleryItems[sourceIndex]?.id ?? null,
        imageUrl,
        caption: builder.galleryItems[sourceIndex]?.caption ?? '',
        altText: builder.galleryItems[sourceIndex]?.altText ?? '',
        sortOrder: index,
        isEnabled: true,
      };
    });
  const socialLinks = Array.from(data.entries())
    .filter(([key]) => /^socialPlatform\d+$/.test(key))
    .map(([key, value]) => {
      const slot = Number(key.replace('socialPlatform', ''));

      return {
        slot,
        platform: String(value).trim() || 'website',
        label: getValue(`socialLabel${slot}`),
        url: getValue(`socialUrl${slot}`) || '#',
      };
    })
    .sort((left, right) => left.slot - right.slot)
    .map((link, index) => ({
      id: builder.socialLinks[index]?.id ?? null,
      platform: link.platform,
      label: link.label,
      url: link.url,
      sortOrder: index,
      isEnabled: true,
    }));
  const contentBlockTypes = [
    'gallery',
    'achievements',
    'activities',
    'sponsors',
    'media',
  ];
  const contentBlockOrder = data
    .getAll('contentBlockOrder')
    .map(String)
    .filter(
      (key) => contentBlockTypes.includes(key) || /^media-\d+$/.test(key),
    );
  const baseBlocks = builder.blocks.filter(
    (block) => !contentBlockTypes.includes(block.type),
  );
  const existingMediaBlocks = builder.blocks.filter(
    (block) => block.type === 'media',
  );
  const blocks = [
    ...baseBlocks,
    ...contentBlockOrder.map((blockKey, index) => {
      if (blockKey.startsWith('media-')) {
        const slot = Number(blockKey.replace('media-', ''));
        const existingBlock = existingMediaBlocks[slot - 1];

        return {
          id: existingBlock?.id ?? null,
          type: 'media',
          title: 'Media',
          content: {
            builderManaged: true,
            sourceUrl: getValue(`mediaUrl${slot}`),
            caption: getValue(`mediaCaption${slot}`),
          },
          sortOrder: index + 2,
          isEnabled: true,
        };
      }

      const type = blockKey;
      const existingBlock = builder.blocks.find((block) => block.type === type);
      const block = existingBlock ?? {
        id: null,
        type,
        title:
          type === 'gallery'
            ? 'Image gallery'
            : type === 'sponsors'
              ? 'Sponsors & partnerships'
              : type[0].toUpperCase() + type.slice(1),
        content: { builderManaged: true },
        sortOrder: index + 2,
        isEnabled: true,
      };

      return type === 'sponsors'
        ? {
            ...block,
            content: {
              ...block.content,
              builderManaged: true,
              mode: getValue('partnershipMode') || 'seeking',
              headline:
                getValue('partnershipHeadline') || 'Open to partnerships',
              description: getValue('partnershipDescription'),
              contact: getValue('partnershipContact'),
            },
          }
        : { ...block, sortOrder: index + 2 };
    }),
  ];
  const activityTitle = getValue('activityTitle1');
  const activityDate = getValue('activityDate1');
  const achievements = Array.from(data.entries())
    .filter(([key]) => /^achievementTitle\d+$/.test(key))
    .sort(([left], [right]) => {
      const leftIndex = Number(left.replace('achievementTitle', ''));
      const rightIndex = Number(right.replace('achievementTitle', ''));
      return leftIndex - rightIndex;
    })
    .map(([key, value], index) => {
      const number = Number(key.replace('achievementTitle', ''));
      const sourceIndex = number - 1;
      const title = String(value).trim();
      const date = getValue(`achievementDate${number}`);

      return {
        id: builder.achievements[sourceIndex]?.id ?? null,
        title: title || 'New achievement',
        description: getValue(`achievementDescription${number}`),
        date,
        dateLabel: date ? formatPreviewDate(date) : '',
        sortOrder: index,
        isEnabled: true,
      };
    });
  const sponsors = Array.from(data.entries())
    .filter(([key]) => /^sponsorName\d+$/.test(key))
    .sort(([left], [right]) => {
      const leftIndex = Number(left.replace('sponsorName', ''));
      const rightIndex = Number(right.replace('sponsorName', ''));
      return leftIndex - rightIndex;
    })
    .map(([key, value], index) => {
      const number = Number(key.replace('sponsorName', ''));
      const sourceIndex = number - 1;

      return {
        id: builder.sponsors[sourceIndex]?.id ?? null,
        name: String(value).trim() || 'New sponsor',
        logoUrl: getValue(`sponsorLogoUrl${number}`),
        websiteUrl: getValue(`sponsorWebsiteUrl${number}`),
        sortOrder: index,
        isEnabled: true,
      };
    });

  return {
    ...builder,
    blocks,
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
    sponsors,
    achievements,
    activities: data.has('activityTitle1')
      ? [
          {
            id: builder.activities[0]?.id ?? null,
            title: activityTitle || 'New activity',
            description: getValue('activityType1'),
            date: activityDate,
            dateLabel: activityDate ? formatPreviewDate(activityDate) : '',
            sortOrder: 0,
            isEnabled: true,
          },
        ]
      : [],
    socialLinks,
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

function StyleSection({
  title,
  description,
  icon: Icon,
  defaultOpen = false,
  children,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  return (
    <details
      className="border-border bg-background group overflow-hidden rounded-xl border"
      open={defaultOpen}
    >
      <summary className="hover:bg-muted/60 flex cursor-pointer list-none items-center gap-3 p-3 transition-colors [&::-webkit-details-marker]:hidden">
        <span className="bg-muted text-muted-foreground flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
          <Icon className="h-4 w-4" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold">{title}</span>
          <span className="text-muted-foreground block truncate text-xs">
            {description}
          </span>
        </span>
        <ChevronDown className="text-muted-foreground h-4 w-4 shrink-0 transition-transform group-open:rotate-180" />
      </summary>
      <div className="border-border space-y-3 border-t p-3">{children}</div>
    </details>
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
      className="space-y-4"
      onSubmit={() => setFeedbackDismissed(false)}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-muted-foreground text-xs tracking-[0.24em] uppercase">
            Styles
          </p>
          <p className="mt-2 font-semibold">Visual settings</p>
        </div>
        <Button size="sm" type="submit" disabled={pending}>
          <Save className="h-4 w-4" />
          {pending ? 'Saving' : 'Save'}
        </Button>
      </div>

      {!feedbackDismissed && !pending && state.message ? (
        <p
          className={cn(
            'rounded-md px-3 py-2 text-sm',
            state.success
              ? 'bg-emerald-50 text-emerald-900'
              : 'bg-red-50 text-red-900',
          )}
        >
          {state.message}
        </p>
      ) : null}

      <input
        name="colorPreset"
        type="hidden"
        value={themeSettings.colorPreset}
      />
      <input name="fontPreset" type="hidden" value={themeSettings.fontPreset} />
      <input
        name="coverOverlay"
        type="hidden"
        value={themeSettings.coverOverlay}
      />
      <input
        name="radiusPreset"
        type="hidden"
        value={themeSettings.radiusPreset}
      />
      <input
        name="galleryLayout"
        type="hidden"
        value={themeSettings.galleryLayout}
      />
      <input
        name="customBackground"
        type="hidden"
        value={themeSettings.customColors.background}
      />
      <input
        name="customSurface"
        type="hidden"
        value={themeSettings.customColors.surface}
      />
      <input
        name="customForeground"
        type="hidden"
        value={themeSettings.customColors.foreground}
      />
      <input
        name="customAccent"
        type="hidden"
        value={themeSettings.customColors.accent}
      />
      <input
        name="customSocial"
        type="hidden"
        value={themeSettings.customColors.social}
      />
      <input
        name="customHeaderText"
        type="hidden"
        value={themeSettings.customColors.headerText}
      />
      <input
        name="customBlockTitle"
        type="hidden"
        value={themeSettings.customColors.blockTitle}
      />
      <input
        name="customDescription"
        type="hidden"
        value={themeSettings.customColors.description}
      />
      <input
        name="customAccentText"
        type="hidden"
        value={themeSettings.customColors.accentText}
      />
      <input
        name="customSocialText"
        type="hidden"
        value={themeSettings.customColors.socialText}
      />
      <input name="coverType" type="hidden" value={themeSettings.coverType} />
      <input name="coverColor" type="hidden" value={themeSettings.coverColor} />
      <input
        name="coverGradientFrom"
        type="hidden"
        value={themeSettings.coverGradientFrom}
      />
      <input
        name="coverGradientTo"
        type="hidden"
        value={themeSettings.coverGradientTo}
      />

      <div className="space-y-3">
        <StyleSection
          title="Template"
          description="Choose the profile structure"
          icon={LayoutTemplate}
          defaultOpen
        >
          {profileTemplates.map((template) => {
            const isLocked = template.proOnly && !subscription.isActive;

            return (
              <label
                key={template.id}
                className={cn(
                  'border-border flex cursor-pointer gap-3 rounded-lg border p-3 transition',
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
        </StyleSection>

        <StyleSection
          title="Cover"
          description="Image, color or gradient"
          icon={ImageIcon}
        >
          <div className="bg-muted grid grid-cols-3 gap-1 rounded-lg p-1">
            {coverTypes.map((coverType) => (
              <button
                type="button"
                key={coverType}
                onClick={() =>
                  handleThemeChange({ ...themeSettings, coverType })
                }
                className={cn(
                  'cursor-pointer rounded-md px-2 py-2 text-center text-xs font-medium capitalize',
                  themeSettings.coverType === coverType
                    ? 'bg-background shadow-sm'
                    : 'text-muted-foreground',
                )}
              >
                {coverType}
              </button>
            ))}
          </div>

          {themeSettings.coverType !== 'image' ? (
            <input name="coverUrl" type="hidden" value={coverUrl} />
          ) : null}

          {themeSettings.coverType === 'image' ? (
            <label className="block space-y-1.5">
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
                Used as the main visual background of your profile.
              </span>
            </label>
          ) : null}

          {themeSettings.coverType === 'image' ? (
            <div>
              <p className="text-xs font-semibold">Cover overlay</p>
              <div className="bg-muted mt-2 grid grid-cols-3 gap-1 rounded-lg p-1">
                {overlayPresets.map((overlay) => (
                  <button
                    type="button"
                    key={overlay}
                    onClick={() =>
                      handleThemeChange({
                        ...themeSettings,
                        coverOverlay: overlay,
                      })
                    }
                    className={cn(
                      'cursor-pointer rounded-md px-2 py-2 text-center text-xs font-medium capitalize',
                      themeSettings.coverOverlay === overlay
                        ? 'bg-background shadow-sm'
                        : 'text-muted-foreground',
                    )}
                  >
                    {overlay}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {themeSettings.coverType === 'color' ? (
            <label className="border-border bg-muted/40 flex items-center justify-between gap-3 rounded-lg border p-3">
              <span className="text-xs font-medium">Cover color</span>
              <span className="border-border bg-background flex items-center gap-2 rounded-md border px-2 py-1.5">
                <input
                  aria-label="Cover color"
                  className="h-6 w-7 cursor-pointer border-0 bg-transparent p-0"
                  type="color"
                  value={themeSettings.coverColor}
                  onChange={(event) =>
                    handleThemeChange({
                      ...themeSettings,
                      coverColor: event.target.value,
                    })
                  }
                />
                <span className="text-muted-foreground w-16 font-mono text-[11px] uppercase">
                  {themeSettings.coverColor}
                </span>
              </span>
            </label>
          ) : null}

          {themeSettings.coverType === 'gradient' ? (
            <div className="border-border bg-muted/40 space-y-2 rounded-lg border p-3">
              {[
                { key: 'coverGradientFrom' as const, label: 'Start color' },
                { key: 'coverGradientTo' as const, label: 'End color' },
              ].map((color) => (
                <label
                  key={color.key}
                  className="flex items-center justify-between gap-3"
                >
                  <span className="text-xs font-medium">{color.label}</span>
                  <span className="border-border bg-background flex items-center gap-2 rounded-md border px-2 py-1.5">
                    <input
                      aria-label={color.label}
                      className="h-6 w-7 cursor-pointer border-0 bg-transparent p-0"
                      type="color"
                      value={themeSettings[color.key]}
                      onChange={(event) =>
                        handleThemeChange({
                          ...themeSettings,
                          [color.key]: event.target.value,
                        })
                      }
                    />
                    <span className="text-muted-foreground w-16 font-mono text-[11px] uppercase">
                      {themeSettings[color.key]}
                    </span>
                  </span>
                </label>
              ))}
              <div
                className="h-14 rounded-md"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${themeSettings.coverGradientFrom}, ${themeSettings.coverGradientTo})`,
                }}
              />
            </div>
          ) : null}
        </StyleSection>

        <StyleSection
          title="Colors"
          description="Organized by profile element"
          icon={Palette}
        >
          <div className="space-y-2">
            {colorGroups.map((group) => (
              <div
                key={group.title}
                className="border-border rounded-lg border p-3"
              >
                <div className="mb-2.5">
                  <p className="text-xs font-semibold">{group.title}</p>
                  <p className="text-muted-foreground mt-0.5 text-[11px]">
                    {group.description}
                  </p>
                </div>
                <div className="space-y-1.5">
                  {group.colors.map((color) => (
                    <label
                      key={color.key}
                      className="bg-muted/45 flex items-center justify-between gap-3 rounded-md px-2.5 py-2"
                    >
                      <span className="text-xs font-medium">{color.label}</span>
                      <span className="border-border bg-background flex items-center gap-2 rounded-md border px-2 py-1">
                        <input
                          aria-label={`${group.title} ${color.label} color`}
                          className="h-6 w-7 cursor-pointer border-0 bg-transparent p-0"
                          type="color"
                          value={themeSettings.customColors[color.key]}
                          onChange={(event) =>
                            handleThemeChange({
                              ...themeSettings,
                              colorPreset: 'custom',
                              customColors: {
                                ...themeSettings.customColors,
                                [color.key]: event.target.value,
                              },
                            })
                          }
                        />
                        <span className="text-muted-foreground w-16 font-mono text-[11px] uppercase">
                          {themeSettings.customColors[color.key]}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <details className="border-border group/presets overflow-hidden rounded-lg border">
            <summary className="hover:bg-muted/60 flex cursor-pointer list-none items-center gap-3 px-3 py-2.5 transition-colors [&::-webkit-details-marker]:hidden">
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-semibold">
                  Quick presets
                </span>
                <span className="text-muted-foreground block text-[11px]">
                  {colorPresets.find(
                    (preset) => preset.id === themeSettings.colorPreset,
                  )?.name ?? 'Custom colors'}
                </span>
              </span>
              <ChevronDown className="text-muted-foreground h-4 w-4 transition-transform group-open/presets:rotate-180" />
            </summary>
            <div className="border-border grid grid-cols-2 gap-2 border-t p-3">
              {colorPresets.map((preset) => (
                <button
                  type="button"
                  key={preset.id}
                  onClick={() =>
                    handleThemeChange({
                      ...themeSettings,
                      colorPreset: preset.id,
                      customColors: {
                        background: preset.colors[0],
                        surface: preset.colors[1],
                        foreground: preset.colors[2],
                        accent: preset.colors[3],
                        social: preset.colors[4],
                        headerText: preset.colors[5],
                        blockTitle: preset.colors[6],
                        description: preset.colors[7],
                        accentText: preset.colors[8],
                        socialText: preset.colors[9],
                      },
                    })
                  }
                  className={cn(
                    'border-border cursor-pointer rounded-lg border p-2.5 text-left',
                    themeSettings.colorPreset === preset.id &&
                      'border-primary/60 ring-primary/10 ring-2',
                  )}
                >
                  <span className="flex gap-1">
                    {[0, 1, 3, 4].map((index) => (
                      <span
                        key={`${preset.colors[index]}-${index}`}
                        className="h-4 flex-1 rounded-sm"
                        style={{ backgroundColor: preset.colors[index] }}
                      />
                    ))}
                  </span>
                  <span className="mt-2 block text-xs font-medium">
                    {preset.name}
                  </span>
                </button>
              ))}
            </div>
          </details>
        </StyleSection>

        <StyleSection
          title="Typography"
          description="Choose the profile tone"
          icon={TypeIcon}
        >
          {fontPresets.map((preset) => (
            <button
              type="button"
              key={preset.id}
              onClick={() =>
                handleThemeChange({ ...themeSettings, fontPreset: preset.id })
              }
              className={cn(
                'border-border flex w-full cursor-pointer items-center justify-between rounded-lg border px-3 py-2.5 text-left',
                themeSettings.fontPreset === preset.id && 'border-primary/60',
              )}
            >
              <span>
                <span className="block text-sm font-semibold">
                  {preset.name}
                </span>
                <span className="text-muted-foreground text-xs">
                  {preset.sample}
                </span>
              </span>
              {preset.proOnly ? <Lock className="h-3.5 w-3.5" /> : null}
            </button>
          ))}
        </StyleSection>

        <StyleSection
          title="Appearance"
          description="Corners and gallery"
          icon={SlidersHorizontal}
        >
          {[
            {
              label: 'Corners',
              key: 'radiusPreset' as const,
              values: radiusPresets,
            },
            {
              label: 'Gallery layout',
              key: 'galleryLayout' as const,
              values: galleryLayouts,
            },
          ].map((group) => (
            <div key={group.key}>
              <p className="text-xs font-semibold">{group.label}</p>
              <div className="bg-muted mt-2 grid grid-cols-3 gap-1 rounded-lg p-1">
                {group.values.map((value) => (
                  <button
                    type="button"
                    key={value}
                    onClick={() =>
                      handleThemeChange({
                        ...themeSettings,
                        [group.key]: value,
                      })
                    }
                    className={cn(
                      'cursor-pointer rounded-md px-2 py-2 text-center text-xs font-medium capitalize',
                      themeSettings[group.key] === value
                        ? 'bg-background shadow-sm'
                        : 'text-muted-foreground',
                    )}
                  >
                    {value}
                    {group.key === 'galleryLayout' && value !== 'grid'
                      ? ' · Pro'
                      : ''}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </StyleSection>
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
