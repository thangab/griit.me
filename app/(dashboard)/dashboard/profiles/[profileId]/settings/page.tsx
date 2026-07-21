import { notFound } from 'next/navigation';
import { PublicProfileSettings } from '@/components/settings/public-profile-settings';
import { getProfileBuilderState } from '@/lib/services/profile-builder';

export default async function ProfileSettingsPage({
  params,
}: {
  params: Promise<{ profileId: string }>;
}) {
  const profileId = Number((await params).profileId);
  if (!Number.isInteger(profileId) || profileId <= 0) notFound();
  const builder = await getProfileBuilderState(profileId);
  if (!builder) notFound();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-muted-foreground text-sm font-medium">
          Profile settings
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Public address
        </h1>
      </div>
      <PublicProfileSettings builder={builder} />
    </div>
  );
}
