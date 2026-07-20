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
  Link2,
  Loader2,
  Lock,
  Plus,
  Share2,
  ShoppingBag,
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
import { ImageUploadField } from '@/components/dashboard/image-upload-field';
import { SocialPlatformIcon } from '@/components/profile/social-platform-icon';
import { socialPlatforms } from '@/lib/constants/social-platforms';
import type { ProfileBuilderState } from '@/lib/types/profile-builder';
import type { SubscriptionState } from '@/lib/types/billing';
import { cn } from '@/lib/utils/cn';

const initialState: ProfileBuilderActionState = {
  success: false,
  message: '',
};

const goalDateDisplayOptions = [
  { value: 'date', label: 'Date' },
  { value: 'countdown', label: 'Countdown' },
] as const;

export type AutosaveStatus = 'idle' | 'waiting' | 'saving' | 'saved' | 'error';

type ContentSaveSection =
  | 'profile'
  | 'sports'
  | 'goals'
  | 'socials'
  | 'blocks'
  | 'gallery'
  | 'sponsors'
  | 'achievements'
  | 'activities';

function getFormFingerprint(form: HTMLFormElement) {
  return JSON.stringify(
    Array.from(new FormData(form).entries())
      .filter(([key]) => key !== 'dirtySections')
      .map(([key, value]) => [
        key,
        typeof value === 'string'
          ? value
          : `${value.name}:${value.size}:${value.lastModified}`,
      ]),
  );
}

function getContentSaveSections(target: EventTarget | null) {
  if (
    !(target instanceof HTMLInputElement) &&
    !(target instanceof HTMLSelectElement) &&
    !(target instanceof HTMLTextAreaElement)
  ) {
    return ['profile'] satisfies ContentSaveSection[];
  }

  const { name } = target;
  if (name === 'sportSlugs') return ['sports'] satisfies ContentSaveSection[];
  if (name.startsWith('goal')) return ['goals'] satisfies ContentSaveSection[];
  if (name.startsWith('social'))
    return ['socials'] satisfies ContentSaveSection[];
  if (name.startsWith('gallery'))
    return ['gallery'] satisfies ContentSaveSection[];
  if (name.startsWith('sponsor'))
    return ['sponsors'] satisfies ContentSaveSection[];
  if (name.startsWith('achievement'))
    return ['achievements'] satisfies ContentSaveSection[];
  if (name.startsWith('activity'))
    return ['activities'] satisfies ContentSaveSection[];
  if (
    name === 'contentBlockOrder' ||
    name.startsWith('media') ||
    name.startsWith('offer') ||
    name.startsWith('link') ||
    name.startsWith('partnership')
  ) {
    return ['blocks'] satisfies ContentSaveSection[];
  }

  return ['profile'] satisfies ContentSaveSection[];
}

function getAutosaveDelay(target: EventTarget | null) {
  if (
    target instanceof HTMLSelectElement ||
    (target instanceof HTMLInputElement &&
      ['checkbox', 'radio', 'date'].includes(target.type))
  ) {
    return 120;
  }

  return 1200;
}

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
  value,
  onChange,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  type?: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
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
        value={value}
        onChange={onChange}
      />
    </label>
  );
}

function TextareaField({
  label,
  name,
  defaultValue,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
}) {
  return (
    <label className="space-y-1.5">
      <span className="text-xs font-medium">{label}</span>
      <textarea
        className="border-border bg-background focus:border-primary min-h-20 w-full resize-none rounded-md border px-3 py-2 text-sm transition outline-none"
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
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

      <label className="block space-y-2">
        <span className="flex items-center gap-2 text-xs font-semibold">
          Goal link
          <span className="text-muted-foreground font-normal">Optional</span>
        </span>
        <input
          className="border-border bg-background focus:border-primary h-10 w-full rounded-md border px-3 text-sm transition outline-none"
          name={`goalUrl${number}`}
          defaultValue={goal?.url ?? ''}
          placeholder="https://example.com/my-goal"
          type="url"
        />
        <span className="text-muted-foreground block text-xs">
          Link to a race, fundraiser, event, or more details.
        </span>
      </label>

      <div className="border-border bg-muted/25 space-y-3 rounded-lg border p-3">
        <label className="block min-w-0 space-y-2">
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
        <fieldset>
          <legend className="sr-only">Date display</legend>
          <div className="bg-muted grid grid-cols-2 gap-1 rounded-lg p-1">
            {goalDateDisplayOptions.map((option) => (
              <label key={option.value} className="relative cursor-pointer">
                <input
                  className="peer absolute inset-0 h-full w-full cursor-pointer appearance-none rounded-md outline-none"
                  defaultChecked={
                    (goal?.dateDisplay ?? 'date') === option.value
                  }
                  name={`goalDateDisplay${number}`}
                  type="radio"
                  value={option.value}
                />
                <span className="text-muted-foreground peer-checked:bg-background peer-checked:text-foreground peer-focus-visible:ring-ring flex h-9 items-center justify-center rounded-md px-3 text-xs font-semibold transition peer-checked:shadow-sm peer-focus-visible:ring-2">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
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
  | 'gallery'
  | 'achievements'
  | 'activities'
  | 'sponsors'
  | 'media'
  | 'offer'
  | 'link';

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
    type: 'link' as const,
    label: 'Link / URL',
    description: 'Send visitors to a website, event, article, or resource.',
    icon: Link2,
  },
  {
    type: 'offer' as const,
    label: 'Offer / product',
    description: 'Share a product, promo code, or affiliate offer.',
    icon: ShoppingBag,
  },
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

function OfferEditorFields({
  block,
  slot,
  onStructureChange,
}: {
  block: ProfileBuilderState['blocks'][number] | undefined;
  slot: number;
  onStructureChange: () => void;
}) {
  const getInitialValue = (key: string, fallback = '') =>
    typeof block?.content[key] === 'string'
      ? (block.content[key] as string)
      : fallback;
  const [url, setUrl] = useState(() => getInitialValue('url'));
  const [title, setTitle] = useState(() => getInitialValue('title'));
  const [description, setDescription] = useState(() =>
    getInitialValue('description'),
  );
  const [imageUrl, setImageUrl] = useState(() => getInitialValue('imageUrl'));
  const [siteName, setSiteName] = useState(() => getInitialValue('siteName'));
  const [promoCode, setPromoCode] = useState(() =>
    getInitialValue('promoCode'),
  );
  const [promoText, setPromoText] = useState(() =>
    getInitialValue('promoText'),
  );
  const [ctaLabel, setCtaLabel] = useState(() =>
    getInitialValue('ctaLabel', 'View offer'),
  );
  const [displaySize, setDisplaySize] = useState<'small' | 'medium' | 'large'>(
    () => {
      const saved = getInitialValue('displaySize');
      return saved === 'small' || saved === 'large' ? saved : 'medium';
    },
  );
  const [isAffiliate, setIsAffiliate] = useState(
    block?.content.isAffiliate === true,
  );
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const updatePreview = () => {
    window.requestAnimationFrame(onStructureChange);
  };

  const loadPreview = async () => {
    if (!url.trim()) {
      setStatus('error');
      setMessage('Add a product URL first.');
      return;
    }

    setStatus('loading');
    setMessage('');
    try {
      const response = await fetch('/api/link-preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const result = (await response.json()) as {
        title?: string;
        description?: string;
        imageUrl?: string;
        siteName?: string;
        error?: string;
      };
      if (!response.ok)
        throw new Error(result.error || 'Unable to preview this link.');

      setTitle(result.title || title);
      setDescription(result.description || description);
      setImageUrl(result.imageUrl || imageUrl);
      setSiteName(result.siteName || siteName);
      setStatus('idle');
      setMessage('Preview loaded. You can edit every field below.');
      updatePreview();
    } catch (error) {
      setStatus('error');
      setMessage(
        error instanceof Error ? error.message : 'Unable to preview this link.',
      );
    }
  };

  return (
    <div className="space-y-3">
      <label className="block space-y-1.5">
        <span className="text-xs font-medium">Product or affiliate URL</span>
        <div className="flex gap-2">
          <input
            className="border-border bg-background focus:border-primary h-10 min-w-0 flex-1 rounded-md border px-3 text-sm outline-none"
            name={`offerUrl${slot}`}
            placeholder="https://brand.com/product"
            type="url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
          />
          <button
            className="border-border hover:bg-muted flex h-10 shrink-0 items-center gap-2 rounded-md border px-3 text-xs font-semibold disabled:opacity-60"
            disabled={status === 'loading'}
            type="button"
            onClick={() => void loadPreview()}
          >
            {status === 'loading' ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <ShoppingBag className="h-3.5 w-3.5" />
            )}
            Preview
          </button>
        </div>
      </label>

      {message ? (
        <p
          className={cn(
            'text-xs leading-5',
            status === 'error' ? 'text-destructive' : 'text-muted-foreground',
          )}
        >
          {message}
        </p>
      ) : null}

      <div className="border-border overflow-hidden rounded-lg border">
        <div
          className="bg-muted aspect-[16/8] bg-cover bg-center"
          style={
            imageUrl
              ? { backgroundImage: `url(${JSON.stringify(imageUrl)})` }
              : undefined
          }
        >
          {!imageUrl ? (
            <span className="text-muted-foreground flex h-full items-center justify-center">
              <ShoppingBag className="h-6 w-6" />
            </span>
          ) : null}
        </div>
        <div className="space-y-1.5 p-3">
          {siteName ? (
            <p className="text-muted-foreground text-[11px] font-semibold uppercase">
              {siteName}
            </p>
          ) : null}
          <p className="text-sm font-semibold">{title || 'Product preview'}</p>
          {description ? (
            <p className="text-muted-foreground line-clamp-2 text-xs leading-5">
              {description}
            </p>
          ) : null}
          {promoCode ? (
            <span className="bg-primary/10 text-primary inline-flex rounded-md px-2 py-1 font-mono text-xs font-semibold">
              {promoCode}
            </span>
          ) : null}
        </div>
      </div>

      <ImageUploadField
        key={imageUrl}
        folder="offers"
        helpText="The preview image is copied to your Supabase storage. You can replace it here."
        label="Product image"
        name={`offerImageUrl${slot}`}
        previewShape="wide"
        value={imageUrl}
        onValueChange={(value) => {
          setImageUrl(value);
          updatePreview();
        }}
      />
      <div>
        <p className="text-xs font-medium">Display size</p>
        <div className="bg-muted mt-1.5 grid grid-cols-3 gap-1 rounded-lg p-1">
          {(['small', 'medium', 'large'] as const).map((size) => (
            <button
              key={size}
              className={cn(
                'h-9 rounded-md text-xs font-semibold capitalize transition',
                displaySize === size
                  ? 'bg-background shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
              type="button"
              onClick={() => {
                setDisplaySize(size);
                updatePreview();
              }}
            >
              {size}
            </button>
          ))}
        </div>
        <input
          name={`offerDisplaySize${slot}`}
          type="hidden"
          value={displaySize}
        />
      </div>
      <Field
        label="Title"
        name={`offerTitle${slot}`}
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />
      <TextareaField
        label="Description (optional)"
        name={`offerDescription${slot}`}
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      />
      <input name={`offerSiteName${slot}`} type="hidden" value={siteName} />
      <div className="grid gap-3 sm:grid-cols-2">
        <Field
          label="Promo code (optional)"
          name={`offerPromoCode${slot}`}
          placeholder="GRIIT10"
          value={promoCode}
          onChange={(event) => setPromoCode(event.target.value)}
        />
        <Field
          label="Button label"
          name={`offerCtaLabel${slot}`}
          placeholder="View offer"
          value={ctaLabel}
          onChange={(event) => setCtaLabel(event.target.value)}
        />
      </div>
      <Field
        label="Promo text (optional)"
        name={`offerPromoText${slot}`}
        placeholder="Get 10% off with my code"
        value={promoText}
        onChange={(event) => setPromoText(event.target.value)}
      />
      <label className="border-border bg-muted/30 flex cursor-pointer items-start gap-3 rounded-lg border p-3">
        <input
          checked={isAffiliate}
          className="mt-0.5 h-4 w-4"
          name={`offerIsAffiliate${slot}`}
          type="checkbox"
          onChange={(event) => setIsAffiliate(event.target.checked)}
        />
        <span>
          <span className="block text-xs font-semibold">Affiliate link</span>
          <span className="text-muted-foreground mt-0.5 block text-[11px] leading-4">
            Displays a transparent affiliate disclosure on the card.
          </span>
        </span>
      </label>
    </div>
  );
}

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
  const offerBlocks = builder.blocks.filter((block) => block.type === 'offer');
  const linkBlocks = builder.blocks.filter((block) => block.type === 'link');
  const [nextMediaSlot, setNextMediaSlot] = useState(
    Math.max(1, mediaBlocks.length + 1),
  );
  const [nextOfferSlot, setNextOfferSlot] = useState(
    Math.max(1, offerBlocks.length + 1),
  );
  const [nextLinkSlot, setNextLinkSlot] = useState(
    Math.max(1, linkBlocks.length + 1),
  );
  const [activeBlocks, setActiveBlocks] = useState<ActiveContentBlock[]>(() => {
    const blocksWithContent = new Set<ContentBlockType>();

    if (builder.galleryItems.length) blocksWithContent.add('gallery');
    if (builder.achievements.length) blocksWithContent.add('achievements');
    if (builder.activities.length) blocksWithContent.add('activities');
    if (builder.sponsors.length) blocksWithContent.add('sponsors');

    let mediaIndex = 0;
    let offerIndex = 0;
    let linkIndex = 0;
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

        if (type === 'offer') {
          offerIndex += 1;
          return { key: `offer-${offerIndex}`, type };
        }

        if (type === 'link') {
          linkIndex += 1;
          return { key: `link-${linkIndex}`, type };
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
      block.type === 'offer' ||
      block.type === 'link' ||
      !activeBlocks.some((active) => active.type === block.type),
  );

  useEffect(() => {
    if (!pendingFocusKey) return;

    const block = blockRefs.current.get(pendingFocusKey);
    if (!block) return;

    block.open = true;
    block.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    const frame = window.requestAnimationFrame(() => {
      block
        .querySelector<HTMLElement>(
          'input:not([type="hidden"]):not([type="file"]), textarea, select, [data-autofocus-field]',
        )
        ?.focus();
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
                            <ImageUploadField
                              folder="gallery"
                              label="Image"
                              name={`galleryUrl${slot + 1}`}
                              previewShape="wide"
                              value={galleryItems[slot]?.imageUrl ?? ''}
                              onValueChange={onStructureChange}
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
                                <ImageUploadField
                                  folder="sponsors"
                                  label="Sponsor logo"
                                  name={`sponsorLogoUrl${number}`}
                                  previewShape="logo"
                                  value={sponsor?.logoUrl ?? ''}
                                  onValueChange={onStructureChange}
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
                    ) : type === 'offer' ? (
                      <OfferEditorFields
                        block={
                          offerBlocks[Number(key.replace('offer-', '')) - 1]
                        }
                        slot={Number(key.replace('offer-', ''))}
                        onStructureChange={onStructureChange}
                      />
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
                    ) : type === 'link' ? (
                      <>
                        <Field
                          label="URL"
                          name={`linkUrl${key.replace('link-', '')}`}
                          defaultValue={
                            typeof linkBlocks[
                              Number(key.replace('link-', '')) - 1
                            ]?.content.url === 'string'
                              ? (linkBlocks[
                                  Number(key.replace('link-', '')) - 1
                                ].content.url as string)
                              : ''
                          }
                          placeholder="https://example.com"
                          type="url"
                        />
                        <ImageUploadField
                          folder="links"
                          helpText="Optional image displayed as a thumbnail in the link card."
                          label="Link image (optional)"
                          name={`linkImageUrl${key.replace('link-', '')}`}
                          previewShape="wide"
                          value={
                            typeof linkBlocks[
                              Number(key.replace('link-', '')) - 1
                            ]?.content.imageUrl === 'string'
                              ? (linkBlocks[
                                  Number(key.replace('link-', '')) - 1
                                ].content.imageUrl as string)
                              : ''
                          }
                          onValueChange={onStructureChange}
                        />
                        <Field
                          label="Title (optional)"
                          name={`linkTitle${key.replace('link-', '')}`}
                          defaultValue={
                            typeof linkBlocks[
                              Number(key.replace('link-', '')) - 1
                            ]?.content.title === 'string'
                              ? (linkBlocks[
                                  Number(key.replace('link-', '')) - 1
                                ].content.title as string)
                              : ''
                          }
                          placeholder="Discover my next event"
                        />
                        <TextareaField
                          label="Description (optional)"
                          name={`linkDescription${key.replace('link-', '')}`}
                          defaultValue={
                            typeof linkBlocks[
                              Number(key.replace('link-', '')) - 1
                            ]?.content.description === 'string'
                              ? (linkBlocks[
                                  Number(key.replace('link-', '')) - 1
                                ].content.description as string)
                              : ''
                          }
                          placeholder="Add a little context about this link."
                        />
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
                          } else if (block.type === 'offer') {
                            const slot = nextOfferSlot;
                            const key = `offer-${slot}`;
                            setActiveBlocks((current) => [
                              ...current,
                              { key, type: 'offer' },
                            ]);
                            setNextOfferSlot(slot + 1);
                            setPendingFocusKey(key);
                          } else if (block.type === 'link') {
                            const slot = nextLinkSlot;
                            const key = `link-${slot}`;
                            setActiveBlocks((current) => [
                              ...current,
                              { key, type: 'link' },
                            ]);
                            setNextLinkSlot(slot + 1);
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
  onAutosaveStatusChange,
}: {
  builder: ProfileBuilderState;
  subscription: SubscriptionState;
  onPreviewChange?: (form: HTMLFormElement) => void;
  onAutosaveStatusChange?: (status: AutosaveStatus, message?: string) => void;
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
  const dirtySectionsInputRef = useRef<HTMLInputElement>(null);
  const autosaveTimerRef = useRef<number | null>(null);
  const pendingRef = useRef(pending);
  const dirtyRef = useRef(false);
  const lastSavedFingerprintRef = useRef('');
  const inFlightFingerprintRef = useRef<string | null>(null);
  const dirtySectionsRef = useRef(new Set<ContentSaveSection>());
  const inFlightSectionsRef = useRef<ContentSaveSection[]>([]);

  const markDirtySections = (
    sections: ContentSaveSection | ContentSaveSection[],
  ) => {
    const nextSections = Array.isArray(sections) ? sections : [sections];
    nextSections.forEach((section) => dirtySectionsRef.current.add(section));
    if (dirtySectionsInputRef.current) {
      dirtySectionsInputRef.current.value = Array.from(
        dirtySectionsRef.current,
      ).join(',');
    }
  };

  const submitWhenReady = () => {
    if (pendingRef.current) {
      autosaveTimerRef.current = window.setTimeout(submitWhenReady, 250);
      return;
    }

    if (!dirtyRef.current) return;

    const form = formRef.current;
    if (!form) return;

    const fingerprint = getFormFingerprint(form);
    if (fingerprint === lastSavedFingerprintRef.current) {
      dirtyRef.current = false;
      onAutosaveStatusChange?.('saved');
      return;
    }

    dirtyRef.current = false;
    inFlightFingerprintRef.current = fingerprint;
    inFlightSectionsRef.current = Array.from(dirtySectionsRef.current);
    if (!inFlightSectionsRef.current.length) {
      inFlightSectionsRef.current = ['profile'];
    }
    if (dirtySectionsInputRef.current) {
      dirtySectionsInputRef.current.value =
        inFlightSectionsRef.current.join(',');
    }
    form.requestSubmit();
    dirtySectionsRef.current.clear();
    if (dirtySectionsInputRef.current) {
      dirtySectionsInputRef.current.value = '';
    }
  };
  const scheduleAutosave = (
    delay = 1200,
    sections?: ContentSaveSection | ContentSaveSection[],
  ) => {
    if (autosaveTimerRef.current) {
      window.clearTimeout(autosaveTimerRef.current);
    }

    dirtyRef.current = true;
    if (sections) markDirtySections(sections);
    onAutosaveStatusChange?.('waiting');
    autosaveTimerRef.current = window.setTimeout(submitWhenReady, delay);
  };
  const schedulePreviewUpdate = (
    sections: ContentSaveSection | ContentSaveSection[] = 'blocks',
  ) => {
    window.requestAnimationFrame(() => {
      if (formRef.current) {
        onPreviewChange?.(formRef.current);
        scheduleAutosave(400, sections);
      }
    });
  };

  useEffect(() => {
    if (formRef.current) {
      lastSavedFingerprintRef.current = getFormFingerprint(formRef.current);
    }
  }, []);

  useEffect(
    () => () => {
      if (autosaveTimerRef.current) {
        window.clearTimeout(autosaveTimerRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    pendingRef.current = pending;
  }, [pending]);

  useEffect(() => {
    if (pending) onAutosaveStatusChange?.('saving');
  }, [onAutosaveStatusChange, pending]);

  useEffect(() => {
    if (pending || !state.message) return;

    if (state.success && inFlightFingerprintRef.current) {
      lastSavedFingerprintRef.current = inFlightFingerprintRef.current;
    } else if (!state.success) {
      markDirtySections(inFlightSectionsRef.current);
    }
    inFlightFingerprintRef.current = null;
    inFlightSectionsRef.current = [];

    if (dirtyRef.current) {
      onAutosaveStatusChange?.('waiting');
      return;
    }

    onAutosaveStatusChange?.(state.success ? 'saved' : 'error', state.message);
  }, [onAutosaveStatusChange, pending, state]);

  return (
    <form
      action={formAction}
      className="space-y-4"
      onChange={(event) => {
        onPreviewChange?.(event.currentTarget);
        scheduleAutosave(
          getAutosaveDelay(event.target),
          getContentSaveSections(event.target),
        );
      }}
      ref={formRef}
    >
      <input
        name="isPublished"
        type="hidden"
        value={profile.isPublished ? 'on' : ''}
      />
      <input ref={dirtySectionsInputRef} name="dirtySections" type="hidden" />
      <input name="coverUrl" type="hidden" value={profile.coverUrl} />
      <div>
        <div>
          <p className="text-muted-foreground text-xs tracking-[0.24em] uppercase">
            Content
          </p>
          <p className="mt-2 font-semibold">Profile details</p>
        </div>
      </div>

      <EditorSection
        title="Athlete identity"
        description="Avatar, name, bio and sports"
        icon={UserRound}
        defaultOpen
      >
        <ImageUploadField
          folder="avatars"
          label="Profile picture"
          name="avatarUrl"
          previewShape="square"
          value={profile.avatarUrl}
          onValueChange={() => schedulePreviewUpdate('profile')}
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
        <Field
          label="Location"
          name="location"
          defaultValue={profile.location}
          placeholder="Bangkok, Thailand"
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
              onClick={() => {
                setGoalCount((current) => Math.min(3, current + 1));
                schedulePreviewUpdate('goals');
              }}
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
          onStructureChange={() => schedulePreviewUpdate('socials')}
        />
      </EditorSection>

      <ContentBlocksEditor
        builder={builder}
        subscription={subscription}
        onStructureChange={() =>
          schedulePreviewUpdate([
            'blocks',
            'gallery',
            'sponsors',
            'achievements',
            'activities',
          ])
        }
      />
    </form>
  );
}
