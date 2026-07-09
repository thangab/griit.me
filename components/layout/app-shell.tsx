import Link from 'next/link';
import {
  LayoutGrid,
  PanelsTopLeft,
  Settings,
  UserRound,
  BarChart3,
  LogOut,
} from 'lucide-react';
import { dashboardNavItems } from '@/lib/constants/navigation';
import { Button } from '@/components/ui/button';
import { getSession, signOutAction } from '@/lib/actions/auth';

const iconMap = {
  LayoutGrid,
  UserRound,
  PanelsTopLeft,
  BarChart3,
  Settings,
};

export async function AppShell({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  return (
    <div className="bg-background min-h-screen">
      <div className="flex min-h-screen">
        <aside className="border-border bg-card/70 hidden w-72 shrink-0 border-r px-5 py-6 lg:flex lg:flex-col">
          <div className="flex items-center gap-3 px-2">
            <div className="bg-primary text-primary-foreground flex h-10 w-10 items-center justify-center rounded-xl text-sm font-semibold">
              G
            </div>
            <div>
              <p className="text-sm font-semibold">Griit</p>
              <p className="text-muted-foreground text-sm">Studio</p>
            </div>
          </div>
          <nav className="mt-8 space-y-1">
            {dashboardNavItems.map((item) => {
              const Icon = iconMap[item.icon as keyof typeof iconMap];
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-muted-foreground hover:bg-accent hover:text-foreground flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="border-border bg-background mt-auto rounded-xl border p-4">
            <p className="text-sm font-semibold">Ready to publish?</p>
            <p className="text-muted-foreground mt-1 text-sm">
              Your athlete profile is ready for the next milestone.
            </p>
            <form action={signOutAction} className="mt-4">
              <Button className="w-full" variant="outline" type="submit">
                <LogOut className="h-4 w-4" />
                Sign out
              </Button>
            </form>
          </div>
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="border-border bg-background/80 border-b px-6 py-4 backdrop-blur">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-muted-foreground text-sm font-medium">
                  Athlete dashboard
                </p>
                <h1 className="text-xl font-semibold">Welcome back</h1>
              </div>
              <div className="flex items-center gap-3">
                <div className="border-border bg-card/70 text-muted-foreground hidden rounded-full border px-4 py-2 text-sm sm:block">
                  {session?.user?.email ?? 'Authenticated user'}
                </div>
                <Button variant="outline" size="sm">
                  Preview
                </Button>
                <div className="bg-secondary flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold">
                  {session?.user?.email
                    ? session.user.email.charAt(0).toUpperCase()
                    : 'U'}
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
