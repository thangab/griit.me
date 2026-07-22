import type { Metadata } from 'next';
import { AthleteDirectoryPage } from './_components/athlete-directory-page';

export const metadata: Metadata = {
  title: 'Athletes — Griit',
  description:
    'Discover athlete profiles on Griit. Browse goals, stories, and achievements, then filter athletes by sport.',
};

export default function AthletesPage() {
  return <AthleteDirectoryPage />;
}
