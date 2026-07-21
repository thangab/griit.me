import Link from 'next/link';
import {
  ArrowSquareOutIcon as ExternalLink,
  PencilSimpleIcon as Pencil,
} from '@phosphor-icons/react/ssr';
import { MobileProfileFrame } from '@/components/dashboard/mobile-profile-frame';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getSubscriptionState } from '@/lib/services/billing';
import { getProfileBuilderState } from '@/lib/services/profile-builder';
import type { ProfileBuilderState } from '@/lib/types/profile-builder';

function MobileProfilePreview({ builder }: { builder: ProfileBuilderState }) {
  return (
    <aside className="border-border bg-card flex h-full min-h-0 flex-col overflow-hidden rounded-xl border shadow-sm">
      <div className="border-border bg-background/70 flex items-center justify-between gap-3 border-b px-5 py-4">
        <div>
          <p className="text-lg font-semibold">Your profile</p>
          <p className="text-muted-foreground mt-1 text-sm">
            griit.me/{builder.profile.username}
          </p>
        </div>
        <Button asChild size="sm" variant="outline">
          <Link href="/dashboard/design">
            Edit
            <Pencil className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="flex min-h-0 flex-1 justify-center p-4 sm:p-5">
        <MobileProfileFrame
          builder={builder}
          className="h-full max-w-[390px]"
          fillHeight
        />
      </div>
    </aside>
  );
}

export default async function DashboardHomePage() {
  const [subscription, builder] = await Promise.all([
    getSubscriptionState(),
    getProfileBuilderState(),
  ]);

  const enabledBlocks = builder.blocks.filter(
    (block) => block.isEnabled,
  ).length;
  const publicUrl = `griit.me/${builder.profile.username}`;

  return (
    <div className="grid min-w-0 gap-6 xl:h-[calc(100dvh-3rem)] xl:grid-cols-[minmax(0,1fr)_460px] xl:overflow-hidden">
      <div className="min-w-0 space-y-6 xl:h-full xl:overflow-y-auto xl:pr-1">
        <div className="border-border bg-card/80 rounded-xl border p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-muted-foreground text-sm font-medium">
                Overview
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight">
                Shape {builder.profile.displayName}&apos;s public page.
              </h1>
              <p className="text-muted-foreground mt-4">
                Track your build progress, open the page editor, and prepare
                {builder.profile.isPublished
                  ? ' your live athlete profile.'
                  : ' your draft athlete profile.'}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold tracking-[0.14em] text-emerald-900 uppercase">
                {subscription.plan === 'pro' ? 'Pro plan' : 'Free plan'}
              </span>
              <Button asChild>
                <Link href="/dashboard/design">Open Design</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="space-y-6">
            <CardHeader>
              <CardTitle>Project summary</CardTitle>
              <CardDescription>
                Your public page is the hub for your links, socials, and latest
                highlights.
              </CardDescription>
            </CardHeader>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="border-border bg-background rounded-xl border p-5">
                <p className="text-sm font-medium">Content blocks</p>
                <p className="mt-2 text-3xl font-semibold">{enabledBlocks}</p>
              </div>
              <div className="border-border bg-background rounded-xl border p-5">
                <p className="text-sm font-medium">Published pages</p>
                <p className="mt-2 text-3xl font-semibold">
                  {builder.pages.filter((page) => page.isPublished).length}
                </p>
              </div>
              <div className="border-border bg-background rounded-xl border p-5">
                <p className="text-sm font-medium">Public URL</p>
                <p className="mt-2 truncate text-2xl font-semibold">
                  {publicUrl}
                </p>
              </div>
              <div className="border-border bg-background rounded-xl border p-5">
                <p className="text-sm font-medium">Builder state</p>
                <p className="mt-2 text-3xl font-semibold">
                  {builder.source === 'database' ? 'Saved' : 'Draft'}
                </p>
              </div>
            </div>
          </Card>

          <Card className="space-y-6">
            <CardHeader>
              <CardTitle>Quick actions</CardTitle>
              <CardDescription>
                Jump straight into the editor, preview your public page, or
                manage your subscription.
              </CardDescription>
            </CardHeader>
            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link href="/dashboard/design">Open page editor</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/dashboard/settings">Manage billing</Link>
              </Button>
              <Button asChild variant="ghost" className="w-full">
                <Link href="/dashboard/analytics">View analytics</Link>
              </Button>
            </div>
          </Card>
        </div>

        <Card className="border-border bg-background/50 rounded-xl border border-dashed p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Editor status</CardTitle>
              <CardDescription>
                {builder.source === 'database'
                  ? 'Your saved profile is ready to edit.'
                  : 'No saved public profile yet. Design is showing the initial builder state.'}
              </CardDescription>
            </div>
            <Button asChild variant="secondary">
              <Link href="/dashboard/design">Go to Design</Link>
            </Button>
          </div>
        </Card>

        <Card className="border-border bg-background/50 rounded-xl border border-dashed p-6 xl:hidden">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Public page</CardTitle>
              <CardDescription>{publicUrl}</CardDescription>
            </div>
            <Button asChild variant="outline">
              <a href={`/${builder.profile.username}`}>
                Open public page
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </Card>
      </div>

      <div className="min-w-0 xl:h-full xl:min-h-0">
        <MobileProfilePreview builder={builder} />
      </div>
    </div>
  );
}
