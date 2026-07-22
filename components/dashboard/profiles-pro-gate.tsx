import Link from 'next/link';
import { LockSimpleIcon, UsersThreeIcon } from '@phosphor-icons/react/ssr';
import { Button } from '@/components/ui/button';

export function ProfilesProGate() {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-8 py-4 sm:py-8">
      <div className="text-center">
        <p className="text-muted-foreground text-sm font-medium">Profiles</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Manage multiple profiles
        </h1>
        <p className="text-muted-foreground mt-3">
          Create and switch between independent public pages with Pro.
        </p>
      </div>

      <section className="border-border bg-background flex min-h-[430px] flex-col items-center justify-center rounded-2xl border p-6 text-center shadow-sm sm:p-10">
        <span className="bg-muted flex h-20 w-20 items-center justify-center rounded-full">
          <UsersThreeIcon className="h-9 w-9" weight="thin" />
        </span>
        <h2 className="mt-7 text-2xl font-semibold">
          Multiple profiles are available on Pro
        </h2>
        <p className="text-muted-foreground mt-3 max-w-lg text-sm leading-6">
          Your current profile remains fully accessible. Upgrade when you need
          separate pages for other athletes, teams, or projects.
        </p>

        <Button asChild className="mt-7" size="lg">
          <Link href="/dashboard/subscribe">
            <LockSimpleIcon className="h-4 w-4" />
            Upgrade to Pro
          </Link>
        </Button>
      </section>
    </div>
  );
}
