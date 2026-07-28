export const socialPlatforms = [
  {
    id: 'instagram',
    label: 'Instagram',
    inputLabel: 'Username',
    placeholder: 'username',
    inputType: 'text',
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    inputLabel: 'Username',
    placeholder: 'username',
    inputType: 'text',
  },
  {
    id: 'youtube',
    label: 'YouTube',
    inputLabel: 'Channel handle',
    placeholder: 'channel',
    inputType: 'text',
  },
  {
    id: 'strava',
    label: 'Strava',
    inputLabel: 'Athlete ID',
    placeholder: '12345678',
    inputType: 'text',
  },
  {
    id: 'x',
    label: 'X',
    inputLabel: 'Username',
    placeholder: 'username',
    inputType: 'text',
  },
  {
    id: 'facebook',
    label: 'Facebook',
    inputLabel: 'Username',
    placeholder: 'username',
    inputType: 'text',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    inputLabel: 'Username',
    placeholder: 'username',
    inputType: 'text',
  },
  {
    id: 'email',
    label: 'Email',
    inputLabel: 'Email address',
    placeholder: 'hello@example.com',
    inputType: 'email',
  },
  {
    id: 'phone',
    label: 'Phone',
    inputLabel: 'Phone number',
    placeholder: '+33 6 12 34 56 78',
    inputType: 'tel',
  },
  {
    id: 'website',
    label: 'Website',
    inputLabel: 'Website URL',
    placeholder: 'https://example.com',
    inputType: 'url',
  },
] as const;

export type SocialPlatformId = (typeof socialPlatforms)[number]['id'];

export function isSocialPlatformId(value: unknown): value is SocialPlatformId {
  return socialPlatforms.some((platform) => platform.id === value);
}

const profileBaseUrls: Partial<Record<SocialPlatformId, string>> = {
  instagram: 'https://instagram.com/',
  tiktok: 'https://tiktok.com/@',
  youtube: 'https://youtube.com/@',
  strava: 'https://strava.com/athletes/',
  x: 'https://x.com/',
  facebook: 'https://facebook.com/',
  linkedin: 'https://linkedin.com/in/',
};

function isAbsoluteUrl(value: string) {
  return /^https?:\/\//i.test(value);
}

function cleanProfileIdentifier(value: string) {
  return value
    .trim()
    .replace(/^@+/, '')
    .replace(/^\/+|\/+$/g, '')
    .split(/[?#]/, 1)[0]
    .replace(/\s+/g, '');
}

export function getSocialInputValue(platform: string, value: string) {
  const trimmedValue = value.trim();
  if (platform === 'email' || platform === 'phone' || platform === 'website') {
    return trimmedValue;
  }
  if (!trimmedValue || !isAbsoluteUrl(trimmedValue)) {
    return cleanProfileIdentifier(trimmedValue);
  }

  try {
    const url = new URL(trimmedValue);
    const path = decodeURIComponent(url.pathname).replace(/^\/+|\/+$/g, '');

    if (platform === 'linkedin') return path.replace(/^in\//i, '');
    if (platform === 'strava') return path.replace(/^athletes\//i, '');
    if (platform === 'youtube') {
      if (/^(channel|c|user)\//i.test(path)) return path;
      return cleanProfileIdentifier(path);
    }

    return cleanProfileIdentifier(path);
  } catch {
    return cleanProfileIdentifier(trimmedValue);
  }
}

export function buildSocialProfileUrl(platform: string, value: string) {
  const trimmedValue = value.trim();
  if (!trimmedValue) return '';
  if (platform === 'email' || platform === 'phone') return trimmedValue;
  if (isAbsoluteUrl(trimmedValue)) return trimmedValue;
  if (platform === 'website') return trimmedValue;

  const identifier = cleanProfileIdentifier(trimmedValue);
  const baseUrl = profileBaseUrls[platform as SocialPlatformId];
  if (!baseUrl) return trimmedValue;

  if (platform === 'youtube' && /^(channel|c|user)\//i.test(identifier)) {
    return `https://youtube.com/${identifier}`;
  }

  return `${baseUrl}${identifier}`;
}

export function getSocialLinkHref(platform: string, value: string) {
  if (platform === 'email') {
    return value.startsWith('mailto:') ? value : `mailto:${value}`;
  }

  if (platform === 'phone') {
    const phoneNumber = value.replace(/[^+\d]/g, '');
    return value.startsWith('tel:') ? value : `tel:${phoneNumber}`;
  }

  return buildSocialProfileUrl(platform, value);
}
