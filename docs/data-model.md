# Data Model

Griit starts with one public athlete profile per user.

The schema is designed so the MVP stays simple while future multi-page profiles,
templates, integrations and richer analytics can be added without replacing the
core model.

## Core Tables

- `profiles`: private account profile synced from Supabase Auth.
- `public_profiles`: public athlete identity and top-level theme state.
  `theme.templateId` selects the public profile template and
  `theme.coverImageUrl` stores its cover visual. Future visual settings such as
  colors and typography also live in this JSON object through `colorPreset`,
  `fontPreset`, `coverOverlay`, `radiusPreset` and `galleryLayout`.
- `profile_pages`: pages under a public profile. MVP uses `home`; future plans
  can add more pages.
- `profile_blocks`: ordered content blocks on a page.
- `profile_social_links`: ordered external links and social accounts.
- `sports`: global sport catalog used by the builder and discovery surfaces.
- `profile_sports`: ordered join table linking public profiles to one or more
  sports. This powers future sport-based profile discovery.
- `profile_gallery_items`: profile media gallery.
- `profile_achievements`: manual achievements, races, milestones or titles.
- `profile_activities`: manual activity feed, later usable by integrations.
- `profile_goals`: active or planned athlete objectives with optional target
  dates and status.

## Billing Tables

- `stripe_customers`: one Stripe customer per user.
- `subscriptions`: one current subscription state per user.

Stripe remains the billing source of truth. The app stores the current
subscription snapshot for server-side gating and dashboard display.

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
