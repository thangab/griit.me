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
      '#f8fafc',
      '#0f172a',
      '#64748b',
      '#ffffff',
      '#0f172a',
      '#cbd5e1',
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
      '#eff6ff',
      '#f8fafc',
      '#a8b8cc',
      '#ffffff',
      '#f8fafc',
      '#bfdbfe',
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
      '#f7fee7',
      '#fafafa',
      '#a1a1aa',
      '#09090b',
      '#fafafa',
      '#d9f99d',
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
      '#fff7ed',
      '#18181b',
      '#78716c',
      '#ffffff',
      '#18181b',
      '#fed7aa',
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
      '#fafafa',
      '#fafafa',
      '#a1a1aa',
      '#18181b',
      '#fafafa',
      '#d4d4d8',
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
      '#a7f3d0',
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
      '#f5f3ff',
      '#fafafa',
      '#b8b5d8',
      '#11102a',
      '#fafafa',
      '#c4b5fd',
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

export const radiusPresets = ['sharp', 'soft', 'rounded'] as const;
export const galleryLayouts = ['grid', 'editorial', 'carousel'] as const;
export const coverTypes = ['image', 'color', 'gradient'] as const;
export const headerLayouts = [
  'centered',
  'split',
  'left',
  'immersive',
  'kinetic',
] as const;
export const avatarShapes = ['circle', 'hexagon', 'diamond', 'shield'] as const;
export const headerGeometries = [
  'none',
  'velocity',
  'rings',
  'chevrons',
  'blocks',
] as const;
export const headerTextures = [
  'none',
  'grid',
  'diagonal',
  'dots',
  'scanlines',
] as const;
export const blockShadowStyles = ['soft', 'solid'] as const;

export type ColorPresetId = (typeof colorPresets)[number]['id'] | 'custom';
export type FontPresetId = (typeof fontPresets)[number]['id'];
export type RadiusPreset = (typeof radiusPresets)[number];
export type GalleryLayout = (typeof galleryLayouts)[number];
export type CoverType = (typeof coverTypes)[number];
export type HeaderLayout = (typeof headerLayouts)[number];
export type AvatarShape = (typeof avatarShapes)[number];
export type HeaderGeometry = (typeof headerGeometries)[number];
export type HeaderTexture = (typeof headerTextures)[number];
export type BlockShadowStyle = (typeof blockShadowStyles)[number];

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
  coverOverlayColor: string;
  coverOverlayOpacity: number;
  radiusPreset: RadiusPreset;
  galleryLayout: GalleryLayout;
  coverType: CoverType;
  coverColor: string;
  coverGradientFrom: string;
  coverGradientTo: string;
  headerLayout: HeaderLayout;
  headerAvatarSize: number;
  headerAvatarShape: AvatarShape;
  headerSheetColor: string;
  headerSheetCoverage: number;
  headerGeometry: HeaderGeometry;
  headerTexture: HeaderTexture;
  blockCorner: number;
  blockBorder: number;
  blockBorderColor: string;
  blockShadow: number;
  blockShadowStyle: BlockShadowStyle;
  blockSpacing: number;
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
  coverOverlayColor: '#000000',
  coverOverlayOpacity: 58,
  radiusPreset: 'rounded',
  galleryLayout: 'grid',
  coverType: 'image',
  coverColor: '#0f172a',
  coverGradientFrom: '#0f172a',
  coverGradientTo: '#3b82f6',
  headerLayout: 'centered',
  headerAvatarSize: 96,
  headerAvatarShape: 'circle',
  headerSheetColor: '#0f172a',
  headerSheetCoverage: 50,
  headerGeometry: 'velocity',
  headerTexture: 'grid',
  blockCorner: 75,
  blockBorder: 25,
  blockBorderColor: '#e2e8f0',
  blockShadow: 12,
  blockShadowStyle: 'soft',
  blockSpacing: 35,
};

function createTemplateThemePreset(
  overrides: Partial<ProfileThemeSettings> & {
    customColors?: Partial<ProfileThemeSettings['customColors']>;
  },
): ProfileThemeSettings {
  const radiusPreset =
    overrides.radiusPreset ?? defaultThemeSettings.radiusPreset;
  return {
    ...defaultThemeSettings,
    ...overrides,
    blockCorner:
      overrides.blockCorner ??
      { sharp: 0, soft: 38, rounded: 75 }[radiusPreset],
    customColors: {
      ...defaultThemeSettings.customColors,
      ...overrides.customColors,
    },
  };
}

const templateThemePresets: Record<string, ProfileThemeSettings> = {
  spotlight: createTemplateThemePreset({
    colorPreset: 'custom',
    customColors: {
      background: '#f3f0e8',
      surface: '#fffdf8',
      foreground: '#17211c',
      accent: '#ff5c35',
      social: '#dfe8de',
      headerText: '#fffdf8',
      headerMutedText: '#edf3ef',
      blockTitle: '#17211c',
      description: '#465149',
      accentText: '#fffdf8',
      socialText: '#23402f',
    },
    fontPreset: 'clean',
    coverOverlayOpacity: 58,
    radiusPreset: 'rounded',
    galleryLayout: 'grid',
    coverType: 'gradient',
    coverColor: '#173d32',
    coverGradientFrom: '#102a24',
    coverGradientTo: '#2f6a50',
    headerLayout: 'centered',
    headerAvatarSize: 96,
    headerAvatarShape: 'circle',
    headerSheetColor: '#173d32',
    headerGeometry: 'rings',
    headerTexture: 'none',
    blockBorderColor: '#d8d4c9',
    blockShadow: 12,
    blockSpacing: 35,
  }),
  momentum: createTemplateThemePreset({
    colorPreset: 'endurance_orange',
    fontPreset: 'clean',
    coverOverlayOpacity: 76,
    radiusPreset: 'soft',
    galleryLayout: 'grid',
    coverType: 'image',
    coverColor: '#18181b',
    headerLayout: 'left',
    headerAvatarSize: 80,
    headerAvatarShape: 'circle',
    headerSheetColor: '#18181b',
    blockBorder: 12,
    blockBorderColor: '#3f3f46',
    blockShadow: 18,
    blockSpacing: 42,
  }),
  impact: createTemplateThemePreset({
    colorPreset: 'performance_red',
    fontPreset: 'clean',
    coverOverlayOpacity: 76,
    radiusPreset: 'sharp',
    galleryLayout: 'grid',
    coverType: 'gradient',
    coverColor: '#18181b',
    coverGradientFrom: '#18181b',
    coverGradientTo: '#991b1b',
    headerLayout: 'left',
    headerAvatarSize: 72,
    headerAvatarShape: 'hexagon',
    headerSheetColor: '#7f1d1d',
    blockBorder: 55,
    blockBorderColor: '#ef4444',
    blockShadow: 32,
    blockShadowStyle: 'solid',
    blockSpacing: 24,
  }),
  obsidian: createTemplateThemePreset({
    colorPreset: 'obsidian_lime',
    fontPreset: 'clean',
    coverOverlayOpacity: 76,
    radiusPreset: 'sharp',
    galleryLayout: 'grid',
    coverType: 'gradient',
    coverColor: '#09090b',
    coverGradientFrom: '#09090b',
    coverGradientTo: '#365314',
    headerLayout: 'immersive',
    headerAvatarSize: 72,
    headerAvatarShape: 'shield',
    headerSheetColor: '#09090b',
    headerSheetCoverage: 50,
    blockBorder: 30,
    blockBorderColor: '#3f6212',
    blockShadow: 0,
    blockShadowStyle: 'solid',
    blockSpacing: 20,
  }),
  midnight: createTemplateThemePreset({
    colorPreset: 'midnight_blue',
    fontPreset: 'clean',
    coverOverlayOpacity: 58,
    radiusPreset: 'soft',
    galleryLayout: 'grid',
    coverType: 'gradient',
    coverColor: '#071426',
    coverGradientFrom: '#071426',
    coverGradientTo: '#1d4ed8',
    headerLayout: 'split',
    headerAvatarSize: 112,
    headerAvatarShape: 'circle',
    headerSheetColor: '#10233d',
    blockBorder: 35,
    blockBorderColor: '#1e3a5f',
    blockShadow: 28,
    blockSpacing: 32,
  }),
  pulse: createTemplateThemePreset({
    colorPreset: 'electric_purple',
    fontPreset: 'clean',
    coverOverlayOpacity: 58,
    radiusPreset: 'sharp',
    galleryLayout: 'grid',
    coverType: 'color',
    coverColor: '#312e81',
    headerLayout: 'centered',
    headerAvatarSize: 88,
    headerAvatarShape: 'diamond',
    headerSheetColor: '#11102a',
    blockBorder: 45,
    blockBorderColor: '#4f46e5',
    blockShadow: 8,
    blockSpacing: 26,
  }),
  evergreen: createTemplateThemePreset({
    colorPreset: 'forest',
    fontPreset: 'clean',
    coverOverlayOpacity: 58,
    radiusPreset: 'rounded',
    galleryLayout: 'grid',
    coverType: 'gradient',
    coverColor: '#102a22',
    coverGradientFrom: '#102a22',
    coverGradientTo: '#166534',
    headerLayout: 'split',
    headerAvatarSize: 104,
    headerAvatarShape: 'circle',
    headerSheetColor: '#173b30',
    blockBorder: 22,
    blockBorderColor: '#245244',
    blockShadow: 14,
    blockSpacing: 38,
  }),
  horizon: createTemplateThemePreset({
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
    coverOverlayOpacity: 35,
    radiusPreset: 'rounded',
    galleryLayout: 'grid',
    coverType: 'image',
    coverColor: '#172554',
    headerLayout: 'immersive',
    headerAvatarSize: 64,
    headerAvatarShape: 'hexagon',
    headerSheetColor: '#172554',
    headerSheetCoverage: 50,
    blockBorder: 18,
    blockBorderColor: '#bfdbfe',
    blockShadow: 20,
    blockSpacing: 46,
  }),
};

export function getTemplateThemePreset(templateId: string) {
  const preset =
    templateThemePresets[templateId] ??
    templateThemePresets.spotlight ??
    defaultThemeSettings;

  return resolveThemeSettings(createTemplateThemePreset(preset));
}

export function getHeaderSheetBackground(color: string, coverage: number) {
  const normalizedCoverage = Math.min(100, Math.max(0, coverage));

  if (normalizedCoverage === 0) return 'transparent';
  if (normalizedCoverage === 100) return color;

  const solidStart = 100 - normalizedCoverage;
  const fadeStart = Math.max(0, solidStart - 14);

  return `linear-gradient(to bottom, transparent 0%, transparent ${fadeStart}%, ${color} ${solidStart}%, ${color} 100%)`;
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
          headerMutedText: selectedPreset.colors[10],
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
    coverOverlayColor: resolveColor(
      theme.coverOverlayColor,
      defaultThemeSettings.coverOverlayColor,
    ),
    coverOverlayOpacity: resolveNumber(
      theme.coverOverlayOpacity,
      defaultThemeSettings.coverOverlayOpacity,
      0,
      100,
    ),
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
    headerAvatarShape: avatarShapes.includes(
      theme.headerAvatarShape as AvatarShape,
    )
      ? (theme.headerAvatarShape as AvatarShape)
      : defaultThemeSettings.headerAvatarShape,
    headerSheetColor: resolveColor(
      theme.headerSheetColor,
      resolvedCustomColors.surface,
    ),
    headerSheetCoverage: resolveNumber(
      theme.headerSheetCoverage,
      defaultThemeSettings.headerSheetCoverage,
      0,
      100,
    ),
    headerGeometry: headerGeometries.includes(
      theme.headerGeometry as HeaderGeometry,
    )
      ? (theme.headerGeometry as HeaderGeometry)
      : defaultThemeSettings.headerGeometry,
    headerTexture: headerTextures.includes(theme.headerTexture as HeaderTexture)
      ? (theme.headerTexture as HeaderTexture)
      : defaultThemeSettings.headerTexture,
    blockCorner: resolveNumber(
      theme.blockCorner,
      {
        sharp: 0,
        soft: 38,
        rounded: 75,
      }[
        radiusPresets.includes(theme.radiusPreset as RadiusPreset)
          ? (theme.radiusPreset as RadiusPreset)
          : defaultThemeSettings.radiusPreset
      ],
      0,
      100,
    ),
    blockBorder: resolveNumber(
      theme.blockBorder,
      defaultThemeSettings.blockBorder,
      0,
      100,
    ),
    blockBorderColor: resolveColor(
      theme.blockBorderColor,
      resolvedCustomColors.social,
    ),
    blockShadow: resolveNumber(
      theme.blockShadow,
      defaultThemeSettings.blockShadow,
      0,
      100,
    ),
    blockShadowStyle: blockShadowStyles.includes(
      theme.blockShadowStyle as BlockShadowStyle,
    )
      ? (theme.blockShadowStyle as BlockShadowStyle)
      : defaultThemeSettings.blockShadowStyle,
    blockSpacing: resolveNumber(
      theme.blockSpacing,
      defaultThemeSettings.blockSpacing,
      0,
      100,
    ),
  };
}

export function getThemeRuntime(theme: Record<string, unknown>) {
  const templateId =
    typeof theme.templateId === 'string' ? theme.templateId : null;
  const templatePreset = templateId ? getTemplateThemePreset(templateId) : null;
  const explicitCustomColors =
    theme.customColors && typeof theme.customColors === 'object'
      ? (theme.customColors as Record<string, unknown>)
      : {};
  const settings = resolveThemeSettings(
    templatePreset
      ? {
          ...templatePreset,
          ...theme,
          customColors: {
            ...templatePreset.customColors,
            ...explicitCustomColors,
          },
        }
      : theme,
  );
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
            preset.colors[10],
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
  const blockRadius = Math.round(settings.blockCorner * 0.32);
  const blockInnerRadius = Math.round(blockRadius * 0.62);
  const blockBorderWidth = Number((settings.blockBorder * 0.04).toFixed(2));
  const blockShadowOpacity = Number((settings.blockShadow * 0.0024).toFixed(3));
  const blockShadowY = Math.round(settings.blockShadow * 0.08);
  const blockShadowBlur = Math.round(settings.blockShadow * 0.24);
  const blockGap = Math.round(8 + settings.blockSpacing * 0.24);

  return {
    ...settings,
    color,
    palette,
    overlayOpacity: settings.coverOverlayOpacity / 100,
    radiusClass: {
      sharp: 'rounded-none',
      soft: 'rounded-xl',
      rounded: 'rounded-3xl',
    }[settings.radiusPreset],
    blockStyle: {
      borderColor: settings.blockBorderColor,
      borderRadius: `${blockRadius}px`,
      borderStyle: 'solid' as const,
      borderWidth: `${blockBorderWidth}px`,
      boxShadow:
        settings.blockShadow > 0
          ? settings.blockShadowStyle === 'solid'
            ? `${blockShadowY}px ${blockShadowY}px 0 ${settings.blockBorderColor}`
            : `0 ${blockShadowY}px ${blockShadowBlur}px rgba(15, 23, 42, ${blockShadowOpacity})`
          : 'none',
    },
    blockInnerStyle: {
      borderRadius: `${blockInnerRadius}px`,
    },
    blockGap,
    fontFamilies,
  };
}
