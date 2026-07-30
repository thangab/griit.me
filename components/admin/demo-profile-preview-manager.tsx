'use client';

import { useActionState, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowSquareOutIcon,
  CheckCircleIcon,
  CircleNotchIcon,
  FloppyDiskIcon,
  MagnifyingGlassIcon,
} from '@phosphor-icons/react/ssr';
import {
  saveAthletePreviewImageAction,
  type DirectoryReviewActionState,
} from '@/lib/actions/athlete-directory-review';
import type { AdminDemoProfile } from '@/lib/services/athlete-directory-review';
import { ImageUploadField } from '@/components/dashboard/image-upload-field';
import { ProfileAvatar } from '@/components/profile/profile-avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';

const initialState: DirectoryReviewActionState = {
  success: false,
  message: '',
};

function DemoProfilePreviewEditor({
  profile,
  fr,
}: {
  profile: AdminDemoProfile;
  fr: boolean;
}) {
  const router = useRouter();
  const [state, action, pending] = useActionState(
    saveAthletePreviewImageAction,
    initialState,
  );

  useEffect(() => {
    if (state.success) router.refresh();
  }, [router, state.success]);

  return (
    <div className="rounded-[1.5rem] border border-black/10 bg-white p-5 shadow-[0_18px_50px_rgba(21,21,21,0.05)] sm:p-6">
      <div className="mb-5 flex items-start gap-3">
        <ProfileAvatar
          avatarUrl={profile.avatarUrl}
          className="bg-[#eef2ff] text-black/50"
          displayName={profile.displayName}
          size={52}
        />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-black tracking-[-0.025em]">
            {profile.displayName}
          </h3>
          <p className="mt-1 truncate text-sm text-black/45">
            griit.me/{profile.username}
          </p>
        </div>
        <Button asChild size="sm" variant="outline">
          <Link href={`/${profile.username}`} target="_blank">
            <ArrowSquareOutIcon className="h-4 w-4" />
            <span className="sr-only">
              {fr ? 'Ouvrir le profil' : 'Open profile'}
            </span>
          </Link>
        </Button>
      </div>

      <form action={action} className="space-y-4">
        <input name="profileId" type="hidden" value={profile.profileId} />
        <ImageUploadField
          folder="previews"
          helpText={
            fr
              ? 'Ce screenshot sera utilisé sur la page Inspiration et les aperçus marketing.'
              : 'This screenshot is used on the Inspiration page and marketing previews.'
          }
          label={fr ? 'Screenshot du profil' : 'Profile screenshot'}
          name="previewImageUrl"
          previewShape="portrait"
          value={profile.previewImageUrl}
        />
        <Button
          className="rounded-full bg-[#3157ff] text-white hover:bg-[#2447dc]"
          disabled={pending}
          size="sm"
          type="submit"
        >
          {pending ? (
            <CircleNotchIcon className="h-4 w-4 animate-spin" />
          ) : (
            <FloppyDiskIcon className="h-4 w-4" />
          )}
          {fr ? 'Enregistrer le screenshot' : 'Save screenshot'}
        </Button>
        {state.message ? (
          <p
            className={cn(
              'text-xs font-semibold',
              state.success ? 'text-emerald-700' : 'text-red-700',
            )}
          >
            {state.message}
          </p>
        ) : null}
      </form>
    </div>
  );
}

export function DemoProfilePreviewManager({
  profiles,
  fr,
}: {
  profiles: AdminDemoProfile[];
  fr: boolean;
}) {
  const [query, setQuery] = useState('');
  const [selectedProfileId, setSelectedProfileId] = useState(
    profiles.find((profile) => !profile.previewImageUrl)?.profileId ??
      profiles[0]?.profileId,
  );
  const filteredProfiles = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    if (!normalizedQuery) return profiles;

    return profiles.filter((profile) =>
      `${profile.displayName} ${profile.username}`
        .toLocaleLowerCase()
        .includes(normalizedQuery),
    );
  }, [profiles, query]);
  const selectedProfile =
    profiles.find((profile) => profile.profileId === selectedProfileId) ??
    profiles[0];
  const completedCount = profiles.filter(
    (profile) => profile.previewImageUrl,
  ).length;

  if (!profiles.length) return null;

  return (
    <section className="space-y-4 pt-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-black tracking-[-0.035em]">
            {fr ? 'Profils de démonstration' : 'Demo profiles'}
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-black/45">
            {fr
              ? 'Gérez ici leurs screenshots marketing, sans les ajouter à la file de validation des athlètes.'
              : 'Manage their marketing screenshots here without adding them to the athlete review queue.'}
          </p>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800">
          <CheckCircleIcon className="h-4 w-4" weight="fill" />
          {completedCount}/{profiles.length}{' '}
          {fr ? 'avec un screenshot' : 'with a screenshot'}
        </span>
      </div>

      <div className="grid gap-4 rounded-[1.75rem] border border-black/10 bg-[#f7f7f4] p-4 lg:grid-cols-[minmax(0,0.85fr)_minmax(360px,1.15fr)] lg:p-5">
        <div className="min-w-0">
          <label className="relative block">
            <span className="sr-only">
              {fr ? 'Rechercher un profil de démo' : 'Search demo profiles'}
            </span>
            <MagnifyingGlassIcon className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-black/35" />
            <input
              className="h-11 w-full rounded-xl border border-black/10 bg-white pr-4 pl-10 text-sm transition outline-none focus:border-[#3157ff] focus:ring-2 focus:ring-[#3157ff]/10"
              placeholder={fr ? 'Rechercher une démo…' : 'Search demos…'}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>

          <div className="mt-3 max-h-80 space-y-1.5 overflow-y-auto pr-1 lg:max-h-[560px]">
            {filteredProfiles.map((profile) => {
              const selected = profile.profileId === selectedProfile?.profileId;
              return (
                <button
                  key={profile.profileId}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition',
                    selected
                      ? 'border-[#3157ff] bg-[#eef2ff]'
                      : 'border-transparent bg-white hover:border-black/10',
                  )}
                  type="button"
                  onClick={() => setSelectedProfileId(profile.profileId)}
                >
                  <ProfileAvatar
                    avatarUrl={profile.avatarUrl}
                    className="bg-white text-black/45"
                    displayName={profile.displayName}
                    size={38}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold">
                      {profile.displayName}
                    </span>
                    <span className="block truncate text-xs text-black/40">
                      {profile.username}
                    </span>
                  </span>
                  <span
                    className={cn(
                      'h-2.5 w-2.5 shrink-0 rounded-full',
                      profile.previewImageUrl
                        ? 'bg-emerald-500'
                        : 'bg-amber-400',
                    )}
                    title={
                      profile.previewImageUrl
                        ? fr
                          ? 'Screenshot ajouté'
                          : 'Screenshot added'
                        : fr
                          ? 'Screenshot manquant'
                          : 'Screenshot missing'
                    }
                  />
                </button>
              );
            })}
            {!filteredProfiles.length ? (
              <p className="rounded-xl bg-white px-4 py-8 text-center text-sm text-black/40">
                {fr ? 'Aucun profil trouvé.' : 'No profiles found.'}
              </p>
            ) : null}
          </div>
        </div>

        {selectedProfile ? (
          <DemoProfilePreviewEditor
            key={selectedProfile.profileId}
            fr={fr}
            profile={selectedProfile}
          />
        ) : null}
      </div>
    </section>
  );
}
