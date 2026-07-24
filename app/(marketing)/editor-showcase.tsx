'use client';

import { useEffect, useRef, useState } from 'react';
import Image, { type StaticImageData } from 'next/image';
import { PauseIcon, PlayIcon } from '@phosphor-icons/react/ssr';
import { cn } from '@/lib/utils/cn';
import editorAppearance from './editor-demo-appearance.png';
import editorBlockLibrary from './editor-demo-block-library.png';
import editorColors from './editor-demo-colors.png';
import editorContent from './editor-demo-content.png';
import editorHeader from './editor-demo-header.png';
import editorOverview from './editor-demo-overview.png';
import editorTemplateLibrary from './editor-demo-template-library.png';
import editorTemplates from './editor-demo-templates.png';

type EditorScene = {
  image: StaticImageData;
  label: string;
  alt: string;
};

const sceneDuration = 2000;

const editorScenes: EditorScene[] = [
  {
    image: editorOverview,
    label: 'Organize every block',
    alt: 'Griit editor showing an athlete profile, its content blocks, and visual settings',
  },
  {
    image: editorBlockLibrary,
    label: 'Add the right content',
    alt: 'Choosing a new profile block from the Griit content library',
  },
  {
    image: editorTemplates,
    label: 'Apply a complete template',
    alt: 'Choosing an athlete profile template in the Griit editor',
  },
  {
    image: editorTemplateLibrary,
    label: 'Explore every direction',
    alt: 'Browsing free and Pro athlete profile templates in the Griit editor',
  },
  {
    image: editorHeader,
    label: 'Shape the header',
    alt: 'Customizing the header layout and background in the Griit editor',
  },
  {
    image: editorColors,
    label: 'Tune every color',
    alt: 'Customizing profile colors and social links in the Griit editor',
  },
  {
    image: editorContent,
    label: 'Tell the full story',
    alt: 'Editing an athlete achievement and typography in the Griit editor',
  },
  {
    image: editorAppearance,
    label: 'Finish every detail',
    alt: 'Adjusting gallery content and block appearance in the Griit editor',
  },
];

export function EditorShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const remainingTime = useRef(sceneDuration);
  const startedAt = useRef<number | null>(null);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => {
      setPrefersReducedMotion(media.matches);
      if (media.matches) setIsPlaying(false);
    };

    updatePreference();
    media.addEventListener('change', updatePreference);
    return () => media.removeEventListener('change', updatePreference);
  }, []);

  useEffect(() => {
    if (!isPlaying || prefersReducedMotion) return;

    startedAt.current = window.performance.now();
    const timeout = window.setTimeout(() => {
      remainingTime.current = sceneDuration;
      startedAt.current = null;
      setActiveIndex((current) => (current + 1) % editorScenes.length);
    }, remainingTime.current);

    return () => {
      window.clearTimeout(timeout);

      if (startedAt.current !== null) {
        remainingTime.current = Math.max(
          0,
          remainingTime.current -
            (window.performance.now() - startedAt.current),
        );
        startedAt.current = null;
      }
    };
  }, [activeIndex, isPlaying, prefersReducedMotion]);

  const selectScene = (index: number) => {
    remainingTime.current = sceneDuration;
    startedAt.current = null;
    setActiveIndex(index);
  };

  return (
    <div className="w-full max-w-[780px] justify-self-end overflow-hidden rounded-[1.75rem] border border-black/10 bg-white p-2 shadow-[0_30px_90px_rgba(20,20,20,0.13)] sm:p-3">
      <div className="relative aspect-[2648/1518] overflow-hidden rounded-[1.25rem] border border-black/[0.06] bg-[#f5f5f2]">
        {editorScenes.map((scene, index) => (
          <Image
            alt={scene.alt}
            aria-hidden={index !== activeIndex}
            className={cn(
              'absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-700 ease-out',
              index === activeIndex
                ? 'scale-100 opacity-100'
                : 'pointer-events-none scale-[1.012] opacity-0',
            )}
            key={scene.label}
            placeholder="blur"
            priority={index === 0}
            quality={82}
            sizes="(min-width: 1280px) 780px, (min-width: 1024px) 60vw, (min-width: 640px) calc(100vw - 64px), calc(100vw - 40px)"
            src={scene.image}
          />
        ))}
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-2 pt-3 pb-1 sm:grid-cols-[minmax(120px,0.65fr)_minmax(180px,1fr)_auto] sm:px-3">
        <div aria-live="polite" className="min-w-0">
          <p className="text-[9px] font-black tracking-[0.16em] text-black/35 uppercase">
            Live editor demo
          </p>
          <p className="truncate text-xs font-bold text-black/70">
            {editorScenes[activeIndex].label}
          </p>
        </div>

        <div className="col-span-2 flex gap-1.5 sm:col-span-1" role="tablist">
          {editorScenes.map((scene, index) => (
            <button
              aria-label={`Show ${scene.label}`}
              aria-selected={index === activeIndex}
              className="relative h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-black/10"
              key={scene.label}
              onClick={() => selectScene(index)}
              role="tab"
              type="button"
            >
              {index < activeIndex ? (
                <span className="absolute inset-0 bg-[#3157ff]" />
              ) : null}
              {index === activeIndex ? (
                <span
                  className="editor-scene-progress absolute inset-y-0 left-0 w-full origin-left bg-[#3157ff]"
                  key={activeIndex}
                  style={{
                    animationDuration: `${sceneDuration}ms`,
                    animationPlayState: isPlaying ? 'running' : 'paused',
                  }}
                />
              ) : null}
            </button>
          ))}
        </div>

        <button
          aria-label={isPlaying ? 'Pause editor demo' : 'Play editor demo'}
          className="row-start-1 flex h-9 w-9 items-center justify-center justify-self-end rounded-full border border-black/10 text-black/55 transition-colors hover:bg-black hover:text-white sm:row-auto"
          onClick={() => setIsPlaying((playing) => !playing)}
          type="button"
        >
          {isPlaying ? (
            <PauseIcon className="h-3.5 w-3.5" weight="fill" />
          ) : (
            <PlayIcon className="h-3.5 w-3.5" weight="fill" />
          )}
        </button>
      </div>

      <style jsx>{`
        @keyframes editor-scene-progress {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }

        .editor-scene-progress {
          animation-name: editor-scene-progress;
          animation-timing-function: linear;
          animation-fill-mode: forwards;
        }

        @media (prefers-reduced-motion: reduce) {
          .editor-scene-progress {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
