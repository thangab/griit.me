import { DashboardSidebar } from '@/components/layout/dashboard-sidebar';
import { MobileDashboardNav } from '@/components/layout/mobile-dashboard-nav';

export async function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background min-h-screen">
      <div className="flex min-h-screen">
        <DashboardSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <MobileDashboardNav />
          <main className="bg-accent min-w-0 flex-1 p-4 sm:p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
