import {
  FacebookLogoIcon,
  GlobeIcon as Globe2,
  InstagramLogoIcon,
  LinkedinLogoIcon,
  EnvelopeSimpleIcon as Mail,
  PhoneIcon as Phone,
  TiktokLogoIcon,
  YoutubeLogoIcon,
} from '@phosphor-icons/react/ssr';
import { cn } from '@/lib/utils/cn';

export function SocialPlatformIcon({
  platform,
  className,
}: {
  platform: string;
  className?: string;
}) {
  const iconClassName = cn('h-4 w-4 shrink-0', className);

  if (platform === 'instagram') {
    return <InstagramLogoIcon className={iconClassName} weight="light" />;
  }
  if (platform === 'youtube') {
    return <YoutubeLogoIcon className={iconClassName} weight="light" />;
  }
  if (platform === 'facebook') {
    return <FacebookLogoIcon className={iconClassName} weight="light" />;
  }
  if (platform === 'linkedin') {
    return <LinkedinLogoIcon className={iconClassName} weight="light" />;
  }
  if (platform === 'email') return <Mail className={iconClassName} />;
  if (platform === 'phone') return <Phone className={iconClassName} />;
  if (platform === 'tiktok') {
    return <TiktokLogoIcon className={iconClassName} weight="light" />;
  }
  if (platform === 'strava') {
    return (
      <svg
        aria-hidden="true"
        className={iconClassName}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="m15.387 17.944-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.65 2.836 5.65h4.172L10.463 0 3.455 13.828h4.172" />
      </svg>
    );
  }
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
