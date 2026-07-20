export const goalDateDisplays = ['date', 'countdown'] as const;

export type GoalDateDisplay = (typeof goalDateDisplays)[number];

function getDateParts(value: string) {
  const [year, month, day] = value.slice(0, 10).split('-').map(Number);
  return { year, month, day };
}

function formatDate(value: string) {
  const { year, month, day } = getDateParts(value);

  return new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

function formatCountdown(value: string, now = new Date()) {
  const { year, month, day } = getDateParts(value);
  const target = Date.UTC(year, month - 1, day);
  const today = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
  );
  const days = Math.round((target - today) / 86_400_000);

  if (days === 0) return 'Today';
  if (days === 1) return '1 day left';
  if (days > 1) return `${days} days left`;
  if (days === -1) return '1 day ago';
  return `${Math.abs(days)} days ago`;
}

export function formatGoalDate(
  value: string | null | undefined,
  display: GoalDateDisplay = 'date',
  now = new Date(),
) {
  if (!value) return 'No target date';

  const date = formatDate(value);
  const countdown = formatCountdown(value, now);

  if (display === 'countdown') return countdown;
  return date;
}
