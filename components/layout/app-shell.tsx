import { redirect } from 'next/navigation';
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar';
import { MobileDashboardNav } from '@/components/layout/mobile-dashboard-nav';
import { getOwnedProfiles } from '@/lib/services/profile-builder';
import { getSubscriptionState } from '@/lib/services/billing';

export async function AppShell({ children }: { children: React.ReactNode }) {
  const [profiles, subscription] = await Promise.all([
    getOwnedProfiles(),
    getSubscriptionState(),
  ]);
  const defaultProfileId = profiles[0]?.id;
  const canSwitchProfiles =
    subscription.plan === 'pro' && subscription.isActive && profiles.length > 1;

  if (!defaultProfileId) {
    redirect('/dashboard/onboard');
  }

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#f7f6f1] text-[#151515]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 right-[-8rem] h-[34rem] w-[34rem] rounded-full bg-[#3157ff]/[0.045] blur-3xl" />
        <div className="absolute bottom-[-14rem] left-[22%] h-[30rem] w-[30rem] rounded-full bg-[#a9ed35]/[0.045] blur-3xl" />
      </div>
      <div className="relative flex h-full min-h-0">
        <DashboardSidebar
          canSwitchProfiles={canSwitchProfiles}
          defaultProfileId={defaultProfileId}
          isPro={subscription.plan === 'pro' && subscription.isActive}
          profiles={profiles}
        />
        <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col">
          <MobileDashboardNav
            canSwitchProfiles={canSwitchProfiles}
            defaultProfileId={defaultProfileId}
            isPro={subscription.plan === 'pro' && subscription.isActive}
            profiles={profiles}
          />
          <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto px-4 py-4 sm:px-6 sm:py-6 lg:px-7">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
