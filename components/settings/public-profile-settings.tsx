'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import {
  ArrowUpRight,
  Check,
  CircleAlert,
  Globe2,
  LoaderCircle,
  Save,
} from 'lucide-react';
import {
  checkUsernameAvailabilityAction,
  updateProfileUrlAction,
  type ProfileBuilderActionState,
} from '@/lib/actions/profile-builder';
import { Button } from '@/components/ui/button';
import type { ProfileBuilderState } from '@/lib/types/profile-builder';

const initialState: ProfileBuilderActionState = {
  success: false,
  message: '',
};

type AvailabilityStatus =
  'current' | 'checking' | 'available' | 'taken' | 'invalid';

function validateUsername(username: string) {
  if (username.length < 3) return 'Use at least 3 characters.';
  if (username.length > 32) return 'Use 32 characters or fewer.';
  if (!/^[a-z0-9_]+$/.test(username)) {
    return 'Use lowercase letters, numbers, or underscores only.';
  }
  return '';
}

export function PublicProfileSettings({
  builder,
}: {
  builder: ProfileBuilderState;
}) {
  const [state, formAction, pending] = useActionState(
    updateProfileUrlAction,
    initialState,
  );
  const savedUsername = builder.profile.username;
  const [username, setUsername] = useState(savedUsername);
  const [availabilityResult, setAvailabilityResult] = useState<{
    username: string;
    available: boolean;
    message: string;
  }>({
    username: savedUsername,
    available: true,
    message: 'This is your current username.',
  });
  const requestIdRef = useRef(0);
  const normalizedUsername = username.trim().toLowerCase();
  const validationMessage = validateUsername(normalizedUsername);
  const availabilityStatus: AvailabilityStatus =
    normalizedUsername === savedUsername
      ? 'current'
      : validationMessage
        ? 'invalid'
        : availabilityResult.username !== normalizedUsername
          ? 'checking'
          : availabilityResult.available
            ? 'available'
            : 'taken';
  const availabilityMessage =
    availabilityStatus === 'current'
      ? 'This is your current username.'
      : availabilityStatus === 'invalid'
        ? validationMessage
        : availabilityStatus === 'checking'
          ? 'Checking availability…'
          : availabilityResult.message;

  useEffect(() => {
    const requestId = ++requestIdRef.current;

    if (normalizedUsername === savedUsername || validationMessage) return;

    const timer = window.setTimeout(() => {
      void checkUsernameAvailabilityAction(normalizedUsername).then(
        (result) => {
          if (requestId !== requestIdRef.current) return;
          setAvailabilityResult({
            username: normalizedUsername,
            available: result.available,
            message: result.message,
          });
        },
      );
    }, 450);

    return () => window.clearTimeout(timer);
  }, [normalizedUsername, savedUsername, validationMessage]);

  const canSave =
    availabilityStatus === 'available' && normalizedUsername !== savedUsername;

  return (
    <section className="border-border bg-background overflow-hidden rounded-2xl border">
      <div className="border-border bg-muted/30 flex flex-col gap-4 border-b px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-start gap-3">
          <span className="bg-background border-border flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border shadow-sm">
            <Globe2 className="h-4 w-4" />
          </span>
          <div>
            <h2 className="text-lg font-semibold">Public profile URL</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Choose the address you want to share everywhere.
            </p>
          </div>
        </div>
        <span className="bg-background border-border inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-semibold">
          <span
            className={`mr-2 h-1.5 w-1.5 rounded-full ${
              builder.profile.isPublished ? 'bg-emerald-500' : 'bg-amber-500'
            }`}
          />
          {builder.profile.isPublished ? 'Published' : 'Draft'}
        </span>
      </div>

      <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <div className="bg-muted/30 border-border flex flex-col justify-between rounded-xl border p-4">
          <div>
            <p className="text-muted-foreground text-xs font-medium">
              Current public address
            </p>
            <p className="mt-2 text-lg font-semibold break-all">
              griit.me/{savedUsername}
            </p>
          </div>
          {builder.profile.isPublished ? (
            <a
              className="text-muted-foreground hover:text-foreground mt-6 inline-flex items-center gap-1.5 text-xs font-semibold transition-colors"
              href={`/${savedUsername}`}
              rel="noreferrer"
              target="_blank"
            >
              Open public profile
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          ) : (
            <p className="text-muted-foreground mt-6 text-xs leading-5">
              Publish your profile when you are ready to share this address.
            </p>
          )}
        </div>

        <form action={formAction} className="space-y-4">
          <label className="block">
            <span className="text-sm font-semibold">Choose your username</span>
            <span className="text-muted-foreground mt-1 block text-xs">
              3–32 characters · letters, numbers and underscores
            </span>
            <div
              className={`bg-background mt-3 flex h-12 overflow-hidden rounded-xl border transition-colors focus-within:ring-2 focus-within:ring-offset-2 ${
                availabilityStatus === 'available'
                  ? 'border-emerald-400 focus-within:ring-emerald-200'
                  : availabilityStatus === 'taken' ||
                      availabilityStatus === 'invalid'
                    ? 'border-red-300 focus-within:ring-red-100'
                    : 'border-border focus-within:border-primary focus-within:ring-primary/15'
              }`}
            >
              <span className="text-muted-foreground bg-muted/40 border-border flex shrink-0 items-center border-r px-3 text-sm">
                griit.me/
              </span>
              <input
                autoCapitalize="none"
                autoComplete="off"
                className="min-w-0 flex-1 bg-transparent px-3 text-sm font-medium outline-none"
                maxLength={32}
                name="username"
                placeholder="your_username"
                spellCheck={false}
                value={username}
                onChange={(event) =>
                  setUsername(event.target.value.toLowerCase())
                }
              />
            </div>
          </label>

          <div
            className={`flex min-h-5 items-center gap-2 text-xs font-medium ${
              availabilityStatus === 'available' ||
              availabilityStatus === 'current'
                ? 'text-emerald-700'
                : availabilityStatus === 'taken' ||
                    availabilityStatus === 'invalid'
                  ? 'text-red-700'
                  : 'text-muted-foreground'
            }`}
          >
            {availabilityStatus === 'checking' ? (
              <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
            ) : availabilityStatus === 'available' ||
              availabilityStatus === 'current' ? (
              <Check className="h-3.5 w-3.5" />
            ) : availabilityStatus === 'taken' ||
              availabilityStatus === 'invalid' ? (
              <CircleAlert className="h-3.5 w-3.5" />
            ) : null}
            <span>{availabilityMessage}</span>
          </div>

          {state.message ? (
            <p
              className={`rounded-lg px-3 py-2 text-sm ${
                state.success
                  ? 'bg-emerald-50 text-emerald-900'
                  : 'bg-red-50 text-red-900'
              }`}
            >
              {state.message}
            </p>
          ) : null}

          <div className="flex justify-end">
            <Button type="submit" disabled={pending || !canSave}>
              {pending ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {pending ? 'Saving…' : 'Update public URL'}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
