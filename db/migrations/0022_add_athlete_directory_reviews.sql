ALTER TABLE "profiles"
  ADD COLUMN "is_admin" boolean DEFAULT false NOT NULL;
--> statement-breakpoint

CREATE TABLE "athlete_directory_reviews" (
  "profile_id" integer PRIMARY KEY REFERENCES "public"."public_profiles"("id") ON DELETE CASCADE,
  "status" varchar(16) DEFAULT 'pending' NOT NULL,
  "submitted_at" timestamp DEFAULT now() NOT NULL,
  "reviewed_at" timestamp,
  "reviewed_by" varchar(36) REFERENCES "public"."profiles"("id") ON DELETE SET NULL,
  "rejection_reason" text,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "athlete_directory_reviews_status_check"
    CHECK ("status" IN ('pending', 'approved', 'rejected'))
);
--> statement-breakpoint

CREATE INDEX "athlete_directory_reviews_status_idx"
  ON "athlete_directory_reviews" ("status", "submitted_at");
--> statement-breakpoint

-- Profiles already visible before moderation is introduced keep their place.
INSERT INTO "athlete_directory_reviews" (
  "profile_id",
  "status",
  "submitted_at",
  "reviewed_at",
  "created_at",
  "updated_at"
)
SELECT
  "id",
  'approved',
  "updated_at",
  now(),
  now(),
  now()
FROM "public_profiles"
WHERE "is_published" = true AND "is_discoverable" = true
ON CONFLICT ("profile_id") DO NOTHING;
--> statement-breakpoint

ALTER TABLE "athlete_directory_reviews" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint

CREATE POLICY "athlete_directory_reviews_select_owner_or_approved"
  ON "athlete_directory_reviews"
  FOR SELECT
  USING (
    "status" = 'approved'
    OR EXISTS (
      SELECT 1
      FROM "public_profiles"
      WHERE "public_profiles"."id" = "athlete_directory_reviews"."profile_id"
        AND "public_profiles"."user_id" = auth.uid()::text
    )
  );
