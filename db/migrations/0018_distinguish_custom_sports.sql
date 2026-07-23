ALTER TABLE "sports"
  ADD COLUMN IF NOT EXISTS "is_custom" boolean DEFAULT false NOT NULL;
--> statement-breakpoint
UPDATE "sports"
SET
  "name" = 'Gym & Fitness',
  "sort_order" = 7,
  "is_enabled" = true,
  "is_custom" = false,
  "updated_at" = now()
WHERE "slug" = 'gym';
--> statement-breakpoint
UPDATE "sports"
SET "is_enabled" = false, "updated_at" = now()
WHERE "slug" = 'gym-fitness';
