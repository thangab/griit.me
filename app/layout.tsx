import type { Metadata } from 'next';
import { getRequestLocale } from '@/lib/i18n/server';
import { getAbsoluteUrl, getSiteUrl } from '@/lib/seo/metadata';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: 'Griit — The link in bio built for athletes',
    template: '%s | Griit',
  },
  description:
    'Build a public athlete profile around your goals, achievements, content, sponsors, and next opportunities.',
  applicationName: 'Griit',
  authors: [{ name: 'Griit', url: getSiteUrl() }],
  creator: 'Griit',
  publisher: 'Griit',
  category: 'sports',
  keywords: [
    'athlete profile',
    'link in bio for athletes',
    'sports portfolio',
    'athlete media kit',
    'sports profile',
  ],
  openGraph: {
    title: 'Griit — The link in bio built for athletes',
    description:
      'Build a public athlete profile around your next goal and your complete sports journey.',
    url: getSiteUrl(),
    siteName: 'Griit',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: getAbsoluteUrl('/opengraph-image'),
        width: 1200,
        height: 630,
        alt: 'Griit — athlete profile platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Griit — The link in bio built for athletes',
    description:
      'Build a public athlete profile around your next goal and your complete sports journey.',
    images: [getAbsoluteUrl('/opengraph-image')],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getRequestLocale();

  return (
    <html lang={locale}>
      <body>{children}</body>
    </html>
  );
}
