'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { usePathname } from 'next/navigation';
import {
  ChartBarIcon as BarChart3,
  CaretDownIcon as ChevronDown,
  CheckIcon,
  GearIcon as Settings,
  LayoutIcon as PanelsTopLeft,
  ListIcon as Menu,
  LockSimpleIcon as LockSimple,
  SignOutIcon as LogOut,
  SquaresFourIcon as LayoutGrid,
  UserCircleIcon as UserRound,
  XIcon as X,
} from '@phosphor-icons/react/ssr';
import { getDashboardNavItems } from '@/lib/constants/navigation';
import { signOutAction } from '@/lib/actions/auth';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';
import { ProfileAvatar } from '@/components/profile/profile-avatar';
import type { OwnedProfileSummary } from '@/lib/services/profile-builder';

const iconMap = {
  LayoutGrid,
  UserRound,
  PanelsTopLeft,
  BarChart3,
  Settings,
  LockSimple,
};

export function MobileDashboardNav({
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
  const [isOpen, setIsOpen] = useState(false);
  const [isStudioMenuOpen, setIsStudioMenuOpen] = useState(false);
  const routeProfileId = Number(
    pathname.match(/^\/dashboard\/profiles\/(\d+)/)?.[1] ?? defaultProfileId,
  );
  const dashboardNavItems = getDashboardNavItems(pathname, defaultProfileId);

  return (
    <div className="lg:hidden">
      <header className="border-border bg-background/95 sticky top-0 z-40 flex h-16 items-center justify-between border-b px-4 backdrop-blur">
        <button
          aria-expanded={isStudioMenuOpen}
          aria-haspopup="menu"
          className="hover:bg-muted flex items-center gap-3 rounded-xl p-1 pr-2 text-left transition-colors"
          type="button"
          onClick={() => setIsStudioMenuOpen((current) => !current)}
        >
          <div className="bg-primary text-primary-foreground flex h-9 w-9 items-center justify-center rounded-xl text-sm font-semibold">
            G
          </div>
          <div>
            <p className="text-sm font-semibold">Griit</p>
            <p className="text-muted-foreground text-xs">Studio</p>
          </div>
          <ChevronDown
            className={cn(
              'text-muted-foreground h-4 w-4 transition-transform',
              isStudioMenuOpen && 'rotate-180',
            )}
          />
        </button>
        <Button
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          onClick={() => {
            setIsStudioMenuOpen(false);
            setIsOpen((current) => !current);
          }}
          size="sm"
          type="button"
          variant="outline"
        >
          {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </header>

      {isStudioMenuOpen ? (
        <>
          <button
            aria-label="Close studio menu"
            className="fixed inset-0 z-40"
            type="button"
            onClick={() => setIsStudioMenuOpen(false)}
          />
          <div
            className="border-border bg-background fixed top-14 left-4 z-50 w-56 rounded-xl border p-1.5 shadow-xl"
            role="menu"
          >
            {canSwitchProfiles ? (
              <div className="mb-1">
                <p className="text-muted-foreground px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em]">
                  Profiles
                </p>
                <div className="max-h-64 overflow-y-auto">
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
        </>
      ) : null}

      {isOpen ? (
        <button
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-black/30"
          onClick={() => setIsOpen(false)}
          type="button"
        />
      ) : null}

      <aside
        className={cn(
          'border-border bg-background fixed top-0 right-0 z-50 flex h-dvh w-[min(320px,86vw)] flex-col border-l p-5 shadow-xl transition-transform duration-200',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="bg-primary text-primary-foreground flex h-10 w-10 items-center justify-center rounded-xl text-sm font-semibold">
              G
            </div>
            <div>
              <p className="text-sm font-semibold">Griit</p>
              <p className="text-muted-foreground text-xs">Studio</p>
            </div>
          </div>
          <Button
            aria-label="Close menu"
            onClick={() => setIsOpen(false)}
            size="sm"
            type="button"
            variant="ghost"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className="mt-8 space-y-1">
          {dashboardNavItems.map((item) => {
            const Icon = iconMap[item.icon as keyof typeof iconMap];
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href as Route}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'text-muted-foreground hover:bg-accent hover:text-foreground flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition',
                  isActive && 'bg-accent text-foreground',
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-border bg-card mt-auto rounded-xl border p-4">
          <p className="text-sm font-semibold">
            {isPro ? "You're all set" : 'Unlock more with Pro'}
          </p>
          <p className="text-muted-foreground mt-1 text-sm">
            {isPro
              ? 'Everything is unlocked. Keep building what comes next.'
              : 'Get multiple profiles, advanced analytics, and more customization.'}
          </p>
          {!isPro ? (
            <Button asChild className="mt-4 w-full">
              <Link
                href="/dashboard/subscribe"
                onClick={() => setIsOpen(false)}
              >
                <LockSimple className="h-4 w-4" />
                Upgrade to Pro
              </Link>
            </Button>
          ) : null}
        </div>
      </aside>
    </div>
  );
}
