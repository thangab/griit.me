import type { Metadata } from 'next';

const productionSiteUrl = 'https://griit.me';

export function getSiteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();

  if (!configuredUrl) return productionSiteUrl;

  try {
    return new URL(configuredUrl).origin;
  } catch {
    return productionSiteUrl;
  }
}

export function getAbsoluteUrl(path = '/') {
  return new URL(path, `${getSiteUrl()}/`).toString();
}

export function createMarketingMetadata({
  title,
  description,
  path,
  locale = 'en',
}: {
  title: string;
  description: string;
  path: string;
  locale?: 'en' | 'fr';
}): Metadata {
  const canonical = getAbsoluteUrl(path);
  const image = getAbsoluteUrl('/opengraph-image');

  return {
    title: { absolute: title },
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'Griit',
      locale: locale === 'fr' ? 'fr_FR' : 'en_US',
      type: 'website',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: 'Griit — athlete profile platform',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}
