'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import {
  CheckCircleIcon,
  CircleNotchIcon,
  ClockCountdownIcon,
  EyeSlashIcon,
  ShieldCheckIcon,
  WarningCircleIcon,
} from '@phosphor-icons/react/ssr';
import {
  resubmitAthleteDirectoryReviewAction,
  type DirectoryReviewActionState,
} from '@/lib/actions/athlete-directory-review';
import type { DirectoryReview } from '@/lib/services/athlete-directory-review';
import { Button } from '@/components/ui/button';

const initialState: DirectoryReviewActionState = {
  success: false,
  message: '',
};

export function DirectoryReviewStatusCard({
  profileId,
  isPublished,
  isDiscoverable,
  review,
}: {
  profileId: number;
  isPublished: boolean;
  isDiscoverable: boolean;
  review: DirectoryReview | null;
}) {
  const [state, action, pending] = useActionState(
    resubmitAthleteDirectoryReviewAction,
    initialState,
  );

  const status = review?.status;
  const approved = status === 'approved';
  const rejected = status === 'rejected';
  const awaitingReview = status === 'pending';
  const canSubmit =
    isPublished && isDiscoverable && !approved && !awaitingReview;

  const Icon = approved
    ? CheckCircleIcon
    : rejected
      ? WarningCircleIcon
      : awaitingReview
        ? ClockCountdownIcon
        : isPublished && isDiscoverable
          ? ShieldCheckIcon
          : EyeSlashIcon;

  const title = approved
    ? 'Approved for the athlete directory'
    : rejected
      ? 'A few updates are needed'
      : awaitingReview
        ? 'Your profile is being reviewed'
        : isPublished && !isDiscoverable
          ? 'Athlete directory is disabled'
          : isPublished
            ? 'Ready to request a review'
            : 'Publish your profile when it is ready';

  const description = approved
    ? 'Your profile can now appear on the Athletes page and in its sport filters. You stay in control and can remove it from the directory at any time from Settings.'
    : rejected
      ? review?.rejectionReason ||
        'Update your profile, then send it back when it is ready.'
      : awaitingReview
        ? 'The GRIIT team will check that it is complete and compliant before adding it to the Athletes page. Your public page remains live during the review.'
        : isPublished && !isDiscoverable
          ? 'Enable “Show in athlete directory” in Settings to submit this profile.'
          : isPublished
            ? 'Send this live profile to the GRIIT team for directory approval.'
            : 'Once it is Live and directory discovery is enabled, it will be sent to the GRIIT team for approval.';

  return (
    <section
      className={`rounded-[1.75rem] border p-5 shadow-[0_14px_40px_rgba(21,21,21,0.04)] sm:p-6 ${
        approved
          ? 'border-emerald-200 bg-emerald-50/80'
          : rejected
            ? 'border-[#3157ff]/20 bg-[#eef2ff]/80'
            : awaitingReview
              ? 'border-amber-200 bg-amber-50/80'
              : 'border-black/10 bg-white'
      }`}
    >
      <div className="flex items-start gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-black/10 bg-white shadow-sm">
          <Icon className="h-5 w-5" weight={approved ? 'fill' : 'regular'} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-black tracking-[0.18em] text-black/40 uppercase">
            Athlete directory
          </p>
          <h2 className="mt-2 text-lg font-black tracking-[-0.025em]">
            {title}
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-black/55">
            {description}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            {canSubmit ? (
              <form action={action}>
                <input name="profileId" type="hidden" value={profileId} />
                <Button
                  className="rounded-full bg-[#151515] text-white hover:bg-[#3157ff]"
                  disabled={pending}
                  size="sm"
                  type="submit"
                >
                  {pending ? (
                    <CircleNotchIcon className="h-4 w-4 animate-spin" />
                  ) : (
                    <ShieldCheckIcon className="h-4 w-4" />
                  )}
                  {rejected ? 'Send updated profile' : 'Send for review'}
                </Button>
              </form>
            ) : null}
            {(!isPublished || !isDiscoverable) && !approved ? (
              <Button
                asChild
                className="rounded-full"
                size="sm"
                variant="outline"
              >
                <Link
                  href={`/dashboard/profiles/${profileId}/settings` as Route}
                >
                  Open visibility settings
                </Link>
              </Button>
            ) : null}
          </div>

          {state.message ? (
            <p
              className={`mt-3 text-xs font-semibold ${
                state.success ? 'text-emerald-700' : 'text-red-700'
              }`}
            >
              {state.message}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
