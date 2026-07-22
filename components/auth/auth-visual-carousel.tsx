'use client';

import { useEffect, useState } from 'react';

const slides = [
  {
    image:
      'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=1800&q=88',
    title: 'Your goals deserve more than a bio link.',
    description:
      'Build a profile that shows where you are going, not only where you have been.',
  },
  {
    image:
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1800&q=88',
    title: 'Every session becomes part of your story.',
    description:
      'Bring your progress, achievements, content, and next challenge together.',
  },
  {
    image:
      'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=1800&q=88',
    title: 'Make your ambition visible.',
    description:
      'Give supporters, partners, and sponsors one place to understand your journey.',
  },
  {
    image:
      'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=1800&q=88',
    title: 'Built for every discipline and every level.',
    description:
      'Your athlete identity grows with you, from the first milestone to the biggest stage.',
  },
  {
    image:
      'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1800&q=88',
    title: 'One profile. Your whole athlete identity.',
    description:
      'Share what matters now and create opportunities for what comes next.',
  },
] as const;

const SLIDE_DURATION = 6000;

export function AuthVisualCarousel() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, SLIDE_DURATION);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <aside className="relative hidden min-h-screen overflow-hidden bg-[#101010] lg:block">
      {slides.map((slide, index) => (
        <div
          aria-hidden={activeSlide !== index}
          className={`absolute inset-0 bg-cover bg-center transition-[opacity,transform] duration-1000 ease-out ${
            activeSlide === index
              ? 'scale-100 opacity-100'
              : 'scale-[1.035] opacity-0'
          }`}
          key={slide.image}
          style={{ backgroundImage: `url("${slide.image}")` }}
        />
      ))}

      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.18),rgba(0,0,0,0.58))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_44%,transparent_0%,rgba(0,0,0,0.18)_68%,rgba(0,0,0,0.42)_100%)]" />

      <div className="relative flex min-h-screen flex-col items-center justify-center px-12 text-center text-white xl:px-20">
        <div className="grid w-full max-w-2xl">
          {slides.map((slide, index) => (
            <div
              aria-live={activeSlide === index ? 'polite' : 'off'}
              className={`col-start-1 row-start-1 transition duration-700 ${
                activeSlide === index
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-4 opacity-0'
              }`}
              key={slide.title}
            >
              <p className="text-xs font-black tracking-[0.22em] text-[#a9ed35] uppercase">
                Built for athletes
              </p>
              <p className="mt-5 text-[clamp(2.5rem,4.2vw,5rem)] leading-[0.94] font-black tracking-[-0.065em] text-balance">
                {slide.title}
              </p>
              <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-white/72 xl:text-lg">
                {slide.description}
              </p>
            </div>
          ))}
        </div>

        <div className="absolute bottom-10 flex items-center gap-2">
          {slides.map((slide, index) => (
            <button
              aria-label={`Show slide ${index + 1}`}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                activeSlide === index
                  ? 'w-8 bg-[#a9ed35]'
                  : 'w-1.5 bg-white/45 hover:bg-white/70'
              }`}
              key={slide.title}
              onClick={() => setActiveSlide(index)}
              type="button"
            />
          ))}
        </div>
      </div>
    </aside>
  );
}
