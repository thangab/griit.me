import Link from 'next/link';
import { LayoutGrid, PanelsTopLeft, Settings, UserRound, BarChart3, LogOut } from 'lucide-react';
import { dashboardNavItems } from '@/lib/constants/navigation';
import { Button } from '@/components/ui/button';

const iconMap = {
  LayoutGrid,
  UserRound,
  PanelsTopLeft,
  BarChart3,
  Settings,
};

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 shrink-0 border-r border-border bg-card/70 px-5 py-6 lg:flex lg:flex-col">
          <div className="flex items-center gap-3 px-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground">
              G
            </div>
            <div>
              <p className="text-sm font-semibold">Griit</p>
              <p className="text-sm text-muted-foreground">Studio</p>
            </div>
          </div>
          <nav className="mt-8 space-y-1">
            {dashboardNavItems.map((item) => {
              const Icon = iconMap[item.icon as keyof typeof iconMap];
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto rounded-xl border border-border bg-background p-4">
            <p className="text-sm font-semibold">Ready to publish?</p>
            <p className="mt-1 text-sm text-muted-foreground">Your athlete profile is ready for the next milestone.</p>
            <Button className="mt-4 w-full" variant="outline">
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </div>
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="border-b border-border bg-background/80 px-6 py-4 backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Athlete dashboard</p>
                <h1 className="text-xl font-semibold">Welcome back</h1>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm">
                  Preview
                </Button>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-sm font-semibold">
                  TH
                </div>
              </div>
            </div>
          </header>
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
