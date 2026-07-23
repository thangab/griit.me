export const defaultSports = [
  { name: 'Football', slug: 'football' },
  { name: 'Basketball', slug: 'basketball' },
  { name: 'Running', slug: 'running' },
  { name: 'Swimming', slug: 'swimming' },
  { name: 'Cycling', slug: 'cycling' },
  { name: 'Tennis', slug: 'tennis' },
  { name: 'Volleyball', slug: 'volleyball' },
  { name: 'Gym & Fitness', slug: 'gym' },
  { name: 'Cricket', slug: 'cricket' },
  { name: 'Boxing', slug: 'boxing' },
  { name: 'Golf', slug: 'golf' },
  { name: 'Rugby', slug: 'rugby' },
  { name: 'Athletics', slug: 'athletics' },
  { name: 'Baseball', slug: 'baseball' },
  { name: 'Badminton', slug: 'badminton' },
  { name: 'Table Tennis', slug: 'table-tennis' },
  { name: 'Martial Arts', slug: 'martial-arts' },
  { name: 'MMA', slug: 'mma' },
  { name: 'American Football', slug: 'american-football' },
  { name: 'Handball', slug: 'handball' },
  { name: 'Ice Hockey', slug: 'ice-hockey' },
  { name: 'Field Hockey', slug: 'field-hockey' },
  { name: 'Padel', slug: 'padel' },
  { name: 'Gymnastics', slug: 'gymnastics' },
  { name: 'Weightlifting', slug: 'weightlifting' },
  { name: 'Powerlifting', slug: 'powerlifting' },
  { name: 'CrossFit', slug: 'crossfit' },
  { name: 'HYROX', slug: 'hyrox' },
  { name: 'Triathlon', slug: 'triathlon' },
  { name: 'Trail Running', slug: 'trail-running' },
  { name: 'Climbing', slug: 'climbing' },
  { name: 'Hiking', slug: 'hiking' },
  { name: 'Surfing', slug: 'surfing' },
  { name: 'Skiing', slug: 'skiing' },
  { name: 'Snowboarding', slug: 'snowboarding' },
  { name: 'Skateboarding', slug: 'skateboarding' },
  { name: 'Rowing', slug: 'rowing' },
] as const;

export type SportOption = { name: string; slug: string; isCustom?: boolean };

export function createSportSlug(name: string) {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}
