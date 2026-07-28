'use client';

import { useEffect, useState } from 'react';
import {
  defaultLocale,
  isLocale,
  localeCookieName,
  type Locale,
} from '@/lib/i18n/config';

const errorCopy = {
  en: {
    eyebrow: 'Oops',
    title: 'Something went wrong.',
    description: 'A problem occurred while loading this page.',
    retry: 'Try again',
  },
  fr: {
    eyebrow: 'Oups',
    title: 'Une erreur est survenue.',
    description: 'Un problème est survenu pendant le chargement de cette page.',
    retry: 'Réessayer',
  },
} as const;

export default function Error({ reset }: { reset: () => void }) {
  const [locale, setLocale] = useState<Locale>(defaultLocale);

  useEffect(() => {
    const cookieLocale = document.cookie
      .split('; ')
      .find((cookie) => cookie.startsWith(`${localeCookieName}=`))
      ?.split('=')[1];
    const documentLocale = document.documentElement.lang.split('-')[0];

    if (isLocale(cookieLocale)) {
      setLocale(cookieLocale);
    } else if (isLocale(documentLocale)) {
      setLocale(documentLocale);
    }
  }, []);

  const copy = errorCopy[locale];

  return (
    <div className="bg-background flex min-h-screen items-center justify-center px-6">
      <div className="border-border bg-card w-full max-w-md rounded-xl border p-8 text-center">
        <p className="text-muted-foreground text-sm font-medium tracking-[0.2em] uppercase">
          {copy.eyebrow}
        </p>
        <h2 className="mt-3 text-2xl font-semibold">{copy.title}</h2>
        <p className="text-muted-foreground mt-2 text-sm">{copy.description}</p>
        <button
          onClick={() => reset()}
          className="bg-primary text-primary-foreground mt-6 rounded-lg px-4 py-2 text-sm font-medium"
        >
          {copy.retry}
        </button>
      </div>
    </div>
  );
}
