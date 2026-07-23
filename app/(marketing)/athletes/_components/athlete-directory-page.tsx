import type { Route } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  MapPinIcon,
  SparkleIcon,
  TargetIcon,
} from '@phosphor-icons/react/ssr';
import { AthleteSportFilter } from '@/app/(marketing)/athletes/_components/athlete-sport-filter';
import { ProfileAvatar } from '@/components/profile/profile-avatar';
import {
  getHeaderSheetBackground,
  getThemeRuntime,
} from '@/lib/constants/profile-theme';
import {
  getAthleteDirectory,
  type AthleteDirectoryEntry,
} from '@/lib/services/athlete-directory';

function withoutUnsplash(url: string) {
  if (!url) return '';

  try {
    return new URL(url).hostname.endsWith('unsplash.com') ? '' : url;
  } catch {
    return url;
  }
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

function AthleteCard({ athlete }: { athlete: AthleteDirectoryEntry }) {
  const theme = getThemeRuntime(athlete.theme);
  const visibleSports = athlete.sports.slice(0, 3);
  const avatarUrl = withoutUnsplash(athlete.avatarUrl);
  const coverUrl = withoutUnsplash(athlete.coverUrl);
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
      className="group block min-w-0"
      href={`/${athlete.username}` as Route}
      rel="noopener noreferrer"
      target="_blank"
    >
      <article
        className="relative aspect-[3/4] overflow-hidden rounded-[2rem] border border-black/10 shadow-[0_18px_45px_rgba(20,20,20,0.12)] transition duration-300 group-hover:-translate-y-1.5 group-hover:shadow-[0_28px_65px_rgba(20,20,20,0.18)]"
        style={{
          backgroundColor: theme.palette.background,
          color: theme.palette.text,
          fontFamily: theme.fontFamilies.body,
        }}
      >
        <div
          className="relative flex h-[58%] overflow-hidden bg-cover bg-center"
          style={{
            ...coverBackground,
            color: theme.palette.headerText,
          }}
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
          <span className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-full bg-white/85 text-[#151515] shadow-sm backdrop-blur">
            <ArrowUpRightIcon className="h-4 w-4" weight="bold" />
          </span>

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
              <span className="truncate">View profile</span>
              {athlete.location ? (
                <span className="flex min-w-0 items-center gap-1 opacity-75">
                  <MapPinIcon className="h-3.5 w-3.5 shrink-0" />
                  <span className="max-w-24 truncate">{athlete.location}</span>
                </span>
              ) : (
                <ArrowUpRightIcon className="h-4 w-4" weight="bold" />
              )}
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

export async function AthleteDirectoryPage({
  sportSlug,
}: {
  sportSlug?: string;
}) {
  const directory = await getAthleteDirectory();
  const selectedSport = directory.sports.find(
    (sport) => sport.slug === sportSlug,
  );

  if (sportSlug && !selectedSport) notFound();

  const athletes = selectedSport
    ? directory.athletes.filter((athlete) =>
        athlete.sports.some((sport) => sport.slug === selectedSport.slug),
      )
    : directory.athletes;

  return (
    <main className="overflow-hidden">
      <section className="relative border-b border-black/10 px-5 pt-20 pb-14 sm:px-8 lg:px-12 lg:pt-28 lg:pb-18">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(169,237,53,0.35),transparent_24%),radial-gradient(circle_at_82%_20%,rgba(49,87,255,0.18),transparent_25%)]" />
        <div className="relative mx-auto max-w-[1180px] text-center">
          <Link
            className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/75 px-3 py-1.5 text-xs font-bold backdrop-blur transition-transform hover:-translate-y-0.5"
            href="/sign-up"
          >
            <SparkleIcon className="h-4 w-4 text-[#3157ff]" weight="fill" />
            Create your own
            <ArrowUpRightIcon className="h-3.5 w-3.5" weight="bold" />
          </Link>
          <h1 className="mt-7 text-[clamp(3.5rem,8vw,6.8rem)] leading-[0.88] font-black tracking-[-0.07em]">
            {selectedSport ? selectedSport.name : 'Meet the athletes'}
            <span className="text-[#3157ff]">.</span>
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-black/52">
            {selectedSport
              ? `Discover ${selectedSport.name.toLowerCase()} profiles, current goals, and athlete stories on Griit.`
              : 'Browse public athlete profiles for inspiration. Filter by sport and discover what everyone is working toward.'}
          </p>

          <AthleteSportFilter
            selectedSlug={selectedSport?.slug}
            sports={directory.sports}
          />
        </div>
      </section>

      <section className="px-5 py-14 sm:px-8 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-[1280px]">
          <div className="mb-8 flex items-end justify-between gap-5">
            <div>
              <p className="text-xs font-black tracking-[0.16em] text-[#3157ff] uppercase">
                Public profiles
              </p>
              <p className="mt-2 text-sm text-black/45">
                {athletes.length}{' '}
                {athletes.length === 1 ? 'athlete' : 'athletes'}
                {selectedSport ? ` in ${selectedSport.name}` : ''}
              </p>
            </div>
          </div>

          {athletes.length ? (
            <div className="grid gap-7 sm:grid-cols-2 xl:grid-cols-3">
              {athletes.map((athlete) => (
                <AthleteCard athlete={athlete} key={athlete.id} />
              ))}
            </div>
          ) : (
            <div className="rounded-[2rem] border border-dashed border-black/15 bg-white px-6 py-20 text-center">
              <TargetIcon
                className="mx-auto h-10 w-10 text-[#3157ff]"
                weight="duotone"
              />
              <h2 className="mt-5 text-2xl font-black">No athlete here yet.</h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-black/45">
                Be the first athlete to publish a profile in this sport.
              </p>
              <Link
                className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-[#151515] px-5 text-sm font-bold text-white"
                href="/sign-up"
              >
                Create your profile
                <ArrowRightIcon className="h-4 w-4" weight="bold" />
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="border-t border-black/10 bg-[#a9ed35] px-5 py-18 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto flex max-w-[1180px] flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-black tracking-[0.18em] uppercase">
              Join the directory
            </p>
            <h2 className="mt-5 max-w-4xl text-5xl leading-[0.9] font-black tracking-[-0.065em] sm:text-7xl">
              Your story belongs here too.
            </h2>
          </div>
          <Link
            className="inline-flex h-13 shrink-0 items-center gap-2 rounded-full bg-[#151515] px-7 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
            href="/sign-up"
          >
            Build your athlete profile
            <ArrowRightIcon className="h-4 w-4" weight="bold" />
          </Link>
        </div>
      </section>
    </main>
  );
}
