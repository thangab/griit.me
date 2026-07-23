export const athleteDirectoryCacheTag = 'athlete-directory';

export function getPublicProfileCacheTag(username: string) {
  return `public-profile:${username.toLowerCase()}`;
}
