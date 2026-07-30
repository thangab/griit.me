export function isPastDate(value: string) {
  return new Date(value).getTime() <= Date.now();
}
