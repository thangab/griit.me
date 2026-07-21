import { createElement } from 'react';
import {
  AtomIcon as Atom,
  BarbellIcon as Barbell,
  BicycleIcon as Bicycle,
  BoxingGloveIcon as BoxingGlove,
  CompassIcon as Compass,
  CrownIcon as Crown,
  CrosshairIcon as Crosshair,
  DiamondIcon as Diamond,
  FireIcon as Fire,
  FlagIcon as Flag,
  FootprintsIcon as Footprints,
  GaugeIcon as Gauge,
  HeartbeatIcon as Heartbeat,
  LightningIcon as Lightning,
  MedalIcon as Medal,
  MountainsIcon as Mountains,
  PersonSimpleRunIcon as PersonSimpleRun,
  ProhibitIcon as Prohibit,
  PulseIcon as Pulse,
  RocketIcon as Rocket,
  SealCheckIcon as SealCheck,
  ShieldIcon as Shield,
  SoccerBallIcon as SoccerBall,
  SparkleIcon as Sparkle,
  StarIcon as Star,
  TargetIcon as Target,
  TimerIcon as Timer,
  TrophyIcon as Trophy,
  WavesIcon as Waves,
} from '@phosphor-icons/react/ssr';
import type { Icon as PhosphorIcon } from '@phosphor-icons/react';
import type { DecorativeIconId } from '@/lib/constants/profile-theme';
import type { ProfileTemplateId } from '@/lib/constants/profile-templates';

export const templateDecorativeIcons: Record<ProfileTemplateId, PhosphorIcon> =
  {
    goal_spotlight: Target,
    sport_running: Gauge,
    sport_boxing: Shield,
    sport_mma: Lightning,
    sport_strength: Barbell,
    sport_hyrox: Timer,
    sport_football: Trophy,
    sport_cycling: Bicycle,
  };

const decorativeIconComponents: Record<
  Exclude<DecorativeIconId, 'auto' | 'none'>,
  PhosphorIcon
> = {
  target: Target,
  gauge: Gauge,
  shield: Shield,
  zap: Lightning,
  dumbbell: Barbell,
  timer: Timer,
  trophy: Trophy,
  bike: Bicycle,
  medal: Medal,
  activity: Pulse,
  flag: Flag,
  flame: Fire,
  heart: Heartbeat,
  footprints: Footprints,
  mountain: Mountains,
  waves: Waves,
  award: SealCheck,
  star: Star,
  rocket: Rocket,
  crown: Crown,
  crosshair: Crosshair,
  goal: Target,
  swords: BoxingGlove,
  biceps: Barbell,
  ball: SoccerBall,
  runner: PersonSimpleRun,
  compass: Compass,
  gem: Diamond,
  orbit: Atom,
};

export const decorativeIconOptions: Array<{
  id: DecorativeIconId;
  label: string;
  icon: PhosphorIcon;
}> = [
  { id: 'auto', label: 'Template default', icon: Sparkle },
  { id: 'none', label: 'None', icon: Prohibit },
  { id: 'target', label: 'Target', icon: Target },
  { id: 'gauge', label: 'Speed', icon: Gauge },
  { id: 'shield', label: 'Shield', icon: Shield },
  { id: 'zap', label: 'Energy', icon: Lightning },
  { id: 'dumbbell', label: 'Strength', icon: Barbell },
  { id: 'timer', label: 'Timer', icon: Timer },
  { id: 'trophy', label: 'Trophy', icon: Trophy },
  { id: 'bike', label: 'Cycling', icon: Bicycle },
  { id: 'medal', label: 'Medal', icon: Medal },
  { id: 'activity', label: 'Activity', icon: Pulse },
  { id: 'flag', label: 'Flag', icon: Flag },
  { id: 'flame', label: 'Flame', icon: Fire },
  { id: 'heart', label: 'Heart rate', icon: Heartbeat },
  { id: 'footprints', label: 'Footprints', icon: Footprints },
  { id: 'mountain', label: 'Mountain', icon: Mountains },
  { id: 'waves', label: 'Swimming', icon: Waves },
  { id: 'award', label: 'Award', icon: SealCheck },
  { id: 'star', label: 'Star', icon: Star },
  { id: 'rocket', label: 'Rocket', icon: Rocket },
  { id: 'crown', label: 'Crown', icon: Crown },
  { id: 'crosshair', label: 'Precision', icon: Crosshair },
  { id: 'goal', label: 'Goal', icon: Target },
  { id: 'swords', label: 'Combat', icon: BoxingGlove },
  { id: 'biceps', label: 'Biceps', icon: Barbell },
  { id: 'ball', label: 'Ball', icon: SoccerBall },
  { id: 'runner', label: 'Athlete', icon: PersonSimpleRun },
  { id: 'compass', label: 'Compass', icon: Compass },
  { id: 'gem', label: 'Gem', icon: Diamond },
  { id: 'orbit', label: 'Orbit', icon: Atom },
];

export function ProfileDecorativeIcon({
  iconId,
  fallback,
  className,
}: {
  iconId: DecorativeIconId;
  fallback: PhosphorIcon;
  className?: string;
}) {
  if (iconId === 'none') return null;

  const icon =
    iconId === 'auto'
      ? fallback
      : (decorativeIconComponents[iconId] ?? fallback);

  return createElement(icon, {
    'aria-hidden': true,
    className,
    weight: 'light',
  });
}
