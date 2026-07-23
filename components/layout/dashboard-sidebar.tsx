'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { usePathname } from 'next/navigation';
import {
  ChartBarIcon as BarChart3,
  CaretDownIcon as ChevronDown,
  CheckIcon,
  GearIcon as Settings,
  LayoutIcon as PanelsTopLeft,
  LockSimpleIcon as LockSimple,
  SignOutIcon as LogOut,
  SquaresFourIcon as LayoutGrid,
  UserCircleIcon as UserRound,
} from '@phosphor-icons/react/ssr';
import { getDashboardNavItems } from '@/lib/constants/navigation';
import { signOutAction } from '@/lib/actions/auth';
import { cn } from '@/lib/utils/cn';
import { ProfileAvatar } from '@/components/profile/profile-avatar';
import { Button } from '@/components/ui/button';
import type { OwnedProfileSummary } from '@/lib/services/profile-builder';

const iconMap = {
  LayoutGrid,
  UserRound,
  PanelsTopLeft,
  BarChart3,
  Settings,
  LockSimple,
};

export function DashboardSidebar({
  defaultProfileId,
  profiles,
  canSwitchProfiles,
  isPro,
}: {
  defaultProfileId?: number;
  profiles: OwnedProfileSummary[];
  canSwitchProfiles: boolean;
  isPro: boolean;
}) {
  const pathname = usePathname();
  const [isStudioMenuOpen, setIsStudioMenuOpen] = useState(false);
  const studioMenuRef = useRef<HTMLDivElement>(null);
  const isCompact = pathname.endsWith('/design');
  const routeProfileId = Number(
    pathname.match(/^\/dashboard\/profiles\/(\d+)/)?.[1] ?? defaultProfileId,
  );
  const dashboardNavItems = getDashboardNavItems(pathname, defaultProfileId);

  useEffect(() => {
    if (!isStudioMenuOpen) return;

    const closeMenu = (event: MouseEvent) => {
      if (!studioMenuRef.current?.contains(event.target as Node)) {
        setIsStudioMenuOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsStudioMenuOpen(false);
    };

    document.addEventListener('mousedown', closeMenu);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('mousedown', closeMenu);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [isStudioMenuOpen]);

  return (
    <aside
      className={cn(
        'relative hidden shrink-0 lg:block',
        isCompact ? 'w-[5.25rem]' : 'w-72',
      )}
    >
      <div
        className={cn(
          'group/sidebar flex h-full min-h-0 flex-col border-r border-white/10 bg-[#151515] py-6 text-white shadow-[18px_0_45px_rgba(21,21,21,0.08)] transition-[width,padding] duration-200',
          isCompact
            ? 'absolute top-0 left-0 z-30 w-[5.25rem] px-3 hover:w-72 hover:px-5'
            : 'w-72 px-5',
        )}
      >
        <div
          ref={studioMenuRef}
          className={cn(
            'relative px-2 transition-[padding] duration-200',
            isCompact && 'px-0 group-hover/sidebar:px-2',
          )}
        >
          <button
            aria-expanded={isStudioMenuOpen}
            aria-haspopup="menu"
            className={cn(
              'flex w-full items-center gap-3 rounded-2xl p-1 text-left transition-colors hover:bg-white/[0.08]',
              isCompact
                ? 'justify-center group-hover/sidebar:justify-start'
                : 'justify-start',
            )}
            type="button"
            onClick={() => setIsStudioMenuOpen((current) => !current)}
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#3157ff] text-sm font-black text-white">
              G.
            </span>
            <span
              className={cn(
                'min-w-0 flex-1 overflow-hidden whitespace-nowrap transition-[opacity,width] duration-200',
                isCompact
                  ? 'w-0 opacity-0 group-hover/sidebar:w-36 group-hover/sidebar:opacity-100'
                  : 'w-36 opacity-100',
              )}
            >
              <span className="block text-sm font-black tracking-[-0.02em]">
                GRIIT.
              </span>
              <span className="block text-xs text-white/45">Studio</span>
            </span>
            <ChevronDown
              className={cn(
                'h-4 w-4 shrink-0 text-white/45 transition-[transform,opacity] duration-200',
                isStudioMenuOpen && 'rotate-180',
                isCompact &&
                  'w-0 opacity-0 group-hover/sidebar:w-4 group-hover/sidebar:opacity-100',
              )}
            />
          </button>

          {isStudioMenuOpen ? (
            <div
              className="absolute top-[calc(100%+0.5rem)] left-0 z-50 w-60 rounded-2xl border border-black/10 bg-white p-1.5 text-[#151515] shadow-[0_22px_60px_rgba(0,0,0,0.18)]"
              role="menu"
            >
              {canSwitchProfiles ? (
                <div className="mb-1">
                  <p className="px-3 py-1.5 text-[10px] font-black tracking-[0.18em] text-black/40 uppercase">
                    Profiles
                  </p>
                  <div className="max-h-56 overflow-y-auto">
                    {profiles.map((profile) => {
                      const isActive = profile.id === routeProfileId;
                      return (
                        <Link
                          key={profile.id}
                          className={cn(
                            'flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-[#f2f1eb]',
                            isActive && 'bg-[#eef2ff]',
                          )}
                          href={`/dashboard/profiles/${profile.id}` as Route}
                          role="menuitem"
                          onClick={() => setIsStudioMenuOpen(false)}
                        >
                          <ProfileAvatar
                            avatarUrl={profile.avatarUrl}
                            className="bg-[#f2f1eb] text-black/50"
                            displayName={profile.displayName}
                            size={30}
                          />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-semibold">
                              {profile.displayName}
                            </span>
                            <span className="block truncate text-xs text-black/45">
                              @{profile.username}
                            </span>
                          </span>
                          {isActive ? (
                            <CheckIcon className="h-4 w-4 shrink-0 text-[#3157ff]" />
                          ) : null}
                        </Link>
                      );
                    })}
                  </div>
                  <div className="my-1 h-px bg-black/10" />
                </div>
              ) : null}
              <Link
                className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition-colors hover:bg-[#f2f1eb]"
                href="/dashboard"
                role="menuitem"
                onClick={() => setIsStudioMenuOpen(false)}
              >
                <LayoutGrid className="h-4 w-4" />
                Dashboard
              </Link>
              <div className="my-1 h-px bg-black/10" />
              <form action={signOutAction}>
                <button
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-semibold transition-colors hover:bg-[#f2f1eb]"
                  role="menuitem"
                  type="submit"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </form>
            </div>
          ) : null}
        </div>

        <nav className="mt-8 space-y-1.5">
          {dashboardNavItems.map((item) => {
            const Icon = iconMap[item.icon as keyof typeof iconMap];
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href as Route}
                title={isCompact ? item.label : undefined}
                className={cn(
                  'flex min-h-11 items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-white/50 transition hover:bg-white/[0.08] hover:text-white',
                  isActive &&
                    'bg-white text-[#151515] shadow-sm hover:bg-white hover:text-[#151515]',
                  isCompact &&
                    'justify-center px-0 group-hover/sidebar:justify-start group-hover/sidebar:px-3',
                )}
              >
                <Icon
                  className={cn(
                    'h-[18px] w-[18px] shrink-0',
                    isActive && 'text-[#3157ff]',
                  )}
                />
                <span
                  className={cn(
                    'overflow-hidden whitespace-nowrap transition-[opacity,width] duration-200',
                    isCompact
                      ? 'w-0 opacity-0 group-hover/sidebar:w-36 group-hover/sidebar:opacity-100'
                      : 'w-36 opacity-100',
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div
          className={cn(
            'mt-auto overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] transition-[padding] duration-200',
            isCompact
              ? 'border-transparent bg-transparent p-0 opacity-0 group-hover/sidebar:border-white/10 group-hover/sidebar:bg-white/[0.06] group-hover/sidebar:p-4 group-hover/sidebar:opacity-100'
              : 'p-4',
          )}
        >
          <div
            className={cn(
              'overflow-hidden transition-[opacity,max-height] duration-200',
              isCompact
                ? 'max-h-0 opacity-0 group-hover/sidebar:max-h-24 group-hover/sidebar:opacity-100'
                : 'max-h-24 opacity-100',
            )}
          >
            <p className="text-sm font-semibold">
              {isPro ? "You're all set" : 'Unlock more with Pro'}
            </p>
            <p className="mt-1 text-sm leading-5 text-white/45">
              {isPro
                ? 'Everything is unlocked. Keep building what comes next.'
                : 'Unlock every template, advanced styles, deeper analytics, and up to 5 profiles.'}
            </p>
          </div>
          {!isPro ? (
            <Button
              asChild
              className={cn(
                'w-full bg-white text-[#151515] transition-[margin,padding] duration-200 hover:bg-[#eef2ff] hover:text-[#3157ff]',
                isCompact
                  ? 'mt-0 px-0 group-hover/sidebar:mt-4 group-hover/sidebar:px-4'
                  : 'mt-4',
              )}
            >
              <Link href="/dashboard/subscribe">
                <LockSimple className="h-4 w-4" />
                <span
                  className={cn(
                    'overflow-hidden whitespace-nowrap transition-[opacity,width] duration-200',
                    isCompact
                      ? 'w-0 opacity-0 group-hover/sidebar:w-28 group-hover/sidebar:opacity-100'
                      : 'w-auto opacity-100',
                  )}
                >
                  Upgrade to Pro
                </span>
              </Link>
            </Button>
          ) : null}
        </div>
      </div>
    </aside>
  );
}
