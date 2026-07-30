import type { MetadataRoute } from 'next';
import { createPublicSupabaseClient } from '@/lib/config/supabase-server';
import { getAthleteDirectory } from '@/lib/services/athlete-directory';
import { getAbsoluteUrl } from '@/lib/seo/metadata';

export const revalidate = 3600;

type IndexedProfileRow = {
  username: string;
  updated_at: string;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: getAbsoluteUrl('/'), changeFrequency: 'weekly', priority: 1 },
    {
      url: getAbsoluteUrl('/athletes'),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: getAbsoluteUrl('/inspiration'),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: getAbsoluteUrl('/pricing'),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: getAbsoluteUrl('/support'),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: getAbsoluteUrl('/privacy'),
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: getAbsoluteUrl('/terms'),
      changeFrequency: 'yearly',
      priority: 0.2,
    },
  ];

  try {
    const supabase = createPublicSupabaseClient();
    const [directory, reviewsResult] = await Promise.all([
      getAthleteDirectory(),
      supabase
        .from('athlete_directory_reviews')
        .select('profile_id')
        .eq('status', 'approved'),
    ]);
    if (reviewsResult.error) throw reviewsResult.error;

    const approvedProfileIds = (reviewsResult.data ?? []).map(
      (review) => review.profile_id as number,
    );
    const profilesResult = approvedProfileIds.length
      ? await supabase
          .from('public_profiles')
          .select('username, updated_at')
          .in('id', approvedProfileIds)
          .eq('is_published', true)
          .eq('allow_indexing', true)
          .order('updated_at', { ascending: false })
      : { data: [] as IndexedProfileRow[], error: null };
    if (profilesResult.error) throw profilesResult.error;

    const sportsWithAthletes = new Set(
      directory.athletes.flatMap((athlete) =>
        athlete.sports.map((sport) => sport.slug),
      ),
    );
    const sportPages: MetadataRoute.Sitemap = directory.sports
      .filter((sport) => sportsWithAthletes.has(sport.slug))
      .map((sport) => ({
        url: getAbsoluteUrl(`/athletes/${sport.slug}`),
        changeFrequency: 'weekly',
        priority: 0.7,
      }));
    const profilePages: MetadataRoute.Sitemap = (
      (profilesResult.data ?? []) as IndexedProfileRow[]
    ).map((profile) => ({
      url: getAbsoluteUrl(`/${profile.username}`),
      lastModified: new Date(profile.updated_at),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    return [...staticPages, ...sportPages, ...profilePages];
  } catch {
    return staticPages;
  }
}
