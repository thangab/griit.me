-- Preserve content identity for analytics and archive removed content instead
-- of deleting it. Existing rows receive a generated analytics key.

ALTER TABLE "profile_blocks"
  ADD COLUMN "analytics_key" uuid DEFAULT gen_random_uuid() NOT NULL,
  ADD COLUMN "deleted_at" timestamp;
ALTER TABLE "profile_social_links"
  ADD COLUMN "analytics_key" uuid DEFAULT gen_random_uuid() NOT NULL,
  ADD COLUMN "deleted_at" timestamp;
ALTER TABLE "profile_gallery_items"
  ADD COLUMN "analytics_key" uuid DEFAULT gen_random_uuid() NOT NULL,
  ADD COLUMN "deleted_at" timestamp;
ALTER TABLE "profile_achievements"
  ADD COLUMN "analytics_key" uuid DEFAULT gen_random_uuid() NOT NULL,
  ADD COLUMN "deleted_at" timestamp;
ALTER TABLE "profile_sponsors"
  ADD COLUMN "analytics_key" uuid DEFAULT gen_random_uuid() NOT NULL,
  ADD COLUMN "deleted_at" timestamp;
ALTER TABLE "profile_activities"
  ADD COLUMN "analytics_key" uuid DEFAULT gen_random_uuid() NOT NULL,
  ADD COLUMN "deleted_at" timestamp;
ALTER TABLE "profile_goals"
  ADD COLUMN "analytics_key" uuid DEFAULT gen_random_uuid() NOT NULL,
  ADD COLUMN "deleted_at" timestamp;
--> statement-breakpoint

CREATE UNIQUE INDEX "profile_blocks_page_id_analytics_key_unique"
  ON "profile_blocks" ("page_id", "analytics_key");
CREATE UNIQUE INDEX "profile_social_links_profile_id_analytics_key_unique"
  ON "profile_social_links" ("profile_id", "analytics_key");
CREATE UNIQUE INDEX "profile_gallery_items_profile_id_analytics_key_unique"
  ON "profile_gallery_items" ("profile_id", "analytics_key");
CREATE UNIQUE INDEX "profile_achievements_profile_id_analytics_key_unique"
  ON "profile_achievements" ("profile_id", "analytics_key");
CREATE UNIQUE INDEX "profile_sponsors_profile_id_analytics_key_unique"
  ON "profile_sponsors" ("profile_id", "analytics_key");
CREATE UNIQUE INDEX "profile_activities_profile_id_analytics_key_unique"
  ON "profile_activities" ("profile_id", "analytics_key");
CREATE UNIQUE INDEX "profile_goals_profile_id_analytics_key_unique"
  ON "profile_goals" ("profile_id", "analytics_key");
--> statement-breakpoint

DROP POLICY IF EXISTS "profile_blocks_select_owner_or_enabled" ON "profile_blocks";
CREATE POLICY "profile_blocks_select_owner_or_enabled" ON "profile_blocks"
  FOR SELECT
  USING (
    (deleted_at IS NULL AND is_enabled = true)
    OR EXISTS (
      SELECT 1 FROM "profile_pages"
      JOIN "public_profiles" ON "public_profiles"."id" = "profile_pages"."profile_id"
      WHERE "profile_pages"."id" = "profile_blocks"."page_id"
        AND "public_profiles"."user_id" = auth.uid()::text
    )
  );

DROP POLICY IF EXISTS "profile_social_links_select_owner_or_enabled" ON "profile_social_links";
CREATE POLICY "profile_social_links_select_owner_or_enabled" ON "profile_social_links"
  FOR SELECT
  USING (
    (deleted_at IS NULL AND is_enabled = true)
    OR EXISTS (
      SELECT 1 FROM "public_profiles"
      WHERE "public_profiles"."id" = "profile_social_links"."profile_id"
        AND "public_profiles"."user_id" = auth.uid()::text
    )
  );

DROP POLICY IF EXISTS "profile_gallery_items_select_owner_or_enabled" ON "profile_gallery_items";
CREATE POLICY "profile_gallery_items_select_owner_or_enabled" ON "profile_gallery_items"
  FOR SELECT
  USING (
    (deleted_at IS NULL AND is_enabled = true)
    OR EXISTS (
      SELECT 1 FROM "public_profiles"
      WHERE "public_profiles"."id" = "profile_gallery_items"."profile_id"
        AND "public_profiles"."user_id" = auth.uid()::text
    )
  );

DROP POLICY IF EXISTS "profile_achievements_select_owner_or_enabled" ON "profile_achievements";
CREATE POLICY "profile_achievements_select_owner_or_enabled" ON "profile_achievements"
  FOR SELECT
  USING (
    (deleted_at IS NULL AND is_enabled = true)
    OR EXISTS (
      SELECT 1 FROM "public_profiles"
      WHERE "public_profiles"."id" = "profile_achievements"."profile_id"
        AND "public_profiles"."user_id" = auth.uid()::text
    )
  );

DROP POLICY IF EXISTS "profile_sponsors_select_owner_or_enabled" ON "profile_sponsors";
CREATE POLICY "profile_sponsors_select_owner_or_enabled" ON "profile_sponsors"
  FOR SELECT
  USING (
    (deleted_at IS NULL AND is_enabled = true)
    OR EXISTS (
      SELECT 1 FROM "public_profiles"
      WHERE "public_profiles"."id" = "profile_sponsors"."profile_id"
        AND "public_profiles"."user_id" = auth.uid()::text
    )
  );

DROP POLICY IF EXISTS "profile_activities_select_owner_or_enabled" ON "profile_activities";
CREATE POLICY "profile_activities_select_owner_or_enabled" ON "profile_activities"
  FOR SELECT
  USING (
    (deleted_at IS NULL AND is_enabled = true)
    OR EXISTS (
      SELECT 1 FROM "public_profiles"
      WHERE "public_profiles"."id" = "profile_activities"."profile_id"
        AND "public_profiles"."user_id" = auth.uid()::text
    )
  );

DROP POLICY IF EXISTS "profile_goals_select_owner_or_enabled" ON "profile_goals";
CREATE POLICY "profile_goals_select_owner_or_enabled" ON "profile_goals"
  FOR SELECT
  USING (
    (deleted_at IS NULL AND is_enabled = true)
    OR EXISTS (
      SELECT 1 FROM "public_profiles"
      WHERE "public_profiles"."id" = "profile_goals"."profile_id"
        AND "public_profiles"."user_id" = auth.uid()::text
    )
  );
