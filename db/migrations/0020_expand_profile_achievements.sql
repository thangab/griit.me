ALTER TABLE "profile_achievements"
  ADD COLUMN "result" varchar(120),
  ADD COLUMN "achievement_type" varchar(40),
  ADD COLUMN "event_name" varchar(160),
  ADD COLUMN "image_url" text,
  ADD COLUMN "result_url" text;
