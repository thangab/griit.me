import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { GriitBranding } from '@/components/profile/griit-branding';
import { PublicProfileView } from '@/components/profile/public-profile-view';
import { ProfileAnalyticsTracker } from '@/components/profile/profile-analytics-tracker';
import { JsonLd } from '@/components/seo/json-ld';
import { getPublicProfileBuilderState } from '@/lib/services/profile-builder';
import { getAbsoluteUrl } from '@/lib/seo/metadata';
import { isPastDate } from '@/lib/utils/date-status';

type PublicProfilePageProps = {
  params: Promise<{
    username: string;
  }>;
  searchParams: Promise<{
    preview?: string;
  }>;
};

export async function generateMetadata({
  params,
}: PublicProfilePageProps): Promise<Metadata> {
  const { username } = await params;
  const builder = await getPublicProfileBuilderState(username);

  if (!builder) {
    return {
      title: { absolute: 'Profile not found · Griit' },
      robots: { index: false, follow: false },
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
  const publicUrl = getAbsoluteUrl(`/${builder.profile.username}`);

  return {
    title: { absolute: title },
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
  searchParams,
}: PublicProfilePageProps) {
  const { username } = await params;
  const { preview } = await searchParams;
  const builder = await getPublicProfileBuilderState(username);

  if (!builder) {
    notFound();
  }

  const complimentaryAccessExpired = Boolean(
    builder.profile.complimentaryProExpiresAt &&
    isPastDate(builder.profile.complimentaryProExpiresAt),
  );
  const showBranding =
    builder.profile.showBranding || complimentaryAccessExpired;

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ProfilePage',
          url: getAbsoluteUrl(`/${builder.profile.username}`),
          mainEntity: {
            '@type': 'Person',
            name: builder.profile.displayName,
            description: builder.profile.bio || undefined,
            image: builder.profile.avatarUrl || undefined,
            homeLocation: builder.profile.location
              ? {
                  '@type': 'Place',
                  name: builder.profile.location,
                }
              : undefined,
            knowsAbout: builder.profile.sports.length
              ? builder.profile.sports
              : undefined,
          },
        }}
      />
      {builder.profile.id && preview !== '1' ? (
        <ProfileAnalyticsTracker profileId={builder.profile.id} />
      ) : null}
      <PublicProfileView builder={builder} />
      {showBranding ? (
        <GriitBranding className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 sm:bottom-5" />
      ) : null}
    </>
  );
}
