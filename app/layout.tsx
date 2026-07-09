import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/lib/providers/app-provider';

export const metadata: Metadata = {
  title: 'Griit',
  description: 'Athlete identity platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
