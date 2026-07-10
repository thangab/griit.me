-- Enable Row-Level Security and add policies for Supabase

ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select_authenticated" ON "profiles"
  FOR SELECT
  USING (auth.role() = 'authenticated' AND auth.uid()::text = id);

CREATE POLICY "profiles_insert_authenticated" ON "profiles"
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND auth.uid()::text = id);

CREATE POLICY "profiles_update_authenticated" ON "profiles"
  FOR UPDATE
  USING (auth.role() = 'authenticated' AND auth.uid()::text = id)
  WITH CHECK (auth.role() = 'authenticated' AND auth.uid()::text = id);

ALTER TABLE "stripe_customers" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "stripe_customers_select_authenticated" ON "stripe_customers"
  FOR SELECT
  USING (auth.role() = 'authenticated' AND auth.uid()::text = user_id);

CREATE POLICY "stripe_customers_insert_authenticated" ON "stripe_customers"
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND auth.uid()::text = user_id);

CREATE POLICY "stripe_customers_update_authenticated" ON "stripe_customers"
  FOR UPDATE
  USING (auth.role() = 'authenticated' AND auth.uid()::text = user_id)
  WITH CHECK (auth.role() = 'authenticated' AND auth.uid()::text = user_id);

ALTER TABLE "subscriptions" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "subscriptions_select_authenticated" ON "subscriptions"
  FOR SELECT
  USING (auth.role() = 'authenticated' AND auth.uid()::text = user_id);

CREATE POLICY "subscriptions_insert_authenticated" ON "subscriptions"
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND auth.uid()::text = user_id);

CREATE POLICY "subscriptions_update_authenticated" ON "subscriptions"
  FOR UPDATE
  USING (auth.role() = 'authenticated' AND auth.uid()::text = user_id)
  WITH CHECK (auth.role() = 'authenticated' AND auth.uid()::text = user_id);
