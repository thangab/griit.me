import { redirect } from 'next/navigation';
import type { Route } from 'next';
import { ProfileOnboardingForm } from '@/components/dashboard/profile-onboarding-form';
import { getOwnedProfiles } from '@/lib/services/profile-builder';

export default async function ProfileOnboardingPage() {
  const profiles = await getOwnedProfiles();
  const existingProfile = profiles[0];

  if (existingProfile) {
    redirect(`/dashboard/profiles/${existingProfile.id}` as Route);
  }

  return <ProfileOnboardingForm />;
}
