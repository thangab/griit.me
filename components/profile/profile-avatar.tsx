'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils/cn';

export function ProfileAvatar({
  avatarUrl,
  displayName,
  size,
  className,
  priority = false,
}: {
  avatarUrl: string;
  displayName: string;
  size: number;
  className?: string;
  priority?: boolean;
}) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const showImage = Boolean(avatarUrl) && avatarUrl !== failedUrl;
  const initials = displayName.trim().slice(0, 2) || '?';

  return (
    <div
      className={cn(
        'relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border-2 text-sm font-bold uppercase',
        className,
      )}
      style={{ width: size, height: size }}
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
  );
}
