import { redirect } from 'next/navigation';
import { getSession } from '@/lib/actions/auth';

export async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session?.authenticated) {
    redirect('/auth/sign-in');
  }

  return <>{children}</>;
}
