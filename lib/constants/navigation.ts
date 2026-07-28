import type { DictionaryKey } from '@/lib/i18n/dictionaries';

export type DashboardNavItem = {
  href: string;
  labelKey: DictionaryKey;
  icon:
    | 'LayoutGrid'
    | 'UserRound'
    | 'PanelsTopLeft'
    | 'BarChart3'
    | 'Settings'
    | 'LockSimple';
};

export function getDashboardNavItems(
  pathname: string,
  defaultProfileId?: number,
): DashboardNavItem[] {
  const routeProfileId = pathname.match(/^\/dashboard\/profiles\/(\d+)/)?.[1];
  const activeProfileId = routeProfileId ?? defaultProfileId;
  const profileBase = activeProfileId
    ? `/dashboard/profiles/${activeProfileId}`
    : null;

  return [
    ...(profileBase
      ? ([
          {
            href: profileBase,
            labelKey: 'dashboard.nav.overview',
            icon: 'LayoutGrid',
          },
          {
            href: `${profileBase}/design`,
            labelKey: 'dashboard.nav.design',
            icon: 'PanelsTopLeft',
          },
          {
            href: `${profileBase}/analytics`,
            labelKey: 'dashboard.nav.analytics',
            icon: 'BarChart3',
          },
        ] satisfies DashboardNavItem[])
      : []),
    {
      href: '/dashboard/profiles',
      labelKey: 'dashboard.nav.profiles',
      icon: 'UserRound',
    },
    ...(profileBase
      ? ([
          {
            href: `${profileBase}/settings`,
            labelKey: 'dashboard.nav.settings',
            icon: 'Settings',
          },
        ] satisfies DashboardNavItem[])
      : []),
    {
      href: '/dashboard/subscribe',
      labelKey: 'dashboard.nav.subscribe',
      icon: 'LockSimple',
    },
  ];
}
