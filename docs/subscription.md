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
- Basic profile customization
- Basic theme
- Limited blocks
- Manual achievements
- Manual activities
- Gallery (limited)
- Social links
- Sponsors and "Open to partnerships" block
- Basic analytics

---

## Pro Plan

The Pro plan unlocks all premium features.

Features:

- Up to 5 independent public profiles per account
- Profile management and switching
- Unlimited customization
- Premium themes
- Premium templates
- Unlimited gallery
- Unlimited blocks
- Future advanced sponsorship tools and partnership analytics
- Advanced analytics
- Custom domain
- Remove Griit branding
- Priority support
- Future integrations:
  - Strava
  - Garmin
  - COROS
  - Polar
  - Apple Health

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
