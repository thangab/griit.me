import type { NextConfig } from 'next';

function getSupabaseStoragePattern() {
  const value = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!value) return null;

  try {
    const url = new URL(value);
    return {
      protocol:
        url.protocol === 'http:' ? ('http' as const) : ('https' as const),
      hostname: url.hostname,
      pathname: '/storage/v1/object/public/profile-media/**',
    };
  } catch {
    return null;
  }
}

const supabaseStoragePattern = getSupabaseStoragePattern();
const googleAvatarPattern = {
  protocol: 'https' as const,
  hostname: 'lh3.googleusercontent.com',
  pathname: '/**',
};
const legacyUnsplashPattern = {
  protocol: 'https' as const,
  hostname: 'images.unsplash.com',
  pathname: '/**',
};

const nextConfig: NextConfig = {
  typedRoutes: true,
  images: {
    remotePatterns: supabaseStoragePattern
      ? [supabaseStoragePattern, googleAvatarPattern, legacyUnsplashPattern]
      : [googleAvatarPattern, legacyUnsplashPattern],
  },
};

export default nextConfig;
