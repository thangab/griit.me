'use client';

import { useActionState, useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { useRouter } from 'next/navigation';
import {
  ArrowSquareOutIcon,
  CircleNotchIcon,
  PlusIcon,
  TrashIcon,
} from '@phosphor-icons/react/ssr';
import {
  createProfileAction,
  deleteProfileAction,
  type ProfileBuilderActionState,
} from '@/lib/actions/profile-builder';
import type { OwnedProfileSummary } from '@/lib/services/profile-builder';
import { Button } from '@/components/ui/button';

const initialState: ProfileBuilderActionState = {
  success: false,
  message: '',
};

export function ProfileManager({
  profiles,
  limit,
}: {
  profiles: OwnedProfileSummary[];
  limit: number;
}) {
  const router = useRouter();
  const [showCreate, setShowCreate] = useState(profiles.length === 0);
  const [state, formAction, pending] = useActionState(
    createProfileAction,
    initialState,
  );
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteMessage, setDeleteMessage] = useState('');
  const [deletePending, startDeleteTransition] = useTransition();
  const canCreate = profiles.length < limit;

  useEffect(() => {
    if (state.success && state.profileId) {
      router.push(`/dashboard/profiles/${state.profileId}/design` as Route);
    }
  }, [router, state]);

  const removeProfile = (profile: OwnedProfileSummary) => {
    if (!window.confirm(`Delete “${profile.displayName}” permanently?`)) return;

    setDeletingId(profile.id);
    setDeleteMessage('');
    startDeleteTransition(async () => {
      const result = await deleteProfileAction(profile.id);
      setDeleteMessage(result.message);
      setDeletingId(null);
      if (result.success) router.refresh();
    });
  };

  return (
    <div className="mx-auto w-full max-w-[1380px] space-y-6">
      <div className="relative overflow-hidden rounded-[2rem] bg-[#151515] p-7 text-white sm:p-9">
        <div className="pointer-events-none absolute -top-24 right-8 h-60 w-60 rounded-full border-[38px] border-[#3157ff]/25" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-black tracking-[0.22em] text-white/45 uppercase">
              Profiles
            </p>
            <h1 className="mt-4 text-4xl font-black tracking-[-0.05em] sm:text-5xl">
              Your public profiles
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/55">
              Manage independent pages for athletes, teams, or projects.
            </p>
          </div>
          <Button
            className="rounded-full bg-white text-[#151515] hover:bg-[#eef2ff] hover:text-[#3157ff]"
            disabled={!canCreate}
            onClick={() => setShowCreate((current) => !current)}
            type="button"
          >
            <PlusIcon className="h-4 w-4" />
            New profile
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-2xl border border-black/10 bg-white px-5 py-4 text-sm shadow-[0_14px_40px_rgba(21,21,21,0.04)]">
        <span className="font-medium">
          {profiles.length} of {limit} profiles used
        </span>
        {!canCreate ? (
          <span className="text-muted-foreground">
            {limit === 1
              ? 'Upgrade to Pro for up to 5 profiles.'
              : 'Limit reached.'}
          </span>
        ) : null}
      </div>

      {showCreate && canCreate ? (
        <form
          action={formAction}
          className="grid gap-4 rounded-[1.75rem] border border-black/10 bg-white p-5 shadow-[0_18px_50px_rgba(21,21,21,0.06)] sm:grid-cols-2 sm:p-6"
        >
          <label className="space-y-2 text-sm font-semibold">
            Profile name
            <input
              autoFocus
              className="border-border bg-background focus:ring-primary/20 h-11 w-full rounded-lg border px-3 font-normal outline-none focus:ring-2"
              maxLength={120}
              name="displayName"
              placeholder="Alex Morgan"
              required
            />
          </label>
          <label className="space-y-2 text-sm font-semibold">
            Public address
            <div className="border-border focus-within:ring-primary/20 flex h-11 overflow-hidden rounded-lg border focus-within:ring-2">
              <span className="bg-muted/40 text-muted-foreground flex items-center border-r px-3 font-normal">
                griit.me/
              </span>
              <input
                autoCapitalize="none"
                className="min-w-0 flex-1 bg-transparent px-3 font-normal outline-none"
                maxLength={32}
                name="username"
                pattern="[a-z0-9_]+"
                placeholder="alex_morgan"
                required
              />
            </div>
          </label>
          <div className="flex items-center gap-3 sm:col-span-2">
            <Button disabled={pending} type="submit">
              {pending ? (
                <CircleNotchIcon className="h-4 w-4 animate-spin" />
              ) : null}
              {pending ? 'Creating…' : 'Create profile'}
            </Button>
            <Button
              onClick={() => setShowCreate(false)}
              type="button"
              variant="ghost"
            >
              Cancel
            </Button>
            {state.message ? (
              <p
                className={state.success ? 'text-emerald-600' : 'text-red-600'}
              >
                {state.message}
              </p>
            ) : null}
          </div>
        </form>
      ) : null}

      {deleteMessage ? (
        <p className="text-muted-foreground text-sm">{deleteMessage}</p>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {profiles.map((profile) => (
          <article
            className="group rounded-[1.75rem] border border-black/10 bg-white p-5 shadow-[0_14px_40px_rgba(21,21,21,0.04)] transition hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(21,21,21,0.09)]"
            key={profile.id}
          >
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-2xl bg-[#eef2ff]">
                {profile.avatarUrl ? (
                  <img
                    alt=""
                    className="h-full w-full object-cover"
                    src={profile.avatarUrl}
                  />
                ) : (
                  <span className="flex h-full items-center justify-center text-lg font-semibold">
                    {profile.displayName.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="truncate font-semibold">
                    {profile.displayName}
                  </h2>
                  <span
                    className={`h-2 w-2 shrink-0 rounded-full ${
                      profile.isPublished ? 'bg-emerald-500' : 'bg-amber-400'
                    }`}
                    title={profile.isPublished ? 'Published' : 'Draft'}
                  />
                </div>
                <p className="text-muted-foreground mt-1 truncate text-sm">
                  griit.me/{profile.username}
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2">
              <Button
                asChild
                className="flex-1 rounded-full bg-[#151515] hover:bg-[#3157ff]"
                size="sm"
              >
                <Link href={`/dashboard/profiles/${profile.id}` as Route}>
                  Manage
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link
                  href={`/${profile.username}`}
                  target="_blank"
                  title="Open public page"
                >
                  <ArrowSquareOutIcon className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                aria-label="Delete profile"
                disabled={deletePending && deletingId === profile.id}
                onClick={() => removeProfile(profile)}
                size="sm"
                type="button"
                variant="ghost"
              >
                {deletePending && deletingId === profile.id ? (
                  <CircleNotchIcon className="h-4 w-4 animate-spin" />
                ) : (
                  <TrashIcon className="h-4 w-4" />
                )}
              </Button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
