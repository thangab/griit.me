# Data Model

Griit lets one account manage several independent public profiles: one on the
Free plan and up to five on Pro.

The schema is designed so the MVP stays simple while future multi-page profiles,
templates, integrations and richer analytics can be added without replacing the
core model.

## Core Tables

- `profiles`: private account profile synced from Supabase Auth.
- `public_profiles`: independent public identities owned by an account. Each
  profile has its own username, content, theme, publication state and analytics.
  `theme.templateId` selects the public profile template and
  `theme.coverImageUrl` stores its cover visual. Future visual settings such as
  colors and typography also live in this JSON object through `colorPreset`,
  `customColors` (page and block backgrounds, page text, block titles,
  descriptions, accent background/text, social background/text and header
  text),
  `fontPreset`, `coverType`, `coverColor`, `coverGradientFrom`,
  `coverGradientTo`, `coverOverlay`, `radiusPreset` and `galleryLayout`.
- `profile_blocks`: ordered content blocks belonging directly to a public
  profile. One public profile represents one public page.
- `profile_social_links`: ordered external links and social accounts.
- `sports`: global sport catalog used by the builder and discovery surfaces.
- `profile_sports`: ordered join table linking public profiles to one or more
  sports. This powers future sport-based profile discovery.
- `profile_gallery_items`: profile media gallery.
- `profile_sponsors`: ordered sponsors with a name, logo and optional website.
  Partnership status and CTA content live in the related `sponsors`
  `profile_blocks.content` JSON object.
- `profile_achievements`: manual achievements, races, milestones or titles.
- `profile_activities`: manual activity feed, later usable by integrations.
- `profile_goals`: active or planned athlete objectives with optional target
  dates and status.

## Billing Tables

- `stripe_customers`: one Stripe customer per user.
- `subscriptions`: one current subscription state per user.

Stripe remains the billing source of truth. The app stores the current
subscription snapshot for server-side gating and dashboard display.

## Profile limits and dashboard routing

- Free accounts own at most 1 `public_profiles` row.
- Active Pro accounts own at most 5 `public_profiles` rows.
- `/dashboard` resolves to the account's most recently updated profile.
- `/dashboard/profiles` provides the Pro profile manager. On Free, it displays
  the upgrade state after the first profile exists.
- Profile-scoped dashboard routes use
  `/dashboard/profiles/[profileId]/...` and verify ownership on the server.
- The profile creation action enforces the plan limit before inserting a new
  row.

## Access Rules

All profile builder tables use RLS.

Owners can read and write their own profile builder data. Published/enabled data
can be selected publicly so public profile pages can render without service-role
access.

## Templates

Profile templates are registered in code and selected through
`public_profiles.theme.templateId`.

The default template is `goal_spotlight`. Premium templates can be marked as
Pro-only and must be gated on the server before writing the selected template to
the profile theme JSON.
