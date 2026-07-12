CREATE TABLE IF NOT EXISTS "sports" (
  "id" serial PRIMARY KEY NOT NULL,
  "name" varchar(80) NOT NULL,
  "slug" varchar(80) NOT NULL,
  "sort_order" integer DEFAULT 0 NOT NULL,
  "is_enabled" boolean DEFAULT true NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "sports_slug_unique"
  ON "sports" ("slug");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sports_slug_idx"
  ON "sports" ("slug");
--> statement-breakpoint

INSERT INTO "sports" ("name", "slug", "sort_order", "is_enabled")
VALUES
  ('Running', 'running', 0, true),
  ('Trail Running', 'trail-running', 1, true),
  ('Cycling', 'cycling', 2, true),
  ('Triathlon', 'triathlon', 3, true),
  ('HYROX', 'hyrox', 4, true),
  ('CrossFit', 'crossfit', 5, true),
  ('Gym', 'gym', 6, true),
  ('Boxing', 'boxing', 7, true),
  ('MMA', 'mma', 8, true),
  ('Football', 'football', 9, true)
ON CONFLICT ("slug") DO UPDATE SET
  "name" = EXCLUDED."name",
  "sort_order" = EXCLUDED."sort_order",
  "is_enabled" = EXCLUDED."is_enabled",
  "updated_at" = now();
--> statement-breakpoint

INSERT INTO "sports" ("name", "slug", "sort_order", "is_enabled")
SELECT DISTINCT
  trim("name"),
  trim("slug"),
  1000,
  true
FROM "profile_sports"
WHERE "name" IS NOT NULL
  AND trim("name") <> ''
  AND "slug" IS NOT NULL
  AND trim("slug") <> ''
ON CONFLICT ("slug") DO NOTHING;
--> statement-breakpoint

ALTER TABLE "profile_sports"
  ADD COLUMN IF NOT EXISTS "sport_id" integer;
--> statement-breakpoint

UPDATE "profile_sports"
SET "sport_id" = "sports"."id"
FROM "sports"
WHERE "profile_sports"."sport_id" IS NULL
  AND "sports"."slug" = "profile_sports"."slug";
--> statement-breakpoint

DELETE FROM "profile_sports"
WHERE "sport_id" IS NULL;
--> statement-breakpoint

DROP INDEX IF EXISTS "profile_sports_profile_id_slug_unique";
--> statement-breakpoint
DROP INDEX IF EXISTS "profile_sports_slug_idx";
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "profile_sports_sport_id_idx"
  ON "profile_sports" ("sport_id");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "profile_sports_profile_id_sport_id_unique"
  ON "profile_sports" ("profile_id", "sport_id");
--> statement-breakpoint

ALTER TABLE "profile_sports"
  ALTER COLUMN "sport_id" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "profile_sports"
  DROP COLUMN IF EXISTS "name";
--> statement-breakpoint
ALTER TABLE "profile_sports"
  DROP COLUMN IF EXISTS "slug";
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'profile_sports_sport_id_sports_id_fk'
  ) THEN
    ALTER TABLE "profile_sports"
      ADD CONSTRAINT "profile_sports_sport_id_sports_id_fk"
      FOREIGN KEY ("sport_id")
      REFERENCES "public"."sports"("id");
  END IF;
END $$;
--> statement-breakpoint

ALTER TABLE "sports" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
DROP POLICY IF EXISTS "sports_select_enabled" ON "sports";
--> statement-breakpoint
CREATE POLICY "sports_select_enabled" ON "sports"
  FOR SELECT
  USING ("is_enabled" = true);
