import type { Metadata } from 'next';
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

  return {
    title: `${sport.name} athletes — Griit`,
    description: `Discover ${sport.name.toLowerCase()} athlete profiles, goals, stories, and achievements on Griit.`,
  };
}

export default async function AthleteSportPage({
  params,
}: AthleteSportPageProps) {
  const { sport } = await params;

  return <AthleteDirectoryPage sportSlug={sport} />;
}
