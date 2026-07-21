import { notFound } from 'next/navigation';
import { DesignWorkspace } from '@/components/dashboard/design-workspace';
import { getSubscriptionState } from '@/lib/services/billing';
import { getProfileBuilderState } from '@/lib/services/profile-builder';

export default async function ProfileDesignPage({
  params,
}: {
  params: Promise<{ profileId: string }>;
}) {
  const profileId = Number((await params).profileId);
  if (!Number.isInteger(profileId) || profileId <= 0) notFound();
  const [builder, subscription] = await Promise.all([
    getProfileBuilderState(profileId),
    getSubscriptionState(),
  ]);
  if (!builder) notFound();
  return <DesignWorkspace builder={builder} subscription={subscription} />;
}
