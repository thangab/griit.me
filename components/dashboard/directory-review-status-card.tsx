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
import { useUiCopy } from '@/components/i18n/use-ui-copy';

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
  const ui = useUiCopy();
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
    ? ui('Visible on the Athletes page')
    : rejected
      ? ui('Update your profile to return to Athletes')
      : awaitingReview
        ? ui('Approval in progress for the Athletes page')
        : isPublished && !isDiscoverable
          ? ui('Enable directory visibility to appear on Athletes')
          : isPublished
            ? ui('One last step to appear on Athletes')
            : ui('Publish your profile to appear on Athletes');

  const description = approved
    ? ui(
        'Your profile is listed on the Athletes page and in its sport filters. You can remove it at any time from Settings.',
      )
    : rejected
      ? review?.rejectionReason ||
        ui('Update your profile, then send it back when it is ready.')
      : awaitingReview
        ? ui(
            'The GRIIT team will check that it is complete and compliant before adding it to the Athletes page. Your public page remains live during the review.',
          )
        : isPublished && !isDiscoverable
          ? ui(
              'Open visibility settings and enable “Show in athlete directory”. Your profile will then be sent to GRIIT for approval.',
            )
          : isPublished
            ? ui(
                'Request GRIIT approval now. Once approved, your profile will be listed publicly on the Athletes page.',
              )
            : ui(
                'Make your profile public and keep “Show in athlete directory” enabled. It will then be sent automatically to GRIIT for approval.',
              );

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
            {ui('Visibility on the Athletes page')}
          </p>
          <h2 className="mt-2 text-lg font-black tracking-[-0.025em]">
            {title}
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-black/55">
            {description}
          </p>

          {!approved ? (
            <p className="mt-4 rounded-2xl bg-black/[0.045] px-4 py-3 text-xs leading-5 font-semibold text-black/60">
              {ui(
                'How it works: 1. Publish your profile · 2. Enable athlete directory visibility · 3. Wait for GRIIT approval.',
              )}
            </p>
          ) : null}

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
                  {rejected
                    ? ui('Send updated profile')
                    : ui('Request listing on Athletes')}
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
                  {ui('Configure visibility')}
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
