export const socialPlatforms = [
  { id: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/username' },
  { id: 'tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/@username' },
  { id: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/@channel' },
  { id: 'strava', label: 'Strava', placeholder: 'https://strava.com/athletes/...' },
  { id: 'x', label: 'X', placeholder: 'https://x.com/username' },
  { id: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/username' },
  { id: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/username' },
  { id: 'email', label: 'Email', placeholder: 'hello@example.com' },
  { id: 'phone', label: 'Phone', placeholder: '+33 6 12 34 56 78' },
  { id: 'website', label: 'Website', placeholder: 'https://example.com' },
] as const;

export type SocialPlatformId = (typeof socialPlatforms)[number]['id'];

export function isSocialPlatformId(value: unknown): value is SocialPlatformId {
  return socialPlatforms.some((platform) => platform.id === value);
}

export function getSocialLinkHref(platform: string, value: string) {
  if (platform === 'email') {
    return value.startsWith('mailto:') ? value : `mailto:${value}`;
  }

  if (platform === 'phone') {
    const phoneNumber = value.replace(/[^+\d]/g, '');
    return value.startsWith('tel:') ? value : `tel:${phoneNumber}`;
  }

  return value;
}
