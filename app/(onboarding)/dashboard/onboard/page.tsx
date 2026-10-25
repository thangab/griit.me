import { MarketingFunnelEvent } from '@/components/marketing/marketing-funnel-event';
import { redirect } from 'next/navigation';
import type { Route } from 'next';
import { ProfileOnboardingForm } from '@/components/dashboard/profile-onboarding-form';
import { getOwnedProfiles } from '@/lib/services/profile-builder';
import {
  getProfileTemplate,
  isProfileTemplateId,
  type ProfileTemplateId,
} from '@/lib/constants/profile-templates';

export default async function ProfileOnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{
    template?: string;
    source?: string;
    profile?: string;
  }>;
}) {
  const profiles = await getOwnedProfiles();
  const existingProfile = profiles[0];

  if (existingProfile) {
    redirect(`/dashboard/profiles/${existingProfile.id}` as Route);
  }

  const { template, source, profile } = await searchParams;
  const initialTemplateId: ProfileTemplateId =
    isProfileTemplateId(template) && !getProfileTemplate(template)?.proOnly
      ? template
      : 'spotlight';

  return (
    <>
      <MarketingFunnelEvent
        name="onboarding_started"
        parameters={{ source, profile, template: initialTemplateId }}
      />
      <ProfileOnboardingForm
        attributionProfile={profile}
        attributionSource={source}
        initialTemplateId={initialTemplateId}
      />
    </>
  );
}
