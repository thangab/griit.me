-- GRIIT demo athlete profiles
--
-- These records are fictional product demos. They are intentionally excluded
-- from the public Athletes directory and from search-engine indexing. Use them
-- for screenshots, QA, and product demonstrations — never as customer proof.
--
-- Safe to run more than once: profiles are upserted by their `demo_` username
-- and all related demo content is rebuilt on every run.

BEGIN;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM profiles
    WHERE id = '06d8aa8e-92aa-4973-a00a-81b977022e2a'
  ) THEN
    RAISE EXCEPTION 'Owner profile 06d8aa8e-92aa-4973-a00a-81b977022e2a does not exist';
  END IF;
END $$;

CREATE TEMP TABLE demo_athletes (
  seq integer PRIMARY KEY,
  username varchar(32) NOT NULL,
  display_name varchar(120) NOT NULL,
  bio text NOT NULL,
  location varchar(120) NOT NULL,
  primary_sport varchar(80) NOT NULL,
  secondary_sport varchar(80),
  template_id varchar(24) NOT NULL,
  badge varchar(40) NOT NULL,
  discipline varchar(100) NOT NULL,
  eyebrow varchar(100) NOT NULL,
  goal_title varchar(160) NOT NULL,
  goal_description text NOT NULL,
  target_at timestamp NOT NULL,
  achievement_title varchar(160) NOT NULL,
  achievement_result varchar(120) NOT NULL,
  activity_title varchar(160) NOT NULL,
  activity_type varchar(80) NOT NULL,
  portrait_group varchar(8) NOT NULL,
  portrait_id integer NOT NULL
) ON COMMIT DROP;

INSERT INTO demo_athletes VALUES
  (1, 'demo_maya_okafor', 'Maya Okafor', 'Marathon runner balancing structured mileage, strength work, and a demanding career. Sharing the honest build toward her first major-city podium.', 'London, United Kingdom', 'Running', 'Trail Running', 'spotlight', 'SUB 3', 'Marathon runner · London', 'Road to Amsterdam', 'Break 3 hours at Amsterdam', 'A focused 18-week build based on consistency, patient pacing, and recovery that actually fits real life.', '2026-10-18', 'London Half Marathon breakthrough', '1:24:38', 'Sunday progression long run', '26 km · 4:42/km · steady finish', 'women', 12),
  (2, 'demo_theo_martin', 'Théo Martin', 'Academy midfielder developing the scanning, tempo, and final-ball quality needed to earn a first professional contract.', 'Lyon, France', 'Football', NULL, 'momentum', 'NO. 8', 'Central midfielder · Lyon', 'Play between the lines', 'Earn a first professional contract', 'Improve decision-making under pressure and become a reliable creator across a full senior season.', '2027-05-24', 'Academy player of the month', '4 goals · 7 assists', 'Small-sided technical session', '75 min · first touch and transitions', 'men', 22),
  (3, 'demo_sofia_mendes', 'Sofia Mendes', 'Amateur road racer from Lisbon chasing longer climbs and faster finishes, usually training somewhere between the coast and the mountains.', 'Lisbon, Portugal', 'Cycling', NULL, 'impact', 'CLIMB', 'Road cyclist · Lisbon', 'Chasing elevation', 'Qualify for the Gran Fondo Worlds', 'Build the climbing power and race craft needed to earn a place on the international start line.', '2027-08-29', 'Serra da Estrela Gran Fondo', '2nd age group', 'Threshold climbing repeats', '4 × 12 min · 286 W normalized', 'women', 32),
  (4, 'demo_malik_carter', 'Malik Carter', 'Welterweight boxer from South London. Sharp fundamentals, disciplined camps, and one clear intention every time the bell rings.', 'London, United Kingdom', 'Boxing', NULL, 'pulse', 'FIGHT CAMP', 'Welterweight boxer · London', 'Built round by round', 'Win the national welterweight title', 'Eight hard rounds at a time. Arrive composed, prepared, and impossible to move off the center line.', '2026-11-14', 'Southern Area title eliminator', 'Win · unanimous decision', 'Technical sparring', '8 rounds · controlled pressure', 'men', 41),
  (5, 'demo_hana_kim', 'Hana Kim', 'Competitive surfer shaped by early mornings, changing conditions, and a lifelong respect for the ocean.', 'Busan, South Korea', 'Surfing', NULL, 'horizon', 'NEXT WAVE', 'Competitive surfer · Busan', 'Chasing clean lines', 'Qualify for the Challenger Series', 'Trust the preparation, commit to every turn, and compete with the same freedom found in an empty lineup.', '2027-01-22', 'Korea Open', '1st place · 15.84 heat total', 'Sunrise reef session', '92 min · 18 waves · shoulder high', 'women', 44),
  (6, 'demo_luca_bianchi', 'Luca Bianchi', 'Long-course triathlete learning to make three disciplines feel like one, powered by consistency, espresso, and very early alarms.', 'Nice, France', 'Triathlon', 'Cycling', 'midnight', 'KONA', 'Long-course triathlete · Nice', 'Three sports, one race', 'Qualify for the Ironman World Championship', 'Swim relaxed, ride smart, and still have a race left when the marathon begins.', '2027-06-27', 'Ironman 70.3 Nice', '4:18:09 · 6th age group', 'Race-pace brick', '90 km bike + 12 km run', 'men', 18),
  (7, 'demo_amara_nwosu', 'Amara Nwosu', 'Creative midfielder playing with courage, awareness, and joy. Documenting the work behind match day and the people who make it possible.', 'Lagos, Nigeria', 'Football', NULL, 'pulse', 'NO. 10', 'Midfielder · Lagos', 'Play forward', 'Earn a senior national-team cap', 'Influence every match, keep improving the final pass, and be ready when the call arrives.', '2027-03-27', 'Cup final performance', '1 goal · 2 assists', 'Recovery and ball mastery', '55 min · low intensity', 'women', 55),
  (8, 'demo_noah_williams', 'Noah Williams', 'Boulderer and route setter exploring movement, problem solving, and a better relationship with failure—one attempt at a time.', 'Vancouver, Canada', 'Climbing', NULL, 'midnight', 'V10', 'Climber · Vancouver', 'Movement over force', 'Send a first outdoor V10', 'Better tension, cleaner footwork, and enough patience to keep learning from every fall.', '2026-09-25', 'Squamish project', 'V9 · 7 sessions', 'Limit bouldering', '6 problems · 90 min · high quality', 'men', 57),
  (9, 'demo_ines_laurent', 'Inès Laurent', 'Tennis player competing across Europe with an aggressive baseline game and a quiet belief in the long process.', 'Lyon, France', 'Tennis', NULL, 'spotlight', 'TOP 300', 'Tennis player · Lyon', 'Point by point', 'Break into the WTA top 300', 'Own the first ball, compete point by point, and let a full season of good decisions add up.', '2027-02-18', 'ITF W35 semifinal', '6–4 · 3–6 · 7–5', 'Serve plus one', '84 min · 71% first serves', 'women', 65),
  (10, 'demo_zara_khan', 'Zara Khan', 'Mixed martial artist with a pressure-first style and a technical mind, building a professional career without skipping the fundamentals.', 'Dubai, United Arab Emirates', 'MMA', 'Martial Arts', 'obsidian', 'PRO DEBUT', 'Mixed martial artist · Dubai', 'Fight forward', 'Win a professional MMA debut', 'Stay dangerous everywhere, manage every exchange, and enjoy the moment the cage door closes.', '2026-10-14', 'National amateur championship', 'Champion · 3 wins in 3 days', 'MMA rounds', '5 × 5 min · wall work focus', 'women', 68),
  (11, 'demo_diego_santos', 'Diego Santos', 'Point guard focused on pace, leadership, and making everyone around him better. Film study in the morning, extra shots at night.', 'Madrid, Spain', 'Basketball', NULL, 'evergreen', 'PG', 'Point guard · Madrid', 'Read the floor', 'Lead the team to the playoff final', 'Control the tempo, defend every possession, and make the right read when the game gets tight.', '2027-04-11', 'Season-high performance', '24 points · 11 assists', 'Shooting and pick-and-roll', '250 makes · 45 min film', 'men', 7),
  (12, 'demo_lea_martin', 'Léa Martin', 'Open-water swimmer learning to stay calm in cold water and strong over long distance, training between Marseille and the Mediterranean.', 'Marseille, France', 'Swimming', NULL, 'obsidian', 'CHANNEL', 'Open-water swimmer · Marseille', 'Beyond the shoreline', 'Complete an English Channel crossing', 'Cold-water adaptation, efficient pacing, and a crew trusted from the first stroke to the last.', '2027-09-06', 'Calanques 10K swim', '2:41:16 · 1st age group', 'Cold-water endurance swim', '8.2 km · 16°C water', 'women', 21),
  (13, 'demo_eli_thompson', 'Eli Thompson', 'Hybrid athlete balancing engine, strength, and a busy life outside the gym. Documenting the road to a sub-60 HYROX.', 'Melbourne, Australia', 'HYROX', 'CrossFit', 'momentum', 'SUB 60', 'Hybrid athlete · Melbourne', 'Engine meets strength', 'Finish HYROX Pro in under 60 minutes', 'Raise the aerobic floor, keep the sled honest, and race every station with intention.', '2026-11-22', 'HYROX Melbourne', '1:03:42 · personal best', 'Compromised running', '6 × 1 km + stations', 'men', 29),
  (14, 'demo_camille_dubois', 'Camille Dubois', 'Trail runner drawn to technical ridgelines, long days outside, and the patient work required to move well in the mountains.', 'Annecy, France', 'Trail Running', 'Hiking', 'horizon', '100K', 'Trail runner · Annecy', 'Earn every summit', 'Finish a first 100 km mountain ultra', 'Build durable legs, calm fueling, and confidence for the final climb after sunset.', '2027-07-16', 'Trail du Ventoux', '5th woman · 7:12:44', 'Vertical trail session', '21 km · 1,480 m elevation', 'women', 73),
  (15, 'demo_kenji_mori', 'Kenji Mori', 'Contact-first infielder developing range, bat speed, and consistency through a long baseball season.', 'Tokyo, Japan', 'Baseball', NULL, 'impact', 'SS', 'Shortstop · Tokyo', 'Own every inning', 'Earn a starting shortstop role', 'Turn reliable defense and disciplined at-bats into an everyday place in the lineup.', '2027-03-19', 'University championship series', '.417 AVG · 6 RBI', 'Infield and batting practice', '90 ground balls · 60 swings', 'men', 12),
  (16, 'demo_aisha_rahman', 'Aisha Rahman', 'Singles badminton player building speed, deception, and the patience to construct points instead of rushing them.', 'Kuala Lumpur, Malaysia', 'Badminton', NULL, 'spotlight', 'TOP 100', 'Badminton player · Kuala Lumpur', 'Control the rally', 'Reach the world top 100', 'Improve first-three-shot quality and become comfortable winning in three games.', '2027-05-09', 'Malaysia International finalist', 'Runner-up · 21–18 in the third', 'Multi-shuttle footwork', '8 sets · rear-court recovery', 'women', 16),
  (17, 'demo_mateo_alvarez', 'Mateo Álvarez', 'Left-side padel player combining patient defense with an aggressive transition game, competing across Spain.', 'Barcelona, Spain', 'Padel', NULL, 'momentum', 'FIP', 'Padel player · Barcelona', 'Build the point', 'Win a first FIP tournament', 'Defend the glass with patience, own the net, and trust the partner beside me.', '2027-01-31', 'Catalonia Open', 'Semifinal · 6–7 · 7–5 · 8–10', 'Volley and bandeja session', '95 min · transition focus', 'men', 33),
  (18, 'demo_nia_brooks', 'Nia Brooks', '400-metre sprinter chasing speed without losing rhythm, built through precise sessions and patient recovery.', 'Atlanta, United States', 'Athletics', NULL, 'pulse', 'SUB 52', '400 m sprinter · Atlanta', 'One lap, fully committed', 'Run 400 metres under 52 seconds', 'Carry relaxed speed through the backstretch and stay technically clean when the race gets loud.', '2027-06-12', 'Regional 400 m final', '52.41 · personal best', 'Special endurance', '2 × 300 m + 3 × 120 m', 'women', 31),
  (19, 'demo_erik_lund', 'Erik Lund', 'Alpine skier refining clean edges, confident speed, and the small technical details that separate a good run from a complete one.', 'Oslo, Norway', 'Skiing', NULL, 'midnight', 'FIS', 'Alpine skier · Oslo', 'Find the fast line', 'Score under 40 FIS points in giant slalom', 'Carry speed out of every turn while staying composed on steep, icy courses.', '2027-02-07', 'Norwegian Cup giant slalom', '4th · +0.81 s', 'Giant slalom gates', '8 runs · hard snow', 'men', 46),
  (20, 'demo_priya_shah', 'Priya Shah', 'Opening batter learning to occupy the crease, score all around the wicket, and lead with calm intent.', 'Mumbai, India', 'Cricket', NULL, 'evergreen', 'OPENER', 'Opening batter · Mumbai', 'Stay at the crease', 'Earn a domestic first-team debut', 'Build an innings ball by ball and turn strong starts into match-shaping scores.', '2027-01-10', 'U23 one-day championship', '112 not out · 128 balls', 'Net session', '150 balls · pace and spin', 'women', 47),
  (21, 'demo_daniel_kim', 'Daniel Kim', 'Olympic weightlifter building a technically repeatable total with patience, mobility, and respect for heavy days.', 'Seoul, South Korea', 'Weightlifting', NULL, 'obsidian', '300 KG', 'Weightlifter · Seoul', 'Make every lift look the same', 'Total 300 kg in competition', 'A smooth 135 kg snatch and a confident 165 kg clean and jerk on the same platform.', '2027-04-03', 'Seoul Open', '287 kg total · silver', 'Heavy clean and jerk', '5 singles at 150 kg', 'men', 59),
  (22, 'demo_chloe_bernard', 'Chloé Bernard', 'Artistic gymnast rebuilding difficulty with clean basics, expressive routines, and a healthy long-term approach.', 'Paris, France', 'Gymnastics', NULL, 'horizon', 'ALL AROUND', 'Artistic gymnast · Paris', 'Precision with expression', 'Qualify for the national all-around final', 'Connect the upgraded routines under pressure and compete with confidence on all four apparatus.', '2027-05-16', 'Regional all-around', '52.850 · 2nd place', 'Beam routine consistency', '8 full routines · 6 hit', 'women', 36),
  (23, 'demo_rafael_costa', 'Rafael Costa', 'Attacking fullback developing repeat sprint ability, one-versus-one defending, and better choices in the final third.', 'São Paulo, Brazil', 'Football', NULL, 'impact', 'RB', 'Fullback · São Paulo', 'Own the whole touchline', 'Start 20 senior matches this season', 'Be dependable without the ball and decisive whenever space opens ahead.', '2027-06-02', 'First senior assist', '90 minutes · clean sheet', 'Repeated sprint session', '2 × 8 sprints · crossing finish', 'men', 51),
  (24, 'demo_emma_wilson', 'Emma Wilson', 'Lightweight rower focused on efficient rhythm, honest training, and building speed with eight other people moving as one.', 'Oxford, United Kingdom', 'Rowing', NULL, 'spotlight', '2K', 'Lightweight rower · Oxford', 'One boat, one rhythm', 'Break seven minutes for 2,000 metres', 'Hold technical length under pressure and finish the final 500 metres with conviction.', '2026-12-05', 'Autumn head race', '1st lightweight crew', 'Erg threshold session', '3 × 12 min · 1:50 split', 'women', 8),
  (25, 'demo_samir_haddad', 'Samir Haddad', 'Handball goalkeeper training reactions, positioning, and the courage to stay big when the game is on the line.', 'Tunis, Tunisia', 'Handball', NULL, 'momentum', 'GK', 'Goalkeeper · Tunis', 'Protect the line', 'Reach the continental club semifinal', 'Raise save percentage through better preparation, communication, and late-game composure.', '2027-04-24', 'Derby match', '17 saves · 44% save rate', 'Close-range reaction work', '72 shots · wing and pivot focus', 'men', 62),
  (26, 'demo_talia_cohen', 'Talia Cohen', 'Strength coach and recreational athlete sharing practical training that makes everyday life feel more capable.', 'Tel Aviv, Israel', 'Gym & Fitness', NULL, 'evergreen', 'STRONG', 'Strength coach · Tel Aviv', 'Strength for real life', 'Deadlift twice bodyweight', 'Build a strong, repeatable training week while helping others feel at home in the gym.', '2027-02-12', 'First powerlifting meet', '342.5 kg total', 'Lower-body strength', 'Deadlift 5 × 3 · accessories', 'women', 14),
  (27, 'demo_oliver_jensen', 'Oliver Jensen', 'Back-row rugby player who loves the unseen work: defensive spacing, breakdown effort, and getting up for the next phase.', 'Copenhagen, Denmark', 'Rugby', NULL, 'pulse', 'NO. 7', 'Flanker · Copenhagen', 'Win the next collision', 'Earn selection for the national training squad', 'Become more explosive at the breakdown and reliable across every eighty-minute performance.', '2027-03-13', 'Nordic league final', '18 tackles · 3 turnovers', 'Contact conditioning', '6 blocks · tackle and reload', 'men', 26),
  (28, 'demo_grace_lee', 'Grace Lee', 'Table tennis player developing early timing, varied serves, and a brave forehand under pressure.', 'Singapore', 'Table Tennis', NULL, 'midnight', 'TOP 50', 'Table tennis player · Singapore', 'Take time away', 'Reach the continental top 50', 'Control the short game, attack the first loose ball, and compete freely at every score.', '2027-07-08', 'Southeast Asia Open', 'Quarterfinal', 'Serve and third ball', '12 serve patterns · match play', 'women', 24),
  (29, 'demo_liam_oconnor', 'Liam O’Connor', 'Wide receiver learning the details of releases, route tempo, and reliable hands in every condition.', 'Dublin, Ireland', 'American Football', NULL, 'obsidian', 'WR', 'Wide receiver · Dublin', 'Create separation', 'Record a 1,000-yard season', 'Win at the line, make the difficult catch routine, and become a trusted target on third down.', '2027-08-21', 'National league semifinal', '9 catches · 146 yards · 2 TD', 'Route and speed session', '42 routes · 8 flying sprints', 'men', 38),
  (30, 'demo_valentina_ruiz', 'Valentina Ruiz', 'Outside hitter building a complete six-rotation game with aggressive serving and calm late-set decision making.', 'Buenos Aires, Argentina', 'Volleyball', NULL, 'horizon', 'OH', 'Outside hitter · Buenos Aires', 'Play above the net', 'Win the national club championship', 'Score efficiently from imperfect situations and become a dependable passer in every rotation.', '2027-05-30', 'Metropolitan league final', '22 points · 58% attack', 'Serve-receive and transition', '110 contacts · 6 rotations', 'women', 52),
  (31, 'demo_marcus_reed', 'Marcus Reed', 'Powerlifter pursuing a bigger total through technical consistency, patient loading, and fewer heroic training days.', 'Chicago, United States', 'Powerlifting', NULL, 'impact', '800 KG', 'Powerlifter · Chicago', 'Build the total', 'Total 800 kg at nationals', 'Bring a confident squat, disciplined bench, and decisive final deadlift to the platform.', '2027-06-19', 'State championship', '762.5 kg total · 1st place', 'Competition squat', '4 × 2 at 255 kg', 'men', 48),
  (32, 'demo_yuki_tanaka', 'Yuki Tanaka', 'Freeride snowboarder chasing creative lines, clean landings, and long winters spent learning the mountain.', 'Sapporo, Japan', 'Snowboarding', NULL, 'spotlight', 'FWQ', 'Freeride snowboarder · Sapporo', 'Ride the whole mountain', 'Qualify for the Freeride World Qualifier final', 'Choose stronger lines, stay composed in exposed terrain, and land every feature with control.', '2027-02-26', 'Hokkaido freeride event', '2nd place · 84.3 points', 'Powder and cliff session', '14 runs · 3 filmed lines', 'women', 26),
  (33, 'demo_fatou_diallo', 'Fatou Diallo', 'Two-way guard bringing relentless defense, quick decisions, and energy that lifts the whole team.', 'Dakar, Senegal', 'Basketball', NULL, 'momentum', 'SG', 'Shooting guard · Dakar', 'Pressure changes games', 'Earn a professional contract abroad', 'Become an elite point-of-attack defender and a confident shooter on high-value attempts.', '2027-07-01', 'West African club final', '19 points · 6 steals', 'Defensive footwork and shooting', '180 makes · full-court intervals', 'women', 60),
  (34, 'demo_jonas_berg', 'Jonas Berg', 'Two-way defenseman improving first-pass quality, skating efficiency, and calm execution under forecheck pressure.', 'Stockholm, Sweden', 'Ice Hockey', NULL, 'midnight', 'D', 'Defenseman · Stockholm', 'Move the puck early', 'Earn a place in the top national league', 'Defend with good feet, exit cleanly, and contribute without forcing the game.', '2027-03-06', 'U20 playoff series', '+6 rating · 5 assists', 'Skating and breakout practice', '70 min · retrieval patterns', 'men', 20),
  (35, 'demo_mei_lin', 'Mei Lin', 'Butterfly swimmer refining rhythm and underwater speed while keeping joy at the center of daily practice.', 'Hong Kong', 'Swimming', NULL, 'pulse', '200 FLY', 'Butterfly swimmer · Hong Kong', 'Hold the rhythm', 'Qualify for the Asian Championships', 'Make the third 50 metres a strength and arrive at the final wall still racing forward.', '2027-04-17', 'Hong Kong Championships', '2:12.84 · personal best', 'Race-pace butterfly', '3 × 4 × 50 m · 200 pace', 'women', 35),
  (36, 'demo_arthur_moreau', 'Arthur Moreau', 'Puncheur who enjoys short steep climbs, nervous races, and finding the right moment to move.', 'Bordeaux, France', 'Cycling', NULL, 'obsidian', 'U23', 'Road cyclist · Bordeaux', 'Race with instinct', 'Win a national-level U23 road race', 'Improve repeatability above threshold and convert strong legs into better tactical decisions.', '2027-04-30', 'Tour du Périgord stage', '3rd place', 'VO2 and sprint finish', '5 × 4 min + 6 sprints', 'men', 13),
  (37, 'demo_laila_benali', 'Laila Benali', 'Technical boxer building a calm ring presence, sharp counters, and the conditioning to finish every round stronger.', 'Casablanca, Morocco', 'Boxing', NULL, 'horizon', '60 KG', 'Lightweight boxer · Casablanca', 'Calm is a weapon', 'Win the African amateur championship', 'Control distance, see every opening, and trust the work when the pace rises.', '2027-05-08', 'National championship', 'Gold · 4 unanimous decisions', 'Counter-punching rounds', '10 rounds · partner rotation', 'women', 50),
  (38, 'demo_ethan_clark', 'Ethan Clark', 'CrossFit competitor working to turn broad fitness into consistent event execution across a full weekend.', 'Austin, United States', 'CrossFit', 'Weightlifting', 'evergreen', 'SEMIFINALS', 'CrossFit athlete · Austin', 'No weak events', 'Qualify for the CrossFit semifinals', 'Raise gymnastics capacity, protect the engine, and make smart decisions under fatigue.', '2027-03-20', 'Regional online qualifier', '12th overall', 'Mixed modal intervals', '5 rounds · bike, toes-to-bar, clean', 'men', 67),
  (39, 'demo_sara_novak', 'Sara Novak', 'Clay-court tennis player building point tolerance, a heavier forehand, and confidence closing matches.', 'Zagreb, Croatia', 'Tennis', NULL, 'impact', 'ITF', 'Tennis player · Zagreb', 'Build the point, finish brave', 'Win a first ITF singles title', 'Use depth to create space and commit fully when the short ball finally arrives.', '2027-06-06', 'Adriatic W25', 'Finalist · 5 match wins', 'Clay-court patterns', '2 hours · live-ball points', 'women', 45),
  (40, 'demo_gabriel_silva', 'Gabriel Silva', 'Street skateboarder filming a full part built around speed, clean style, and spots across Rio.', 'Rio de Janeiro, Brazil', 'Skateboarding', NULL, 'spotlight', 'VIDEO PART', 'Skateboarder · Rio', 'Make the city a canvas', 'Release a first full street video part', 'Collect twelve strong clips without rushing the process or losing the fun that started it.', '2027-01-15', 'Rio street contest', '1st place · best trick', 'Street filming session', '3 spots · 2 clips landed', 'men', 15),
  (41, 'demo_naomi_adeyemi', 'Naomi Adeyemi', 'Long jumper developing more runway speed, a repeatable takeoff, and confidence on the biggest stages.', 'Nairobi, Kenya', 'Athletics', NULL, 'momentum', '6.70 M', 'Long jumper · Nairobi', 'Attack the board', 'Jump beyond 6.70 metres', 'Arrive fast, stay tall through takeoff, and make every legal jump a competitive one.', '2027-07-24', 'National trials', '6.48 m · personal best', 'Approach and takeoff', '10 full approaches · 6 jumps', 'women', 58),
  (42, 'demo_louis_perrin', 'Louis Perrin', 'Mountain guide sharing practical preparation for long alpine days, from route planning to steady movement above the clouds.', 'Chamonix, France', 'Hiking', 'Climbing', 'midnight', 'ALPINE', 'Mountain guide · Chamonix', 'Prepare, then explore', 'Complete a technical Alps traverse', 'Move efficiently for seven days while keeping the team safe, fueled, and ready for changing conditions.', '2027-08-14', 'Mont Blanc traverse', '3 summits · 4 days', 'Loaded uphill hike', '18 km · 1,700 m · 10 kg pack', 'men', 54),
  (43, 'demo_elena_petrova', 'Elena Petrova', 'Strawweight mixed martial artist combining crisp boxing, chain wrestling, and relentless curiosity.', 'Prague, Czech Republic', 'MMA', 'Martial Arts', 'pulse', '5–0', 'Strawweight · Prague', 'Connect every phase', 'Remain unbeaten through five professional fights', 'Create safer entries, finish takedowns against the fence, and keep improving between every camp.', '2027-02-20', 'Professional fight four', 'Win · submission · round 2', 'Wrestling to striking', '6 × 5 min · transition rounds', 'women', 19),
  (44, 'demo_tom_becker', 'Tom Becker', 'Competitive amateur golfer pursuing quieter decisions, sharper wedges, and a swing that travels under pressure.', 'Berlin, Germany', 'Golf', NULL, 'evergreen', '+1.2', 'Amateur golfer · Berlin', 'Play the next shot', 'Qualify for the national amateur', 'Improve scoring from 120 metres and in while staying committed to conservative targets.', '2027-06-25', 'Berlin Amateur', 'T3 · 70–68–71', 'Wedge combine', '100 shots · 72% inside target', 'men', 30),
  (45, 'demo_isabella_rossi', 'Isabella Rossi', 'Coach and fitness creator making strength training approachable, sustainable, and useful beyond the mirror.', 'Milan, Italy', 'Gym & Fitness', NULL, 'horizon', 'COACH', 'Strength coach · Milan', 'Stronger for longer', 'Launch a community strength program', 'Help one hundred beginners build a consistent routine with clear coaching and no intimidation.', '2027-01-09', 'Community training weekend', '86 athletes coached', 'Full-body strength session', '60 min · squat, press, carry', 'women', 11),
  (46, 'demo_omar_farouk', 'Omar Farouk', 'Ball-playing center back focused on anticipation, communication, and helping the team control matches from deep.', 'Cairo, Egypt', 'Football', NULL, 'obsidian', 'CB', 'Center back · Cairo', 'Defend forward', 'Win the domestic cup', 'Keep the line connected, break pressure with the first pass, and lead through difficult moments.', '2027-05-21', 'Cup quarterfinal', 'Clean sheet · 94% pass completion', 'Defensive unit and passing', '80 min · high-line scenarios', 'men', 64),
  (47, 'demo_mia_andersen', 'Mia Andersen', 'Short-course triathlete sharpening transitions, bike power, and the courage to race from the front.', 'Aarhus, Denmark', 'Triathlon', 'Running', 'impact', 'OLYMPIC', 'Triathlete · Aarhus', 'Race without hesitation', 'Qualify for the European age-group championship', 'Exit the swim connected, ride with intent, and trust the run built through winter.', '2027-06-13', 'Copenhagen Olympic triathlon', '2:06:18 · age-group win', 'Open-water bike brick', '1.5 km swim + 50 km bike', 'women', 49),
  (48, 'demo_jayden_cole', 'Jayden Cole', 'Center fielder building elite range, a more disciplined approach, and the durability required for a full summer.', 'Los Angeles, United States', 'Baseball', NULL, 'spotlight', 'CF', 'Center fielder · Los Angeles', 'Cover every gap', 'Earn an independent-league roster spot', 'Control the strike zone, create value on the bases, and turn difficult catches into routine outs.', '2027-03-28', 'College conference tournament', '.389 AVG · 4 stolen bases', 'Outfield reads and hitting', '75 fly balls · 50 at-bats', 'men', 39),
  (49, 'demo_sofia_nilsson', 'Sofia Nilsson', 'Field hockey midfielder combining relentless running with smart distribution and calm defensive work.', 'Amsterdam, Netherlands', 'Field Hockey', NULL, 'momentum', 'CM', 'Midfielder · Amsterdam', 'Connect every line', 'Earn promotion to the top division', 'Improve pressing communication and create more circle entries without forcing the final pass.', '2027-04-18', 'Promotion playoff', '1 goal · player of the match', 'Pressing and small-sided games', '80 min · high-intensity repeat efforts', 'women', 28),
  (50, 'demo_alexia_romero', 'Alexia Romero', 'Trail runner exploring the mountains around Mexico City while building toward longer, higher, and more technical races.', 'Mexico City, Mexico', 'Trail Running', 'Hiking', 'horizon', '50 MILES', 'Trail runner · Mexico City', 'Run above the city', 'Finish a first 50-mile trail race', 'Build climbing strength, practice patient fueling, and stay present through the long night miles.', '2027-09-18', 'Nevado de Toluca 42K', '4th woman · 5:18:22', 'High-altitude long run', '30 km · 1,900 m · 3,600 m peak', 'women', 42);

CREATE TEMP TABLE demo_palettes (
  palette_id integer PRIMARY KEY,
  background text NOT NULL,
  surface text NOT NULL,
  foreground text NOT NULL,
  accent text NOT NULL,
  social text NOT NULL,
  header_text text NOT NULL,
  header_muted text NOT NULL,
  description text NOT NULL,
  accent_text text NOT NULL,
  social_text text NOT NULL
) ON COMMIT DROP;

INSERT INTO demo_palettes VALUES
  (1, '#F4F7FF', '#FFFFFF', '#101828', '#2F6BFF', '#DCE7FF', '#F8FAFF', '#C9D8F0', '#5D6878', '#FFFFFF', '#173B7A'),
  (2, '#18181B', '#27272A', '#FAFAFA', '#F97316', '#3F3F46', '#FAFAFA', '#D4D4D8', '#A1A1AA', '#18181B', '#FAFAFA'),
  (3, '#FFF7ED', '#FFFFFF', '#18181B', '#EF4444', '#FEE2E2', '#FFF7ED', '#FED7AA', '#78716C', '#FFFFFF', '#7F1D1D'),
  (4, '#09090B', '#18181B', '#FAFAFA', '#A3E635', '#27272A', '#F7FEE7', '#D9F99D', '#A1A1AA', '#09090B', '#FAFAFA'),
  (5, '#071426', '#10233D', '#F8FAFC', '#3B82F6', '#1E3A5F', '#F8FAFC', '#BFDBFE', '#A8B8CC', '#FFFFFF', '#F8FAFC'),
  (6, '#11102A', '#1C1940', '#FAFAFA', '#A78BFA', '#312E81', '#FAFAFA', '#C4B5FD', '#B8B5D8', '#11102A', '#FAFAFA'),
  (7, '#102A22', '#173B30', '#F7FEE7', '#6EE7B7', '#245244', '#F7FEE7', '#A7F3D0', '#A7C7B7', '#102A22', '#F7FEE7'),
  (8, '#F8F2E9', '#FFFDF8', '#172554', '#F97316', '#FFEDD5', '#FFF7ED', '#FED7AA', '#596780', '#FFFFFF', '#172554');

-- Cover photographs are intentionally generic editorial sports imagery rather
-- than evidence that the fictional person performed at a specific event.
WITH source AS (
  SELECT
    athlete.*,
    palette.*,
    CASE (athlete.seq - 1) % 10
      WHEN 0 THEN 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1600&q=82'
      WHEN 1 THEN 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1600&q=82'
      WHEN 2 THEN 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1600&q=82'
      WHEN 3 THEN 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=1600&q=82'
      WHEN 4 THEN 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1600&q=82'
      WHEN 5 THEN 'https://images.unsplash.com/photo-1530137073520-4ea6e2f10a48?auto=format&fit=crop&w=1600&q=82'
      WHEN 6 THEN 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1600&q=82'
      WHEN 7 THEN 'https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=1600&q=82'
      WHEN 8 THEN 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=1600&q=82'
      ELSE 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1600&q=82'
    END AS cover_url
  FROM demo_athletes athlete
  JOIN demo_palettes palette ON palette.palette_id = ((athlete.seq - 1) % 8) + 1
)
INSERT INTO public_profiles (
  user_id,
  username,
  display_name,
  bio,
  location,
  avatar_url,
  cover_url,
  theme,
  is_published,
  show_branding,
  is_discoverable,
  allow_indexing,
  seo_title,
  seo_description,
  updated_at
)
SELECT
  '06d8aa8e-92aa-4973-a00a-81b977022e2a',
  source.username,
  source.display_name,
  source.bio,
  source.location,
  format('https://randomuser.me/api/portraits/%s/%s.jpg', source.portrait_group, source.portrait_id),
  source.cover_url,
  jsonb_build_object(
    'templateId', source.template_id,
    'colorPreset', 'custom',
    'customColors', jsonb_build_object(
      'background', source.background,
      'surface', source.surface,
      'foreground', source.foreground,
      'accent', source.accent,
      'social', source.social,
      'headerText', source.header_text,
      'headerMutedText', source.header_muted,
      'blockTitle', source.foreground,
      'description', source.description,
      'accentText', source.accent_text,
      'socialText', source.social_text
    ),
    'fontPreset', (ARRAY['athletic', 'editorial', 'technical', 'clean'])[((source.seq - 1) % 4) + 1],
    'radiusPreset', (ARRAY['sharp', 'soft', 'rounded'])[((source.seq - 1) % 3) + 1],
    'galleryLayout', (ARRAY['carousel', 'editorial', 'grid'])[((source.seq - 1) % 3) + 1],
    'coverType', (ARRAY['image', 'gradient', 'color'])[((source.seq - 1) % 3) + 1],
    'coverColor', source.background,
    'coverGradientFrom', source.background,
    'coverGradientTo', source.accent,
    'coverOverlayColor', source.background,
    'coverOverlayOpacity', 35 + ((source.seq * 7) % 45),
    'headerLayout', (ARRAY['centered', 'split', 'left', 'immersive', 'kinetic'])[((source.seq - 1) % 5) + 1],
    'headerAvatarSize', 78 + ((source.seq * 7) % 42),
    'headerAvatarShape', (ARRAY['circle', 'hexagon', 'diamond', 'shield'])[((source.seq - 1) % 4) + 1],
    'headerSheetColor', source.surface,
    'headerSheetCoverage', (ARRAY[0, 35, 60, 100])[((source.seq - 1) % 4) + 1],
    'headerGeometry', (ARRAY['none', 'velocity', 'rings', 'chevrons', 'blocks'])[((source.seq - 1) % 5) + 1],
    'headerTexture', (ARRAY['none', 'grid', 'diagonal', 'dots', 'scanlines'])[((source.seq - 1) % 5) + 1],
    'blockCorner', (ARRAY[0, 35, 65, 90])[((source.seq - 1) % 4) + 1],
    'blockBorder', 15 + ((source.seq * 9) % 65),
    'blockBorderColor', source.accent,
    'blockShadow', 18 + ((source.seq * 11) % 65),
    'blockShadowStyle', CASE WHEN source.seq % 2 = 0 THEN 'solid' ELSE 'soft' END,
    'blockSpacing', 22 + ((source.seq * 7) % 48),
    'templateWordingOverrides', jsonb_build_object(
      'discipline', source.discipline,
      'badge', source.badge,
      'eyebrow', source.eyebrow,
      'profileLabel', CASE source.seq % 4 WHEN 0 THEN 'Inside the process' WHEN 1 THEN 'The build' WHEN 2 THEN 'The season' ELSE 'The story' END,
      'targetLabel', CASE source.seq % 3 WHEN 0 THEN 'Main objective' WHEN 1 THEN 'Next target' ELSE 'Current mission' END,
      'galleryLabel', CASE source.seq % 3 WHEN 0 THEN 'Training days' WHEN 1 THEN 'Behind the scenes' ELSE 'In motion' END,
      'achievementsLabel', CASE source.seq % 3 WHEN 0 THEN 'Results' WHEN 1 THEN 'Key moments' ELSE 'Milestones' END,
      'activityLabel', 'Latest work',
      'secondaryGoalLabel', 'What comes next'
    )
  ),
  true,
  false,
  false,
  false,
  source.display_name || ' — GRIIT demo profile',
  left('Fictional GRIIT demo profile for ' || source.primary_sport || '. Created for product screenshots and testing.', 160),
  now()
FROM source
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

CREATE TEMP TABLE demo_profiles ON COMMIT DROP AS
SELECT athlete.*, profile.id AS profile_id, profile.cover_url
FROM demo_athletes athlete
JOIN public_profiles profile ON profile.username = athlete.username
WHERE profile.user_id = '06d8aa8e-92aa-4973-a00a-81b977022e2a';

-- Rebuild child content so rerunning the seed always produces the same result.
DELETE FROM profile_blocks WHERE profile_id IN (SELECT profile_id FROM demo_profiles);
DELETE FROM profile_social_links WHERE profile_id IN (SELECT profile_id FROM demo_profiles);
DELETE FROM profile_sports WHERE profile_id IN (SELECT profile_id FROM demo_profiles);
DELETE FROM profile_gallery_items WHERE profile_id IN (SELECT profile_id FROM demo_profiles);
DELETE FROM profile_achievements WHERE profile_id IN (SELECT profile_id FROM demo_profiles);
DELETE FROM profile_sponsors WHERE profile_id IN (SELECT profile_id FROM demo_profiles);
DELETE FROM profile_activities WHERE profile_id IN (SELECT profile_id FROM demo_profiles);
DELETE FROM profile_goals WHERE profile_id IN (SELECT profile_id FROM demo_profiles);

INSERT INTO profile_sports (profile_id, sport_id, sort_order, is_enabled)
SELECT profile.profile_id, sport.id, 0, true
FROM demo_profiles profile
JOIN sports sport ON sport.name = profile.primary_sport;

INSERT INTO profile_sports (profile_id, sport_id, sort_order, is_enabled)
SELECT profile.profile_id, sport.id, 1, true
FROM demo_profiles profile
JOIN sports sport ON sport.name = profile.secondary_sport
WHERE profile.secondary_sport IS NOT NULL;

-- Multiple goals demonstrate the Pro allowance while keeping the first goal
-- the prominent public objective.
INSERT INTO profile_goals (
  profile_id, title, description, url, target_at, date_display, status, sort_order, is_enabled
)
SELECT
  profile_id,
  goal_title,
  goal_description,
  'https://griit.me/' || username,
  target_at,
  CASE WHEN seq % 2 = 0 THEN 'countdown' ELSE 'date' END,
  'active',
  0,
  true
FROM demo_profiles;

INSERT INTO profile_goals (
  profile_id, title, description, url, target_at, date_display, status, sort_order, is_enabled
)
SELECT
  profile_id,
  CASE seq % 4
    WHEN 0 THEN 'Build a stronger off-season base'
    WHEN 1 THEN 'Share one useful training note every week'
    WHEN 2 THEN 'Complete a full season without avoidable injury'
    ELSE 'Help the local community move more'
  END,
  CASE seq % 4
    WHEN 0 THEN 'A secondary objective built around durability, skill, and patient progress.'
    WHEN 1 THEN 'Document the process honestly so another athlete can learn from it.'
    WHEN 2 THEN 'Prioritize recovery, strength, and sustainable training across the calendar.'
    ELSE 'Create a welcoming session that makes the sport easier to discover.'
  END,
  'https://griit.me/' || username,
  target_at + interval '120 days',
  CASE WHEN seq % 2 = 0 THEN 'date' ELSE 'countdown' END,
  'planned',
  1,
  true
FROM demo_profiles;

INSERT INTO profile_blocks (profile_id, type, title, content, sort_order, is_enabled)
SELECT profile_id, block.type, block.title, block.content, block.sort_order, true
FROM demo_profiles profile
CROSS JOIN LATERAL (
  VALUES
    ('achievements'::varchar, 'Achievements'::varchar, '{}'::jsonb, 0),
    ('activities'::varchar, 'Training log'::varchar, '{}'::jsonb, 1),
    ('gallery'::varchar, 'In motion'::varchar, '{}'::jsonb, 2),
    ('link'::varchar, 'Follow the full journey'::varchar, jsonb_build_object(
      'title', 'Follow the full journey',
      'description', 'Training notes, competition updates, and the work between milestones.',
      'url', 'https://griit.me/' || profile.username,
      'imageUrl', CASE WHEN profile.seq % 2 = 0 THEN profile.cover_url ELSE '' END
    ), 3),
    ('offer'::varchar, 'Training notes'::varchar, jsonb_build_object(
      'title', 'Training notes',
      'description', 'A practical look at this season''s preparation and lessons.',
      'url', 'https://griit.me/' || profile.username,
      'ctaLabel', 'Explore the notes',
      'promoCode', '',
      'imageUrl', ''
    ), 4),
    ('sponsors'::varchar, 'Partnerships'::varchar, jsonb_build_object(
      'mode', 'seeking',
      'headline', 'Open to aligned partnerships',
      'description', 'Interested in thoughtful collaborations connected to training, recovery, events, and community.',
      'contact', 'https://griit.me/' || profile.username,
      'ctaLabel', 'Start a conversation'
    ), 5)
) AS block(type, title, content, sort_order);

INSERT INTO profile_social_links (profile_id, platform, label, url, sort_order, is_enabled)
SELECT profile_id, 'instagram', '@' || replace(username, 'demo_', ''), 'https://www.instagram.com/', 0, true
FROM demo_profiles;

INSERT INTO profile_social_links (profile_id, platform, label, url, sort_order, is_enabled)
SELECT
  profile_id,
  CASE seq % 4 WHEN 0 THEN 'strava' WHEN 1 THEN 'youtube' WHEN 2 THEN 'tiktok' ELSE 'website' END,
  CASE seq % 4 WHEN 0 THEN 'Training log' WHEN 1 THEN 'Watch the process' WHEN 2 THEN 'Daily sessions' ELSE 'Athlete journal' END,
  CASE seq % 4 WHEN 0 THEN 'https://www.strava.com/' WHEN 1 THEN 'https://www.youtube.com/' WHEN 2 THEN 'https://www.tiktok.com/' ELSE 'https://griit.me/' || username END,
  1,
  true
FROM demo_profiles;

INSERT INTO profile_social_links (profile_id, platform, label, url, sort_order, is_enabled)
SELECT profile_id, 'email', 'Collaboration enquiries', 'mailto:demo@griit.me', 2, true
FROM demo_profiles
WHERE seq % 3 = 0;

INSERT INTO profile_achievements (
  profile_id,
  title,
  result,
  achievement_type,
  achievement_type_label,
  event_name,
  description,
  image_url,
  result_url,
  result_link_label,
  achieved_at,
  sort_order,
  is_enabled
)
SELECT
  profile_id,
  achievement_title,
  achievement_result,
  (ARRAY['victory', 'podium', 'personal_best', 'qualification', 'record', 'certification', 'milestone', 'other'])[((seq - 1) % 8) + 1],
  CASE WHEN seq % 8 = 0 THEN 'Breakthrough performance' ELSE NULL END,
  CASE seq % 4 WHEN 0 THEN 'Regional championship' WHEN 1 THEN 'Season benchmark' WHEN 2 THEN 'Open competition' ELSE 'Personal project' END,
  'A result earned through patient preparation, smart adjustments, and a committed performance when it mattered.',
  CASE (seq - 1) % 4
    WHEN 0 THEN 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80'
    WHEN 1 THEN 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=1200&q=80'
    WHEN 2 THEN 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80'
    ELSE 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80'
  END,
  'https://griit.me/' || username,
  CASE seq % 3 WHEN 0 THEN 'View result' WHEN 1 THEN 'Read the recap' ELSE 'See the performance' END,
  target_at - interval '150 days',
  0,
  true
FROM demo_profiles;

INSERT INTO profile_achievements (
  profile_id, title, result, achievement_type, event_name, description,
  achieved_at, sort_order, is_enabled
)
SELECT
  profile_id,
  CASE seq % 4
    WHEN 0 THEN 'First complete competition season'
    WHEN 1 THEN 'New training benchmark'
    WHEN 2 THEN 'Community event contribution'
    ELSE 'Consistency milestone'
  END,
  CASE seq % 4 WHEN 0 THEN 'Season complete' WHEN 1 THEN 'Personal best' WHEN 2 THEN '120 participants' ELSE '100 sessions' END,
  CASE seq % 4 WHEN 0 THEN 'milestone' WHEN 1 THEN 'personal_best' WHEN 2 THEN 'other' ELSE 'record' END,
  CASE seq % 4 WHEN 0 THEN '2026 season' WHEN 1 THEN 'Training benchmark' WHEN 2 THEN 'Local sport community' ELSE 'Annual training log' END,
  CASE seq % 4
    WHEN 0 THEN 'Stayed healthy, adapted through setbacks, and completed every planned competition.'
    WHEN 1 THEN 'A small number that represents months of better habits and consistent execution.'
    WHEN 2 THEN 'Helped create an accessible event for people discovering the sport for the first time.'
    ELSE 'One hundred purposeful sessions completed with attention to quality and recovery.'
  END,
  target_at - interval '240 days',
  1,
  true
FROM demo_profiles;

INSERT INTO profile_activities (
  profile_id, title, activity_type, occurred_at, metrics, sort_order, is_enabled
)
SELECT
  profile_id,
  activity_title,
  activity_type,
  now() - make_interval(days => (seq % 6) + 1),
  jsonb_build_object(
    'duration', (45 + (seq % 8) * 10)::text || ' min',
    'effort', CASE seq % 3 WHEN 0 THEN 'Controlled' WHEN 1 THEN 'Productive' ELSE 'High quality' END,
    'focus', primary_sport
  ),
  0,
  true
FROM demo_profiles;

INSERT INTO profile_activities (
  profile_id, title, activity_type, occurred_at, metrics, sort_order, is_enabled
)
SELECT
  profile_id,
  CASE seq % 4 WHEN 0 THEN 'Recovery and mobility' WHEN 1 THEN 'Technical development' WHEN 2 THEN 'Aerobic foundation' ELSE 'Competition simulation' END,
  CASE seq % 4 WHEN 0 THEN 'Easy recovery · mobility and reset' WHEN 1 THEN 'Skill session · deliberate repetitions' WHEN 2 THEN 'Endurance · conversational effort' ELSE 'Race rehearsal · controlled intensity' END,
  now() - make_interval(days => (seq % 9) + 8),
  jsonb_build_object('duration', (35 + (seq % 7) * 8)::text || ' min', 'sessionRpe', 4 + (seq % 5)),
  1,
  true
FROM demo_profiles;

INSERT INTO profile_gallery_items (
  profile_id, image_url, caption, alt_text, sort_order, is_enabled
)
SELECT
  profile.profile_id,
  gallery.image_url,
  gallery.caption,
  profile.display_name || ' — ' || gallery.alt_suffix,
  gallery.sort_order,
  true
FROM demo_profiles profile
CROSS JOIN LATERAL (
  VALUES
    ('https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80', 'The work before the result', 'training in progress', 0),
    ('https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=1200&q=80', 'A session worth remembering', 'focused training session', 1),
    ('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80', 'Building the foundation', 'strength and preparation', 2),
    ('https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80', 'Competition energy', 'competition atmosphere', 3)
) AS gallery(image_url, caption, alt_suffix, sort_order);

-- Direct demo URLs. They are deliberately absent from /athletes.
SELECT
  display_name,
  primary_sport,
  template_id,
  'https://griit.me/' || username AS public_url
FROM demo_athletes
ORDER BY seq;

COMMIT;

-- Cleanup, if ever needed:
-- DELETE FROM public_profiles
-- WHERE user_id = '06d8aa8e-92aa-4973-a00a-81b977022e2a'
--   AND username LIKE 'demo\_%' ESCAPE '\';
