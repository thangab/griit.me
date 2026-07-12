'use client';

import { useActionState } from 'react';
import { Save } from 'lucide-react';
import {
  saveProfileBuilderAction,
  type ProfileBuilderActionState,
} from '@/lib/actions/profile-builder';
import { Button } from '@/components/ui/button';
import type { ProfileBuilderState } from '@/lib/types/profile-builder';

const initialState: ProfileBuilderActionState = {
  success: false,
  message: '',
};

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

export function ContentEditor({ builder }: { builder: ProfileBuilderState }) {
  const [state, formAction, pending] = useActionState(
    saveProfileBuilderAction,
    initialState,
  );
  const profile = builder.profile;
  const primarySocial = builder.socialLinks[0];
  const galleryItems = builder.galleryItems.slice(0, 3);

  return (
    <form action={formAction} className="space-y-4">
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

      <div className="space-y-3">
        <Field
          label="Display name"
          name="displayName"
          defaultValue={profile.displayName}
          placeholder="Thang"
        />
        <label className="space-y-1.5">
          <span className="text-xs font-medium">Bio</span>
          <textarea
            className="border-border bg-background focus:border-primary min-h-24 w-full resize-none rounded-md border px-3 py-2 text-sm transition outline-none"
            name="bio"
            defaultValue={profile.bio}
            placeholder="Tell the story in a few lines."
          />
        </label>
        <Field
          label="Sport"
          name="sport"
          defaultValue={profile.sport}
          placeholder="Running"
        />
        <Field
          label="Location"
          name="location"
          defaultValue={profile.location}
          placeholder="Bangkok"
        />
      </div>

      <div className="border-border border-t pt-4">
        <p className="text-sm font-semibold">Images</p>
        <div className="mt-3 space-y-3">
          <Field
            label="Avatar URL"
            name="avatarUrl"
            defaultValue={profile.avatarUrl}
            placeholder="https://..."
            type="url"
          />
          <Field
            label="Cover URL"
            name="coverUrl"
            defaultValue={profile.coverUrl}
            placeholder="https://..."
            type="url"
          />
          {[0, 1, 2].map((index) => (
            <Field
              key={index}
              label={`Gallery URL ${index + 1}`}
              name={`galleryUrl${index + 1}`}
              defaultValue={galleryItems[index]?.imageUrl ?? ''}
              placeholder="https://..."
              type="url"
            />
          ))}
        </div>
      </div>

      <div className="border-border border-t pt-4">
        <p className="text-sm font-semibold">Primary social</p>
        <div className="mt-3 space-y-3">
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
        </div>
      </div>

      <label className="border-border bg-card flex items-center justify-between gap-3 rounded-xl border p-3">
        <span>
          <span className="block text-sm font-semibold">Publish profile</span>
          <span className="text-muted-foreground text-xs">
            Make the public profile selectable by public routes.
          </span>
        </span>
        <input
          className="h-4 w-4"
          name="isPublished"
          type="checkbox"
          defaultChecked={profile.isPublished}
        />
      </label>
    </form>
  );
}
