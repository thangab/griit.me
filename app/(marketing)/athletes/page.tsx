import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/json-ld';
import { getRequestLocale } from '@/lib/i18n/server';
import { createMarketingMetadata, getSiteUrl } from '@/lib/seo/metadata';
import { AthleteDirectoryPage } from './_components/athlete-directory-page';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const isFrench = locale === 'fr';

  return createMarketingMetadata({
    title: isFrench ? 'Athlètes à suivre — Griit' : 'Meet the athletes — Griit',
    description: isFrench
      ? 'Découvrez des profils de sportifs, leurs objectifs, leurs réussites et le travail derrière leurs performances.'
      : 'Discover athlete profiles, current goals, achievements, and the work behind their performances.',
    path: '/athletes',
    locale,
  });
}

export default function AthletesPage() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Griit athletes',
          url: `${getSiteUrl()}/athletes`,
          isPartOf: { '@type': 'WebSite', url: getSiteUrl(), name: 'Griit' },
        }}
      />
      <AthleteDirectoryPage />
    </>
  );
}
