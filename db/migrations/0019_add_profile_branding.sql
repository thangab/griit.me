ALTER TABLE "public_profiles"
  ADD COLUMN "show_branding" boolean DEFAULT true NOT NULL;
--> statement-breakpoint
UPDATE "public_profiles" AS "profile"
SET "show_branding" = NOT EXISTS (
  SELECT 1
  FROM "subscriptions" AS "subscription"
  WHERE "subscription"."user_id" = "profile"."user_id"
    AND "subscription"."plan" = 'pro'
    AND "subscription"."status" NOT IN ('past_due', 'cancelled')
);
