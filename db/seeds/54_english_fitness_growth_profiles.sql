-- English counterparts for the 18 French fitness growth/demo profiles.
--
-- All identities are fictional and use different names. Profiles are public by
-- direct URL, hidden from directory/search indexing, and transparently use the
-- `demo_` username prefix. Run after 53_fitness_growth_profiles.sql.

BEGIN;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = '06d8aa8e-92aa-4973-a00a-81b977022e2a'
  ) THEN
    RAISE EXCEPTION 'Owner profile does not exist';
  END IF;

  IF (
    SELECT count(*) FROM public_profiles
    WHERE username = ANY(ARRAY[
      'demo_anais_vidal', 'demo_malik_traore', 'demo_lucas_henry',
      'demo_nora_kim', 'demo_thomas_costa', 'demo_ilyes_rahmani',
      'demo_elena_rossi', 'demo_jonas_meyer', 'demo_maya_johnson',
      'demo_manon_lefevre', 'demo_karim_aitali', 'demo_sophie_nguyen',
      'demo_camille_roy', 'demo_dylan_brooks', 'demo_nadia_benali',
      'demo_theo_garnier', 'demo_lea_dumont', 'demo_adam_park'
    ])
  ) <> 18 THEN
    RAISE EXCEPTION 'The 18 source profiles from seed 53 are required';
  END IF;
END $$;

CREATE TEMP TABLE english_growth_profiles (
  seq integer PRIMARY KEY,
  segment varchar(24) NOT NULL,
  source_username varchar(32) NOT NULL,
  username varchar(32) UNIQUE NOT NULL,
  display_name varchar(120) NOT NULL,
  bio text NOT NULL,
  location varchar(120) NOT NULL,
  badge varchar(40) NOT NULL,
  discipline varchar(100) NOT NULL,
  eyebrow varchar(120) NOT NULL,
  goal_title varchar(160) NOT NULL,
  goal_description text NOT NULL,
  achievement_title varchar(160) NOT NULL,
  achievement_result varchar(120) NOT NULL,
  activity_title varchar(160) NOT NULL,
  activity_type varchar(80) NOT NULL,
  portrait_group varchar(8) NOT NULL,
  portrait_id integer NOT NULL
) ON COMMIT DROP;

INSERT INTO english_growth_profiles VALUES
  (1, 'amateur', 'demo_anais_vidal', 'demo_emily_foster', 'Emily Foster',
   'Product designer during the week and new hybrid athlete after work. I am learning strength and running with one clear target: arrive prepared for my first HYROX without turning training into a second job.',
   'Manchester, United Kingdom', 'BEGINNER', 'Amateur hybrid athlete · Manchester',
   'First season, real intention', 'Finish my first HYROX in under 1 hour 35',
   'Build a consistent base, learn the movements properly, and keep enough energy to run well between every station.',
   'First official 10K', '58:27', 'Partner running and station session',
   'HYROX · beginner technique', 'women', 24),
  (2, 'amateur', 'demo_malik_traore', 'demo_callum_price', 'Callum Price',
   'Physiotherapy student and MMA beginner with eighteen months of training. I share the sessions, mistakes, and nerves behind the preparation for my first amateur fight.',
   'Birmingham, United Kingdom', 'AMATEUR', 'Amateur MMA fighter · Birmingham',
   'Learn to stay calm', 'Compete in my first amateur MMA fight',
   'Improve my ground defence, manage intensity, and enter the cage with a simple plan I can still execute under pressure.',
   'First interclub grappling event', '3 matches · 2 wins',
   'Position-focused MMA rounds', 'MMA · striking to wrestling', 'men', 43),
  (3, 'amateur', 'demo_lucas_henry', 'demo_sophie_bennett', 'Sophie Bennett',
   'Teacher, new mum, and new runner. I am starting from difficult three-kilometre runs and building a routine that can carry me to a first half marathon without constant injury or guilt.',
   'Bristol, United Kingdom', 'FIRST HALF', 'Amateur runner · Bristol',
   'From three kilometres to twenty-one', 'Finish my first half marathon in under two hours',
   'Run three times a week, strengthen my legs, and learn to slow down on the days when patience is the most useful training tool.',
   'First month with three weekly runs', '12 sessions completed',
   'Progressive long run', 'Running · easy endurance', 'women', 36),

  (4, 'intermediate', 'demo_nora_kim', 'demo_rachel_park', 'Rachel Park',
   'CrossFit athlete for four years, confident with strength and still developing my gymnastics. I document a complete season, including the days when the bar feels light and the days when nothing clicks.',
   'Toronto, Canada', 'INTERMEDIATE', 'CrossFit athlete · Toronto',
   'Turn weaknesses into skills', 'Reach the top 10% in the CrossFit Open',
   'Keep my strength while improving strict pulling, toes-to-bar, and the ability to repeat quality efforts without falling apart.',
   'First strict muscle-up', '1 clean rep',
   'Barbell and gymnastics intervals', 'CrossFit · capacity under fatigue', 'women', 48),
  (5, 'intermediate', 'demo_thomas_costa', 'demo_oliver_grant', 'Oliver Grant',
   'Trail runner with five seasons of racing, happiest on long climbs and technical descents. My current project is the step from marathon distance to a first mountain ultra.',
   'Edinburgh, United Kingdom', '50 KM', 'Intermediate trail runner · Edinburgh',
   'Go farther, stay clear-headed', 'Finish my first 50K trail race in under six hours',
   'Build uphill endurance, make fuelling reliable, and keep enough strength to make good decisions through the final twelve kilometres.',
   'Cairngorms Trail 32K', '3:51 · 14th age group',
   'Mountain run with elevation', 'Trail running · specific endurance', 'men', 32),
  (6, 'intermediate', 'demo_ilyes_rahmani', 'demo_amir_lawson', 'Amir Lawson',
   'Experienced amateur with six MMA fights and a full-time job. I am building a pressure-based style with better conditioning, cleaner decisions, and no interest in rushing the process.',
   'London, United Kingdom', '6 FIGHTS', 'Amateur MMA fighter · London',
   'Bring structure to intensity', 'Win a regional amateur lightweight title',
   'Choose my entries better, defend takedowns against the fence, and hold a controlled pace through three complete rounds.',
   'London amateur tournament', 'Finalist · 2 wins',
   'Situational sparring', 'MMA · cage work and exits', 'men', 58),

  (7, 'pro', 'demo_elena_rossi', 'demo_valentina_cruz', 'Valentina Cruz',
   'Professional flyweight from a kickboxing background, now building a complete MMA career. Every camp is organised around one clear problem that needs solving before fight night.',
   'Madrid, Spain', 'PRO · 7–1', 'Professional MMA fighter · Madrid',
   'Prepare every minute', 'Enter the European flyweight top ten',
   'Earn two international wins by controlling transitions and imposing volume without creating unnecessary openings.',
   'Madrid Fight Night main event', 'Win · round 3 TKO',
   'Professional MMA rounds', 'MMA · 5 × 5 minutes', 'women', 67),
  (8, 'pro', 'demo_jonas_meyer', 'demo_felix_wagner', 'Felix Wagner',
   'HYROX Elite 15 athlete and former national-level rower. I like repeatable sessions, useful numbers, and races where a smart plan matters as much as a big engine.',
   'Hamburg, Germany', 'ELITE 15', 'Professional HYROX athlete · Hamburg',
   'No weak stations', 'Break 56 minutes in HYROX Pro',
   'Gain time on the sleds and wall balls without compromising the eight running kilometres or the precision of every transition.',
   'HYROX Pro Berlin', '57:06 · 5th',
   'Race-pace simulation', 'HYROX Pro · 6 blocks', 'men', 66),
  (9, 'pro', 'demo_maya_johnson', 'demo_aisha_morgan', 'Aisha Morgan',
   'Professional marathon runner and former 10,000-metre specialist. I share the reality behind high-level preparation: volume, recovery, doubt, and decisions made far from the finish line.',
   'London, United Kingdom', '2:31', 'Professional marathon runner · London',
   'Build the race patiently', 'Run a marathon in under 2 hours 30',
   'Improve running economy, absorb a consistent ten-week block, and reach kilometre thirty with good decisions still available.',
   'Valencia Marathon', '2:31:22 · PB',
   'Progressive marathon tempo', 'Running · marathon pace', 'women', 72),

  (10, 'weight_loss', 'demo_manon_lefevre', 'demo_hannah_wilson', 'Hannah Wilson',
   'Night-shift nurse and mum working toward weight loss without another strict-diet cycle. My approach is built around simple meals, daily walking, and two realistic strength sessions.',
   'Leeds, United Kingdom', 'MY JOURNEY', 'Sustainable fitness · Leeds',
   'Make room for myself', 'Lose 15 kg sustainably and get my energy back',
   'Work alongside my healthcare team, protect sleep after night shifts, and build habits that still work during difficult weeks.',
   'One hundred days of regular walking', '748,000 total steps',
   'Beginner full-body strength', 'Gym · machines and dumbbells', 'women', 54),
  (11, 'weight_loss', 'demo_karim_aitali', 'demo_daniel_cooper', 'Daniel Cooper',
   'Sales manager, long-time desk worker, and former believer that exercise had to hurt to count. I am restarting with gradual targets, monthly reviews, and much less guilt.',
   'Birmingham, United Kingdom', 'RESTART', 'Sustainable transformation · Birmingham',
   'Restart without punishment', 'Lose 20 kg and finish a doubles HYROX',
   'Improve my health with medical support, build an active week, and train for an event that gives each session a practical purpose.',
   'First 5 kg lost', '12 consistent weeks',
   'Low-impact conditioning circuit', 'Gym · rower, carry, sled', 'men', 45),
  (12, 'weight_loss', 'demo_sophie_nguyen', 'demo_priya_patel', 'Priya Patel',
   'Accountant and former dancer rebuilding a calmer relationship with my body after years away from exercise. I measure energy, strength, and consistency before anything on the scale.',
   'London, United Kingdom', 'CONSISTENCY', 'Return to fitness · London',
   'Look for momentum, not perfection', 'Lose 10 kg gradually and complete my first 10K',
   'Alternate running and walking, learn the foundations of strength, and make stable food choices without excluding shared meals.',
   'First nonstop 5K', '35:48',
   'Run-walk session by the river', 'Running · 5/1 progression', 'women', 59),

  (13, 'coach', 'demo_camille_roy', 'demo_lauren_mitchell', 'Lauren Mitchell',
   'Strength coach specialising in women returning after a long break. My job is to make the gym understandable, welcoming, and genuinely useful outside the mirror.',
   'Bristol, United Kingdom', 'COACH', 'Strength and fitness coach · Bristol',
   'Confidence comes through repetition', 'Help 120 women train independently',
   'Create accessible programmes, teach the fundamental movements, and give every client the tools to progress without permanent dependence on a coach.',
   'Advanced strength coaching certification', 'Qualification completed',
   'Small-group foundational strength', 'Coaching · squat, press, carry', 'women', 63),
  (14, 'coach', 'demo_dylan_brooks', 'demo_connor_hayes', 'Connor Hayes',
   'Hybrid coach combining running and strength, with a background in rugby. I help busy people become fitter and stronger through four intentional sessions instead of seven improvised ones.',
   'Dublin, Ireland', 'HYBRID COACH', 'Hybrid performance coach · Dublin',
   'Strength that can keep moving', 'Prepare 50 athletes for their first HYROX',
   'Build a clear beginner method with controlled running, efficient station technique, and progression slow enough to keep people healthy.',
   'Fifty athletes coached', '92% finish rate',
   'Compromised running session', 'HYROX coaching · run and sled', 'men', 50),
  (15, 'coach', 'demo_nadia_benali', 'demo_samira_khan', 'Samira Khan',
   'Strength and conditioning coach for combat sports and Brazilian jiu-jitsu practitioner. I turn the demands of fighting into simple, measurable work that supports technical training.',
   'Manchester, United Kingdom', 'S&C COACH', 'MMA performance coach · Manchester',
   'Prepare the body for chaos', 'Guide ten fighters through an avoidable-injury-free season',
   'Individualise loading, monitor fatigue more clearly, and build useful power that remains available in the final round.',
   'Strength and conditioning diploma', 'Combat-sport specialisation',
   'Power and level-change session', 'MMA coaching · strength-speed', 'women', 69),

  (16, 'mass_gain', 'demo_theo_garnier', 'demo_ethan_reed', 'Ethan Reed',
   'University student with a small appetite and several years of training without a plan. I want to build muscle naturally, learn to eat enough, and track more than the number on the scale.',
   'Liverpool, United Kingdom', '+8 KG', 'Natural muscle gain · Liverpool',
   'Build without rushing', 'Gain 8 kg in twelve months while staying athletic',
   'Progress on the basic lifts, raise food intake gradually, and protect sleep so that added weight represents a genuine physical change.',
   'First 100 kg bench press', '1 clean rep',
   'Upper-body hypertrophy', 'Gym · pressing and pulling', 'men', 61),
  (17, 'mass_gain', 'demo_lea_dumont', 'demo_megan_clarke', 'Megan Clarke',
   'Vegetarian recreational athlete and new powerlifter. My goal is not to become smaller, but to build strong legs, a resilient back, and more confidence under the bar.',
   'Cardiff, United Kingdom', 'BUILD', 'Strength transformation · Cardiff',
   'Take up space with confidence', 'Gain 5 kg and total 300 kg in competition',
   'Eat enough consistently, improve technique across all three lifts, and welcome visible progress that is not centred on becoming thinner.',
   'First double-bodyweight deadlift', '135 kg',
   'Squat volume and accessories', 'Powerlifting · lower body', 'women', 74),
  (18, 'mass_gain', 'demo_adam_park', 'demo_noah_chen', 'Noah Chen',
   'Young engineer, former lightweight runner, and committed strength beginner. I want a balanced transformation: more muscle, enough cardio, and no need to live in the gym.',
   'Vancouver, Canada', 'LEAN GAIN', 'Athletic transformation · Vancouver',
   'Get stronger without losing the engine', 'Build 6 kg of muscle and keep a sub-22-minute 5K',
   'Follow four strength sessions, keep two easy runs, and adjust calories patiently instead of forcing rapid weight gain.',
   'First complete twelve-week cycle', '+3 kg · 48 sessions',
   'Full-body strength and conditioning', 'Gym · athletic strength', 'men', 76);

INSERT INTO public_profiles (
  user_id, username, display_name, bio, location, avatar_url, cover_url, theme,
  is_published, show_branding, is_discoverable, allow_indexing,
  seo_title, seo_description, updated_at
)
SELECT
  '06d8aa8e-92aa-4973-a00a-81b977022e2a', target.username,
  target.display_name, target.bio, target.location,
  format('https://randomuser.me/api/portraits/%s/%s.jpg', target.portrait_group, target.portrait_id),
  source.cover_url,
  jsonb_set(
    source.theme,
    '{templateWordingOverrides}',
    jsonb_build_object(
      'discipline', target.discipline, 'badge', target.badge,
      'eyebrow', target.eyebrow,
      'profileLabel', CASE target.segment WHEN 'coach' THEN 'My method' WHEN 'weight_loss' THEN 'Why I started' WHEN 'mass_gain' THEN 'The project' ELSE 'My journey' END,
      'targetLabel', CASE target.segment WHEN 'coach' THEN 'Current mission' ELSE 'Main objective' END,
      'galleryLabel', 'Everyday movement',
      'achievementsLabel', CASE target.segment WHEN 'pro' THEN 'Results' ELSE 'Milestones' END,
      'activityLabel', 'Recent sessions', 'secondaryGoalLabel', 'What comes next'
    ),
    true
  ),
  true, false, false, false,
  left(target.display_name || ' — GRIIT demo profile', 70),
  left('Fictional GRIIT profile built around ' || primary_sport.name || ' and a concrete fitness objective.', 160),
  now()
FROM english_growth_profiles target
JOIN public_profiles source ON source.username = target.source_username
JOIN LATERAL (
  SELECT sport.name
  FROM profile_sports relation
  JOIN sports sport ON sport.id = relation.sport_id
  WHERE relation.profile_id = source.id AND relation.sort_order = 0
  ORDER BY relation.id
  LIMIT 1
) primary_sport ON true
ON CONFLICT (username) DO UPDATE SET
  user_id = EXCLUDED.user_id, display_name = EXCLUDED.display_name,
  bio = EXCLUDED.bio, location = EXCLUDED.location,
  avatar_url = EXCLUDED.avatar_url, cover_url = EXCLUDED.cover_url,
  theme = EXCLUDED.theme, is_published = true, show_branding = false,
  is_discoverable = false, allow_indexing = false,
  seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description,
  updated_at = now();

CREATE TEMP TABLE created_profiles ON COMMIT DROP AS
SELECT target.*, profile.id AS profile_id, source.id AS source_profile_id
FROM english_growth_profiles target
JOIN public_profiles profile ON profile.username = target.username
JOIN public_profiles source ON source.username = target.source_username
WHERE profile.user_id = '06d8aa8e-92aa-4973-a00a-81b977022e2a';

DELETE FROM profile_blocks WHERE profile_id IN (SELECT profile_id FROM created_profiles);
DELETE FROM profile_social_links WHERE profile_id IN (SELECT profile_id FROM created_profiles);
DELETE FROM profile_sports WHERE profile_id IN (SELECT profile_id FROM created_profiles);
DELETE FROM profile_gallery_items WHERE profile_id IN (SELECT profile_id FROM created_profiles);
DELETE FROM profile_achievements WHERE profile_id IN (SELECT profile_id FROM created_profiles);
DELETE FROM profile_sponsors WHERE profile_id IN (SELECT profile_id FROM created_profiles);
DELETE FROM profile_activities WHERE profile_id IN (SELECT profile_id FROM created_profiles);
DELETE FROM profile_goals WHERE profile_id IN (SELECT profile_id FROM created_profiles);

INSERT INTO profile_sports (profile_id, sport_id, sort_order, is_enabled)
SELECT target.profile_id, source_sport.sport_id,
  source_sport.sort_order, source_sport.is_enabled
FROM created_profiles target
JOIN profile_sports source_sport ON source_sport.profile_id = target.source_profile_id;

INSERT INTO profile_goals (
  profile_id, title, description, url, target_at, date_display,
  status, sort_order, is_enabled
)
SELECT target.profile_id, target.goal_title, target.goal_description,
  'https://griit.me/' || target.username, source_goal.target_at,
  'countdown', 'active', 0, true
FROM created_profiles target
JOIN profile_goals source_goal
  ON source_goal.profile_id = target.source_profile_id
  AND source_goal.sort_order = 0;

INSERT INTO profile_goals (
  profile_id, title, description, target_at, date_display,
  status, sort_order, is_enabled
)
SELECT profile_id,
  CASE segment
    WHEN 'amateur' THEN 'Keep a three-session routine for six months'
    WHEN 'intermediate' THEN 'Turn my biggest weakness into a reliable skill'
    WHEN 'pro' THEN 'Share the honest work behind a complete season'
    WHEN 'weight_loss' THEN 'Build an active week without extreme dieting'
    WHEN 'coach' THEN 'Host an inclusive community training session'
    ELSE 'Stay fully conditioned throughout the transformation'
  END,
  CASE segment
    WHEN 'amateur' THEN 'Make consistency a skill before adding more volume or intensity.'
    WHEN 'intermediate' THEN 'Dedicate a complete training cycle to the quality currently limiting competition performance.'
    WHEN 'pro' THEN 'Show preparation, adjustment, and recovery with the same honesty as race or fight results.'
    WHEN 'weight_loss' THEN 'Walk more, strengthen the whole body, and keep food choices compatible with a normal social life.'
    WHEN 'coach' THEN 'Create a welcoming event that helps new people discover training at an appropriate level.'
    ELSE 'Build muscle while maintaining mobility, cardiovascular fitness, and a healthy relationship with training.'
  END,
  (SELECT target_at FROM profile_goals source_goal
   WHERE source_goal.profile_id = source_profile_id
   AND source_goal.sort_order = 1 LIMIT 1),
  'date', 'planned', 1, true
FROM created_profiles;

INSERT INTO profile_blocks (profile_id, type, title, content, sort_order, is_enabled)
SELECT profile.profile_id, block.type, block.title, block.content, block.sort_order, true
FROM created_profiles profile
CROSS JOIN LATERAL (
  VALUES
    ('achievements'::varchar, 'Milestones'::varchar, jsonb_build_object('builderManaged', true), 0),
    ('activities'::varchar, 'Recent sessions'::varchar, jsonb_build_object('builderManaged', true), 1),
    ('gallery'::varchar, 'In motion'::varchar, jsonb_build_object('builderManaged', true), 2),
    ('link'::varchar, 'Follow the journey'::varchar, jsonb_build_object(
      'builderManaged', true,
      'title', CASE profile.segment WHEN 'coach' THEN 'Coaching notes and practical guidance' ELSE 'The complete progress journal' END,
      'description', CASE profile.segment WHEN 'coach' THEN 'Straightforward ideas about training, recovery, and habits that last beyond a single programme.' ELSE 'The strong sessions, difficult weeks, and useful adjustments behind every milestone.' END,
      'url', 'https://griit.me/' || profile.username, 'imageUrl', ''
    ), 3),
    ('offer'::varchar, 'Take the next step'::varchar, jsonb_build_object(
      'builderManaged', true,
      'title', CASE profile.segment
        WHEN 'coach' THEN 'Explore my coaching approach'
        WHEN 'weight_loss' THEN 'The routine helping me stay consistent'
        WHEN 'mass_gain' THEN 'My twelve-month transformation plan'
        ELSE 'See the plan behind the objective'
      END,
      'description', CASE profile.segment
        WHEN 'coach' THEN 'Progressive coaching built around experience, constraints, and real life.'
        WHEN 'weight_loss' THEN 'Simple meals, more walking, and accessible sessions without chasing perfection.'
        WHEN 'mass_gain' THEN 'Measured progress across training loads, food intake, sleep, and performance.'
        ELSE 'Weekly priorities, key sessions, and the decisions that keep progress moving.'
      END,
      'url', 'https://griit.me/' || profile.username,
      'ctaLabel', CASE profile.segment WHEN 'coach' THEN 'Explore coaching' ELSE 'See the journey' END,
      'promoCode', '', 'imageUrl', '', 'displaySize', 'medium', 'isAffiliate', false
    ), 4)
) AS block(type, title, content, sort_order);

INSERT INTO profile_social_links (profile_id, platform, label, url, sort_order, is_enabled)
SELECT profile_id, 'website',
  CASE segment WHEN 'coach' THEN 'Coaching and resources' ELSE 'Progress journal' END,
  'https://griit.me/' || username, 0, true
FROM created_profiles;

INSERT INTO profile_achievements (
  profile_id, title, result, achievement_type, event_name, description,
  achieved_at, sort_order, is_enabled
)
SELECT profile_id, achievement_title, achievement_result,
  CASE segment
    WHEN 'pro' THEN 'podium' WHEN 'coach' THEN 'certification'
    WHEN 'mass_gain' THEN 'personal_best' ELSE 'milestone'
  END,
  CASE segment
    WHEN 'coach' THEN 'Professional education and experience'
    WHEN 'weight_loss' THEN 'Personal journey'
    WHEN 'mass_gain' THEN 'Training cycle'
    ELSE '2026 season milestone'
  END,
  CASE segment
    WHEN 'pro' THEN 'A result built through a complete training block, a clear strategy, and composed execution on competition day.'
    WHEN 'coach' THEN 'A professional step supporting a coaching practice based on safety, listening, and individual progression.'
    WHEN 'weight_loss' THEN 'A concrete win that matters more than a perfect week or a rapid change on the scale.'
    WHEN 'mass_gain' THEN 'A strength marker showing that physical progress is about much more than bodyweight alone.'
    ELSE 'An important milestone earned through several months of consistent work and patient adjustments.'
  END,
  now() - interval '70 days', 0, true
FROM created_profiles;

INSERT INTO profile_achievements (
  profile_id, title, result, achievement_type, event_name, description,
  achieved_at, sort_order, is_enabled
)
SELECT profile_id,
  CASE segment
    WHEN 'amateur' THEN 'Eight weeks without quitting'
    WHEN 'intermediate' THEN 'A new consistency benchmark'
    WHEN 'pro' THEN 'Complete international season'
    WHEN 'weight_loss' THEN 'First month without all-or-nothing thinking'
    WHEN 'coach' THEN 'One hundred people coached'
    ELSE 'First controlled surplus phase completed'
  END,
  CASE segment
    WHEN 'amateur' THEN '24 sessions'
    WHEN 'intermediate' THEN '48 sessions · 12 weeks'
    WHEN 'pro' THEN '8 competitions'
    WHEN 'weight_loss' THEN '4 consistent weeks'
    WHEN 'coach' THEN '100 individual assessments'
    ELSE '+2 kg · stronger across every lift'
  END,
  'milestone', 'Personal progress',
  'A simple, honest marker showing the value of the work accumulated between major goals.',
  now() - interval '150 days', 1, true
FROM created_profiles;

INSERT INTO profile_activities (
  profile_id, title, activity_type, occurred_at, metrics, sort_order, is_enabled
)
SELECT profile_id, activity_title, activity_type, now() - interval '2 days',
  jsonb_build_object(
    'duration', CASE segment WHEN 'pro' THEN '92 min' WHEN 'amateur' THEN '54 min' ELSE '68 min' END,
    'feeling', CASE seq % 3 WHEN 0 THEN 'controlled' WHEN 1 THEN 'productive' ELSE 'demanding but clean' END
  ), 0, true
FROM created_profiles;

INSERT INTO profile_activities (
  profile_id, title, activity_type, occurred_at, metrics, sort_order, is_enabled
)
SELECT profile_id,
  CASE segment
    WHEN 'weight_loss' THEN 'Brisk walk after work'
    WHEN 'coach' THEN 'One-to-one technical session'
    WHEN 'mass_gain' THEN 'Lower-body loading progression'
    WHEN 'pro' THEN 'Competition-specific session'
    ELSE 'General strength and mobility'
  END,
  CASE segment
    WHEN 'weight_loss' THEN 'Walking · comfortable effort'
    WHEN 'coach' THEN 'Coaching · corrections and progression'
    WHEN 'mass_gain' THEN 'Gym · controlled hypertrophy'
    WHEN 'pro' THEN 'Competition preparation · high quality'
    ELSE 'Gym & Fitness · fundamentals'
  END,
  now() - interval '6 days',
  jsonb_build_object('duration', '48 min', 'intensity', 'moderate', 'quality', 'consistent'),
  1, true
FROM created_profiles;

INSERT INTO profile_activities (
  profile_id, title, activity_type, occurred_at, metrics, sort_order, is_enabled
)
SELECT target.profile_id,
  CASE WHEN primary_sport.name IN ('Running','Trail Running','HYROX') THEN 'Easy aerobic run' ELSE 'Active recovery and mobility' END,
  CASE WHEN primary_sport.name IN ('Running','Trail Running','HYROX') THEN 'Running · conversational effort' ELSE 'Mobility · breathing and range' END,
  now() - interval '10 days',
  CASE WHEN primary_sport.name IN ('Running','Trail Running','HYROX')
    THEN jsonb_build_object('distance', CASE target.segment WHEN 'pro' THEN '14.2 km' ELSE '7.4 km' END, 'effort', 'easy')
    ELSE jsonb_build_object('duration', '36 min', 'effort', 'very easy')
  END,
  2, true
FROM created_profiles target
JOIN LATERAL (
  SELECT sport.name
  FROM profile_sports relation
  JOIN sports sport ON sport.id = relation.sport_id
  WHERE relation.profile_id = target.profile_id AND relation.sort_order = 0
  ORDER BY relation.id LIMIT 1
) primary_sport ON true;

INSERT INTO profile_gallery_items (
  profile_id, image_url, caption, alt_text, sort_order, is_enabled
)
SELECT target.profile_id, source_gallery.image_url,
  CASE source_gallery.sort_order
    WHEN 0 THEN 'The real work behind the objective'
    WHEN 1 THEN 'A useful session does not need to look spectacular'
    ELSE 'Building confidence one repetition at a time'
  END,
  target.display_name || ' — ' || CASE source_gallery.sort_order
    WHEN 0 THEN 'main training session'
    WHEN 1 THEN 'training in progress'
    ELSE 'consistent sporting practice'
  END,
  source_gallery.sort_order, true
FROM created_profiles target
JOIN profile_gallery_items source_gallery
  ON source_gallery.profile_id = target.source_profile_id
  AND source_gallery.is_enabled = true;

COMMIT;

SELECT id, display_name, username, is_published,
  'https://griit.me/' || username AS public_url
FROM public_profiles
WHERE user_id = '06d8aa8e-92aa-4973-a00a-81b977022e2a'
  AND username = ANY(ARRAY[
    'demo_emily_foster', 'demo_callum_price', 'demo_sophie_bennett',
    'demo_rachel_park', 'demo_oliver_grant', 'demo_amir_lawson',
    'demo_valentina_cruz', 'demo_felix_wagner', 'demo_aisha_morgan',
    'demo_hannah_wilson', 'demo_daniel_cooper', 'demo_priya_patel',
    'demo_lauren_mitchell', 'demo_connor_hayes', 'demo_samira_khan',
    'demo_ethan_reed', 'demo_megan_clarke', 'demo_noah_chen'
  ])
ORDER BY id;
