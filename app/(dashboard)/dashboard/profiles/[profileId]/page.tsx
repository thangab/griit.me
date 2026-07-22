import Link from 'next/link';
import type { Route } from 'next';
import { notFound } from 'next/navigation';
import { PencilSimpleIcon as Pencil } from '@phosphor-icons/react/ssr';
import { MobileProfileFrame } from '@/components/dashboard/mobile-profile-frame';
import { PublicAddressCard } from '@/components/dashboard/public-address-card';
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

type ProfileOverviewProps = { params: Promise<{ profileId: string }> };

function ProfilePreview({
  builder,
  profileId,
}: {
  builder: ProfileBuilderState;
  profileId: number;
}) {
  return (
    <aside className="border-border bg-card flex h-full min-h-0 flex-col overflow-hidden rounded-xl border shadow-sm">
      <div className="border-border bg-background/70 flex items-center justify-between gap-3 border-b px-5 py-4">
        <div className="min-w-0">
          <p className="truncate text-lg font-semibold">
            {builder.profile.displayName}
          </p>
          <p className="text-muted-foreground mt-1 truncate text-sm">
            griit.me/{builder.profile.username}
          </p>
        </div>
        <Button asChild size="sm" variant="outline">
          <Link href={`/dashboard/profiles/${profileId}/design` as Route}>
            Edit <Pencil className="h-4 w-4" />
          </Link>
        </Button>
      </div>
      <div className="flex min-h-0 flex-1 justify-center p-4 sm:p-5">
        <MobileProfileFrame builder={builder} className="h-full" fillHeight />
      </div>
    </aside>
  );
}

export default async function ProfileOverviewPage({
  params,
}: ProfileOverviewProps) {
  const profileId = Number((await params).profileId);
  if (!Number.isInteger(profileId) || profileId <= 0) notFound();

  const [builder, subscription] = await Promise.all([
    getProfileBuilderState(profileId),
    getSubscriptionState(),
  ]);
  if (!builder) notFound();

  const enabledBlocks = builder.blocks.filter(
    (block) => block.isEnabled,
  ).length;
  const enabledSocialLinks = builder.socialLinks.filter(
    (link) => link.isEnabled,
  ).length;

  return (
    <div className="grid min-w-0 gap-6 xl:h-[calc(100dvh-3rem)] xl:grid-cols-[minmax(0,1fr)_500px] xl:overflow-hidden">
      <div className="min-w-0 space-y-6 xl:h-full xl:overflow-y-auto xl:pr-1">
        <div className="border-border bg-card/80 rounded-xl border p-8">
          <p className="text-muted-foreground text-sm font-medium">
            Profile overview
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">
            {builder.profile.displayName}
          </h1>
          <p className="text-muted-foreground mt-3">
            Manage your content, appearance, and public profile settings.
          </p>
          <span className="mt-5 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold tracking-[0.14em] text-emerald-900 uppercase">
            {subscription.plan === 'pro' ? 'Pro plan' : 'Free plan'}
          </span>
        </div>

        <PublicAddressCard
          isPublished={builder.profile.isPublished}
          username={builder.profile.username}
        />

        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <Card>
            <CardHeader>
              <CardTitle>Profile summary</CardTitle>
              <CardDescription>
                Content and visibility for this public page.
              </CardDescription>
            </CardHeader>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="border-border rounded-xl border p-4">
                <p className="text-muted-foreground text-sm">Blocks</p>
                <p className="mt-2 text-2xl font-semibold">{enabledBlocks}</p>
              </div>
              <div className="border-border rounded-xl border p-4">
                <p className="text-muted-foreground text-sm">Social links</p>
                <p className="mt-2 text-2xl font-semibold">
                  {enabledSocialLinks}
                </p>
              </div>
              <div className="border-border rounded-xl border p-4">
                <p className="text-muted-foreground text-sm">Visibility</p>
                <p className="mt-2 text-lg font-semibold">
                  {builder.profile.isPublished ? 'Live' : 'Draft'}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick actions</CardTitle>
              <CardDescription>
                Edit, analyze, or configure this profile.
              </CardDescription>
            </CardHeader>
            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link href={`/dashboard/profiles/${profileId}/design` as Route}>
                  Open editor
                </Link>
              </Button>
              <Button asChild className="w-full" variant="outline">
                <Link
                  href={`/dashboard/profiles/${profileId}/analytics` as Route}
                >
                  View analytics
                </Link>
              </Button>
              <Button asChild className="w-full" variant="ghost">
                <Link
                  href={`/dashboard/profiles/${profileId}/settings` as Route}
                >
                  Profile settings
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
      <div className="min-w-0 xl:h-full xl:min-h-0">
        <ProfilePreview builder={builder} profileId={profileId} />
      </div>
    </div>
  );
}
