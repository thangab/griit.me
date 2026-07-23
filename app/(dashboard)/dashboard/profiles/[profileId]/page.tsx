import Link from 'next/link';
import type { Route } from 'next';
import { notFound } from 'next/navigation';
import {
  CaretRightIcon as CaretRight,
  CheckCircleIcon as CheckCircle,
  CircleIcon as Circle,
  FileTextIcon as FileText,
  ImageIcon as Image,
  PencilSimpleIcon as Pencil,
  ShareNetworkIcon as ShareNetwork,
  SquaresFourIcon as SquaresFour,
  TargetIcon as Target,
} from '@phosphor-icons/react/ssr';
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
import { cn } from '@/lib/utils/cn';

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

  const checklist = [
    {
      label: 'Add a profile picture',
      description: 'Make your page immediately recognizable.',
      complete: Boolean(builder.profile.avatarUrl),
      icon: Image,
    },
    {
      label: 'Write your bio',
      description: 'Give visitors a quick introduction.',
      complete: Boolean(builder.profile.bio.trim()),
      icon: FileText,
    },
    {
      label: 'Add your first block',
      description: 'Add any content block to start building your page.',
      complete: builder.blocks.some((block) => block.isEnabled),
      icon: SquaresFour,
    },
    {
      label: 'Add your first goal',
      description: 'Show your audience what you are working toward.',
      complete: builder.goals.some(
        (goal) => goal.isEnabled && Boolean(goal.title.trim()),
      ),
      icon: Target,
    },
    {
      label: 'Add a social media',
      description: 'Connect one of your main social profiles.',
      complete: builder.socialLinks.some(
        (social) => social.isEnabled && Boolean(social.url.trim()),
      ),
      icon: ShareNetwork,
    },
  ];
  const completedChecklistItems = checklist.filter(
    (item) => item.complete,
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
              <div className="flex items-center justify-between gap-4">
                <CardTitle>Complete your profile</CardTitle>
                <span className="text-muted-foreground shrink-0 text-xs font-semibold">
                  {completedChecklistItems}/{checklist.length}
                </span>
              </div>
              <CardDescription>
                A few quick improvements to make your page ready to share.
              </CardDescription>
            </CardHeader>
            <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-black/[0.06]">
              <div
                className="h-full rounded-full bg-emerald-500 transition-[width]"
                style={{
                  width: `${(completedChecklistItems / checklist.length) * 100}%`,
                }}
              />
            </div>
            <div className="divide-border overflow-hidden rounded-xl border">
              {checklist.map((item) => {
                const ItemIcon = item.icon;

                return (
                  <Link
                    className="hover:bg-muted/40 group flex items-center gap-3 px-4 py-3.5 transition-colors"
                    href={`/dashboard/profiles/${profileId}/design` as Route}
                    key={item.label}
                  >
                    {item.complete ? (
                      <CheckCircle
                        className="h-5 w-5 shrink-0 text-emerald-600"
                        weight="fill"
                      />
                    ) : (
                      <Circle className="text-muted-foreground/45 h-5 w-5 shrink-0" />
                    )}
                    <span
                      className={cn(
                        'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
                        item.complete
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-muted text-muted-foreground',
                      )}
                    >
                      <ItemIcon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className={cn(
                          'block text-sm font-semibold',
                          item.complete && 'text-muted-foreground',
                        )}
                      >
                        {item.label}
                      </span>
                      <span className="text-muted-foreground mt-0.5 block text-xs leading-5">
                        {item.description}
                      </span>
                    </span>
                    <CaretRight className="text-muted-foreground h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                );
              })}
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
