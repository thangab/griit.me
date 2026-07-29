'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { setLocaleAction } from '@/lib/actions/locale';
import { useI18n } from '@/components/i18n/i18n-provider';
import { type Locale } from '@/lib/i18n/config';
import { cn } from '@/lib/utils/cn';

export function LanguageSwitcher({
  compact = false,
  inverted = false,
  variant = 'buttons',
}: {
  compact?: boolean;
  inverted?: boolean;
  variant?: 'buttons' | 'select';
}) {
  const { locale, t } = useI18n();
  const router = useRouter();
  const [selectedLocale, setSelectedLocale] = useState(locale);
  const [isPending, startTransition] = useTransition();

  const changeLocale = (nextLocale: Locale) => {
    setSelectedLocale(nextLocale);

    startTransition(async () => {
      const formData = new FormData();
      formData.set('locale', nextLocale);

      try {
        await setLocaleAction(formData);
        router.refresh();
      } catch {
        setSelectedLocale(locale);
      }
    });
  };

  if (variant === 'select') {
    return (
      <div aria-label={t('language.label')}>
        <label className="sr-only" htmlFor="marketing-language">
          {t('language.label')}
        </label>
        <select
          aria-busy={isPending}
          className={cn(
            'cursor-pointer rounded-full border font-bold transition-colors outline-none focus:ring-2 focus:ring-[#3157ff]/25',
            compact ? 'h-9 px-3 text-xs' : 'h-10 px-4 text-sm',
            inverted
              ? 'border-white/15 bg-white/[0.06] text-white'
              : 'border-black/10 bg-white text-[#151515] hover:border-black/20',
          )}
          disabled={isPending}
          id="marketing-language"
          value={selectedLocale}
          onChange={(event) => changeLocale(event.target.value as Locale)}
        >
          <option value="en">{t('language.english')}</option>
          <option value="fr">{t('language.french')}</option>
        </select>
      </div>
    );
  }

  return (
    <form
      action={setLocaleAction}
      aria-label={t('language.label')}
      className={cn(
        'inline-flex rounded-full border p-1',
        inverted
          ? 'border-white/15 bg-white/[0.06]'
          : 'border-black/10 bg-white',
      )}
    >
      {(['en', 'fr'] as const).map((option) => (
        <button
          key={option}
          aria-pressed={locale === option}
          className={cn(
            'rounded-full font-bold transition-colors',
            compact ? 'px-2 py-1 text-[10px]' : 'px-3 py-1.5 text-xs',
            locale === option
              ? inverted
                ? 'bg-white text-[#151515]'
                : 'bg-[#151515] text-white'
              : inverted
                ? 'text-white/55 hover:text-white'
                : 'text-black/45 hover:text-black',
          )}
          name="locale"
          type="submit"
          value={option}
        >
          {option.toUpperCase()}
        </button>
      ))}
    </form>
  );
}
