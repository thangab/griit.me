import {
  ArrowUpRightIcon,
  CalendarDotsIcon,
  TrophyIcon,
} from '@phosphor-icons/react/ssr';
import Image from 'next/image';
import type { CSSProperties } from 'react';
import { getAchievementTypeLabel } from '@/lib/constants/achievements';
import type { BuilderAchievementItem } from '@/lib/types/profile-builder';
import { cn } from '@/lib/utils/cn';

type AchievementShowcaseProps = {
  items: BuilderAchievementItem[];
  analyticsKey?: string;
  className?: string;
  imageStyle?: CSSProperties;
  colors: {
    accent: string;
    accentText: string;
    cardBackground: string;
    border: string;
    title: string;
    description: string;
    muted: string;
  };
};

export function AchievementShowcase({
  items,
  analyticsKey,
  className,
  imageStyle,
  colors,
}: AchievementShowcaseProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {items.map((item) => {
        const card = (
          <article
            className="group/card relative overflow-hidden border"
            style={{
              backgroundColor: colors.cardBackground,
              borderColor: colors.border,
              ...imageStyle,
            }}
          >
            {item.imageUrl ? (
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                  alt={item.title}
                  className="object-cover transition-transform duration-500 group-hover/card:scale-[1.025]"
                  fill
                  sizes="(max-width: 780px) calc(100vw - 64px), 680px"
                  src={item.imageUrl}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10" />
                <span
                  className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black tracking-[0.12em] uppercase"
                  style={{
                    backgroundColor: colors.accent,
                    color: colors.accentText,
                  }}
                >
                  <TrophyIcon aria-hidden="true" className="size-3.5" />
                  {getAchievementTypeLabel(
                    item.achievementType,
                    item.achievementTypeLabel,
                  )}
                </span>
              </div>
            ) : null}

            <div className="p-4 sm:p-5">
              {!item.imageUrl ? (
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black tracking-[0.12em] uppercase"
                    style={{
                      backgroundColor: colors.accent,
                      color: colors.accentText,
                    }}
                  >
                    <TrophyIcon aria-hidden="true" className="size-3.5" />
                    {getAchievementTypeLabel(
                      item.achievementType,
                      item.achievementTypeLabel,
                    )}
                  </span>
                  {item.resultUrl ? (
                    <ArrowUpRightIcon
                      aria-hidden="true"
                      className="size-5 transition-transform group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5"
                      style={{ color: colors.accent }}
                    />
                  ) : null}
                </div>
              ) : null}

              {item.result ? (
                <p
                  className="text-3xl leading-none font-black tracking-[-0.035em] sm:text-4xl"
                  style={{ color: colors.accent }}
                >
                  {item.result}
                </p>
              ) : null}
              <h3
                className={cn(
                  'font-bold',
                  item.result ? 'mt-2 text-base' : 'text-xl',
                )}
                style={{ color: colors.title }}
              >
                {item.title}
              </h3>

              {item.description ? (
                <p
                  className="mt-2 text-sm leading-6"
                  style={{ color: colors.description }}
                >
                  {item.description}
                </p>
              ) : null}

              {item.eventName || item.dateLabel ? (
                <div
                  className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold"
                  style={{ color: colors.muted }}
                >
                  <CalendarDotsIcon aria-hidden="true" className="size-4" />
                  {item.eventName ? <span>{item.eventName}</span> : null}
                  {item.eventName && item.dateLabel ? (
                    <span aria-hidden="true">·</span>
                  ) : null}
                  {item.dateLabel ? <time>{item.dateLabel}</time> : null}
                </div>
              ) : null}

              {item.resultUrl ? (
                <span
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold"
                  style={{ color: colors.accent }}
                >
                  {item.resultLinkLabel || 'View result'}
                  <ArrowUpRightIcon aria-hidden="true" className="size-3.5" />
                </span>
              ) : null}
            </div>
          </article>
        );

        return item.resultUrl ? (
          <a
            key={item.id ?? `${item.title}-${item.sortOrder}`}
            className="block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
            data-analytics-event={analyticsKey ? 'block_click' : undefined}
            data-analytics-target-key={analyticsKey || undefined}
            data-analytics-target-type={analyticsKey ? 'block' : undefined}
            href={item.resultUrl}
            rel="noreferrer"
            target="_blank"
          >
            {card}
          </a>
        ) : (
          <div key={item.id ?? `${item.title}-${item.sortOrder}`}>{card}</div>
        );
      })}
    </div>
  );
}
