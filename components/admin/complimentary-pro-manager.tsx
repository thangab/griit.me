'use client';

import { useActionState, useMemo, useState } from 'react';
import {
  CheckCircleIcon,
  GiftIcon,
  MagnifyingGlassIcon,
  XCircleIcon,
} from '@phosphor-icons/react';
import {
  manageComplimentaryProAction,
  type ComplimentaryProActionState,
} from '@/lib/actions/complimentary-pro';
import type { AdminComplimentaryProAccount } from '@/lib/services/complimentary-pro';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';

const initialState: ComplimentaryProActionState = {
  success: false,
  message: '',
};

function AccessForm({
  account,
  fr,
}: {
  account: AdminComplimentaryProAccount;
  fr: boolean;
}) {
  const [state, formAction, pending] = useActionState(
    manageComplimentaryProAction,
    initialState,
  );

  return (
    <form
      action={formAction}
      className="rounded-[1.5rem] border border-black/10 bg-white p-5 shadow-[0_12px_40px_rgba(21,21,21,0.04)]"
    >
      <input name="userId" type="hidden" value={account.userId} />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="truncate text-lg font-black">
              {account.fullName || account.email || account.userId}
            </h2>
            <span
              className={cn(
                'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-black uppercase',
                account.active
                  ? 'bg-[#dff5b4] text-[#294700]'
                  : account.granted
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-black/5 text-black/40',
              )}
            >
              {account.active
                ? fr
                  ? 'Partner actif'
                  : 'Active partner'
                : account.granted
                  ? fr
                    ? 'Expiré'
                    : 'Expired'
                  : fr
                    ? 'Accès standard'
                    : 'Standard access'}
            </span>
          </div>
          <p className="mt-1 truncate text-sm text-black/45">
            {account.email || account.userId}
          </p>
          {account.publicProfiles.length ? (
            <p className="mt-2 line-clamp-2 text-xs leading-5 text-black/40">
              {account.publicProfiles.join(' · ')}
            </p>
          ) : null}
        </div>
        {account.active ? (
          <GiftIcon className="h-6 w-6 shrink-0 text-[#3157ff]" weight="fill" />
        ) : null}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-[0.8fr_1.2fr]">
        <label className="text-xs font-bold text-black/55">
          {fr ? 'Date d’expiration' : 'Expiration date'}
          <input
            className="mt-1.5 h-10 w-full rounded-lg border border-black/10 bg-white px-3 text-sm transition outline-none focus:border-[#3157ff] focus:ring-2 focus:ring-[#3157ff]/10"
            defaultValue={account.expiresAt?.slice(0, 10) ?? ''}
            min={new Date().toISOString().slice(0, 10)}
            name="expirationDate"
            type="date"
          />
          <span className="mt-1 block font-normal text-black/35">
            {fr
              ? 'Laissez vide pour un accès sans expiration.'
              : 'Leave empty for access without expiration.'}
          </span>
        </label>
        <label className="text-xs font-bold text-black/55">
          {fr ? 'Note interne' : 'Internal note'}
          <input
            className="mt-1.5 h-10 w-full rounded-lg border border-black/10 bg-white px-3 text-sm transition outline-none focus:border-[#3157ff] focus:ring-2 focus:ring-[#3157ff]/10"
            defaultValue={account.note}
            maxLength={500}
            name="note"
            placeholder={
              fr ? 'Ex. partenariat ambassadeur' : 'E.g. ambassador partnership'
            }
          />
        </label>
      </div>

      {state.message ? (
        <p
          className={cn(
            'mt-3 flex items-center gap-1.5 text-xs font-semibold',
            state.success ? 'text-emerald-700' : 'text-red-600',
          )}
        >
          {state.success ? (
            <CheckCircleIcon className="h-4 w-4" weight="fill" />
          ) : (
            <XCircleIcon className="h-4 w-4" weight="fill" />
          )}
          {state.message}
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        <Button disabled={pending} name="intent" type="submit" value="grant">
          <GiftIcon className="h-4 w-4" />
          {pending
            ? fr
              ? 'Enregistrement…'
              : 'Saving…'
            : account.granted
              ? fr
                ? 'Enregistrer note et expiration'
                : 'Save note & expiry'
              : fr
                ? 'Offrir Griit Pro'
                : 'Grant Griit Pro'}
        </Button>
        {account.granted ? (
          <Button
            disabled={pending}
            name="intent"
            type="submit"
            value="revoke"
            variant="outline"
          >
            {fr ? 'Retirer l’accès' : 'Remove access'}
          </Button>
        ) : null}
      </div>
    </form>
  );
}

export function ComplimentaryProManager({
  accounts,
  fr,
}: {
  accounts: AdminComplimentaryProAccount[];
  fr: boolean;
}) {
  const [query, setQuery] = useState('');
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const filteredAccounts = useMemo(
    () =>
      accounts.filter((account) =>
        [
          account.fullName,
          account.email,
          account.userId,
          ...account.publicProfiles,
        ]
          .join(' ')
          .toLocaleLowerCase()
          .includes(normalizedQuery),
      ),
    [accounts, normalizedQuery],
  );

  return (
    <div className="space-y-5">
      <div className="relative">
        <MagnifyingGlassIcon className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-black/35" />
        <input
          className="h-12 w-full rounded-2xl border border-black/10 bg-white pr-4 pl-11 text-sm transition outline-none focus:border-[#3157ff] focus:ring-2 focus:ring-[#3157ff]/10"
          onChange={(event) => setQuery(event.target.value)}
          placeholder={
            fr
              ? 'Rechercher un compte ou un profil…'
              : 'Search an account or profile…'
          }
          type="search"
          value={query}
        />
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        {filteredAccounts.map((account) => (
          <AccessForm account={account} fr={fr} key={account.userId} />
        ))}
      </div>
      {!filteredAccounts.length ? (
        <p className="rounded-2xl border border-dashed border-black/15 px-6 py-10 text-center text-sm text-black/45">
          {fr ? 'Aucun compte trouvé.' : 'No account found.'}
        </p>
      ) : null}
    </div>
  );
}
