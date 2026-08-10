-- Two realistic English-language demo profiles for the requested account.
-- Fictional, published by direct URL, hidden from directory and search indexing.
-- Safe to rerun: profiles are upserted and their child content is rebuilt.

BEGIN;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = '06d8aa8e-92aa-4973-a00a-81b977022e2a'
  ) THEN
    RAISE EXCEPTION 'Owner profile does not exist';
  END IF;
END $$;

CREATE TEMP TABLE english_profiles (
  username varchar(32) PRIMARY KEY,
  display_name varchar(120) NOT NULL,
  bio text NOT NULL,
  location varchar(120) NOT NULL,
  avatar_url text NOT NULL,
  cover_url text NOT NULL,
  theme jsonb NOT NULL
) ON COMMIT DROP;

INSERT INTO english_profiles VALUES
  (
    'demo_jordan_blake',
    'Jordan Blake',
    'Strength and conditioning coach helping busy professionals train with purpose, move without pain, and build routines that survive demanding weeks. Clear plans, honest feedback, no all-or-nothing thinking.',
    'Bristol, United Kingdom',
    'https://randomuser.me/api/portraits/men/75.jpg',
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1600&q=84',
    jsonb_build_object(
      'templateId', 'momentum', 'colorPreset', 'custom',
      'customColors', jsonb_build_object(
        'background', '#F3F1EA', 'surface', '#FFFCF5', 'foreground', '#17211D',
        'accent', '#E85D34', 'social', '#E8E3D8', 'headerText', '#FFFDF8',
        'headerMutedText', '#F2E8DF', 'blockTitle', '#17211D',
        'description', '#68736E', 'accentText', '#FFFFFF', 'socialText', '#17211D'
      ),
      'fontPreset', 'athletic', 'radiusPreset', 'soft', 'galleryLayout', 'editorial',
      'coverType', 'image', 'coverOverlayColor', '#17211D', 'coverOverlayOpacity', 62,
      'headerLayout', 'split', 'headerAvatarSize', 102, 'headerAvatarShape', 'circle',
      'headerSheetColor', '#17211D', 'headerSheetCoverage', 35,
      'headerGeometry', 'velocity', 'headerTexture', 'diagonal',
      'blockCorner', 35, 'blockBorder', 26, 'blockBorderColor', '#E85D34',
      'blockShadow', 30, 'blockShadowStyle', 'soft', 'blockSpacing', 34,
      'templateWordingOverrides', jsonb_build_object(
        'discipline', 'Strength coach · Bristol', 'badge', 'COACH',
        'eyebrow', 'Strong enough for real life', 'profileLabel', 'My approach',
        'targetLabel', 'Current mission', 'galleryLabel', 'Coaching in action',
        'achievementsLabel', 'Experience', 'activityLabel', 'Recent sessions',
        'secondaryGoalLabel', 'Up next'
      )
    )
  ),
  (
    'demo_emily_carter',
    'Emily Carter',
    'Project manager, mum, and lifelong starter learning how to become consistent. I am sharing a realistic journey built around better meals, daily walks, simple strength sessions, and progress that does not require a perfect week.',
    'Leeds, United Kingdom',
    'https://randomuser.me/api/portraits/women/65.jpg',
    'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=1600&q=84',
    jsonb_build_object(
      'templateId', 'horizon', 'colorPreset', 'custom',
      'customColors', jsonb_build_object(
        'background', '#F6F3EC', 'surface', '#FFFDF9', 'foreground', '#21352F',
        'accent', '#F29A72', 'social', '#DDEAE4', 'headerText', '#FFFDF8',
        'headerMutedText', '#E5F0EB', 'blockTitle', '#21352F',
        'description', '#687770', 'accentText', '#2A160E', 'socialText', '#21352F'
      ),
      'fontPreset', 'editorial', 'radiusPreset', 'rounded', 'galleryLayout', 'carousel',
      'coverType', 'image', 'coverOverlayColor', '#193B32', 'coverOverlayOpacity', 58,
      'headerLayout', 'centered', 'headerAvatarSize', 96, 'headerAvatarShape', 'circle',
      'headerSheetColor', '#193B32', 'headerSheetCoverage', 35,
      'headerGeometry', 'rings', 'headerTexture', 'dots',
      'blockCorner', 65, 'blockBorder', 18, 'blockBorderColor', '#D3E2DB',
      'blockShadow', 22, 'blockShadowStyle', 'soft', 'blockSpacing', 40,
      'templateWordingOverrides', jsonb_build_object(
        'discipline', 'Sustainable fitness · Leeds', 'badge', 'MY JOURNEY',
        'eyebrow', 'One useful choice at a time', 'profileLabel', 'Why I started',
        'targetLabel', 'My goal', 'galleryLabel', 'Everyday movement',
        'achievementsLabel', 'Small wins', 'activityLabel', 'Training diary',
        'secondaryGoalLabel', 'What comes next'
      )
    )
  );

INSERT INTO public_profiles (
  user_id, username, display_name, bio, location, avatar_url, cover_url, theme,
  is_published, show_branding, is_discoverable, allow_indexing,
  seo_title, seo_description, updated_at
)
SELECT
  '06d8aa8e-92aa-4973-a00a-81b977022e2a', username, display_name, bio, location,
  avatar_url, cover_url, theme, true, false, false, false,
  display_name || ' — GRIIT profile',
  CASE username
    WHEN 'demo_jordan_blake' THEN 'Fictional profile of a Bristol strength coach focused on practical, sustainable fitness.'
    ELSE 'Fictional profile documenting a realistic and sustainable weight-loss and fitness journey.'
  END,
  now()
FROM english_profiles
ON CONFLICT (username) DO UPDATE SET
  user_id = EXCLUDED.user_id, display_name = EXCLUDED.display_name,
  bio = EXCLUDED.bio, location = EXCLUDED.location,
  avatar_url = EXCLUDED.avatar_url, cover_url = EXCLUDED.cover_url,
  theme = EXCLUDED.theme, is_published = EXCLUDED.is_published,
  show_branding = EXCLUDED.show_branding,
  is_discoverable = EXCLUDED.is_discoverable,
  allow_indexing = EXCLUDED.allow_indexing,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  updated_at = now();

CREATE TEMP TABLE created_profiles ON COMMIT DROP AS
SELECT p.id AS profile_id, p.username
FROM public_profiles p
JOIN english_profiles source ON source.username = p.username
WHERE p.user_id = '06d8aa8e-92aa-4973-a00a-81b977022e2a';

DELETE FROM profile_blocks WHERE profile_id IN (SELECT profile_id FROM created_profiles);
DELETE FROM profile_social_links WHERE profile_id IN (SELECT profile_id FROM created_profiles);
DELETE FROM profile_sports WHERE profile_id IN (SELECT profile_id FROM created_profiles);
DELETE FROM profile_gallery_items WHERE profile_id IN (SELECT profile_id FROM created_profiles);
DELETE FROM profile_achievements WHERE profile_id IN (SELECT profile_id FROM created_profiles);
DELETE FROM profile_sponsors WHERE profile_id IN (SELECT profile_id FROM created_profiles);
DELETE FROM profile_activities WHERE profile_id IN (SELECT profile_id FROM created_profiles);
DELETE FROM profile_goals WHERE profile_id IN (SELECT profile_id FROM created_profiles);

INSERT INTO profile_sports (profile_id, sport_id, sort_order, is_enabled)
SELECT p.profile_id, s.id, 0, true
FROM created_profiles p JOIN sports s ON s.slug = 'gym';

INSERT INTO profile_sports (profile_id, sport_id, sort_order, is_enabled)
SELECT p.profile_id, s.id, 1, true
FROM created_profiles p
JOIN sports s ON s.slug = CASE p.username
  WHEN 'demo_jordan_blake' THEN 'running' ELSE 'hiking' END;

INSERT INTO profile_goals (
  profile_id, title, description, url, target_at, date_display,
  status, sort_order, is_enabled
)
SELECT
  profile_id,
  CASE username
    WHEN 'demo_jordan_blake' THEN 'Help 150 busy people build lasting strength'
    ELSE 'Lose 10 kg steadily and feel like myself again'
  END,
  CASE username
    WHEN 'demo_jordan_blake' THEN 'Deliver practical coaching that combines strength, mobility, and realistic habits without asking clients to put the rest of life on hold.'
    ELSE 'Take nine months, work alongside my healthcare team, eat more consistently, and complete three manageable movement sessions each week without crash dieting.'
  END,
  'https://griit.me/' || username,
  CASE username
    WHEN 'demo_jordan_blake' THEN '2027-07-31'::timestamp
    ELSE '2027-05-31'::timestamp
  END,
  'countdown', 'active', 0, true
FROM created_profiles;

INSERT INTO profile_goals (
  profile_id, title, description, target_at, date_display,
  status, sort_order, is_enabled
)
SELECT
  profile_id,
  CASE username
    WHEN 'demo_jordan_blake' THEN 'Host a free community training day'
    ELSE 'Complete my first 10K without chasing a time'
  END,
  CASE username
    WHEN 'demo_jordan_blake' THEN 'Bring clients, neighbours, and local charities together for an inclusive morning of movement.'
    ELSE 'Build enough endurance and confidence to enjoy the whole event from the first kilometre to the finish.'
  END,
  CASE username
    WHEN 'demo_jordan_blake' THEN '2027-09-25'::timestamp
    ELSE '2027-10-03'::timestamp
  END,
  'date', 'planned', 1, true
FROM created_profiles;

INSERT INTO profile_blocks (profile_id, type, title, content, sort_order, is_enabled)
SELECT p.profile_id, item.type, item.title, item.content, item.sort_order, true
FROM created_profiles p
CROSS JOIN LATERAL (
  SELECT * FROM (
    VALUES
      ('achievements'::varchar, 'Milestones'::varchar, '{}'::jsonb, 0),
      ('activities'::varchar, 'Recent sessions'::varchar, '{}'::jsonb, 1),
      ('gallery'::varchar, 'In motion'::varchar, '{}'::jsonb, 2),
      ('link'::varchar, 'Follow the journey'::varchar,
        jsonb_build_object(
          'builderManaged', true,
          'title', CASE p.username WHEN 'demo_jordan_blake' THEN 'Practical training notes every week' ELSE 'My honest monthly check-in' END,
          'description', CASE p.username WHEN 'demo_jordan_blake' THEN 'Useful ideas about training, recovery, and consistency that you can apply immediately.' ELSE 'What worked, what felt difficult, and what I am changing for the month ahead.' END,
          'url', 'https://griit.me/' || p.username, 'imageUrl', ''
        ), 3),
      ('offer'::varchar, 'The next step'::varchar,
        jsonb_build_object(
          'builderManaged', true,
          'title', CASE p.username WHEN 'demo_jordan_blake' THEN '45-minute movement and strength review' ELSE 'The routine helping me stay consistent' END,
          'description', CASE p.username WHEN 'demo_jordan_blake' THEN 'A straightforward conversation about your schedule, training history, and the next useful steps.' ELSE 'Plan simple meals, walk most days, and protect three realistic movement sessions each week.' END,
          'url', 'https://griit.me/' || p.username,
          'ctaLabel', CASE p.username WHEN 'demo_jordan_blake' THEN 'Explore the approach' ELSE 'See my journey' END,
          'promoCode', '', 'imageUrl', ''
        ), 4)
  ) AS data(type, title, content, sort_order)
) AS item;

INSERT INTO profile_social_links (profile_id, platform, label, url, sort_order, is_enabled)
SELECT profile_id, 'website',
  CASE username WHEN 'demo_jordan_blake' THEN 'Coaching and training notes' ELSE 'Progress journal' END,
  'https://griit.me/' || username, 0, true
FROM created_profiles;

INSERT INTO profile_achievements (
  profile_id, title, result, achievement_type, event_name, description,
  achieved_at, sort_order, is_enabled
)
SELECT profile_id, item.title, item.result, item.kind, item.event_name,
  item.description, item.achieved_at, item.sort_order, true
FROM created_profiles p
CROSS JOIN LATERAL (
  SELECT * FROM (
    VALUES
      (
        CASE p.username WHEN 'demo_jordan_blake' THEN 'Level 3 Personal Training qualification' ELSE 'Eight consistent weeks' END,
        CASE p.username WHEN 'demo_jordan_blake' THEN 'Strength and conditioning pathway' ELSE 'Three sessions most weeks' END,
        CASE p.username WHEN 'demo_jordan_blake' THEN 'certification' ELSE 'milestone' END,
        CASE p.username WHEN 'demo_jordan_blake' THEN 'Active IQ' ELSE 'First complete training block' END,
        CASE p.username WHEN 'demo_jordan_blake' THEN 'The foundation for a coaching practice built on safe progression, clear communication, and individual context.' ELSE 'Even during busy weeks, I kept two sessions and made time for lunchtime walks.' END,
        CASE p.username WHEN 'demo_jordan_blake' THEN '2019-07-12'::timestamp ELSE '2026-07-27'::timestamp END,
        0
      ),
      (
        CASE p.username WHEN 'demo_jordan_blake' THEN 'Coached 400 individual clients' ELSE 'First nonstop 5K' END,
        CASE p.username WHEN 'demo_jordan_blake' THEN '400 initial assessments' ELSE '39:18' END,
        'milestone',
        CASE p.username WHEN 'demo_jordan_blake' THEN 'One-to-one and small-group coaching' ELSE 'Roundhay Park loop' END,
        CASE p.username WHEN 'demo_jordan_blake' THEN 'Different starting points and ambitions, with the same goal: progress that fits real life.' ELSE 'I started slowly, stayed at a conversational pace, and finished feeling proud rather than exhausted.' END,
        CASE p.username WHEN 'demo_jordan_blake' THEN '2026-06-08'::timestamp ELSE '2026-07-20'::timestamp END,
        1
      )
  ) AS data(title, result, kind, event_name, description, achieved_at, sort_order)
) AS item;

INSERT INTO profile_activities (
  profile_id, title, activity_type, occurred_at, metrics, sort_order, is_enabled
)
SELECT profile_id, item.title, item.activity_type, item.occurred_at,
  item.metrics, item.sort_order, true
FROM created_profiles p
CROSS JOIN LATERAL (
  SELECT * FROM (
    VALUES
      (
        CASE p.username WHEN 'demo_jordan_blake' THEN 'Tuesday strength circuit' ELSE 'Brisk walk after work' END,
        CASE p.username WHEN 'demo_jordan_blake' THEN 'Small group · full-body strength' ELSE 'Walking · comfortable effort' END,
        now() - interval '2 days',
        CASE p.username WHEN 'demo_jordan_blake' THEN jsonb_build_object('duration', '55 min', 'athletes', '7', 'focus', 'squat, pull, carry') ELSE jsonb_build_object('distance', '6.4 km', 'duration', '1h 09m', 'steps', '8,920') END,
        0
      ),
      (
        CASE p.username WHEN 'demo_jordan_blake' THEN 'Mobility and reset' ELSE 'At-home strength session' END,
        CASE p.username WHEN 'demo_jordan_blake' THEN 'Mobility · hips and shoulders' ELSE 'Beginner circuit · no equipment' END,
        now() - interval '5 days',
        CASE p.username WHEN 'demo_jordan_blake' THEN jsonb_build_object('duration', '38 min', 'effort', 'easy', 'focus', 'range and breathing') ELSE jsonb_build_object('duration', '34 min', 'rounds', '3', 'feeling', 'energised') END,
        1
      ),
      (
        CASE p.username WHEN 'demo_jordan_blake' THEN 'Easy harbour run' ELSE 'Run-walk progression' END,
        CASE p.username WHEN 'demo_jordan_blake' THEN 'Running · recovery pace' ELSE 'Running · 4 min / walking · 1 min' END,
        now() - interval '9 days',
        CASE p.username WHEN 'demo_jordan_blake' THEN jsonb_build_object('distance', '8.1 km', 'duration', '46 min', 'effort', 'easy') ELSE jsonb_build_object('distance', '4.8 km', 'duration', '41 min', 'effort', 'controlled') END,
        2
      )
  ) AS data(title, activity_type, occurred_at, metrics, sort_order)
) AS item;

INSERT INTO profile_gallery_items (
  profile_id, image_url, caption, alt_text, sort_order, is_enabled
)
SELECT profile_id, item.image_url, item.caption, item.alt_text,
  item.sort_order, true
FROM created_profiles p
CROSS JOIN LATERAL (
  SELECT * FROM (
    VALUES
      (
        CASE p.username WHEN 'demo_jordan_blake' THEN 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1200&q=82' ELSE 'https://images.unsplash.com/photo-1483721310020-03333e577078?auto=format&fit=crop&w=1200&q=82' END,
        CASE p.username WHEN 'demo_jordan_blake' THEN 'Movement quality before load' ELSE 'Going outside even when motivation is not perfect' END,
        CASE p.username WHEN 'demo_jordan_blake' THEN 'Jordan coaching a strength session' ELSE 'Emily taking a brisk walk outdoors' END,
        0
      ),
      (
        CASE p.username WHEN 'demo_jordan_blake' THEN 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=1200&q=82' ELSE 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=82' END,
        CASE p.username WHEN 'demo_jordan_blake' THEN 'A clear plan, then consistent work' ELSE 'Thirty minutes is enough to keep momentum' END,
        CASE p.username WHEN 'demo_jordan_blake' THEN 'Equipment prepared for a coaching session' ELSE 'An accessible strength session at home' END,
        1
      ),
      (
        CASE p.username WHEN 'demo_jordan_blake' THEN 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&q=82' ELSE 'https://images.unsplash.com/photo-1502904550040-7534597429ae?auto=format&fit=crop&w=1200&q=82' END,
        CASE p.username WHEN 'demo_jordan_blake' THEN 'Getting stronger together' ELSE 'My first 5K: slow, steady, and entirely mine' END,
        CASE p.username WHEN 'demo_jordan_blake' THEN 'A small group training together' ELSE 'Finishing an outdoor running session' END,
        2
      )
  ) AS data(image_url, caption, alt_text, sort_order)
) AS item;

COMMIT;

SELECT id, display_name, username, is_published,
  'https://griit.me/' || username AS public_url
FROM public_profiles
WHERE user_id = '06d8aa8e-92aa-4973-a00a-81b977022e2a'
  AND username IN ('demo_jordan_blake', 'demo_emily_carter')
ORDER BY username;
