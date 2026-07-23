ALTER TABLE "public_profiles"
  DROP CONSTRAINT IF EXISTS "public_profiles_user_id_fkey",
  DROP CONSTRAINT IF EXISTS "public_profiles_user_id_profiles_id_fk",
  ADD CONSTRAINT "public_profiles_user_id_profiles_id_fk"
    FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE;
--> statement-breakpoint

ALTER TABLE "stripe_customers"
  DROP CONSTRAINT IF EXISTS "stripe_customers_user_id_profiles_id_fk",
  ADD CONSTRAINT "stripe_customers_user_id_profiles_id_fk"
    FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE;
--> statement-breakpoint

ALTER TABLE "subscriptions"
  DROP CONSTRAINT IF EXISTS "subscriptions_user_id_profiles_id_fk",
  ADD CONSTRAINT "subscriptions_user_id_profiles_id_fk"
    FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE;
