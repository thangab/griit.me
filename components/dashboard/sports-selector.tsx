'use client';

import { useMemo, useState } from 'react';
import {
  CheckIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  XIcon,
} from '@phosphor-icons/react/ssr';
import { createSportSlug, type SportOption } from '@/lib/constants/sports';
import { cn } from '@/lib/utils/cn';

type SportsSelectorProps = {
  sports: readonly SportOption[];
  selectedSlugs: string[];
  maxSelections: number;
  onChange: (selectedSlugs: string[], customSports: SportOption[]) => void;
};

function normalizeSearch(value: string) {
  return value.trim().toLocaleLowerCase();
}

export function SportsSelector({
  sports,
  selectedSlugs,
  maxSelections,
  onChange,
}: SportsSelectorProps) {
  const [query, setQuery] = useState('');
  const [customSports, setCustomSports] = useState<SportOption[]>([]);
  const allSports = useMemo(() => {
    const seen = new Set<string>();
    return [...sports, ...customSports].filter((sport) => {
      if (seen.has(sport.slug)) return false;
      seen.add(sport.slug);
      return true;
    });
  }, [customSports, sports]);
  const normalizedQuery = normalizeSearch(query);
  const normalizedQuerySlug = createSportSlug(normalizedQuery);
  const matchingSports = normalizedQuery
    ? allSports.filter(
        (sport) =>
          sport.name.toLocaleLowerCase().includes(normalizedQuery) ||
          (Boolean(normalizedQuerySlug) &&
            sport.slug.includes(normalizedQuerySlug)),
      )
    : allSports;
  const selectedSports = selectedSlugs.flatMap((slug) => {
    const sport = allSports.find((item) => item.slug === slug);
    return sport ? [sport] : [];
  });
  const customSlug = normalizedQuerySlug;
  const exactMatch = allSports.find(
    (sport) =>
      normalizeSearch(sport.name) === normalizedQuery ||
      sport.slug === customSlug,
  );
  const canAddCustom =
    normalizedQuery.length >= 2 && Boolean(customSlug) && !exactMatch;
  const reachedLimit = selectedSlugs.length >= maxSelections;

  const updateSelection = (nextSlugs: string[], nextCustom = customSports) => {
    onChange(nextSlugs, nextCustom);
  };

  const toggleSport = (slug: string) => {
    if (selectedSlugs.includes(slug)) {
      updateSelection(selectedSlugs.filter((item) => item !== slug));
      return;
    }

    if (!reachedLimit) updateSelection([...selectedSlugs, slug]);
  };

  const addCustomSport = () => {
    const name = query.trim().replace(/\s+/g, ' ').slice(0, 32);
    if (!name || !customSlug || reachedLimit) return;

    if (exactMatch) {
      toggleSport(exactMatch.slug);
      setQuery('');
      return;
    }

    const sport = { name, slug: customSlug, isCustom: true };
    const nextCustomSports = [...customSports, sport];
    setCustomSports(nextCustomSports);
    setQuery('');
    updateSelection([...selectedSlugs, sport.slug], nextCustomSports);
  };

  return (
    <div className="space-y-3">
      {selectedSports.length ? (
        <div className="flex flex-wrap gap-2">
          {selectedSports.map((sport) => (
            <button
              className="bg-primary/10 text-primary hover:bg-primary/15 grid min-h-8 max-w-full grid-cols-[minmax(0,1fr)_12px] items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-left text-xs leading-4 font-semibold transition-colors"
              key={sport.slug}
              type="button"
              onClick={() => toggleSport(sport.slug)}
            >
              <span className="flex min-w-0 items-center gap-1.5 whitespace-nowrap">
                {sport.name}
                {sport.isCustom ? (
                  <span className="border-primary/20 bg-background/70 rounded px-1 py-0.5 text-[8px] font-bold tracking-wide uppercase">
                    Custom
                  </span>
                ) : null}
              </span>
              <XIcon className="h-3 w-3" weight="bold" />
            </button>
          ))}
        </div>
      ) : null}

      {selectedSlugs.map((slug) => (
        <input key={slug} name="sportSlugs" type="hidden" value={slug} />
      ))}
      {customSports.map((sport) => (
        <input
          key={sport.slug}
          name="customSport"
          type="hidden"
          value={JSON.stringify(sport)}
        />
      ))}

      <div className="border-border bg-background focus-within:border-primary focus-within:ring-primary/10 flex h-11 items-center gap-2 rounded-lg border px-3 transition focus-within:ring-3">
        <MagnifyingGlassIcon className="text-muted-foreground h-4 w-4 shrink-0" />
        <input
          aria-label="Search sports"
          className="placeholder:text-muted-foreground min-w-0 flex-1 bg-transparent text-sm outline-none"
          placeholder="Search for a sport…"
          maxLength={32}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <span className="text-muted-foreground text-[11px] font-medium">
          {selectedSlugs.length}/{maxSelections}
        </span>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between gap-3">
          <div>
            <p className="text-muted-foreground text-[11px] font-semibold tracking-[0.08em] uppercase">
              {normalizedQuery ? 'Search results' : 'All sports'}
            </p>
            {!normalizedQuery ? (
              <p className="text-muted-foreground mt-0.5 text-[11px]">
                Most popular first
              </p>
            ) : null}
          </div>
          <div className="text-muted-foreground text-right text-[11px]">
            <p>
              {matchingSports.length}{' '}
              {matchingSports.length === 1 ? 'sport' : 'sports'}
            </p>
            {reachedLimit ? <p>Selection limit reached</p> : null}
          </div>
        </div>

        <div className="border-border bg-muted/15 max-h-60 overflow-y-auto rounded-xl border p-2 pr-1.5 shadow-inner">
          {matchingSports.length ? (
            <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-2">
              {matchingSports.map((sport) => {
                const selected = selectedSlugs.includes(sport.slug);
                const disabled = reachedLimit && !selected;

                return (
                  <button
                    aria-pressed={selected}
                    className={cn(
                      'border-border bg-background grid min-h-12 min-w-0 grid-cols-[minmax(0,1fr)_16px] items-center gap-2 rounded-lg border px-3 py-2 text-left text-xs leading-4 font-semibold transition-colors',
                      selected
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'hover:border-primary/35 hover:bg-muted/40',
                      sport.isCustom && 'col-span-full border-dashed',
                      disabled && 'cursor-not-allowed opacity-40',
                    )}
                    disabled={disabled}
                    key={sport.slug}
                    type="button"
                    onClick={() => toggleSport(sport.slug)}
                  >
                    <span className="flex min-w-0 items-center gap-1.5 whitespace-nowrap">
                      <span>{sport.name}</span>
                      {sport.isCustom ? (
                        <span className="border-border bg-muted text-muted-foreground rounded border px-1 py-0.5 text-[8px] font-bold tracking-wide uppercase">
                          Custom
                        </span>
                      ) : null}
                    </span>
                    {selected ? (
                      <CheckIcon
                        className="h-3.5 w-3.5 shrink-0"
                        weight="bold"
                      />
                    ) : null}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="border-border text-muted-foreground rounded-lg border border-dashed px-4 py-5 text-center text-xs">
              No sport found for “{query.trim()}”.
            </div>
          )}
        </div>
      </div>

      {canAddCustom ? (
        <button
          className="border-primary/25 bg-primary/5 text-primary hover:bg-primary/10 flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-45"
          disabled={reachedLimit}
          type="button"
          onClick={addCustomSport}
        >
          <span className="bg-primary/10 flex h-8 w-8 shrink-0 items-center justify-center rounded-md">
            <PlusIcon className="h-4 w-4" weight="bold" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-xs font-semibold">
              Add “{query.trim()}”
            </span>
            <span className="text-muted-foreground mt-0.5 block text-[11px]">
              Create it as a new sport
            </span>
          </span>
        </button>
      ) : null}
    </div>
  );
}
