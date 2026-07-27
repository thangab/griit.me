import 'server-only';

import { cache } from 'react';
import {
  createServerSupabaseClient,
  createServiceSupabaseClient,
} from '@/lib/config/supabase-server';

export const directoryReviewStatuses = [
  'pending',
  'approved',
  'rejected',
] as const;

export type DirectoryReviewStatus = (typeof directoryReviewStatuses)[number];

export type DirectoryReview = {
  profileId: number;
  status: DirectoryReviewStatus;
  submittedAt: string;
  reviewedAt: string | null;
  rejectionReason: string;
};

export type AdminDirectoryReview = DirectoryReview & {
  username: string;
  displayName: string;
  avatarUrl: string;
  isPublished: boolean;
  isDiscoverable: boolean;
};

type ReviewRow = {
  profile_id: number;
  status: DirectoryReviewStatus;
  submitted_at: string;
  reviewed_at: string | null;
  rejection_reason: string | null;
};

function mapReview(row: ReviewRow): DirectoryReview {
  return {
    profileId: row.profile_id,
    status: row.status,
    submittedAt: row.submitted_at,
    reviewedAt: row.reviewed_at,
    rejectionReason: row.rejection_reason ?? '',
  };
}

export const isCurrentUserAdmin = cache(async function isCurrentUserAdmin() {
  const supabase = await createServerSupabaseClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return false;

  const serviceSupabase = createServiceSupabaseClient();
  const { data } = await serviceSupabase
    .from('profiles')
    .select('is_admin')
    .eq('id', userData.user.id)
    .maybeSingle();

  return data?.is_admin === true;
});

export async function getOwnedProfileDirectoryReview(
  profileId: number,
): Promise<DirectoryReview | null> {
  const supabase = await createServerSupabaseClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return null;

  const serviceSupabase = createServiceSupabaseClient();
  const { data: profile } = await serviceSupabase
    .from('public_profiles')
    .select('id')
    .eq('id', profileId)
    .eq('user_id', userData.user.id)
    .maybeSingle();

  if (!profile) return null;

  const { data } = await serviceSupabase
    .from('athlete_directory_reviews')
    .select('profile_id, status, submitted_at, reviewed_at, rejection_reason')
    .eq('profile_id', profileId)
    .maybeSingle();

  return data ? mapReview(data as ReviewRow) : null;
}

export async function submitProfileForDirectoryReview(profileId: number) {
  const serviceSupabase = createServiceSupabaseClient();
  const { data: profile, error: profileError } = await serviceSupabase
    .from('public_profiles')
    .select('id, is_published, is_discoverable')
    .eq('id', profileId)
    .maybeSingle();

  if (profileError || !profile) {
    return {
      submitted: false,
      error: profileError?.message ?? 'Profile not found.',
    };
  }

  if (!profile.is_published || !profile.is_discoverable) {
    return { submitted: false, error: null };
  }

  const { data: existing, error: reviewError } = await serviceSupabase
    .from('athlete_directory_reviews')
    .select('status')
    .eq('profile_id', profileId)
    .maybeSingle();

  if (reviewError) return { submitted: false, error: reviewError.message };
  if (existing) return { submitted: false, error: null };

  const now = new Date().toISOString();
  const { error } = await serviceSupabase
    .from('athlete_directory_reviews')
    .insert({
      profile_id: profileId,
      status: 'pending',
      submitted_at: now,
      created_at: now,
      updated_at: now,
    });

  return { submitted: !error, error: error?.message ?? null };
}

export async function getAdminDirectoryReviews(): Promise<
  AdminDirectoryReview[] | null
> {
  if (!(await isCurrentUserAdmin())) return null;

  const serviceSupabase = createServiceSupabaseClient();
  const { data: reviews } = await serviceSupabase
    .from('athlete_directory_reviews')
    .select('profile_id, status, submitted_at, reviewed_at, rejection_reason')
    .order('submitted_at', { ascending: false });

  const reviewRows = (reviews ?? []) as ReviewRow[];
  if (!reviewRows.length) return [];

  const { data: profiles } = await serviceSupabase
    .from('public_profiles')
    .select(
      'id, username, display_name, avatar_url, is_published, is_discoverable',
    )
    .in(
      'id',
      reviewRows.map((review) => review.profile_id),
    );

  const profileById = new Map(
    (profiles ?? []).map((profile) => [profile.id, profile]),
  );

  return reviewRows.flatMap((review) => {
    const profile = profileById.get(review.profile_id);
    if (!profile) return [];

    return [
      {
        ...mapReview(review),
        username: profile.username,
        displayName: profile.display_name,
        avatarUrl: profile.avatar_url ?? '',
        isPublished: profile.is_published,
        isDiscoverable: profile.is_discoverable,
      },
    ];
  });
}
