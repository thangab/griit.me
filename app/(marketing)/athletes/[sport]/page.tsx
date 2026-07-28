import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/json-ld';
import { getRequestLocale } from '@/lib/i18n/server';
import { createMarketingMetadata, getSiteUrl } from '@/lib/seo/metadata';
import { AthleteDirectoryPage } from '../_components/athlete-directory-page';
import { getAthleteDirectory } from '@/lib/services/athlete-directory';

type AthleteSportPageProps = {
  params: Promise<{ sport: string }>;
};

export async function generateMetadata({
  params,
}: AthleteSportPageProps): Promise<Metadata> {
  const { sport: sportSlug } = await params;
  const directory = await getAthleteDirectory();
  const sport = directory.sports.find((item) => item.slug === sportSlug);

  if (!sport) return {};

  const locale = await getRequestLocale();
  const isFrench = locale === 'fr';
  const hasAthletes = directory.athletes.some((athlete) =>
    athlete.sports.some((item) => item.slug === sport.slug),
  );

  return {
    ...createMarketingMetadata({
      title: isFrench
        ? `Athlètes en ${sport.name} — Griit`
        : `${sport.name} athletes — Griit`,
      description: isFrench
        ? `Découvrez des profils de sportifs en ${sport.name.toLowerCase()}, leurs objectifs, leurs réussites et leurs parcours.`
        : `Discover ${sport.name.toLowerCase()} athlete profiles, goals, stories, and achievements on Griit.`,
      path: `/athletes/${sport.slug}`,
      locale,
    }),
    robots: hasAthletes
      ? { index: true, follow: true }
      : { index: false, follow: true },
  };
}

export default async function AthleteSportPage({
  params,
}: AthleteSportPageProps) {
  const { sport: sportSlug } = await params;
  const directory = await getAthleteDirectory();
  const sport = directory.sports.find((item) => item.slug === sportSlug);

  return (
    <>
      {sport ? (
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Griit',
                item: getSiteUrl(),
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Athletes',
                item: `${getSiteUrl()}/athletes`,
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: sport.name,
                item: `${getSiteUrl()}/athletes/${sport.slug}`,
              },
            ],
          }}
        />
      ) : null}
      <AthleteDirectoryPage sportSlug={sportSlug} />
    </>
  );
}
