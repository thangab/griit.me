import { Target, type LucideIcon } from 'lucide-react';
import { ProfileDecorativeIcon } from '@/components/profile/decorative-icon';
import { ProfileAvatar } from '@/components/profile/profile-avatar';
import { getThemeRuntime } from '@/lib/constants/profile-theme';
import type { TemplateWording } from '@/lib/constants/template-wording';
import type { ProfileBuilderState } from '@/lib/types/profile-builder';
import { cn } from '@/lib/utils/cn';

type HeaderVariant = 'full' | 'mobile-preview' | 'desktop-preview';

export function ProfileHeader({
  builder,
  variant,
  wording,
  title,
  description,
  target,
  badgeIcon = Target,
}: {
  builder: ProfileBuilderState;
  variant: HeaderVariant;
  wording: TemplateWording;
  title: string;
  description: string;
  target: string;
  badgeIcon?: LucideIcon;
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
        {title}
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
        <span
          className="mt-5 inline-flex rounded-full px-4 py-2 text-xs font-bold"
          style={{
            backgroundColor: theme.palette.accent,
            color: theme.palette.accentText,
          }}
        >
          {wording.targetLabel ? `${wording.targetLabel}: ` : ''}
          {target}
        </span>
      ) : null}
    </div>
  );

  if (theme.headerLayout === 'split') {
    return (
      <header style={{ backgroundColor: theme.headerSheetColor }}>
        <div
          className={cn(
            'relative bg-cover bg-center',
            isPreview ? 'h-40' : 'h-52 sm:h-64',
          )}
          style={coverStyle}
        >
          {imageOverlay}
        </div>
        <div
          className={cn(
            'relative mx-auto max-w-6xl px-5 pb-8 sm:px-8 lg:px-12',
            isPreview ? 'pt-16' : 'pt-20',
          )}
          style={{ color: theme.palette.text }}
        >
          <div
            className="absolute left-1/2 -translate-x-1/2"
            style={{ top: -(avatarSize / 2) }}
          >
            <ProfileAvatar
              avatarUrl={profile.avatarUrl}
              className="border-white shadow-xl"
              displayName={profile.displayName}
              size={avatarSize}
            />
          </div>
          <div className="text-center">
            <div className="flex flex-wrap items-center justify-center gap-2">
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
                className="mt-1 text-xs"
                style={{ color: theme.palette.description }}
              >
                {wording.discipline}
              </p>
            ) : null}
          </div>
          <div className="mt-7">{goal(true)}</div>
        </div>
      </header>
    );
  }

  if (theme.headerLayout === 'immersive') {
    return (
      <header
        className={cn(
          'relative flex items-end overflow-hidden bg-cover bg-center',
          heroHeight,
        )}
        style={{ ...coverStyle, color: theme.palette.text }}
      >
        {imageOverlay}
        <div
          className="absolute inset-0"
          style={{
            background: theme.headerSheetFade
              ? `linear-gradient(to bottom, transparent 25%, ${theme.headerSheetColor} 82%)`
              : `linear-gradient(to bottom, transparent 42%, ${theme.headerSheetColor} 43%)`,
          }}
        />
        <div
          className={cn(
            'relative mx-auto w-full max-w-6xl px-5 pb-8 sm:px-8 lg:px-12',
            isPreview && 'px-4 pb-5',
          )}
        >
          {identity(true)}
          <div className="mt-6">{goal(true)}</div>
        </div>
      </header>
    );
  }

  return (
    <header
      className={cn(
        'relative flex overflow-hidden bg-cover bg-center',
        heroHeight,
        theme.headerLayout === 'left'
          ? 'items-end'
          : 'items-center justify-center',
      )}
      style={{ ...coverStyle, color: theme.palette.headerText }}
    >
      {imageOverlay}
      <div
        className={cn(
          'relative mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 lg:px-12',
          isPreview && 'px-4 py-5',
        )}
      >
        {identity(false, theme.headerLayout === 'left' ? 'left' : 'center')}
        <div className={theme.headerLayout === 'left' ? 'mt-10' : 'mt-8'}>
          {goal(false, theme.headerLayout === 'left' ? 'left' : 'center')}
        </div>
      </div>
    </header>
  );
}
