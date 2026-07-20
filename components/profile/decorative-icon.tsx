import {
  Activity,
  Ban,
  Bike,
  Dumbbell,
  Flag,
  Gauge,
  Medal,
  Shield,
  Sparkles,
  Target,
  Timer,
  Trophy,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import type { DecorativeIconId } from '@/lib/constants/profile-theme';

const decorativeIconComponents: Record<
  Exclude<DecorativeIconId, 'auto' | 'none'>,
  LucideIcon
> = {
  target: Target,
  gauge: Gauge,
  shield: Shield,
  zap: Zap,
  dumbbell: Dumbbell,
  timer: Timer,
  trophy: Trophy,
  bike: Bike,
  medal: Medal,
  activity: Activity,
  flag: Flag,
};

export const decorativeIconOptions: Array<{
  id: DecorativeIconId;
  label: string;
  icon: LucideIcon;
}> = [
  { id: 'auto', label: 'Template default', icon: Sparkles },
  { id: 'none', label: 'None', icon: Ban },
  { id: 'target', label: 'Target', icon: Target },
  { id: 'gauge', label: 'Speed', icon: Gauge },
  { id: 'shield', label: 'Shield', icon: Shield },
  { id: 'zap', label: 'Energy', icon: Zap },
  { id: 'dumbbell', label: 'Strength', icon: Dumbbell },
  { id: 'timer', label: 'Timer', icon: Timer },
  { id: 'trophy', label: 'Trophy', icon: Trophy },
  { id: 'bike', label: 'Cycling', icon: Bike },
  { id: 'medal', label: 'Medal', icon: Medal },
  { id: 'activity', label: 'Activity', icon: Activity },
  { id: 'flag', label: 'Flag', icon: Flag },
];

export function ProfileDecorativeIcon({
  iconId,
  fallback,
  className,
}: {
  iconId: DecorativeIconId;
  fallback: LucideIcon;
  className?: string;
}) {
  if (iconId === 'none') return null;

  const icon = iconId === 'auto' ? fallback : decorativeIconComponents[iconId];

  return createElement(icon, { 'aria-hidden': true, className });
}
import { createElement } from 'react';
