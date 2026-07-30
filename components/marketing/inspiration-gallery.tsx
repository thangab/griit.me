'use client';

import { useMemo, useState } from 'react';
import type { Route } from 'next';
import Link from 'next/link';
import {
  ArrowUpRightIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  SparkleIcon,
  TargetIcon,
} from '@phosphor-icons/react';
import { ProfileAvatar } from '@/components/profile/profile-avatar';
import { PublicProfilePreviewCard } from '@/components/marketing/public-profile-preview-card';
import {
  getHeaderSheetBackground,
  getThemeRuntime,
} from '@/lib/constants/profile-theme';
import type { Locale } from '@/lib/i18n/config';
import type { AthleteDirectoryEntry } from '@/lib/services/athlete-directory';

const PAGE_SIZE = 12;

function withoutUnsplash(url: string) {
  if (!url) return '';

  try {
    return new URL(url).hostname.endsWith('unsplash.com') ? '' : url;
  } catch {
    return url;
  }
}

function getTemplateName(athlete: AthleteDirectoryEntry) {
  const templateId = athlete.theme.templateId;
  if (typeof templateId !== 'string' || !templateId) return 'Custom';
  return templateId
    .replaceAll('_', ' ')
    .replaceAll('-', ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function getColorTone(color: string) {
  const normalized = color.trim().replace('#', '');
  const hex =
    normalized.length === 3
      ? normalized
          .split('')
          .map((character) => character + character)
          .join('')
      : normalized;

  if (!/^[0-9a-f]{6}$/i.test(hex)) return 'light';

  const red = Number.parseInt(hex.slice(0, 2), 16);
  const green = Number.parseInt(hex.slice(2, 4), 16);
  const blue = Number.parseInt(hex.slice(4, 6), 16);
  const luminance = (red * 299 + green * 587 + blue * 114) / 1000;
  return luminance < 145 ? 'dark' : 'light';
}

function HeaderDecoration({
  accent,
  geometry,
  texture,
}: {
  accent: string;
  geometry: ReturnType<typeof getThemeRuntime>['headerGeometry'];
  texture: ReturnType<typeof getThemeRuntime>['headerTexture'];
}) {
  const textureStyle =
    texture === 'grid'
      ? {
          backgroundImage:
            'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }
      : texture === 'diagonal'
        ? {
            backgroundImage:
              'repeating-linear-gradient(135deg, transparent 0 9px, currentColor 9px 10px)',
          }
        : texture === 'dots'
          ? {
              backgroundImage:
                'radial-gradient(currentColor 1.2px, transparent 1.2px)',
              backgroundSize: '14px 14px',
            }
          : texture === 'scanlines'
            ? {
                backgroundImage:
                  'repeating-linear-gradient(to bottom, transparent 0 6px, currentColor 6px 7px)',
              }
            : null;

  return (
    <>
      {textureStyle ? (
        <span
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{ color: accent, ...textureStyle }}
        />
      ) : null}
      {geometry === 'velocity' ? (
        <span
          className="pointer-events-none absolute -top-10 -right-7 h-48 w-28 rotate-12 opacity-80"
          style={{
            backgroundColor: accent,
            clipPath: 'polygon(24% 0, 100% 0, 76% 100%, 0 100%)',
          }}
        />
      ) : geometry === 'rings' ? (
        <span
          className="pointer-events-none absolute -top-10 -right-12 h-40 w-40 rounded-full border-[16px] opacity-40"
          style={{ borderColor: accent }}
        />
      ) : geometry === 'chevrons' ? (
        <span
          className="pointer-events-none absolute top-1/4 -right-4 h-32 w-28 opacity-50"
          style={{
            backgroundColor: accent,
            clipPath:
              'polygon(0 0, 48% 0, 100% 50%, 48% 100%, 0 100%, 52% 50%)',
          }}
        />
      ) : geometry === 'blocks' ? (
        <>
          <span
            className="pointer-events-none absolute -top-5 right-8 h-28 w-16 rotate-12 opacity-65"
            style={{ backgroundColor: accent }}
          />
          <span
            className="pointer-events-none absolute top-24 -right-5 h-16 w-28 -rotate-6 opacity-30"
            style={{ backgroundColor: accent }}
          />
        </>
      ) : null}
    </>
  );
}

// Kept as the lightweight fallback design reference for future card variants.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function AthleteCard({
  athlete,
  locale,
}: {
  athlete: AthleteDirectoryEntry;
  locale: Locale;
}) {
  const theme = getThemeRuntime(athlete.theme);
  const visibleSports = athlete.sports.slice(0, 3);
  const avatarUrl = withoutUnsplash(athlete.avatarUrl);
  const coverUrl = withoutUnsplash(athlete.coverUrl);
  const isDemo = athlete.username.startsWith('demo_');
  const canShowCover = theme.coverType === 'image' && Boolean(coverUrl);
  const coverBackground = canShowCover
    ? {
        backgroundColor: theme.coverColor,
        backgroundImage: `url("${coverUrl.replaceAll('"', '%22')}")`,
      }
    : theme.coverType === 'gradient'
      ? {
          backgroundColor: theme.coverColor,
          backgroundImage: `linear-gradient(135deg, ${theme.coverGradientFrom}, ${theme.coverGradientTo})`,
        }
      : { backgroundColor: theme.coverColor };
  const isCentered = theme.headerLayout === 'centered';
  const isSplit = theme.headerLayout === 'split';

  return (
    <Link
      className="group block min-w-0 focus-visible:rounded-[2rem] focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#3157ff]"
      href={`/${athlete.username}` as Route}
      rel="noopener noreferrer"
      target="_blank"
    >
      <article className="rounded-[2rem] border border-black/10 bg-white p-2.5 shadow-[0_18px_45px_rgba(20,20,20,0.1)] transition duration-300 group-hover:-translate-y-1.5 group-hover:border-black/20 group-hover:shadow-[0_28px_65px_rgba(20,20,20,0.17)]">
        <div className="flex h-10 min-w-0 items-center gap-2 px-2">
          <span className="flex shrink-0 gap-1.5" aria-hidden="true">
            <span className="h-2 w-2 rounded-full bg-[#ff6b61]" />
            <span className="h-2 w-2 rounded-full bg-[#ffc64c]" />
            <span className="h-2 w-2 rounded-full bg-[#45c86b]" />
          </span>
          <span className="min-w-0 flex-1 truncate rounded-full bg-[#f3f3ef] px-3 py-1.5 text-center text-[9px] font-bold text-black/40">
            griit.me/{athlete.username}
          </span>
          {isDemo ? (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#e8edff] px-2 py-1 text-[8px] font-black tracking-[0.08em] text-[#3157ff] uppercase">
              <SparkleIcon className="h-2.5 w-2.5" weight="fill" />
              Demo
            </span>
          ) : null}
        </div>

        <div
          className="relative aspect-[3/4] overflow-hidden rounded-[1.45rem]"
          style={{
            backgroundColor: theme.palette.background,
            color: theme.palette.text,
            fontFamily: theme.fontFamilies.body,
          }}
        >
          <div
            className="relative flex h-[58%] overflow-hidden bg-cover bg-center"
            style={{ ...coverBackground, color: theme.palette.headerText }}
          >
            {canShowCover ? (
              <span
                className="absolute inset-0"
                style={{
                  backgroundColor: theme.coverOverlayColor,
                  opacity: theme.overlayOpacity,
                }}
              />
            ) : null}
            <span
              className="absolute inset-0"
              style={{
                background: getHeaderSheetBackground(
                  theme.headerSheetColor,
                  theme.headerSheetCoverage,
                ),
              }}
            />
            <HeaderDecoration
              accent={theme.palette.accent}
              geometry={theme.headerGeometry}
              texture={theme.headerTexture}
            />
            <div
              className={`relative z-10 flex w-full flex-col p-6 ${
                isCentered
                  ? 'items-center justify-center text-center'
                  : isSplit
                    ? 'justify-between'
                    : 'items-start justify-end text-left'
              }`}
            >
              {isSplit ? (
                <span className="text-[9px] font-black tracking-[0.22em] uppercase opacity-65">
                  @{athlete.username}
                </span>
              ) : null}
              <div className={isCentered ? 'flex flex-col items-center' : ''}>
                <ProfileAvatar
                  avatarUrl={avatarUrl}
                  className="bg-white/15 shadow-[0_8px_24px_rgba(15,23,42,0.2)]"
                  displayName={athlete.displayName}
                  shape={theme.headerAvatarShape}
                  size={72}
                />
                <h2
                  className="mt-4 max-w-[85%] text-2xl leading-none font-black"
                  style={{ fontFamily: theme.fontFamilies.heading }}
                >
                  {athlete.displayName}
                </h2>
                {!isSplit ? (
                  <p className="mt-2 text-[10px] font-bold opacity-60">
                    @{athlete.username}
                  </p>
                ) : null}
                {athlete.goal ? (
                  <p className="mt-5 line-clamp-2 max-w-[90%] text-base leading-tight font-black">
                    {athlete.goal}
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          <div
            className="relative flex h-[42%] flex-col px-5 py-5"
            style={{ backgroundColor: theme.palette.background }}
          >
            {athlete.bio ? (
              <div
                className="line-clamp-2 px-4 py-3 text-xs leading-5"
                style={{
                  ...theme.blockStyle,
                  backgroundColor: theme.palette.surface,
                  color: theme.palette.description,
                }}
              >
                {athlete.bio}
              </div>
            ) : null}
            <div className="mt-auto space-y-3">
              <div className="flex min-w-0 flex-wrap items-center gap-1.5">
                {visibleSports.map((sport) => (
                  <span
                    className="rounded-full px-2.5 py-1 text-[9px] font-black tracking-[0.08em] uppercase"
                    key={sport.slug}
                    style={{
                      backgroundColor: theme.palette.social,
                      color: theme.palette.socialText,
                    }}
                  >
                    {sport.name}
                  </span>
                ))}
              </div>
              <div
                className="flex items-center justify-between gap-3 px-4 py-3 text-xs font-bold"
                style={{
                  ...theme.blockStyle,
                  backgroundColor: theme.palette.accent,
                  color: theme.palette.accentText,
                }}
              >
                <span className="truncate">
                  {locale === 'fr' ? 'Voir le profil' : 'View profile'}
                </span>
                {athlete.location ? (
                  <span className="flex min-w-0 items-center gap-1 opacity-75">
                    <MapPinIcon className="h-3.5 w-3.5 shrink-0" />
                    <span className="max-w-24 truncate">
                      {athlete.location}
                    </span>
                  </span>
                ) : (
                  <ArrowUpRightIcon className="h-4 w-4" weight="bold" />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 px-2 pt-4 pb-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-black tracking-tight">
              {athlete.displayName}
            </p>
            <p className="mt-1 truncate text-[10px] font-bold text-black/40">
              {visibleSports[0]?.name ??
                (locale === 'fr' ? 'Profil sportif' : 'Athlete profile')}{' '}
              · {getTemplateName(athlete)}
            </p>
          </div>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#151515] text-white transition-transform duration-300 group-hover:scale-105 group-hover:rotate-6">
            <ArrowUpRightIcon className="h-4 w-4" weight="bold" />
          </span>
        </div>
      </article>
    </Link>
  );
}

export function InspirationGallery({
  athletes,
  locale,
}: {
  athletes: AthleteDirectoryEntry[];
  locale: Locale;
}) {
  const isFrench = locale === 'fr';
  const [query, setQuery] = useState('');
  const [sport, setSport] = useState('all');
  const [template, setTemplate] = useState('all');
  const [tone, setTone] = useState('all');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const templates = useMemo(
    () =>
      Array.from(new Set(athletes.map(getTemplateName))).sort((a, b) =>
        a.localeCompare(b),
      ),
    [athletes],
  );
  const sports = useMemo(
    () =>
      Array.from(
        new Map(
          athletes
            .flatMap((athlete) => athlete.sports)
            .map((item) => [item.slug, item]),
        ).values(),
      ).sort((first, second) => first.name.localeCompare(second.name)),
    [athletes],
  );
  const filteredAthletes = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase(locale);

    return athletes.filter((athlete) => {
      const theme = getThemeRuntime(athlete.theme);
      const searchableText = [
        athlete.displayName,
        athlete.username,
        athlete.bio,
        athlete.goal,
        athlete.location,
        ...athlete.sports.map((sport) => sport.name),
      ]
        .join(' ')
        .toLocaleLowerCase(locale);

      return (
        (!normalizedQuery || searchableText.includes(normalizedQuery)) &&
        (sport === 'all' ||
          athlete.sports.some((item) => item.slug === sport)) &&
        (template === 'all' || getTemplateName(athlete) === template) &&
        (tone === 'all' || getColorTone(theme.palette.background) === tone)
      );
    });
  }, [athletes, locale, query, sport, template, tone]);
  const hasActiveFilters = Boolean(
    query || sport !== 'all' || template !== 'all' || tone !== 'all',
  );

  return (
    <>
      <div className="rounded-[2rem] border border-black/10 bg-[#f7f7f3] p-4 sm:p-5">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_190px_210px_180px]">
          <label className="relative block">
            <span className="sr-only">
              {isFrench ? 'Rechercher un profil' : 'Search profiles'}
            </span>
            <MagnifyingGlassIcon className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-black/35" />
            <input
              className="h-13 w-full rounded-2xl border border-black/10 bg-white pr-4 pl-12 text-sm font-semibold transition outline-none focus:border-[#3157ff] focus:ring-3 focus:ring-[#3157ff]/10"
              onChange={(event) => {
                setQuery(event.target.value);
                setVisibleCount(PAGE_SIZE);
              }}
              placeholder={
                isFrench
                  ? 'Rechercher un nom, sport ou objectif…'
                  : 'Search a name, sport, or goal…'
              }
              type="search"
              value={query}
            />
          </label>
          <label>
            <span className="sr-only">
              {isFrench ? 'Filtrer par sport' : 'Filter by sport'}
            </span>
            <select
              className="h-13 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm font-semibold transition outline-none focus:border-[#3157ff] focus:ring-3 focus:ring-[#3157ff]/10"
              onChange={(event) => {
                setSport(event.target.value);
                setVisibleCount(PAGE_SIZE);
              }}
              value={sport}
            >
              <option value="all">
                {isFrench ? 'Tous les sports' : 'All sports'}
              </option>
              {sports.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="sr-only">
              {isFrench ? 'Filtrer par template' : 'Filter by template'}
            </span>
            <select
              className="h-13 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm font-semibold transition outline-none focus:border-[#3157ff] focus:ring-3 focus:ring-[#3157ff]/10"
              onChange={(event) => {
                setTemplate(event.target.value);
                setVisibleCount(PAGE_SIZE);
              }}
              value={template}
            >
              <option value="all">
                {isFrench ? 'Tous les templates' : 'All templates'}
              </option>
              {templates.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="sr-only">
              {isFrench ? 'Filtrer par ambiance' : 'Filter by tone'}
            </span>
            <select
              className="h-13 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm font-semibold transition outline-none focus:border-[#3157ff] focus:ring-3 focus:ring-[#3157ff]/10"
              onChange={(event) => {
                setTone(event.target.value);
                setVisibleCount(PAGE_SIZE);
              }}
              value={tone}
            >
              <option value="all">
                {isFrench ? 'Toutes les ambiances' : 'All visual tones'}
              </option>
              <option value="light">{isFrench ? 'Clair' : 'Light'}</option>
              <option value="dark">{isFrench ? 'Sombre' : 'Dark'}</option>
            </select>
          </label>
        </div>
      </div>

      <div className="mt-12 flex items-end justify-between gap-5">
        <div>
          <p className="text-xs font-black tracking-[0.16em] text-[#3157ff] uppercase">
            {isFrench ? 'Galerie d’inspiration' : 'Inspiration gallery'}
          </p>
          <p className="mt-2 text-sm text-black/45">
            {filteredAthletes.length}{' '}
            {filteredAthletes.length === 1
              ? isFrench
                ? 'profil'
                : 'profile'
              : isFrench
                ? 'profils'
                : 'profiles'}
          </p>
        </div>
        {hasActiveFilters ? (
          <button
            className="text-sm font-bold text-[#3157ff] hover:underline"
            onClick={() => {
              setQuery('');
              setSport('all');
              setTemplate('all');
              setTone('all');
              setVisibleCount(PAGE_SIZE);
            }}
            type="button"
          >
            {isFrench ? 'Réinitialiser' : 'Reset filters'}
          </button>
        ) : null}
      </div>

      {filteredAthletes.length ? (
        <>
          <div className="mt-7 grid gap-7 sm:grid-cols-2 xl:grid-cols-3">
            {filteredAthletes.slice(0, visibleCount).map((athlete) => (
              <PublicProfilePreviewCard
                athlete={athlete}
                locale={locale}
                key={athlete.id}
              />
            ))}
          </div>
          {visibleCount < filteredAthletes.length ? (
            <div className="mt-10 flex justify-center">
              <button
                className="inline-flex h-12 items-center rounded-full bg-[#151515] px-7 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#3157ff]"
                onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                type="button"
              >
                {isFrench ? 'Voir plus de profils' : 'Show more profiles'}
              </button>
            </div>
          ) : null}
        </>
      ) : (
        <div className="mt-7 rounded-[2rem] border border-dashed border-black/15 bg-white px-6 py-20 text-center">
          <TargetIcon
            className="mx-auto h-10 w-10 text-[#3157ff]"
            weight="duotone"
          />
          <h2 className="mt-5 text-2xl font-black">
            {isFrench ? 'Aucun profil ne correspond.' : 'No matching profile.'}
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-black/45">
            {isFrench
              ? 'Essayez un autre sport, template ou mot-clé.'
              : 'Try another sport, template, or keyword.'}
          </p>
        </div>
      )}

      {athletes.some((athlete) => athlete.username.startsWith('demo_')) ? (
        <p className="mx-auto mt-9 max-w-2xl text-center text-xs leading-5 text-black/40">
          {isFrench
            ? 'Les profils marqués « Démo » sont des exemples fictifs créés par Griit pour vous aider à imaginer votre propre page.'
            : 'Profiles marked “Demo” are fictional examples created by Griit to help you imagine your own page.'}
        </p>
      ) : null}
    </>
  );
}
