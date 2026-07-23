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
  showBranding,
}: {
  builder: ProfileBuilderState;
  profileId: number;
  showBranding: boolean;
}) {
  return (
    <aside className="flex h-full min-h-0 flex-col overflow-hidden rounded-[2rem] border border-black/10 bg-[#151515] shadow-[0_24px_70px_rgba(21,21,21,0.14)]">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4 text-white">
        <div className="min-w-0">
          <p className="truncate text-lg font-black tracking-[-0.02em]">
            {builder.profile.displayName}
          </p>
          <p className="mt-1 truncate text-sm text-white/45">
            griit.me/{builder.profile.username}
          </p>
        </div>
        <Button
          asChild
          className="rounded-full border-white/15 bg-white/10 text-white hover:bg-white hover:text-[#151515]"
          size="sm"
          variant="outline"
        >
          <Link href={`/dashboard/profiles/${profileId}/design` as Route}>
            Edit <Pencil className="h-4 w-4" />
          </Link>
        </Button>
      </div>
      <div className="relative flex min-h-0 flex-1 justify-center overflow-hidden bg-[radial-gradient(circle_at_15%_10%,rgba(169,237,53,0.18),transparent_32%),radial-gradient(circle_at_90%_80%,rgba(49,87,255,0.20),transparent_38%)] p-4 sm:p-5">
        <MobileProfileFrame
          builder={builder}
          className="h-full"
          fillHeight
          showBranding={showBranding}
        />
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
    <div className="grid min-w-0 gap-6 xl:h-[calc(100dvh-3.5rem)] xl:grid-cols-[minmax(0,1fr)_minmax(440px,520px)] xl:overflow-hidden">
      <div className="min-w-0 space-y-6 xl:h-full xl:overflow-y-auto xl:pr-1">
        <div className="relative overflow-hidden rounded-[2rem] bg-[#151515] p-7 text-white shadow-[0_24px_70px_rgba(21,21,21,0.12)] sm:p-9">
          <div className="pointer-events-none absolute -top-28 -right-20 h-72 w-72 rounded-full border-[44px] border-[#3157ff]/25" />
          <div className="pointer-events-none absolute right-24 -bottom-28 h-52 w-52 rounded-full bg-[#3157ff]/10 blur-3xl" />
          <div className="relative">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-[11px] font-black tracking-[0.22em] text-white/45 uppercase">
                Profile overview
              </p>
              <span className="inline-flex rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[10px] font-black tracking-[0.14em] text-white/75 uppercase">
                {subscription.plan === 'pro' ? 'Pro plan' : 'Free plan'}
              </span>
            </div>
            <h1 className="mt-8 max-w-xl text-4xl font-black tracking-[-0.055em] sm:text-5xl">
              {builder.profile.displayName}
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-6 text-white/55 sm:text-base">
              Build a page that tells your story, highlights your goals, and
              grows with your audience.
            </p>
          </div>
        </div>

        <PublicAddressCard
          isPublished={builder.profile.isPublished}
          username={builder.profile.username}
        />

        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="rounded-[1.75rem] border-black/10 bg-white shadow-[0_18px_50px_rgba(21,21,21,0.05)]">
            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <CardTitle>Complete your profile</CardTitle>
                <span className="shrink-0 rounded-full bg-[#eef2ff] px-2.5 py-1 text-xs font-black text-[#3157ff]">
                  {completedChecklistItems}/{checklist.length}
                </span>
              </div>
              <CardDescription className="text-black/50">
                A few quick improvements to make your page ready to share.
              </CardDescription>
            </CardHeader>
            <div className="mb-4 h-2 overflow-hidden rounded-full bg-black/[0.06]">
              <div
                className="h-full rounded-full bg-[#3157ff] transition-[width]"
                style={{
                  width: `${(completedChecklistItems / checklist.length) * 100}%`,
                }}
              />
            </div>
            <div className="divide-y divide-black/[0.08] overflow-hidden rounded-2xl border border-black/10">
              {checklist.map((item) => {
                const ItemIcon = item.icon;

                return (
                  <Link
                    className="group flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-[#f7f6f1]"
                    href={`/dashboard/profiles/${profileId}/design` as Route}
                    key={item.label}
                  >
                    {item.complete ? (
                      <CheckCircle
                        className="h-5 w-5 shrink-0 text-[#3157ff]"
                        weight="fill"
                      />
                    ) : (
                      <Circle className="text-muted-foreground/45 h-5 w-5 shrink-0" />
                    )}
                    <span
                      className={cn(
                        'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
                        item.complete
                          ? 'bg-[#eef2ff] text-[#3157ff]'
                          : 'bg-[#f2f1eb] text-black/40',
                      )}
                    >
                      <ItemIcon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className={cn(
                          'block text-sm font-semibold',
                          item.complete && 'text-black/45',
                        )}
                      >
                        {item.label}
                      </span>
                      <span className="mt-0.5 block text-xs leading-5 text-black/45">
                        {item.description}
                      </span>
                    </span>
                    <CaretRight className="h-4 w-4 shrink-0 text-black/35 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                );
              })}
            </div>
          </Card>

          <Card className="rounded-[1.75rem] border-black/10 bg-white shadow-[0_18px_50px_rgba(21,21,21,0.05)]">
            <CardHeader>
              <CardTitle>Quick actions</CardTitle>
              <CardDescription className="text-black/50">
                Edit, analyze, or configure this profile.
              </CardDescription>
            </CardHeader>
            <div className="space-y-3">
              <Button
                asChild
                className="w-full rounded-full bg-[#151515] text-white hover:bg-[#3157ff]"
              >
                <Link href={`/dashboard/profiles/${profileId}/design` as Route}>
                  Open editor
                </Link>
              </Button>
              <Button
                asChild
                className="w-full rounded-full border-black/15 bg-white/70 hover:bg-white"
                variant="outline"
              >
                <Link
                  href={`/dashboard/profiles/${profileId}/analytics` as Route}
                >
                  View analytics
                </Link>
              </Button>
              <Button
                asChild
                className="w-full rounded-full hover:bg-black/[0.07]"
                variant="ghost"
              >
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
        <ProfilePreview
          builder={builder}
          profileId={profileId}
          showBranding={!subscription.isActive}
        />
      </div>
    </div>
  );
}
