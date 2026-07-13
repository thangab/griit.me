'use client';

import { useActionState, useState } from 'react';
import Link from 'next/link';
import {
  Activity,
  Blocks,
  CalendarDays,
  ChevronDown,
  Flag,
  ImageIcon,
  Lock,
  Plus,
  Save,
  Share2,
  Target,
  Trash2,
  Trophy,
  UserRound,
  type LucideIcon,
} from 'lucide-react';
import {
  saveProfileBuilderAction,
  type ProfileBuilderActionState,
} from '@/lib/actions/profile-builder';
import { Button } from '@/components/ui/button';
import type { ProfileBuilderState } from '@/lib/types/profile-builder';
import type { SubscriptionState } from '@/lib/types/billing';

const initialState: ProfileBuilderActionState = {
  success: false,
  message: '',
};

function EditorSection({
  title,
  description,
  icon: Icon,
  defaultOpen = false,
  children,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  return (
    <details
      className="border-border bg-card group overflow-hidden rounded-xl border"
      open={defaultOpen}
    >
      <summary className="hover:bg-muted/60 flex cursor-pointer list-none items-center gap-3 p-3 transition-colors [&::-webkit-details-marker]:hidden">
        <span className="bg-muted text-muted-foreground flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
          <Icon className="h-4 w-4" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold">{title}</span>
          <span className="text-muted-foreground block truncate text-xs">
            {description}
          </span>
        </span>
        <ChevronDown className="text-muted-foreground h-4 w-4 shrink-0 transition-transform group-open:rotate-180" />
      </summary>
      <div className="border-border space-y-3 border-t p-3">{children}</div>
    </details>
  );
}

function Field({
  label,
  name,
  defaultValue,
  placeholder,
  type = 'text',
}: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="space-y-1.5">
      <span className="text-xs font-medium">{label}</span>
      <input
        className="border-border bg-background focus:border-primary h-10 w-full rounded-md border px-3 text-sm transition outline-none"
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
      />
    </label>
  );
}

function TextareaField({
  label,
  name,
  defaultValue,
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
}) {
  return (
    <label className="space-y-1.5">
      <span className="text-xs font-medium">{label}</span>
      <textarea
        className="border-border bg-background focus:border-primary min-h-20 w-full resize-none rounded-md border px-3 py-2 text-sm transition outline-none"
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
      />
    </label>
  );
}

function GoalEditor({
  goal,
  number,
}: {
  goal: ProfileBuilderState['goals'][number] | undefined;
  number: number;
}) {
  return (
    <div className="space-y-5">
      <input
        name={`goalStatus${number}`}
        type="hidden"
        value="in_progress"
      />

      <label className="block space-y-2">
        <span className="flex items-center gap-2">
          <span className="bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold">
            {number}
          </span>
          <span className="text-sm font-semibold">What are you chasing?</span>
        </span>
        <input
          className="border-border bg-background focus:border-primary h-12 w-full rounded-lg border px-3.5 text-base font-semibold transition outline-none placeholder:font-normal"
          name={`goalTitle${number}`}
          defaultValue={goal?.title ?? ''}
          placeholder="Run 10K under 40 minutes"
        />
        <span className="text-muted-foreground block text-xs">
          Make it specific, measurable, and easy to remember.
        </span>
      </label>

      <label className="block space-y-2">
        <span className="flex items-center gap-2 text-xs font-semibold">
          <Flag className="text-muted-foreground h-3.5 w-3.5" />
          Your motivation
        </span>
        <textarea
          className="border-border bg-background focus:border-primary min-h-24 w-full resize-none rounded-lg border px-3.5 py-3 text-sm leading-6 transition outline-none"
          name={`goalDescription${number}`}
          defaultValue={goal?.description ?? ''}
          placeholder="Why does this goal matter to you?"
        />
      </label>

      <div className="border-border bg-muted/25 rounded-lg border p-3">
        <label className="block space-y-2">
          <span className="flex items-center gap-2 text-xs font-semibold">
            <CalendarDays className="text-muted-foreground h-3.5 w-3.5" />
            Target date
            <span className="text-muted-foreground font-normal">
              Optional
            </span>
          </span>
          <input
            className="border-border bg-background focus:border-primary h-10 w-full rounded-md border px-3 text-sm transition outline-none"
            name={`goalTargetAt${number}`}
            defaultValue={goal?.targetDate ?? ''}
            type="date"
          />
        </label>
      </div>
    </div>
  );
}

function SportsField({
  availableSports,
  selectedSlugs,
}: {
  availableSports: ProfileBuilderState['availableSports'];
  selectedSlugs: string[];
}) {
  const [selected, setSelected] = useState(() => new Set(selectedSlugs));
  const selectedSports = availableSports.filter((sport) =>
    selected.has(sport.slug),
  );

  function toggleSport(slug: string) {
    setSelected((current) => {
      const next = new Set(current);

      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }

      return next;
    });
  }

  return (
    <div className="space-y-1.5">
      <p className="text-xs font-medium">Sports</p>
      <details className="border-border bg-background group/sports overflow-hidden rounded-lg border">
        <summary className="hover:bg-muted/50 flex min-h-11 cursor-pointer list-none items-center gap-2 px-3 py-2 transition-colors [&::-webkit-details-marker]:hidden">
          <span className="flex min-w-0 flex-1 flex-wrap gap-1.5">
            {selectedSports.length ? (
              <>
                {selectedSports.slice(0, 2).map((sport) => (
                  <span
                    key={sport.slug}
                    className="bg-primary/10 text-primary rounded-full px-2.5 py-1 text-xs font-medium"
                  >
                    {sport.name}
                  </span>
                ))}
                {selectedSports.length > 2 ? (
                  <span className="bg-muted text-muted-foreground rounded-full px-2.5 py-1 text-xs font-medium">
                    +{selectedSports.length - 2}
                  </span>
                ) : null}
              </>
            ) : (
              <span className="text-muted-foreground text-sm">
                Choose your sports
              </span>
            )}
          </span>
          <ChevronDown className="text-muted-foreground h-4 w-4 shrink-0 transition-transform group-open/sports:rotate-180" />
        </summary>

        <div className="border-border bg-muted/20 grid grid-cols-2 gap-1.5 border-t p-2">
          {availableSports.map((sport) => {
            const isSelected = selected.has(sport.slug);

            return (
              <label
                key={sport.slug}
                className={`flex min-h-9 cursor-pointer items-center gap-2 rounded-md px-2.5 text-sm transition-colors ${
                  isSelected
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'hover:bg-background text-foreground'
                }`}
              >
                <input
                  className="accent-primary h-3.5 w-3.5"
                  checked={isSelected}
                  name="sportSlugs"
                  onChange={() => toggleSport(sport.slug)}
                  type="checkbox"
                  value={sport.slug}
                />
                <span className="truncate">{sport.name}</span>
              </label>
            );
          })}
        </div>
      </details>
    </div>
  );
}

type ContentBlockType = 'gallery' | 'achievements' | 'activities';

const availableContentBlocks = [
  {
    type: 'gallery' as const,
    label: 'Image gallery',
    description: 'Show your best training and competition moments.',
    icon: ImageIcon,
  },
  {
    type: 'achievements' as const,
    label: 'Achievements',
    description: 'Highlight a result, record, or milestone.',
    icon: Trophy,
  },
  {
    type: 'activities' as const,
    label: 'Activities',
    description: 'Share a recent workout or sporting activity.',
    icon: Activity,
  },
];

function ContentBlocksEditor({
  builder,
  subscription,
}: {
  builder: ProfileBuilderState;
  subscription: SubscriptionState;
}) {
  const [showPicker, setShowPicker] = useState(false);
  const [imageSlots, setImageSlots] = useState(() =>
    Array.from(
      {
        length: Math.max(
          1,
          subscription.isActive
            ? builder.galleryItems.length
            : Math.min(3, builder.galleryItems.length),
        ),
      },
      (_, index) => index,
    ),
  );
  const [achievementSlots, setAchievementSlots] = useState(() =>
    Array.from(
      { length: Math.max(1, Math.min(3, builder.achievements.length)) },
      (_, index) => index,
    ),
  );
  const [activeBlocks, setActiveBlocks] = useState<ContentBlockType[]>(() => {
    const blocks: ContentBlockType[] = [];

    if (builder.galleryItems.length) blocks.push('gallery');
    if (builder.achievements.length) blocks.push('achievements');
    if (builder.activities.length) blocks.push('activities');

    return blocks;
  });
  const activity = builder.activities[0];
  const galleryItems = builder.galleryItems;
  const choices = availableContentBlocks.filter(
    (block) => !activeBlocks.includes(block.type),
  );
  const notifyFormChange = (button: HTMLButtonElement) => {
    const form = button.form;

    window.setTimeout(() => {
      form?.dispatchEvent(new Event('change', { bubbles: true }));
    });
  };

  return (
    <div className="space-y-3">
      {activeBlocks.map((type) => {
        const definition = availableContentBlocks.find(
          (block) => block.type === type,
        );
        const Icon = definition?.icon ?? Blocks;

        return (
          <div
            key={type}
            className="border-border bg-background overflow-hidden rounded-lg border"
          >
            <div className="border-border bg-muted/30 flex items-center gap-3 border-b px-3 py-2.5">
              <Icon className="text-muted-foreground h-4 w-4" />
              <span className="min-w-0 flex-1 text-sm font-semibold">
                {definition?.label}
              </span>
              <button
                aria-label={`Remove ${definition?.label}`}
                className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive flex h-7 w-7 items-center justify-center rounded-md transition-colors"
                type="button"
                onClick={(event) => {
                  setActiveBlocks((current) =>
                    current.filter((block) => block !== type),
                  );
                  notifyFormChange(event.currentTarget);
                }}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="space-y-3 p-3">
              {type === 'gallery' ? (
                <>
                  {imageSlots.map((slot, position) => (
                    <div
                      key={slot}
                      className={
                        position > 0
                          ? 'border-border space-y-2 border-t pt-3'
                          : 'space-y-2'
                      }
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-xs font-semibold">
                          Image {position + 1}
                        </p>
                        {imageSlots.length > 1 ? (
                          <button
                            aria-label={`Remove image ${position + 1}`}
                            className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive flex h-7 w-7 items-center justify-center rounded-md transition-colors"
                            type="button"
                            onClick={(event) => {
                              setImageSlots((current) =>
                                current.filter((item) => item !== slot),
                              );
                              notifyFormChange(event.currentTarget);
                            }}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        ) : null}
                      </div>
                      <Field
                        label="Image URL"
                        name={`galleryUrl${slot + 1}`}
                        defaultValue={galleryItems[slot]?.imageUrl ?? ''}
                        placeholder="https://..."
                        type="url"
                      />
                    </div>
                  ))}
                  {imageSlots.length < 3 || subscription.isActive ? (
                    <button
                      className="border-border text-muted-foreground hover:border-primary/40 hover:text-primary flex h-9 w-full items-center justify-center gap-2 rounded-md border border-dashed text-xs font-semibold transition-colors"
                      type="button"
                      onClick={() => {
                        const nextSlot =
                          imageSlots.length > 0
                            ? Math.max(...imageSlots) + 1
                            : 0;
                        setImageSlots((current) => [...current, nextSlot]);
                      }}
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add image
                    </button>
                  ) : (
                    <Link
                      className="border-border bg-muted/40 hover:border-primary/40 flex h-10 items-center justify-between gap-3 rounded-md border px-3 transition-colors"
                      href="/dashboard/settings"
                    >
                      <span className="flex items-center gap-2 text-xs font-semibold">
                        <Plus className="h-3.5 w-3.5" />
                        Add more images
                      </span>
                      <span className="bg-primary/10 text-primary flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold">
                        <Lock className="h-3 w-3" />
                        Pro
                      </span>
                    </Link>
                  )}
                </>
              ) : type === 'achievements' ? (
                <>
                  {achievementSlots.map((slot, position) => {
                    const achievement = builder.achievements[slot];
                    const number = slot + 1;

                    return (
                      <div
                        key={slot}
                        className={
                          position > 0
                            ? 'border-border space-y-3 border-t pt-3'
                            : 'space-y-3'
                        }
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-xs font-semibold">
                            Achievement {position + 1}
                          </p>
                          {achievementSlots.length > 1 ? (
                            <button
                              aria-label={`Remove achievement ${position + 1}`}
                              className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive flex h-7 w-7 items-center justify-center rounded-md transition-colors"
                              type="button"
                              onClick={(event) => {
                                setAchievementSlots((current) =>
                                  current.filter((item) => item !== slot),
                                );
                                notifyFormChange(event.currentTarget);
                              }}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          ) : null}
                        </div>
                        <Field
                          label="Title"
                          name={`achievementTitle${number}`}
                          defaultValue={achievement?.title ?? ''}
                          placeholder="Bangkok Marathon finisher"
                        />
                        <TextareaField
                          label="Description"
                          name={`achievementDescription${number}`}
                          defaultValue={achievement?.description ?? ''}
                          placeholder="Tell people what this milestone means to you."
                        />
                        <Field
                          label="Date"
                          name={`achievementDate${number}`}
                          defaultValue={achievement?.date ?? ''}
                          type="date"
                        />
                      </div>
                    );
                  })}
                  {achievementSlots.length < 3 ? (
                    <button
                      className="border-border text-muted-foreground hover:border-primary/40 hover:text-primary flex h-9 w-full items-center justify-center gap-2 rounded-md border border-dashed text-xs font-semibold transition-colors"
                      type="button"
                      onClick={() => {
                        const nextSlot = [0, 1, 2].find(
                          (slot) => !achievementSlots.includes(slot),
                        );

                        if (nextSlot !== undefined) {
                          setAchievementSlots((current) => [
                            ...current,
                            nextSlot,
                          ]);
                        }
                      }}
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add achievement
                    </button>
                  ) : null}
                </>
              ) : (
                <>
                  <Field
                    label="Activity"
                    name="activityTitle1"
                    defaultValue={activity?.title ?? ''}
                    placeholder="Sunday long run"
                  />
                  <Field
                    label="Activity type"
                    name="activityType1"
                    defaultValue={activity?.description ?? ''}
                    placeholder="Running"
                  />
                  <Field
                    label="Date"
                    name="activityDate1"
                    defaultValue={activity?.date ?? ''}
                    type="date"
                  />
                </>
              )}
            </div>
          </div>
        );
      })}

      {showPicker && choices.length ? (
        <div className="border-border bg-muted/25 space-y-1.5 rounded-lg border p-2">
          {choices.map((block) => {
            const Icon = block.icon;

            return (
              <button
                key={block.type}
                className="hover:bg-background flex w-full items-start gap-3 rounded-md p-2.5 text-left transition-colors"
                type="button"
                onClick={(event) => {
                  setActiveBlocks((current) => [...current, block.type]);
                  setShowPicker(false);
                  notifyFormChange(event.currentTarget);
                }}
              >
                <span className="bg-background border-border flex h-8 w-8 shrink-0 items-center justify-center rounded-md border">
                  <Icon className="h-4 w-4" />
                </span>
                <span>
                  <span className="block text-sm font-semibold">
                    {block.label}
                  </span>
                  <span className="text-muted-foreground mt-0.5 block text-xs leading-5">
                    {block.description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      ) : null}

      {choices.length ? (
        <button
          className="border-primary/25 text-primary hover:bg-primary/5 flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-dashed text-sm font-semibold transition-colors"
          type="button"
          onClick={() => setShowPicker((current) => !current)}
        >
          <Plus className="h-4 w-4" />
          Add block
        </button>
      ) : null}
    </div>
  );
}

export function ContentEditor({
  builder,
  subscription,
  onPreviewChange,
}: {
  builder: ProfileBuilderState;
  subscription: SubscriptionState;
  onPreviewChange?: (form: HTMLFormElement) => void;
}) {
  const [state, formAction, pending] = useActionState(
    saveProfileBuilderAction,
    initialState,
  );
  const profile = builder.profile;
  const primarySocial = builder.socialLinks[0];
  const goals = builder.goals.slice(0, 3);
  const [goalCount, setGoalCount] = useState(() =>
    subscription.isActive ? Math.max(1, goals.length) : 1,
  );

  return (
    <form
      action={formAction}
      className="space-y-4"
      onChange={(event) => onPreviewChange?.(event.currentTarget)}
    >
      <input
        name="isPublished"
        type="hidden"
        value={profile.isPublished ? 'on' : ''}
      />
      <input name="coverUrl" type="hidden" value={profile.coverUrl} />
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-muted-foreground text-xs tracking-[0.24em] uppercase">
            Content
          </p>
          <p className="mt-2 font-semibold">Profile details</p>
        </div>
        <Button size="sm" type="submit" disabled={pending}>
          <Save className="h-4 w-4" />
          {pending ? 'Saving' : 'Save'}
        </Button>
      </div>

      {state.message ? (
        <p
          className={`rounded-md px-3 py-2 text-sm ${
            state.success
              ? 'bg-emerald-50 text-emerald-900'
              : 'bg-red-50 text-red-900'
          }`}
        >
          {state.message}
        </p>
      ) : null}

      <EditorSection
        title="Athlete identity"
        description="Avatar, name, bio and sports"
        icon={UserRound}
        defaultOpen
      >
        <Field
          label="Profile picture URL"
          name="avatarUrl"
          defaultValue={profile.avatarUrl}
          placeholder="https://..."
          type="url"
        />
        <Field
          label="Display name"
          name="displayName"
          defaultValue={profile.displayName}
          placeholder="Thang"
        />
        <TextareaField
          label="Bio"
          name="bio"
          defaultValue={profile.bio}
          placeholder="Tell the story in a few lines."
        />
        <SportsField
          availableSports={builder.availableSports}
          selectedSlugs={profile.sportSlugs}
        />
      </EditorSection>

      <EditorSection
        title="Goal"
        description={goalCount > 1 ? `${goalCount} active objectives` : 'Your next objective'}
        icon={Target}
      >
        {Array.from({ length: goalCount }, (_, index) => (
          <div
            key={index}
            className={index > 0 ? 'border-border border-t pt-5' : undefined}
          >
            <GoalEditor goal={goals[index]} number={index + 1} />
          </div>
        ))}

        {subscription.isActive ? (
          goalCount < 3 ? (
            <button
              className="border-primary/25 text-primary hover:bg-primary/5 flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-dashed text-sm font-semibold transition-colors"
              type="button"
              onClick={() => setGoalCount((current) => Math.min(3, current + 1))}
            >
              <Plus className="h-4 w-4" />
              Add another goal
            </button>
          ) : (
            <p className="text-muted-foreground text-center text-xs">
              You reached the limit of 3 active goals.
            </p>
          )
        ) : (
          <Link
            className="border-border bg-muted/40 hover:border-primary/40 flex items-center justify-between gap-3 rounded-lg border p-3 transition-colors"
            href="/dashboard/settings"
          >
            <span className="flex min-w-0 items-center gap-2 text-sm font-semibold">
              <Plus className="h-4 w-4" />
              Add more goals
            </span>
            <span className="bg-primary/10 text-primary flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold">
              <Lock className="h-3 w-3" />
              Pro
            </span>
          </Link>
        )}
      </EditorSection>

      <EditorSection
        title="Social link"
        description="Connect your main account"
        icon={Share2}
      >
        <Field
          label="Platform"
          name="socialPlatform"
          defaultValue={primarySocial?.platform ?? 'instagram'}
          placeholder="instagram"
        />
        <Field
          label="Label"
          name="socialLabel"
          defaultValue={primarySocial?.label ?? ''}
          placeholder="@gumhy"
        />
        <Field
          label="URL"
          name="socialUrl"
          defaultValue={primarySocial?.url ?? ''}
          placeholder="https://instagram.com/gumhy"
          type="url"
        />
      </EditorSection>

      <EditorSection
        title="Blocks"
        description="Gallery, achievements and activities"
        icon={Blocks}
      >
        <ContentBlocksEditor
          builder={builder}
          subscription={subscription}
        />
      </EditorSection>
    </form>
  );
}
