'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  LayoutGrid,
  LogOut,
  PanelsTopLeft,
  Settings,
  UserRound,
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

export function DashboardSidebar() {
  const pathname = usePathname();
  const isCompact = pathname.startsWith('/dashboard/design');

  return (
    <aside
      className={cn(
        'relative hidden shrink-0 lg:block',
        isCompact ? 'w-20' : 'w-72',
      )}
    >
      <div
        className={cn(
          'group/sidebar border-border bg-card/70 flex h-full min-h-screen flex-col border-r py-6 transition-[width,padding] duration-200',
          isCompact
            ? 'absolute top-0 left-0 z-30 w-20 px-3 hover:w-72 hover:px-5'
            : 'w-72 px-5',
        )}
      >
        <div
          className={cn(
            'flex items-center gap-3 px-2 transition-[justify-content,padding] duration-200',
            isCompact &&
              'justify-center px-0 group-hover/sidebar:justify-start group-hover/sidebar:px-2',
          )}
        >
          <div className="bg-primary text-primary-foreground flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-semibold">
            G
          </div>
          <div
            className={cn(
              'overflow-hidden whitespace-nowrap transition-[opacity,width] duration-200',
              isCompact
                ? 'w-0 opacity-0 group-hover/sidebar:w-40 group-hover/sidebar:opacity-100'
                : 'w-40 opacity-100',
            )}
          >
            <p className="text-sm font-semibold">Griit</p>
            <p className="text-muted-foreground text-sm">Studio</p>
          </div>
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
            isCompact ? 'p-2 group-hover/sidebar:p-4' : 'p-4',
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
            <p className="text-sm font-semibold">Ready to publish?</p>
            <p className="text-muted-foreground mt-1 text-sm">
              Your athlete profile is ready for the next milestone.
            </p>
          </div>
          <form
            action={signOutAction}
            className={cn(isCompact ? 'mt-0 group-hover/sidebar:mt-4' : 'mt-4')}
          >
            <Button
              className={cn(
                'w-full transition-[padding] duration-200',
                isCompact && 'px-0 group-hover/sidebar:px-4',
              )}
              variant="outline"
              type="submit"
              title={isCompact ? 'Sign out' : undefined}
            >
              <LogOut className="h-4 w-4" />
              <span
                className={cn(
                  'overflow-hidden whitespace-nowrap transition-[opacity,width] duration-200',
                  isCompact
                    ? 'w-0 opacity-0 group-hover/sidebar:w-16 group-hover/sidebar:opacity-100'
                    : 'w-16 opacity-100',
                )}
              >
                Sign out
              </span>
            </Button>
          </form>
        </div>
      </div>
    </aside>
  );
}
