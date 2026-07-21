-- A user can own several independent public profiles. Blocks belong directly
-- to a profile because the product exposes one public page per profile.

DROP INDEX IF EXISTS "public_profiles_user_id_unique";
CREATE INDEX "public_profiles_user_id_idx"
  ON "public_profiles" ("user_id");
--> statement-breakpoint

ALTER TABLE "profile_blocks"
  ADD COLUMN "profile_id" integer;

UPDATE "profile_blocks" AS blocks
SET "profile_id" = pages."profile_id"
FROM "profile_pages" AS pages
WHERE pages."id" = blocks."page_id";

ALTER TABLE "profile_blocks"
  ALTER COLUMN "profile_id" SET NOT NULL,
  ADD CONSTRAINT "profile_blocks_profile_id_public_profiles_id_fk"
    FOREIGN KEY ("profile_id") REFERENCES "public"."public_profiles"("id") ON DELETE CASCADE;
--> statement-breakpoint

DROP POLICY IF EXISTS "profile_blocks_select_owner_or_enabled" ON "profile_blocks";
DROP POLICY IF EXISTS "profile_blocks_write_owner" ON "profile_blocks";
DROP INDEX IF EXISTS "profile_blocks_page_id_analytics_key_unique";
DROP INDEX IF EXISTS "profile_blocks_page_id_idx";

ALTER TABLE "profile_blocks"
  DROP COLUMN "page_id";

CREATE INDEX "profile_blocks_profile_id_idx"
  ON "profile_blocks" ("profile_id");
CREATE UNIQUE INDEX "profile_blocks_profile_id_analytics_key_unique"
  ON "profile_blocks" ("profile_id", "analytics_key");
--> statement-breakpoint

CREATE POLICY "profile_blocks_select_owner_or_enabled" ON "profile_blocks"
  FOR SELECT
  USING (
    (deleted_at IS NULL AND is_enabled = true)
    OR EXISTS (
      SELECT 1 FROM "public_profiles"
      WHERE "public_profiles"."id" = "profile_blocks"."profile_id"
        AND "public_profiles"."user_id" = auth.uid()::text
    )
  );

CREATE POLICY "profile_blocks_write_owner" ON "profile_blocks"
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM "public_profiles"
      WHERE "public_profiles"."id" = "profile_blocks"."profile_id"
        AND "public_profiles"."user_id" = auth.uid()::text
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM "public_profiles"
      WHERE "public_profiles"."id" = "profile_blocks"."profile_id"
        AND "public_profiles"."user_id" = auth.uid()::text
    )
  );
--> statement-breakpoint

DROP TABLE "profile_pages";
--> statement-breakpoint

-- Profiles are independent aggregates, so deleting one removes only its own
-- content and analytics.
ALTER TABLE "profile_social_links"
  DROP CONSTRAINT IF EXISTS "profile_social_links_profile_id_fkey",
  ADD CONSTRAINT "profile_social_links_profile_id_fkey"
    FOREIGN KEY ("profile_id") REFERENCES "public_profiles"("id") ON DELETE CASCADE;
ALTER TABLE "profile_sports"
  DROP CONSTRAINT IF EXISTS "profile_sports_profile_id_fkey",
  ADD CONSTRAINT "profile_sports_profile_id_fkey"
    FOREIGN KEY ("profile_id") REFERENCES "public_profiles"("id") ON DELETE CASCADE;
ALTER TABLE "profile_gallery_items"
  DROP CONSTRAINT IF EXISTS "profile_gallery_items_profile_id_fkey",
  ADD CONSTRAINT "profile_gallery_items_profile_id_fkey"
    FOREIGN KEY ("profile_id") REFERENCES "public_profiles"("id") ON DELETE CASCADE;
ALTER TABLE "profile_achievements"
  DROP CONSTRAINT IF EXISTS "profile_achievements_profile_id_fkey",
  ADD CONSTRAINT "profile_achievements_profile_id_fkey"
    FOREIGN KEY ("profile_id") REFERENCES "public_profiles"("id") ON DELETE CASCADE;
ALTER TABLE "profile_sponsors"
  DROP CONSTRAINT IF EXISTS "profile_sponsors_profile_id_fkey",
  ADD CONSTRAINT "profile_sponsors_profile_id_fkey"
    FOREIGN KEY ("profile_id") REFERENCES "public_profiles"("id") ON DELETE CASCADE;
ALTER TABLE "profile_activities"
  DROP CONSTRAINT IF EXISTS "profile_activities_profile_id_fkey",
  ADD CONSTRAINT "profile_activities_profile_id_fkey"
    FOREIGN KEY ("profile_id") REFERENCES "public_profiles"("id") ON DELETE CASCADE;
ALTER TABLE "profile_goals"
  DROP CONSTRAINT IF EXISTS "profile_goals_profile_id_fkey",
  ADD CONSTRAINT "profile_goals_profile_id_fkey"
    FOREIGN KEY ("profile_id") REFERENCES "public_profiles"("id") ON DELETE CASCADE;
ALTER TABLE "profile_analytics_events"
  DROP CONSTRAINT IF EXISTS "profile_analytics_events_profile_id_fkey",
  ADD CONSTRAINT "profile_analytics_events_profile_id_fkey"
    FOREIGN KEY ("profile_id") REFERENCES "public_profiles"("id") ON DELETE CASCADE;
