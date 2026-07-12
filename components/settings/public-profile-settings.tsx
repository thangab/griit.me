'use client';

import { useActionState } from 'react';
import { Link2, Save } from 'lucide-react';
import {
  updateProfileUrlAction,
  type ProfileBuilderActionState,
} from '@/lib/actions/profile-builder';
import { Button } from '@/components/ui/button';
import type { ProfileBuilderState } from '@/lib/types/profile-builder';

const initialState: ProfileBuilderActionState = {
  success: false,
  message: '',
};

export function PublicProfileSettings({
  builder,
}: {
  builder: ProfileBuilderState;
}) {
  const [state, formAction, pending] = useActionState(
    updateProfileUrlAction,
    initialState,
  );
  const username = builder.profile.username;

  return (
    <div className="border-border bg-background rounded-2xl border p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Public profile</h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Manage the public URL people use to visit your athlete page.
          </p>
          <p className="text-foreground mt-3 flex items-center gap-2 text-sm font-semibold">
            <Link2 className="h-4 w-4" />
            griit.me/{username}
          </p>
        </div>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-900">
          {builder.profile.isPublished ? 'Published' : 'Draft'}
        </span>
      </div>

      <form action={formAction} className="mt-6 space-y-4">
        <label className="space-y-1.5">
          <span className="text-xs font-medium">Username</span>
          <div className="border-border bg-card focus-within:border-primary flex h-10 overflow-hidden rounded-md border transition">
            <span className="text-muted-foreground border-border flex items-center border-r px-3 text-sm">
              griit.me/
            </span>
            <input
              className="bg-background min-w-0 flex-1 px-3 text-sm outline-none"
              defaultValue={username}
              name="username"
              placeholder="gumhy"
            />
          </div>
        </label>

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

        <Button type="submit" disabled={pending}>
          <Save className="h-4 w-4" />
          {pending ? 'Saving' : 'Save public URL'}
        </Button>
      </form>
    </div>
  );
}
