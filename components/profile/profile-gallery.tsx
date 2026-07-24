'use client';

import { CaretLeftIcon, CaretRightIcon, XIcon } from '@phosphor-icons/react';
import Image from 'next/image';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import type { GalleryLayout } from '@/lib/constants/profile-theme';
import type { BuilderGalleryItem } from '@/lib/types/profile-builder';
import { cn } from '@/lib/utils/cn';

type ProfileGalleryProps = {
  items: BuilderGalleryItem[];
  layout: GalleryLayout;
  columnsClassName: string;
  gridImageSizes: string;
  imageStyle?: CSSProperties;
};

export function ProfileGallery({
  items,
  layout,
  columnsClassName,
  gridImageSizes,
  imageStyle,
}: ProfileGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const activeItem = activeIndex === null ? null : items[activeIndex];
  const currentIndex = activeIndex ?? 0;

  useEffect(() => {
    if (activeIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveIndex(null);
      if (event.key === 'ArrowLeft') {
        setActiveIndex((current) =>
          current === null ? null : (current - 1 + items.length) % items.length,
        );
      }
      if (event.key === 'ArrowRight') {
        setActiveIndex((current) =>
          current === null ? null : (current + 1) % items.length,
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeIndex, items.length]);

  return (
    <>
      <div
        className={cn(
          'gap-2',
          layout === 'carousel'
            ? 'flex snap-x overflow-x-auto'
            : columnsClassName,
        )}
      >
        {items.map((item, index) => (
          <button
            key={item.id ?? `${item.imageUrl}-${index}`}
            type="button"
            aria-label={`Open ${item.altText || item.caption || `gallery image ${index + 1}`}`}
            className={cn(
              'group relative aspect-square overflow-hidden bg-slate-200 text-left',
              'cursor-zoom-in focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current',
              layout === 'carousel' && 'w-52 shrink-0 snap-center',
            )}
            style={imageStyle}
            data-analytics-event={
              item.analyticsKey ? 'gallery_open' : undefined
            }
            data-analytics-target-type={
              item.analyticsKey ? 'gallery' : undefined
            }
            data-analytics-target-key={item.analyticsKey || undefined}
            onClick={() => setActiveIndex(index)}
          >
            <Image
              alt={item.altText || item.caption || ''}
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              fill
              sizes={layout === 'carousel' ? '208px' : gridImageSizes}
              src={item.imageUrl}
            />
            <span className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
          </button>
        ))}
      </div>

      {activeItem && typeof document !== 'undefined'
        ? createPortal(
            <div
              className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
              role="presentation"
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) setActiveIndex(null);
              }}
            >
              <div
                aria-label="Image preview"
                aria-modal="true"
                className="relative flex max-h-full max-w-full flex-col items-center"
                role="dialog"
              >
                <button
                  ref={closeButtonRef}
                  type="button"
                  aria-label="Close image preview"
                  className="absolute top-2 right-2 z-10 grid size-11 place-items-center rounded-full bg-black/65 text-white transition hover:bg-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  onClick={() => setActiveIndex(null)}
                >
                  <XIcon aria-hidden="true" className="size-5" />
                </button>

                <div className="relative h-[80dvh] w-[92vw] max-w-7xl overflow-hidden">
                  <Image
                    alt={activeItem.altText || activeItem.caption || ''}
                    className="object-contain"
                    fill
                    priority
                    sizes="92vw"
                    src={activeItem.imageUrl}
                  />
                </div>

                {items.length > 1 ? (
                  <>
                    <button
                      type="button"
                      aria-label="Previous image"
                      className="absolute top-1/2 left-2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-black/65 text-white transition hover:bg-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:left-4"
                      onClick={() =>
                        setActiveIndex(
                          (currentIndex - 1 + items.length) % items.length,
                        )
                      }
                    >
                      <CaretLeftIcon aria-hidden="true" className="size-6" />
                    </button>
                    <button
                      type="button"
                      aria-label="Next image"
                      className="absolute top-1/2 right-2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-black/65 text-white transition hover:bg-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:right-4"
                      onClick={() =>
                        setActiveIndex((currentIndex + 1) % items.length)
                      }
                    >
                      <CaretRightIcon aria-hidden="true" className="size-6" />
                    </button>
                  </>
                ) : null}

                {activeItem.caption ? (
                  <p className="mt-3 max-w-3xl text-center text-sm text-white/85">
                    {activeItem.caption}
                  </p>
                ) : null}
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
