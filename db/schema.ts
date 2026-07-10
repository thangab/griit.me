import {
  pgTable,
  serial,
  text,
  timestamp,
  boolean,
  varchar,
} from 'drizzle-orm/pg-core';

export const profiles = pgTable('profiles', {
  id: varchar('id', { length: 36 }).primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  full_name: text('full_name'),
  avatar_url: text('avatar_url'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const stripe_customers = pgTable('stripe_customers', {
  id: serial('id').primaryKey(),
  user_id: varchar('user_id', { length: 36 })
    .notNull()
    .references(() => profiles.id),
  stripe_customer_id: text('stripe_customer_id').notNull().unique(),
  default_payment_method: text('default_payment_method'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const subscriptions = pgTable('subscriptions', {
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
});
