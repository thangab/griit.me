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

export interface BuilderPage {
  id: number | null;
  slug: string;
  title: string;
  sortOrder: number;
  isHome: boolean;
  isPublished: boolean;
}

export interface BuilderBlock {
  id: number | null;
  type: string;
  title: string;
  content: Record<string, unknown>;
  sortOrder: number;
  isEnabled: boolean;
}

export interface BuilderSocialLink {
  id: number | null;
  platform: string;
  label: string;
  url: string;
  sortOrder: number;
  isEnabled: boolean;
}

export interface BuilderGalleryItem {
  id: number | null;
  imageUrl: string;
  caption: string;
  altText: string;
  sortOrder: number;
  isEnabled: boolean;
}

export interface BuilderTimelineItem {
  id: number | null;
  title: string;
  description: string;
  dateLabel: string;
  date: string;
  sortOrder: number;
  isEnabled: boolean;
}

export interface BuilderGoalItem {
  id: number | null;
  title: string;
  description: string;
  targetDate: string;
  targetLabel: string;
  status: string;
  sortOrder: number;
  isEnabled: boolean;
}

export interface ProfileBuilderState {
  source: 'database' | 'initial';
  profile: BuilderProfile;
  pages: BuilderPage[];
  blocks: BuilderBlock[];
  socialLinks: BuilderSocialLink[];
  galleryItems: BuilderGalleryItem[];
  achievements: BuilderTimelineItem[];
  activities: BuilderTimelineItem[];
  goals: BuilderGoalItem[];
  availableSports: BuilderSport[];
}
