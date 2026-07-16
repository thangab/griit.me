export type MediaProvider = 'youtube' | 'vimeo' | 'tiktok';

export type ParsedMedia = {
  provider: MediaProvider;
  mediaId: string;
  embedUrl: string;
};

function isSafeYoutubeId(value: string) {
  return /^[a-zA-Z0-9_-]{6,32}$/.test(value);
}

function isSafeNumericId(value: string) {
  return /^\d{6,32}$/.test(value);
}

export function parseMediaUrl(value: string): ParsedMedia | null {
  let url: URL;

  try {
    url = new URL(value.trim());
  } catch {
    return null;
  }

  if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;

  const host = url.hostname.toLowerCase().replace(/^www\./, '');
  const segments = url.pathname.split('/').filter(Boolean);

  if (host === 'youtu.be') {
    const mediaId = segments[0] ?? '';
    return isSafeYoutubeId(mediaId)
      ? {
          provider: 'youtube',
          mediaId,
          embedUrl: `https://www.youtube.com/embed/${mediaId}`,
        }
      : null;
  }

  if (
    host === 'youtube.com' ||
    host === 'm.youtube.com' ||
    host === 'music.youtube.com'
  ) {
    const mediaId =
      url.searchParams.get('v') ??
      (['shorts', 'embed', 'live'].includes(segments[0] ?? '')
        ? (segments[1] ?? '')
        : '');

    return isSafeYoutubeId(mediaId)
      ? {
          provider: 'youtube',
          mediaId,
          embedUrl: `https://www.youtube.com/embed/${mediaId}`,
        }
      : null;
  }

  if (host === 'vimeo.com' || host.endsWith('.vimeo.com')) {
    const videoIndex = segments.indexOf('video');
    const mediaId =
      videoIndex >= 0
        ? (segments[videoIndex + 1] ?? '')
        : ([...segments].reverse().find(isSafeNumericId) ?? '');

    return isSafeNumericId(mediaId)
      ? {
          provider: 'vimeo',
          mediaId,
          embedUrl: `https://player.vimeo.com/video/${mediaId}`,
        }
      : null;
  }

  if (host === 'tiktok.com' || host.endsWith('.tiktok.com')) {
    const videoIndex = segments.indexOf('video');
    const playerIndex = segments.findIndex(
      (segment, index) => segment === 'player' && segments[index + 1] === 'v1',
    );
    const mediaId =
      videoIndex >= 0
        ? (segments[videoIndex + 1] ?? '')
        : playerIndex >= 0
          ? (segments[playerIndex + 2] ?? '')
          : '';

    return isSafeNumericId(mediaId)
      ? {
          provider: 'tiktok',
          mediaId,
          embedUrl: `https://www.tiktok.com/player/v1/${mediaId}`,
        }
      : null;
  }

  return null;
}

export function getMediaSourceUrl(content: Record<string, unknown>) {
  return typeof content.sourceUrl === 'string' ? content.sourceUrl : '';
}

export function getMediaCaption(content: Record<string, unknown>) {
  return typeof content.caption === 'string' ? content.caption : '';
}
