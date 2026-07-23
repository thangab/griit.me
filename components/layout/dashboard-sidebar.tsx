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
        isCompact ? 'w-20' : 'w-72',
      )}
    >
      <div
        className={cn(
          'group/sidebar border-border bg-card/70 flex h-full min-h-0 flex-col border-r py-6 transition-[width,padding] duration-200',
          isCompact
            ? 'absolute top-0 left-0 z-30 w-20 px-3 hover:w-72 hover:px-5'
            : 'w-72 px-5',
        )}
      >
        <div
          ref={studioMenuRef}
          className={cn(
            'relative px-2 transition-[padding] duration-200',
            isCompact &&
              'px-0 group-hover/sidebar:px-2',
          )}
        >
          <button
            aria-expanded={isStudioMenuOpen}
            aria-haspopup="menu"
            className={cn(
              'hover:bg-accent flex w-full items-center gap-3 rounded-xl p-1 text-left transition-colors',
              isCompact
                ? 'justify-center group-hover/sidebar:justify-start'
                : 'justify-start',
            )}
            type="button"
            onClick={() => setIsStudioMenuOpen((current) => !current)}
          >
            <span className="bg-primary text-primary-foreground flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-semibold">
              G
            </span>
            <span
              className={cn(
                'min-w-0 flex-1 overflow-hidden whitespace-nowrap transition-[opacity,width] duration-200',
                isCompact
                  ? 'w-0 opacity-0 group-hover/sidebar:w-36 group-hover/sidebar:opacity-100'
                  : 'w-36 opacity-100',
              )}
            >
              <span className="block text-sm font-semibold">Griit</span>
              <span className="text-muted-foreground block text-sm">Studio</span>
            </span>
            <ChevronDown
              className={cn(
                'h-4 w-4 shrink-0 transition-[transform,opacity] duration-200',
                isStudioMenuOpen && 'rotate-180',
                isCompact &&
                  'w-0 opacity-0 group-hover/sidebar:w-4 group-hover/sidebar:opacity-100',
              )}
            />
          </button>

          {isStudioMenuOpen ? (
            <div
              className="border-border bg-background absolute top-[calc(100%+0.5rem)] left-0 z-50 w-56 rounded-xl border p-1.5 shadow-xl"
              role="menu"
            >
              {canSwitchProfiles ? (
                <div className="mb-1">
                  <p className="text-muted-foreground px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em]">
                    Profiles
                  </p>
                  <div className="max-h-56 overflow-y-auto">
                    {profiles.map((profile) => {
                      const isActive = profile.id === routeProfileId;
                      return (
                        <Link
                          key={profile.id}
                          className={cn(
                            'hover:bg-accent flex items-center gap-3 rounded-lg px-2 py-2 transition-colors',
                            isActive && 'bg-accent',
                          )}
                          href={`/dashboard/profiles/${profile.id}` as Route}
                          role="menuitem"
                          onClick={() => setIsStudioMenuOpen(false)}
                        >
                          <ProfileAvatar
                            avatarUrl={profile.avatarUrl}
                            className="bg-muted text-muted-foreground"
                            displayName={profile.displayName}
                            size={30}
                          />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-semibold">
                              {profile.displayName}
                            </span>
                            <span className="text-muted-foreground block truncate text-xs">
                              @{profile.username}
                            </span>
                          </span>
                          {isActive ? (
                            <CheckIcon className="text-primary h-4 w-4 shrink-0" />
                          ) : null}
                        </Link>
                      );
                    })}
                  </div>
                  <div className="bg-border my-1 h-px" />
                </div>
              ) : null}
              <Link
                className="hover:bg-accent flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
                href="/dashboard"
                role="menuitem"
                onClick={() => setIsStudioMenuOpen(false)}
              >
                <LayoutGrid className="h-4 w-4" />
                Dashboard
              </Link>
              <div className="bg-border my-1 h-px" />
              <form action={signOutAction}>
                <button
                  className="hover:bg-accent flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors"
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

        <nav className="mt-8 space-y-1">
          {dashboardNavItems.map((item) => {
            const Icon = iconMap[item.icon as keyof typeof iconMap];
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href as Route}
                title={isCompact ? item.label : undefined}
                className={cn(
                  'text-muted-foreground hover:bg-accent hover:text-foreground flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition',
                  isActive && 'bg-accent text-foreground',
                  isCompact &&
                    'justify-center px-0 group-hover/sidebar:justify-start group-hover/sidebar:px-3',
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
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
            'border-border bg-background mt-auto overflow-hidden rounded-xl border transition-[padding] duration-200',
            isCompact
              ? 'border-transparent bg-transparent p-0 opacity-0 group-hover/sidebar:border-border group-hover/sidebar:bg-background group-hover/sidebar:p-4 group-hover/sidebar:opacity-100'
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
            <p className="text-muted-foreground mt-1 text-sm">
              {isPro
                ? 'Everything is unlocked. Keep building what comes next.'
                : 'Get multiple profiles, advanced analytics, and more customization.'}
            </p>
          </div>
          {!isPro ? (
            <Button
              asChild
              className={cn(
                'w-full transition-[margin,padding] duration-200',
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
