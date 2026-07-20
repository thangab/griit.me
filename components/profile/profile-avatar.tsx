'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils/cn';

export function ProfileAvatar({
  avatarUrl,
  displayName,
  size,
  className,
}: {
  avatarUrl: string;
  displayName: string;
  size: number;
  className?: string;
}) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const showImage = Boolean(avatarUrl) && avatarUrl !== failedUrl;
  const initials = displayName.trim().slice(0, 2) || '?';

  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center overflow-hidden rounded-full border-2 text-sm font-bold uppercase',
        className,
      )}
      style={{ width: size, height: size }}
    >
      {showImage ? (
        // The URL comes from the public Supabase Storage bucket and is already
        // resized by the fixed avatar container, so Next image optimization is
        // intentionally unnecessary here.
        <img
          alt={`${displayName || 'Profile'} avatar`}
          className="h-full w-full object-cover"
          src={avatarUrl}
          onError={() => setFailedUrl(avatarUrl)}
        />
      ) : (
        <span aria-hidden="true">{initials}</span>
      )}
    </div>
  );
}
