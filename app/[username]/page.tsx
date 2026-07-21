import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PublicProfileView } from '@/components/profile/public-profile-view';
import { ProfileAnalyticsTracker } from '@/components/profile/profile-analytics-tracker';
import { getPublicProfileBuilderState } from '@/lib/services/profile-builder';

type PublicProfilePageProps = {
  params: Promise<{
    username: string;
  }>;
};

export async function generateMetadata({
  params,
}: PublicProfilePageProps): Promise<Metadata> {
  const { username } = await params;
  const builder = await getPublicProfileBuilderState(username);

  if (!builder) {
    return {
      title: 'Profile not found · Griit',
    };
  }

  const primaryGoal = builder.goals.find((goal) => goal.isEnabled);

  return {
    title: `${builder.profile.displayName} · Griit`,
    description:
      primaryGoal?.title ?? builder.profile.bio ?? 'Athlete profile on Griit',
  };
}

export default async function PublicProfilePage({
  params,
}: PublicProfilePageProps) {
  const { username } = await params;
  const builder = await getPublicProfileBuilderState(username);

  if (!builder) {
    notFound();
  }

  return (
    <>
      {builder.profile.id ? (
        <ProfileAnalyticsTracker profileId={builder.profile.id} />
      ) : null}
      <PublicProfileView builder={builder} />
    </>
  );
}
