ALTER TABLE "subscriptions"
  ADD COLUMN IF NOT EXISTS "welcome_email_sent_at" timestamp;

UPDATE "subscriptions"
SET "welcome_email_sent_at" = COALESCE("updated_at", now())
WHERE "welcome_email_sent_at" IS NULL
  AND "plan" = 'pro';
