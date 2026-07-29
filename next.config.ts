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
const demoAvatarPattern = {
  protocol: 'https' as const,
  hostname: 'randomuser.me',
  pathname: '/api/portraits/**',
};

const nextConfig: NextConfig = {
  typedRoutes: true,
  experimental: {
    // This project changes frequently during development. Turbopack's
    // persistent dev cache can grow to several gigabytes and exhaust Node's
    // heap, so keep dev compilation incremental only for the active session.
    turbopackFileSystemCacheForDev: false,
  },
  images: {
    remotePatterns: supabaseStoragePattern
      ? [
          supabaseStoragePattern,
          googleAvatarPattern,
          legacyUnsplashPattern,
          demoAvatarPattern,
        ]
      : [googleAvatarPattern, legacyUnsplashPattern, demoAvatarPattern],
  },
};

export default nextConfig;
