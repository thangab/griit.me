# Acquisition and signup tracking

Use this format for the Instagram bio link (replace `your-username`):

```
https://griit.me/your-username?utm_source=instagram&utm_medium=social&utm_campaign=bio
```

The public-profile dashboard measures profile visits and content interactions separately from Google Analytics. It does not currently show the marketing conversion funnel.

Google Analytics requires a valid `NEXT_PUBLIC_GA_MEASUREMENT_ID` and accepted analytics consent. No marketing attribution is saved before consent. Refusal, browser blocking, and visits before deployment mean these reports do not cover every visitor.

## Events

| Event                  | Meaning                                                                                                              |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `public_profile_view`  | Public profile displayed outside editor preview; includes profile username and partner status.                       |
| `marketing_cta_click`  | Click on a tagged button; includes `cta`, `source`, and referring `profile` when available.                          |
| `marketing_page_view`  | A measured route view, including public profiles, marketing, auth, and dashboard routes; filter by `page_path`.      |
| `signup_view`          | Signup form viewed. If consent is accepted on this page, the view is sent after initialization.                      |
| `signup_submit`        | Email signup submitted or Google authentication launched. This is not proof of a new account.                        |
| `onboarding_started`   | Authenticated visitor without an existing profile reached profile setup. This is not an exact count of new accounts. |
| `onboarding_step_view` | A profile setup step viewed.                                                                                         |
| `profile_created`      | Profile creation action succeeded.                                                                                   |
| `profile_published`    | Profile publishing action succeeded.                                                                                 |

The current page's view can be measured after consent; earlier clicks are not replayed. Campaign values and referring profile context are retained in session storage in the same tab after consent. Separate tabs, devices, or an email confirmation opened elsewhere may lose this context.

## Reports to create in GA4

Register event-scoped custom dimensions for `cta`, `source`, `profile`, `page_path`, and `step` as needed. Campaign context is also attached to custom events as `utm_source`, `utm_medium`, and `utm_campaign`; register these if reporting on the event parameters rather than GA's built-in acquisition dimensions.

1. Path exploration starting at `public_profile_view`: see whether visitors open `/`, `/inspiration`, `/pricing`, or `/sign-up`.
2. Direct funnel: `public_profile_view` → signup CTA click → `signup_view` → `signup_submit` → `onboarding_started` → `profile_created` → `profile_published`.
3. Discovery funnel: `public_profile_view` → `marketing_cta_click` with `cta=discover_griit` → `marketing_page_view` with `page_path=/` → `signup_view` → `profile_created` → `profile_published`.

Compare users completing steps in sequence, not raw event totals. A user can click or revisit a step more than once. Mark `profile_created` and `profile_published` as key events if those are the activation outcomes you want to optimize.

Configuration in GA4 is an account-side step; changing the application does not create these reports or custom dimensions automatically. No historical missing events can be reconstructed.

## Validation

```
node --test tests/marketing-funnel.test.mjs
npm run typecheck
npm run lint
```
