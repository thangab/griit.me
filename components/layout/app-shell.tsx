import { DashboardSidebar } from '@/components/layout/dashboard-sidebar';
import { MobileDashboardNav } from '@/components/layout/mobile-dashboard-nav';
import { getOwnedProfiles } from '@/lib/services/profile-builder';

export async function AppShell({ children }: { children: React.ReactNode }) {
  const profiles = await getOwnedProfiles();
  const defaultProfileId = profiles[0]?.id;

  return (
    <div className="bg-accent fixed inset-0 overflow-hidden">
      <div className="flex h-full min-h-0">
        <DashboardSidebar defaultProfileId={defaultProfileId} />
        <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col">
          <MobileDashboardNav defaultProfileId={defaultProfileId} />
          <main className="bg-accent flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto p-4 sm:p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
