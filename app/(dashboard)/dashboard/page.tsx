import Link from 'next/link';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboardNavItems } from '@/lib/constants/navigation';

const sections = dashboardNavItems.slice(1);

export default function DashboardHomePage() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-background to-background p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Today’s focus</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">Shape your public story.</h2>
            <p className="mt-3 max-w-2xl text-base text-muted-foreground">
              Build your profile with blocks, milestones, and a polished identity that travels wherever you do.
            </p>
          </div>
          <div className="rounded-2xl border border-primary/20 bg-background/80 p-4">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sections.map((section) => (
          <Link key={section.href} href={section.href}>
            <Card className="h-full transition hover:border-primary/40 hover:shadow-sm">
              <CardHeader>
                <CardTitle>{section.label}</CardTitle>
                <CardDescription>Continue crafting this part of your athlete profile.</CardDescription>
              </CardHeader>
              <div className="flex items-center text-sm font-medium text-primary">
                Open section <ArrowUpRight className="ml-2 h-4 w-4" />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
