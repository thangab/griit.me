'use client';

import { useState, type CSSProperties } from 'react';
import Image from 'next/image';
import type { AvatarShape } from '@/lib/constants/profile-theme';
import { cn } from '@/lib/utils/cn';

const avatarShapeStyles: Record<AvatarShape, CSSProperties> = {
  circle: { borderRadius: '999px' },
  hexagon: {
    clipPath: 'polygon(24% 4%, 76% 4%, 100% 50%, 76% 96%, 24% 96%, 0 50%)',
  },
  diamond: {
    clipPath: 'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)',
  },
  shield: {
    clipPath: 'polygon(10% 6%, 90% 6%, 90% 57%, 50% 100%, 10% 57%)',
  },
};

const polygonShapes: AvatarShape[] = ['hexagon', 'diamond', 'shield'];

export function ProfileAvatar({
  avatarUrl,
  displayName,
  size,
  shape = 'circle',
  className,
  priority = false,
}: {
  avatarUrl: string;
  displayName: string;
  size: number;
  shape?: AvatarShape;
  className?: string;
  priority?: boolean;
}) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const showImage = Boolean(avatarUrl) && avatarUrl !== failedUrl;
  const initials = displayName.trim().slice(0, 2) || '?';
  const isPolygon = polygonShapes.includes(shape);
  const shapeStyle = avatarShapeStyles[shape];

  return (
    <div
      className={cn(
        'relative flex shrink-0 items-center justify-center overflow-hidden text-sm font-bold uppercase',
        isPolygon ? 'p-[2px]' : 'border-2',
        className,
      )}
      style={{
        width: size,
        height: size,
        ...shapeStyle,
        ...(isPolygon
          ? {
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              filter: 'drop-shadow(0 5px 7px rgba(0, 0, 0, 0.14))',
            }
          : {}),
      }}
    >
      <div
        className="relative flex h-full w-full items-center justify-center overflow-hidden bg-inherit"
        style={shapeStyle}
      >
        {showImage ? (
          <Image
            alt={`${displayName || 'Profile'} avatar`}
            className="h-full w-full object-cover"
            fill
            priority={priority}
            sizes={`${size}px`}
            src={avatarUrl}
            onError={() => setFailedUrl(avatarUrl)}
          />
        ) : (
          <span aria-hidden="true">{initials}</span>
        )}
      </div>
    </div>
  );
}
