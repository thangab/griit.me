import type { Route } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRightIcon, SparkleIcon } from '@phosphor-icons/react/ssr';
import type { Locale } from '@/lib/i18n/config';
import type { AthleteDirectoryEntry } from '@/lib/services/athlete-directory';

function getTemplateName(athlete: AthleteDirectoryEntry) {
  const templateId = athlete.theme.templateId;
  if (typeof templateId !== 'string' || !templateId) return 'Custom';
  return templateId
    .replaceAll('_', ' ')
    .replaceAll('-', ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export function PublicProfilePreviewCard({
  athlete,
  locale,
}: {
  athlete: AthleteDirectoryEntry;
  locale: Locale;
}) {
  const primarySport = athlete.sports[0]?.name;
  const isDemo = athlete.username.startsWith('demo_');

  return (
    <Link
      className="group block min-w-0 rounded-[2rem] focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#3157ff]"
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

        <div className="relative aspect-[3/4] overflow-hidden rounded-[1.45rem] bg-[#eef0f5]">
          {athlete.previewImageUrl ? (
            <Image
              alt={`${athlete.displayName} profile preview`}
              className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.025]"
              fill
              sizes="(min-width: 1280px) 380px, (min-width: 640px) 50vw, 100vw"
              src={athlete.previewImageUrl}
            />
          ) : athlete.coverUrl ? (
            <Image
              alt=""
              className="object-cover"
              fill
              sizes="(min-width: 1280px) 380px, (min-width: 640px) 50vw, 100vw"
              src={athlete.coverUrl}
            />
          ) : (
            <span className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(169,237,53,0.65),transparent_28%),radial-gradient(circle_at_78%_24%,rgba(49,87,255,0.45),transparent_30%),linear-gradient(145deg,#f8f7f2,#e8edff)]" />
          )}
          {!athlete.previewImageUrl ? (
            <span className="absolute inset-x-6 bottom-6 rounded-2xl border border-white/50 bg-white/80 px-4 py-3 text-center text-[10px] font-black tracking-[0.12em] text-black/55 uppercase shadow-sm backdrop-blur">
              {locale === 'fr' ? 'Aperçu indisponible' : 'Preview unavailable'}
            </span>
          ) : null}
          <span className="pointer-events-none absolute inset-0 ring-1 ring-black/8 ring-inset" />
        </div>

        <div className="flex items-center justify-between gap-4 px-2 pt-4 pb-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-black tracking-tight">
              {athlete.displayName}
            </p>
            <p className="mt-1 truncate text-[10px] font-bold text-black/40">
              {primarySport ??
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
