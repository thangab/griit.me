'use client';

import { useMemo, useState } from 'react';
import type { Route } from 'next';
import Link from 'next/link';
import {
  CaretDownIcon,
  CheckIcon,
  MagnifyingGlassIcon,
  SquaresFourIcon,
  XIcon,
} from '@phosphor-icons/react/ssr';
import type { AthleteDirectorySport } from '@/lib/services/athlete-directory';
import { cn } from '@/lib/utils/cn';

type AthleteSportFilterProps = {
  sports: AthleteDirectorySport[];
  selectedSlug?: string;
};

const quickSportCount = 7;

export function AthleteSportFilter({
  sports,
  selectedSlug,
}: AthleteSportFilterProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const selectedSport = sports.find((sport) => sport.slug === selectedSlug);
  const quickSports = useMemo(() => {
    const popular = sports.slice(0, quickSportCount);
    if (
      !selectedSport ||
      popular.some((sport) => sport.slug === selectedSlug)
    ) {
      return popular;
    }
    return [selectedSport, ...popular.slice(0, quickSportCount - 1)];
  }, [selectedSlug, selectedSport, sports]);
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const filteredSports = normalizedQuery
    ? sports.filter((sport) =>
        sport.name.toLocaleLowerCase().includes(normalizedQuery),
      )
    : sports;

  const linkClass = (active: boolean) =>
    cn(
      'inline-flex h-9 shrink-0 items-center gap-1.5 rounded-xl border px-3.5 text-xs font-bold transition-colors',
      active
        ? 'border-[#151515] bg-[#151515] text-white shadow-sm'
        : 'border-black/8 bg-white text-black/65 hover:border-black/20 hover:text-black',
    );

  return (
    <div className="relative z-20 mx-auto mt-12 max-w-5xl text-left">
      <div className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white/85 p-2 shadow-[0_14px_40px_rgba(15,23,42,0.09)] backdrop-blur-xl">
        <div className="flex min-w-0 flex-1 [scrollbar-width:none] items-center gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          <Link className={linkClass(!selectedSlug)} href="/athletes">
            <SquaresFourIcon className="h-3.5 w-3.5" weight="bold" />
            All
          </Link>
          {quickSports.map((sport) => (
            <Link
              className={linkClass(selectedSlug === sport.slug)}
              href={`/athletes/${sport.slug}` as Route}
              key={sport.slug}
            >
              {sport.name}
            </Link>
          ))}
        </div>

        <button
          aria-expanded={open}
          className={cn(
            'flex h-9 shrink-0 items-center gap-2 rounded-xl px-3.5 text-xs font-bold transition-colors',
            open
              ? 'bg-[#3157ff] text-white'
              : 'bg-[#3157ff]/8 text-[#3157ff] hover:bg-[#3157ff]/12',
          )}
          type="button"
          onClick={() => setOpen((current) => !current)}
        >
          <span className="hidden sm:inline">Browse sports</span>
          <span className="sm:hidden">Browse</span>
          <span className="rounded-md bg-current/10 px-1.5 py-0.5 text-[10px]">
            {sports.length}
          </span>
          <CaretDownIcon
            className={cn(
              'h-3.5 w-3.5 transition-transform',
              open && 'rotate-180',
            )}
            weight="bold"
          />
        </button>
      </div>

      {open ? (
        <div className="absolute top-[calc(100%+0.65rem)] right-0 left-0 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.18)]">
          <div className="flex items-start justify-between gap-4 border-b border-black/8 px-4 py-3.5 sm:px-5">
            <div>
              <p className="text-sm font-black">Find your sport</p>
              <p className="mt-0.5 text-xs text-black/42">
                All sports, with the most popular first.
              </p>
            </div>
            <button
              aria-label="Close sports"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-black/[0.04] text-black/45 hover:bg-black/[0.08] hover:text-black"
              type="button"
              onClick={() => setOpen(false)}
            >
              <XIcon className="h-3.5 w-3.5" weight="bold" />
            </button>
          </div>

          <div className="p-3 sm:p-4">
            <label className="flex h-11 items-center gap-2 rounded-xl border border-black/10 bg-black/[0.02] px-3 focus-within:border-[#3157ff] focus-within:ring-3 focus-within:ring-[#3157ff]/10">
              <MagnifyingGlassIcon className="h-4 w-4 shrink-0 text-black/35" />
              <input
                autoFocus
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-black/32"
                placeholder="Search all sports…"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              <span className="text-[10px] font-bold text-black/35">
                {filteredSports.length}
              </span>
            </label>

            <div className="mt-3 max-h-72 overflow-y-auto pr-1">
              {filteredSports.length ? (
                <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-1.5">
                  {filteredSports.map((sport) => {
                    const active = selectedSlug === sport.slug;
                    return (
                      <Link
                        className={cn(
                          'flex min-h-10 min-w-0 items-center justify-between gap-2 rounded-lg px-3 text-xs font-semibold transition-colors',
                          active
                            ? 'bg-[#3157ff]/10 text-[#3157ff]'
                            : 'text-black/65 hover:bg-black/[0.04] hover:text-black',
                        )}
                        href={`/athletes/${sport.slug}` as Route}
                        key={sport.slug}
                        onClick={() => setOpen(false)}
                      >
                        <span className="whitespace-nowrap">{sport.name}</span>
                        {active ? (
                          <CheckIcon
                            className="h-3.5 w-3.5 shrink-0"
                            weight="bold"
                          />
                        ) : null}
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-black/10 px-4 py-8 text-center text-sm text-black/40">
                  No sport matches “{query.trim()}”.
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
