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
  const title =
    builder.profile.seoTitle || `${builder.profile.displayName} · Griit`;
  const description =
    builder.profile.seoDescription ||
    primaryGoal?.title ||
    builder.profile.bio ||
    'Athlete profile on Griit';
  const shareImage =
    builder.profile.shareImageUrl || builder.profile.avatarUrl || undefined;
  const appUrl = (
    process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  ).replace(/\/$/, '');
  const publicUrl = `${appUrl}/${builder.profile.username}`;

  return {
    title,
    description,
    alternates: { canonical: publicUrl },
    robots: builder.profile.allowIndexing
      ? { index: true, follow: true }
      : { index: false, follow: false },
    openGraph: {
      title,
      description,
      type: 'profile',
      url: publicUrl,
      images: shareImage ? [{ url: shareImage }] : undefined,
    },
    twitter: {
      card: shareImage ? 'summary_large_image' : 'summary',
      title,
      description,
      images: shareImage ? [shareImage] : undefined,
    },
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
