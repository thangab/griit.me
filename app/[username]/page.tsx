import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Route } from 'next';
import { ArrowRightIcon } from '@phosphor-icons/react/ssr';
import { GriitBranding } from '@/components/profile/griit-branding';
import { PublicProfileView } from '@/components/profile/public-profile-view';
import { ProfileAnalyticsTracker } from '@/components/profile/profile-analytics-tracker';
import { JsonLd } from '@/components/seo/json-ld';
import { getPublicProfileBuilderState } from '@/lib/services/profile-builder';
import { getAbsoluteUrl } from '@/lib/seo/metadata';
import { isPastDate } from '@/lib/utils/date-status';
import { getRequestLocale } from '@/lib/i18n/server';
import {
  getProfileTemplate,
  resolveProfileTemplateId,
} from '@/lib/constants/profile-templates';

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
  const showPartnerBranding =
    builder.profile.isComplimentaryPro && !complimentaryAccessExpired;
  const isDemo = builder.profile.username.startsWith('demo_');
  const locale = await getRequestLocale();
  const templateId = resolveProfileTemplateId(builder.profile.theme);
  const demoSignupHref = !getProfileTemplate(templateId)?.proOnly
    ? `/sign-up?template=${templateId}&source=demo_profile&profile=${builder.profile.username}`
    : `/sign-up?source=demo_profile&profile=${builder.profile.username}`;

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
      {isDemo && preview !== '1' ? (
        <Link
          className="fixed right-3 bottom-3 left-3 z-50 mx-auto flex max-w-md items-center justify-between gap-4 rounded-2xl border border-white/15 bg-[#151515] px-5 py-3.5 text-sm font-black text-white shadow-[0_18px_60px_rgba(0,0,0,0.3)] transition hover:-translate-y-0.5 hover:bg-[#3157ff] sm:right-auto sm:bottom-5 sm:left-1/2 sm:-translate-x-1/2 sm:hover:-translate-x-1/2"
          data-marketing-cta="create_from_demo"
          data-marketing-profile={builder.profile.username}
          data-marketing-source="demo_profile"
          data-marketing-template={templateId}
          href={demoSignupHref as Route}
        >
          <span>
            {locale === 'fr'
              ? 'Créer mon profil gratuitement'
              : 'Create my profile for free'}
            <span className="mt-0.5 block text-[10px] font-bold text-white/55">
              {locale === 'fr' ? 'Sans carte bancaire' : 'No card required'}
            </span>
          </span>
          <ArrowRightIcon className="h-4 w-4 shrink-0" weight="bold" />
        </Link>
      ) : null}
      {showBranding || showPartnerBranding ? (
        <GriitBranding
          className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 sm:bottom-5"
          variant={showPartnerBranding ? 'partner' : 'made-with'}
        />
      ) : null}
    </>
  );
}
