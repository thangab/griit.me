'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  LayoutGrid,
  LogOut,
  Menu,
  PanelsTopLeft,
  Settings,
  UserRound,
  X,
} from 'lucide-react';
import { dashboardNavItems } from '@/lib/constants/navigation';
import { signOutAction } from '@/lib/actions/auth';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';

const iconMap = {
  LayoutGrid,
  UserRound,
  PanelsTopLeft,
  BarChart3,
  Settings,
};

export function MobileDashboardNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <header className="border-border bg-background/95 sticky top-0 z-40 flex h-16 items-center justify-between border-b px-4 backdrop-blur">
        <Link
          href="/dashboard"
          className="flex items-center gap-3"
          onClick={() => setIsOpen(false)}
        >
          <div className="bg-primary text-primary-foreground flex h-9 w-9 items-center justify-center rounded-xl text-sm font-semibold">
            G
          </div>
          <div>
            <p className="text-sm font-semibold">Griit</p>
            <p className="text-muted-foreground text-xs">Studio</p>
          </div>
        </Link>
        <Button
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setIsOpen((current) => !current)}
          size="sm"
          type="button"
          variant="outline"
        >
          {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </header>

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
            const isActive =
              item.href === '/dashboard'
                ? pathname === item.href
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
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
          <p className="text-sm font-semibold">Ready to publish?</p>
          <p className="text-muted-foreground mt-1 text-sm">
            Your athlete profile is ready for the next milestone.
          </p>
          <form action={signOutAction} className="mt-4">
            <Button className="w-full" type="submit" variant="outline">
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </form>
        </div>
      </aside>
    </div>
  );
}
