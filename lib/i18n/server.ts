import 'server-only';

import { cookies, headers } from 'next/headers';
import {
  defaultLocale,
  isLocale,
  localeCookieName,
  type Locale,
} from '@/lib/i18n/config';
import { dictionaries } from '@/lib/i18n/dictionaries';

export async function getRequestLocale(): Promise<Locale> {
  const cookieLocale = (await cookies()).get(localeCookieName)?.value;
  if (isLocale(cookieLocale)) return cookieLocale;

  const acceptedLanguages = (await headers()).get('accept-language') ?? '';
  const preferredLanguage = acceptedLanguages
    .split(',')
    .map((value) => value.trim().split(';')[0]?.toLowerCase())
    .find(Boolean);

  return preferredLanguage?.startsWith('fr') ? 'fr' : defaultLocale;
}

export async function getRequestDictionary() {
  const locale = await getRequestLocale();
  return { locale, dictionary: dictionaries[locale] };
}
