import { ProfileManager } from '@/components/dashboard/profile-manager';
import { ProfilesProGate } from '@/components/dashboard/profiles-pro-gate';
import { getSubscriptionState } from '@/lib/services/billing';
import { getOwnedProfiles } from '@/lib/services/profile-builder';

export default async function ProfilesPage() {
  const [profiles, subscription] = await Promise.all([
    getOwnedProfiles(),
    getSubscriptionState(),
  ]);

  // A Free account must still be able to create its initial profile. Once it
  // exists, profile switching and additional profiles become a Pro feature.
  if (!subscription.isActive && profiles.length > 0) {
    return <ProfilesProGate />;
  }

  return (
    <ProfileManager profiles={profiles} limit={subscription.isActive ? 5 : 1} />
  );
}
