export function parseSports(value: string) {
  return value
    .split(',')
    .map((sport) => sport.trim())
    .filter(Boolean);
}

export function formatProfileSummary({
  bio,
}: {
  bio: string;
}) {
  return bio.trim();
}
