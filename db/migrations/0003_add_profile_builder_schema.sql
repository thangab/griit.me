-- Billing upsert constraints
CREATE UNIQUE INDEX IF NOT EXISTS "stripe_customers_user_id_unique"
  ON "stripe_customers" ("user_id");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "subscriptions_user_id_unique"
  ON "subscriptions" ("user_id");
--> statement-breakpoint

CREATE TABLE "public_profiles" (
  "id" serial PRIMARY KEY NOT NULL,
  "user_id" varchar(36) NOT NULL REFERENCES "public"."profiles"("id"),
  "username" varchar(32) NOT NULL,
  "display_name" varchar(120) NOT NULL,
  "bio" text,
  "sport" varchar(80),
  "location" varchar(120),
  "avatar_url" text,
  "cover_url" text,
  "theme" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "is_published" boolean DEFAULT false NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "public_profiles_user_id_unique"
  ON "public_profiles" ("user_id");
--> statement-breakpoint
CREATE UNIQUE INDEX "public_profiles_username_unique"
  ON "public_profiles" ("username");
--> statement-breakpoint

CREATE TABLE "profile_pages" (
  "id" serial PRIMARY KEY NOT NULL,
  "profile_id" integer NOT NULL REFERENCES "public"."public_profiles"("id"),
  "slug" varchar(64) NOT NULL,
  "title" varchar(120) NOT NULL,
  "sort_order" integer DEFAULT 0 NOT NULL,
  "is_home" boolean DEFAULT false NOT NULL,
  "is_published" boolean DEFAULT true NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "profile_pages_profile_id_slug_unique"
  ON "profile_pages" ("profile_id", "slug");
--> statement-breakpoint
CREATE INDEX "profile_pages_profile_id_idx"
  ON "profile_pages" ("profile_id");
--> statement-breakpoint

CREATE TABLE "profile_blocks" (
  "id" serial PRIMARY KEY NOT NULL,
  "page_id" integer NOT NULL REFERENCES "public"."profile_pages"("id"),
  "type" varchar(48) NOT NULL,
  "title" varchar(160),
  "content" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "sort_order" integer DEFAULT 0 NOT NULL,
  "is_enabled" boolean DEFAULT true NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "profile_blocks_page_id_idx"
  ON "profile_blocks" ("page_id");
--> statement-breakpoint

CREATE TABLE "profile_social_links" (
  "id" serial PRIMARY KEY NOT NULL,
  "profile_id" integer NOT NULL REFERENCES "public"."public_profiles"("id"),
  "platform" varchar(48) NOT NULL,
  "label" varchar(80),
  "url" text NOT NULL,
  "sort_order" integer DEFAULT 0 NOT NULL,
  "is_enabled" boolean DEFAULT true NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "profile_social_links_profile_id_idx"
  ON "profile_social_links" ("profile_id");
--> statement-breakpoint

CREATE TABLE "profile_gallery_items" (
  "id" serial PRIMARY KEY NOT NULL,
  "profile_id" integer NOT NULL REFERENCES "public"."public_profiles"("id"),
  "image_url" text NOT NULL,
  "caption" text,
  "alt_text" text,
  "sort_order" integer DEFAULT 0 NOT NULL,
  "is_enabled" boolean DEFAULT true NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "profile_gallery_items_profile_id_idx"
  ON "profile_gallery_items" ("profile_id");
--> statement-breakpoint

CREATE TABLE "profile_achievements" (
  "id" serial PRIMARY KEY NOT NULL,
  "profile_id" integer NOT NULL REFERENCES "public"."public_profiles"("id"),
  "title" varchar(160) NOT NULL,
  "description" text,
  "achieved_at" timestamp,
  "sort_order" integer DEFAULT 0 NOT NULL,
  "is_enabled" boolean DEFAULT true NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "profile_achievements_profile_id_idx"
  ON "profile_achievements" ("profile_id");
--> statement-breakpoint

CREATE TABLE "profile_activities" (
  "id" serial PRIMARY KEY NOT NULL,
  "profile_id" integer NOT NULL REFERENCES "public"."public_profiles"("id"),
  "title" varchar(160) NOT NULL,
  "activity_type" varchar(80),
  "occurred_at" timestamp,
  "metrics" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "sort_order" integer DEFAULT 0 NOT NULL,
  "is_enabled" boolean DEFAULT true NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "profile_activities_profile_id_idx"
  ON "profile_activities" ("profile_id");
--> statement-breakpoint

ALTER TABLE "public_profiles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "profile_pages" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "profile_blocks" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "profile_social_links" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "profile_gallery_items" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "profile_achievements" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "profile_activities" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint

CREATE POLICY "public_profiles_select_owner_or_published" ON "public_profiles"
  FOR SELECT
  USING (is_published = true OR auth.uid()::text = user_id);
CREATE POLICY "public_profiles_insert_owner" ON "public_profiles"
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND auth.uid()::text = user_id);
CREATE POLICY "public_profiles_update_owner" ON "public_profiles"
  FOR UPDATE
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "public_profiles_delete_owner" ON "public_profiles"
  FOR DELETE
  USING (auth.uid()::text = user_id);
--> statement-breakpoint

CREATE POLICY "profile_pages_select_owner_or_published" ON "profile_pages"
  FOR SELECT
  USING (
    is_published = true
    OR EXISTS (
      SELECT 1 FROM "public_profiles"
      WHERE "public_profiles"."id" = "profile_pages"."profile_id"
        AND "public_profiles"."user_id" = auth.uid()::text
    )
  );
CREATE POLICY "profile_pages_write_owner" ON "profile_pages"
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM "public_profiles"
      WHERE "public_profiles"."id" = "profile_pages"."profile_id"
        AND "public_profiles"."user_id" = auth.uid()::text
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM "public_profiles"
      WHERE "public_profiles"."id" = "profile_pages"."profile_id"
        AND "public_profiles"."user_id" = auth.uid()::text
    )
  );
--> statement-breakpoint

CREATE POLICY "profile_blocks_select_owner_or_enabled" ON "profile_blocks"
  FOR SELECT
  USING (
    is_enabled = true
    OR EXISTS (
      SELECT 1 FROM "profile_pages"
      JOIN "public_profiles" ON "public_profiles"."id" = "profile_pages"."profile_id"
      WHERE "profile_pages"."id" = "profile_blocks"."page_id"
        AND "public_profiles"."user_id" = auth.uid()::text
    )
  );
CREATE POLICY "profile_blocks_write_owner" ON "profile_blocks"
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM "profile_pages"
      JOIN "public_profiles" ON "public_profiles"."id" = "profile_pages"."profile_id"
      WHERE "profile_pages"."id" = "profile_blocks"."page_id"
        AND "public_profiles"."user_id" = auth.uid()::text
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM "profile_pages"
      JOIN "public_profiles" ON "public_profiles"."id" = "profile_pages"."profile_id"
      WHERE "profile_pages"."id" = "profile_blocks"."page_id"
        AND "public_profiles"."user_id" = auth.uid()::text
    )
  );
--> statement-breakpoint

CREATE POLICY "profile_social_links_select_owner_or_enabled" ON "profile_social_links"
  FOR SELECT
  USING (
    is_enabled = true
    OR EXISTS (
      SELECT 1 FROM "public_profiles"
      WHERE "public_profiles"."id" = "profile_social_links"."profile_id"
        AND "public_profiles"."user_id" = auth.uid()::text
    )
  );
CREATE POLICY "profile_social_links_write_owner" ON "profile_social_links"
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM "public_profiles"
      WHERE "public_profiles"."id" = "profile_social_links"."profile_id"
        AND "public_profiles"."user_id" = auth.uid()::text
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM "public_profiles"
      WHERE "public_profiles"."id" = "profile_social_links"."profile_id"
        AND "public_profiles"."user_id" = auth.uid()::text
    )
  );
--> statement-breakpoint

CREATE POLICY "profile_gallery_items_select_owner_or_enabled" ON "profile_gallery_items"
  FOR SELECT
  USING (
    is_enabled = true
    OR EXISTS (
      SELECT 1 FROM "public_profiles"
      WHERE "public_profiles"."id" = "profile_gallery_items"."profile_id"
        AND "public_profiles"."user_id" = auth.uid()::text
    )
  );
CREATE POLICY "profile_gallery_items_write_owner" ON "profile_gallery_items"
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM "public_profiles"
      WHERE "public_profiles"."id" = "profile_gallery_items"."profile_id"
        AND "public_profiles"."user_id" = auth.uid()::text
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM "public_profiles"
      WHERE "public_profiles"."id" = "profile_gallery_items"."profile_id"
        AND "public_profiles"."user_id" = auth.uid()::text
    )
  );
--> statement-breakpoint

CREATE POLICY "profile_achievements_select_owner_or_enabled" ON "profile_achievements"
  FOR SELECT
  USING (
    is_enabled = true
    OR EXISTS (
      SELECT 1 FROM "public_profiles"
      WHERE "public_profiles"."id" = "profile_achievements"."profile_id"
        AND "public_profiles"."user_id" = auth.uid()::text
    )
  );
CREATE POLICY "profile_achievements_write_owner" ON "profile_achievements"
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM "public_profiles"
      WHERE "public_profiles"."id" = "profile_achievements"."profile_id"
        AND "public_profiles"."user_id" = auth.uid()::text
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM "public_profiles"
      WHERE "public_profiles"."id" = "profile_achievements"."profile_id"
        AND "public_profiles"."user_id" = auth.uid()::text
    )
  );
--> statement-breakpoint

CREATE POLICY "profile_activities_select_owner_or_enabled" ON "profile_activities"
  FOR SELECT
  USING (
    is_enabled = true
    OR EXISTS (
      SELECT 1 FROM "public_profiles"
      WHERE "public_profiles"."id" = "profile_activities"."profile_id"
        AND "public_profiles"."user_id" = auth.uid()::text
    )
  );
CREATE POLICY "profile_activities_write_owner" ON "profile_activities"
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM "public_profiles"
      WHERE "public_profiles"."id" = "profile_activities"."profile_id"
        AND "public_profiles"."user_id" = auth.uid()::text
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM "public_profiles"
      WHERE "public_profiles"."id" = "profile_activities"."profile_id"
        AND "public_profiles"."user_id" = auth.uid()::text
    )
  );
