CREATE TABLE "profile_sports" (
  "id" serial PRIMARY KEY NOT NULL,
  "profile_id" integer NOT NULL REFERENCES "public"."public_profiles"("id"),
  "name" varchar(80) NOT NULL,
  "slug" varchar(80) NOT NULL,
  "sort_order" integer DEFAULT 0 NOT NULL,
  "is_enabled" boolean DEFAULT true NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "profile_sports_profile_id_idx"
  ON "profile_sports" ("profile_id");
--> statement-breakpoint
CREATE INDEX "profile_sports_slug_idx"
  ON "profile_sports" ("slug");
--> statement-breakpoint
CREATE UNIQUE INDEX "profile_sports_profile_id_slug_unique"
  ON "profile_sports" ("profile_id", "slug");
--> statement-breakpoint

INSERT INTO "profile_sports" ("profile_id", "name", "slug", "sort_order", "is_enabled")
SELECT
  "id",
  trim("sport"),
  regexp_replace(
    lower(trim("sport")),
    '[^a-z0-9]+',
    '-',
    'g'
  ),
  0,
  true
FROM "public_profiles"
WHERE "sport" IS NOT NULL AND trim("sport") <> ''
ON CONFLICT ("profile_id", "slug") DO NOTHING;
--> statement-breakpoint

ALTER TABLE "profile_sports" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint

CREATE POLICY "profile_sports_select_owner_or_enabled" ON "profile_sports"
  FOR SELECT
  USING (
    is_enabled = true
    OR EXISTS (
      SELECT 1 FROM "public_profiles"
      WHERE "public_profiles"."id" = "profile_sports"."profile_id"
        AND "public_profiles"."user_id" = auth.uid()::text
    )
  );
--> statement-breakpoint
CREATE POLICY "profile_sports_write_owner" ON "profile_sports"
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM "public_profiles"
      WHERE "public_profiles"."id" = "profile_sports"."profile_id"
        AND "public_profiles"."user_id" = auth.uid()::text
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM "public_profiles"
      WHERE "public_profiles"."id" = "profile_sports"."profile_id"
        AND "public_profiles"."user_id" = auth.uid()::text
    )
  );
