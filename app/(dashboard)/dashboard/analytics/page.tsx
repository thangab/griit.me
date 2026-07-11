import Link from 'next/link';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getSubscriptionState, canAccessFeature } from '@/lib/services/billing';

export default async function AnalyticsPage() {
  const subscription = await getSubscriptionState();
  const hasAccess = await canAccessFeature('advancedAnalytics', subscription);

  if (!hasAccess) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Analytics</CardTitle>
            <CardDescription>
              Analytics is a Pro feature. Upgrade to unlock traffic reporting
              and engagement insights.
            </CardDescription>
          </CardHeader>
          <div className="p-6">
            <p className="text-muted-foreground text-sm">
              Your current plan is <strong>{subscription.plan}</strong>.
            </p>
            <Link href="/dashboard/settings">
              <Button className="mt-4">Upgrade to Pro</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Analytics</CardTitle>
          <CardDescription>
            Profile traffic and engagement insights will be surfaced here.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
