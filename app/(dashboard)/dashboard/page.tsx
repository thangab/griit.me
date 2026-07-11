import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getSubscriptionState } from '@/lib/services/billing';
import { getProfileBuilderState } from '@/lib/services/profile-builder';

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
    <div className="space-y-6">
      <div className="border-border bg-card/80 rounded-[2rem] border p-8">
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
            <Link href="/dashboard/design">
              <Button>Open Design</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="space-y-6">
          <CardHeader>
            <CardTitle>Project summary</CardTitle>
            <CardDescription>
              Your public page is the hub for your links, socials, and latest
              highlights.
            </CardDescription>
          </CardHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="border-border bg-background rounded-3xl border p-5">
              <p className="text-sm font-medium">Content blocks</p>
              <p className="mt-2 text-3xl font-semibold">{enabledBlocks}</p>
            </div>
            <div className="border-border bg-background rounded-3xl border p-5">
              <p className="text-sm font-medium">Published pages</p>
              <p className="mt-2 text-3xl font-semibold">
                {builder.pages.filter((page) => page.isPublished).length}
              </p>
            </div>
            <div className="border-border bg-background rounded-3xl border p-5">
              <p className="text-sm font-medium">Public URL</p>
              <p className="mt-2 truncate text-2xl font-semibold">
                {publicUrl}
              </p>
            </div>
            <div className="border-border bg-background rounded-3xl border p-5">
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
              Jump straight into the editor, preview your public page, or manage
              your subscription.
            </CardDescription>
          </CardHeader>
          <div className="space-y-3">
            <Link href="/dashboard/design">
              <Button className="w-full">Open page editor</Button>
            </Link>
            <Link href="/dashboard/settings">
              <Button variant="outline" className="w-full">
                Manage billing
              </Button>
            </Link>
            <Link href="/dashboard/analytics">
              <Button variant="ghost" className="w-full">
                View analytics
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      <Card className="border-border bg-background/50 rounded-3xl border border-dashed p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Editor status</CardTitle>
            <CardDescription>
              {builder.source === 'database'
                ? 'Your saved profile is ready to edit.'
                : 'No saved public profile yet. Design is showing the initial builder state.'}
            </CardDescription>
          </div>
          <Link href="/dashboard/design">
            <Button variant="secondary">Go to Design</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
