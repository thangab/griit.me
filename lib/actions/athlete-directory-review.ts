'use server';

import { revalidatePath, updateTag } from 'next/cache';
import {
  createServerSupabaseClient,
  createServiceSupabaseClient,
} from '@/lib/config/supabase-server';
import { athleteDirectoryCacheTag } from '@/lib/cache/profile-cache';

export type DirectoryReviewActionState = {
  success: boolean;
  message: string;
};

async function getAuthenticatedUser() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.auth.getUser();
  return data.user;
}

async function userIsAdmin(userId: string) {
  const serviceSupabase = createServiceSupabaseClient();
  const { data } = await serviceSupabase
    .from('profiles')
    .select('is_admin')
    .eq('id', userId)
    .maybeSingle();

  return data?.is_admin === true;
}

function refreshPreviewSurfaces() {
  revalidatePath('/');
  revalidatePath('/athletes');
  revalidatePath('/inspiration');
  revalidatePath('/dashboard/admin/athletes');
  updateTag(athleteDirectoryCacheTag);
}

function refreshDirectoryReviewPages(profileId: number) {
  refreshPreviewSurfaces();
  revalidatePath(`/dashboard/profiles/${profileId}`);
  revalidatePath(`/dashboard/profiles/${profileId}/settings`);
}

export async function saveAthletePreviewImageAction(
  _previousState: DirectoryReviewActionState,
  formData: FormData,
): Promise<DirectoryReviewActionState> {
  const user = await getAuthenticatedUser();
  if (!user || !(await userIsAdmin(user.id))) {
    return { success: false, message: 'Administrator access required.' };
  }

  const profileId = Number(formData.get('profileId'));
  const rawPreviewImageUrl = String(
    formData.get('previewImageUrl') ?? '',
  ).trim();
  if (!Number.isInteger(profileId) || profileId <= 0) {
    return { success: false, message: 'Invalid profile.' };
  }

  let previewImageUrl: string | null = null;
  if (rawPreviewImageUrl) {
    try {
      const parsedUrl = new URL(rawPreviewImageUrl);
      if (parsedUrl.protocol !== 'https:' && parsedUrl.protocol !== 'http:') {
        throw new Error('Unsupported protocol.');
      }
      previewImageUrl = parsedUrl.toString();
    } catch {
      return { success: false, message: 'Invalid preview image URL.' };
    }
  }

  const serviceSupabase = createServiceSupabaseClient();
  const { data: updatedProfile, error } = await serviceSupabase
    .from('public_profiles')
    .update({ preview_image_url: previewImageUrl })
    .eq('id', profileId)
    .select('id')
    .maybeSingle();

  if (error || !updatedProfile) {
    return {
      success: false,
      message: error?.message ?? 'Profile not found.',
    };
  }

  refreshDirectoryReviewPages(profileId);
  return {
    success: true,
    message: previewImageUrl
      ? 'Preview image saved.'
      : 'Preview image removed.',
  };
}

export async function moderateAthleteDirectoryAction(
  _previousState: DirectoryReviewActionState,
  formData: FormData,
): Promise<DirectoryReviewActionState> {
  const user = await getAuthenticatedUser();
  if (!user || !(await userIsAdmin(user.id))) {
    return { success: false, message: 'Administrator access required.' };
  }

  const profileId = Number(formData.get('profileId'));
  const decision = formData.get('decision');
  const rejectionReason = String(formData.get('rejectionReason') ?? '').trim();

  if (!Number.isInteger(profileId) || profileId <= 0) {
    return { success: false, message: 'Invalid profile.' };
  }
  if (decision !== 'approved' && decision !== 'rejected') {
    return { success: false, message: 'Invalid review decision.' };
  }
  if (decision === 'rejected' && !rejectionReason) {
    return {
      success: false,
      message: 'Add a short explanation before requesting changes.',
    };
  }

  const serviceSupabase = createServiceSupabaseClient();
  const { data: profile } = await serviceSupabase
    .from('public_profiles')
    .select('is_published, is_discoverable')
    .eq('id', profileId)
    .maybeSingle();

  if (!profile) return { success: false, message: 'Profile not found.' };
  if (
    decision === 'approved' &&
    (!profile.is_published || !profile.is_discoverable)
  ) {
    return {
      success: false,
      message: 'Only a live, discoverable profile can be approved.',
    };
  }

  const now = new Date().toISOString();
  const { data: updatedReview, error } = await serviceSupabase
    .from('athlete_directory_reviews')
    .update({
      status: decision,
      reviewed_at: now,
      reviewed_by: user.id,
      rejection_reason: decision === 'rejected' ? rejectionReason : null,
      updated_at: now,
    })
    .eq('profile_id', profileId)
    .select('profile_id')
    .maybeSingle();

  if (error || !updatedReview) {
    return {
      success: false,
      message: error?.message ?? 'This profile has not been submitted yet.',
    };
  }

  refreshDirectoryReviewPages(profileId);
  return {
    success: true,
    message:
      decision === 'approved'
        ? 'Profile approved for the athlete directory.'
        : 'Profile removed from the athlete directory.',
  };
}

export async function resubmitAthleteDirectoryReviewAction(
  _previousState: DirectoryReviewActionState,
  formData: FormData,
): Promise<DirectoryReviewActionState> {
  const user = await getAuthenticatedUser();
  if (!user) return { success: false, message: 'Sign in to continue.' };

  const profileId = Number(formData.get('profileId'));
  if (!Number.isInteger(profileId) || profileId <= 0) {
    return { success: false, message: 'Invalid profile.' };
  }

  const serviceSupabase = createServiceSupabaseClient();
  const { data: profile } = await serviceSupabase
    .from('public_profiles')
    .select('id, is_published, is_discoverable')
    .eq('id', profileId)
    .eq('user_id', user.id)
    .maybeSingle();

  if (!profile) return { success: false, message: 'Profile not found.' };
  if (!profile.is_published || !profile.is_discoverable) {
    return {
      success: false,
      message: 'Make the profile live and enable directory discovery first.',
    };
  }

  const now = new Date().toISOString();
  const { error } = await serviceSupabase
    .from('athlete_directory_reviews')
    .upsert(
      {
        profile_id: profileId,
        status: 'pending',
        submitted_at: now,
        reviewed_at: null,
        reviewed_by: null,
        rejection_reason: null,
        updated_at: now,
      },
      { onConflict: 'profile_id' },
    );

  if (error) return { success: false, message: error.message };

  refreshDirectoryReviewPages(profileId);
  return { success: true, message: 'Profile sent back to the GRIIT team.' };
}
