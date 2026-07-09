# Billing & Subscription

Griit uses Stripe for subscription management.

The application has two plans:

- Free
- Pro

The billing system must be designed to support future plans without requiring major architectural changes.

---

## Free Plan

The free plan allows users to create a basic athlete profile.

Features:

- 1 public profile
- Basic profile customization
- Basic theme
- Limited blocks
- Manual achievements
- Manual activities
- Gallery (limited)
- Social links
- Basic analytics

---

## Pro Plan

The Pro plan unlocks all premium features.

Features:

- Unlimited customization
- Premium themes
- Premium templates
- Unlimited gallery
- Unlimited blocks
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
