CREATE TABLE "complimentary_pro_access" (
  "user_id" varchar(36) PRIMARY KEY REFERENCES "public"."profiles"("id") ON DELETE CASCADE,
  "expires_at" timestamp,
  "note" text,
  "granted_by" varchar(36) REFERENCES "public"."profiles"("id") ON DELETE SET NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE INDEX "complimentary_pro_access_expires_at_idx"
  ON "complimentary_pro_access" ("expires_at");
--> statement-breakpoint

ALTER TABLE "complimentary_pro_access" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint

-- Account owners may read their own entitlement so access can be resolved with
-- the authenticated Supabase client. Grants and revocations remain admin-only
-- operations performed through the service role after an application-level
-- admin check.
CREATE POLICY "complimentary_pro_access_select_owner"
  ON "complimentary_pro_access"
  FOR SELECT
  USING ("user_id" = auth.uid()::text);
