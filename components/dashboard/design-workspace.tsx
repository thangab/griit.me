'use client';

import {
  memo,
  useActionState,
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from 'react';
import { createPortal } from 'react-dom';
import {
  ArrowClockwiseIcon as Redo,
  ArrowCounterClockwiseIcon as Undo,
  CaretDownIcon as ChevronDown,
  CheckIcon as Check,
  CircleNotchIcon as LoaderCircle,
  DevicesIcon as MonitorSmartphone,
  FileTextIcon as FileText,
  LayoutIcon as LayoutTemplate,
  LockIcon as Lock,
  PaletteIcon as Palette,
  SlidersHorizontalIcon as SlidersHorizontal,
  TextTIcon as TypeIcon,
  WarningCircleIcon as CircleAlert,
  XIcon as X,
} from '@phosphor-icons/react/ssr';
import type { Icon as PhosphorIcon } from '@phosphor-icons/react';
import {
  ContentEditor,
  type AutosaveStatus,
} from '@/components/dashboard/content-editor';
import { DesignPreview } from '@/components/dashboard/design-preview';
import { ImageUploadField } from '@/components/dashboard/image-upload-field';
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
  avatarShapes,
  blockShadowStyles,
  colorPresets,
  fontPresets,
  galleryLayouts,
  getTemplateThemePreset,
  getThemeRuntime,
  headerGeometries,
  headerLayouts,
  headerTextures,
  resolveThemeSettings,
  type AvatarShape,
  type HeaderGeometry,
  type HeaderLayout,
  type HeaderTexture,
  type ProfileThemeSettings,
} from '@/lib/constants/profile-theme';
import {
  getTemplateWordingOverrides,
  resolveTemplateWording,
  type TemplateWording,
} from '@/lib/constants/template-wording';
import {
  formatGoalDate,
  goalDateDisplays,
  type GoalDateDisplay,
} from '@/lib/utils/goal-date';

const mobilePanels = [
  { id: 'content', label: 'Content', icon: FileText },
  { id: 'preview', label: 'Preview', icon: MonitorSmartphone },
  { id: 'styles', label: 'Styles', icon: Palette },
] as const;

type MobilePanel = (typeof mobilePanels)[number]['id'];
type AutosaveSource = 'content' | 'styles';
type AutosaveState = { status: AutosaveStatus; message?: string };
type StyleSnapshot = {
  templateId: ProfileTemplateId;
  coverUrl: string;
  themeSettings: ProfileThemeSettings;
  wordingOverrides: Partial<TemplateWording>;
};

function areStyleSnapshotsEqual(left: StyleSnapshot, right: StyleSnapshot) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function getStyleChangeKey(previous: StyleSnapshot, next: StyleSnapshot) {
  if (previous.templateId !== next.templateId) return 'template';
  if (previous.coverUrl !== next.coverUrl) return 'cover';

  const wordingKeys = Array.from(
    new Set([
      ...Object.keys(previous.wordingOverrides),
      ...Object.keys(next.wordingOverrides),
    ]),
  ).filter(
    (key) =>
      previous.wordingOverrides[key as keyof TemplateWording] !==
      next.wordingOverrides[key as keyof TemplateWording],
  );
  if (wordingKeys.length > 0) return `wording:${wordingKeys.join(',')}`;

  const themeKeys = Object.keys(next.themeSettings).filter(
    (key) =>
      JSON.stringify(
        previous.themeSettings[key as keyof ProfileThemeSettings],
      ) !==
      JSON.stringify(next.themeSettings[key as keyof ProfileThemeSettings]),
  );

  return `theme:${themeKeys.join(',')}`;
}

const headerGeometryLabels = {
  none: 'None',
  velocity: 'Velocity',
  rings: 'Rings',
  chevrons: 'Arrows',
  blocks: 'Blocks',
} as const;

const headerTextureLabels = {
  none: 'None',
  grid: 'Grid',
  diagonal: 'Diagonal',
  dots: 'Dots',
  scanlines: 'Lines',
} as const;

const headerLayoutDecorationOptions = {
  centered: {
    geometries: ['none', 'velocity', 'rings', 'blocks'],
    textures: ['none', 'grid', 'dots', 'scanlines'],
    defaultGeometry: 'rings',
    defaultTexture: 'dots',
  },
  split: {
    geometries: ['none', 'velocity', 'chevrons', 'blocks'],
    textures: ['none', 'grid', 'diagonal', 'scanlines'],
    defaultGeometry: 'blocks',
    defaultTexture: 'grid',
  },
  left: {
    geometries: ['none', 'velocity', 'rings', 'chevrons'],
    textures: ['none', 'grid', 'dots', 'scanlines'],
    defaultGeometry: 'velocity',
    defaultTexture: 'scanlines',
  },
  immersive: {
    geometries: ['none', 'velocity', 'rings', 'blocks'],
    textures: ['none', 'grid', 'diagonal', 'dots'],
    defaultGeometry: 'velocity',
    defaultTexture: 'diagonal',
  },
  kinetic: {
    geometries: headerGeometries,
    textures: headerTextures,
    defaultGeometry: 'velocity',
    defaultTexture: 'grid',
  },
} satisfies Record<
  HeaderLayout,
  {
    geometries: readonly HeaderGeometry[];
    textures: readonly HeaderTexture[];
    defaultGeometry: HeaderGeometry;
    defaultTexture: HeaderTexture;
  }
>;

const avatarShapeOptions = [
  {
    id: 'circle',
    label: 'Circle',
    shapeClassName: 'h-7 w-7 rounded-full',
  },
  {
    id: 'hexagon',
    label: 'Badge',
    shapeClassName:
      'h-7 w-7 [clip-path:polygon(24%_4%,76%_4%,100%_50%,76%_96%,24%_96%,0_50%)]',
  },
  {
    id: 'diamond',
    label: 'Diamond',
    shapeClassName:
      'h-7 w-7 [clip-path:polygon(50%_0,100%_50%,50%_100%,0_50%)]',
  },
  {
    id: 'shield',
    label: 'Shield',
    shapeClassName:
      'h-7 w-7 [clip-path:polygon(10%_6%,90%_6%,90%_57%,50%_100%,10%_57%)]',
  },
] as const satisfies ReadonlyArray<{
  id: AvatarShape;
  label: string;
  shapeClassName: string;
}>;

const templateWordingFields = [
  {
    key: 'discipline',
    name: 'templateWordingDiscipline',
    label: 'Discipline',
    maxLength: 60,
  },
  {
    key: 'badge',
    name: 'templateWordingBadge',
    label: 'Short badge',
    maxLength: 12,
  },
  {
    key: 'eyebrow',
    name: 'templateWordingEyebrow',
    label: 'Hero tagline',
    maxLength: 120,
  },
  {
    key: 'profileLabel',
    name: 'templateWordingProfileLabel',
    label: 'Profile section',
    maxLength: 80,
  },
  {
    key: 'targetLabel',
    name: 'templateWordingTargetLabel',
    label: 'Target section',
    maxLength: 80,
  },
  {
    key: 'galleryLabel',
    name: 'templateWordingGalleryLabel',
    label: 'Gallery section',
    maxLength: 80,
  },
  {
    key: 'achievementsLabel',
    name: 'templateWordingAchievementsLabel',
    label: 'Achievements section',
    maxLength: 80,
  },
  {
    key: 'activityLabel',
    name: 'templateWordingActivityLabel',
    label: 'Activity section',
    maxLength: 80,
  },
  {
    key: 'secondaryGoalLabel',
    name: 'templateWordingSecondaryGoalLabel',
    label: 'Secondary goals',
    maxLength: 80,
  },
] as const;

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
    description: 'Tags and highlighted actions',
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
] as const;

const initialTemplateState: ProfileBuilderActionState = {
  success: false,
  message: '',
};

function getFormFingerprint(form: HTMLFormElement) {
  return JSON.stringify(
    Array.from(new FormData(form).entries()).map(([key, value]) => [
      key,
      typeof value === 'string'
        ? value
        : `${value.name}:${value.size}:${value.lastModified}`,
    ]),
  );
}

function getAutosaveDelay(target: EventTarget | null) {
  if (target instanceof HTMLInputElement) {
    if (target.type === 'range') return 1200;
    if (['checkbox', 'radio'].includes(target.type)) return 120;
    if (target.type === 'color') return 400;
  }

  if (target instanceof HTMLSelectElement) return 120;
  return 1200;
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
      const savedDateDisplay = getValue(`goalDateDisplay${number}`);
      const dateDisplay = goalDateDisplays.includes(
        savedDateDisplay as GoalDateDisplay,
      )
        ? (savedDateDisplay as GoalDateDisplay)
        : 'date';

      if (!title) {
        return null;
      }

      return {
        id: builder.goals[index]?.id ?? null,
        analyticsKey: builder.goals[index]?.analyticsKey ?? '',
        title,
        description: getValue(`goalDescription${number}`),
        url: getValue(`goalUrl${number}`),
        targetDate,
        targetLabel: formatGoalDate(targetDate, dateDisplay),
        dateDisplay,
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
        analyticsKey: builder.galleryItems[sourceIndex]?.analyticsKey ?? '',
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
      analyticsKey: builder.socialLinks[index]?.analyticsKey ?? '',
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
    'offer',
    'link',
  ];
  const contentBlockOrder = data
    .getAll('contentBlockOrder')
    .map(String)
    .filter(
      (key) =>
        contentBlockTypes.includes(key) ||
        /^media-\d+$/.test(key) ||
        /^offer-\d+$/.test(key) ||
        /^link-\d+$/.test(key),
    );
  const baseBlocks = builder.blocks.filter(
    (block) => !contentBlockTypes.includes(block.type),
  );
  const existingMediaBlocks = builder.blocks.filter(
    (block) => block.type === 'media',
  );
  const existingOfferBlocks = builder.blocks.filter(
    (block) => block.type === 'offer',
  );
  const existingLinkBlocks = builder.blocks.filter(
    (block) => block.type === 'link',
  );
  const blocks = [
    ...baseBlocks,
    ...contentBlockOrder.map((blockKey, index) => {
      if (blockKey.startsWith('media-')) {
        const slot = Number(blockKey.replace('media-', ''));
        const existingBlock = existingMediaBlocks[slot - 1];

        return {
          id: existingBlock?.id ?? null,
          analyticsKey: existingBlock?.analyticsKey ?? '',
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

      if (blockKey.startsWith('offer-')) {
        const slot = Number(blockKey.replace('offer-', ''));
        const existingBlock = existingOfferBlocks[slot - 1];

        return {
          id: existingBlock?.id ?? null,
          analyticsKey: existingBlock?.analyticsKey ?? '',
          type: 'offer',
          title: getValue(`offerTitle${slot}`) || 'Offer',
          content: {
            builderManaged: true,
            url: getValue(`offerUrl${slot}`),
            title: getValue(`offerTitle${slot}`),
            description: getValue(`offerDescription${slot}`),
            imageUrl: getValue(`offerImageUrl${slot}`),
            siteName: getValue(`offerSiteName${slot}`),
            promoCode: getValue(`offerPromoCode${slot}`),
            promoText: getValue(`offerPromoText${slot}`),
            ctaLabel: getValue(`offerCtaLabel${slot}`) || 'View offer',
            displaySize: getValue(`offerDisplaySize${slot}`) || 'medium',
            isAffiliate: data.get(`offerIsAffiliate${slot}`) === 'on',
          },
          sortOrder: index + 2,
          isEnabled: true,
        };
      }

      if (blockKey.startsWith('link-')) {
        const slot = Number(blockKey.replace('link-', ''));
        const existingBlock = existingLinkBlocks[slot - 1];

        return {
          id: existingBlock?.id ?? null,
          analyticsKey: existingBlock?.analyticsKey ?? '',
          type: 'link',
          title: getValue(`linkTitle${slot}`) || 'Link',
          content: {
            builderManaged: true,
            url: getValue(`linkUrl${slot}`),
            title: getValue(`linkTitle${slot}`),
            description: getValue(`linkDescription${slot}`),
            imageUrl: getValue(`linkImageUrl${slot}`),
          },
          sortOrder: index + 2,
          isEnabled: true,
        };
      }

      const type = blockKey;
      const existingBlock = builder.blocks.find((block) => block.type === type);
      const block = existingBlock ?? {
        id: null,
        analyticsKey: '',
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
              ctaLabel:
                getValue('partnershipCtaLabel') || "Let's work together",
            },
          }
        : { ...block, sortOrder: index + 2 };
    }),
  ];
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
        analyticsKey: builder.achievements[sourceIndex]?.analyticsKey ?? '',
        title: title || 'New achievement',
        description: getValue(`achievementDescription${number}`),
        date,
        dateLabel: date ? formatGoalDate(date, 'date') : '',
        sortOrder: index,
        isEnabled: true,
      };
    });
  const activities = Array.from(data.entries())
    .filter(([key]) => /^activityTitle\d+$/.test(key))
    .sort(([left], [right]) => {
      const leftIndex = Number(left.replace('activityTitle', ''));
      const rightIndex = Number(right.replace('activityTitle', ''));
      return leftIndex - rightIndex;
    })
    .map(([key, value], index) => {
      const number = Number(key.replace('activityTitle', ''));
      const sourceIndex = number - 1;
      const title = String(value).trim();
      const date = getValue(`activityDate${number}`);

      return {
        id: builder.activities[sourceIndex]?.id ?? null,
        analyticsKey: builder.activities[sourceIndex]?.analyticsKey ?? '',
        title: title || 'New activity',
        description: getValue(`activityType${number}`),
        date,
        dateLabel: date ? formatGoalDate(date, 'countdown') : '',
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
        analyticsKey: builder.sponsors[sourceIndex]?.analyticsKey ?? '',
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
      location: getValue('location'),
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
    activities,
    socialLinks,
  };
}

function ContentPanel({
  builder,
  subscription,
  onPreviewChange,
  onAutosaveStatusChange,
}: {
  builder: ProfileBuilderState;
  subscription: SubscriptionState;
  onPreviewChange: (form: HTMLFormElement) => void;
  onAutosaveStatusChange: (status: AutosaveStatus, message?: string) => void;
}) {
  return (
    <aside className="border-border bg-background/80 min-h-0 min-w-0 rounded-xl border xl:h-full xl:overflow-y-auto xl:overscroll-contain xl:[contain:size]">
      <div className="p-4 sm:p-5">
        <ContentEditor
          builder={builder}
          subscription={subscription}
          onPreviewChange={onPreviewChange}
          onAutosaveStatusChange={onAutosaveStatusChange}
        />
      </div>
    </aside>
  );
}

const PreviewPanel = memo(function PreviewPanel({
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
});

function StyleSection({
  title,
  description,
  icon: Icon,
  defaultOpen = false,
  className,
  children,
}: {
  title: string;
  description: string;
  icon: PhosphorIcon;
  defaultOpen?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <details
      className={cn(
        'border-border bg-background group overflow-hidden rounded-xl border',
        className,
      )}
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

function AppearanceRange({
  label,
  value,
  onValueChange,
  onCommit,
}: {
  label: string;
  value: number;
  onValueChange: (value: number) => void;
  onCommit: () => void;
}) {
  return (
    <label className="border-border bg-muted/30 flex items-center gap-3 rounded-lg border px-3 py-2.5">
      <span className="min-w-0 flex-1 text-xs font-medium">{label}</span>
      <input
        aria-label={label}
        className="accent-primary w-24 sm:w-28"
        max="100"
        min="0"
        type="range"
        value={value}
        onChange={(event) => onValueChange(Number(event.target.value))}
        onKeyUp={onCommit}
        onPointerUp={onCommit}
      />
      <span className="bg-background text-muted-foreground w-12 rounded-md px-1.5 py-1 text-center font-mono text-[11px]">
        {Math.round(value)}%
      </span>
    </label>
  );
}

function TemplateThumbnail({ templateId }: { templateId: ProfileTemplateId }) {
  const preset = getTemplateThemePreset(templateId);
  const runtime = getThemeRuntime(preset);

  return (
    <span
      className="relative block h-24 overflow-hidden rounded-lg border"
      style={{
        backgroundColor: runtime.palette.background,
        borderColor: runtime.palette.border,
      }}
    >
      <span
        className="absolute inset-x-0 top-0 h-11"
        style={{ backgroundColor: preset.coverColor }}
      />
      <span
        className="absolute top-6 left-1/2 h-7 w-7 -translate-x-1/2 rounded-full border-2"
        style={{
          backgroundColor: runtime.palette.surface,
          borderColor: runtime.palette.accent,
        }}
      />
      <span
        className="absolute top-[58px] left-1/2 h-1.5 w-14 -translate-x-1/2 rounded-full"
        style={{ backgroundColor: runtime.palette.text }}
      />
      <span
        className="absolute top-[70px] left-1/2 h-1 w-20 -translate-x-1/2 rounded-full opacity-50"
        style={{ backgroundColor: runtime.palette.description }}
      />
      <span
        className="absolute right-3 bottom-2 left-3 h-2 rounded-full"
        style={{ backgroundColor: runtime.palette.accent }}
      />
    </span>
  );
}

const headerBackgroundOptions = [
  { id: 'image', label: 'Photo' },
  { id: 'color', label: 'Color' },
  { id: 'gradient', label: 'Gradient' },
] as const;

function HeaderBackgroundControls({
  coverUrl,
  themeSettings,
  onCoverChange,
  onThemeChange,
}: {
  coverUrl: string;
  themeSettings: ProfileThemeSettings;
  onCoverChange: (coverUrl: string) => void;
  onThemeChange: (settings: ProfileThemeSettings) => void;
}) {
  return (
    <div className="border-border bg-muted/20 space-y-3 rounded-lg border p-3">
      <div>
        <p className="text-xs font-semibold">Background</p>
        <p className="text-muted-foreground mt-0.5 text-[11px]">
          Choose what appears behind your profile header.
        </p>
      </div>

      <div
        aria-label="Header background type"
        className="bg-muted grid grid-cols-3 gap-1 rounded-lg p-1"
      >
        {headerBackgroundOptions.map((option) => (
          <button
            aria-pressed={themeSettings.coverType === option.id}
            className={cn(
              'cursor-pointer rounded-md px-2 py-2 text-center text-xs font-medium transition-colors',
              themeSettings.coverType === option.id
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
            key={option.id}
            type="button"
            onClick={() =>
              onThemeChange({
                ...themeSettings,
                coverType: option.id,
                headerSheetCoverage:
                  themeSettings.headerSheetCoverage === 100
                    ? 50
                    : themeSettings.headerSheetCoverage,
              })
            }
          >
            {option.label}
          </button>
        ))}
      </div>

      {themeSettings.coverType !== 'image' ? (
        <input name="coverUrl" type="hidden" value={coverUrl} />
      ) : null}

      {themeSettings.coverType === 'image' ? (
        <ImageUploadField
          folder="covers"
          helpText="This image fills the header behind your profile information."
          label="Header photo"
          name="coverUrl"
          previewShape="wide"
          value={coverUrl}
          onValueChange={onCoverChange}
        />
      ) : null}

      {themeSettings.coverType === 'image' ? (
        <div className="border-border bg-background space-y-3 rounded-lg border p-3">
          <div>
            <p className="text-xs font-semibold">Photo overlay</p>
            <p className="text-muted-foreground mt-0.5 text-[11px]">
              Choose the overlay color and its intensity for readable text.
            </p>
          </div>
          <label className="flex items-center justify-between gap-3">
            <span className="text-xs font-medium">Overlay color</span>
            <span className="border-border bg-background flex items-center gap-2 rounded-md border px-2 py-1.5">
              <input
                aria-label="Photo overlay color"
                className="h-6 w-7 cursor-pointer border-0 bg-transparent p-0"
                type="color"
                value={themeSettings.coverOverlayColor}
                onChange={(event) =>
                  onThemeChange({
                    ...themeSettings,
                    coverOverlayColor: event.target.value,
                  })
                }
              />
              <span className="text-muted-foreground w-16 font-mono text-[11px] uppercase">
                {themeSettings.coverOverlayColor}
              </span>
            </span>
          </label>
          <label className="block">
            <span className="flex items-center justify-between gap-3 text-xs font-medium">
              <span>Overlay intensity</span>
              <span className="bg-muted text-muted-foreground rounded-md px-2 py-1 font-mono text-[11px]">
                {Math.round(themeSettings.coverOverlayOpacity)}%
              </span>
            </span>
            <input
              aria-label="Photo overlay intensity"
              className="accent-primary mt-2 w-full"
              max="100"
              min="0"
              type="range"
              value={themeSettings.coverOverlayOpacity}
              onChange={(event) =>
                onThemeChange({
                  ...themeSettings,
                  coverOverlayOpacity: Number(event.target.value),
                })
              }
            />
          </label>
        </div>
      ) : null}

      {themeSettings.coverType === 'color' ? (
        <label className="border-border bg-background flex items-center justify-between gap-3 rounded-lg border p-3">
          <span className="text-xs font-medium">Background color</span>
          <span className="border-border bg-background flex items-center gap-2 rounded-md border px-2 py-1.5">
            <input
              aria-label="Header background color"
              className="h-6 w-7 cursor-pointer border-0 bg-transparent p-0"
              type="color"
              value={themeSettings.coverColor}
              onChange={(event) =>
                onThemeChange({
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
        <div className="border-border bg-background space-y-2 rounded-lg border p-3">
          {[
            { key: 'coverGradientFrom' as const, label: 'Start color' },
            { key: 'coverGradientTo' as const, label: 'End color' },
          ].map((color) => (
            <label
              className="flex items-center justify-between gap-3"
              key={color.key}
            >
              <span className="text-xs font-medium">{color.label}</span>
              <span className="border-border bg-background flex items-center gap-2 rounded-md border px-2 py-1.5">
                <input
                  aria-label={color.label}
                  className="h-6 w-7 cursor-pointer border-0 bg-transparent p-0"
                  type="color"
                  value={themeSettings[color.key]}
                  onChange={(event) =>
                    onThemeChange({
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
            aria-hidden="true"
            className="h-12 rounded-md"
            style={{
              backgroundImage: `linear-gradient(135deg, ${themeSettings.coverGradientFrom}, ${themeSettings.coverGradientTo})`,
            }}
          />
        </div>
      ) : null}

      <details className="border-border bg-background group/transition overflow-hidden rounded-lg border">
        <summary className="hover:bg-muted/50 flex cursor-pointer list-none items-center justify-between gap-3 p-3 transition-colors [&::-webkit-details-marker]:hidden">
          <span className="min-w-0">
            <span className="block text-xs font-semibold">
              Background transition
            </span>
            <span className="text-muted-foreground mt-0.5 block text-[11px]">
              Transition color covers {themeSettings.headerSheetCoverage}% of
              the header
            </span>
          </span>
          <ChevronDown className="text-muted-foreground h-4 w-4 shrink-0 transition-transform group-open/transition:rotate-180" />
        </summary>
        <div className="border-border space-y-3 border-t p-3">
          <p className="text-muted-foreground text-[11px] leading-4">
            This is separate from photo darkness. It controls the color at the
            bottom of the header.
          </p>
          <label className="block">
            <span className="flex items-center justify-between gap-3 text-xs font-medium">
              <span>Color coverage</span>
              <span className="bg-muted text-muted-foreground rounded-md px-2 py-1 font-mono text-[11px]">
                {Math.round(themeSettings.headerSheetCoverage)}%
              </span>
            </span>
            <input
              aria-label="Header transition color coverage"
              className="accent-primary mt-2 w-full"
              max="100"
              min="0"
              type="range"
              value={themeSettings.headerSheetCoverage}
              onChange={(event) =>
                onThemeChange({
                  ...themeSettings,
                  headerSheetCoverage: Number(event.target.value),
                })
              }
            />
            <span className="text-muted-foreground mt-1 flex justify-between text-[10px]">
              <span>None</span>
              <span>Half</span>
              <span>Full</span>
            </span>
          </label>
          <label className="flex items-center justify-between gap-3">
            <span className="text-xs font-medium">Transition color</span>
            <span className="border-border bg-background flex items-center gap-2 rounded-md border px-2 py-1.5">
              <input
                aria-label="Header content background color"
                className="h-6 w-7 cursor-pointer border-0 bg-transparent p-0"
                type="color"
                value={themeSettings.headerSheetColor}
                onChange={(event) =>
                  onThemeChange({
                    ...themeSettings,
                    headerSheetColor: event.target.value,
                  })
                }
              />
              <span className="text-muted-foreground w-16 font-mono text-[11px] uppercase">
                {themeSettings.headerSheetColor}
              </span>
            </span>
          </label>
        </div>
      </details>
    </div>
  );
}

function TemplateSelector({
  profileId,
  subscription,
  selectedTemplateId,
  coverUrl,
  themeSettings,
  templateWording,
  templateWordingOverrides,
  onTemplateSelect,
  onCoverChange,
  onThemeChange,
  onTemplateWordingChange,
  onAutosaveStatusChange,
  canUndo,
  canRedo,
  historyActionToken,
  onUndo,
  onRedo,
}: {
  profileId: number;
  subscription: SubscriptionState;
  selectedTemplateId: ProfileTemplateId;
  coverUrl: string;
  themeSettings: ProfileThemeSettings;
  templateWording: TemplateWording;
  templateWordingOverrides: Partial<TemplateWording>;
  onTemplateSelect: (templateId: ProfileTemplateId) => void;
  onCoverChange: (coverUrl: string) => void;
  onThemeChange: (settings: ProfileThemeSettings) => void;
  onTemplateWordingChange: (key: keyof TemplateWording, value: string) => void;
  onAutosaveStatusChange: (status: AutosaveStatus, message?: string) => void;
  canUndo: boolean;
  canRedo: boolean;
  historyActionToken: number;
  onUndo: () => void;
  onRedo: () => void;
}) {
  const [state, formAction, pending] = useActionState(
    updateProfileTemplateAction,
    initialTemplateState,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const autosaveTimerRef = useRef<number | null>(null);
  const pendingRef = useRef(pending);
  const dirtyRef = useRef(false);
  const lastSavedFingerprintRef = useRef('');
  const inFlightFingerprintRef = useRef<string | null>(null);
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  const selectedTemplate =
    profileTemplates.find((template) => template.id === selectedTemplateId) ??
    profileTemplates[0];
  const headerDecorationOptions =
    headerLayoutDecorationOptions[themeSettings.headerLayout];

  const submitWhenReady = () => {
    if (pendingRef.current) {
      autosaveTimerRef.current = window.setTimeout(submitWhenReady, 250);
      return;
    }

    if (!dirtyRef.current) return;

    const form = formRef.current;
    if (!form) return;

    const fingerprint = getFormFingerprint(form);
    if (fingerprint === lastSavedFingerprintRef.current) {
      dirtyRef.current = false;
      onAutosaveStatusChange('saved');
      return;
    }

    dirtyRef.current = false;
    inFlightFingerprintRef.current = fingerprint;
    form.requestSubmit();
  };
  const scheduleAutosave = (delay = 1200) => {
    if (autosaveTimerRef.current) {
      window.clearTimeout(autosaveTimerRef.current);
    }

    dirtyRef.current = true;
    onAutosaveStatusChange('waiting');
    autosaveTimerRef.current = window.setTimeout(submitWhenReady, delay);
  };
  const scheduleAutosaveRef = useRef(scheduleAutosave);
  const previousHistoryActionTokenRef = useRef(historyActionToken);

  useEffect(() => {
    scheduleAutosaveRef.current = scheduleAutosave;
  });

  useEffect(() => {
    if (previousHistoryActionTokenRef.current === historyActionToken) return;

    previousHistoryActionTokenRef.current = historyActionToken;
    scheduleAutosaveRef.current(120);
  }, [historyActionToken]);

  useEffect(() => {
    if (formRef.current) {
      lastSavedFingerprintRef.current = getFormFingerprint(formRef.current);
    }
  }, []);

  useEffect(
    () => () => {
      if (autosaveTimerRef.current) {
        window.clearTimeout(autosaveTimerRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    pendingRef.current = pending;
  }, [pending]);

  useEffect(() => {
    if (pending) onAutosaveStatusChange('saving');
  }, [onAutosaveStatusChange, pending]);

  useEffect(() => {
    if (pending || !state.message) return;

    if (state.success && inFlightFingerprintRef.current) {
      lastSavedFingerprintRef.current = inFlightFingerprintRef.current;
    }
    inFlightFingerprintRef.current = null;

    if (dirtyRef.current) {
      onAutosaveStatusChange('waiting');
      return;
    }

    onAutosaveStatusChange(state.success ? 'saved' : 'error', state.message);
  }, [onAutosaveStatusChange, pending, state]);

  const handleTemplateSelect = (templateId: ProfileTemplateId) => {
    onThemeChange(getTemplateThemePreset(templateId));
    onTemplateSelect(templateId);
    scheduleAutosave(120);
    setShowTemplatePicker(false);
  };
  const handleCoverChange = (coverUrl: string) => {
    onCoverChange(coverUrl);
    scheduleAutosave(120);
  };
  const handleThemeChange = (
    settings: ProfileThemeSettings,
    delay: number | null = 120,
  ) => {
    onThemeChange(settings);
    if (delay !== null) scheduleAutosave(delay);
  };
  const handleTemplateWordingChange = (
    key: keyof TemplateWording,
    value: string,
  ) => {
    onTemplateWordingChange(key, value);
    scheduleAutosave(1200);
  };

  return (
    <form
      action={formAction}
      className="space-y-4"
      ref={formRef}
      onChange={(event) => scheduleAutosave(getAutosaveDelay(event.target))}
    >
      <input name="profileId" type="hidden" value={profileId} />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-muted-foreground text-xs tracking-[0.24em] uppercase">
            Styles
          </p>
          <p className="mt-2 font-semibold">Visual settings</p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            aria-label="Undo style change"
            className="border-border text-muted-foreground hover:bg-muted hover:text-foreground flex h-8 w-8 items-center justify-center rounded-md border transition-colors disabled:cursor-not-allowed disabled:opacity-40"
            disabled={!canUndo}
            title="Undo"
            type="button"
            onClick={onUndo}
          >
            <Undo className="h-4 w-4" />
          </button>
          <button
            aria-label="Redo style change"
            className="border-border text-muted-foreground hover:bg-muted hover:text-foreground flex h-8 w-8 items-center justify-center rounded-md border transition-colors disabled:cursor-not-allowed disabled:opacity-40"
            disabled={!canRedo}
            title="Redo"
            type="button"
            onClick={onRedo}
          >
            <Redo className="h-4 w-4" />
          </button>
        </div>
      </div>

      <input name="templateId" type="hidden" value={selectedTemplateId} />
      <input
        name="colorPreset"
        type="hidden"
        value={themeSettings.colorPreset}
      />
      <input name="fontPreset" type="hidden" value={themeSettings.fontPreset} />
      <input
        name="coverOverlayColor"
        type="hidden"
        value={themeSettings.coverOverlayColor}
      />
      <input
        name="coverOverlayOpacity"
        type="hidden"
        value={themeSettings.coverOverlayOpacity}
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
        name="customHeaderMutedText"
        type="hidden"
        value={themeSettings.customColors.headerMutedText}
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
      <input
        name="headerLayout"
        type="hidden"
        value={themeSettings.headerLayout}
      />
      <input
        name="headerAvatarSize"
        type="hidden"
        value={themeSettings.headerAvatarSize}
      />
      <input
        name="headerAvatarShape"
        type="hidden"
        value={themeSettings.headerAvatarShape}
      />
      <input
        name="headerSheetColor"
        type="hidden"
        value={themeSettings.headerSheetColor}
      />
      <input
        name="headerSheetCoverage"
        type="hidden"
        value={themeSettings.headerSheetCoverage}
      />
      <input
        name="headerGeometry"
        type="hidden"
        value={themeSettings.headerGeometry}
      />
      <input
        name="headerTexture"
        type="hidden"
        value={themeSettings.headerTexture}
      />
      <input
        name="blockCorner"
        type="hidden"
        value={themeSettings.blockCorner}
      />
      <input
        name="blockBorder"
        type="hidden"
        value={themeSettings.blockBorder}
      />
      <input
        name="blockBorderColor"
        type="hidden"
        value={themeSettings.blockBorderColor}
      />
      <input
        name="blockShadow"
        type="hidden"
        value={themeSettings.blockShadow}
      />
      <input
        name="blockShadowStyle"
        type="hidden"
        value={themeSettings.blockShadowStyle}
      />
      <input
        name="blockSpacing"
        type="hidden"
        value={themeSettings.blockSpacing}
      />
      <input
        name="templateWordingOverrideKeys"
        type="hidden"
        value={Object.keys(templateWordingOverrides).join(',')}
      />

      <div className="flex flex-col gap-3">
        <StyleSection
          title="Template"
          description="Apply a complete visual direction"
          icon={LayoutTemplate}
          defaultOpen
        >
          <p className="text-muted-foreground text-xs leading-5">
            Selecting a template replaces the current visual settings. Your
            content and customized wording stay in place.
          </p>
          <button
            className="border-primary/30 bg-muted/20 hover:border-primary/60 grid w-full grid-cols-[92px_minmax(0,1fr)] items-center gap-3 rounded-xl border p-2 text-left transition-colors"
            type="button"
            onClick={() => setShowTemplatePicker(true)}
          >
            <TemplateThumbnail templateId={selectedTemplateId} />
            <span className="min-w-0 py-1">
              <span className="flex items-center gap-2 text-sm font-semibold">
                <span className="truncate">{selectedTemplate.name}</span>
                <Check className="text-primary h-3.5 w-3.5 shrink-0" />
              </span>
              <span className="text-muted-foreground mt-1 line-clamp-2 text-xs leading-5">
                {selectedTemplate.description}
              </span>
              <span className="text-primary mt-2 block text-xs font-semibold">
                Change template
              </span>
            </span>
          </button>

          <details className="border-primary/20 bg-muted/30 group overflow-hidden rounded-lg border">
            <summary className="hover:bg-muted/60 flex cursor-pointer list-none items-center gap-3 p-3 transition-colors [&::-webkit-details-marker]:hidden">
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-semibold">
                  Template wording
                </span>
                <span className="text-muted-foreground mt-0.5 block text-[11px]">
                  Customize every visible label
                </span>
              </span>
              <ChevronDown className="text-muted-foreground h-4 w-4 shrink-0 transition-transform group-open:rotate-180" />
            </summary>
            <div className="border-primary/20 space-y-3 border-t p-3">
              {templateWordingFields.map((field) => (
                <label key={field.key} className="block space-y-1.5">
                  <span className="text-xs font-medium">{field.label}</span>
                  <input
                    className="border-border bg-background focus:border-primary h-10 w-full rounded-md border px-3 text-sm transition outline-none"
                    maxLength={field.maxLength}
                    name={field.name}
                    value={templateWording[field.key]}
                    onChange={(event) =>
                      handleTemplateWordingChange(field.key, event.target.value)
                    }
                  />
                </label>
              ))}
            </div>
          </details>
        </StyleSection>

        {showTemplatePicker && typeof document !== 'undefined'
          ? createPortal(
              <div className="fixed inset-0 z-[70]">
                <button
                  aria-label="Close template gallery"
                  className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px]"
                  type="button"
                  onClick={() => setShowTemplatePicker(false)}
                />
                <aside className="border-border bg-background absolute inset-y-0 right-0 w-full max-w-2xl overflow-y-auto border-l shadow-2xl">
                  <div className="bg-background/95 sticky top-0 z-10 flex items-start justify-between gap-4 border-b p-5 backdrop-blur">
                    <div>
                      <p className="text-lg font-semibold">Choose a template</p>
                      <p className="text-muted-foreground mt-1 text-sm">
                        Your content and customized wording stay in place.
                      </p>
                    </div>
                    <button
                      aria-label="Close"
                      className="text-muted-foreground hover:bg-muted flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                      type="button"
                      onClick={() => setShowTemplatePicker(false)}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 p-4 sm:p-5">
                    {profileTemplates.map((template) => {
                      const isLocked =
                        template.proOnly && !subscription.isActive;
                      const isSelected = selectedTemplateId === template.id;

                      return (
                        <button
                          key={template.id}
                          aria-pressed={isSelected}
                          className={cn(
                            'border-border bg-card hover:border-primary/50 relative min-w-0 rounded-xl border p-2 text-left transition-all hover:-translate-y-0.5 hover:shadow-md',
                            isSelected &&
                              'border-primary ring-primary/15 ring-2',
                          )}
                          type="button"
                          onClick={() => handleTemplateSelect(template.id)}
                        >
                          <TemplateThumbnail templateId={template.id} />
                          {isSelected ? (
                            <span className="bg-primary text-primary-foreground absolute top-4 right-4 flex h-6 w-6 items-center justify-center rounded-full shadow-sm">
                              <Check className="h-3.5 w-3.5" />
                            </span>
                          ) : null}
                          <span className="mt-2 flex min-w-0 items-center gap-2 px-1">
                            <span className="truncate text-xs font-semibold sm:text-sm">
                              {template.name}
                            </span>
                            {template.proOnly ? (
                              <span className="bg-primary/10 text-primary rounded-full px-1.5 py-0.5 text-[9px] font-bold">
                                Pro
                              </span>
                            ) : null}
                            {isLocked ? (
                              <Lock className="h-3 w-3 shrink-0" />
                            ) : null}
                          </span>
                          <span className="text-muted-foreground mt-1 line-clamp-2 px-1 text-[10px] leading-4 sm:text-xs">
                            {template.description}
                            {isLocked ? ' Preview only on Free.' : ''}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </aside>
              </div>,
              document.body,
            )
          : null}

        <StyleSection
          title="Header"
          description="Layout, background and profile picture"
          icon={LayoutTemplate}
          className="order-first"
          defaultOpen
        >
          <div>
            <p className="text-xs font-semibold">Layout</p>
            <p className="text-muted-foreground mt-0.5 text-[11px]">
              Choose how your identity is arranged.
            </p>
          </div>
          <div className="grid grid-cols-5 gap-1.5">
            {headerLayouts.map((layout, index) => (
              <button
                key={layout}
                aria-label={`Header layout ${index + 1}`}
                className={cn(
                  'border-border flex h-16 items-center justify-center rounded-lg border transition-colors',
                  themeSettings.headerLayout === layout
                    ? 'border-primary/50 bg-primary/10 text-primary'
                    : 'bg-background text-muted-foreground hover:bg-muted/40',
                )}
                type="button"
                onClick={() => {
                  const options = headerLayoutDecorationOptions[layout];
                  handleThemeChange({
                    ...themeSettings,
                    headerLayout: layout,
                    headerGeometry: (
                      options.geometries as readonly HeaderGeometry[]
                    ).includes(themeSettings.headerGeometry)
                      ? themeSettings.headerGeometry
                      : options.defaultGeometry,
                    headerTexture: (
                      options.textures as readonly HeaderTexture[]
                    ).includes(themeSettings.headerTexture)
                      ? themeSettings.headerTexture
                      : options.defaultTexture,
                  });
                }}
              >
                <span className="relative block h-11 w-9 shrink-0 overflow-hidden rounded border-2 border-current">
                  {layout === 'centered' ? (
                    <>
                      <span className="absolute -top-1 -left-2 h-5 w-6 rotate-12 bg-current opacity-35" />
                      <span className="absolute top-2.5 left-1/2 h-1 w-5 -translate-x-1/2 rounded bg-current" />
                      <span className="absolute bottom-2 left-1/2 h-px w-6 -translate-x-1/2 bg-current" />
                    </>
                  ) : layout === 'split' ? (
                    <>
                      <span className="absolute top-1 right-1 left-1 h-2 rounded-sm border border-current" />
                      <span className="absolute inset-x-0 top-4 border-t border-dashed border-current" />
                      <span className="absolute top-5 left-1 h-2 w-2 rounded-full border border-current" />
                      <span className="absolute right-1 bottom-2 left-1 h-px bg-current" />
                    </>
                  ) : layout === 'left' ? (
                    <>
                      <span className="absolute inset-y-1 left-1 w-0.5 bg-current" />
                      <span className="absolute top-2 right-1 h-1 w-5 bg-current" />
                      <span className="absolute top-5 right-1 h-px w-4 bg-current" />
                      <span className="absolute right-1 bottom-2 h-px w-5 bg-current" />
                    </>
                  ) : layout === 'kinetic' ? (
                    <>
                      <span className="absolute inset-0 bg-[linear-gradient(currentColor_1px,transparent_1px),linear-gradient(90deg,currentColor_1px,transparent_1px)] bg-[size:7px_7px] opacity-20" />
                      <span className="absolute -top-2 -right-2 h-7 w-5 rotate-12 bg-current opacity-40 [clip-path:polygon(25%_0,100%_0,75%_100%,0_100%)]" />
                      <span className="absolute top-3 left-1 h-2 w-2 rounded-full border border-current" />
                      <span className="absolute right-1 bottom-2 left-1 h-1 bg-current" />
                    </>
                  ) : (
                    <>
                      <span className="absolute inset-0 bg-current opacity-10" />
                      <span className="absolute -top-1 -right-2 h-7 w-7 -rotate-12 bg-current opacity-40" />
                      <span className="absolute bottom-3 left-1 h-1 w-6 bg-current" />
                      <span className="absolute right-1 bottom-1.5 left-1 h-px bg-current" />
                    </>
                  )}
                </span>
              </button>
            ))}
          </div>

          <HeaderBackgroundControls
            coverUrl={coverUrl}
            themeSettings={themeSettings}
            onCoverChange={handleCoverChange}
            onThemeChange={handleThemeChange}
          />

          <details className="border-border bg-muted/20 group/effects overflow-hidden rounded-lg border">
            <summary className="hover:bg-muted/50 flex cursor-pointer list-none items-center justify-between gap-3 p-3 transition-colors [&::-webkit-details-marker]:hidden">
              <span className="min-w-0">
                <span className="block text-xs font-semibold">Decorations</span>
                <span className="text-muted-foreground mt-0.5 block text-[11px]">
                  Optional shapes and textures
                </span>
              </span>
              <ChevronDown className="text-muted-foreground h-4 w-4 shrink-0 transition-transform group-open/effects:rotate-180" />
            </summary>

            <div className="border-border space-y-4 border-t p-3">
              <div>
                <p className="text-xs font-semibold">Geometry</p>
                <p className="text-muted-foreground mt-0.5 text-[11px]">
                  Choose a graphic shape or keep it clean.
                </p>
                <div
                  className={cn(
                    'mt-2 grid gap-1.5',
                    headerDecorationOptions.geometries.length === 5
                      ? 'grid-cols-5'
                      : 'grid-cols-4',
                  )}
                >
                  {headerDecorationOptions.geometries.map((geometry) => {
                    const isSelected =
                      themeSettings.headerGeometry === geometry;
                    return (
                      <button
                        aria-label={`${headerGeometryLabels[geometry]} geometry`}
                        aria-pressed={isSelected}
                        className={cn(
                          'flex min-w-0 flex-col items-center gap-1.5 rounded-md border px-1 py-2 transition-colors',
                          isSelected
                            ? 'border-primary/50 bg-primary/10 text-primary'
                            : 'border-border bg-background text-muted-foreground hover:bg-muted/60',
                        )}
                        key={geometry}
                        type="button"
                        onClick={() =>
                          handleThemeChange({
                            ...themeSettings,
                            headerGeometry: geometry,
                          })
                        }
                      >
                        <span className="relative flex h-6 w-8 items-center justify-center overflow-hidden">
                          {geometry === 'none' ? (
                            <span className="h-px w-5 bg-current opacity-50" />
                          ) : geometry === 'velocity' ? (
                            <span className="h-5 w-4 rotate-12 bg-current opacity-60 [clip-path:polygon(25%_0,100%_0,75%_100%,0_100%)]" />
                          ) : geometry === 'rings' ? (
                            <span className="h-5 w-5 rounded-full border-2 border-current" />
                          ) : geometry === 'chevrons' ? (
                            <span className="text-xl leading-none font-light">
                              »
                            </span>
                          ) : (
                            <span className="grid grid-cols-2 gap-0.5">
                              <span className="h-2 w-2 bg-current" />
                              <span className="h-2 w-2 bg-current opacity-45" />
                              <span className="h-2 w-2 bg-current opacity-45" />
                              <span className="h-2 w-2 bg-current" />
                            </span>
                          )}
                        </span>
                        <span className="max-w-full truncate text-[8px] font-semibold">
                          {headerGeometryLabels[geometry]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold">Texture</p>
                <p className="text-muted-foreground mt-0.5 text-[11px]">
                  Add depth behind the profile content.
                </p>
                <div
                  className={cn(
                    'mt-2 grid gap-1.5',
                    headerDecorationOptions.textures.length === 5
                      ? 'grid-cols-5'
                      : 'grid-cols-4',
                  )}
                >
                  {headerDecorationOptions.textures.map((texture) => {
                    const isSelected = themeSettings.headerTexture === texture;
                    return (
                      <button
                        aria-label={`${headerTextureLabels[texture]} texture`}
                        aria-pressed={isSelected}
                        className={cn(
                          'flex min-w-0 flex-col items-center gap-1.5 rounded-md border px-1 py-2 transition-colors',
                          isSelected
                            ? 'border-primary/50 bg-primary/10 text-primary'
                            : 'border-border bg-background text-muted-foreground hover:bg-muted/60',
                        )}
                        key={texture}
                        type="button"
                        onClick={() =>
                          handleThemeChange({
                            ...themeSettings,
                            headerTexture: texture,
                          })
                        }
                      >
                        <span
                          className={cn(
                            'block h-6 w-8 rounded-sm border border-current/30',
                            texture === 'none' && 'border-dashed opacity-40',
                            texture === 'grid' &&
                              'bg-[linear-gradient(currentColor_1px,transparent_1px),linear-gradient(90deg,currentColor_1px,transparent_1px)] bg-[size:5px_5px]',
                            texture === 'diagonal' &&
                              'bg-[repeating-linear-gradient(135deg,transparent_0_4px,currentColor_4px_5px)]',
                            texture === 'dots' &&
                              'bg-[radial-gradient(currentColor_1px,transparent_1px)] bg-[size:5px_5px]',
                            texture === 'scanlines' &&
                              'bg-[repeating-linear-gradient(to_bottom,transparent_0_3px,currentColor_3px_4px)]',
                          )}
                        />
                        <span className="max-w-full truncate text-[8px] font-semibold">
                          {headerTextureLabels[texture]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </details>

          <div className="border-border bg-muted/30 rounded-lg border p-3">
            <p className="text-xs font-medium">Profile picture shape</p>
            <div className="mt-3 grid grid-cols-4 gap-1.5">
              {avatarShapes.map((shape) => {
                const option = avatarShapeOptions.find(
                  (item) => item.id === shape,
                )!;
                const isSelected = themeSettings.headerAvatarShape === shape;

                return (
                  <button
                    key={shape}
                    aria-label={`${option.label} profile picture`}
                    aria-pressed={isSelected}
                    className={cn(
                      'flex min-w-0 flex-col items-center gap-2 rounded-lg border px-1 py-2.5 transition-colors',
                      isSelected
                        ? 'border-primary/50 bg-primary/10 text-primary'
                        : 'border-border bg-background text-muted-foreground hover:bg-muted/60',
                    )}
                    title={option.label}
                    type="button"
                    onClick={() =>
                      handleThemeChange({
                        ...themeSettings,
                        headerAvatarShape: shape,
                      })
                    }
                  >
                    <span
                      className={cn(
                        'block shrink-0 border-2 border-current bg-current/15',
                        option.shapeClassName,
                      )}
                    />
                    <span className="max-w-full truncate text-[9px] font-semibold">
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <label className="border-border bg-muted/30 block rounded-lg border p-3">
            <span className="flex items-center justify-between gap-3 text-xs font-medium">
              <span>Profile picture size</span>
              <span className="text-muted-foreground font-mono">
                {themeSettings.headerAvatarSize}px
              </span>
            </span>
            <input
              aria-label="Profile picture size"
              className="accent-primary mt-3 w-full"
              max="144"
              min="56"
              step="4"
              type="range"
              value={themeSettings.headerAvatarSize}
              onChange={(event) =>
                handleThemeChange(
                  {
                    ...themeSettings,
                    headerAvatarSize: Number(event.target.value),
                  },
                  null,
                )
              }
              onKeyUp={() => scheduleAutosave(120)}
              onPointerUp={() => scheduleAutosave(120)}
            />
          </label>
        </StyleSection>

        <StyleSection
          title="Colors"
          description="Organized by profile element"
          icon={Palette}
        >
          <div className="flex flex-col gap-2">
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

            <div className="border-border order-first rounded-lg border p-3">
              <div className="mb-2.5">
                <p className="text-xs font-semibold">Header</p>
                <p className="text-muted-foreground mt-0.5 text-[11px]">
                  Independent from the text colors used on the rest of the page
                </p>
              </div>
              <div className="space-y-1.5">
                <label className="bg-muted/45 flex items-center justify-between gap-3 rounded-md px-2.5 py-2">
                  <span className="text-xs font-medium">Text</span>
                  <span className="border-border bg-background flex items-center gap-2 rounded-md border px-2 py-1">
                    <input
                      aria-label="Header text color"
                      className="h-6 w-7 cursor-pointer border-0 bg-transparent p-0"
                      type="color"
                      value={themeSettings.customColors.headerText}
                      onChange={(event) =>
                        handleThemeChange({
                          ...themeSettings,
                          colorPreset: 'custom',
                          customColors: {
                            ...themeSettings.customColors,
                            headerText: event.target.value,
                          },
                        })
                      }
                    />
                    <span className="text-muted-foreground w-16 font-mono text-[11px] uppercase">
                      {themeSettings.customColors.headerText}
                    </span>
                  </span>
                </label>
                <label className="bg-muted/45 flex items-center justify-between gap-3 rounded-md px-2.5 py-2">
                  <span className="text-xs font-medium">Secondary text</span>
                  <span className="border-border bg-background flex items-center gap-2 rounded-md border px-2 py-1">
                    <input
                      aria-label="Header secondary text color"
                      className="h-6 w-7 cursor-pointer border-0 bg-transparent p-0"
                      type="color"
                      value={themeSettings.customColors.headerMutedText}
                      onChange={(event) =>
                        handleThemeChange({
                          ...themeSettings,
                          colorPreset: 'custom',
                          customColors: {
                            ...themeSettings.customColors,
                            headerMutedText: event.target.value,
                          },
                        })
                      }
                    />
                    <span className="text-muted-foreground w-16 font-mono text-[11px] uppercase">
                      {themeSettings.customColors.headerMutedText}
                    </span>
                  </span>
                </label>
              </div>
            </div>
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
                        headerMutedText: preset.colors[7],
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
          description="Shape, depth and spacing"
          icon={SlidersHorizontal}
        >
          <AppearanceRange
            label="Block corner"
            value={themeSettings.blockCorner}
            onValueChange={(blockCorner) =>
              handleThemeChange({ ...themeSettings, blockCorner }, null)
            }
            onCommit={() => scheduleAutosave(120)}
          />
          <AppearanceRange
            label="Block border"
            value={themeSettings.blockBorder}
            onValueChange={(blockBorder) =>
              handleThemeChange({ ...themeSettings, blockBorder }, null)
            }
            onCommit={() => scheduleAutosave(120)}
          />
          <label className="border-border bg-muted/30 flex items-center justify-between gap-3 rounded-lg border px-3 py-2.5">
            <span className="text-xs font-medium">Block border color</span>
            <span className="border-border bg-background flex items-center gap-2 rounded-md border px-2 py-1">
              <input
                aria-label="Block border color"
                className="h-6 w-7 cursor-pointer border-0 bg-transparent p-0"
                type="color"
                value={themeSettings.blockBorderColor}
                onChange={(event) =>
                  handleThemeChange({
                    ...themeSettings,
                    blockBorderColor: event.target.value,
                  })
                }
              />
              <span className="text-muted-foreground w-16 font-mono text-[11px] uppercase">
                {themeSettings.blockBorderColor}
              </span>
            </span>
          </label>
          <AppearanceRange
            label="Block shadow"
            value={themeSettings.blockShadow}
            onValueChange={(blockShadow) =>
              handleThemeChange({ ...themeSettings, blockShadow }, null)
            }
            onCommit={() => scheduleAutosave(120)}
          />
          {themeSettings.blockShadow > 0 ? (
            <div className="border-border grid grid-cols-2 overflow-hidden rounded-lg border">
              {blockShadowStyles.map((blockShadowStyle) => (
                <button
                  key={blockShadowStyle}
                  className={cn(
                    'border-border h-10 border-r text-xs font-medium capitalize last:border-r-0',
                    themeSettings.blockShadowStyle === blockShadowStyle
                      ? 'bg-primary/10 text-primary'
                      : 'bg-background text-muted-foreground hover:bg-muted/40',
                  )}
                  type="button"
                  onClick={() =>
                    handleThemeChange({ ...themeSettings, blockShadowStyle })
                  }
                >
                  {blockShadowStyle} shadow
                </button>
              ))}
            </div>
          ) : null}
          <AppearanceRange
            label="Block spacing"
            value={themeSettings.blockSpacing}
            onValueChange={(blockSpacing) =>
              handleThemeChange({ ...themeSettings, blockSpacing }, null)
            }
            onCommit={() => scheduleAutosave(120)}
          />

          <div className="border-border border-t pt-3">
            <p className="text-xs font-semibold">Gallery layout</p>
            <div className="bg-muted mt-2 grid grid-cols-3 gap-1 rounded-lg p-1">
              {galleryLayouts.map((galleryLayout) => (
                <button
                  key={galleryLayout}
                  className={cn(
                    'cursor-pointer rounded-md px-2 py-2 text-center text-xs font-medium capitalize',
                    themeSettings.galleryLayout === galleryLayout
                      ? 'bg-background shadow-sm'
                      : 'text-muted-foreground',
                  )}
                  type="button"
                  onClick={() =>
                    handleThemeChange({ ...themeSettings, galleryLayout })
                  }
                >
                  {galleryLayout}
                  {galleryLayout !== 'grid' ? ' · Pro' : ''}
                </button>
              ))}
            </div>
          </div>
        </StyleSection>
      </div>
    </form>
  );
}

function StylesPanel({
  profileId,
  subscription,
  selectedTemplateId,
  coverUrl,
  themeSettings,
  templateWording,
  templateWordingOverrides,
  onTemplateSelect,
  onCoverChange,
  onThemeChange,
  onTemplateWordingChange,
  onAutosaveStatusChange,
  canUndo,
  canRedo,
  historyActionToken,
  onUndo,
  onRedo,
}: {
  profileId: number;
  subscription: SubscriptionState;
  selectedTemplateId: ProfileTemplateId;
  coverUrl: string;
  themeSettings: ProfileThemeSettings;
  templateWording: TemplateWording;
  templateWordingOverrides: Partial<TemplateWording>;
  onTemplateSelect: (templateId: ProfileTemplateId) => void;
  onCoverChange: (coverUrl: string) => void;
  onThemeChange: (settings: ProfileThemeSettings) => void;
  onTemplateWordingChange: (key: keyof TemplateWording, value: string) => void;
  onAutosaveStatusChange: (status: AutosaveStatus, message?: string) => void;
  canUndo: boolean;
  canRedo: boolean;
  historyActionToken: number;
  onUndo: () => void;
  onRedo: () => void;
}) {
  return (
    <aside className="border-border bg-background/80 min-h-0 min-w-0 space-y-5 rounded-xl border p-4 sm:p-5 xl:h-full xl:overflow-y-auto xl:overscroll-contain xl:[contain:size]">
      <TemplateSelector
        profileId={profileId}
        subscription={subscription}
        selectedTemplateId={selectedTemplateId}
        coverUrl={coverUrl}
        themeSettings={themeSettings}
        templateWording={templateWording}
        templateWordingOverrides={templateWordingOverrides}
        onTemplateSelect={onTemplateSelect}
        onCoverChange={onCoverChange}
        onThemeChange={onThemeChange}
        onTemplateWordingChange={onTemplateWordingChange}
        onAutosaveStatusChange={onAutosaveStatusChange}
        canUndo={canUndo}
        canRedo={canRedo}
        historyActionToken={historyActionToken}
        onUndo={onUndo}
        onRedo={onRedo}
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
    <div className="border-border bg-background/95 sticky top-0 z-30 -mx-4 mb-4 border-b px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 xl:hidden">
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

function AutosaveIndicator({
  states,
}: {
  states: Record<AutosaveSource, AutosaveState>;
}) {
  const values = Object.values(states);
  const error = values.find((state) => state.status === 'error');
  const status: AutosaveStatus = values.some(
    (state) => state.status === 'saving',
  )
    ? 'saving'
    : values.some((state) => state.status === 'waiting')
      ? 'waiting'
      : error
        ? 'error'
        : values.some((state) => state.status === 'saved')
          ? 'saved'
          : 'idle';

  if (status === 'idle') return null;

  return (
    <div
      aria-live="polite"
      className={cn(
        'bg-background fixed right-4 bottom-4 z-50 flex max-w-[calc(100vw-2rem)] items-center gap-2 rounded-full border px-3 py-2 text-xs font-medium shadow-lg',
        status === 'error'
          ? 'border-red-200 text-red-700'
          : 'border-border text-muted-foreground',
      )}
    >
      {status === 'saving' || status === 'waiting' ? (
        <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
      ) : status === 'error' ? (
        <CircleAlert className="h-3.5 w-3.5" />
      ) : (
        <Check className="h-3.5 w-3.5 text-emerald-600" />
      )}
      <span className="truncate">
        {status === 'waiting'
          ? 'Unsaved changes…'
          : status === 'saving'
            ? 'Saving…'
            : status === 'error'
              ? error?.message || 'Save failed. Edit to retry.'
              : 'Saved'}
      </span>
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
  const [autosaveStates, setAutosaveStates] = useState<
    Record<AutosaveSource, AutosaveState>
  >({
    content: { status: 'idle' },
    styles: { status: 'idle' },
  });
  const [draftBuilder, setDraftBuilder] =
    useState<ProfileBuilderState>(builder);
  const [selectedTemplateId, setSelectedTemplateId] =
    useState<ProfileTemplateId>(() =>
      resolveProfileTemplateId(builder.profile.theme),
    );
  const [themeSettings, setThemeSettings] = useState<ProfileThemeSettings>(() =>
    resolveThemeSettings(builder.profile.theme),
  );
  const deferredThemeSettings = useDeferredValue(themeSettings);
  const [templateWordingOverrides, setTemplateWordingOverrides] = useState<
    Partial<TemplateWording>
  >(() =>
    getTemplateWordingOverrides(
      builder.profile.theme,
      resolveProfileTemplateId(builder.profile.theme),
    ),
  );
  const templateWording = useMemo(
    () =>
      resolveTemplateWording({ templateWordingOverrides }, selectedTemplateId),
    [selectedTemplateId, templateWordingOverrides],
  );
  const currentStyleSnapshot = useMemo<StyleSnapshot>(
    () => ({
      templateId: selectedTemplateId,
      coverUrl: draftBuilder.profile.coverUrl,
      themeSettings,
      wordingOverrides: templateWordingOverrides,
    }),
    [
      draftBuilder.profile.coverUrl,
      selectedTemplateId,
      templateWordingOverrides,
      themeSettings,
    ],
  );
  const observedStyleSnapshotRef = useRef(currentStyleSnapshot);
  const currentStyleSnapshotRef = useRef(currentStyleSnapshot);
  const stylePastRef = useRef<StyleSnapshot[]>([]);
  const styleFutureRef = useRef<StyleSnapshot[]>([]);
  const styleHistoryBurstRef = useRef<{
    key: string;
    timestamp: number;
  } | null>(null);
  const [styleHistoryState, setStyleHistoryState] = useState({
    canUndo: false,
    canRedo: false,
  });
  const [styleHistoryActionToken, setStyleHistoryActionToken] = useState(0);

  const syncStyleHistoryState = useCallback(() => {
    setStyleHistoryState({
      canUndo: stylePastRef.current.length > 0,
      canRedo: styleFutureRef.current.length > 0,
    });
  }, []);

  useEffect(() => {
    const previous = observedStyleSnapshotRef.current;
    const next = currentStyleSnapshot;
    currentStyleSnapshotRef.current = next;
    if (areStyleSnapshotsEqual(previous, next)) return;

    const now = Date.now();
    const changeKey = getStyleChangeKey(previous, next);
    const lastBurst = styleHistoryBurstRef.current;
    const isSameBurst =
      lastBurst?.key === changeKey && now - lastBurst.timestamp < 650;

    if (!isSameBurst) {
      stylePastRef.current = [...stylePastRef.current.slice(-49), previous];
    }

    styleFutureRef.current = [];
    styleHistoryBurstRef.current = { key: changeKey, timestamp: now };
    observedStyleSnapshotRef.current = next;
    syncStyleHistoryState();
  }, [currentStyleSnapshot, syncStyleHistoryState]);

  const applyStyleSnapshot = useCallback((snapshot: StyleSnapshot) => {
    observedStyleSnapshotRef.current = snapshot;
    currentStyleSnapshotRef.current = snapshot;
    setSelectedTemplateId(snapshot.templateId);
    setThemeSettings(snapshot.themeSettings);
    setTemplateWordingOverrides(snapshot.wordingOverrides);
    setDraftBuilder((current) => ({
      ...current,
      profile: {
        ...current.profile,
        coverUrl: snapshot.coverUrl,
      },
    }));
  }, []);

  const handleStyleUndo = useCallback(() => {
    const target = stylePastRef.current.at(-1);
    if (!target) return;

    stylePastRef.current = stylePastRef.current.slice(0, -1);
    styleFutureRef.current = [
      ...styleFutureRef.current.slice(-49),
      currentStyleSnapshotRef.current,
    ];
    styleHistoryBurstRef.current = null;
    applyStyleSnapshot(target);
    syncStyleHistoryState();
    setStyleHistoryActionToken((current) => current + 1);
  }, [applyStyleSnapshot, syncStyleHistoryState]);

  const handleStyleRedo = useCallback(() => {
    const target = styleFutureRef.current.at(-1);
    if (!target) return;

    styleFutureRef.current = styleFutureRef.current.slice(0, -1);
    stylePastRef.current = [
      ...stylePastRef.current.slice(-49),
      currentStyleSnapshotRef.current,
    ];
    styleHistoryBurstRef.current = null;
    applyStyleSnapshot(target);
    syncStyleHistoryState();
    setStyleHistoryActionToken((current) => current + 1);
  }, [applyStyleSnapshot, syncStyleHistoryState]);

  const previewBuilder = useMemo<ProfileBuilderState>(
    () => ({
      ...draftBuilder,
      profile: {
        ...draftBuilder.profile,
        theme: {
          ...draftBuilder.profile.theme,
          templateId: selectedTemplateId,
          ...deferredThemeSettings,
          templateWordingOverrides,
          templateWording,
        },
      },
    }),
    [
      deferredThemeSettings,
      draftBuilder,
      selectedTemplateId,
      templateWording,
      templateWordingOverrides,
    ],
  );
  const handlePreviewChange = useCallback((form: HTMLFormElement) => {
    setDraftBuilder((current) => createLivePreviewState(current, form));
  }, []);
  const handlePublishChange = useCallback(
    (isPublished: boolean) => {
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
        const result = await setProfilePublishedAction(
          builder.profile.id ?? 0,
          isPublished,
        );
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
    },
    [builder.profile.id, draftBuilder.profile.isPublished],
  );
  const handleCoverChange = useCallback((coverUrl: string) => {
    setDraftBuilder((current) => ({
      ...current,
      profile: {
        ...current.profile,
        coverUrl,
      },
    }));
  }, []);
  const handleTemplateWordingChange = useCallback(
    (key: keyof TemplateWording, value: string) => {
      setTemplateWordingOverrides((current) => ({
        ...current,
        [key]: value,
      }));
    },
    [],
  );
  const handleContentAutosaveStatusChange = useCallback(
    (status: AutosaveStatus, message?: string) => {
      setAutosaveStates((current) => ({
        ...current,
        content: { status, message },
      }));
    },
    [],
  );
  const handleStylesAutosaveStatusChange = useCallback(
    (status: AutosaveStatus, message?: string) => {
      setAutosaveStates((current) => ({
        ...current,
        styles: { status, message },
      }));
    },
    [],
  );

  return (
    <div className="min-h-full xl:h-[calc(100dvh-3rem)] xl:min-h-0 xl:flex-none xl:overflow-hidden">
      <AutosaveIndicator states={autosaveStates} />
      <MobilePanelBar activePanel={activePanel} onSelect={setActivePanel} />

      <div className="min-w-0 gap-4 xl:grid xl:h-full xl:max-h-full xl:min-h-0 xl:grid-cols-[340px_minmax(0,1fr)_340px] xl:grid-rows-[minmax(0,1fr)] xl:overflow-hidden">
        <div
          className={cn(
            'min-h-0 min-w-0 xl:block xl:h-full',
            activePanel !== 'content' && 'hidden',
          )}
        >
          <ContentPanel
            builder={draftBuilder}
            subscription={subscription}
            onPreviewChange={handlePreviewChange}
            onAutosaveStatusChange={handleContentAutosaveStatusChange}
          />
        </div>
        <div
          className={cn(
            'min-h-0 min-w-0 xl:block xl:h-full',
            activePanel !== 'preview' && 'hidden',
          )}
        >
          <PreviewPanel
            builder={previewBuilder}
            onPublishChange={handlePublishChange}
            publishMessage={publishMessage}
            publishPending={publishPending}
          />
        </div>
        <div
          className={cn(
            'min-h-0 min-w-0 xl:block xl:h-full',
            activePanel !== 'styles' && 'hidden',
          )}
        >
          <StylesPanel
            profileId={builder.profile.id ?? 0}
            subscription={subscription}
            selectedTemplateId={selectedTemplateId}
            coverUrl={draftBuilder.profile.coverUrl}
            themeSettings={themeSettings}
            templateWording={templateWording}
            templateWordingOverrides={templateWordingOverrides}
            onTemplateSelect={setSelectedTemplateId}
            onCoverChange={handleCoverChange}
            onThemeChange={setThemeSettings}
            onTemplateWordingChange={handleTemplateWordingChange}
            onAutosaveStatusChange={handleStylesAutosaveStatusChange}
            canUndo={styleHistoryState.canUndo}
            canRedo={styleHistoryState.canRedo}
            historyActionToken={styleHistoryActionToken}
            onUndo={handleStyleUndo}
            onRedo={handleStyleRedo}
          />
        </div>
      </div>
    </div>
  );
}
