import Link from 'next/link';
import { LockSimpleIcon, UsersThreeIcon } from '@phosphor-icons/react/ssr';
import { Button } from '@/components/ui/button';

export function ProfilesProGate() {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-8 py-2 sm:py-6">
      <div className="text-center">
        <p className="text-[11px] font-black tracking-[0.22em] text-[#3157ff] uppercase">
          Profiles
        </p>
        <h1 className="mt-4 text-4xl font-black tracking-[-0.05em] sm:text-5xl">
          Manage multiple profiles
        </h1>
        <p className="text-muted-foreground mt-3">
          Create and switch between independent public pages with Pro.
        </p>
      </div>

      <section className="flex min-h-[430px] flex-col items-center justify-center rounded-[2rem] border border-black/10 bg-white p-6 text-center shadow-[0_24px_70px_rgba(21,21,21,0.07)] sm:p-10">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[#eef2ff] text-[#3157ff]">
          <UsersThreeIcon className="h-9 w-9" weight="thin" />
        </span>
        <h2 className="mt-7 text-2xl font-semibold">
          Multiple profiles are available on Pro
        </h2>
        <p className="text-muted-foreground mt-3 max-w-lg text-sm leading-6">
          Your current profile remains fully accessible. Upgrade when you need
          separate pages for other athletes, teams, or projects.
        </p>

        <Button
          asChild
          className="mt-7 rounded-full bg-[#151515] px-7 hover:bg-[#3157ff]"
          size="lg"
        >
          <Link href="/dashboard/subscribe">
            <LockSimpleIcon className="h-4 w-4" />
            Upgrade to Pro
          </Link>
        </Button>
      </section>
    </div>
  );
}
