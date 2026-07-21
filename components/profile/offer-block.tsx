'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Check, Copy, ExternalLink, ShoppingBag } from 'lucide-react';
import { getThemeRuntime } from '@/lib/constants/profile-theme';
import type {
  BuilderBlock,
  ProfileBuilderState,
} from '@/lib/types/profile-builder';
import { cn } from '@/lib/utils/cn';

function getText(content: Record<string, unknown>, key: string) {
  return typeof content[key] === 'string' ? content[key].trim() : '';
}

export function OfferBlock({
  block,
  builder,
  presentation = 'default',
}: {
  block: BuilderBlock;
  builder: ProfileBuilderState;
  presentation?: 'default' | 'poster';
}) {
  const [copied, setCopied] = useState(false);
  const theme = getThemeRuntime(builder.profile.theme);
  const { content } = block;
  const url = getText(content, 'url');
  const title = getText(content, 'title') || block.title;
  const description = getText(content, 'description');
  const imageUrl = getText(content, 'imageUrl');
  const siteName = getText(content, 'siteName');
  const promoCode = getText(content, 'promoCode');
  const promoText = getText(content, 'promoText');
  const ctaLabel = getText(content, 'ctaLabel') || 'View offer';
  const isAffiliate = content.isAffiliate === true;
  const savedSize = getText(content, 'displaySize');
  const displaySize =
    savedSize === 'small' || savedSize === 'large' ? savedSize : 'medium';
  const isSmall = displaySize === 'small';
  const isMedium = displaySize === 'medium';

  if (!url || !/^https?:\/\//i.test(url)) return null;

  const copyPromoCode = async () => {
    try {
      await navigator.clipboard.writeText(promoCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <article
      className={cn(
        theme.radiusClass,
        'overflow-hidden border',
        isSmall && 'grid grid-cols-[76px_minmax(0,1fr)]',
        isMedium &&
          'grid grid-cols-[112px_minmax(0,1fr)] sm:grid-cols-[168px_minmax(0,1fr)]',
        displaySize === 'large' && presentation === 'poster'
          ? 'sm:grid sm:grid-cols-[0.9fr_1.1fr]'
          : '',
      )}
      style={{
        backgroundColor: theme.palette.surface,
        color: theme.palette.text,
        ...theme.blockStyle,
      }}
    >
      <div
        className={cn(
          'relative overflow-hidden',
          isSmall && 'min-h-full',
          isMedium && 'min-h-40',
          displaySize === 'large' && presentation === 'poster'
            ? 'min-h-56'
            : '',
          displaySize === 'large' && presentation !== 'poster'
            ? 'aspect-[16/9]'
            : '',
        )}
        style={
          !imageUrl ? { backgroundColor: theme.palette.subtle } : undefined
        }
      >
        {imageUrl ? (
          <Image
            alt=""
            className="object-cover"
            fill
            sizes={
              isSmall
                ? '76px'
                : isMedium
                  ? '168px'
                  : '(max-width: 640px) 100vw, 520px'
            }
            src={imageUrl}
          />
        ) : (
          <span
            className={cn(
              'flex h-full items-center justify-center',
              displaySize === 'large' && 'min-h-44',
            )}
          >
            <ShoppingBag
              className={cn('opacity-35', isSmall ? 'h-5 w-5' : 'h-8 w-8')}
              aria-hidden="true"
            />
          </span>
        )}
      </div>

      <div
        className={cn(
          'flex min-w-0 flex-col',
          isSmall && 'p-3',
          isMedium && 'p-4',
          displaySize === 'large' && 'p-5 sm:p-6',
        )}
      >
        {siteName ? (
          <p
            className={cn(
              'font-bold tracking-[0.16em] uppercase',
              isSmall ? 'truncate text-[9px]' : 'text-[11px]',
            )}
            style={{ color: theme.palette.description }}
          >
            {siteName}
          </p>
        ) : null}
        <h2
          className={cn(
            'font-bold',
            isSmall ? 'line-clamp-2 text-sm leading-5' : '',
            isMedium ? 'line-clamp-2 text-base leading-5' : '',
            displaySize === 'large' && 'text-xl',
            siteName && (isSmall ? 'mt-1' : 'mt-2'),
          )}
          style={{
            color: theme.palette.blockTitle,
            fontFamily: theme.fontFamilies.heading,
          }}
        >
          {title}
        </h2>
        {description && !isSmall ? (
          <p
            className={cn(
              'text-sm',
              isMedium ? 'mt-2 line-clamp-2 leading-5' : 'mt-3 leading-6',
            )}
            style={{ color: theme.palette.description }}
          >
            {description}
          </p>
        ) : null}

        {promoCode || (promoText && !isSmall) ? (
          <div
            className={cn(
              'rounded-xl border',
              isSmall ? 'mt-2 px-2 py-1.5' : '',
              isMedium ? 'mt-3 p-2.5' : '',
              displaySize === 'large' && 'mt-5 p-3',
            )}
            style={{
              backgroundColor: theme.palette.subtle,
              borderColor: theme.palette.border,
            }}
          >
            {promoText && !isSmall ? (
              <p className="line-clamp-2 text-xs font-medium">{promoText}</p>
            ) : null}
            {promoCode ? (
              <button
                data-analytics-event="promo_copy"
                data-analytics-target-key={block.analyticsKey}
                data-analytics-target-type="block"
                aria-label={`Copy promo code ${promoCode}`}
                className={cn(
                  'flex w-full items-center justify-between gap-2 font-mono font-bold',
                  isSmall ? 'text-[11px]' : 'text-sm',
                  promoText && 'mt-2',
                )}
                type="button"
                onClick={() => void copyPromoCode()}
              >
                <span>{promoCode}</span>
                <span className="flex items-center gap-1 font-sans text-xs font-semibold">
                  {copied ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                  {!isSmall ? (copied ? 'Copied' : 'Copy') : null}
                </span>
              </button>
            ) : null}
          </div>
        ) : null}

        <div
          className={cn(
            'flex items-center justify-between gap-2',
            isSmall ? 'mt-2' : isMedium ? 'mt-3' : 'mt-5',
          )}
        >
          {isAffiliate ? (
            <span
              className={isSmall ? 'text-[9px]' : 'text-[11px]'}
              style={{ color: theme.palette.description }}
            >
              Affiliate link
            </span>
          ) : (
            <span />
          )}
          <a
            data-analytics-event="block_click"
            data-analytics-target-key={block.analyticsKey}
            data-analytics-target-type="block"
            className={cn(
              'inline-flex items-center rounded-full font-bold transition hover:-translate-y-0.5',
              isSmall
                ? 'gap-1 px-2.5 py-1.5 text-[10px]'
                : isMedium
                  ? 'gap-1.5 px-3 py-2 text-xs'
                  : 'gap-2 px-4 py-2.5 text-sm',
            )}
            href={url}
            rel={isAffiliate ? 'sponsored noreferrer' : 'noreferrer'}
            style={{
              backgroundColor: theme.palette.accent,
              color: theme.palette.accentText,
            }}
            target="_blank"
          >
            {ctaLabel}
            <ExternalLink className={isSmall ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
          </a>
        </div>
      </div>
    </article>
  );
}
