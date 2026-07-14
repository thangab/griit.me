import {
  Facebook,
  Globe2,
  Instagram,
  Linkedin,
  Mail,
  Music2,
  Phone,
  Route,
  Youtube,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export function SocialPlatformIcon({
  platform,
  className,
}: {
  platform: string;
  className?: string;
}) {
  const iconClassName = cn('h-4 w-4 shrink-0', className);

  if (platform === 'instagram') return <Instagram className={iconClassName} />;
  if (platform === 'youtube') return <Youtube className={iconClassName} />;
  if (platform === 'facebook') return <Facebook className={iconClassName} />;
  if (platform === 'linkedin') return <Linkedin className={iconClassName} />;
  if (platform === 'email') return <Mail className={iconClassName} />;
  if (platform === 'phone') return <Phone className={iconClassName} />;
  if (platform === 'tiktok') return <Music2 className={iconClassName} />;
  if (platform === 'strava') return <Route className={iconClassName} />;
  if (platform === 'x' || platform === 'twitter') {
    return (
      <svg
        aria-hidden="true"
        className={iconClassName}
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          d="M5 4l14 16M19 4 5 20"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2"
        />
      </svg>
    );
  }

  return <Globe2 className={iconClassName} />;
}
