import Link from 'next/link';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getSubscriptionState, canAccessFeature } from '@/lib/services/billing';

export default async function BlocksPage() {
  const subscription = await getSubscriptionState();
  const hasAccess = await canAccessFeature('unlimitedBlocks', subscription);

  if (!hasAccess) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Blocks</CardTitle>
            <CardDescription>
              Unlimited blocks are available only on Pro.
            </CardDescription>
          </CardHeader>
          <div className="p-6">
            <p className="text-muted-foreground text-sm">
              Upgrade to Pro to build with unlimited content blocks.
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
          <CardTitle>Blocks</CardTitle>
          <CardDescription>
            The builder experience and content blocks will be added here later.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
