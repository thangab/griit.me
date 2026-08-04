-- Two realistic French demo profiles owned by the requested GRIIT account.
--
-- The people and their stories are fictional. The profiles are published so
-- their direct URLs work, but they stay out of the directory and search-indexing.
-- Safe to rerun: each profile is upserted and its child content is rebuilt.

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

CREATE TEMP TABLE realistic_profiles (
  username varchar(32) PRIMARY KEY,
  display_name varchar(120) NOT NULL,
  bio text NOT NULL,
  location varchar(120) NOT NULL,
  avatar_url text NOT NULL,
  cover_url text NOT NULL,
  template_id varchar(24) NOT NULL,
  theme jsonb NOT NULL
) ON COMMIT DROP;

INSERT INTO realistic_profiles VALUES
  (
    'demo_antoine_mercier',
    'Antoine Mercier',
    'Coach sportif diplômé, spécialisé dans la remise en forme des adultes actifs. J’aide mes clients à retrouver de la force, de l’énergie et une routine qui tient vraiment dans leur quotidien.',
    'Bordeaux, France',
    'https://randomuser.me/api/portraits/men/32.jpg',
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1600&q=84',
    'obsidian',
    jsonb_build_object(
      'templateId', 'obsidian',
      'colorPreset', 'custom',
      'customColors', jsonb_build_object(
        'background', '#0B0D0C', 'surface', '#171A18', 'foreground', '#F7FAF5',
        'accent', '#B6F23D', 'social', '#242923', 'headerText', '#F7FAF5',
        'headerMutedText', '#CAD5C5', 'blockTitle', '#F7FAF5',
        'description', '#AEB9AA', 'accentText', '#10130E', 'socialText', '#F7FAF5'
      ),
      'fontPreset', 'athletic', 'radiusPreset', 'soft', 'galleryLayout', 'editorial',
      'coverType', 'image', 'coverOverlayColor', '#071008', 'coverOverlayOpacity', 62,
      'headerLayout', 'split', 'headerAvatarSize', 104, 'headerAvatarShape', 'circle',
      'headerSheetColor', '#0B0D0C', 'headerSheetCoverage', 35,
      'headerGeometry', 'velocity', 'headerTexture', 'grid',
      'blockCorner', 35, 'blockBorder', 28, 'blockBorderColor', '#B6F23D',
      'blockShadow', 32, 'blockShadowStyle', 'soft', 'blockSpacing', 34,
      'templateWordingOverrides', jsonb_build_object(
        'discipline', 'Coach sportif · Bordeaux', 'badge', 'COACH',
        'eyebrow', 'Bouger mieux, vivre plus fort', 'profileLabel', 'Ma méthode',
        'targetLabel', 'Mission actuelle', 'galleryLabel', 'Sur le terrain',
        'achievementsLabel', 'Parcours', 'activityLabel', 'Dernières séances',
        'secondaryGoalLabel', 'La suite'
      )
    )
  ),
  (
    'demo_sarah_leclerc',
    'Sarah Leclerc',
    'Maman de deux enfants et cheffe de projet, je reprends soin de moi après plusieurs années à passer en dernier. Je partage un parcours simple : mieux manger, marcher davantage et retrouver confiance sans chercher la perfection.',
    'Nantes, France',
    'https://randomuser.me/api/portraits/women/44.jpg',
    'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=1600&q=84',
    'evergreen',
    jsonb_build_object(
      'templateId', 'evergreen',
      'colorPreset', 'custom',
      'customColors', jsonb_build_object(
        'background', '#F4F0E8', 'surface', '#FFFDF8', 'foreground', '#183129',
        'accent', '#E88962', 'social', '#DCE9DF', 'headerText', '#FFFDF8',
        'headerMutedText', '#E2EEE5', 'blockTitle', '#183129',
        'description', '#65736B', 'accentText', '#27130C', 'socialText', '#183129'
      ),
      'fontPreset', 'editorial', 'radiusPreset', 'rounded', 'galleryLayout', 'carousel',
      'coverType', 'image', 'coverOverlayColor', '#183129', 'coverOverlayOpacity', 55,
      'headerLayout', 'centered', 'headerAvatarSize', 96, 'headerAvatarShape', 'circle',
      'headerSheetColor', '#183129', 'headerSheetCoverage', 35,
      'headerGeometry', 'rings', 'headerTexture', 'dots',
      'blockCorner', 65, 'blockBorder', 18, 'blockBorderColor', '#D5E2D8',
      'blockShadow', 24, 'blockShadowStyle', 'soft', 'blockSpacing', 40,
      'templateWordingOverrides', jsonb_build_object(
        'discipline', 'Remise en forme · Nantes', 'badge', 'MON PARCOURS',
        'eyebrow', 'Un choix utile à la fois', 'profileLabel', 'Pourquoi je commence',
        'targetLabel', 'Mon objectif', 'galleryLabel', 'Le quotidien en mouvement',
        'achievementsLabel', 'Petites victoires', 'activityLabel', 'Journal de bord',
        'secondaryGoalLabel', 'Prochaine étape'
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
  display_name || ' — Profil GRIIT',
  CASE username
    WHEN 'demo_antoine_mercier' THEN 'Profil fictif d’un coach sportif à Bordeaux, spécialisé en remise en forme durable.'
    ELSE 'Profil fictif d’une femme qui partage son parcours de perte de poids durable et de remise en forme.'
  END,
  now()
FROM realistic_profiles
ON CONFLICT (username) DO UPDATE SET
  user_id = EXCLUDED.user_id,
  display_name = EXCLUDED.display_name,
  bio = EXCLUDED.bio,
  location = EXCLUDED.location,
  avatar_url = EXCLUDED.avatar_url,
  cover_url = EXCLUDED.cover_url,
  theme = EXCLUDED.theme,
  is_published = EXCLUDED.is_published,
  show_branding = EXCLUDED.show_branding,
  is_discoverable = EXCLUDED.is_discoverable,
  allow_indexing = EXCLUDED.allow_indexing,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  updated_at = now();

CREATE TEMP TABLE created_profiles ON COMMIT DROP AS
SELECT p.id AS profile_id, p.username
FROM public_profiles p
JOIN realistic_profiles source ON source.username = p.username
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
FROM created_profiles p
JOIN sports s ON s.slug = 'gym';

INSERT INTO profile_sports (profile_id, sport_id, sort_order, is_enabled)
SELECT p.profile_id, s.id, 1, true
FROM created_profiles p
JOIN sports s ON s.slug = CASE p.username
  WHEN 'demo_antoine_mercier' THEN 'running'
  ELSE 'hiking'
END;

INSERT INTO profile_goals (
  profile_id, title, description, url, target_at, date_display, status, sort_order, is_enabled
)
SELECT
  profile_id,
  CASE username
    WHEN 'demo_antoine_mercier' THEN 'Accompagner 100 personnes vers une routine durable'
    ELSE 'Perdre 12 kg progressivement et retrouver mon énergie'
  END,
  CASE username
    WHEN 'demo_antoine_mercier' THEN 'Créer un accompagnement accessible qui combine force, mobilité et habitudes simples, avec des résultats mesurables sans sacrifier la vie personnelle.'
    ELSE 'Avancer sur neuf mois avec un suivi médical, des repas plus réguliers, trois séances accessibles par semaine et aucun régime extrême.'
  END,
  'https://griit.me/' || username,
  CASE username
    WHEN 'demo_antoine_mercier' THEN '2027-06-30'::timestamp
    ELSE '2027-04-30'::timestamp
  END,
  'countdown', 'active', 0, true
FROM created_profiles;

INSERT INTO profile_goals (
  profile_id, title, description, target_at, date_display, status, sort_order, is_enabled
)
SELECT
  profile_id,
  CASE username
    WHEN 'demo_antoine_mercier' THEN 'Organiser un entraînement collectif solidaire'
    ELSE 'Courir mon premier 10 km sans objectif de chrono'
  END,
  CASE username
    WHEN 'demo_antoine_mercier' THEN 'Réunir clients, voisins et associations locales autour d’une matinée sportive ouverte à tous les niveaux.'
    ELSE 'Construire assez d’endurance et de confiance pour profiter de la course du début à la fin.'
  END,
  CASE username
    WHEN 'demo_antoine_mercier' THEN '2027-09-18'::timestamp
    ELSE '2027-09-12'::timestamp
  END,
  'date', 'planned', 1, true
FROM created_profiles;

INSERT INTO profile_blocks (profile_id, type, title, content, sort_order, is_enabled)
SELECT p.profile_id, block.type, block.title, block.content, block.sort_order, true
FROM created_profiles p
CROSS JOIN LATERAL (
  SELECT * FROM (
    VALUES
      ('achievements'::varchar, 'Parcours'::varchar, '{}'::jsonb, 0),
      ('activities'::varchar, 'Dernières séances'::varchar, '{}'::jsonb, 1),
      ('gallery'::varchar, 'En mouvement'::varchar, '{}'::jsonb, 2),
      ('link'::varchar, 'Suivre le projet'::varchar,
        jsonb_build_object(
          'title', CASE p.username WHEN 'demo_antoine_mercier' THEN 'Des conseils simples, chaque semaine' ELSE 'Mon bilan mensuel, sans filtre' END,
          'description', CASE p.username WHEN 'demo_antoine_mercier' THEN 'Entraînement, récupération et habitudes applicables dès la prochaine séance.' ELSE 'Ce qui a fonctionné, ce qui a été difficile et ce que j’ajuste pour la suite.' END,
          'url', 'https://griit.me/' || p.username,
          'imageUrl', ''
        ), 3),
      ('offer'::varchar, 'Accompagnement'::varchar,
        jsonb_build_object(
          'title', CASE p.username WHEN 'demo_antoine_mercier' THEN 'Bilan forme de 45 minutes' ELSE 'Mon cadre pour rester régulière' END,
          'description', CASE p.username WHEN 'demo_antoine_mercier' THEN 'Un échange concret pour faire le point sur vos contraintes, votre niveau et vos prochaines étapes.' ELSE 'Planifier les repas, marcher au quotidien et protéger trois créneaux de mouvement par semaine.' END,
          'url', 'https://griit.me/' || p.username,
          'ctaLabel', CASE p.username WHEN 'demo_antoine_mercier' THEN 'Découvrir l’approche' ELSE 'Voir mon parcours' END,
          'promoCode', '', 'imageUrl', ''
        ), 4)
  ) AS data(type, title, content, sort_order)
) AS block;

INSERT INTO profile_social_links (profile_id, platform, label, url, sort_order, is_enabled)
SELECT profile_id, 'website',
  CASE username WHEN 'demo_antoine_mercier' THEN 'Coaching & méthode' ELSE 'Journal de progression' END,
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
        CASE p.username WHEN 'demo_antoine_mercier' THEN 'Diplôme BPJEPS Activités de la Forme' ELSE 'Huit semaines de régularité' END,
        CASE p.username WHEN 'demo_antoine_mercier' THEN 'Option haltérophilie-musculation' ELSE '3 séances par semaine' END,
        CASE p.username WHEN 'demo_antoine_mercier' THEN 'certification' ELSE 'milestone' END,
        CASE p.username WHEN 'demo_antoine_mercier' THEN 'CREPS de Bordeaux' ELSE 'Premier cycle complet' END,
        CASE p.username WHEN 'demo_antoine_mercier' THEN 'Une formation qui fonde une pratique exigeante, progressive et adaptée à chaque personne.' ELSE 'Même les semaines chargées, j’ai gardé au moins deux séances et mes marches du midi.' END,
        CASE p.username WHEN 'demo_antoine_mercier' THEN '2018-06-22'::timestamp ELSE '2026-07-28'::timestamp END,
        0
      ),
      (
        CASE p.username WHEN 'demo_antoine_mercier' THEN 'Cap des 300 personnes accompagnées' ELSE 'Premier 5 km sans marcher' END,
        CASE p.username WHEN 'demo_antoine_mercier' THEN '300 bilans individuels' ELSE '38 min 42 s' END,
        'milestone',
        CASE p.username WHEN 'demo_antoine_mercier' THEN 'Coaching individuel et petits groupes' ELSE 'Boucle de l’Erdre' END,
        CASE p.username WHEN 'demo_antoine_mercier' THEN 'Des profils très différents, mais la même priorité : rendre la progression compatible avec la vraie vie.' ELSE 'Je suis partie lentement, j’ai gardé une allure où je pouvais parler et j’ai terminé avec le sourire.' END,
        CASE p.username WHEN 'demo_antoine_mercier' THEN '2026-05-10'::timestamp ELSE '2026-07-19'::timestamp END,
        1
      )
  ) AS data(title, result, kind, event_name, description, achieved_at, sort_order)
) AS item;

INSERT INTO profile_activities (
  profile_id, title, activity_type, occurred_at, metrics, sort_order, is_enabled
)
SELECT profile_id, item.title, item.activity_type, item.occurred_at, item.metrics, item.sort_order, true
FROM created_profiles p
CROSS JOIN LATERAL (
  SELECT * FROM (
    VALUES
      (
        CASE p.username WHEN 'demo_antoine_mercier' THEN 'Circuit force du mardi' ELSE 'Marche active après le travail' END,
        CASE p.username WHEN 'demo_antoine_mercier' THEN 'Coaching petit groupe · force générale' ELSE 'Marche · allure confortable' END,
        now() - interval '2 days',
        CASE p.username WHEN 'demo_antoine_mercier' THEN jsonb_build_object('durée', '52 min', 'participants', '6', 'focus', 'squat, tirage, portés') ELSE jsonb_build_object('distance', '6,2 km', 'durée', '1 h 08', 'pas', '8 740') END,
        0
      ),
      (
        CASE p.username WHEN 'demo_antoine_mercier' THEN 'Mobilité et retour au calme' ELSE 'Renforcement à la maison' END,
        CASE p.username WHEN 'demo_antoine_mercier' THEN 'Mobilité · hanches et épaules' ELSE 'Circuit débutant · sans matériel' END,
        now() - interval '5 days',
        CASE p.username WHEN 'demo_antoine_mercier' THEN jsonb_build_object('durée', '35 min', 'intensité', 'douce', 'focus', 'amplitude et respiration') ELSE jsonb_build_object('durée', '32 min', 'tours', '3', 'ressenti', 'énergisée') END,
        1
      ),
      (
        CASE p.username WHEN 'demo_antoine_mercier' THEN 'Footing facile en bord de Garonne' ELSE 'Footing en alternance course-marche' END,
        CASE p.username WHEN 'demo_antoine_mercier' THEN 'Course · récupération' ELSE 'Course · 4 min / marche · 1 min' END,
        now() - interval '9 days',
        CASE p.username WHEN 'demo_antoine_mercier' THEN jsonb_build_object('distance', '7,8 km', 'durée', '44 min', 'effort', 'facile') ELSE jsonb_build_object('distance', '4,6 km', 'durée', '39 min', 'effort', 'maîtrisé') END,
        2
      )
  ) AS data(title, activity_type, occurred_at, metrics, sort_order)
) AS item;

INSERT INTO profile_gallery_items (
  profile_id, image_url, caption, alt_text, sort_order, is_enabled
)
SELECT profile_id, item.image_url, item.caption, item.alt_text, item.sort_order, true
FROM created_profiles p
CROSS JOIN LATERAL (
  SELECT * FROM (
    VALUES
      (
        CASE p.username WHEN 'demo_antoine_mercier' THEN 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1200&q=82' ELSE 'https://images.unsplash.com/photo-1483721310020-03333e577078?auto=format&fit=crop&w=1200&q=82' END,
        CASE p.username WHEN 'demo_antoine_mercier' THEN 'La qualité du mouvement avant la charge' ELSE 'Sortir même quand la motivation n’est pas parfaite' END,
        CASE p.username WHEN 'demo_antoine_mercier' THEN 'Séance de renforcement encadrée par Antoine' ELSE 'Sarah pendant une marche active en extérieur' END,
        0
      ),
      (
        CASE p.username WHEN 'demo_antoine_mercier' THEN 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=1200&q=82' ELSE 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=82' END,
        CASE p.username WHEN 'demo_antoine_mercier' THEN 'Un plan clair, puis de la constance' ELSE 'Trente minutes suffisent pour entretenir l’élan' END,
        CASE p.username WHEN 'demo_antoine_mercier' THEN 'Matériel préparé pour une séance de coaching' ELSE 'Séance de renforcement accessible à la maison' END,
        1
      ),
      (
        CASE p.username WHEN 'demo_antoine_mercier' THEN 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&q=82' ELSE 'https://images.unsplash.com/photo-1502904550040-7534597429ae?auto=format&fit=crop&w=1200&q=82' END,
        CASE p.username WHEN 'demo_antoine_mercier' THEN 'Progresser ensemble, sans ego' ELSE 'Le premier 5 km : lent, mais entièrement couru' END,
        CASE p.username WHEN 'demo_antoine_mercier' THEN 'Entraînement collectif dans une salle de sport' ELSE 'Fin d’une séance de course en plein air' END,
        2
      )
  ) AS data(image_url, caption, alt_text, sort_order)
) AS item;

COMMIT;

SELECT id, display_name, username, is_published,
  'https://griit.me/' || username AS public_url
FROM public_profiles
WHERE user_id = '06d8aa8e-92aa-4973-a00a-81b977022e2a'
  AND username IN ('demo_antoine_mercier', 'demo_sarah_leclerc')
ORDER BY username;
