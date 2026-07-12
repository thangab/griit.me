import { DesignWorkspace } from '@/components/dashboard/design-workspace';
import { getProfileBuilderState } from '@/lib/services/profile-builder';

export default async function DesignPage() {
  const builder = await getProfileBuilderState();

  return <DesignWorkspace builder={builder} />;
}
