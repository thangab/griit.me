import {
  CalendarDotsIcon as CalendarDays,
  TimerIcon as Timer,
} from '@phosphor-icons/react/ssr';
import { getThemeRuntime } from '@/lib/constants/profile-theme';
import type { ProfileBuilderState } from '@/lib/types/profile-builder';
import type { GoalDateDisplay } from '@/lib/utils/goal-date';
import { cn } from '@/lib/utils/cn';

export function GoalDateIcon({
  display,
  className,
}: {
  display: GoalDateDisplay;
  className?: string;
}) {
  const Icon = display === 'countdown' ? Timer : CalendarDays;

  return <Icon className={className} />;
}

export function GoalDateBadge({
  builder,
  display,
  label,
  prefix,
  className,
}: {
  builder: ProfileBuilderState;
  display: GoalDateDisplay;
  label: string;
  prefix?: string;
  className?: string;
}) {
  const theme = getThemeRuntime(builder.profile.theme);

  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold',
        className,
      )}
      style={{
        backgroundColor: theme.palette.accent,
        color: theme.palette.accentText,
      }}
    >
      <GoalDateIcon className="h-3.5 w-3.5" display={display} />
      <span>
        {prefix ? `${prefix}: ` : ''}
        {label}
      </span>
    </span>
  );
}
