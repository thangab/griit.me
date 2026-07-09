export type UserRole = 'athlete' | 'coach' | 'creator';

export interface AppUser {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  createdAt: string;
}

export interface DashboardSection {
  title: string;
  description: string;
  href: string;
}
