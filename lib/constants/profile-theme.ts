export const colorPresets = [
  { id: 'minimal', name: 'Minimal', colors: ['#f8fafc', '#0f172a', '#475569'], proOnly: false },
  { id: 'midnight_blue', name: 'Midnight', colors: ['#071426', '#f8fafc', '#3b82f6'], proOnly: false },
  { id: 'obsidian_lime', name: 'Obsidian', colors: ['#09090b', '#fafafa', '#a3e635'], proOnly: false },
  { id: 'performance_red', name: 'Performance', colors: ['#fff7ed', '#18181b', '#ef4444'], proOnly: true },
  { id: 'endurance_orange', name: 'Endurance', colors: ['#18181b', '#fafafa', '#f97316'], proOnly: true },
  { id: 'forest', name: 'Forest', colors: ['#102a22', '#f7fee7', '#6ee7b7'], proOnly: true },
  { id: 'electric_purple', name: 'Electric', colors: ['#11102a', '#fafafa', '#a78bfa'], proOnly: true },
] as const;

export const fontPresets = [
  { id: 'clean', name: 'Clean', sample: 'Modern & clear', proOnly: false },
  { id: 'athletic', name: 'Athletic', sample: 'Bold & powerful', proOnly: true },
  { id: 'editorial', name: 'Editorial', sample: 'Refined & expressive', proOnly: true },
  { id: 'technical', name: 'Technical', sample: 'Precise & modern', proOnly: true },
] as const;

export const overlayPresets = ['light', 'balanced', 'strong'] as const;
export const radiusPresets = ['sharp', 'soft', 'rounded'] as const;
export const galleryLayouts = ['grid', 'editorial', 'carousel'] as const;

export type ColorPresetId = (typeof colorPresets)[number]['id'];
export type FontPresetId = (typeof fontPresets)[number]['id'];
export type OverlayPreset = (typeof overlayPresets)[number];
export type RadiusPreset = (typeof radiusPresets)[number];
export type GalleryLayout = (typeof galleryLayouts)[number];

export type ProfileThemeSettings = {
  colorPreset: ColorPresetId;
  fontPreset: FontPresetId;
  coverOverlay: OverlayPreset;
  radiusPreset: RadiusPreset;
  galleryLayout: GalleryLayout;
};

export const defaultThemeSettings: ProfileThemeSettings = {
  colorPreset: 'minimal', fontPreset: 'clean', coverOverlay: 'balanced', radiusPreset: 'rounded', galleryLayout: 'grid',
};

function resolveId<T extends readonly { id: string }[]>(items: T, value: unknown, fallback: T[number]['id']) {
  return items.some((item) => item.id === value) ? (value as T[number]['id']) : fallback;
}

export function resolveThemeSettings(theme: Record<string, unknown>): ProfileThemeSettings {
  return {
    colorPreset: resolveId(colorPresets, theme.colorPreset, defaultThemeSettings.colorPreset),
    fontPreset: resolveId(fontPresets, theme.fontPreset, defaultThemeSettings.fontPreset),
    coverOverlay: overlayPresets.includes(theme.coverOverlay as OverlayPreset) ? theme.coverOverlay as OverlayPreset : defaultThemeSettings.coverOverlay,
    radiusPreset: radiusPresets.includes(theme.radiusPreset as RadiusPreset) ? theme.radiusPreset as RadiusPreset : defaultThemeSettings.radiusPreset,
    galleryLayout: galleryLayouts.includes(theme.galleryLayout as GalleryLayout) ? theme.galleryLayout as GalleryLayout : defaultThemeSettings.galleryLayout,
  };
}

export function getThemeRuntime(theme: Record<string, unknown>) {
  const settings = resolveThemeSettings(theme);
  const color = colorPresets.find((item) => item.id === settings.colorPreset) ?? colorPresets[0];
  const fontFamilies = {
    clean: { heading: 'ui-sans-serif, system-ui, sans-serif', body: 'ui-sans-serif, system-ui, sans-serif' },
    athletic: { heading: 'Impact, "Arial Black", sans-serif', body: 'Arial, sans-serif' },
    editorial: { heading: 'Georgia, serif', body: 'ui-sans-serif, system-ui, sans-serif' },
    technical: { heading: 'ui-monospace, SFMono-Regular, monospace', body: 'ui-sans-serif, system-ui, sans-serif' },
  }[settings.fontPreset];
  return {
    ...settings, color,
    overlayOpacity: { light: 0.35, balanced: 0.58, strong: 0.76 }[settings.coverOverlay],
    radiusClass: { sharp: 'rounded-none', soft: 'rounded-xl', rounded: 'rounded-3xl' }[settings.radiusPreset],
    fontFamilies,
  };
}
