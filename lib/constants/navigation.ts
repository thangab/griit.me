export type DashboardNavItem = {
  href: string;
  label: string;
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
          { href: profileBase, label: 'Overview', icon: 'LayoutGrid' },
          {
            href: `${profileBase}/design`,
            label: 'Design',
            icon: 'PanelsTopLeft',
          },
          {
            href: `${profileBase}/analytics`,
            label: 'Analytics',
            icon: 'BarChart3',
          },
        ] satisfies DashboardNavItem[])
      : []),
    { href: '/dashboard/profiles', label: 'Profiles', icon: 'UserRound' },
    ...(profileBase
      ? ([
          {
            href: `${profileBase}/settings`,
            label: 'Settings',
            icon: 'Settings',
          },
        ] satisfies DashboardNavItem[])
      : []),
    {
      href: '/dashboard/settings',
      label: 'Subscribe',
      icon: 'LockSimple',
    },
  ];
}
