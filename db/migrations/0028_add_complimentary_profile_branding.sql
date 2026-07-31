ALTER TABLE "public_profiles"
  ADD COLUMN "is_complimentary_pro" boolean DEFAULT false NOT NULL;

UPDATE "public_profiles" AS profile
SET "is_complimentary_pro" = true
WHERE EXISTS (
  SELECT 1
  FROM "complimentary_pro_access" AS access
  WHERE access."user_id" = profile."user_id"
    AND (access."expires_at" IS NULL OR access."expires_at" > NOW())
)
AND NOT EXISTS (
  SELECT 1
  FROM "subscriptions" AS subscription
  WHERE subscription."user_id" = profile."user_id"
    AND subscription."plan" = 'pro'
    AND subscription."status" NOT IN ('past_due', 'cancelled')
);
