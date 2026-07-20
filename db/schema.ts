import {
  pgTable,
  serial,
  text,
  timestamp,
  boolean,
  varchar,
  integer,
  jsonb,
  uniqueIndex,
  index,
} from 'drizzle-orm/pg-core';

export const profiles = pgTable('profiles', {
  id: varchar('id', { length: 36 }).primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  full_name: text('full_name'),
  avatar_url: text('avatar_url'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const stripe_customers = pgTable(
  'stripe_customers',
  {
    id: serial('id').primaryKey(),
    user_id: varchar('user_id', { length: 36 })
      .notNull()
      .references(() => profiles.id),
    stripe_customer_id: text('stripe_customer_id').notNull().unique(),
    default_payment_method: text('default_payment_method'),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    userIdUnique: uniqueIndex('stripe_customers_user_id_unique').on(
      table.user_id,
    ),
  }),
);

export const subscriptions = pgTable(
  'subscriptions',
  {
    id: serial('id').primaryKey(),
    user_id: varchar('user_id', { length: 36 })
      .notNull()
      .references(() => profiles.id),
    stripe_subscription_id: text('stripe_subscription_id').notNull().unique(),
    price_id: text('price_id').notNull(),
    status: varchar('status', { length: 32 }).notNull(),
    plan: varchar('plan', { length: 32 }).notNull(),
    current_period_start: timestamp('current_period_start'),
    current_period_end: timestamp('current_period_end'),
    cancel_at_period_end: boolean('cancel_at_period_end')
      .default(false)
      .notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    userIdUnique: uniqueIndex('subscriptions_user_id_unique').on(table.user_id),
  }),
);

export const public_profiles = pgTable(
  'public_profiles',
  {
    id: serial('id').primaryKey(),
    user_id: varchar('user_id', { length: 36 })
      .notNull()
      .references(() => profiles.id),
    username: varchar('username', { length: 32 }).notNull(),
    display_name: varchar('display_name', { length: 120 }).notNull(),
    bio: text('bio'),
    location: varchar('location', { length: 120 }),
    avatar_url: text('avatar_url'),
    cover_url: text('cover_url'),
    theme: jsonb('theme')
      .$type<Record<string, unknown>>()
      .default({})
      .notNull(),
    is_published: boolean('is_published').default(false).notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    userIdUnique: uniqueIndex('public_profiles_user_id_unique').on(
      table.user_id,
    ),
    usernameUnique: uniqueIndex('public_profiles_username_unique').on(
      table.username,
    ),
  }),
);

export const profile_pages = pgTable(
  'profile_pages',
  {
    id: serial('id').primaryKey(),
    profile_id: integer('profile_id')
      .notNull()
      .references(() => public_profiles.id),
    slug: varchar('slug', { length: 64 }).notNull(),
    title: varchar('title', { length: 120 }).notNull(),
    sort_order: integer('sort_order').default(0).notNull(),
    is_home: boolean('is_home').default(false).notNull(),
    is_published: boolean('is_published').default(true).notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    profileSlugUnique: uniqueIndex('profile_pages_profile_id_slug_unique').on(
      table.profile_id,
      table.slug,
    ),
    profileIdx: index('profile_pages_profile_id_idx').on(table.profile_id),
  }),
);

export const profile_blocks = pgTable(
  'profile_blocks',
  {
    id: serial('id').primaryKey(),
    page_id: integer('page_id')
      .notNull()
      .references(() => profile_pages.id),
    type: varchar('type', { length: 48 }).notNull(),
    title: varchar('title', { length: 160 }),
    content: jsonb('content')
      .$type<Record<string, unknown>>()
      .default({})
      .notNull(),
    sort_order: integer('sort_order').default(0).notNull(),
    is_enabled: boolean('is_enabled').default(true).notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    pageIdx: index('profile_blocks_page_id_idx').on(table.page_id),
  }),
);

export const profile_social_links = pgTable(
  'profile_social_links',
  {
    id: serial('id').primaryKey(),
    profile_id: integer('profile_id')
      .notNull()
      .references(() => public_profiles.id),
    platform: varchar('platform', { length: 48 }).notNull(),
    label: varchar('label', { length: 80 }),
    url: text('url').notNull(),
    sort_order: integer('sort_order').default(0).notNull(),
    is_enabled: boolean('is_enabled').default(true).notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    profileIdx: index('profile_social_links_profile_id_idx').on(
      table.profile_id,
    ),
  }),
);

export const sports = pgTable(
  'sports',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 80 }).notNull(),
    slug: varchar('slug', { length: 80 }).notNull(),
    sort_order: integer('sort_order').default(0).notNull(),
    is_enabled: boolean('is_enabled').default(true).notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    slugUnique: uniqueIndex('sports_slug_unique').on(table.slug),
    slugIdx: index('sports_slug_idx').on(table.slug),
  }),
);

export const profile_sports = pgTable(
  'profile_sports',
  {
    id: serial('id').primaryKey(),
    profile_id: integer('profile_id')
      .notNull()
      .references(() => public_profiles.id),
    sport_id: integer('sport_id')
      .notNull()
      .references(() => sports.id),
    sort_order: integer('sort_order').default(0).notNull(),
    is_enabled: boolean('is_enabled').default(true).notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    profileIdx: index('profile_sports_profile_id_idx').on(table.profile_id),
    sportIdx: index('profile_sports_sport_id_idx').on(table.sport_id),
    profileSportUnique: uniqueIndex(
      'profile_sports_profile_id_sport_id_unique',
    ).on(table.profile_id, table.sport_id),
  }),
);

export const profile_gallery_items = pgTable(
  'profile_gallery_items',
  {
    id: serial('id').primaryKey(),
    profile_id: integer('profile_id')
      .notNull()
      .references(() => public_profiles.id),
    image_url: text('image_url').notNull(),
    caption: text('caption'),
    alt_text: text('alt_text'),
    sort_order: integer('sort_order').default(0).notNull(),
    is_enabled: boolean('is_enabled').default(true).notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    profileIdx: index('profile_gallery_items_profile_id_idx').on(
      table.profile_id,
    ),
  }),
);

export const profile_achievements = pgTable(
  'profile_achievements',
  {
    id: serial('id').primaryKey(),
    profile_id: integer('profile_id')
      .notNull()
      .references(() => public_profiles.id),
    title: varchar('title', { length: 160 }).notNull(),
    description: text('description'),
    achieved_at: timestamp('achieved_at'),
    sort_order: integer('sort_order').default(0).notNull(),
    is_enabled: boolean('is_enabled').default(true).notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    profileIdx: index('profile_achievements_profile_id_idx').on(
      table.profile_id,
    ),
  }),
);

export const profile_sponsors = pgTable(
  'profile_sponsors',
  {
    id: serial('id').primaryKey(),
    profile_id: integer('profile_id')
      .notNull()
      .references(() => public_profiles.id),
    name: varchar('name', { length: 120 }).notNull(),
    logo_url: text('logo_url'),
    website_url: text('website_url'),
    sort_order: integer('sort_order').default(0).notNull(),
    is_enabled: boolean('is_enabled').default(true).notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    profileIdx: index('profile_sponsors_profile_id_idx').on(table.profile_id),
  }),
);

export const profile_activities = pgTable(
  'profile_activities',
  {
    id: serial('id').primaryKey(),
    profile_id: integer('profile_id')
      .notNull()
      .references(() => public_profiles.id),
    title: varchar('title', { length: 160 }).notNull(),
    activity_type: varchar('activity_type', { length: 80 }),
    occurred_at: timestamp('occurred_at'),
    metrics: jsonb('metrics')
      .$type<Record<string, unknown>>()
      .default({})
      .notNull(),
    sort_order: integer('sort_order').default(0).notNull(),
    is_enabled: boolean('is_enabled').default(true).notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    profileIdx: index('profile_activities_profile_id_idx').on(table.profile_id),
  }),
);

export const profile_goals = pgTable(
  'profile_goals',
  {
    id: serial('id').primaryKey(),
    profile_id: integer('profile_id')
      .notNull()
      .references(() => public_profiles.id),
    title: varchar('title', { length: 160 }).notNull(),
    description: text('description'),
    url: text('url'),
    target_at: timestamp('target_at'),
    date_display: varchar('date_display', { length: 16 })
      .default('date')
      .notNull(),
    status: varchar('status', { length: 32 }).default('planned').notNull(),
    sort_order: integer('sort_order').default(0).notNull(),
    is_enabled: boolean('is_enabled').default(true).notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    profileIdx: index('profile_goals_profile_id_idx').on(table.profile_id),
  }),
);
