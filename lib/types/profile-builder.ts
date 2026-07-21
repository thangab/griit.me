export interface BuilderProfile {
  id: number | null;
  username: string;
  displayName: string;
  bio: string;
  sports: string[];
  sportSlugs: string[];
  location: string;
  avatarUrl: string;
  coverUrl: string;
  isPublished: boolean;
  theme: Record<string, unknown>;
}

export interface BuilderSport {
  name: string;
  slug: string;
}

export interface BuilderBlock {
  id: number | null;
  analyticsKey: string;
  type: string;
  title: string;
  content: Record<string, unknown>;
  sortOrder: number;
  isEnabled: boolean;
}

export interface BuilderSocialLink {
  id: number | null;
  analyticsKey: string;
  platform: string;
  label: string;
  url: string;
  sortOrder: number;
  isEnabled: boolean;
}

export interface BuilderGalleryItem {
  id: number | null;
  analyticsKey: string;
  imageUrl: string;
  caption: string;
  altText: string;
  sortOrder: number;
  isEnabled: boolean;
}

export interface BuilderSponsor {
  id: number | null;
  analyticsKey: string;
  name: string;
  logoUrl: string;
  websiteUrl: string;
  sortOrder: number;
  isEnabled: boolean;
}

export interface BuilderTimelineItem {
  id: number | null;
  analyticsKey: string;
  title: string;
  description: string;
  dateLabel: string;
  date: string;
  sortOrder: number;
  isEnabled: boolean;
}

export interface BuilderGoalItem {
  id: number | null;
  analyticsKey: string;
  title: string;
  description: string;
  url: string;
  targetDate: string;
  targetLabel: string;
  dateDisplay: import('@/lib/utils/goal-date').GoalDateDisplay;
  status: string;
  sortOrder: number;
  isEnabled: boolean;
}

export interface ProfileBuilderState {
  source: 'database' | 'initial';
  profile: BuilderProfile;
  blocks: BuilderBlock[];
  socialLinks: BuilderSocialLink[];
  galleryItems: BuilderGalleryItem[];
  sponsors: BuilderSponsor[];
  achievements: BuilderTimelineItem[];
  activities: BuilderTimelineItem[];
  goals: BuilderGoalItem[];
  availableSports: BuilderSport[];
}
