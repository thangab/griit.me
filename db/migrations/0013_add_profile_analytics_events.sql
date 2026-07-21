CREATE TABLE "profile_analytics_events" (
  "id" bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "profile_id" integer NOT NULL REFERENCES "public"."public_profiles"("id") ON DELETE CASCADE,
  "event_type" varchar(32) NOT NULL,
  "target_type" varchar(32),
  "target_key" uuid,
  "target_label" varchar(160),
  "visitor_hash" varchar(64) NOT NULL,
  "referrer_host" varchar(255),
  "utm_source" varchar(120),
  "utm_medium" varchar(120),
  "utm_campaign" varchar(160),
  "country_code" varchar(2),
  "region" varchar(120),
  "city" varchar(120),
  "browser" varchar(40),
  "os" varchar(40),
  "device_type" varchar(16),
  "occurred_at" timestamptz DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "profile_analytics_events_profile_date_idx"
  ON "profile_analytics_events" ("profile_id", "occurred_at");
CREATE INDEX "profile_analytics_events_profile_event_idx"
  ON "profile_analytics_events" ("profile_id", "event_type");
CREATE INDEX "profile_analytics_events_visitor_date_idx"
  ON "profile_analytics_events" ("profile_id", "visitor_hash", "occurred_at");
CREATE INDEX "profile_analytics_events_target_idx"
  ON "profile_analytics_events" ("profile_id", "target_key");
--> statement-breakpoint
ALTER TABLE "profile_analytics_events" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY "profile_analytics_events_select_owner"
  ON "profile_analytics_events"
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "public_profiles"
      WHERE "public_profiles"."id" = "profile_analytics_events"."profile_id"
        AND "public_profiles"."user_id" = auth.uid()::text
    )
  );
