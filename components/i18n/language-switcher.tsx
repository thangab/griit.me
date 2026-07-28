'use client';

import { setLocaleAction } from '@/lib/actions/locale';
import { useI18n } from '@/components/i18n/i18n-provider';
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

  if (variant === 'select') {
    return (
      <form action={setLocaleAction} aria-label={t('language.label')}>
        <label className="sr-only" htmlFor="marketing-language">
          {t('language.label')}
        </label>
        <select
          className={cn(
            'cursor-pointer rounded-full border font-bold transition-colors outline-none focus:ring-2 focus:ring-[#3157ff]/25',
            compact ? 'h-9 px-3 text-xs' : 'h-10 px-4 text-sm',
            inverted
              ? 'border-white/15 bg-white/[0.06] text-white'
              : 'border-black/10 bg-white text-[#151515] hover:border-black/20',
          )}
          id="marketing-language"
          name="locale"
          value={locale}
          onChange={(event) => event.currentTarget.form?.requestSubmit()}
        >
          <option value="en">{t('language.english')}</option>
          <option value="fr">{t('language.french')}</option>
        </select>
      </form>
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
