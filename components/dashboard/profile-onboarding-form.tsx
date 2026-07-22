'use client';

import { useActionState, useEffect, useMemo, useState } from 'react';
import type { Route } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRightIcon,
  CheckCircleIcon,
  CircleNotchIcon,
} from '@phosphor-icons/react/ssr';
import {
  checkUsernameAvailabilityAction,
  createProfileAction,
  type ProfileBuilderActionState,
} from '@/lib/actions/profile-builder';
import { AuthFormMessage } from '@/components/auth/auth-form-message';
import { MobileProfileFrame } from '@/components/dashboard/mobile-profile-frame';
import { Button } from '@/components/ui/button';
import type { ProfileBuilderState } from '@/lib/types/profile-builder';

const initialState: ProfileBuilderActionState = {
  success: false,
  message: '',
};

type AvailabilityState =
  | { status: 'idle'; message: string }
  | { status: 'checking'; message: string }
  | { status: 'available'; message: string }
  | { status: 'unavailable'; message: string };

function normalizeUsername(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '')
    .slice(0, 32);
}

export function ProfileOnboardingForm() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    createProfileAction,
    initialState,
  );
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [availability, setAvailability] = useState<AvailabilityState>({
    status: 'idle',
    message: 'Use lowercase letters, numbers, or underscores.',
  });

  useEffect(() => {
    if (state.success && state.profileId) {
      router.replace(`/dashboard/profiles/${state.profileId}/design` as Route);
      router.refresh();
    }
  }, [router, state]);

  useEffect(() => {
    if (username.length < 3) return;

    let cancelled = false;

    const timeout = window.setTimeout(async () => {
      const result = await checkUsernameAvailabilityAction(0, username);
      if (cancelled) return;

      setAvailability({
        status: result.available ? 'available' : 'unavailable',
        message: result.message,
      });
    }, 450);

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, [username]);

  const handleUsernameChange = (value: string) => {
    const normalizedUsername = normalizeUsername(value);
    setUsername(normalizedUsername);

    if (!normalizedUsername) {
      setAvailability({
        status: 'idle',
        message: 'Use lowercase letters, numbers, or underscores.',
      });
    } else if (normalizedUsername.length < 3) {
      setAvailability({
        status: 'unavailable',
        message: 'Username must be at least 3 characters.',
      });
    } else {
      setAvailability({
        status: 'checking',
        message: 'Checking availability…',
      });
    }
  };

  const usernameIsAvailable = availability.status === 'available';
  const previewName = displayName.trim() || 'Display name';
  const previewUsername = username || 'username';
  const previewBuilder = useMemo<ProfileBuilderState>(
    () => ({
      source: 'initial',
      profile: {
        id: null,
        username: previewUsername,
        displayName: previewName,
        bio: '',
        sports: [],
        sportSlugs: [],
        location: '',
        avatarUrl: '',
        coverUrl: '',
        isPublished: false,
        theme: { templateId: 'spotlight' },
      },
      blocks: [],
      socialLinks: [],
      galleryItems: [],
      sponsors: [],
      achievements: [],
      activities: [],
      goals: [],
      availableSports: [],
    }),
    [previewName, previewUsername],
  );

  return (
    <main className="grid min-h-screen bg-white text-[#151515] lg:grid-cols-[minmax(0,1fr)_minmax(520px,0.95fr)]">
      <section className="relative flex min-h-screen items-center justify-center px-6 py-24 sm:px-10 lg:px-14 xl:px-20">
        <Link
          className="absolute top-7 left-6 text-xl font-black tracking-[-0.06em] sm:top-9 sm:left-10 lg:left-12"
          href="/"
        >
          GRIIT<span className="text-[#3157ff]">.</span>
        </Link>

        <div className="w-full max-w-[500px]">
          <span className="inline-flex rounded-full border border-[#3157ff]/15 bg-[#3157ff]/8 px-3 py-1.5 text-[11px] font-black tracking-[0.16em] text-[#3157ff] uppercase">
            Profile setup
          </span>
          <h1 className="mt-5 text-4xl leading-[0.95] font-black tracking-[-0.055em] sm:text-5xl">
            Claim your athlete identity.
          </h1>
          <p className="mt-4 max-w-md text-sm leading-6 text-black/48 sm:text-base">
            Choose how your name appears and claim the public URL you’ll share
            with your audience.
          </p>

          <form action={formAction} className="mt-9 space-y-6">
            <label className="block space-y-2.5 text-sm font-bold">
              Display name
              <input
                autoComplete="name"
                autoFocus
                className="h-12 w-full rounded-xl border border-black/12 bg-white px-4 font-normal transition outline-none focus:border-[#3157ff] focus:ring-3 focus:ring-[#3157ff]/10"
                maxLength={120}
                name="displayName"
                onChange={(event) => setDisplayName(event.target.value)}
                placeholder="Your display name"
                required
                value={displayName}
              />
              <span className="block text-xs leading-5 font-normal text-black/42">
                This is the name visitors will see on your profile.
              </span>
            </label>

            <label className="block space-y-2.5 text-sm font-bold">
              Public profile URL
              <div
                className={`flex h-12 overflow-hidden rounded-xl border bg-white transition focus-within:ring-3 ${
                  availability.status === 'available'
                    ? 'border-emerald-300 focus-within:ring-emerald-100'
                    : availability.status === 'unavailable'
                      ? 'border-red-300 focus-within:ring-red-100'
                      : 'border-black/12 focus-within:border-[#3157ff] focus-within:ring-[#3157ff]/10'
                }`}
              >
                <span className="flex shrink-0 items-center border-r border-black/8 bg-black/[0.035] px-3 font-normal text-black/45 sm:px-4">
                  griit.me/
                </span>
                <input
                  aria-describedby="username-availability"
                  autoCapitalize="none"
                  autoComplete="off"
                  className="min-w-0 flex-1 bg-transparent px-3 font-normal outline-none sm:px-4"
                  maxLength={32}
                  name="username"
                  onChange={(event) => handleUsernameChange(event.target.value)}
                  pattern="[a-z0-9_]+"
                  placeholder="username"
                  required
                  spellCheck={false}
                  value={username}
                />
                <span className="flex w-11 shrink-0 items-center justify-center">
                  {availability.status === 'checking' ? (
                    <CircleNotchIcon className="h-4 w-4 animate-spin text-black/35" />
                  ) : availability.status === 'available' ? (
                    <CheckCircleIcon
                      className="h-5 w-5 text-emerald-600"
                      weight="fill"
                    />
                  ) : null}
                </span>
              </div>
              <span
                className={`block text-xs leading-5 font-normal ${
                  availability.status === 'available'
                    ? 'text-emerald-700'
                    : availability.status === 'unavailable'
                      ? 'text-red-600'
                      : 'text-black/42'
                }`}
                id="username-availability"
              >
                {availability.message}
              </span>
            </label>

            {state.message && !state.success ? (
              <AuthFormMessage
                message={state.message}
                title="Unable to create your profile"
                type="error"
              />
            ) : null}

            <Button
              className="h-12 w-full rounded-xl bg-[#151515] text-white hover:bg-[#151515]/90"
              disabled={pending || !usernameIsAvailable || !displayName.trim()}
              type="submit"
            >
              {pending ? (
                <CircleNotchIcon className="h-4 w-4 animate-spin" />
              ) : null}
              {pending ? 'Creating your profile…' : 'Create my profile'}
              {!pending ? (
                <ArrowRightIcon className="h-4 w-4" weight="bold" />
              ) : null}
            </Button>
          </form>
        </div>
      </section>

      <aside className="relative hidden min-h-screen items-center justify-center overflow-hidden border-l border-black/5 bg-[#eef2ff] px-10 py-12 lg:flex">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(169,237,53,0.34),transparent_28%),radial-gradient(circle_at_82%_78%,rgba(49,87,255,0.24),transparent_32%)]" />
        <div className="relative flex w-full flex-col items-center">
          <p className="mb-5 text-center text-[10px] font-black tracking-[0.2em] text-black/35 uppercase">
            Live preview
          </p>
          <MobileProfileFrame
            builder={previewBuilder}
            className="h-[min(720px,calc(100dvh-110px))] shadow-[0_35px_80px_rgba(15,23,42,0.24)]"
            fillHeight
          />
        </div>
      </aside>
    </main>
  );
}
