'use client';

import { useEffect, useState } from 'react';
import Image, { type StaticImageData } from 'next/image';
import { CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react/ssr';
import { cn } from '@/lib/utils/cn';
import editorProfile from './editor-profile.png';
import editorGoal from './editor-goal.png';
import editorSocialHeader from './editor-social-header.png';
import editorBlockPicker from './editor-block-picker.png';
import editorOverview from './editor-overview.png';

type EditorSlide = {
  image: StaticImageData;
  label: string;
  alt: string;
  objectPosition?: string;
};

const editorSlides: EditorSlide[] = [
  {
    image: editorOverview,
    label: 'Editor overview',
    alt: 'Griit editor overview with content, live profile preview, and visual settings',
  },
  {
    image: editorProfile,
    label: 'Athlete identity',
    alt: 'Editing athlete identity, profile picture, biography, location, and sports in Griit',
  },
  {
    image: editorGoal,
    label: 'Goals',
    alt: 'Editing an athlete goal, motivation, target date, and countdown in Griit',
  },
  {
    image: editorSocialHeader,
    label: 'Socials & header',
    alt: 'Editing social links and the profile header layout in Griit',
  },
  {
    image: editorBlockPicker,
    label: 'Content blocks',
    alt: 'Choosing a new content block from the Griit block library',
    objectPosition: 'left center',
  },
];

export function EditorShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (
      isPaused ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % editorSlides.length);
    }, 4500);

    return () => window.clearInterval(interval);
  }, [isPaused]);

  const showPrevious = () => {
    setActiveIndex(
      (current) => (current - 1 + editorSlides.length) % editorSlides.length,
    );
  };

  const showNext = () => {
    setActiveIndex((current) => (current + 1) % editorSlides.length);
  };

  return (
    <div
      className="w-full max-w-[780px] justify-self-end overflow-hidden rounded-[2rem] border border-black/10 bg-white p-2 shadow-[0_30px_90px_rgba(20,20,20,0.12)] sm:p-3"
      onBlur={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff6b5f]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#ffc44f]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#55c98b]" />
        <span
          aria-live="polite"
          className="ml-2 min-w-0 flex-1 truncate text-[10px] font-bold tracking-[0.12em] text-black/40 uppercase"
        >
          {editorSlides[activeIndex].label}
        </span>
        <button
          aria-label="Show previous editor view"
          className="flex h-7 w-7 items-center justify-center rounded-full border border-black/10 text-black/50 transition-colors hover:bg-black hover:text-white"
          onClick={showPrevious}
          type="button"
        >
          <CaretLeftIcon className="h-3.5 w-3.5" weight="bold" />
        </button>
        <button
          aria-label="Show next editor view"
          className="flex h-7 w-7 items-center justify-center rounded-full border border-black/10 text-black/50 transition-colors hover:bg-black hover:text-white"
          onClick={showNext}
          type="button"
        >
          <CaretRightIcon className="h-3.5 w-3.5" weight="bold" />
        </button>
      </div>

      <div className="relative aspect-[1900/1307] overflow-hidden rounded-[1.45rem] border border-black/[0.06] bg-[#f4f5f7]">
        {editorSlides.map((slide, index) => (
          <Image
            alt={slide.alt}
            aria-hidden={index !== activeIndex}
            className={cn(
              'absolute inset-0 h-full w-full object-contain transition-opacity duration-700',
              index === activeIndex
                ? 'opacity-100'
                : 'pointer-events-none opacity-0',
            )}
            key={slide.label}
            placeholder="blur"
            quality={86}
            sizes="(min-width: 1280px) 780px, (min-width: 1024px) 60vw, (min-width: 640px) calc(100vw - 64px), calc(100vw - 40px)"
            src={slide.image}
            style={{ objectPosition: slide.objectPosition ?? 'center' }}
          />
        ))}
      </div>

      <div className="flex items-center justify-center gap-1.5 px-3 pt-2.5 pb-1">
        {editorSlides.map((slide, index) => (
          <button
            aria-label={`Show ${slide.label}`}
            aria-pressed={index === activeIndex}
            className={cn(
              'h-1.5 rounded-full transition-[width,background-color]',
              index === activeIndex
                ? 'w-6 bg-[#3157ff]'
                : 'w-1.5 bg-black/15 hover:bg-black/30',
            )}
            key={slide.label}
            onClick={() => setActiveIndex(index)}
            type="button"
          />
        ))}
      </div>
    </div>
  );
}
