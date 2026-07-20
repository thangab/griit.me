import { Target, type Icon as PhosphorIcon } from '@phosphor-icons/react';
import { ArrowUpRight } from 'lucide-react';
import { ProfileDecorativeIcon } from '@/components/profile/decorative-icon';
import { ProfileAvatar } from '@/components/profile/profile-avatar';
import { GoalDateBadge } from '@/components/profile/goal-date-badge';
import { getThemeRuntime } from '@/lib/constants/profile-theme';
import type { TemplateWording } from '@/lib/constants/template-wording';
import type { ProfileBuilderState } from '@/lib/types/profile-builder';
import { cn } from '@/lib/utils/cn';
import type { GoalDateDisplay } from '@/lib/utils/goal-date';

type HeaderVariant = 'full' | 'mobile-preview' | 'desktop-preview';

export function ProfileHeader({
  builder,
  variant,
  wording,
  title,
  description,
  target,
  targetDisplay = 'date',
  url,
  badgeIcon = Target,
}: {
  builder: ProfileBuilderState;
  variant: HeaderVariant;
  wording: TemplateWording;
  title: string;
  description: string;
  target: string;
  targetDisplay?: GoalDateDisplay;
  url?: string;
  badgeIcon?: PhosphorIcon;
}) {
  const { profile } = builder;
  const theme = getThemeRuntime(profile.theme);
  const isPreview = variant !== 'full';
  const isMobilePreview = variant === 'mobile-preview';
  const avatarSize = Math.round(
    theme.headerAvatarSize * (isMobilePreview ? 0.8 : isPreview ? 0.9 : 1),
  );
  const coverStyle =
    theme.coverType === 'image' && profile.coverUrl
      ? { backgroundImage: `url('${profile.coverUrl}')` }
      : theme.coverType === 'gradient'
        ? {
            backgroundImage: `linear-gradient(135deg, ${theme.coverGradientFrom}, ${theme.coverGradientTo})`,
          }
        : { backgroundColor: theme.coverColor };
  const heroHeight = isPreview ? 'min-h-[390px]' : 'min-h-[560px]';

  const imageOverlay =
    theme.coverType === 'image' ? (
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: theme.coverColor,
          opacity: theme.overlayOpacity,
        }}
      />
    ) : null;

  const identity = (onSheet = false, align: 'center' | 'left' = 'center') => (
    <div className={cn(align === 'center' ? 'text-center' : 'text-left')}>
      <div
        className={cn(
          'flex items-start gap-3',
          align === 'center' ? 'flex-col items-center' : 'items-center',
        )}
      >
        <ProfileAvatar
          avatarUrl={profile.avatarUrl}
          className={onSheet ? 'border-white shadow-lg' : 'border-white/80'}
          displayName={profile.displayName}
          size={avatarSize}
        />
        <div>
          <div
            className={cn(
              'flex flex-wrap items-center gap-2',
              align === 'center' && 'justify-center',
            )}
          >
            <p className="text-lg font-bold">{profile.displayName}</p>
            {wording.badge ? (
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-[0.14em] uppercase"
                style={{
                  backgroundColor: theme.palette.accent,
                  color: theme.palette.accentText,
                }}
              >
                <ProfileDecorativeIcon
                  className="h-3 w-3"
                  fallback={badgeIcon}
                  iconId={theme.decorativeIcon}
                />
                {wording.badge}
              </span>
            ) : null}
          </div>
          {wording.discipline ? (
            <p
              className="mt-1 text-xs font-medium"
              style={{
                color: onSheet
                  ? theme.palette.description
                  : theme.palette.mutedHeaderText,
              }}
            >
              {wording.discipline}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );

  const goal = (onSheet = false, align: 'center' | 'left' = 'center') => (
    <div
      className={cn(
        'max-w-3xl',
        align === 'center' ? 'mx-auto text-center' : 'text-left',
      )}
    >
      {wording.eyebrow ? (
        <p
          className="text-[11px] font-bold tracking-[0.24em] uppercase"
          style={{
            color: onSheet
              ? theme.palette.description
              : theme.palette.mutedHeaderText,
          }}
        >
          {wording.eyebrow}
        </p>
      ) : null}
      <h1
        className={cn(
          'leading-[0.98] font-black tracking-[-0.04em]',
          wording.eyebrow && 'mt-3',
          isMobilePreview
            ? 'text-4xl'
            : isPreview
              ? 'text-5xl'
              : 'text-5xl sm:text-7xl',
        )}
        style={{ fontFamily: theme.fontFamilies.heading }}
      >
        {url ? (
          <a
            className="inline-flex items-start gap-2 transition-opacity hover:opacity-75"
            href={url}
            rel="noreferrer"
            target="_blank"
          >
            <span>{title}</span>
            <ArrowUpRight className="mt-1 h-[0.42em] w-[0.42em] shrink-0" />
          </a>
        ) : (
          title
        )}
      </h1>
      {description ? (
        <p
          className="mt-4 text-sm leading-6 sm:text-base"
          style={{
            color: onSheet
              ? theme.palette.description
              : theme.palette.mutedHeaderText,
          }}
        >
          {description}
        </p>
      ) : null}
      {target ? (
        <GoalDateBadge
          builder={builder}
          className="mt-5"
          display={targetDisplay}
          label={target}
          prefix={wording.targetLabel}
        />
      ) : null}
    </div>
  );

  if (theme.headerLayout === 'split') {
    return (
      <header
        className="overflow-hidden py-5 sm:py-8"
        style={{ backgroundColor: theme.palette.background }}
      >
        <div
          className={cn(
            theme.radiusClass,
            'mx-auto max-w-2xl overflow-hidden border',
            isPreview ? 'mx-3' : 'mx-4 sm:mx-auto',
          )}
          style={{ color: theme.palette.text }}
        >
          <div
            className="relative px-5 pt-5 pb-4 sm:px-8 sm:pt-7"
            style={{ backgroundColor: theme.headerSheetColor }}
          >
            <div className="mb-5 flex items-center justify-between gap-3">
              <span className="text-[9px] font-black tracking-[0.28em] uppercase opacity-55">
                @{profile.username}
              </span>
              <span
                className="h-2.5 w-10 rounded-full"
                style={{ backgroundColor: theme.palette.accent }}
              />
            </div>
            {identity(true, 'left')}
          </div>
          <div
            className={cn(
              'relative overflow-hidden border-y border-dashed bg-cover bg-center',
              isPreview ? 'h-28' : 'h-36 sm:h-44',
            )}
            style={{ ...coverStyle, borderColor: theme.palette.border }}
          >
            {imageOverlay}
            <ProfileDecorativeIcon
              className="absolute right-4 bottom-1/2 h-16 w-16 translate-y-1/2 opacity-40"
              fallback={badgeIcon}
              iconId={theme.decorativeIcon}
            />
          </div>
          <div
            className="relative px-5 py-7 sm:px-8 sm:py-9"
            style={{ backgroundColor: theme.headerSheetColor }}
          >
            <span
              className="absolute top-0 bottom-0 left-0 w-1.5"
              style={{ backgroundColor: theme.palette.accent }}
            />
            {goal(true, 'left')}
          </div>
        </div>
      </header>
    );
  }

  if (theme.headerLayout === 'immersive') {
    return (
      <header
        className="overflow-hidden py-5 sm:py-8"
        style={{
          backgroundColor: theme.palette.background,
          color: theme.palette.headerText,
        }}
      >
        <div
          className={cn(
            theme.radiusClass,
            'relative mx-auto flex max-w-2xl flex-col justify-between overflow-hidden border bg-cover bg-center',
            isPreview ? 'mx-3 min-h-[500px]' : 'mx-4 min-h-[620px] sm:mx-auto',
          )}
          style={{ ...coverStyle, borderColor: theme.palette.border }}
        >
          {imageOverlay}
          <div
            className="absolute inset-0"
            style={{
              background: theme.headerSheetFade
                ? `linear-gradient(to bottom, transparent 18%, ${theme.headerSheetColor} 105%)`
                : `linear-gradient(to bottom, transparent 35%, ${theme.coverColor} 110%)`,
            }}
          />
          <div
            className="absolute -top-20 -right-20 h-64 w-64 rotate-12 opacity-85"
            style={{ backgroundColor: theme.palette.accent }}
          />
          <div className="relative flex items-start justify-between gap-3 px-5 py-6 sm:px-8">
            {identity(false, 'left')}
            <span className="text-[9px] font-black tracking-[0.24em] uppercase [writing-mode:vertical-rl]">
              @{profile.username}
            </span>
          </div>
          <div
            className="relative px-5 pb-7 sm:px-8 sm:pb-10"
            style={{
              color: theme.headerSheetFade
                ? theme.palette.text
                : theme.palette.headerText,
            }}
          >
            <ProfileDecorativeIcon
              className="absolute -right-10 -bottom-10 h-48 w-48 opacity-10"
              fallback={badgeIcon}
              iconId={theme.decorativeIcon}
            />
            <div className="relative">
              {goal(theme.headerSheetFade, 'left')}
            </div>
            <div
              className="mt-7 h-1.5 w-20"
              style={{ backgroundColor: theme.palette.accent }}
            />
          </div>
        </div>
      </header>
    );
  }

  if (theme.headerLayout === 'left') {
    return (
      <header
        className={cn(
          'relative flex items-end overflow-hidden bg-cover bg-center',
          heroHeight,
        )}
        style={{ ...coverStyle, color: theme.palette.headerText }}
      >
        {imageOverlay}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.16) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.16) 1px, transparent 1px)',
            backgroundSize: '42px 42px',
          }}
        />
        <ProfileDecorativeIcon
          className="absolute -right-12 bottom-4 h-64 w-64 opacity-10"
          fallback={badgeIcon}
          iconId={theme.decorativeIcon}
        />
        <div className="relative mx-auto w-full max-w-2xl px-5 py-8 sm:px-8 sm:py-12">
          <div className="border-b border-white/25 pb-5">
            {identity(false, 'left')}
          </div>
          <div className="relative mt-8 pl-5 sm:mt-12 sm:pl-8">
            <span
              className="absolute top-0 bottom-0 left-0 w-1"
              style={{ backgroundColor: theme.palette.accent }}
            />
            {goal(false, 'left')}
          </div>
        </div>
      </header>
    );
  }

  return (
    <header
      className={cn(
        'relative flex items-stretch overflow-hidden bg-cover bg-center',
        heroHeight,
      )}
      style={{ ...coverStyle, color: theme.palette.headerText }}
    >
      {imageOverlay}
      <div
        className="absolute -top-20 -left-24 h-64 w-64 rotate-12 opacity-90"
        style={{
          backgroundColor: theme.palette.accent,
          clipPath: 'polygon(0 0, 100% 0, 62% 100%, 0 72%)',
        }}
      />
      <div
        className="absolute right-0 bottom-0 h-36 w-52 opacity-30"
        style={{
          backgroundColor: theme.palette.accent,
          clipPath: 'polygon(42% 0, 100% 28%, 100% 100%, 0 100%)',
        }}
      />
      <ProfileDecorativeIcon
        className="absolute right-4 bottom-12 h-28 w-28 opacity-15 sm:right-8 sm:h-36 sm:w-36"
        fallback={badgeIcon}
        iconId={theme.decorativeIcon}
      />
      <div
        className={cn(
          'relative mx-auto flex w-full max-w-2xl flex-col justify-between px-5 py-7 sm:px-8 sm:py-10',
          isPreview && 'px-4 py-6',
        )}
      >
        <div className="self-start">{identity(false, 'left')}</div>
        <div className="my-auto py-10">{goal(false, 'center')}</div>
        <div className="flex items-center justify-center gap-2">
          <span
            className="h-1 w-12 rounded-full"
            style={{ backgroundColor: theme.palette.accent }}
          />
          <span className="text-[10px] font-bold tracking-[0.22em] uppercase opacity-70">
            {wording.discipline || profile.displayName}
          </span>
        </div>
      </div>
    </header>
  );
}
