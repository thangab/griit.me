# Billing & Subscription

Griit uses Stripe for subscription management.

The application has two plans:

- Free
- Pro

The billing system must be designed to support future plans without requiring major architectural changes.

---

## Free Plan

The free plan allows users to create one complete athlete profile. The
dashboard opens directly on that profile, without requiring profile selection.

Features:

- 1 public profile
- All core block types, including links, offers, media, galleries, achievements,
  activities, sponsors, and partnerships
- 4 free templates: Spotlight, Momentum, Midnight, and Evergreen
- Clean typography, every quick color palette, and core design controls
- Core header decorations: no decoration or Velocity geometry, and no texture
  or Grid texture
- Circle and hexagon profile picture shapes
- Grid gallery layout and soft block shadows
- 1 active goal
- Up to 3 gallery images, 3 achievements, and 3 activities
- Essential analytics: profile views, unique visitors, block clicks, social
  clicks, and click-through rate

---

## Pro Plan

The Pro plan unlocks all premium features.

Features:

- Up to 5 independent public profiles per account
- Profile management and switching
- All 8 templates, including Impact, Obsidian, Pulse, and Horizon
- All typography styles: Clean, Athletic, Editorial, and Technical
- Custom colors for every profile element
- All header geometries and textures
- All profile picture shapes, including Diamond and Shield
- Editorial and carousel gallery layouts
- Custom block border colors and solid block shadows
- Up to 3 active goals
- Up to 50 gallery images, 50 achievements, and 50 activities per profile
- Advanced analytics for locations, traffic sources, referrers, devices,
  browsers, campaigns, social clicks, and block interactions
- No Griit branding on profile previews or public pages
- Priority support

Coming soon features must not be advertised as currently included:

- Custom domains (planned for Pro)
- Downloadable QR codes
- Advanced sponsorship tools and partnership analytics
- Strava, Garmin, COROS, Polar, and Apple Health integrations

The architecture should make it easy to add more premium features later.

### Multiple profile rules

- Free accounts can create and manage exactly 1 public profile.
- Pro accounts can create and manage up to 5 public profiles.
- Each profile owns its own username, content, design, publication state, and
  analytics.
- The profile limit is enforced by server actions, not only by the interface.
- Free users can open the Profiles area to discover the feature, but they see
  an upgrade screen after their first profile has been created.
- If an account has no profile yet, it can always create its first one.

---

## Stripe

Use Stripe Checkout.

Do not build a custom payment form.

Subscription flow:

User clicks "Upgrade"

↓

Redirect to Stripe Checkout

↓

Successful payment

↓

Stripe Webhook

↓

Update subscription inside Supabase

↓

Unlock Pro features

---

## Subscription Status

A user can have one of the following states:

- free
- pro
- cancelled
- past_due

Never rely only on the client.

Subscription status must always be verified on the server.

---

## Feature Gating

Premium features must be protected server-side.

The UI may display upgrade prompts, but permissions must never rely only on frontend checks.

---

## Future

The architecture should support:

- Monthly billing
- Yearly billing
- Promo codes
- Free trial
- Team accounts
- Gift subscriptions
- Enterprise plans

Do not implement these features yet.

Only prepare a scalable billing architecture.
