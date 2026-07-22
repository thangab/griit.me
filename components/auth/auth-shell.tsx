import Link from 'next/link';
import { AuthVisualCarousel } from '@/components/auth/auth-visual-carousel';

export function AuthShell({
  children,
  description,
  title,
}: {
  children: React.ReactNode;
  description: string;
  title: string;
}) {
  return (
    <main className="grid min-h-screen bg-white text-[#151515] lg:grid-cols-2">
      <section className="relative flex min-h-screen items-center justify-center px-6 py-24 sm:px-10 lg:px-14">
        <Link
          className="absolute top-7 left-6 text-xl font-black tracking-[-0.06em] sm:top-9 sm:left-10 lg:left-12"
          href="/"
        >
          GRIIT<span className="text-[#3157ff]">.</span>
        </Link>

        <div className="w-full max-w-[430px]">
          <div className="mb-9 text-center">
            <p className="text-[11px] font-black tracking-[0.2em] text-[#3157ff] uppercase">
              Your athlete identity
            </p>
            <h1 className="mt-4 text-4xl font-black tracking-[-0.055em]">
              {title}
            </h1>
            <p className="mt-3 text-sm leading-6 text-black/48">
              {description}
            </p>
          </div>
          {children}
        </div>
      </section>

      <AuthVisualCarousel />
    </main>
  );
}
