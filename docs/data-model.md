# Data Model

Griit starts with one public athlete profile per user.

The schema is designed so the MVP stays simple while future multi-page profiles,
templates, integrations and richer analytics can be added without replacing the
core model.

## Core Tables

- `profiles`: private account profile synced from Supabase Auth.
- `public_profiles`: public athlete identity and top-level theme state.
- `profile_pages`: pages under a public profile. MVP uses `home`; future plans
  can add more pages.
- `profile_blocks`: ordered content blocks on a page.
- `profile_social_links`: ordered external links and social accounts.
- `profile_gallery_items`: profile media gallery.
- `profile_achievements`: manual achievements, races, milestones or titles.
- `profile_activities`: manual activity feed, later usable by integrations.

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
