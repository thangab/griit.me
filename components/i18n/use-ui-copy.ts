'use client';

import { useCallback } from 'react';
import { useI18n } from '@/components/i18n/i18n-provider';

const frenchUiCopy: Record<string, string> = {
  Content: 'Contenu',
  Preview: 'Aperçu',
  Styles: 'Styles',
  'Profile details': 'Informations du profil',
  'Athlete identity': 'Identité de l’athlète',
  'Avatar, name, bio and sports': 'Photo, nom, bio et sports',
  'Profile picture': 'Photo de profil',
  'Display name': 'Nom affiché',
  Bio: 'Bio',
  Location: 'Localisation',
  Sports: 'Sports',
  Goal: 'Objectif',
  'Your next objective': 'Votre prochain objectif',
  'Add another goal': 'Ajouter un autre objectif',
  'You reached the limit of 3 active goals.':
    'Vous avez atteint la limite de 3 objectifs actifs.',
  'Add more goals': 'Ajouter d’autres objectifs',
  'Social links': 'Réseaux sociaux',
  'Connect your main social profiles': 'Connectez vos principaux réseaux',
  Blocks: 'Blocs',
  'Gallery, achievements, activities and more':
    'Galerie, réussites, activités et plus',
  Add: 'Ajouter',
  'Add a block': 'Ajouter un bloc',
  'Choose what you want to add to your profile.':
    'Choisissez ce que vous souhaitez ajouter à votre profil.',
  'Link / URL': 'Lien / URL',
  'Send visitors to a website, event, article, or resource.':
    'Redirigez vos visiteurs vers un site, un événement, un article ou une ressource.',
  'Offer / product': 'Offre / produit',
  'Share a product, promo code, or affiliate offer.':
    'Partagez un produit, un code promo ou une offre affiliée.',
  Media: 'Média',
  'Embed a YouTube, Vimeo, or TikTok video.':
    'Intégrez une vidéo YouTube, Vimeo ou TikTok.',
  'Image gallery': 'Galerie d’images',
  'Show your best training and competition moments.':
    'Présentez vos meilleurs moments d’entraînement et de compétition.',
  Achievements: 'Réussites',
  'Highlight a result, record, or milestone.':
    'Mettez en avant un résultat, un record ou une étape importante.',
  Activities: 'Activités',
  'Share a recent workout or sporting activity.':
    'Partagez un entraînement ou une activité sportive récente.',
  'Sponsors & partnerships': 'Sponsors et partenariats',
  'Show your sponsors or welcome brand opportunities.':
    'Présentez vos sponsors ou ouvrez la porte aux marques.',
  'Visual settings': 'Réglages visuels',
  Undo: 'Annuler',
  Redo: 'Rétablir',
  Template: 'Modèle',
  'Apply a complete visual direction':
    'Appliquez une direction visuelle complète',
  'Selecting a template replaces the current visual settings. Your content and customized wording stay in place.':
    'Choisir un modèle remplace les réglages visuels actuels. Votre contenu et vos textes personnalisés restent en place.',
  'Change template': 'Changer de modèle',
  'Template wording': 'Textes du modèle',
  'Customize every visible label': 'Personnalisez chaque libellé visible',
  'Choose a template': 'Choisir un modèle',
  'Your content and customized wording stay in place.':
    'Votre contenu et vos textes personnalisés restent en place.',
  Close: 'Fermer',
  Header: 'En-tête',
  'Layout, background and profile picture':
    'Disposition, arrière-plan et photo de profil',
  Layout: 'Disposition',
  'Choose how your identity is arranged.':
    'Choisissez la disposition de votre identité.',
  Background: 'Arrière-plan',
  'Choose what appears behind your profile header.':
    'Choisissez ce qui apparaît derrière votre en-tête.',
  Photo: 'Photo',
  Color: 'Couleur',
  Gradient: 'Dégradé',
  'Header photo': 'Photo d’en-tête',
  'Photo overlay': 'Voile sur la photo',
  'Overlay color': 'Couleur du voile',
  'Overlay intensity': 'Intensité du voile',
  'Background color': 'Couleur d’arrière-plan',
  'Start color': 'Couleur de départ',
  'End color': 'Couleur de fin',
  'Background transition': 'Transition de l’arrière-plan',
  'Color coverage': 'Couverture de la couleur',
  None: 'Aucune',
  Half: 'Moitié',
  Full: 'Totale',
  'Transition color': 'Couleur de transition',
  Decorations: 'Décorations',
  'Optional shapes and textures': 'Formes et textures facultatives',
  Geometry: 'Forme géométrique',
  'Choose a graphic shape or keep it clean.':
    'Choisissez une forme graphique ou gardez un style épuré.',
  Texture: 'Texture',
  'Profile picture shape': 'Forme de la photo de profil',
  'Profile picture size': 'Taille de la photo de profil',
  Colors: 'Couleurs',
  'Organized by profile element': 'Organisées par élément du profil',
  Page: 'Page',
  'Global canvas and default text': 'Fond global et texte par défaut',
  Text: 'Texte',
  'Cards and content hierarchy': 'Cartes et hiérarchie du contenu',
  Titles: 'Titres',
  Descriptions: 'Descriptions',
  Accent: 'Accent',
  'Tags and highlighted actions': 'Tags et actions mises en avant',
  'Link pills and their labels': 'Boutons de liens et leurs libellés',
  'Secondary text': 'Texte secondaire',
  Typography: 'Typographie',
  'Choose the profile tone': 'Choisissez le ton du profil',
  Appearance: 'Apparence',
  'Shape, depth and spacing': 'Forme, profondeur et espacement',
  'Block corner': 'Arrondi des blocs',
  'Block border': 'Bordure des blocs',
  'Block border color': 'Couleur de bordure',
  'Block shadow': 'Ombre des blocs',
  'Block spacing': 'Espacement des blocs',
  'Gallery layout': 'Disposition de la galerie',
  'Need more?': 'Besoin de plus ?',
  'Mobile preview': 'Aperçu mobile',
  'Desktop preview': 'Aperçu ordinateur',
  Mobile: 'Mobile',
  Desktop: 'Ordinateur',
  Draft: 'Brouillon',
  Live: 'En ligne',
  'View public page': 'Voir la page publique',
  'Profile live': 'Profil en ligne',
  'Updating visibility…': 'Mise à jour de la visibilité…',
  'Visible to everyone.': 'Visible par tout le monde.',
  'Only you can see this version.': 'Vous seul pouvez voir cette version.',
  'View profile': 'Voir le profil',
  Unpublish: 'Dépublier',
  'Publishing…': 'Publication…',
  'Publish profile': 'Publier le profil',
  'Move your profile back to draft? It will no longer be publicly accessible.':
    'Repasser votre profil en brouillon ? Il ne sera plus accessible publiquement.',
  Saved: 'Enregistré',
  Saving: 'Enregistrement…',
  'Saving…': 'Enregistrement…',
  'Waiting to save': 'Modifications en attente',
  'No blocks added yet.': 'Aucun bloc ajouté.',
  Title: 'Titre',
  Description: 'Description',
  Date: 'Date',
  Countdown: 'Compte à rebours',
  Optional: 'Facultatif',
  'Goal link': 'Lien de l’objectif',
  'Target date': 'Date cible',
  'What are you chasing?': 'Quel est votre objectif ?',
  'Need inspiration?': 'Besoin d’inspiration ?',
  'Hide suggestions': 'Masquer les suggestions',
  'Choose a starting point, then make it yours.':
    'Choisissez un point de départ, puis adaptez-le à votre parcours.',
  'Your motivation': 'Votre motivation',
  Network: 'Réseau',
  'Profile URL': 'URL du profil',
  'Channel handle': 'Identifiant de la chaîne',
  'Athlete ID': 'Identifiant de l’athlète',
  'Email address': 'Adresse e-mail',
  'Phone number': 'Numéro de téléphone',
  'Label (optional)': 'Libellé (facultatif)',
  'Add social link': 'Ajouter un réseau social',
  'Tell the story in a few lines.':
    'Racontez votre histoire en quelques lignes.',
  'Search for a sport…': 'Rechercher un sport…',
  'All sports': 'Tous les sports',
  'Most popular first': 'Les plus populaires en premier',
  'Custom sport': 'Sport personnalisé',
  'Add this sport': 'Ajouter ce sport',
  'Choose an image': 'Choisir une image',
  'Replace image': 'Remplacer l’image',
  Remove: 'Supprimer',
  Type: 'Type',
  Milestone: 'Étape importante',
  Record: 'Record',
  Result: 'Résultat',
  Other: 'Autre',
  'Custom type name': 'Nom du type personnalisé',
  'Make it specific, measurable, and easy to remember.':
    'Rendez-le précis, mesurable et facile à retenir.',
  'Why does this goal matter to you?':
    'Pourquoi cet objectif compte-t-il pour vous ?',
  'Link to a race, fundraiser, event, or more details.':
    'Lien vers une course, une collecte, un événement ou plus de détails.',
  'active objectives': 'objectifs actifs',
  Move: 'Déplacer',
  up: 'vers le haut',
  down: 'vers le bas',
  Image: 'Image',
  'Close block picker': 'Fermer le sélecteur de blocs',
  'Close template gallery': 'Fermer la galerie de modèles',
  'Undo style change': 'Annuler la modification de style',
  'Redo style change': 'Rétablir la modification de style',
  'Preview only on Free.': 'Aperçu uniquement avec le plan gratuit.',
  Custom: 'Personnalisé',
  'Search sports': 'Rechercher des sports',
  'Search results': 'Résultats de recherche',
  sport: 'sport',
  sports: 'sports',
  'Selection limit reached': 'Limite de sélection atteinte',
  'No sport found for': 'Aucun sport trouvé pour',
  'Create it as a new sport': 'Créer ce nouveau sport',
  'Uploading…': 'Import en cours…',
  'Drop the image here': 'Déposez l’image ici',
  'Click or drag and drop · 5 MB max': 'Cliquez ou glissez-déposez · 5 Mo max',
  'This image fills the selected area. Use a clear, high-quality visual.':
    'Cette image remplit la zone sélectionnée. Utilisez un visuel net et de qualité.',
  'Independent from the text colors used on the rest of the page':
    'Indépendant des couleurs de texte utilisées sur le reste de la page',
  'Custom colors are available on Pro. You can still use every quick preset below.':
    'Les couleurs personnalisées sont disponibles avec Pro. Vous pouvez toujours utiliser les préréglages ci-dessous.',
  'Quick presets': 'Préréglages rapides',
  'Custom colors': 'Couleurs personnalisées',
  'soft shadow': 'Ombre douce',
  'solid shadow': 'Ombre pleine',
  grid: 'Grille',
  carousel: 'Carrousel',
  masonry: 'Mosaïque',
  'Pro unlocks every template, font, custom color, decoration, profile picture shape, gallery layout, and solid shadow.':
    'Pro débloque tous les modèles, polices, couleurs personnalisées, décorations, formes de photo, dispositions de galerie et ombres pleines.',
  'Unsaved changes…': 'Modifications non enregistrées…',
  'Save failed. Edit to retry.':
    'Échec de l’enregistrement. Modifiez pour réessayer.',
  Analytics: 'Statistiques',
  'Understand how visitors discover and interact with':
    'Comprenez comment les visiteurs découvrent et utilisent',
  Today: 'Aujourd’hui',
  'This week': 'Cette semaine',
  'This month': 'Ce mois-ci',
  'This year': 'Cette année',
  'Custom range': 'Période personnalisée',
  Daily: 'Quotidien',
  Weekly: 'Hebdomadaire',
  totals: 'totaux',
  uniques: 'uniques',
  'Start date': 'Date de début',
  'End date': 'Date de fin',
  Apply: 'Appliquer',
  'Profile views': 'Vues du profil',
  'Unique visitors': 'Visiteurs uniques',
  'Block clicks': 'Clics sur les blocs',
  'Social clicks': 'Clics sur les réseaux',
  'Click-through rate': 'Taux de clic',
  'Profile views & clicks': 'Vues et clics du profil',
  'Profile views and clicks chart': 'Graphique des vues et clics du profil',
  Export: 'Exporter',
  Audience: 'Audience',
  'Where your visitors come from and how they browse.':
    'Découvrez d’où viennent vos visiteurs et comment ils naviguent.',
  Locations: 'Localisations',
  'Traffic sources': 'Sources de trafic',
  'Top referrers': 'Principaux sites référents',
  Devices: 'Appareils',
  Browsers: 'Navigateurs',
  Campaigns: 'Campagnes',
  'Block interactions': 'Interactions avec les blocs',
  'No data for this range yet.': 'Aucune donnée pour cette période.',
  'No interactions for this range yet.':
    'Aucune interaction pour cette période.',
  'Unlock with Pro': 'Débloquer avec Pro',
  Name: 'Nom',
  Clicks: 'Clics',
  clicks: 'clics',
  'Last activity': 'Dernière activité',
  'See which social profiles receive the most clicks.':
    'Découvrez quels réseaux reçoivent le plus de clics.',
  'Discover the countries and cities your visitors come from.':
    'Découvrez les pays et les villes de vos visiteurs.',
  'Understand which channels bring visitors to your profile.':
    'Identifiez les canaux qui attirent des visiteurs vers votre profil.',
  'See the websites sending the most traffic your way.':
    'Découvrez les sites qui vous apportent le plus de trafic.',
  'Compare visits from mobile, desktop and other devices.':
    'Comparez les visites sur mobile, ordinateur et autres appareils.',
  'Learn which browsers your audience uses.':
    'Découvrez les navigateurs utilisés par votre audience.',
  'Measure traffic generated by your tagged campaigns.':
    'Mesurez le trafic généré par vos campagnes suivies.',
  'Identify the links, offers and content blocks generating the most engagement.':
    'Identifiez les liens, offres et blocs qui génèrent le plus d’engagement.',
  'Public address': 'Adresse publique',
  'Interface language': 'Langue de l’interface',
  'Choose the language used across GRIIT Studio.':
    'Choisissez la langue utilisée dans GRIIT Studio.',
  'Your choice is saved automatically and applies to the dashboard, editor, and marketing pages.':
    'Votre choix est enregistré automatiquement et s’applique au tableau de bord, à l’éditeur et au site public.',
  'The permanent link you share with your audience.':
    'Le lien permanent que vous partagez avec votre audience.',
  'Open profile': 'Ouvrir le profil',
  Username: 'Nom d’utilisateur',
  'Update URL': 'Mettre à jour l’URL',
  'This is your current username.': 'C’est votre nom d’utilisateur actuel.',
  'Use at least 3 characters.': 'Utilisez au moins 3 caractères.',
  'Use 32 characters or fewer.': 'Utilisez 32 caractères maximum.',
  'Use lowercase letters, numbers, or underscores only.':
    'Utilisez uniquement des lettres minuscules, des chiffres ou des tirets bas.',
  'Username is available.': 'Ce nom d’utilisateur est disponible.',
  'Username is already taken.': 'Ce nom d’utilisateur est déjà pris.',
  'Checking availability…': 'Vérification de la disponibilité…',
  'Visibility & discovery': 'Visibilité et découverte',
  'Choose where people can find this profile.':
    'Choisissez où les visiteurs peuvent trouver ce profil.',
  'Anyone with the link can view your public page.':
    'Toute personne disposant du lien peut voir votre page publique.',
  'Show in athlete directory': 'Afficher dans l’annuaire des athlètes',
  'Submit this live page to the GRIIT team. Once approved, it can appear in the athlete directory and sport filters.':
    'Soumettez cette page à l’équipe GRIIT. Après validation, elle pourra apparaître dans l’annuaire et les filtres par sport.',
  'Search engine indexing': 'Indexation par les moteurs de recherche',
  'Allow search engines such as Google to index this page.':
    'Autorisez les moteurs comme Google à indexer cette page.',
  'Saving shortly…': 'Enregistrement imminent…',
  'Changes save automatically':
    'Les modifications sont enregistrées automatiquement',
  'Search & sharing': 'Recherche et partage',
  'Control how your profile appears in search results and shared links.':
    'Contrôlez l’apparence de votre profil dans les résultats et les liens partagés.',
  'Page title': 'Titre de la page',
  'Social sharing image': 'Image de partage social',
  'Link preview': 'Aperçu du lien',
  'Save settings': 'Enregistrer les réglages',
  'Coming soon': 'Bientôt disponible',
  'Custom domain': 'Domaine personnalisé',
  'Connect your own domain while keeping your Griit profile and analytics.':
    'Connectez votre propre domaine tout en conservant votre profil Griit et ses statistiques.',
  'QR code': 'Code QR',
  'Generate a downloadable QR code for events, kits, posters, and social posts.':
    'Générez un code QR téléchargeable pour vos événements, équipements, affiches et publications.',
  'Danger zone': 'Zone sensible',
  'Manage irreversible profile and account deletion actions.':
    'Gérez les actions irréversibles de suppression du profil et du compte.',
  'Delete this profile': 'Supprimer ce profil',
  'Delete profile': 'Supprimer le profil',
  'Delete your entire account': 'Supprimer votre compte entier',
  'Deleting account…': 'Suppression du compte…',
  'Delete my account': 'Supprimer mon compte',
  Monthly: 'Mensuel',
  Annual: 'Annuel',
  'Active plan': 'Plan actif',
  'Annual billing': 'Facturation annuelle',
  'Griit Partner': 'Partenaire Griit',
  'Complimentary Pro access': 'Accès Pro offert',
  'Welcome to the Griit Partner team.':
    'Bienvenue dans la team des partenaires Griit.',
  'Your collaboration includes every Pro feature, offered by Griit.':
    'Votre collaboration inclut toutes les fonctionnalités Pro, offertes par Griit.',
  'Partner access': 'Accès partenaire',
  'Offered by Griit': 'Offert par Griit',
  'Access until': 'Accès jusqu’au',
  'Monthly billing': 'Facturation mensuelle',
  "You're on Griit Pro.": 'Vous profitez de Griit Pro.',
  'Every premium template, design control, advanced insight, and priority support tool is ready for your profiles.':
    'Tous les modèles premium, réglages avancés, statistiques détaillées et le support prioritaire sont disponibles.',
  'Your subscription': 'Votre abonnement',
  'Pro access enabled': 'Accès Pro activé',
  'Your current plan': 'Votre plan actuel',
  Forever: 'Pour toujours',
  Active: 'Actif',
  'A complete public profile with the essentials to start sharing your athlete story.':
    'Un profil public complet avec l’essentiel pour commencer à partager votre parcours.',
  'You can keep using Free for as long as you want.':
    'Vous pouvez continuer à utiliser le plan gratuit aussi longtemps que vous le souhaitez.',
  'Limited launch offer': 'Offre de lancement limitée',
  'Upgrade your profile': 'Améliorez votre profil',
  'Best for growth': 'Pour passer un cap',
  'Build more profiles, unlock every visual option, and understand exactly what turns visitors into opportunities.':
    'Débloquez tous vos outils, publiez davantage et comprenez ce qui transforme votre audience en opportunités.',
  'Flexible monthly billing · cancel anytime':
    'Facturation mensuelle flexible · résiliez à tout moment',
  First: 'Premiers',
  athletes: 'athlètes',
  'Enter at Stripe checkout': 'À saisir lors du paiement Stripe',
  Copied: 'Copié',
  'Copy code': 'Copier le code',
  'Redirecting…': 'Redirection…',
  'Get Pro monthly': 'Passer à Pro mensuel',
  'Secure checkout powered by Stripe': 'Paiement sécurisé par Stripe',
  '1 public profile': '1 profil public',
  'All core blocks and 4 free templates':
    'Tous les blocs essentiels et 4 modèles gratuits',
  'Quick color palettes and core styles':
    'Palettes rapides et styles essentiels',
  'Profile views, visitors, clicks, and CTR':
    'Vues, visiteurs, clics et taux de clic',
  '1 goal and up to 3 gallery images, achievements, and activities':
    '1 objectif et jusqu’à 3 images, réussites et activités',
  'Up to 5 public profiles': 'Jusqu’à 5 profils publics',
  'All 8 templates and 4 typography styles':
    'Les 8 modèles et 4 styles typographiques',
  'Custom colors, shapes, textures, and gallery layouts':
    'Couleurs, formes, textures et galeries personnalisées',
  'Up to 3 goals and 50 gallery, achievement, and activity items':
    'Jusqu’à 3 objectifs et 50 éléments par galerie, réussite et activité',
  'Audience, campaign, social, and block analytics':
    'Statistiques d’audience, campagnes, réseaux et blocs',
  'No Griit branding and priority support':
    'Sans branding Griit et support prioritaire',
  'Custom domain and downloadable QR code — coming soon':
    'Domaine personnalisé et code QR téléchargeable — bientôt disponibles',
  Profiles: 'Profils',
  'Your public profiles': 'Vos profils publics',
  'Manage independent pages for athletes, teams, or projects.':
    'Gérez des pages indépendantes pour des athlètes, équipes ou projets.',
  'New profile': 'Nouveau profil',
  'Profile name': 'Nom du profil',
  'Creating…': 'Création…',
  'Create profile': 'Créer le profil',
  Cancel: 'Annuler',
  Delete: 'Supprimer',
  Manage: 'Gérer',
  'Manage multiple profiles': 'Gérez plusieurs profils',
  'Create and switch between independent public pages with Pro.':
    'Créez et alternez entre plusieurs pages publiques avec Pro.',
  'Multiple profiles are available on Pro':
    'Les profils multiples sont disponibles avec Pro',
  'Your current profile remains fully accessible. Upgrade when you need separate pages for other athletes, teams, or projects.':
    'Votre profil actuel reste entièrement accessible. Passez à Pro lorsque vous avez besoin de pages séparées pour d’autres athlètes, équipes ou projets.',
  'Upgrade to Pro': 'Passer à Pro',
  'Reset your password': 'Réinitialisez votre mot de passe',
  'Enter a new password to complete the reset process.':
    'Saisissez un nouveau mot de passe pour terminer la réinitialisation.',
  'Unable to validate password reset session. Please retry from the email link.':
    'Impossible de valider la session. Réessayez depuis le lien reçu par email.',
  'Password must be at least 8 characters long.':
    'Le mot de passe doit contenir au moins 8 caractères.',
  'Passwords do not match.': 'Les mots de passe ne correspondent pas.',
  'Updating password...': 'Mise à jour du mot de passe…',
  'Unable to update password.': 'Impossible de mettre à jour le mot de passe.',
  'Password updated successfully. Redirecting to your dashboard...':
    'Mot de passe mis à jour. Redirection vers votre tableau de bord…',
  'Failed to validate the reset session. Please return to the link in your email or request a new reset.':
    'Le lien de réinitialisation n’est plus valide. Utilisez le lien reçu par email ou demandez-en un nouveau.',
  'Validating reset link...': 'Validation du lien…',
  'Request a new reset link': 'Demander un nouveau lien',
  'Continue to dashboard': 'Accéder au tableau de bord',
  'New password': 'Nouveau mot de passe',
  'Confirm password': 'Confirmer le mot de passe',
  'Updating password…': 'Mise à jour…',
  'Update password': 'Mettre à jour le mot de passe',
  Oops: 'Oups',
  'Something went wrong.': 'Une erreur est survenue.',
  'A problem occurred while loading this page.':
    'Un problème est survenu pendant le chargement de cette page.',
  'Try again': 'Réessayer',
  'Public profile': 'Profil public',
  Published: 'Publié',
  'Ready to share anywhere.': 'Prêt à être partagé partout.',
  'Publish your profile when you are ready to share it.':
    'Publiez votre profil lorsque vous êtes prêt à le partager.',
  'Copy URL': 'Copier l’URL',
  Open: 'Ouvrir',
  'Athlete directory': 'Annuaire des athlètes',
  'Approved for the athlete directory': 'Validé pour l’annuaire des athlètes',
  'A few updates are needed': 'Quelques ajustements sont nécessaires',
  'Your profile is being reviewed': 'Votre profil est en cours de vérification',
  'Athlete directory is disabled': 'L’affichage dans l’annuaire est désactivé',
  'Ready to request a review': 'Prêt à être envoyé pour vérification',
  'Publish your profile when it is ready':
    'Publiez votre profil lorsqu’il est prêt',
  'Your profile can now appear on the Athletes page and in its sport filters. You stay in control and can remove it from the directory at any time from Settings.':
    'Votre profil peut maintenant apparaître sur la page Athlètes et dans les filtres par sport. Vous gardez le contrôle et pouvez le retirer de l’annuaire à tout moment depuis les paramètres.',
  'Update your profile, then send it back when it is ready.':
    'Mettez votre profil à jour, puis renvoyez-le lorsqu’il est prêt.',
  'The GRIIT team will check that it is complete and compliant before adding it to the Athletes page. Your public page remains live during the review.':
    'L’équipe GRIIT vérifie que votre profil est complet et conforme avant de l’ajouter à la page Athlètes. Votre page publique reste en ligne pendant cette vérification.',
  'Enable “Show in athlete directory” in Settings to submit this profile.':
    'Activez « Afficher dans l’annuaire des athlètes » dans les paramètres pour envoyer ce profil.',
  'Send this live profile to the GRIIT team for directory approval.':
    'Envoyez ce profil en ligne à l’équipe GRIIT pour vérification.',
  'Once it is Live and directory discovery is enabled, it will be sent to the GRIIT team for approval.':
    'Lorsqu’il sera en ligne et visible dans l’annuaire, il pourra être envoyé à l’équipe GRIIT pour vérification.',
  'Send updated profile': 'Renvoyer le profil mis à jour',
  'Send for review': 'Envoyer pour vérification',
  'Open visibility settings': 'Ouvrir les paramètres de visibilité',
  'Profile not found or no analytics are available yet.':
    'Profil introuvable ou aucune statistique n’est encore disponible.',
  Free: 'Gratuit',
  Teams: 'Équipes',
  'Custom pricing': 'Sur mesure',
  'Publish a complete athlete profile with every core tool.':
    'Publiez un profil sportif complet avec tous les outils essentiels.',
  'Unlock every design option, deeper analytics, and more profiles.':
    'Débloquez toutes les options de design, des analytics détaillées et davantage de profils.',
  'A shared workspace for clubs, academies, agencies, and athlete managers.':
    'Un espace partagé pour les clubs, académies, agences et managers d’athlètes.',
  'A tailored number of athlete profiles':
    'Un nombre de profils sportifs adapté à votre structure',
  'Multiple workspace members with roles and permissions':
    'Plusieurs membres avec des rôles et permissions dédiés',
  'Shared templates, branding, and media resources':
    'Templates, identité visuelle et médias partagés',
  'Organization-wide analytics and exports':
    'Analytics et exports à l’échelle de votre organisation',
  'Centralized profile management and billing':
    'Gestion des profils et facturation centralisées',
  'Guided onboarding and dedicated priority support':
    'Onboarding accompagné et support prioritaire dédié',
  'Start your profile': 'Prenez le départ',
  'Unlock your full toolkit': 'Passez un cap',
  'Manage your roster': 'Pilotez votre roster',
  'Everything you need to publish a complete athlete profile and start sharing your story.':
    'Tout ce qu’il faut pour publier un profil solide et commencer à partager votre progression.',
  'For athletes, coaches, teams, and creators who need more profiles, content, and insight.':
    'Pour les athlètes, coachs et créateurs qui veulent plus de profils, plus de contenu et des analytics détaillées.',
  'For clubs, academies, agencies, and managers who need one shared athlete workspace.':
    'Pour les clubs, académies, agences et managers qui veulent piloter leur roster depuis un espace partagé.',
  '1 complete public profile': '1 profil public complet',
  'Every core content and partnership block':
    'Tous les blocs essentiels de contenu et de partenariat',
  '4 free templates and all quick color palettes':
    '4 templates Free et toutes les palettes rapides',
  '1 goal plus 3 gallery images, achievements, and activities':
    '1 objectif, plus 3 images, réussites et activités',
  'Views, visitors, clicks, and click-through rate':
    'Vues, visiteurs, clics et taux de clic',
  'Up to 5 independent public profiles':
    'Jusqu’à 5 profils publics indépendants',
  'All 8 templates and all 4 typography styles':
    'Les 8 templates et les 4 styles typographiques',
  'Custom colors, advanced shapes, textures, and shadows':
    'Couleurs personnalisées, formes avancées, textures et ombres',
  'Reserved for the first': 'Réservée aux',
  'Copied to clipboard': 'Copié dans le presse-papiers',
  'Copy for Stripe checkout': 'Copier pour le paiement Stripe',
  'Pro Annual for': 'Pro Annual à',
  'the annual plan and': 'sur le forfait annuel, soit',
  'less than 12 months of Pro Monthly':
    'd’économies par rapport à 12 mois de Pro mensuel',
  'Annual Pro:': 'Pro Annual :',
  'with code': 'avec le code',
  'for the first year': 'pour la première année',
  'per month': 'par mois',
  'tailored to your organization': 'adapté à votre organisation',
  forever: 'pour toujours',
  'Launch offer': 'Offre de lancement',
  Save: 'Économisez',
  'compared with 12 months of Pro Monthly':
    'par rapport à 12 mois de Pro mensuel',
  first: 'offre réservée aux',
  'vs 12 months of Pro Monthly': 'par rapport à 12 mois de Pro mensuel',
  '$60 over 12 months. Switch to Annual to save.':
    '60 $ sur 12 mois. Passez à l’abonnement annuel pour économiser.',
  'vs Pro Monthly': 'par rapport à Pro mensuel',
  '40% less than paying monthly for 12 months. Use':
    '40 % de moins que 12 mensualités. Utilisez',
  'at checkout.': 'lors du paiement.',
  'Flexible monthly billing. Cancel anytime.':
    'Facturation mensuelle flexible. Résiliez à tout moment.',
  'Talk to our team': 'Parler à notre équipe',
  'Claim launch offer': 'Profiter de l’offre de lancement',
  'Choose monthly Pro': 'Choisir Pro mensuel',
  'Open dashboard': 'Ouvrir le tableau de bord',
  'Start and claim offer': 'Commencer et profiter de l’offre',
  'Start and upgrade': 'Commencer avec Pro',
  'Build for free': 'Prendre le départ gratuitement',
  'Flexible monthly': 'Mensuel flexible',
  Organizations: 'Organisations',
  'first year': 'la première année',
  'Talk to us': 'Nous contacter',
  'Product or affiliate URL': 'URL du produit ou lien affilié',
  'Add a product URL first.': 'Ajoutez d’abord l’URL d’un produit.',
  'Unable to preview this link.': 'Impossible de générer l’aperçu de ce lien.',
  'Preview loaded. You can edit every field below.':
    'Aperçu chargé. Vous pouvez modifier tous les champs ci-dessous.',
  'Product preview': 'Aperçu du produit',
  'Product image': 'Image du produit',
  'The preview image is copied to your Supabase storage. You can replace it here.':
    'L’image d’aperçu est copiée dans votre stockage Supabase. Vous pouvez la remplacer ici.',
  'Display size': 'Taille d’affichage',
  small: 'petit',
  medium: 'moyen',
  large: 'grand',
  'Description (optional)': 'Description (facultative)',
  'Promo code (optional)': 'Code promo (facultatif)',
  'Button label': 'Libellé du bouton',
  'Promo text (optional)': 'Texte promotionnel (facultatif)',
  'Get 10% off with my code': 'Profitez de 10 % de réduction avec mon code',
  'Displays a transparent affiliate disclosure on the card.':
    'Affiche clairement une mention de lien affilié sur la carte.',
  'National selection, comeback...':
    'Sélection nationale, retour à la compétition…',
  'Run 10K under 40 minutes': 'Courir un 10 km en moins de 40 minutes',
  'Date display': 'Affichage de la date',
  Achievement: 'Réussite',
  'Bangkok Marathon finisher': 'Finisher du marathon de Bangkok',
  '2:58:42, 1st place, Qualified...':
    '2 h 58 min 42 s, 1re place, qualification…',
  'Add more details': 'Ajouter plus de détails',
  'Event or organization': 'Événement ou organisation',
  'Tell people what this milestone means to you.':
    'Expliquez ce que cette étape représente pour vous.',
  'Achievement image': 'Image de la réussite',
  'Result link': 'Lien vers le résultat',
  'View result': 'Voir le résultat',
  'Add achievement': 'Ajouter une réussite',
  'Add more achievements': 'Ajouter d’autres réussites',
  'Partnership status': 'Statut des partenariats',
  'Choose what brands and visitors should see.':
    'Choisissez ce que les marques et les visiteurs peuvent voir.',
  'Current sponsors': 'Sponsors actuels',
  'Add a logo and an optional link for each partner.':
    'Ajoutez un logo et, si besoin, un lien pour chaque partenaire.',
  'Sponsor name': 'Nom du sponsor',
  'Sponsor logo': 'Logo du sponsor',
  'Website URL': 'URL du site',
  'Add sponsor': 'Ajouter un sponsor',
  'Partnership callout': 'Appel aux partenariats',
  'Turn profile visitors into real opportunities.':
    'Transformez les visites de votre profil en opportunités concrètes.',
  Headline: 'Accroche',
  'Open to partnerships': 'Ouvert aux partenariats',
  'Available for brand collaborations, events and ambassador opportunities.':
    'Disponible pour des collaborations avec des marques, des événements et des programmes ambassadeurs.',
  'Contact email or URL': 'Email ou URL de contact',
  "Let's work together": 'Travaillons ensemble',
  'Video URL': 'URL de la vidéo',
  'Caption (optional)': 'Légende (facultative)',
  'Add context about this video.': 'Ajoutez du contexte à cette vidéo.',
  'Supports YouTube, Vimeo, and TikTok video links.':
    'Compatible avec les liens vidéo YouTube, Vimeo et TikTok.',
  'Link image (optional)': 'Image du lien (facultative)',
  'Optional image displayed as a thumbnail in the link card.':
    'Image facultative affichée en miniature dans la carte du lien.',
  'Title (optional)': 'Titre (facultatif)',
  'Discover my next event': 'Découvrez mon prochain événement',
  'Add a little context about this link.':
    'Ajoutez quelques précisions sur ce lien.',
  Activity: 'Activité',
  'Activity type': 'Type d’activité',
  'Sunday long run': 'Sortie longue du dimanche',
  Running: 'Course à pied',
  'Add activity': 'Ajouter une activité',
  'Add more activities': 'Ajouter d’autres activités',
  'Bangkok, Thailand': 'Bangkok, Thaïlande',
  'The annual Stripe price is not configured yet.':
    'Le tarif annuel Stripe n’est pas encore configuré.',
  'Unable to parse server response.':
    'Impossible de lire la réponse du serveur.',
  'Unable to start checkout.': 'Impossible de lancer le paiement.',
  'year one': 'la première année',
  'Date range': 'Période',
  Grouping: 'Regroupement',
  'This cancels your active subscription and permanently removes every profile, block, uploaded image, and analytics event linked to your account. This cannot be undone.':
    'Cette action annule votre abonnement actif et supprime définitivement tous les profils, blocs, images importées et événements statistiques liés à votre compte. Elle est irréversible.',
  'Type the phrase below to confirm:':
    'Saisissez la phrase suivante pour confirmer :',
  Approved: 'Validé',
  'Updates needed': 'Ajustements nécessaires',
  'Awaiting review': 'En attente de vérification',
  'Discovery enabled': 'Annuaire activé',
  'Discovery disabled': 'Annuaire désactivé',
  Submitted: 'Envoyé le',
  'Open public profile': 'Ouvrir le profil public',
  'Feedback if changes are required':
    'Commentaire si des ajustements sont nécessaires',
  'Explain what should be updated before another review.':
    'Expliquez ce qui doit être modifié avant une nouvelle vérification.',
  Approve: 'Valider',
  'Request changes': 'Demander des ajustements',
  'Profile preview screenshot': 'Screenshot du profil',
  'Upload the screenshot used on the homepage, inspiration page, and athlete directory.':
    'Importez le screenshot utilisé sur l’accueil, la page Inspiration et l’annuaire des athlètes.',
  'Save preview image': 'Enregistrer l’aperçu',
  'Supported by': 'Soutenu par',
  Visit: 'Visiter',
  'Partnership opportunities': 'Opportunités de partenariat',
  'Open on': 'Ouvrir sur',
  'View offer': 'Voir l’offre',
  'gallery image': 'image de la galerie',
  'Image preview': 'Aperçu de l’image',
  'Close image preview': 'Fermer l’aperçu',
  'Previous image': 'Image précédente',
  'Next image': 'Image suivante',
  'Create your athlete profile with Griit':
    'Créez votre profil d’athlète avec Griit',
  'Made with': 'Créé avec',
  'Copy promo code': 'Copier le code promo',
  Copy: 'Copier',
  'Affiliate link': 'Lien affilié',
  'Add image': 'Ajouter une image',
  'Add more images': 'Ajouter d’autres images',
  'I have sponsors': 'J’ai des sponsors',
  'Show the partners already supporting you.':
    'Affichez les partenaires qui vous soutiennent déjà.',
  "I'm open to partnerships": 'Je suis ouvert aux partenariats',
  'Let brands know you are available.':
    'Indiquez aux marques que vous êtes disponible.',
  Both: 'Les deux',
  'Show your sponsors and welcome new opportunities.':
    'Affichez vos sponsors tout en accueillant de nouvelles opportunités.',
  Sponsor: 'Sponsor',
  'Header background type': 'Type d’arrière-plan de l’en-tête',
  'Choose the overlay color and its intensity for readable text.':
    'Choisissez la couleur du voile et son intensité pour garder le texte lisible.',
  'Photo overlay color': 'Couleur du voile de la photo',
  'Photo overlay intensity': 'Intensité du voile de la photo',
  'Header background color': 'Couleur d’arrière-plan de l’en-tête',
  'Transition color covers': 'La couleur de transition couvre',
  'of the header': 'de l’en-tête',
  'This is separate from photo darkness. It controls the color at the bottom of the header.':
    'Ce réglage est indépendant de l’assombrissement de la photo et contrôle la couleur en bas de l’en-tête.',
  'Header transition color coverage':
    'Couverture de la couleur de transition de l’en-tête',
  'Add depth behind the profile content.':
    'Ajoutez de la profondeur derrière le contenu du profil.',
  'Billing frequency': 'Fréquence de facturation',
  Launch: 'Lancement',
  of: 'sur',
  'profiles used': 'profils utilisés',
  'Athlete name': 'Nom de l’athlète',
  'Open public page': 'Ouvrir la page publique',
  'permanently?': 'définitivement ?',
  'This removes only': 'Cette action supprime uniquement',
  'and its content. Your account and other profiles remain available.':
    'et son contenu. Votre compte et vos autres profils restent disponibles.',
  'Type the value below to confirm:':
    'Saisissez la valeur suivante pour confirmer :',
};

export function useUiCopy() {
  const { locale } = useI18n();

  return useCallback(
    (value: string) =>
      locale === 'fr' ? (frenchUiCopy[value] ?? value) : value,
    [locale],
  );
}
