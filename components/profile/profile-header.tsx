import { ArrowUpRightIcon as ArrowUpRight } from '@phosphor-icons/react/ssr';
import Image from 'next/image';
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
  targetKey,
}: {
  builder: ProfileBuilderState;
  variant: HeaderVariant;
  wording: TemplateWording;
  title: string;
  description: string;
  target: string;
  targetDisplay?: GoalDateDisplay;
  url?: string;
  targetKey?: string;
}) {
  const { profile } = builder;
  const theme = getThemeRuntime(profile.theme);
  const isPreview = variant !== 'full';
  const isMobilePreview = variant === 'mobile-preview';
  const avatarSize = theme.headerAvatarSize;
  const coverStyle =
    theme.coverType === 'gradient'
      ? {
          backgroundImage: `linear-gradient(135deg, ${theme.coverGradientFrom}, ${theme.coverGradientTo})`,
        }
      : { backgroundColor: theme.coverColor };
  const heroHeight = 'min-h-[560px]';

  const coverImage =
    theme.coverType === 'image' && profile.coverUrl ? (
      <Image
        alt=""
        className="object-cover"
        fill
        priority={!isPreview}
        sizes={isPreview ? '672px' : '100vw'}
        src={profile.coverUrl}
      />
    ) : null;

  const imageOverlay = coverImage ? (
    <div
      className="absolute inset-0"
      style={{
        backgroundColor: theme.coverColor,
        opacity: theme.overlayOpacity,
      }}
    />
  ) : null;

  const sheetLayer = (
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        background: theme.headerSheetFade
          ? `linear-gradient(to bottom, transparent 24%, ${theme.headerSheetColor} 112%)`
          : theme.headerSheetColor,
      }}
    />
  );

  const textureLayer =
    theme.headerTexture === 'grid' ? (
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          color: theme.palette.accent,
          backgroundImage:
            'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)',
          backgroundSize: '34px 34px',
          opacity: 0.2,
        }}
      />
    ) : theme.headerTexture === 'diagonal' ? (
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          color: theme.palette.accent,
          backgroundImage:
            'repeating-linear-gradient(135deg, transparent 0 12px, currentColor 12px 13px)',
          opacity: 0.2,
        }}
      />
    ) : theme.headerTexture === 'dots' ? (
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          color: theme.palette.accent,
          backgroundImage:
            'radial-gradient(currentColor 1.4px, transparent 1.4px)',
          backgroundSize: '18px 18px',
          opacity: 0.28,
        }}
      />
    ) : theme.headerTexture === 'scanlines' ? (
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          color: theme.palette.accent,
          backgroundImage:
            'repeating-linear-gradient(to bottom, transparent 0 7px, currentColor 7px 8px)',
          opacity: 0.2,
        }}
      />
    ) : null;

  const geometryLayer =
    theme.headerGeometry === 'velocity' ? (
      <>
        <div
          className="pointer-events-none absolute -top-20 -right-16 h-72 w-52 rotate-12"
          style={{
            backgroundColor: theme.palette.accent,
            clipPath: 'polygon(24% 0, 100% 0, 76% 100%, 0 100%)',
            opacity: 0.88,
          }}
        />
        <div
          className="pointer-events-none absolute top-[42%] -right-14 h-44 w-44 rounded-full border-[18px]"
          style={{ borderColor: theme.palette.accent, opacity: 0.24 }}
        />
      </>
    ) : theme.headerGeometry === 'rings' ? (
      <>
        <div
          className="pointer-events-none absolute -top-16 -right-20 h-72 w-72 rounded-full border-[22px]"
          style={{ borderColor: theme.palette.accent, opacity: 0.42 }}
        />
        <div
          className="pointer-events-none absolute top-[48%] -left-12 h-36 w-36 rounded-full border-[10px]"
          style={{ borderColor: theme.palette.accent, opacity: 0.22 }}
        />
      </>
    ) : theme.headerGeometry === 'chevrons' ? (
      <div className="pointer-events-none absolute top-1/2 right-0 flex -translate-y-1/2 opacity-55">
        {[0, 1, 2].map((index) => (
          <span
            className="-ml-5 h-40 w-24"
            key={index}
            style={{
              backgroundColor: theme.palette.accent,
              clipPath:
                'polygon(0 0, 54% 0, 100% 50%, 54% 100%, 0 100%, 46% 50%)',
              opacity: 1 - index * 0.22,
            }}
          />
        ))}
      </div>
    ) : theme.headerGeometry === 'blocks' ? (
      <>
        <div
          className="pointer-events-none absolute -top-8 right-8 h-40 w-24 rotate-12"
          style={{ backgroundColor: theme.palette.accent, opacity: 0.72 }}
        />
        <div
          className="pointer-events-none absolute top-32 -right-8 h-24 w-40 -rotate-6"
          style={{ backgroundColor: theme.palette.accent, opacity: 0.34 }}
        />
        <div
          className="pointer-events-none absolute bottom-16 -left-10 h-20 w-32 rotate-6"
          style={{ backgroundColor: theme.palette.accent, opacity: 0.2 }}
        />
      </>
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
          className={onSheet ? 'shadow-lg' : undefined}
          displayName={profile.displayName}
          priority={!isPreview}
          shape={theme.headerAvatarShape}
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
      style={{
        color: onSheet ? theme.palette.text : theme.palette.headerText,
      }}
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
          isMobilePreview ? 'text-5xl' : 'text-5xl sm:text-7xl',
        )}
        style={{ fontFamily: theme.fontFamilies.heading }}
      >
        {url ? (
          <a
            data-analytics-event="goal_click"
            data-analytics-target-key={targetKey}
            data-analytics-target-type="goal"
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
          className={cn(
            'mt-4 leading-6',
            isMobilePreview ? 'text-sm' : 'text-sm sm:text-base',
          )}
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
        className={cn('overflow-hidden py-5', !isMobilePreview && 'sm:py-8')}
        style={{ backgroundColor: theme.palette.background }}
      >
        <div
          className={cn(
            theme.radiusClass,
            'mx-auto max-w-2xl overflow-hidden border',
            isMobilePreview ? 'mx-4' : 'mx-4 sm:mx-auto',
          )}
          style={{ color: theme.palette.text }}
        >
          <div
            className={cn(
              'relative px-5 pt-5 pb-4',
              !isMobilePreview && 'sm:px-8 sm:pt-7',
            )}
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
              isMobilePreview ? 'h-24' : 'h-24 sm:h-34',
            )}
            style={{ ...coverStyle, borderColor: theme.palette.border }}
          >
            {coverImage}
            {imageOverlay}
            {sheetLayer}
            {textureLayer}
            {geometryLayer}
          </div>
          <div
            className={cn(
              'relative px-5 py-7',
              !isMobilePreview && 'sm:px-8 sm:py-9',
            )}
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
        className={cn('overflow-hidden py-5', !isMobilePreview && 'sm:py-8')}
        style={{
          backgroundColor: theme.palette.background,
          color: theme.headerSheetFade
            ? theme.palette.headerText
            : theme.palette.text,
        }}
      >
        <div
          className={cn(
            theme.radiusClass,
            'relative mx-auto flex max-w-2xl flex-col justify-between overflow-hidden border bg-cover bg-center',
            isMobilePreview
              ? 'mx-4 min-h-[520px]'
              : 'mx-4 min-h-[520px] sm:mx-auto',
          )}
          style={{ ...coverStyle, borderColor: theme.palette.border }}
        >
          {coverImage}
          {imageOverlay}
          {sheetLayer}
          {textureLayer}
          {geometryLayer}
          <div
            className={cn(
              'relative flex items-start justify-between gap-3 px-5 py-6',
              !isMobilePreview && 'sm:px-8',
            )}
          >
            {identity(!theme.headerSheetFade, 'left')}
            <span className="text-[9px] font-black tracking-[0.24em] uppercase [writing-mode:vertical-rl]">
              @{profile.username}
            </span>
          </div>
          <div
            className={cn(
              'relative px-5 pb-7',
              !isMobilePreview && 'sm:px-8 sm:pb-10',
            )}
            style={{ color: theme.palette.text }}
          >
            <div className="relative">{goal(true, 'left')}</div>
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
        className="relative flex items-end overflow-hidden bg-cover bg-center"
        style={{
          ...coverStyle,
          color: theme.headerSheetFade
            ? theme.palette.headerText
            : theme.palette.text,
        }}
      >
        {coverImage}
        {imageOverlay}
        {sheetLayer}
        {textureLayer}
        {geometryLayer}
        <div
          className={cn(
            'relative mx-auto w-full max-w-2xl px-5 py-8',
            !isMobilePreview && 'sm:px-8 sm:py-12',
          )}
        >
          <div className="border-b border-white/25 pb-5">
            {identity(!theme.headerSheetFade, 'left')}
          </div>
          <div
            className={cn(
              'relative mt-8 pl-5',
              !isMobilePreview && 'sm:mt-12 sm:pl-8',
            )}
          >
            <span
              className="absolute top-0 bottom-0 left-0 w-1"
              style={{ backgroundColor: theme.palette.accent }}
            />
            {goal(true, 'left')}
          </div>
        </div>
      </header>
    );
  }

  if (theme.headerLayout === 'kinetic') {
    return (
      <header
        className={cn(
          'relative flex min-h-[560px] items-stretch overflow-hidden bg-cover bg-center',
          !isMobilePreview && 'sm:min-h-[620px]',
        )}
        style={{
          ...coverStyle,
          color: theme.headerSheetFade
            ? theme.palette.headerText
            : theme.palette.text,
        }}
      >
        {coverImage}
        {imageOverlay}
        {sheetLayer}
        {textureLayer}
        {geometryLayer}
        <div
          className="absolute bottom-0 left-0 h-3 w-2/3"
          style={{ backgroundColor: theme.palette.accent }}
        />

        <div
          className={cn(
            'relative mx-auto flex w-full max-w-2xl flex-col px-5 py-6',
            !isMobilePreview && 'sm:px-8 sm:py-9',
          )}
        >
          <div className="flex items-start justify-between gap-5">
            {identity(!theme.headerSheetFade, 'left')}
            <div className="flex shrink-0 flex-col items-end gap-2">
              <span className="text-[9px] font-black tracking-[0.28em] uppercase opacity-80">
                @{profile.username}
              </span>
              <span
                className="h-1.5 w-16"
                style={{ backgroundColor: theme.palette.accent }}
              />
            </div>
          </div>

          <div className="my-auto max-w-[92%] py-12">
            {wording.profileLabel ? (
              <div
                className="mb-5 flex items-center gap-3 text-[9px] font-black tracking-[0.28em] uppercase"
                style={{
                  color: theme.headerSheetFade
                    ? theme.palette.mutedHeaderText
                    : theme.palette.description,
                }}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: theme.palette.accent }}
                />
                {wording.profileLabel}
              </div>
            ) : null}
            {goal(true, 'left')}
          </div>

          <div className="flex items-end justify-between gap-4 border-t border-current/25 pt-4">
            {wording.discipline ? (
              <span className="text-[10px] font-black tracking-[0.22em] uppercase">
                {wording.discipline}
              </span>
            ) : (
              <span />
            )}
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
      style={{
        ...coverStyle,
        color: theme.headerSheetFade
          ? theme.palette.headerText
          : theme.palette.text,
      }}
    >
      {coverImage}
      {imageOverlay}
      {sheetLayer}
      {textureLayer}
      {geometryLayer}
      <div
        className={cn(
          'relative mx-auto flex w-full max-w-2xl flex-col justify-between px-5 py-7',
          !isMobilePreview && 'sm:px-8 sm:py-10',
        )}
      >
        <div className="self-start">
          {identity(!theme.headerSheetFade, 'left')}
        </div>
        <div className="my-auto py-10">{goal(true, 'center')}</div>
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
