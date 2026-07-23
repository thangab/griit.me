'use client';

import { useActionState, useEffect, useMemo, useRef, useState } from 'react';
import type { Route } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeftIcon,
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
import { SportsSelector } from '@/components/dashboard/sports-selector';
import { Button } from '@/components/ui/button';
import { defaultSports, type SportOption } from '@/lib/constants/sports';
import {
  profileTemplates,
  type ProfileTemplateId,
} from '@/lib/constants/profile-templates';
import {
  getTemplateThemePreset,
  getThemeRuntime,
} from '@/lib/constants/profile-theme';
import type { ProfileBuilderState } from '@/lib/types/profile-builder';
import { cn } from '@/lib/utils/cn';

const initialState: ProfileBuilderActionState = {
  success: false,
  message: '',
};

const stepContent = [
  {
    eyebrow: 'Profile setup',
    title: 'Claim your athlete identity.',
    description:
      'Choose how your name appears and claim the public URL you’ll share with your audience.',
  },
  {
    eyebrow: 'Your world',
    title: 'What moves you?',
    description:
      'Pick up to three sports so your page starts with the right context.',
  },
  {
    eyebrow: 'Starting style',
    title: 'Choose your direction.',
    description:
      'Start with a visual direction you like. Every detail can be changed later in the editor.',
  },
] as const;

const featuredTemplates = profileTemplates.filter(
  (template) => !template.proOnly,
);

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

function TemplateThumbnail({ templateId }: { templateId: ProfileTemplateId }) {
  const preset = getTemplateThemePreset(templateId);
  const runtime = getThemeRuntime(preset);

  return (
    <span
      className="relative block h-20 overflow-hidden rounded-lg border"
      style={{
        backgroundColor: runtime.palette.background,
        borderColor: runtime.palette.border,
      }}
    >
      <span
        className="absolute inset-x-0 top-0 h-9"
        style={{ backgroundColor: preset.coverColor }}
      />
      <span
        className="absolute top-5 left-1/2 h-6 w-6 -translate-x-1/2 rounded-full border-2"
        style={{
          backgroundColor: runtime.palette.surface,
          borderColor: runtime.palette.accent,
        }}
      />
      <span
        className="absolute top-[48px] left-1/2 h-1.5 w-12 -translate-x-1/2 rounded-full"
        style={{ backgroundColor: runtime.palette.text }}
      />
      <span
        className="absolute right-3 bottom-2 left-3 h-1.5 rounded-full"
        style={{ backgroundColor: runtime.palette.accent }}
      />
    </span>
  );
}

export function ProfileOnboardingForm() {
  const router = useRouter();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [state, formAction, pending] = useActionState(
    createProfileAction,
    initialState,
  );
  const [step, setStep] = useState(1);
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [customSports, setCustomSports] = useState<SportOption[]>([]);
  const [objective, setObjective] = useState('');
  const [templateId, setTemplateId] = useState<ProfileTemplateId>('spotlight');
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
    if (step > 1) headingRef.current?.focus();
  }, [step]);

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
  const canContinueIdentity =
    usernameIsAvailable && Boolean(displayName.trim());
  const previewName = displayName.trim() || 'Display name';
  const previewUsername = username || 'username';
  const onboardingSports = useMemo(
    () => [...defaultSports, ...customSports],
    [customSports],
  );
  const selectedSportNames = useMemo(
    () =>
      onboardingSports
        .filter((sport) => selectedSports.includes(sport.slug))
        .map((sport) => sport.name),
    [onboardingSports, selectedSports],
  );
  const currentStep = stepContent[step - 1] ?? stepContent[0];

  const previewBuilder = useMemo<ProfileBuilderState>(
    () => ({
      source: 'initial',
      profile: {
        id: null,
        username: previewUsername,
        displayName: previewName,
        bio: '',
        sports: selectedSportNames,
        sportSlugs: selectedSports,
        location: '',
        avatarUrl: '',
        coverUrl: '',
        isPublished: false,
        isDiscoverable: true,
        allowIndexing: true,
        seoTitle: '',
        seoDescription: '',
        shareImageUrl: '',
        theme: { templateId },
      },
      blocks: [],
      socialLinks: [],
      galleryItems: [],
      sponsors: [],
      achievements: [],
      activities: [],
      goals: objective.trim()
        ? [
            {
              id: null,
              analyticsKey: '',
              title: objective.trim(),
              description: '',
              url: '',
              targetDate: '',
              targetLabel: '',
              dateDisplay: 'date',
              status: 'planned',
              sortOrder: 0,
              isEnabled: true,
            },
          ]
        : [],
      availableSports: onboardingSports,
    }),
    [
      objective,
      previewName,
      previewUsername,
      selectedSportNames,
      selectedSports,
      onboardingSports,
      templateId,
    ],
  );

  const goToNextStep = () => {
    if (step === 1 && canContinueIdentity) setStep(2);
    if (step === 2 && selectedSports.length) setStep(3);
  };

  return (
    <main className="grid min-h-screen bg-white text-[#151515] lg:grid-cols-[minmax(0,1fr)_minmax(520px,0.95fr)]">
      <section className="relative flex min-h-screen items-center justify-center px-6 py-24 sm:px-10 lg:px-14 xl:px-20">
        <Link
          className="absolute top-7 left-6 text-xl font-black tracking-[-0.06em] sm:top-9 sm:left-10 lg:left-12"
          href="/"
        >
          GRIIT<span className="text-[#3157ff]">.</span>
        </Link>

        <div className="absolute top-8 right-6 flex items-center gap-2 sm:right-10 lg:right-12">
          {[1, 2, 3].map((item) => (
            <span
              aria-hidden="true"
              className={cn(
                'h-1.5 rounded-full transition-all duration-300',
                item === step
                  ? 'w-8 bg-[#3157ff]'
                  : item < step
                    ? 'w-5 bg-[#3157ff]/35'
                    : 'w-5 bg-black/10',
              )}
              key={item}
            />
          ))}
          <span className="ml-1 text-xs font-bold text-black/38">{step}/3</span>
        </div>

        <div className="w-full max-w-[540px]">
          <span className="inline-flex rounded-full border border-[#3157ff]/15 bg-[#3157ff]/8 px-3 py-1.5 text-[11px] font-black tracking-[0.16em] text-[#3157ff] uppercase">
            {currentStep.eyebrow}
          </span>
          <h1
            className="mt-5 text-4xl leading-[0.95] font-black tracking-[-0.055em] outline-none sm:text-5xl"
            ref={headingRef}
            tabIndex={-1}
          >
            {currentStep.title}
          </h1>
          <p className="mt-4 max-w-md text-sm leading-6 text-black/48 sm:text-base">
            {currentStep.description}
          </p>

          <form
            action={formAction}
            className="mt-9"
            onKeyDown={(event) => {
              if (event.key === 'Enter' && step < 3) {
                event.preventDefault();
                goToNextStep();
              }
            }}
          >
            <div className={step === 1 ? 'space-y-6' : 'hidden'}>
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
                  className={cn(
                    'flex h-12 overflow-hidden rounded-xl border bg-white transition focus-within:ring-3',
                    availability.status === 'available'
                      ? 'border-emerald-300 focus-within:ring-emerald-100'
                      : availability.status === 'unavailable'
                        ? 'border-red-300 focus-within:ring-red-100'
                        : 'border-black/12 focus-within:border-[#3157ff] focus-within:ring-[#3157ff]/10',
                  )}
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
                    onChange={(event) =>
                      handleUsernameChange(event.target.value)
                    }
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
                  className={cn(
                    'block text-xs leading-5 font-normal',
                    availability.status === 'available'
                      ? 'text-emerald-700'
                      : availability.status === 'unavailable'
                        ? 'text-red-600'
                        : 'text-black/42',
                  )}
                  id="username-availability"
                >
                  {availability.message}
                </span>
              </label>
            </div>

            <div className={step === 2 ? 'space-y-7' : 'hidden'}>
              <fieldset>
                <legend className="text-sm font-bold">Your sports</legend>
                <p className="mt-1.5 text-xs leading-5 text-black/42">
                  Select between one and three. You can change this later.
                </p>
                <div className="mt-4">
                  <SportsSelector
                    maxSelections={3}
                    selectedSlugs={selectedSports}
                    sports={defaultSports}
                    onChange={(slugs, nextCustomSports) => {
                      setSelectedSports(slugs);
                      setCustomSports(nextCustomSports);
                    }}
                  />
                </div>
              </fieldset>

              <label className="block space-y-2.5 text-sm font-bold">
                What are you currently working toward?
                <input
                  className="h-12 w-full rounded-xl border border-black/12 bg-white px-4 font-normal transition outline-none placeholder:text-black/28 focus:border-[#3157ff] focus:ring-3 focus:ring-[#3157ff]/10"
                  maxLength={160}
                  name="objective"
                  onChange={(event) => setObjective(event.target.value)}
                  placeholder="For example: My first marathon"
                  value={objective}
                />
                <span className="block text-xs leading-5 font-normal text-black/42">
                  Optional — this becomes your first goal.
                </span>
              </label>
            </div>

            <div className={step === 3 ? 'space-y-4' : 'hidden'}>
              <input name="templateId" type="hidden" value={templateId} />
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {featuredTemplates.map((template) => {
                  const selected = template.id === templateId;

                  return (
                    <button
                      aria-pressed={selected}
                      className={cn(
                        'relative rounded-xl border p-2 text-left transition',
                        selected
                          ? 'border-[#3157ff] bg-[#3157ff]/[0.04] ring-2 ring-[#3157ff]/12'
                          : 'border-black/10 hover:border-black/25',
                      )}
                      key={template.id}
                      onClick={() => setTemplateId(template.id)}
                      type="button"
                    >
                      <TemplateThumbnail templateId={template.id} />
                      <span className="mt-2 flex items-center justify-between gap-2 px-1 pb-0.5 text-xs font-bold">
                        {template.name}
                        {selected ? (
                          <CheckCircleIcon
                            className="h-4 w-4 shrink-0 text-[#3157ff]"
                            weight="fill"
                          />
                        ) : null}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="text-xs leading-5 text-black/42">
                More styles and full customization are available in the editor.
              </p>
            </div>

            {state.message && !state.success ? (
              <div className="mt-6">
                <AuthFormMessage
                  message={state.message}
                  title="Unable to create your profile"
                  type="error"
                />
              </div>
            ) : null}

            <div className="mt-8 flex items-center gap-3">
              {step > 1 ? (
                <Button
                  className="h-12 rounded-xl px-4"
                  disabled={pending}
                  onClick={() => setStep((current) => current - 1)}
                  type="button"
                  variant="outline"
                >
                  <ArrowLeftIcon className="h-4 w-4" weight="bold" />
                  Back
                </Button>
              ) : null}

              {step < 3 ? (
                <Button
                  className="h-12 flex-1 rounded-xl bg-[#151515] text-white hover:bg-[#151515]/90"
                  disabled={
                    step === 1
                      ? !canContinueIdentity
                      : selectedSports.length === 0
                  }
                  key="onboarding-continue"
                  onClick={(event) => {
                    event.preventDefault();
                    goToNextStep();
                  }}
                  type="button"
                >
                  Continue
                  <ArrowRightIcon className="h-4 w-4" weight="bold" />
                </Button>
              ) : (
                <Button
                  className="h-12 flex-1 rounded-xl bg-[#151515] text-white hover:bg-[#151515]/90"
                  disabled={pending}
                  key="onboarding-submit"
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
              )}
            </div>
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
