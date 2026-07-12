CREATE TABLE "profile_goals" (
  "id" serial PRIMARY KEY NOT NULL,
  "profile_id" integer NOT NULL REFERENCES "public"."public_profiles"("id"),
  "title" varchar(160) NOT NULL,
  "description" text,
  "target_at" timestamp,
  "status" varchar(32) DEFAULT 'planned' NOT NULL,
  "sort_order" integer DEFAULT 0 NOT NULL,
  "is_enabled" boolean DEFAULT true NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "profile_goals_profile_id_idx"
  ON "profile_goals" ("profile_id");
--> statement-breakpoint

ALTER TABLE "profile_goals" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint

CREATE POLICY "profile_goals_select_owner_or_enabled" ON "profile_goals"
  FOR SELECT
  USING (
    is_enabled = true
    OR EXISTS (
      SELECT 1 FROM "public_profiles"
      WHERE "public_profiles"."id" = "profile_goals"."profile_id"
        AND "public_profiles"."user_id" = auth.uid()::text
    )
  );
--> statement-breakpoint
CREATE POLICY "profile_goals_write_owner" ON "profile_goals"
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM "public_profiles"
      WHERE "public_profiles"."id" = "profile_goals"."profile_id"
        AND "public_profiles"."user_id" = auth.uid()::text
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM "public_profiles"
      WHERE "public_profiles"."id" = "profile_goals"."profile_id"
        AND "public_profiles"."user_id" = auth.uid()::text
    )
  );
