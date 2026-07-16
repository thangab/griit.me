'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import {
  Activity,
  ArrowDown,
  ArrowUp,
  Blocks,
  CalendarDays,
  ChevronDown,
  Flag,
  Handshake,
  ImageIcon,
  Lock,
  Plus,
  Save,
  Share2,
  Target,
  Trash2,
  Trophy,
  UserRound,
  Video,
  X,
  type LucideIcon,
} from 'lucide-react';
import {
  saveProfileBuilderAction,
  type ProfileBuilderActionState,
} from '@/lib/actions/profile-builder';
import { Button } from '@/components/ui/button';
import { SocialPlatformIcon } from '@/components/profile/social-platform-icon';
import { socialPlatforms } from '@/lib/constants/social-platforms';
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
      <input name={`goalStatus${number}`} type="hidden" value="in_progress" />

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
            <span className="text-muted-foreground font-normal">Optional</span>
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

type ContentBlockType =
  'gallery' | 'achievements' | 'activities' | 'sponsors' | 'media';

type ActiveContentBlock = {
  key: string;
  type: ContentBlockType;
};

type PartnershipMode = 'sponsors' | 'seeking' | 'both';

const partnershipModes = [
  {
    value: 'sponsors' as const,
    label: 'I have sponsors',
    description: 'Show the partners already supporting you.',
  },
  {
    value: 'seeking' as const,
    label: "I'm open to partnerships",
    description: 'Let brands know you are available.',
  },
  {
    value: 'both' as const,
    label: 'Both',
    description: 'Show your sponsors and welcome new opportunities.',
  },
];

function SocialLinkFields({
  link,
  number,
  onRemove,
}: {
  link: ProfileBuilderState['socialLinks'][number] | undefined;
  number: number;
  onRemove: () => void;
}) {
  const initialPlatform = socialPlatforms.some(
    (platform) => platform.id === link?.platform,
  )
    ? (link?.platform ?? 'instagram')
    : 'website';
  const [platform, setPlatform] = useState(initialPlatform);
  const platformDefinition =
    socialPlatforms.find((item) => item.id === platform) ?? socialPlatforms[0];
  const valueLabel =
    platform === 'email'
      ? 'Email address'
      : platform === 'phone'
        ? 'Phone number'
        : 'Profile URL';
  const valueType =
    platform === 'email' ? 'email' : platform === 'phone' ? 'tel' : 'url';

  return (
    <div className="border-border bg-background overflow-hidden rounded-lg border">
      <div className="border-border bg-muted/30 flex items-center gap-3 border-b px-3 py-2.5">
        <SocialPlatformIcon platform={platform} />
        <span className="min-w-0 flex-1 text-sm font-semibold">
          {platformDefinition.label}
        </span>
        <button
          aria-label={`Remove ${platformDefinition.label}`}
          className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive flex h-7 w-7 items-center justify-center rounded-md transition-colors"
          type="button"
          onClick={onRemove}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="space-y-3 p-3">
        <label className="block space-y-1.5">
          <span className="text-xs font-medium">Network</span>
          <select
            className="border-border bg-background focus:border-primary h-10 w-full rounded-md border px-3 text-sm transition outline-none"
            name={`socialPlatform${number}`}
            value={platform}
            onChange={(event) => setPlatform(event.target.value)}
          >
            {socialPlatforms.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <Field
          label={valueLabel}
          name={`socialUrl${number}`}
          defaultValue={link?.url ?? ''}
          placeholder={platformDefinition.placeholder}
          type={valueType}
        />
        <Field
          label="Label (optional)"
          name={`socialLabel${number}`}
          defaultValue={link?.label ?? ''}
          placeholder="@username"
        />
      </div>
    </div>
  );
}

function SocialLinksEditor({
  links,
  onStructureChange,
}: {
  links: ProfileBuilderState['socialLinks'];
  onStructureChange: () => void;
}) {
  const [slots, setSlots] = useState(() => links.map((_, index) => index));

  return (
    <div className="space-y-3">
      {slots.map((slot) => (
        <SocialLinkFields
          key={slot}
          link={links[slot]}
          number={slot + 1}
          onRemove={() => {
            setSlots((current) => current.filter((item) => item !== slot));
            onStructureChange();
          }}
        />
      ))}

      {slots.length < socialPlatforms.length ? (
        <button
          className="border-primary/25 text-primary hover:bg-primary/5 flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-dashed text-sm font-semibold transition-colors"
          type="button"
          onClick={() => {
            const nextSlot = slots.length ? Math.max(...slots) + 1 : 0;
            setSlots((current) => [...current, nextSlot]);
            onStructureChange();
          }}
        >
          <Plus className="h-4 w-4" />
          Add social link
        </button>
      ) : null}
    </div>
  );
}

const availableContentBlocks = [
  {
    type: 'media' as const,
    label: 'Media',
    description: 'Embed a YouTube, Vimeo, or TikTok video.',
    icon: Video,
  },
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
  {
    type: 'sponsors' as const,
    label: 'Sponsors & partnerships',
    description: 'Show your sponsors or welcome brand opportunities.',
    icon: Handshake,
  },
];

function ContentBlocksEditor({
  builder,
  subscription,
  onStructureChange,
}: {
  builder: ProfileBuilderState;
  subscription: SubscriptionState;
  onStructureChange: () => void;
}) {
  const [showPicker, setShowPicker] = useState(false);
  const [pendingFocusKey, setPendingFocusKey] = useState<string | null>(null);
  const blockRefs = useRef(new Map<string, HTMLDetailsElement>());
  const sponsorBlock = builder.blocks.find(
    (block) => block.type === 'sponsors',
  );
  const savedPartnershipMode = sponsorBlock?.content.mode;
  const initialPartnershipMode: PartnershipMode =
    savedPartnershipMode === 'sponsors' ||
    savedPartnershipMode === 'seeking' ||
    savedPartnershipMode === 'both'
      ? savedPartnershipMode
      : 'seeking';
  const [partnershipMode, setPartnershipMode] = useState<PartnershipMode>(
    initialPartnershipMode,
  );
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
      {
        length: Math.max(
          1,
          subscription.isActive
            ? builder.achievements.length
            : Math.min(3, builder.achievements.length),
        ),
      },
      (_, index) => index,
    ),
  );
  const [sponsorSlots, setSponsorSlots] = useState(() =>
    Array.from(
      { length: Math.max(1, builder.sponsors.length) },
      (_, index) => index,
    ),
  );
  const mediaBlocks = builder.blocks.filter((block) => block.type === 'media');
  const [nextMediaSlot, setNextMediaSlot] = useState(
    Math.max(1, mediaBlocks.length + 1),
  );
  const [activeBlocks, setActiveBlocks] = useState<ActiveContentBlock[]>(() => {
    const blocksWithContent = new Set<ContentBlockType>();

    if (builder.galleryItems.length) blocksWithContent.add('gallery');
    if (builder.achievements.length) blocksWithContent.add('achievements');
    if (builder.activities.length) blocksWithContent.add('activities');
    if (builder.sponsors.length) blocksWithContent.add('sponsors');

    let mediaIndex = 0;
    const orderedBlocks: ActiveContentBlock[] = builder.blocks
      .filter((block) =>
        availableContentBlocks.some((item) => item.type === block.type),
      )
      .filter(
        (block) =>
          blocksWithContent.has(block.type as ContentBlockType) ||
          block.content.builderManaged === true,
      )
      .map((block) => {
        const type = block.type as ContentBlockType;

        if (type === 'media') {
          mediaIndex += 1;
          return { key: `media-${mediaIndex}`, type };
        }

        return { key: type, type };
      });

    blocksWithContent.forEach((type) => {
      if (!orderedBlocks.some((block) => block.type === type)) {
        orderedBlocks.push({ key: type, type });
      }
    });

    return orderedBlocks;
  });
  const activity = builder.activities[0];
  const galleryItems = builder.galleryItems;
  const choices = availableContentBlocks.filter(
    (block) =>
      block.type === 'media' ||
      !activeBlocks.some((active) => active.type === block.type),
  );

  useEffect(() => {
    if (!pendingFocusKey) return;

    const block = blockRefs.current.get(pendingFocusKey);
    if (!block) return;

    block.open = true;
    block.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    const frame = window.requestAnimationFrame(() => {
      block.querySelector<HTMLElement>('input, textarea, select')?.focus();
      setPendingFocusKey(null);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [activeBlocks, pendingFocusKey]);

  const moveBlock = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;

    if (targetIndex < 0 || targetIndex >= activeBlocks.length) return;

    setActiveBlocks((current) => {
      const next = [...current];
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return next;
    });
    onStructureChange();
  };

  return (
    <div className="space-y-3">
      <div className="border-border bg-card overflow-hidden rounded-xl border">
        <div className="flex items-center gap-3 p-3">
          <span className="bg-muted text-muted-foreground flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
            <Blocks className="h-4 w-4" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold">Blocks</span>
            <span className="text-muted-foreground block truncate text-xs">
              Gallery, achievements, activities and sponsors
            </span>
          </span>
          <button
            className="bg-primary text-primary-foreground hover:bg-primary/90 flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition-colors disabled:cursor-default disabled:opacity-50"
            disabled={!choices.length}
            type="button"
            onClick={() => setShowPicker(true)}
          >
            <Plus className="h-3.5 w-3.5" />
            {choices.length ? 'Add' : 'Full'}
          </button>
        </div>

        {activeBlocks.length ? (
          <div className="border-border space-y-2 border-t p-3">
            {activeBlocks.map((block) => (
              <input
                key={`order-${block.key}`}
                name="contentBlockOrder"
                type="hidden"
                value={block.key}
              />
            ))}

            {activeBlocks.map((activeBlock, blockIndex) => {
              const { key, type } = activeBlock;
              const definition = availableContentBlocks.find(
                (block) => block.type === type,
              );
              const Icon = definition?.icon ?? Blocks;

              return (
                <details
                  key={key}
                  ref={(element) => {
                    if (element) {
                      blockRefs.current.set(key, element);
                    } else {
                      blockRefs.current.delete(key);
                    }
                  }}
                  className="border-border bg-background group/block overflow-hidden rounded-lg border"
                  open={blockIndex === 0}
                >
                  <summary className="bg-muted/30 hover:bg-muted/50 flex cursor-pointer list-none items-center gap-2 px-3 py-2.5 transition-colors [&::-webkit-details-marker]:hidden">
                    <Icon className="text-muted-foreground h-4 w-4" />
                    <span className="min-w-0 flex-1 text-sm font-semibold">
                      {definition?.label}
                    </span>
                    <button
                      aria-label={`Move ${definition?.label} up`}
                      className="text-muted-foreground hover:bg-background flex h-7 w-7 items-center justify-center rounded-md disabled:opacity-30"
                      disabled={blockIndex === 0}
                      type="button"
                      onClick={(event) => {
                        event.preventDefault();
                        moveBlock(blockIndex, -1);
                      }}
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      aria-label={`Move ${definition?.label} down`}
                      className="text-muted-foreground hover:bg-background flex h-7 w-7 items-center justify-center rounded-md disabled:opacity-30"
                      disabled={blockIndex === activeBlocks.length - 1}
                      type="button"
                      onClick={(event) => {
                        event.preventDefault();
                        moveBlock(blockIndex, 1);
                      }}
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                    <button
                      aria-label={`Remove ${definition?.label}`}
                      className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive flex h-7 w-7 items-center justify-center rounded-md transition-colors"
                      type="button"
                      onClick={(event) => {
                        event.preventDefault();
                        setActiveBlocks((current) =>
                          current.filter((block) => block.key !== key),
                        );
                        onStructureChange();
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                    <ChevronDown className="text-muted-foreground h-4 w-4 transition-transform group-open/block:rotate-180" />
                  </summary>

                  <div className="border-border space-y-3 border-t p-3">
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
                                  onClick={() => {
                                    setImageSlots((current) =>
                                      current.filter((item) => item !== slot),
                                    );
                                    onStructureChange();
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
                              setImageSlots((current) => [
                                ...current,
                                nextSlot,
                              ]);
                              onStructureChange();
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
                                    onClick={() => {
                                      setAchievementSlots((current) =>
                                        current.filter((item) => item !== slot),
                                      );
                                      onStructureChange();
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
                        {achievementSlots.length < 3 ||
                        (subscription.isActive &&
                          achievementSlots.length < 50) ? (
                          <button
                            className="border-border text-muted-foreground hover:border-primary/40 hover:text-primary flex h-9 w-full items-center justify-center gap-2 rounded-md border border-dashed text-xs font-semibold transition-colors"
                            type="button"
                            onClick={() => {
                              const nextSlot = achievementSlots.length
                                ? Math.max(...achievementSlots) + 1
                                : 0;
                              setAchievementSlots((current) => [
                                ...current,
                                nextSlot,
                              ]);
                              onStructureChange();
                            }}
                          >
                            <Plus className="h-3.5 w-3.5" />
                            Add achievement
                          </button>
                        ) : !subscription.isActive ? (
                          <Link
                            className="border-border bg-muted/40 hover:border-primary/40 flex h-10 items-center justify-between gap-3 rounded-md border px-3 transition-colors"
                            href="/dashboard/settings"
                          >
                            <span className="flex items-center gap-2 text-xs font-semibold">
                              <Plus className="h-3.5 w-3.5" />
                              Add more achievements
                            </span>
                            <span className="bg-primary/10 text-primary flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold">
                              <Lock className="h-3 w-3" />
                              Pro
                            </span>
                          </Link>
                        ) : null}
                      </>
                    ) : type === 'sponsors' ? (
                      <>
                        <div className="space-y-2">
                          <div>
                            <p className="text-xs font-semibold">
                              Partnership status
                            </p>
                            <p className="text-muted-foreground mt-1 text-xs leading-5">
                              Choose what brands and visitors should see.
                            </p>
                          </div>
                          <div className="grid gap-2">
                            {partnershipModes.map((mode) => {
                              const isSelected = partnershipMode === mode.value;

                              return (
                                <label
                                  key={mode.value}
                                  className={`cursor-pointer rounded-lg border p-3 transition-colors ${
                                    isSelected
                                      ? 'border-primary bg-primary/5'
                                      : 'border-border hover:bg-muted/40'
                                  }`}
                                >
                                  <span className="flex items-start gap-3">
                                    <input
                                      className="accent-primary mt-0.5 h-4 w-4"
                                      checked={isSelected}
                                      name="partnershipMode"
                                      type="radio"
                                      value={mode.value}
                                      onChange={() =>
                                        setPartnershipMode(mode.value)
                                      }
                                    />
                                    <span>
                                      <span className="block text-xs font-semibold">
                                        {mode.label}
                                      </span>
                                      <span className="text-muted-foreground mt-1 block text-xs leading-5">
                                        {mode.description}
                                      </span>
                                    </span>
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                        </div>

                        <div
                          className={`space-y-3 border-t pt-3 ${
                            partnershipMode === 'seeking' ? 'hidden' : ''
                          }`}
                        >
                          <div>
                            <p className="text-xs font-semibold">
                              Current sponsors
                            </p>
                            <p className="text-muted-foreground mt-1 text-xs leading-5">
                              Add a logo and an optional link for each partner.
                            </p>
                          </div>
                          {sponsorSlots.map((slot, position) => {
                            const sponsor = builder.sponsors[slot];
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
                                    Sponsor {position + 1}
                                  </p>
                                  {sponsorSlots.length > 1 ? (
                                    <button
                                      aria-label={`Remove sponsor ${position + 1}`}
                                      className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive flex h-7 w-7 items-center justify-center rounded-md transition-colors"
                                      type="button"
                                      onClick={() => {
                                        setSponsorSlots((current) =>
                                          current.filter(
                                            (item) => item !== slot,
                                          ),
                                        );
                                        onStructureChange();
                                      }}
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  ) : null}
                                </div>
                                <Field
                                  label="Sponsor name"
                                  name={`sponsorName${number}`}
                                  defaultValue={sponsor?.name ?? ''}
                                  placeholder="Garmin"
                                />
                                <Field
                                  label="Logo URL"
                                  name={`sponsorLogoUrl${number}`}
                                  defaultValue={sponsor?.logoUrl ?? ''}
                                  placeholder="https://..."
                                  type="url"
                                />
                                <Field
                                  label="Website URL"
                                  name={`sponsorWebsiteUrl${number}`}
                                  defaultValue={sponsor?.websiteUrl ?? ''}
                                  placeholder="https://..."
                                  type="url"
                                />
                              </div>
                            );
                          })}
                          {sponsorSlots.length < 20 ? (
                            <button
                              className="border-border text-muted-foreground hover:border-primary/40 hover:text-primary flex h-9 w-full items-center justify-center gap-2 rounded-md border border-dashed text-xs font-semibold transition-colors"
                              type="button"
                              onClick={() => {
                                const nextSlot = sponsorSlots.length
                                  ? Math.max(...sponsorSlots) + 1
                                  : 0;
                                setSponsorSlots((current) => [
                                  ...current,
                                  nextSlot,
                                ]);
                                onStructureChange();
                              }}
                            >
                              <Plus className="h-3.5 w-3.5" />
                              Add sponsor
                            </button>
                          ) : null}
                        </div>

                        <div
                          className={`space-y-3 border-t pt-3 ${
                            partnershipMode === 'sponsors' ? 'hidden' : ''
                          }`}
                        >
                          <div>
                            <p className="text-xs font-semibold">
                              Partnership callout
                            </p>
                            <p className="text-muted-foreground mt-1 text-xs leading-5">
                              Turn profile visitors into real opportunities.
                            </p>
                          </div>
                          <Field
                            label="Headline"
                            name="partnershipHeadline"
                            defaultValue={
                              typeof sponsorBlock?.content.headline === 'string'
                                ? sponsorBlock.content.headline
                                : 'Open to partnerships'
                            }
                            placeholder="Open to partnerships"
                          />
                          <TextareaField
                            label="Description"
                            name="partnershipDescription"
                            defaultValue={
                              typeof sponsorBlock?.content.description ===
                              'string'
                                ? sponsorBlock.content.description
                                : ''
                            }
                            placeholder="Available for brand collaborations, events and ambassador opportunities."
                          />
                          <Field
                            label="Contact email or URL"
                            name="partnershipContact"
                            defaultValue={
                              typeof sponsorBlock?.content.contact === 'string'
                                ? sponsorBlock.content.contact
                                : ''
                            }
                            placeholder="hello@example.com"
                          />
                          <Field
                            label="Button label"
                            name="partnershipCtaLabel"
                            defaultValue={
                              typeof sponsorBlock?.content.ctaLabel === 'string'
                                ? sponsorBlock.content.ctaLabel
                                : "Let's work together"
                            }
                            placeholder="Let's work together"
                          />
                        </div>
                      </>
                    ) : type === 'media' ? (
                      <>
                        <Field
                          label="Video URL"
                          name={`mediaUrl${key.replace('media-', '')}`}
                          defaultValue={
                            typeof mediaBlocks[
                              Number(key.replace('media-', '')) - 1
                            ]?.content.sourceUrl === 'string'
                              ? (mediaBlocks[
                                  Number(key.replace('media-', '')) - 1
                                ].content.sourceUrl as string)
                              : ''
                          }
                          placeholder="https://youtube.com/watch?v=..."
                          type="url"
                        />
                        <TextareaField
                          label="Caption (optional)"
                          name={`mediaCaption${key.replace('media-', '')}`}
                          defaultValue={
                            typeof mediaBlocks[
                              Number(key.replace('media-', '')) - 1
                            ]?.content.caption === 'string'
                              ? (mediaBlocks[
                                  Number(key.replace('media-', '')) - 1
                                ].content.caption as string)
                              : ''
                          }
                          placeholder="Add context about this video."
                        />
                        <p className="text-muted-foreground text-xs leading-5">
                          Supports YouTube, Vimeo, and TikTok video links.
                        </p>
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
                </details>
              );
            })}
          </div>
        ) : (
          <div className="border-border text-muted-foreground border-t px-4 py-5 text-center text-xs">
            No blocks added yet.
          </div>
        )}
      </div>

      {showPicker && choices.length && typeof document !== 'undefined'
        ? createPortal(
            <div className="fixed inset-0 z-[70]">
              <button
                aria-label="Close block picker"
                className="absolute inset-0 bg-slate-950/35 backdrop-blur-[1px]"
                type="button"
                onClick={() => setShowPicker(false)}
              />
              <aside className="border-border bg-background absolute inset-y-0 left-0 w-full max-w-sm overflow-y-auto border-r p-5 shadow-2xl">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold">Add a block</p>
                    <p className="text-muted-foreground mt-1 text-sm">
                      Choose what you want to add to your profile.
                    </p>
                  </div>
                  <button
                    aria-label="Close"
                    className="text-muted-foreground hover:bg-muted flex h-9 w-9 items-center justify-center rounded-lg"
                    type="button"
                    onClick={() => setShowPicker(false)}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-6 space-y-2">
                  {choices.map((block) => {
                    const Icon = block.icon;

                    return (
                      <button
                        key={block.type}
                        className="border-border hover:border-primary/40 hover:bg-muted/40 flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-colors"
                        type="button"
                        onClick={() => {
                          if (block.type === 'media') {
                            const slot = nextMediaSlot;
                            const key = `media-${slot}`;
                            setActiveBlocks((current) => [
                              ...current,
                              { key, type: 'media' },
                            ]);
                            setNextMediaSlot(slot + 1);
                            setPendingFocusKey(key);
                          } else {
                            setActiveBlocks((current) => [
                              ...current,
                              { key: block.type, type: block.type },
                            ]);
                            setPendingFocusKey(block.type);
                          }
                          setShowPicker(false);
                          onStructureChange();
                        }}
                      >
                        <span className="bg-muted text-muted-foreground flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                          <Icon className="h-4 w-4" />
                        </span>
                        <span>
                          <span className="block text-sm font-semibold">
                            {block.label}
                          </span>
                          <span className="text-muted-foreground mt-1 block text-xs leading-5">
                            {block.description}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </aside>
            </div>,
            document.body,
          )
        : null}
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
  const goals = builder.goals.slice(0, 3);
  const [goalCount, setGoalCount] = useState(() =>
    subscription.isActive ? Math.max(1, goals.length) : 1,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const schedulePreviewUpdate = () => {
    window.requestAnimationFrame(() => {
      if (formRef.current) {
        onPreviewChange?.(formRef.current);
      }
    });
  };

  return (
    <form
      action={formAction}
      className="space-y-4"
      onChange={(event) => onPreviewChange?.(event.currentTarget)}
      ref={formRef}
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
        description={
          goalCount > 1
            ? `${goalCount} active objectives`
            : 'Your next objective'
        }
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
              onClick={() =>
                setGoalCount((current) => Math.min(3, current + 1))
              }
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
        title="Social links"
        description="Connect your main social profiles"
        icon={Share2}
      >
        <SocialLinksEditor
          links={builder.socialLinks}
          onStructureChange={schedulePreviewUpdate}
        />
      </EditorSection>

      <ContentBlocksEditor
        builder={builder}
        subscription={subscription}
        onStructureChange={schedulePreviewUpdate}
      />
    </form>
  );
}
