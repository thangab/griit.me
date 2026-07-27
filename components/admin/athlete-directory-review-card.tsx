'use client';

import { useActionState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowSquareOutIcon,
  CheckCircleIcon,
  CircleNotchIcon,
  ClockCountdownIcon,
  XCircleIcon,
} from '@phosphor-icons/react/ssr';
import {
  moderateAthleteDirectoryAction,
  type DirectoryReviewActionState,
} from '@/lib/actions/athlete-directory-review';
import type { AdminDirectoryReview } from '@/lib/services/athlete-directory-review';
import { Button } from '@/components/ui/button';
import { ProfileAvatar } from '@/components/profile/profile-avatar';

const initialState: DirectoryReviewActionState = {
  success: false,
  message: '',
};

export function AthleteDirectoryReviewCard({
  review,
}: {
  review: AdminDirectoryReview;
}) {
  const router = useRouter();
  const [state, action, pending] = useActionState(
    moderateAthleteDirectoryAction,
    initialState,
  );

  useEffect(() => {
    if (state.success) router.refresh();
  }, [router, state.success]);

  const StatusIcon =
    review.status === 'approved'
      ? CheckCircleIcon
      : review.status === 'rejected'
        ? XCircleIcon
        : ClockCountdownIcon;
  const statusLabel =
    review.status === 'approved'
      ? 'Approved'
      : review.status === 'rejected'
        ? 'Updates needed'
        : 'Awaiting review';

  return (
    <article className="overflow-hidden rounded-[1.75rem] border border-black/10 bg-white shadow-[0_18px_50px_rgba(21,21,21,0.05)]">
      <div className="flex flex-col gap-5 p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <ProfileAvatar
            avatarUrl={review.avatarUrl}
            className="bg-[#eef2ff] text-black/50"
            displayName={review.displayName}
            size={52}
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="truncate text-lg font-black tracking-[-0.025em]">
                {review.displayName}
              </h2>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black tracking-[0.12em] uppercase ${
                  review.status === 'approved'
                    ? 'bg-emerald-100 text-emerald-800'
                    : review.status === 'rejected'
                      ? 'bg-[#eef2ff] text-[#3157ff]'
                      : 'bg-amber-100 text-amber-800'
                }`}
              >
                <StatusIcon className="h-3.5 w-3.5" weight="fill" />
                {statusLabel}
              </span>
            </div>
            <p className="mt-1 truncate text-sm text-black/45">
              griit.me/{review.username}
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-semibold text-black/45">
              <span>{review.isPublished ? 'Live' : 'Draft'}</span>
              <span aria-hidden="true">·</span>
              <span>
                {review.isDiscoverable
                  ? 'Discovery enabled'
                  : 'Discovery disabled'}
              </span>
              <span aria-hidden="true">·</span>
              <span>
                Submitted {new Date(review.submittedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          <Button
            asChild
            aria-label="Open public profile"
            size="sm"
            variant="outline"
          >
            <Link href={`/${review.username}`} target="_blank">
              <ArrowSquareOutIcon className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {review.rejectionReason ? (
          <p className="rounded-xl bg-[#eef2ff] px-4 py-3 text-sm leading-6 text-[#233eaf]">
            {review.rejectionReason}
          </p>
        ) : null}

        <form action={action} className="space-y-3">
          <input name="profileId" type="hidden" value={review.profileId} />
          <label className="block">
            <span className="text-xs font-bold text-black/55">
              Feedback if changes are required
            </span>
            <textarea
              className="mt-2 min-h-20 w-full resize-y rounded-xl border border-black/10 bg-[#fafaf8] px-3 py-2.5 text-sm transition outline-none focus:border-[#3157ff] focus:ring-2 focus:ring-[#3157ff]/10"
              maxLength={500}
              name="rejectionReason"
              placeholder="Explain what should be updated before another review."
            />
          </label>
          <div className="flex flex-wrap gap-2">
            <Button
              className="rounded-full bg-emerald-600 text-white hover:bg-emerald-700"
              disabled={
                pending || !review.isPublished || !review.isDiscoverable
              }
              name="decision"
              size="sm"
              type="submit"
              value="approved"
            >
              {pending ? (
                <CircleNotchIcon className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircleIcon className="h-4 w-4" />
              )}
              Approve
            </Button>
            <Button
              className="rounded-full"
              disabled={pending}
              name="decision"
              size="sm"
              type="submit"
              value="rejected"
              variant="outline"
            >
              <XCircleIcon className="h-4 w-4" />
              Request changes
            </Button>
          </div>
          {state.message ? (
            <p
              className={`text-xs font-semibold ${
                state.success ? 'text-emerald-700' : 'text-red-700'
              }`}
            >
              {state.message}
            </p>
          ) : null}
        </form>
      </div>
    </article>
  );
}
