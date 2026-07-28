'use client';

import { createContext, useContext, useEffect } from 'react';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary, DictionaryKey } from '@/lib/i18n/dictionaries';

type I18nContextValue = {
  locale: Locale;
  dictionary: Dictionary;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
  children,
  dictionary,
  locale,
}: I18nContextValue & { children: React.ReactNode }) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <I18nContext.Provider value={{ dictionary, locale }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used inside I18nProvider.');

  return {
    locale: context.locale,
    t: (key: DictionaryKey) => context.dictionary[key],
  };
}
