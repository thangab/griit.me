CREATE TABLE "profile_sponsors" (
  "id" serial PRIMARY KEY NOT NULL,
  "profile_id" integer NOT NULL REFERENCES "public"."public_profiles"("id"),
  "name" varchar(120) NOT NULL,
  "logo_url" text,
  "website_url" text,
  "sort_order" integer DEFAULT 0 NOT NULL,
  "is_enabled" boolean DEFAULT true NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "profile_sponsors_profile_id_idx"
  ON "profile_sponsors" ("profile_id");
--> statement-breakpoint
ALTER TABLE "profile_sponsors" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY "profile_sponsors_select_owner_or_enabled" ON "profile_sponsors"
  FOR SELECT
  USING (
    is_enabled = true
    OR EXISTS (
      SELECT 1 FROM "public_profiles"
      WHERE "public_profiles"."id" = "profile_sponsors"."profile_id"
        AND "public_profiles"."user_id" = auth.uid()::text
    )
  );
--> statement-breakpoint
CREATE POLICY "profile_sponsors_write_owner" ON "profile_sponsors"
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM "public_profiles"
      WHERE "public_profiles"."id" = "profile_sponsors"."profile_id"
        AND "public_profiles"."user_id" = auth.uid()::text
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM "public_profiles"
      WHERE "public_profiles"."id" = "profile_sponsors"."profile_id"
        AND "public_profiles"."user_id" = auth.uid()::text
    )
  );
