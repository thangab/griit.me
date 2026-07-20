export const colorPresets = [
  {
    id: 'minimal',
    name: 'Minimal',
    colors: [
      '#f8fafc',
      '#ffffff',
      '#0f172a',
      '#475569',
      '#e2e8f0',
      '#ffffff',
      '#0f172a',
      '#64748b',
      '#ffffff',
      '#0f172a',
    ],
    proOnly: false,
  },
  {
    id: 'midnight_blue',
    name: 'Midnight',
    colors: [
      '#071426',
      '#10233d',
      '#f8fafc',
      '#3b82f6',
      '#1e3a5f',
      '#ffffff',
      '#f8fafc',
      '#a8b8cc',
      '#ffffff',
      '#f8fafc',
    ],
    proOnly: false,
  },
  {
    id: 'obsidian_lime',
    name: 'Obsidian',
    colors: [
      '#09090b',
      '#18181b',
      '#fafafa',
      '#a3e635',
      '#27272a',
      '#fafafa',
      '#fafafa',
      '#a1a1aa',
      '#09090b',
      '#fafafa',
    ],
    proOnly: false,
  },
  {
    id: 'performance_red',
    name: 'Performance',
    colors: [
      '#fff7ed',
      '#ffffff',
      '#18181b',
      '#ef4444',
      '#fee2e2',
      '#ffffff',
      '#18181b',
      '#78716c',
      '#ffffff',
      '#18181b',
    ],
    proOnly: false,
  },
  {
    id: 'endurance_orange',
    name: 'Endurance',
    colors: [
      '#18181b',
      '#27272a',
      '#fafafa',
      '#f97316',
      '#3f3f46',
      '#ffffff',
      '#fafafa',
      '#a1a1aa',
      '#18181b',
      '#fafafa',
    ],
    proOnly: false,
  },
  {
    id: 'forest',
    name: 'Forest',
    colors: [
      '#102a22',
      '#173b30',
      '#f7fee7',
      '#6ee7b7',
      '#245244',
      '#f7fee7',
      '#f7fee7',
      '#a7c7b7',
      '#102a22',
      '#f7fee7',
    ],
    proOnly: false,
  },
  {
    id: 'electric_purple',
    name: 'Electric',
    colors: [
      '#11102a',
      '#1c1940',
      '#fafafa',
      '#a78bfa',
      '#312e81',
      '#fafafa',
      '#fafafa',
      '#b8b5d8',
      '#11102a',
      '#fafafa',
    ],
    proOnly: false,
  },
] as const;

export const fontPresets = [
  { id: 'clean', name: 'Clean', sample: 'Modern & clear', proOnly: false },
  {
    id: 'athletic',
    name: 'Athletic',
    sample: 'Bold & powerful',
    proOnly: true,
  },
  {
    id: 'editorial',
    name: 'Editorial',
    sample: 'Refined & expressive',
    proOnly: true,
  },
  {
    id: 'technical',
    name: 'Technical',
    sample: 'Precise & modern',
    proOnly: true,
  },
] as const;

export const overlayPresets = ['light', 'balanced', 'strong'] as const;
export const radiusPresets = ['sharp', 'soft', 'rounded'] as const;
export const galleryLayouts = ['grid', 'editorial', 'carousel'] as const;
export const coverTypes = ['image', 'color', 'gradient'] as const;
export const headerLayouts = [
  'centered',
  'split',
  'left',
  'immersive',
] as const;
export const decorativeIconIds = [
  'auto',
  'none',
  'target',
  'gauge',
  'shield',
  'zap',
  'dumbbell',
  'timer',
  'trophy',
  'bike',
  'medal',
  'activity',
  'flag',
] as const;

export type ColorPresetId = (typeof colorPresets)[number]['id'] | 'custom';
export type FontPresetId = (typeof fontPresets)[number]['id'];
export type OverlayPreset = (typeof overlayPresets)[number];
export type RadiusPreset = (typeof radiusPresets)[number];
export type GalleryLayout = (typeof galleryLayouts)[number];
export type CoverType = (typeof coverTypes)[number];
export type HeaderLayout = (typeof headerLayouts)[number];
export type DecorativeIconId = (typeof decorativeIconIds)[number];

export type ProfileThemeSettings = {
  colorPreset: ColorPresetId;
  customColors: {
    background: string;
    surface: string;
    foreground: string;
    accent: string;
    social: string;
    headerText: string;
    headerMutedText: string;
    blockTitle: string;
    description: string;
    accentText: string;
    socialText: string;
  };
  fontPreset: FontPresetId;
  coverOverlay: OverlayPreset;
  radiusPreset: RadiusPreset;
  galleryLayout: GalleryLayout;
  coverType: CoverType;
  coverColor: string;
  coverGradientFrom: string;
  coverGradientTo: string;
  headerLayout: HeaderLayout;
  headerAvatarSize: number;
  headerSheetColor: string;
  headerSheetFade: boolean;
  decorativeIcon: DecorativeIconId;
};

export const defaultThemeSettings: ProfileThemeSettings = {
  colorPreset: 'minimal',
  customColors: {
    background: '#f8fafc',
    surface: '#ffffff',
    foreground: '#0f172a',
    accent: '#3b82f6',
    social: '#e2e8f0',
    headerText: '#ffffff',
    headerMutedText: '#cbd5e1',
    blockTitle: '#0f172a',
    description: '#64748b',
    accentText: '#ffffff',
    socialText: '#0f172a',
  },
  fontPreset: 'clean',
  coverOverlay: 'balanced',
  radiusPreset: 'rounded',
  galleryLayout: 'grid',
  coverType: 'image',
  coverColor: '#0f172a',
  coverGradientFrom: '#0f172a',
  coverGradientTo: '#3b82f6',
  headerLayout: 'centered',
  headerAvatarSize: 96,
  headerSheetColor: '#ffffff',
  headerSheetFade: true,
  decorativeIcon: 'auto',
};

function createTemplateThemePreset(
  overrides: Partial<ProfileThemeSettings> & {
    customColors?: Partial<ProfileThemeSettings['customColors']>;
  },
): ProfileThemeSettings {
  return {
    ...defaultThemeSettings,
    ...overrides,
    customColors: {
      ...defaultThemeSettings.customColors,
      ...overrides.customColors,
    },
  };
}

const templateThemePresets: Record<string, ProfileThemeSettings> = {
  goal_spotlight: createTemplateThemePreset({
    colorPreset: 'minimal',
    fontPreset: 'clean',
    coverOverlay: 'balanced',
    radiusPreset: 'rounded',
    galleryLayout: 'grid',
    coverType: 'image',
    coverColor: '#0f172a',
    headerLayout: 'centered',
    headerAvatarSize: 96,
    headerSheetColor: '#ffffff',
  }),
  sport_running: createTemplateThemePreset({
    colorPreset: 'endurance_orange',
    fontPreset: 'clean',
    coverOverlay: 'strong',
    radiusPreset: 'soft',
    galleryLayout: 'grid',
    coverType: 'image',
    coverColor: '#18181b',
    headerLayout: 'left',
    headerAvatarSize: 80,
    headerSheetColor: '#18181b',
  }),
  sport_boxing: createTemplateThemePreset({
    colorPreset: 'performance_red',
    fontPreset: 'clean',
    coverOverlay: 'strong',
    radiusPreset: 'sharp',
    galleryLayout: 'grid',
    coverType: 'gradient',
    coverColor: '#18181b',
    coverGradientFrom: '#18181b',
    coverGradientTo: '#991b1b',
    headerLayout: 'left',
    headerAvatarSize: 72,
    headerSheetColor: '#fff7ed',
  }),
  sport_mma: createTemplateThemePreset({
    colorPreset: 'obsidian_lime',
    fontPreset: 'clean',
    coverOverlay: 'strong',
    radiusPreset: 'sharp',
    galleryLayout: 'grid',
    coverType: 'gradient',
    coverColor: '#09090b',
    coverGradientFrom: '#09090b',
    coverGradientTo: '#365314',
    headerLayout: 'immersive',
    headerAvatarSize: 72,
    headerSheetColor: '#09090b',
    headerSheetFade: true,
  }),
  sport_strength: createTemplateThemePreset({
    colorPreset: 'midnight_blue',
    fontPreset: 'clean',
    coverOverlay: 'balanced',
    radiusPreset: 'soft',
    galleryLayout: 'grid',
    coverType: 'gradient',
    coverColor: '#071426',
    coverGradientFrom: '#071426',
    coverGradientTo: '#1d4ed8',
    headerLayout: 'split',
    headerAvatarSize: 112,
    headerSheetColor: '#10233d',
  }),
  sport_hyrox: createTemplateThemePreset({
    colorPreset: 'electric_purple',
    fontPreset: 'clean',
    coverOverlay: 'balanced',
    radiusPreset: 'sharp',
    galleryLayout: 'grid',
    coverType: 'color',
    coverColor: '#312e81',
    headerLayout: 'centered',
    headerAvatarSize: 88,
    headerSheetColor: '#11102a',
  }),
  sport_football: createTemplateThemePreset({
    colorPreset: 'forest',
    fontPreset: 'clean',
    coverOverlay: 'balanced',
    radiusPreset: 'rounded',
    galleryLayout: 'grid',
    coverType: 'gradient',
    coverColor: '#102a22',
    coverGradientFrom: '#102a22',
    coverGradientTo: '#166534',
    headerLayout: 'split',
    headerAvatarSize: 104,
    headerSheetColor: '#173b30',
  }),
  sport_cycling: createTemplateThemePreset({
    colorPreset: 'custom',
    customColors: {
      background: '#f4f0e8',
      surface: '#fffaf0',
      foreground: '#172554',
      accent: '#ea580c',
      social: '#dbeafe',
      headerText: '#fffaf0',
      headerMutedText: '#fed7aa',
      blockTitle: '#172554',
      description: '#475569',
      accentText: '#fffaf0',
      socialText: '#172554',
    },
    fontPreset: 'clean',
    coverOverlay: 'light',
    radiusPreset: 'rounded',
    galleryLayout: 'grid',
    coverType: 'image',
    coverColor: '#172554',
    headerLayout: 'immersive',
    headerAvatarSize: 64,
    headerSheetColor: '#f4f0e8',
    headerSheetFade: true,
  }),
};

export function getTemplateThemePreset(templateId: string) {
  const preset =
    templateThemePresets[templateId] ??
    templateThemePresets.goal_spotlight ??
    defaultThemeSettings;

  return resolveThemeSettings(createTemplateThemePreset(preset));
}

function resolveColor(value: unknown, fallback: string) {
  return typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value)
    ? value
    : fallback;
}

function resolveNumber(
  value: unknown,
  fallback: number,
  min: number,
  max: number,
) {
  const number = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(number)
    ? Math.min(max, Math.max(min, number))
    : fallback;
}

function resolveId<T extends readonly { id: string }[]>(
  items: T,
  value: unknown,
  fallback: T[number]['id'],
) {
  return items.some((item) => item.id === value)
    ? (value as T[number]['id'])
    : fallback;
}

export function resolveThemeSettings(
  theme: Record<string, unknown>,
): ProfileThemeSettings {
  const customColors =
    theme.customColors && typeof theme.customColors === 'object'
      ? (theme.customColors as Record<string, unknown>)
      : {};
  const colorPreset: ColorPresetId =
    theme.colorPreset === 'custom'
      ? 'custom'
      : resolveId(colorPresets, theme.colorPreset, 'minimal');
  const selectedPreset =
    colorPresets.find((preset) => preset.id === colorPreset) ?? colorPresets[0];
  const resolvedCustomColors =
    colorPreset === 'custom'
      ? {
          background: resolveColor(
            customColors.background,
            defaultThemeSettings.customColors.background,
          ),
          surface: resolveColor(
            customColors.surface,
            defaultThemeSettings.customColors.surface,
          ),
          foreground: resolveColor(
            customColors.foreground,
            defaultThemeSettings.customColors.foreground,
          ),
          accent: resolveColor(
            customColors.accent,
            defaultThemeSettings.customColors.accent,
          ),
          social: resolveColor(
            customColors.social,
            defaultThemeSettings.customColors.social,
          ),
          headerText: resolveColor(
            customColors.headerText,
            defaultThemeSettings.customColors.headerText,
          ),
          headerMutedText: resolveColor(
            customColors.headerMutedText,
            defaultThemeSettings.customColors.headerMutedText,
          ),
          blockTitle: resolveColor(
            customColors.blockTitle,
            resolveColor(
              customColors.foreground,
              defaultThemeSettings.customColors.blockTitle,
            ),
          ),
          description: resolveColor(
            customColors.description,
            resolveColor(
              customColors.foreground,
              defaultThemeSettings.customColors.description,
            ),
          ),
          accentText: resolveColor(
            customColors.accentText,
            resolveColor(
              customColors.foreground,
              defaultThemeSettings.customColors.accentText,
            ),
          ),
          socialText: resolveColor(
            customColors.socialText,
            resolveColor(
              customColors.foreground,
              defaultThemeSettings.customColors.socialText,
            ),
          ),
        }
      : {
          background: selectedPreset.colors[0],
          surface: selectedPreset.colors[1],
          foreground: selectedPreset.colors[2],
          accent: selectedPreset.colors[3],
          social: selectedPreset.colors[4],
          headerText: selectedPreset.colors[5],
          headerMutedText: selectedPreset.colors[7],
          blockTitle: selectedPreset.colors[6],
          description: selectedPreset.colors[7],
          accentText: selectedPreset.colors[8],
          socialText: selectedPreset.colors[9],
        };

  return {
    colorPreset,
    customColors: resolvedCustomColors,
    fontPreset: resolveId(
      fontPresets,
      theme.fontPreset,
      defaultThemeSettings.fontPreset,
    ),
    coverOverlay: overlayPresets.includes(theme.coverOverlay as OverlayPreset)
      ? (theme.coverOverlay as OverlayPreset)
      : defaultThemeSettings.coverOverlay,
    radiusPreset: radiusPresets.includes(theme.radiusPreset as RadiusPreset)
      ? (theme.radiusPreset as RadiusPreset)
      : defaultThemeSettings.radiusPreset,
    galleryLayout: galleryLayouts.includes(theme.galleryLayout as GalleryLayout)
      ? (theme.galleryLayout as GalleryLayout)
      : defaultThemeSettings.galleryLayout,
    coverType: coverTypes.includes(theme.coverType as CoverType)
      ? (theme.coverType as CoverType)
      : defaultThemeSettings.coverType,
    coverColor: resolveColor(theme.coverColor, defaultThemeSettings.coverColor),
    coverGradientFrom: resolveColor(
      theme.coverGradientFrom,
      defaultThemeSettings.coverGradientFrom,
    ),
    coverGradientTo: resolveColor(
      theme.coverGradientTo,
      defaultThemeSettings.coverGradientTo,
    ),
    headerLayout: headerLayouts.includes(theme.headerLayout as HeaderLayout)
      ? (theme.headerLayout as HeaderLayout)
      : defaultThemeSettings.headerLayout,
    headerAvatarSize: resolveNumber(
      theme.headerAvatarSize,
      defaultThemeSettings.headerAvatarSize,
      56,
      144,
    ),
    headerSheetColor: resolveColor(
      theme.headerSheetColor,
      resolvedCustomColors.surface,
    ),
    headerSheetFade:
      typeof theme.headerSheetFade === 'boolean'
        ? theme.headerSheetFade
        : defaultThemeSettings.headerSheetFade,
    decorativeIcon: decorativeIconIds.includes(
      theme.decorativeIcon as DecorativeIconId,
    )
      ? (theme.decorativeIcon as DecorativeIconId)
      : defaultThemeSettings.decorativeIcon,
  };
}

export function getThemeRuntime(theme: Record<string, unknown>) {
  const settings = resolveThemeSettings(theme);
  const preset =
    colorPresets.find((item) => item.id === settings.colorPreset) ??
    colorPresets[0];
  const color =
    settings.colorPreset === 'custom'
      ? {
          ...preset,
          colors: [
            settings.customColors.background,
            settings.customColors.surface,
            settings.customColors.foreground,
            settings.customColors.accent,
            settings.customColors.social,
            settings.customColors.headerText,
            settings.customColors.headerMutedText,
            settings.customColors.blockTitle,
            settings.customColors.description,
            settings.customColors.accentText,
            settings.customColors.socialText,
          ] as const,
        }
      : {
          ...preset,
          colors: [
            preset.colors[0],
            preset.colors[1],
            preset.colors[2],
            preset.colors[3],
            preset.colors[4],
            preset.colors[5],
            preset.colors[7],
            preset.colors[6],
            preset.colors[7],
            preset.colors[8],
            preset.colors[9],
          ] as const,
        };
  const [
    background,
    surface,
    text,
    accent,
    social,
    headerText,
    headerMutedText,
    blockTitle,
    description,
    accentText,
    socialText,
  ] = color.colors;
  const palette = {
    background,
    surface,
    subtle: `color-mix(in srgb, ${background} 84%, ${text})`,
    text,
    mutedText: description,
    border: `color-mix(in srgb, ${text} 14%, ${background})`,
    accent,
    accentText,
    social,
    socialText,
    headerText,
    mutedHeaderText: headerMutedText,
    blockTitle,
    description,
    mutedDescription: `color-mix(in srgb, ${description} 72%, ${background})`,
  };
  const fontFamilies = {
    clean: {
      heading: 'ui-sans-serif, system-ui, sans-serif',
      body: 'ui-sans-serif, system-ui, sans-serif',
    },
    athletic: {
      heading: 'Impact, "Arial Black", sans-serif',
      body: 'Arial, sans-serif',
    },
    editorial: {
      heading: 'Georgia, serif',
      body: 'ui-sans-serif, system-ui, sans-serif',
    },
    technical: {
      heading: 'ui-monospace, SFMono-Regular, monospace',
      body: 'ui-sans-serif, system-ui, sans-serif',
    },
  }[settings.fontPreset];
  return {
    ...settings,
    color,
    palette,
    overlayOpacity: { light: 0.35, balanced: 0.58, strong: 0.76 }[
      settings.coverOverlay
    ],
    radiusClass: {
      sharp: 'rounded-none',
      soft: 'rounded-xl',
      rounded: 'rounded-3xl',
    }[settings.radiusPreset],
    fontFamilies,
  };
}
