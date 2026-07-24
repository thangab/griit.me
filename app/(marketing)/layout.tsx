import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRightIcon } from '@phosphor-icons/react/ssr';
import { createServerSupabaseClient } from '@/lib/config/supabase-server';

export const metadata: Metadata = {
  title: 'Griit — The link in bio built for athletes',
  description:
    'Build your athlete identity around your next goal, achievements, content, sponsors, and partnership opportunities.',
};

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabaseClient();
  // This only controls a marketing CTA. Reading the cookie-backed session
  // avoids an Auth API round trip; protected dashboard routes still verify the
  // user with getUser().
  const { data } = await supabase.auth.getSession();
  const isAuthenticated = Boolean(data.session);

  return (
    <div className="min-h-screen bg-[#f7f6f1] text-[#151515]">
      <header className="sticky top-0 z-50 border-b border-black/10 bg-[#f7f6f1]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-18 max-w-[1380px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <Link className="text-xl font-black tracking-[-0.06em]" href="/">
            GRIIT<span className="text-[#3157ff]">.</span>
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-semibold lg:flex">
            <Link
              className="transition-opacity hover:opacity-55"
              href="/athletes"
            >
              Athletes
            </Link>
            <Link
              className="transition-opacity hover:opacity-55"
              href="/#features"
            >
              Features
            </Link>
            <Link
              className="transition-opacity hover:opacity-55"
              href="/pricing"
            >
              Pricing
            </Link>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            {isAuthenticated ? (
              <Link
                className="inline-flex h-10 items-center gap-2 rounded-full bg-[#151515] px-4 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 sm:px-5"
                href="/dashboard"
              >
                Dashboard
                <ArrowRightIcon className="h-4 w-4" weight="bold" />
              </Link>
            ) : (
              <>
                <Link
                  className="hidden rounded-full px-4 py-2 text-sm font-semibold transition-colors hover:bg-black/5 sm:inline-flex"
                  href="/sign-in"
                >
                  Log in
                </Link>
                <Link
                  className="inline-flex h-10 items-center gap-2 rounded-full bg-[#151515] px-4 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 sm:px-5"
                  href="/sign-up"
                >
                  Get started
                  <ArrowRightIcon className="h-4 w-4" weight="bold" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {children}

      <footer className="border-t border-black/10 bg-[#151515] text-white">
        <div className="mx-auto grid max-w-[1380px] gap-10 px-5 py-12 sm:px-8 md:grid-cols-[1fr_auto] lg:px-12">
          <div>
            <p className="text-2xl font-black tracking-[-0.06em]">
              GRIIT<span className="text-[#a9ed35]">.</span>
            </p>
            <p className="mt-3 max-w-sm text-sm leading-6 text-white/55">
              A beautiful public profile for your next goal, your athlete story,
              and the opportunities ahead.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-10 text-sm sm:grid-cols-3 sm:gap-14">
            <div className="flex flex-col gap-3 text-white/65">
              <p className="text-xs font-black tracking-[0.14em] text-white/35 uppercase">
                Product
              </p>
              <Link className="hover:text-white" href="/athletes">
                Athletes
              </Link>
              <Link className="hover:text-white" href="/#features">
                Features
              </Link>
              <Link className="hover:text-white" href="/pricing">
                Pricing
              </Link>
            </div>
            <div className="flex flex-col gap-3 text-white/65">
              <p className="text-xs font-black tracking-[0.14em] text-white/35 uppercase">
                Account
              </p>
              <Link className="hover:text-white" href="/sign-in">
                Log in
              </Link>
              <Link className="hover:text-white" href="/sign-up">
                Sign up
              </Link>
              <Link className="hover:text-white" href="/support">
                Support
              </Link>
            </div>
            <div className="flex flex-col gap-3 text-white/65">
              <p className="text-xs font-black tracking-[0.14em] text-white/35 uppercase">
                Legal
              </p>
              <Link className="hover:text-white" href="/privacy">
                Privacy
              </Link>
              <Link className="hover:text-white" href="/terms">
                Terms
              </Link>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 px-5 py-5 text-center text-xs text-white/35 sm:px-8">
          © {new Date().getFullYear()} Griit. Built for every athlete and every
          sport.
        </div>
      </footer>
    </div>
  );
}
