import Link from 'next/link';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { dashboardNavItems } from '@/lib/constants/navigation';
import { getSubscriptionState } from '@/lib/services/billing';

const sections = dashboardNavItems.slice(1);

export default async function DashboardHomePage() {
  const subscription = await getSubscriptionState();
  return (
    <div className="space-y-6">
      <div className="border-border from-primary/10 via-background to-background rounded-2xl border bg-linear-to-br p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-muted-foreground text-sm font-medium">
                Today’s focus
              </p>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold tracking-[0.12em] text-emerald-900 uppercase">
                {subscription.plan === 'pro' ? 'Pro' : 'Free'}
              </span>
            </div>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              Shape your public story.
            </h2>
            <p className="text-muted-foreground mt-3 max-w-2xl text-base">
              Build your profile with blocks, milestones, and a polished
              identity that travels wherever you do.
            </p>
          </div>
          <div className="border-primary/20 bg-background/80 rounded-2xl border p-4">
            <Sparkles className="text-primary h-6 w-6" />
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sections.map((section) => (
          <Link key={section.href} href={section.href}>
            <Card className="hover:border-primary/40 h-full transition hover:shadow-sm">
              <CardHeader>
                <CardTitle>{section.label}</CardTitle>
                <CardDescription>
                  Continue crafting this part of your athlete profile.
                </CardDescription>
              </CardHeader>
              <div className="text-primary flex items-center text-sm font-medium">
                Open section <ArrowUpRight className="ml-2 h-4 w-4" />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
