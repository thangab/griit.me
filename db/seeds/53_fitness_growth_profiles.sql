-- 18 realistic French-language growth/demo profiles.
--
-- Fictional people, published by direct URL, hidden from the athlete directory
-- and search indexing. Usernames start with `demo_` so product surfaces can
-- label them transparently. Safe to rerun: profiles are upserted and child
-- content is rebuilt.

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

CREATE TEMP TABLE growth_profiles (
  seq integer PRIMARY KEY,
  segment varchar(24) NOT NULL,
  username varchar(32) UNIQUE NOT NULL,
  display_name varchar(120) NOT NULL,
  bio text NOT NULL,
  location varchar(120) NOT NULL,
  primary_sport varchar(80) NOT NULL,
  secondary_sport varchar(80) NOT NULL,
  template_id varchar(24) NOT NULL,
  badge varchar(40) NOT NULL,
  discipline varchar(100) NOT NULL,
  eyebrow varchar(120) NOT NULL,
  goal_title varchar(160) NOT NULL,
  goal_description text NOT NULL,
  target_at timestamp NOT NULL,
  achievement_title varchar(160) NOT NULL,
  achievement_result varchar(120) NOT NULL,
  activity_title varchar(160) NOT NULL,
  activity_type varchar(80) NOT NULL,
  portrait_group varchar(8) NOT NULL,
  portrait_id integer NOT NULL,
  cover_url text NOT NULL
) ON COMMIT DROP;

INSERT INTO growth_profiles VALUES
  (1, 'amateur', 'demo_anais_vidal', 'Anaïs Vidal',
   'Graphiste la semaine, athlète hybride le reste du temps. Je découvre la musculation et la course avec une idée simple : arriver préparée sur la ligne de départ de mon premier HYROX.',
   'Paris, France', 'HYROX', 'Gym & Fitness', 'momentum', 'DÉBUTANTE',
   'Athlète hybride amateur · Paris', 'Première saison, vraie intention',
   'Terminer mon premier HYROX en moins de 1 h 35',
   'Construire une base régulière, apprendre les mouvements et garder assez d’énergie pour courir proprement entre chaque atelier.',
   '2027-03-21', 'Premier 10 km officiel', '58 min 42 s',
   'Course et ateliers en binôme', 'HYROX · technique débutante', 'women', 28,
   'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1600&q=84'),
  (2, 'amateur', 'demo_malik_traore', 'Malik Traoré',
   'Étudiant en kinésithérapie et pratiquant de MMA depuis dix-huit mois. Je documente les séances, les erreurs et la préparation de mon premier combat amateur.',
   'Marseille, France', 'MMA', 'Boxing', 'pulse', 'AMATEUR',
   'Combattant MMA amateur · Marseille', 'Apprendre à rester calme',
   'Disputer mon premier combat amateur de MMA',
   'Améliorer ma défense au sol, gérer l’intensité et arriver dans la cage avec un plan simple que je peux exécuter sous pression.',
   '2027-02-13', 'Premier interclub de grappling', '3 combats · 2 victoires',
   'Rounds MMA à thème', 'MMA · striking vers lutte', 'men', 34,
   'https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=1600&q=84'),
  (3, 'amateur', 'demo_lucas_henry', 'Lucas Henry',
   'Développeur, jeune papa et nouveau coureur. Je pars de trois kilomètres difficiles pour construire une routine qui me permette de courir mon premier semi-marathon sans me blesser.',
   'Lille, France', 'Running', 'Gym & Fitness', 'spotlight', 'PREMIER SEMI',
   'Coureur amateur · Lille', 'De trois kilomètres à vingt et un',
   'Finir mon premier semi-marathon en moins de 2 heures',
   'Courir trois fois par semaine, renforcer les jambes et apprendre à ralentir les jours où le corps demande de la patience.',
   '2027-05-09', 'Premier mois à trois sorties par semaine', '12 séances terminées',
   'Sortie longue progressive', 'Running · endurance fondamentale', 'men', 22,
   'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1600&q=84'),

  (4, 'intermediate', 'demo_nora_kim', 'Nora Kim',
   'Athlète CrossFit depuis quatre ans, à l’aise avec la force mais encore en construction sur la gymnastique. Je partage une saison complète, des journées fortes aux séances où rien ne passe.',
   'Lyon, France', 'CrossFit', 'Weightlifting', 'obsidian', 'INTERMÉDIAIRE',
   'Athlète CrossFit · Lyon', 'Transformer les points faibles',
   'Atteindre le top 10 % au CrossFit Open',
   'Conserver mes qualités de force tout en améliorant les tractions strictes, les toes-to-bar et ma capacité à répéter les efforts sans exploser.',
   '2027-03-08', 'Premier muscle-up strict', '1 répétition propre',
   'Intervals barbell et gymnastique', 'CrossFit · capacité sous fatigue', 'women', 38,
   'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?auto=format&fit=crop&w=1600&q=84'),
  (5, 'intermediate', 'demo_thomas_costa', 'Thomas Costa',
   'Coureur de trail depuis cinq saisons, passionné par les longues montées et les descentes techniques. Mon projet actuel : passer du format marathon à mon premier ultra de montagne.',
   'Annecy, France', 'Trail Running', 'Hiking', 'horizon', '50 KM',
   'Traileur intermédiaire · Annecy', 'Plus loin, toujours lucide',
   'Finir mon premier trail de 50 km en moins de 6 heures',
   'Développer l’endurance en montée, fiabiliser le ravitaillement et garder des jambes disponibles pour les douze derniers kilomètres.',
   '2027-06-19', 'Trail des Glières 32 km', '3 h 48 · 18e catégorie',
   'Sortie montagne avec dénivelé', 'Trail · endurance spécifique', 'men', 47,
   'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=1600&q=84'),
  (6, 'intermediate', 'demo_ilyes_rahmani', 'Ilyes Rahmani',
   'Combattant amateur confirmé avec six combats, un travail à temps plein et aucune envie de brûler les étapes. Je construis un style basé sur la pression, le cardio et des décisions plus propres.',
   'Bruxelles, Belgique', 'MMA', 'Martial Arts', 'impact', '6 COMBATS',
   'Combattant MMA · Bruxelles', 'Mettre de l’ordre dans l’intensité',
   'Remporter un titre régional amateur en poids léger',
   'Mieux choisir mes entrées, défendre les projections contre la cage et maintenir un rythme maîtrisé pendant trois rounds complets.',
   '2027-04-24', 'Tournoi amateur de Bruxelles', 'Finaliste · 2 victoires',
   'Sparring situationnel', 'MMA · cage et sorties', 'men', 52,
   'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=1600&q=84'),

  (7, 'pro', 'demo_elena_rossi', 'Elena Rossi',
   'Combattante professionnelle poids mouche, issue du kickboxing et désormais engagée dans une carrière complète en MMA. Chaque camp est construit autour d’un problème précis à résoudre.',
   'Milan, Italie', 'MMA', 'Boxing', 'pulse', 'PRO · 7–1',
   'Combattante MMA professionnelle · Milan', 'Préparer chaque minute',
   'Entrer dans le top 10 européen des poids mouches',
   'Enchaîner deux victoires internationales en contrôlant mieux les transitions et en imposant mon volume sans offrir d’ouvertures inutiles.',
   '2027-05-15', 'Victoire principale à Milano Fight Night', 'TKO · round 3',
   'Rounds professionnels', 'MMA · 5 × 5 minutes', 'women', 52,
   'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=1600&q=84'),
  (8, 'pro', 'demo_jonas_meyer', 'Jonas Meyer',
   'Athlète HYROX Elite 15 et ancien rameur national. J’aime les chiffres, les séances reproductibles et les courses où une bonne stratégie vaut autant qu’un gros moteur.',
   'Berlin, Allemagne', 'HYROX', 'Running', 'obsidian', 'ELITE 15',
   'Athlète HYROX professionnel · Berlin', 'Aucun atelier faible',
   'Passer sous les 56 minutes en HYROX Pro',
   'Gagner du temps sur les sleds et les wall balls sans compromettre les huit kilomètres de course ni la précision dans les transitions.',
   '2027-02-27', 'HYROX Pro Hamburg', '57 min 18 · 6e',
   'Simulation race pace', 'HYROX Pro · 6 blocs', 'men', 57,
   'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1600&q=84'),
  (9, 'pro', 'demo_maya_johnson', 'Maya Johnson',
   'Marathonienne professionnelle et ancienne spécialiste du 10 000 m. Je partage la réalité d’une préparation de haut niveau : volume, récupération, doutes et décisions prises loin de la ligne de départ.',
   'London, United Kingdom', 'Running', 'Athletics', 'midnight', '2:31',
   'Marathonienne professionnelle · London', 'Construire la course patiemment',
   'Courir un marathon en moins de 2 h 30',
   'Améliorer l’économie de course, absorber un bloc de dix semaines régulier et arriver au kilomètre trente avec encore des décisions à prendre.',
   '2027-04-18', 'Marathon de Valencia', '2 h 31 min 46 · PB',
   'Tempo marathon progressif', 'Running · allure spécifique', 'women', 61,
   'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=1600&q=84'),

  (10, 'weight_loss', 'demo_manon_lefevre', 'Manon Lefèvre',
   'Infirmière de nuit et maman, je veux perdre du poids sans reprendre le cycle des régimes stricts. Mon parcours repose sur des repas simples, la marche et deux séances de renforcement réalistes.',
   'Rennes, France', 'Gym & Fitness', 'Running', 'evergreen', 'MON PARCOURS',
   'Remise en forme · Rennes', 'Faire de la place pour moi',
   'Perdre 15 kg durablement et retrouver mon souffle',
   'Avancer avec un suivi médical, protéger mon sommeil après les gardes et construire des habitudes possibles même pendant les semaines compliquées.',
   '2027-06-30', 'Cent jours de marche régulière', '742 000 pas cumulés',
   'Renforcement complet débutant', 'Gym · machines et haltères', 'women', 46,
   'https://images.unsplash.com/photo-1483721310020-03333e577078?auto=format&fit=crop&w=1600&q=84'),
  (11, 'weight_loss', 'demo_karim_aitali', 'Karim Aït-Ali',
   'Responsable commercial, souvent assis et longtemps convaincu que le sport devait faire mal pour fonctionner. Je reprends avec un cadre progressif, des objectifs mensuels et beaucoup moins de culpabilité.',
   'Montpellier, France', 'Gym & Fitness', 'HYROX', 'momentum', 'RESTART',
   'Transformation durable · Montpellier', 'Reprendre sans me punir',
   'Perdre 20 kg et terminer un HYROX en doubles',
   'Améliorer ma santé avec mon médecin, retrouver une semaine active et préparer un événement qui donne un sens concret à chaque entraînement.',
   '2027-09-11', 'Premiers 5 kg perdus', '12 semaines régulières',
   'Circuit cardio à faible impact', 'Gym · rameur, carry, sled', 'men', 39,
   'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1600&q=84'),
  (12, 'weight_loss', 'demo_sophie_nguyen', 'Sophie Nguyen',
   'Comptable et ancienne danseuse, je reconstruis une relation plus sereine avec mon corps après plusieurs années sans activité. Je mesure surtout l’énergie, la force et la régularité.',
   'Genève, Suisse', 'Running', 'Gym & Fitness', 'horizon', 'CONSISTANCE',
   'Retour au sport · Genève', 'Chercher l’élan, pas la perfection',
   'Perdre 10 kg progressivement et courir mon premier 10 km',
   'Alterner course et marche, apprendre les bases de la force et faire des choix alimentaires stables sans interdire les repas partagés.',
   '2027-05-23', 'Premier 5 km sans marcher', '36 min 12 s',
   'Course-marche au bord du lac', 'Running · progression 5/1', 'women', 31,
   'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=1600&q=84'),

  (13, 'coach', 'demo_camille_roy', 'Camille Roy',
   'Coach sportive spécialisée dans la force au féminin et l’accompagnement après une longue pause. Mon rôle : rendre la salle lisible, accueillante et utile au quotidien.',
   'Bordeaux, France', 'Gym & Fitness', 'Powerlifting', 'evergreen', 'COACH',
   'Coach force & fitness · Bordeaux', 'La confiance vient avec les répétitions',
   'Accompagner 120 femmes vers une pratique autonome',
   'Créer des programmes accessibles, apprendre les mouvements fondamentaux et donner à chaque cliente les outils pour progresser sans dépendre du coach.',
   '2027-07-31', 'Certification force et conditionnement', 'Niveau avancé obtenu',
   'Petit groupe force fondamentale', 'Coaching · squat, press, carry', 'women', 41,
   'https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=1600&q=84'),
  (14, 'coach', 'demo_dylan_brooks', 'Dylan Brooks',
   'Coach hybride entre course et musculation, ancien joueur de rugby. J’aide les actifs pressés à devenir plus endurants et plus forts avec quatre séances bien choisies plutôt que sept séances improvisées.',
   'Manchester, United Kingdom', 'HYROX', 'Running', 'impact', 'HYBRID COACH',
   'Coach performance hybride · Manchester', 'Strength that can keep moving',
   'Préparer 50 athlètes à leur premier HYROX',
   'Construire une méthode claire pour les débutants : course contrôlée, technique sur les ateliers et progression suffisamment lente pour rester en bonne santé.',
   '2027-04-30', 'Cinquante athlètes accompagnés', '92 % finishers',
   'Compromised running session', 'Coaching HYROX · run and sled', 'men', 63,
   'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=1600&q=84'),
  (15, 'coach', 'demo_nadia_benali', 'Nadia Benali',
   'Préparatrice physique pour les sports de combat et pratiquante de jiu-jitsu brésilien. Je transforme les besoins du combat en séances simples, mesurables et compatibles avec le travail technique.',
   'Paris, France', 'MMA', 'Gym & Fitness', 'pulse', 'S&C COACH',
   'Préparatrice physique MMA · Paris', 'Préparer le corps au chaos',
   'Accompagner dix combattants vers leur saison sans blessure évitable',
   'Individualiser les charges, mieux suivre la fatigue et construire une puissance utile qui reste disponible jusqu’à la dernière reprise.',
   '2027-06-12', 'Diplôme de préparation physique', 'Spécialisation sports de combat',
   'Puissance et changements de niveau', 'Coaching MMA · force-vitesse', 'women', 56,
   'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1600&q=84'),

  (16, 'mass_gain', 'demo_theo_garnier', 'Théo Garnier',
   'Étudiant avec un petit appétit et plusieurs années à s’entraîner sans plan. Je veux construire du muscle naturellement, apprendre à manger suffisamment et suivre autre chose que le chiffre sur la balance.',
   'Toulouse, France', 'Gym & Fitness', 'Weightlifting', 'obsidian', '+8 KG',
   'Prise de masse naturelle · Toulouse', 'Construire sans précipiter',
   'Prendre 8 kg en douze mois en restant athlétique',
   'Progresser sur les mouvements de base, augmenter les apports progressivement et protéger le sommeil pour que le poids gagné corresponde à un vrai changement physique.',
   '2027-08-01', 'Premier développé couché à 100 kg', '1 répétition validée',
   'Haut du corps hypertrophie', 'Gym · push et tirages', 'men', 25,
   'https://images.unsplash.com/photo-1581009137042-c552e485697a?auto=format&fit=crop&w=1600&q=84'),
  (17, 'mass_gain', 'demo_lea_dumont', 'Léa Dumont',
   'Végétarienne, sportive loisir et nouvelle pratiquante de powerlifting. Mon objectif n’est pas de devenir plus petite, mais de construire des jambes fortes, un dos solide et plus de confiance sous la barre.',
   'Nantes, France', 'Powerlifting', 'Gym & Fitness', 'momentum', 'BUILD',
   'Transformation force · Nantes', 'Prendre de la place avec confiance',
   'Gagner 5 kg de masse et totaliser 300 kg en compétition',
   'Manger assez régulièrement, gagner de la technique sur les trois mouvements et accepter une progression visible qui ne se résume pas à être plus mince.',
   '2027-07-10', 'Premier deadlift à deux fois le poids du corps', '132,5 kg',
   'Squat volume et accessoires', 'Powerlifting · bas du corps', 'women', 33,
   'https://images.unsplash.com/photo-1590487988256-9ed24133863e?auto=format&fit=crop&w=1600&q=84'),
  (18, 'mass_gain', 'demo_adam_park', 'Adam Park',
   'Jeune ingénieur, ancien coureur très léger et débutant sérieux en musculation. Je cherche une transformation équilibrée : plus de muscle, toujours assez de cardio et aucune envie de vivre dans la salle.',
   'Montréal, Canada', 'Gym & Fitness', 'CrossFit', 'midnight', 'LEAN GAIN',
   'Transformation athlétique · Montréal', 'Plus fort sans perdre le moteur',
   'Construire 6 kg de masse musculaire et garder un 5 km sous 22 minutes',
   'Suivre quatre séances de force, garder deux sorties faciles et ajuster les calories avec patience plutôt que forcer une prise de poids rapide.',
   '2027-09-05', 'Premier cycle complet de douze semaines', '+3 kg · 48 séances',
   'Full body force et conditioning', 'Gym · force athlétique', 'men', 29,
   'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?auto=format&fit=crop&w=1600&q=84');

WITH styled AS (
  SELECT source.*,
    CASE segment
      WHEN 'pro' THEN '#090B10'
      WHEN 'coach' THEN '#102A22'
      WHEN 'weight_loss' THEN '#F4F0E8'
      WHEN 'mass_gain' THEN '#10131A'
      ELSE '#F4F6F3'
    END AS background,
    CASE segment
      WHEN 'pro' THEN '#171A22'
      WHEN 'coach' THEN '#183B31'
      WHEN 'weight_loss' THEN '#FFFDF8'
      WHEN 'mass_gain' THEN '#1C2230'
      ELSE '#FFFFFF'
    END AS surface,
    CASE WHEN segment IN ('pro', 'coach', 'mass_gain') THEN '#F8FAF8' ELSE '#17221D' END AS foreground,
    CASE segment
      WHEN 'pro' THEN '#FF5A36'
      WHEN 'coach' THEN '#6EE7B7'
      WHEN 'weight_loss' THEN '#F08A65'
      WHEN 'mass_gain' THEN '#A3E635'
      WHEN 'intermediate' THEN '#3157FF'
      ELSE '#FF7A45'
    END AS accent,
    CASE segment
      WHEN 'pro' THEN '#090B10'
      WHEN 'coach' THEN '#102A22'
      WHEN 'weight_loss' THEN '#23483D'
      WHEN 'mass_gain' THEN '#10131A'
      ELSE '#172B24'
    END AS header_background,
    CASE segment
      WHEN 'intermediate' THEN '#FFFFFF'
      WHEN 'coach' THEN '#102018'
      WHEN 'mass_gain' THEN '#102018'
      ELSE '#25110B'
    END AS accent_text
  FROM growth_profiles source
)
INSERT INTO public_profiles (
  user_id, username, display_name, bio, location, avatar_url, cover_url, theme,
  is_published, show_branding, is_discoverable, allow_indexing,
  seo_title, seo_description, updated_at
)
SELECT
  '06d8aa8e-92aa-4973-a00a-81b977022e2a', username, display_name, bio, location,
  format('https://randomuser.me/api/portraits/%s/%s.jpg', portrait_group, portrait_id),
  cover_url,
  jsonb_build_object(
    'templateId', template_id, 'colorPreset', 'custom',
    'customColors', jsonb_build_object(
      'background', background, 'surface', surface, 'foreground', foreground,
      'accent', accent, 'social', surface, 'headerText', '#FFFFFF',
      'headerMutedText', '#E4E9E6', 'blockTitle', foreground,
      'description', CASE WHEN segment IN ('pro','coach','mass_gain') THEN '#B4BDB8' ELSE '#68736E' END,
      'accentText', accent_text,
      'socialText', foreground
    ),
    'fontPreset', (ARRAY['athletic','editorial','technical','clean'])[((seq - 1) % 4) + 1],
    'radiusPreset', (ARRAY['soft','rounded','sharp'])[((seq - 1) % 3) + 1],
    'galleryLayout', (ARRAY['editorial','carousel','grid'])[((seq - 1) % 3) + 1],
    'coverType', 'image', 'coverOverlayColor', header_background,
    'coverOverlayOpacity', 52 + ((seq * 5) % 22),
    'headerLayout', (ARRAY['centered','split','immersive','left','kinetic'])[((seq - 1) % 5) + 1],
    'headerAvatarSize', 88 + ((seq * 7) % 24), 'headerAvatarShape', 'circle',
    'headerSheetColor', header_background, 'headerSheetCoverage', (ARRAY[35,60,100])[((seq - 1) % 3) + 1],
    'headerGeometry', (ARRAY['rings','velocity','blocks','chevrons'])[((seq - 1) % 4) + 1],
    'headerTexture', (ARRAY['dots','grid','diagonal','scanlines'])[((seq - 1) % 4) + 1],
    'blockCorner', 30 + ((seq * 9) % 55), 'blockBorder', 18 + ((seq * 5) % 34),
    'blockBorderColor', accent, 'blockShadow', 20 + ((seq * 7) % 40),
    'blockShadowStyle', CASE WHEN seq % 2 = 0 THEN 'soft' ELSE 'solid' END,
    'blockSpacing', 28 + ((seq * 4) % 28),
    'templateWordingOverrides', jsonb_build_object(
      'discipline', discipline, 'badge', badge, 'eyebrow', eyebrow,
      'profileLabel', CASE segment WHEN 'coach' THEN 'Ma méthode' WHEN 'weight_loss' THEN 'Pourquoi je commence' WHEN 'mass_gain' THEN 'Le projet' ELSE 'Mon parcours' END,
      'targetLabel', CASE segment WHEN 'coach' THEN 'Mission actuelle' ELSE 'Objectif principal' END,
      'galleryLabel', 'Le quotidien en mouvement',
      'achievementsLabel', CASE segment WHEN 'pro' THEN 'Résultats' ELSE 'Étapes franchies' END,
      'activityLabel', 'Dernières séances', 'secondaryGoalLabel', 'La prochaine étape'
    )
  ),
  true, false, false, false,
  left(display_name || ' — Profil démo GRIIT', 70),
  left('Profil fictif GRIIT autour de ' || primary_sport || ' et d’un objectif sportif concret.', 160),
  now()
FROM styled
ON CONFLICT (username) DO UPDATE SET
  user_id = EXCLUDED.user_id, display_name = EXCLUDED.display_name,
  bio = EXCLUDED.bio, location = EXCLUDED.location,
  avatar_url = EXCLUDED.avatar_url, cover_url = EXCLUDED.cover_url,
  theme = EXCLUDED.theme, is_published = true, show_branding = false,
  is_discoverable = false, allow_indexing = false,
  seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description,
  updated_at = now();

CREATE TEMP TABLE created_profiles ON COMMIT DROP AS
SELECT source.*, profile.id AS profile_id
FROM growth_profiles source
JOIN public_profiles profile ON profile.username = source.username
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
SELECT profile.profile_id, sport.id, 0, true
FROM created_profiles profile
JOIN sports sport
  ON sport.name = profile.primary_sport
  AND sport.is_custom = false
  AND sport.is_enabled = true;

INSERT INTO profile_sports (profile_id, sport_id, sort_order, is_enabled)
SELECT profile.profile_id, sport.id, 1, true
FROM created_profiles profile
JOIN sports sport
  ON sport.name = profile.secondary_sport
  AND sport.is_custom = false
  AND sport.is_enabled = true;

INSERT INTO profile_goals (
  profile_id, title, description, url, target_at, date_display,
  status, sort_order, is_enabled
)
SELECT profile_id, goal_title, goal_description,
  'https://griit.me/' || username, target_at, 'countdown', 'active', 0, true
FROM created_profiles;

INSERT INTO profile_goals (
  profile_id, title, description, target_at, date_display,
  status, sort_order, is_enabled
)
SELECT profile_id,
  CASE segment
    WHEN 'amateur' THEN 'Tenir une routine de trois séances pendant six mois'
    WHEN 'intermediate' THEN 'Transformer mon principal point faible'
    WHEN 'pro' THEN 'Partager les coulisses de toute une saison'
    WHEN 'weight_loss' THEN 'Construire une semaine active sans régime extrême'
    WHEN 'coach' THEN 'Organiser une séance collective ouverte à tous'
    ELSE 'Garder une condition physique complète pendant la transformation'
  END,
  CASE segment
    WHEN 'amateur' THEN 'Faire de la régularité une compétence avant de chercher davantage de volume ou d’intensité.'
    WHEN 'intermediate' THEN 'Consacrer un cycle complet à la qualité qui limite aujourd’hui ma progression en compétition.'
    WHEN 'pro' THEN 'Montrer la préparation, les ajustements et la récupération avec la même honnêteté que les résultats.'
    WHEN 'weight_loss' THEN 'Marcher davantage, renforcer tout le corps et garder une alimentation compatible avec une vie sociale normale.'
    WHEN 'coach' THEN 'Créer un rendez-vous accueillant qui aide de nouvelles personnes à découvrir une pratique adaptée.'
    ELSE 'Construire du muscle tout en conservant de la mobilité, du cardio et une bonne relation avec l’entraînement.'
  END,
  target_at + interval '120 days', 'date', 'planned', 1, true
FROM created_profiles;

INSERT INTO profile_blocks (profile_id, type, title, content, sort_order, is_enabled)
SELECT profile.profile_id, block.type, block.title, block.content, block.sort_order, true
FROM created_profiles profile
CROSS JOIN LATERAL (
  VALUES
    ('achievements'::varchar, 'Étapes franchies'::varchar, jsonb_build_object('builderManaged', true), 0),
    ('activities'::varchar, 'Dernières séances'::varchar, jsonb_build_object('builderManaged', true), 1),
    ('gallery'::varchar, 'En mouvement'::varchar, jsonb_build_object('builderManaged', true), 2),
    ('link'::varchar, 'Suivre le parcours'::varchar, jsonb_build_object(
      'builderManaged', true,
      'title', CASE profile.segment WHEN 'coach' THEN 'Conseils et méthode de coaching' ELSE 'Le journal complet de la progression' END,
      'description', CASE profile.segment WHEN 'coach' THEN 'Des repères simples sur l’entraînement, la récupération et la construction d’habitudes durables.' ELSE 'Les séances réussies, les semaines difficiles et les ajustements derrière chaque étape.' END,
      'url', 'https://griit.me/' || profile.username, 'imageUrl', ''
    ), 3),
    ('offer'::varchar, 'Passer à l’action'::varchar, jsonb_build_object(
      'builderManaged', true,
      'title', CASE profile.segment
        WHEN 'coach' THEN 'Découvrir mon approche'
        WHEN 'weight_loss' THEN 'La routine qui m’aide à rester régulière'
        WHEN 'mass_gain' THEN 'Mon plan de transformation sur douze mois'
        ELSE 'Voir le plan derrière l’objectif'
      END,
      'description', CASE profile.segment
        WHEN 'coach' THEN 'Un accompagnement progressif construit autour du niveau, des contraintes et de la vraie vie.'
        WHEN 'weight_loss' THEN 'Des repas simples, plus de marche et des séances accessibles sans recherche de perfection.'
        WHEN 'mass_gain' THEN 'Une progression mesurée sur les charges, les apports, le sommeil et les performances.'
        ELSE 'Les priorités de la semaine, les séances clés et les décisions qui permettent de progresser.'
      END,
      'url', 'https://griit.me/' || profile.username,
      'ctaLabel', CASE profile.segment WHEN 'coach' THEN 'Découvrir le coaching' ELSE 'Voir le parcours' END,
      'promoCode', '', 'imageUrl', '', 'displaySize', 'medium', 'isAffiliate', false
    ), 4)
) AS block(type, title, content, sort_order);

INSERT INTO profile_social_links (profile_id, platform, label, url, sort_order, is_enabled)
SELECT profile_id, 'website',
  CASE segment WHEN 'coach' THEN 'Coaching et ressources' ELSE 'Journal de progression' END,
  'https://griit.me/' || username, 0, true
FROM created_profiles;

INSERT INTO profile_achievements (
  profile_id, title, result, achievement_type, event_name, description,
  achieved_at, sort_order, is_enabled
)
SELECT profile_id, achievement_title, achievement_result,
  CASE segment
    WHEN 'pro' THEN 'podium' WHEN 'coach' THEN 'certification'
    WHEN 'weight_loss' THEN 'milestone' WHEN 'mass_gain' THEN 'personal_best'
    ELSE 'milestone'
  END,
  CASE segment
    WHEN 'coach' THEN 'Formation et expérience professionnelle'
    WHEN 'weight_loss' THEN 'Parcours personnel'
    WHEN 'mass_gain' THEN 'Cycle de progression'
    ELSE primary_sport || ' · saison 2026'
  END,
  CASE segment
    WHEN 'pro' THEN 'Un résultat construit par un cycle complet, une stratégie claire et une exécution maîtrisée le jour de la compétition.'
    WHEN 'coach' THEN 'Une étape professionnelle qui renforce une pratique fondée sur la sécurité, l’écoute et la progression individuelle.'
    WHEN 'weight_loss' THEN 'Une petite victoire concrète qui compte davantage qu’une semaine parfaite ou un changement rapide sur la balance.'
    WHEN 'mass_gain' THEN 'Un repère de force qui confirme que la progression physique repose sur bien plus que le poids corporel.'
    ELSE 'Une étape importante obtenue grâce à plusieurs mois de travail régulier et d’ajustements patients.'
  END,
  now() - interval '70 days', 0, true
FROM created_profiles;

INSERT INTO profile_achievements (
  profile_id, title, result, achievement_type, event_name, description,
  achieved_at, sort_order, is_enabled
)
SELECT profile_id,
  CASE segment
    WHEN 'amateur' THEN 'Huit semaines sans abandonner'
    WHEN 'intermediate' THEN 'Nouveau record de régularité'
    WHEN 'pro' THEN 'Saison internationale complète'
    WHEN 'weight_loss' THEN 'Premier mois sans logique tout ou rien'
    WHEN 'coach' THEN 'Cent personnes accompagnées'
    ELSE 'Premier trimestre en surplus maîtrisé'
  END,
  CASE segment
    WHEN 'amateur' THEN '24 séances'
    WHEN 'intermediate' THEN '48 séances · 12 semaines'
    WHEN 'pro' THEN '8 compétitions'
    WHEN 'weight_loss' THEN '4 semaines cohérentes'
    WHEN 'coach' THEN '100 bilans individuels'
    ELSE '+2 kg · performances en hausse'
  END,
  'milestone', 'Progression personnelle',
  'Un jalon simple et honnête qui montre la valeur du travail accumulé entre les grands objectifs.',
  now() - interval '150 days', 1, true
FROM created_profiles;

INSERT INTO profile_activities (
  profile_id, title, activity_type, occurred_at, metrics, sort_order, is_enabled
)
SELECT profile_id, activity_title, activity_type, now() - interval '2 days',
  jsonb_build_object(
    'durée', CASE segment WHEN 'pro' THEN '92 min' WHEN 'amateur' THEN '54 min' ELSE '68 min' END,
    'ressenti', CASE seq % 3 WHEN 0 THEN 'maîtrisé' WHEN 1 THEN 'productif' ELSE 'exigeant mais propre' END,
    'focus', primary_sport
  ), 0, true
FROM created_profiles;

INSERT INTO profile_activities (
  profile_id, title, activity_type, occurred_at, metrics, sort_order, is_enabled
)
SELECT profile_id,
  CASE segment
    WHEN 'weight_loss' THEN 'Marche active après le travail'
    WHEN 'coach' THEN 'Séance individuelle technique'
    WHEN 'mass_gain' THEN 'Bas du corps et progression de charge'
    WHEN 'pro' THEN 'Séance spécifique compétition'
    ELSE 'Force générale et mobilité'
  END,
  CASE segment
    WHEN 'weight_loss' THEN 'Marche · allure confortable'
    WHEN 'coach' THEN 'Coaching · corrections et progression'
    WHEN 'mass_gain' THEN 'Gym · hypertrophie contrôlée'
    WHEN 'pro' THEN primary_sport || ' · haute qualité'
    ELSE 'Gym & Fitness · fondamentaux'
  END,
  now() - interval '6 days',
  jsonb_build_object('durée', '48 min', 'intensité', 'modérée', 'qualité', 'régulière'),
  1, true
FROM created_profiles;

INSERT INTO profile_activities (
  profile_id, title, activity_type, occurred_at, metrics, sort_order, is_enabled
)
SELECT profile_id,
  CASE WHEN primary_sport IN ('Running','Trail Running','HYROX') THEN 'Sortie facile en endurance' ELSE 'Récupération active et mobilité' END,
  CASE WHEN primary_sport IN ('Running','Trail Running','HYROX') THEN 'Running · effort conversationnel' ELSE 'Mobilité · respiration et amplitude' END,
  now() - interval '10 days',
  CASE WHEN primary_sport IN ('Running','Trail Running','HYROX')
    THEN jsonb_build_object('distance', CASE segment WHEN 'pro' THEN '14,2 km' ELSE '7,4 km' END, 'effort', 'facile')
    ELSE jsonb_build_object('durée', '36 min', 'effort', 'très facile')
  END,
  2, true
FROM created_profiles;

INSERT INTO profile_gallery_items (
  profile_id, image_url, caption, alt_text, sort_order, is_enabled
)
SELECT profile.profile_id, gallery.image_url, gallery.caption,
  profile.display_name || ' — ' || gallery.alt_suffix, gallery.sort_order, true
FROM created_profiles profile
CROSS JOIN LATERAL (
  VALUES
    (profile.cover_url, 'Le travail réel derrière l’objectif', 'séance principale du parcours', 0),
    (
      CASE WHEN profile.primary_sport IN ('Running','Trail Running','HYROX')
        THEN 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1200&q=82'
        WHEN profile.primary_sport = 'MMA'
        THEN 'https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=1200&q=82'
        ELSE 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=82'
      END,
      'Une séance utile, pas forcément spectaculaire', 'entraînement en progression', 1
    ),
    (
      CASE WHEN profile.primary_sport IN ('Running','Trail Running','HYROX')
        THEN 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=1200&q=82'
        ELSE 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&q=82'
      END,
      'Construire la confiance répétition après répétition', 'moment de constance sportive', 2
    )
) AS gallery(image_url, caption, alt_suffix, sort_order);

COMMIT;

SELECT id, display_name, username, is_published,
  'https://griit.me/' || username AS public_url
FROM public_profiles
WHERE user_id = '06d8aa8e-92aa-4973-a00a-81b977022e2a'
  AND username = ANY(ARRAY[
    'demo_anais_vidal', 'demo_malik_traore', 'demo_lucas_henry',
    'demo_nora_kim', 'demo_thomas_costa', 'demo_ilyes_rahmani',
    'demo_elena_rossi', 'demo_jonas_meyer', 'demo_maya_johnson',
    'demo_manon_lefevre', 'demo_karim_aitali', 'demo_sophie_nguyen',
    'demo_camille_roy', 'demo_dylan_brooks', 'demo_nadia_benali',
    'demo_theo_garnier', 'demo_lea_dumont', 'demo_adam_park'
  ])
ORDER BY id;
