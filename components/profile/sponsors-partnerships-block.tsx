import { ArrowUpRight, Handshake } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { getThemeRuntime } from '@/lib/constants/profile-theme';
import type {
  BuilderSponsor,
  ProfileBuilderState,
} from '@/lib/types/profile-builder';

type SponsorsPartnershipsBlockProps = {
  builder: ProfileBuilderState;
  presentation?: 'card' | 'poster';
};

function getContactHref(contact: string) {
  if (!contact) return '';
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)) {
    return `mailto:${contact}`;
  }
  if (/^www\./i.test(contact)) return `https://${contact}`;
  return contact;
}

function SponsorCard({
  sponsor,
  theme,
}: {
  sponsor: BuilderSponsor;
  theme: ReturnType<typeof getThemeRuntime>;
}) {
  const content = (
    <>
      <span
        aria-hidden="true"
        className="block h-12 w-full bg-contain bg-center bg-no-repeat"
        style={
          sponsor.logoUrl
            ? { backgroundImage: `url('${sponsor.logoUrl}')` }
            : undefined
        }
      >
        {!sponsor.logoUrl ? (
          <span
            className="flex h-full items-center justify-center text-lg font-bold"
            style={{ color: theme.palette.blockTitle }}
          >
            {sponsor.name.slice(0, 2).toUpperCase()}
          </span>
        ) : null}
      </span>
      <span
        className="mt-2 block truncate text-center text-xs font-semibold"
        style={{ color: theme.palette.description }}
      >
        {sponsor.name}
      </span>
    </>
  );

  const className = cn(
    theme.radiusClass,
    'block min-w-0 border p-3 transition-transform hover:-translate-y-0.5',
  );
  const style = {
    borderColor: theme.palette.border,
    backgroundColor: theme.palette.background,
  };

  return sponsor.websiteUrl ? (
    <a
      aria-label={`Visit ${sponsor.name}`}
      className={className}
      href={sponsor.websiteUrl}
      rel="noreferrer"
      style={style}
      target="_blank"
    >
      {content}
    </a>
  ) : (
    <div className={className} style={style}>
      {content}
    </div>
  );
}

export function SponsorsPartnershipsBlock({
  builder,
  presentation = 'card',
}: SponsorsPartnershipsBlockProps) {
  const block = builder.blocks.find(
    (item) => item.type === 'sponsors' && item.isEnabled,
  );

  if (!block) return null;

  const theme = getThemeRuntime(builder.profile.theme);
  const savedMode = block.content.mode;
  const mode =
    savedMode === 'sponsors' || savedMode === 'both' ? savedMode : 'seeking';
  const showSponsors = mode === 'sponsors' || mode === 'both';
  const showCallout = mode === 'seeking' || mode === 'both';
  const sponsors = showSponsors
    ? builder.sponsors.filter((sponsor) => sponsor.isEnabled && sponsor.name)
    : [];
  const headline =
    typeof block.content.headline === 'string' && block.content.headline
      ? block.content.headline
      : 'Open to partnerships';
  const description =
    typeof block.content.description === 'string'
      ? block.content.description
      : '';
  const contact =
    typeof block.content.contact === 'string' ? block.content.contact : '';
  const ctaLabel =
    typeof block.content.ctaLabel === 'string' && block.content.ctaLabel
      ? block.content.ctaLabel
      : "Let's work together";
  const contactHref = getContactHref(contact);

  if (!sponsors.length && !showCallout) return null;

  return (
    <section
      className={cn(
        theme.radiusClass,
        presentation === 'poster' ? 'border p-5' : 'p-6 shadow-sm',
      )}
      style={{
        backgroundColor: theme.palette.surface,
        borderColor: theme.palette.border,
        color: theme.palette.text,
      }}
    >
      {sponsors.length ? (
        <div>
          <div className="flex items-center gap-2">
            <Handshake
              className="h-4 w-4"
              style={{ color: theme.palette.accent }}
            />
            <p
              className="text-sm font-semibold"
              style={{ color: theme.palette.blockTitle }}
            >
              Supported by
            </p>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {sponsors.map((sponsor) => (
              <SponsorCard
                key={`${sponsor.name}-${sponsor.sortOrder}`}
                sponsor={sponsor}
                theme={theme}
              />
            ))}
          </div>
        </div>
      ) : null}

      {showCallout ? (
        <div
          className={cn(theme.radiusClass, 'p-5', sponsors.length && 'mt-5')}
          style={{
            backgroundColor: theme.palette.accent,
            color: theme.palette.accentText,
          }}
        >
          <p className="text-xs font-semibold tracking-[0.2em] uppercase opacity-70">
            Partnership opportunities
          </p>
          <p className="mt-2 text-lg font-semibold">{headline}</p>
          {description ? (
            <p className="mt-2 text-sm leading-6 opacity-80">{description}</p>
          ) : null}
          {contactHref ? (
            <a
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-slate-950 transition hover:bg-white"
              href={contactHref}
              rel={contactHref.startsWith('mailto:') ? undefined : 'noreferrer'}
              target={contactHref.startsWith('mailto:') ? undefined : '_blank'}
            >
              {ctaLabel}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
