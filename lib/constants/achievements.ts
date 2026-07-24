export const achievementTypes = [
  'victory',
  'podium',
  'personal_best',
  'qualification',
  'record',
  'certification',
  'milestone',
  'other',
] as const;

export type AchievementType = (typeof achievementTypes)[number];

export const achievementTypeOptions: Array<{
  value: AchievementType;
  label: string;
}> = [
  { value: 'victory', label: 'Victory' },
  { value: 'podium', label: 'Podium' },
  { value: 'personal_best', label: 'Personal best' },
  { value: 'qualification', label: 'Qualification' },
  { value: 'record', label: 'Record' },
  { value: 'certification', label: 'Certification' },
  { value: 'milestone', label: 'Milestone' },
  { value: 'other', label: 'Other' },
];

export function getAchievementTypeLabel(type: string, customLabel?: string) {
  if (type === 'other' && customLabel?.trim()) return customLabel.trim();

  return (
    achievementTypeOptions.find((option) => option.value === type)?.label ??
    'Milestone'
  );
}
