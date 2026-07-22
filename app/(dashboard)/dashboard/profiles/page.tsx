import { ProfileManager } from '@/components/dashboard/profile-manager';
import { ProfilesProGate } from '@/components/dashboard/profiles-pro-gate';
import { getSubscriptionState } from '@/lib/services/billing';
import { getOwnedProfiles } from '@/lib/services/profile-builder';

export default async function ProfilesPage() {
  const [profiles, subscription] = await Promise.all([
    getOwnedProfiles(),
    getSubscriptionState(),
  ]);

  if (!subscription.isActive) {
    return <ProfilesProGate />;
  }

  return <ProfileManager profiles={profiles} limit={5} />;
}
