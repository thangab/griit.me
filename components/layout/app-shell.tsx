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
    <div className="bg-accent fixed inset-0 overflow-hidden">
      <div className="flex h-full min-h-0">
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
          <main className="bg-accent flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto p-4 sm:p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
