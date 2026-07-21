import {
  ArrowUpRightIcon as ArrowUpRight,
  LinkIcon as Link2,
} from '@phosphor-icons/react/ssr';
import Image from 'next/image';
import { getThemeRuntime } from '@/lib/constants/profile-theme';
import type {
  BuilderBlock,
  ProfileBuilderState,
} from '@/lib/types/profile-builder';
import { cn } from '@/lib/utils/cn';

function getText(content: Record<string, unknown>, key: string) {
  return typeof content[key] === 'string' ? content[key].trim() : '';
}

function getHostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

export function LinkBlock({
  block,
  builder,
}: {
  block: BuilderBlock;
  builder: ProfileBuilderState;
}) {
  const theme = getThemeRuntime(builder.profile.theme);
  const url = getText(block.content, 'url');

  if (!/^https?:\/\//i.test(url)) return null;

  const hostname = getHostname(url);
  const title = getText(block.content, 'title') || hostname || 'Open link';
  const description = getText(block.content, 'description');
  const imageUrl = getText(block.content, 'imageUrl');

  return (
    <a
      data-analytics-event="block_click"
      data-analytics-target-key={block.analyticsKey}
      data-analytics-target-type="block"
      className={cn(
        theme.radiusClass,
        'group flex items-center gap-4 border p-4 transition hover:-translate-y-0.5',
      )}
      href={url}
      rel="noreferrer"
      style={{
        backgroundColor: theme.palette.surface,
        color: theme.palette.text,
        ...theme.blockStyle,
      }}
      target="_blank"
    >
      {imageUrl ? (
        <span
          aria-hidden="true"
          className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border"
          style={{
            borderColor: theme.palette.border,
          }}
        >
          <Image
            alt=""
            className="object-cover"
            fill
            sizes="64px"
            src={imageUrl}
          />
        </span>
      ) : (
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
          style={{
            backgroundColor: theme.palette.accent,
            color: theme.palette.accentText,
          }}
        >
          <Link2 className="h-4 w-4" />
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span
          className="block truncate text-sm font-bold"
          style={{ color: theme.palette.blockTitle }}
        >
          {title}
        </span>
        {description ? (
          <span
            className="mt-1 line-clamp-2 block text-xs leading-5"
            style={{ color: theme.palette.description }}
          >
            {description}
          </span>
        ) : hostname && hostname !== title ? (
          <span
            className="mt-1 block truncate text-xs"
            style={{ color: theme.palette.description }}
          >
            {hostname}
          </span>
        ) : null}
      </span>
      <ArrowUpRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </a>
  );
}
