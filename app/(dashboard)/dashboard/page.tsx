import { redirect } from 'next/navigation';
import type { Route } from 'next';
import { getOwnedProfiles } from '@/lib/services/profile-builder';

export default async function DashboardHomePage() {
  const profiles = await getOwnedProfiles();
  const primaryProfile = profiles[0];

  if (!primaryProfile) redirect('/dashboard/onboard');

  redirect(`/dashboard/profiles/${primaryProfile.id}` as Route);
}
