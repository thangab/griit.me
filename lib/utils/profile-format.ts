export function parseSports(value: string) {
  return value
    .split(',')
    .map((sport) => sport.trim())
    .filter(Boolean);
}

export function formatProfileSummary({
  bio,
  location,
  sports,
}: {
  bio: string;
  location: string;
  sports: string[];
}) {
  return [bio, location, sports.join(' / ')].filter(Boolean).join(' · ');
}
