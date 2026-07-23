ALTER TABLE "public_profiles"
  ADD COLUMN "is_discoverable" boolean DEFAULT true NOT NULL,
  ADD COLUMN "allow_indexing" boolean DEFAULT true NOT NULL,
  ADD COLUMN "seo_title" varchar(70),
  ADD COLUMN "seo_description" varchar(160),
  ADD COLUMN "share_image_url" text;
--> statement-breakpoint

CREATE INDEX "public_profiles_directory_idx"
  ON "public_profiles" ("is_published", "is_discoverable", "updated_at");
