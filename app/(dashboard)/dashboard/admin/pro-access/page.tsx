import { notFound } from 'next/navigation';
import { GiftIcon } from '@phosphor-icons/react/ssr';
import { ComplimentaryProManager } from '@/components/admin/complimentary-pro-manager';
import { getRequestLocale } from '@/lib/i18n/server';
import { getAdminComplimentaryProAccounts } from '@/lib/services/complimentary-pro';

export default async function ComplimentaryProAdminPage() {
  const [accounts, locale] = await Promise.all([
    getAdminComplimentaryProAccounts(),
    getRequestLocale(),
  ]);
  if (!accounts) notFound();
  const fr = locale === 'fr';
  const activeCount = accounts.filter((account) => account.active).length;

  return (
    <div className="mx-auto w-full max-w-[1380px] space-y-6">
      <header className="relative overflow-hidden rounded-[2rem] bg-[#151515] p-7 text-white shadow-[0_24px_70px_rgba(21,21,21,0.12)] sm:p-9">
        <div className="pointer-events-none absolute -top-24 right-8 h-60 w-60 rounded-full border-[38px] border-[#a9ed35]/20" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-black tracking-[0.22em] text-white/45 uppercase">
              Admin · Griit Partner
            </p>
            <h1 className="mt-4 text-4xl font-black tracking-[-0.05em] sm:text-5xl">
              {fr ? 'Accès Pro offerts' : 'Complimentary Pro access'}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/55">
              {fr
                ? 'Offrez toutes les fonctionnalités Pro à un sportif ou un créateur partenaire, sans créer d’abonnement Stripe.'
                : 'Give every Pro feature to an athlete or creator partner without creating a Stripe subscription.'}
            </p>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-bold">
            <GiftIcon className="h-4 w-4 text-[#a9ed35]" weight="fill" />
            {activeCount} {fr ? 'partners actifs' : 'active partners'}
          </span>
        </div>
      </header>

      <ComplimentaryProManager accounts={accounts} fr={fr} />
    </div>
  );
}
