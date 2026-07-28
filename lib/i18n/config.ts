export const locales = ['en', 'fr'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';
export const localeCookieName = 'griit_locale';

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && locales.includes(value as Locale);
}

export function resolveLocale(value: unknown): Locale {
  return isLocale(value) ? value : defaultLocale;
}
