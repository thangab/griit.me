import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { getThemeRuntime } from '@/lib/constants/profile-theme';
import {
  getMediaCaption,
  getMediaSourceUrl,
  parseMediaUrl,
} from '@/lib/utils/media-embed';
import type {
  BuilderBlock,
  ProfileBuilderState,
} from '@/lib/types/profile-builder';

export function MediaBlock({
  block,
  builder,
  presentation = 'card',
}: {
  block: BuilderBlock;
  builder: ProfileBuilderState;
  presentation?: 'card' | 'poster';
}) {
  const sourceUrl = getMediaSourceUrl(block.content);
  const caption = getMediaCaption(block.content);
  const media = parseMediaUrl(sourceUrl);
  const theme = getThemeRuntime(builder.profile.theme);

  if (!media) return null;

  const player = (
    <div
      className={cn(
        'relative w-full overflow-hidden bg-black',
        theme.radiusClass,
        media.provider === 'tiktok'
          ? 'mx-auto aspect-[9/16] max-w-sm'
          : 'aspect-video',
      )}
    >
      <iframe
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="absolute inset-0 h-full w-full border-0"
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        src={media.embedUrl}
        title={caption || `${media.provider} video`}
      />
    </div>
  );

  if (presentation === 'poster') {
    return (
      <div className="col-span-full">
        {player}
        {caption ? (
          <p
            className="mt-3 text-sm leading-6"
            style={{ color: theme.palette.description }}
          >
            {caption}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div
      className={cn(theme.radiusClass, 'p-4 shadow-sm sm:p-5')}
      style={{
        backgroundColor: theme.palette.surface,
        color: theme.palette.text,
        ...theme.blockStyle,
      }}
    >
      {player}
      {caption ? (
        <p
          className="mt-3 text-sm leading-6"
          style={{ color: theme.palette.description }}
        >
          {caption}
        </p>
      ) : null}
      <a
        data-analytics-event="media_open"
        data-analytics-target-key={block.analyticsKey}
        data-analytics-target-type="block"
        className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium"
        href={sourceUrl}
        rel="noreferrer"
        style={{ color: theme.palette.mutedDescription }}
        target="_blank"
      >
        Open on{' '}
        {media.provider === 'youtube'
          ? 'YouTube'
          : media.provider === 'vimeo'
            ? 'Vimeo'
            : 'TikTok'}
        <ExternalLink className="h-3 w-3" />
      </a>
    </div>
  );
}
