import { DesignWorkspace } from '@/components/dashboard/design-workspace';
import { getSubscriptionState } from '@/lib/services/billing';
import { getProfileBuilderState } from '@/lib/services/profile-builder';

export default async function DesignPage() {
  const [builder, subscription] = await Promise.all([
    getProfileBuilderState(),
    getSubscriptionState(),
  ]);

  return <DesignWorkspace builder={builder} subscription={subscription} />;
}
