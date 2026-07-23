'use client';

import {
  useActionState,
  useEffect,
  useRef,
  useState,
  useTransition,
} from 'react';
import type { Route } from 'next';
import { useRouter } from 'next/navigation';
import {
  ArrowSquareOutIcon,
  CheckIcon,
  CircleNotchIcon,
  FloppyDiskIcon,
  GlobeIcon,
  LockKeyIcon,
  MagnifyingGlassIcon,
  QrCodeIcon,
  ShareNetworkIcon,
  TrashIcon,
  WarningCircleIcon,
} from '@phosphor-icons/react/ssr';
import {
  checkUsernameAvailabilityAction,
  deleteProfileAction,
  updateProfileSettingsAction,
  updateProfileUrlAction,
  updateProfileVisibilityAction,
  type ProfileBuilderActionState,
} from '@/lib/actions/profile-builder';
import { deleteAccountAction } from '@/lib/actions/auth';
import { ImageUploadField } from '@/components/dashboard/image-upload-field';
import { Button } from '@/components/ui/button';
import type { ProfileBuilderState } from '@/lib/types/profile-builder';

const initialState: ProfileBuilderActionState = {
  success: false,
  message: '',
};

type AvailabilityStatus =
  | 'current'
  | 'checking'
  | 'available'
  | 'taken'
  | 'invalid';

function validateUsername(username: string) {
  if (username.length < 3) return 'Use at least 3 characters.';
  if (username.length > 32) return 'Use 32 characters or fewer.';
  if (!/^[a-z0-9_]+$/.test(username)) {
    return 'Use lowercase letters, numbers, or underscores only.';
  }
  return '';
}

function SettingToggle({
  name,
  title,
  description,
  defaultChecked,
  disabled = false,
  onChange,
}: {
  name: string;
  title: string;
  description: string;
  defaultChecked: boolean;
  disabled?: boolean;
  onChange?: () => void;
}) {
  return (
    <label className="border-border flex cursor-pointer items-center justify-between gap-5 border-b py-4 last:border-b-0">
      <span className="min-w-0">
        <span className="block text-sm font-semibold">{title}</span>
        <span className="text-muted-foreground mt-1 block text-xs leading-5">
          {description}
        </span>
      </span>
      <span className="relative shrink-0">
        <input
          className="peer sr-only"
          defaultChecked={defaultChecked}
          disabled={disabled}
          name={name}
          type="checkbox"
          onChange={onChange}
        />
        <span className="bg-muted peer-focus-visible:ring-ring block h-6 w-11 rounded-full transition-colors peer-checked:bg-emerald-500 peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2" />
        <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5" />
      </span>
    </label>
  );
}

function Feedback({ state }: { state: ProfileBuilderActionState }) {
  if (!state.message) return null;
  return (
    <p
      className={`rounded-xl px-4 py-3 text-sm ${
        state.success
          ? 'bg-emerald-50 text-emerald-900'
          : 'bg-red-50 text-red-900'
      }`}
    >
      {state.message}
    </p>
  );
}

export function PublicProfileSettings({
  builder,
}: {
  builder: ProfileBuilderState;
}) {
  const router = useRouter();
  const [urlState, urlFormAction, urlPending] = useActionState(
    updateProfileUrlAction,
    initialState,
  );
  const [settingsState, settingsFormAction, settingsPending] = useActionState(
    updateProfileSettingsAction,
    initialState,
  );
  const [visibilityState, visibilityFormAction, visibilityPending] =
    useActionState(updateProfileVisibilityAction, initialState);
  const savedUsername = builder.profile.username;
  const [username, setUsername] = useState(savedUsername);
  const [seoTitle, setSeoTitle] = useState(builder.profile.seoTitle);
  const [seoDescription, setSeoDescription] = useState(
    builder.profile.seoDescription,
  );
  const [shareImageUrl, setShareImageUrl] = useState(
    builder.profile.shareImageUrl,
  );
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [accountConfirmation, setAccountConfirmation] = useState('');
  const [deleteMessage, setDeleteMessage] = useState('');
  const [deletePending, startDeleteTransition] = useTransition();
  const [accountState, accountFormAction, accountPending] = useActionState(
    deleteAccountAction,
    initialState,
  );
  const [availabilityResult, setAvailabilityResult] = useState({
    username: savedUsername,
    available: true,
    message: 'This is your current username.',
  });
  const requestIdRef = useRef(0);
  const visibilityFormRef = useRef<HTMLFormElement>(null);
  const visibilityTimerRef = useRef<number | null>(null);
  const [visibilityDirty, setVisibilityDirty] = useState(false);
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
      void checkUsernameAvailabilityAction(
        builder.profile.id ?? 0,
        normalizedUsername,
      ).then((result) => {
        if (requestId !== requestIdRef.current) return;
        setAvailabilityResult({
          username: normalizedUsername,
          available: result.available,
          message: result.message,
        });
      });
    }, 450);

    return () => window.clearTimeout(timer);
  }, [
    builder.profile.id,
    normalizedUsername,
    savedUsername,
    validationMessage,
  ]);

  useEffect(
    () => () => {
      if (visibilityTimerRef.current) {
        window.clearTimeout(visibilityTimerRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    if (!accountState.success) return;
    router.replace('/' as Route);
    router.refresh();
  }, [accountState.success, router]);

  const scheduleVisibilitySave = () => {
    setVisibilityDirty(true);
    if (visibilityTimerRef.current) {
      window.clearTimeout(visibilityTimerRef.current);
    }
    visibilityTimerRef.current = window.setTimeout(() => {
      setVisibilityDirty(false);
      visibilityFormRef.current?.requestSubmit();
    }, 700);
  };

  const deleteProfile = () => {
    if (!builder.profile.id || deleteConfirmation !== savedUsername) return;
    setDeleteMessage('');
    startDeleteTransition(async () => {
      const result = await deleteProfileAction(builder.profile.id!);
      if (!result.success) {
        setDeleteMessage(result.message);
        return;
      }
      router.replace('/dashboard' as Route);
      router.refresh();
    });
  };

  const defaultSeoTitle = `${builder.profile.displayName} · Griit`;
  const defaultSeoDescription =
    builder.profile.bio || 'Athlete profile on Griit';

  return (
    <div className="space-y-6">
      <section className="border-border bg-background overflow-hidden rounded-2xl border">
        <div className="border-border bg-muted/30 flex flex-col gap-4 border-b px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-start gap-3">
            <span className="bg-background border-border flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border shadow-sm">
              <GlobeIcon className="h-4 w-4" />
            </span>
            <div>
              <h2 className="text-lg font-semibold">Public address</h2>
              <p className="text-muted-foreground mt-1 text-sm">
                The permanent link you share with your audience.
              </p>
            </div>
          </div>
          <a
            className="border-border bg-background hover:bg-muted inline-flex h-9 w-fit items-center gap-2 rounded-lg border px-3 text-sm font-medium transition-colors"
            href={`/${savedUsername}`}
            rel="noreferrer"
            target="_blank"
          >
            Open profile
            <ArrowSquareOutIcon className="h-4 w-4" />
          </a>
        </div>

        <form action={urlFormAction} className="space-y-3 p-5 sm:p-6">
          <input name="profileId" type="hidden" value={builder.profile.id ?? ''} />
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <label className="block min-w-0">
              <span className="text-sm font-semibold">Username</span>
              <div className="border-border mt-2 flex h-12 overflow-hidden rounded-xl border focus-within:ring-2 focus-within:ring-primary/15">
                <span className="text-muted-foreground bg-muted/40 border-border flex items-center border-r px-3 text-sm">
                  griit.me/
                </span>
                <input
                  autoCapitalize="none"
                  autoComplete="off"
                  className="min-w-0 flex-1 bg-transparent px-3 text-sm font-medium outline-none"
                  maxLength={32}
                  name="username"
                  spellCheck={false}
                  value={username}
                  onChange={(event) => setUsername(event.target.value.toLowerCase())}
                />
              </div>
            </label>
            <Button
              className="h-12 w-full lg:w-auto"
              disabled={
                urlPending ||
                availabilityStatus !== 'available' ||
                normalizedUsername === savedUsername
              }
              type="submit"
            >
              {urlPending ? (
                <CircleNotchIcon className="h-4 w-4 animate-spin" />
              ) : (
                <FloppyDiskIcon className="h-4 w-4" />
              )}
              Update URL
            </Button>
          </div>
          <div
            className={`flex min-h-5 items-center gap-2 text-xs font-medium ${
              availabilityStatus === 'available' || availabilityStatus === 'current'
                ? 'text-emerald-700'
                : availabilityStatus === 'taken' || availabilityStatus === 'invalid'
                  ? 'text-red-700'
                  : 'text-muted-foreground'
            }`}
          >
            {availabilityStatus === 'checking' ? (
              <CircleNotchIcon className="h-3.5 w-3.5 animate-spin" />
            ) : availabilityStatus === 'available' || availabilityStatus === 'current' ? (
              <CheckIcon className="h-3.5 w-3.5" />
            ) : (
              <WarningCircleIcon className="h-3.5 w-3.5" />
            )}
            {availabilityMessage}
          </div>
          <Feedback state={urlState} />
        </form>
      </section>

      <form
        ref={visibilityFormRef}
        action={visibilityFormAction}
        className="border-border bg-background overflow-hidden rounded-2xl border"
      >
        <input name="profileId" type="hidden" value={builder.profile.id ?? ''} />
        <section>
          <div className="border-border bg-muted/30 flex items-start gap-3 border-b px-5 py-5 sm:px-6">
            <span className="bg-background border-border flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border shadow-sm">
              <MagnifyingGlassIcon className="h-4 w-4" />
            </span>
            <div>
              <h2 className="text-lg font-semibold">Visibility & discovery</h2>
              <p className="text-muted-foreground mt-1 text-sm">
                Choose where people can find this profile.
              </p>
            </div>
          </div>
          <div className="px-5 sm:px-6">
            <SettingToggle
              defaultChecked={builder.profile.isPublished}
              description="Anyone with the link can view your public page."
              disabled={visibilityPending}
              name="isPublished"
              title="Publish profile"
              onChange={scheduleVisibilitySave}
            />
            <SettingToggle
              defaultChecked={builder.profile.isDiscoverable}
              description="Include this page in the public athlete directory and sport filters."
              disabled={visibilityPending}
              name="isDiscoverable"
              title="Show in athlete directory"
              onChange={scheduleVisibilitySave}
            />
            <SettingToggle
              defaultChecked={builder.profile.allowIndexing}
              description="Allow search engines such as Google to index this page."
              disabled={visibilityPending}
              name="allowIndexing"
              title="Search engine indexing"
              onChange={scheduleVisibilitySave}
            />
          </div>
          <div className="border-border flex min-h-12 items-center justify-end border-t px-5 py-3 text-xs font-medium sm:px-6">
            {visibilityPending ? (
              <span className="text-muted-foreground inline-flex items-center gap-2">
                <CircleNotchIcon className="h-3.5 w-3.5 animate-spin" />
                Saving…
              </span>
            ) : visibilityDirty ? (
              <span className="text-muted-foreground">Saving shortly…</span>
            ) : visibilityState.message ? (
              <span
                className={
                  visibilityState.success ? 'text-emerald-700' : 'text-red-700'
                }
              >
                {visibilityState.success ? 'Saved' : visibilityState.message}
              </span>
            ) : (
              <span className="text-muted-foreground">Changes save automatically</span>
            )}
          </div>
        </section>
      </form>

      <form
        action={settingsFormAction}
        className="border-border bg-background overflow-hidden rounded-2xl border"
      >
        <input name="profileId" type="hidden" value={builder.profile.id ?? ''} />
        <section>
          <div className="border-border bg-muted/30 flex items-start gap-3 border-b px-5 py-5 sm:px-6">
            <span className="bg-background border-border flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border shadow-sm">
              <ShareNetworkIcon className="h-4 w-4" />
            </span>
            <div>
              <h2 className="text-lg font-semibold">Search & sharing</h2>
              <p className="text-muted-foreground mt-1 text-sm">
                Control how your profile appears in search results and shared links.
              </p>
            </div>
          </div>
          <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_minmax(260px,0.8fr)]">
            <div className="space-y-5">
              <label className="block">
                <span className="flex items-center justify-between gap-3 text-sm font-semibold">
                  Page title
                  <span className="text-muted-foreground text-xs font-normal">
                    {seoTitle.length}/70
                  </span>
                </span>
                <input
                  className="border-border mt-2 h-11 w-full rounded-xl border bg-transparent px-3 text-sm outline-none focus:ring-2 focus:ring-primary/15"
                  maxLength={70}
                  name="seoTitle"
                  placeholder={defaultSeoTitle}
                  value={seoTitle}
                  onChange={(event) => setSeoTitle(event.target.value)}
                />
              </label>
              <label className="block">
                <span className="flex items-center justify-between gap-3 text-sm font-semibold">
                  Description
                  <span className="text-muted-foreground text-xs font-normal">
                    {seoDescription.length}/160
                  </span>
                </span>
                <textarea
                  className="border-border mt-2 min-h-28 w-full resize-y rounded-xl border bg-transparent px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/15"
                  maxLength={160}
                  name="seoDescription"
                  placeholder={defaultSeoDescription}
                  value={seoDescription}
                  onChange={(event) => setSeoDescription(event.target.value)}
                />
              </label>
              <ImageUploadField
                folder="sharing"
                helpText="Recommended: 1200 × 630 px. Used when your link is shared."
                label="Social sharing image"
                name="shareImageUrl"
                previewShape="wide"
                value={shareImageUrl}
                onValueChange={setShareImageUrl}
              />
            </div>

            <div>
              <p className="text-muted-foreground mb-2 text-xs font-semibold uppercase tracking-[0.14em]">
                Link preview
              </p>
              <div className="border-border overflow-hidden rounded-2xl border shadow-sm">
                <div
                  className="bg-muted aspect-[1.91/1] bg-cover bg-center"
                  style={
                    shareImageUrl
                      ? { backgroundImage: `url(${JSON.stringify(shareImageUrl)})` }
                      : undefined
                  }
                />
                <div className="space-y-1 p-4">
                  <p className="text-muted-foreground text-[11px] uppercase tracking-wide">
                    griit.me/{savedUsername}
                  </p>
                  <p className="line-clamp-2 text-sm font-semibold">
                    {seoTitle || defaultSeoTitle}
                  </p>
                  <p className="text-muted-foreground line-clamp-2 text-xs leading-5">
                    {seoDescription || defaultSeoDescription}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="border-border flex flex-col gap-3 border-t px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <Feedback state={settingsState} />
            <Button className="sm:ml-auto" disabled={settingsPending} type="submit">
              {settingsPending ? (
                <CircleNotchIcon className="h-4 w-4 animate-spin" />
              ) : (
                <FloppyDiskIcon className="h-4 w-4" />
              )}
              {settingsPending ? 'Saving…' : 'Save settings'}
            </Button>
          </div>
        </section>
      </form>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="border-border bg-background rounded-2xl border p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <span className="bg-muted flex h-10 w-10 items-center justify-center rounded-xl">
              <LockKeyIcon className="h-4 w-4" />
            </span>
            <div className="flex gap-2">
              <span className="bg-primary/10 text-primary rounded-full px-2.5 py-1 text-[11px] font-semibold">Pro</span>
              <span className="bg-muted text-muted-foreground rounded-full px-2.5 py-1 text-[11px] font-semibold">Coming soon</span>
            </div>
          </div>
          <h2 className="mt-5 font-semibold">Custom domain</h2>
          <p className="text-muted-foreground mt-2 text-sm leading-6">
            Connect your own domain while keeping your Griit profile and analytics.
          </p>
        </div>
        <div className="border-border bg-background rounded-2xl border p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <span className="bg-muted flex h-10 w-10 items-center justify-center rounded-xl">
              <QrCodeIcon className="h-4 w-4" />
            </span>
            <span className="bg-muted text-muted-foreground rounded-full px-2.5 py-1 text-[11px] font-semibold">Coming soon</span>
          </div>
          <h2 className="mt-5 font-semibold">QR code</h2>
          <p className="text-muted-foreground mt-2 text-sm leading-6">
            Generate a downloadable QR code for events, kits, posters, and social posts.
          </p>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-red-200 bg-background">
        <div className="border-b border-red-100 bg-red-50/60 px-5 py-5 sm:px-6">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-red-200 bg-white text-red-600">
              <TrashIcon className="h-4 w-4" />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-red-950">Danger zone</h2>
              <p className="mt-1 text-sm text-red-800/75">
                Manage irreversible profile and account deletion actions.
              </p>
            </div>
          </div>
        </div>
        <div className="p-5 sm:p-6">
          <h3 className="text-sm font-semibold">Delete this profile</h3>
          <p className="text-muted-foreground mt-1 max-w-2xl text-xs leading-5">
            This removes only <strong>{builder.profile.displayName}</strong> and
            its content. Your account and other profiles remain available.
          </p>
          <label className="block max-w-xl">
            <span className="mt-4 block text-sm font-semibold">
              Type <strong>{savedUsername}</strong> to confirm
            </span>
            <input
              className="border-border mt-2 h-11 w-full rounded-xl border bg-transparent px-3 text-sm outline-none focus:border-red-300 focus:ring-2 focus:ring-red-100"
              value={deleteConfirmation}
              onChange={(event) => setDeleteConfirmation(event.target.value)}
            />
          </label>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              className="bg-red-600 text-white hover:bg-red-700"
              disabled={deletePending || deleteConfirmation !== savedUsername}
              type="button"
              onClick={deleteProfile}
            >
              {deletePending ? (
                <CircleNotchIcon className="h-4 w-4 animate-spin" />
              ) : (
                <TrashIcon className="h-4 w-4" />
              )}
              Delete profile
            </Button>
            {deleteMessage ? (
              <p className="text-sm text-red-700">{deleteMessage}</p>
            ) : null}
          </div>
        </div>

        <form
          action={accountFormAction}
          className="border-t border-red-100 p-5 sm:p-6"
        >
          <h3 className="text-sm font-semibold text-red-950">
            Delete your entire account
          </h3>
          <p className="mt-1 max-w-2xl text-xs leading-5 text-red-800/75">
            This cancels your active subscription and permanently removes every
            profile, block, uploaded image, and analytics event linked to your
            account. This cannot be undone.
          </p>
          <label className="mt-4 block max-w-xl">
            <span className="text-sm font-semibold">
              Type <strong>DELETE MY ACCOUNT</strong> to confirm
            </span>
            <input
              className="border-border mt-2 h-11 w-full rounded-xl border bg-transparent px-3 text-sm outline-none focus:border-red-300 focus:ring-2 focus:ring-red-100"
              name="confirmation"
              value={accountConfirmation}
              onChange={(event) => setAccountConfirmation(event.target.value)}
            />
          </label>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              className="bg-red-950 text-white hover:bg-red-900"
              disabled={
                accountPending || accountConfirmation !== 'DELETE MY ACCOUNT'
              }
              type="submit"
            >
              {accountPending ? (
                <CircleNotchIcon className="h-4 w-4 animate-spin" />
              ) : (
                <WarningCircleIcon className="h-4 w-4" />
              )}
              {accountPending ? 'Deleting account…' : 'Delete my account'}
            </Button>
            {accountState.message && !accountState.success ? (
              <p className="text-sm text-red-700">{accountState.message}</p>
            ) : null}
          </div>
        </form>
      </section>
    </div>
  );
}
