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
    <div className="mx-auto w-full max-w-[1180px] space-y-6">
      <div className="rounded-[2rem] border border-black/10 bg-white p-7 shadow-[0_18px_50px_rgba(21,21,21,0.05)] sm:p-9">
        <p className="text-[11px] font-black tracking-[0.22em] text-[#3157ff] uppercase">
          Profile settings
        </p>
        <h1 className="mt-4 text-4xl font-black tracking-[-0.05em] sm:text-5xl">
          Settings
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-black/50">
          Manage your public address, visibility, sharing, and profile data.
        </p>
      </div>
      <PublicProfileSettings builder={builder} />
    </div>
  );
}
