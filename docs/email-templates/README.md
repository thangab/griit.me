# Griit email templates

These standalone templates are designed for the hosted Supabase Auth email
editor. Copy the subject and the complete HTML file into:

`Supabase Dashboard > Authentication > Email Templates`

## Authentication emails

| Supabase template | Subject | HTML file |
| --- | --- | --- |
| Confirm sign up | `Confirm your email — start building your Griit profile` | `confirm-sign-up.html` |
| Reset password | `Reset your Griit password` | `reset-password.html` |
| Magic link | `Your secure Griit sign-in link` | `magic-link.html` |
| Invite user | `You’re invited to Griit` | `invite-user.html` |
| Change email address | `Confirm your new Griit email` | `change-email.html` |
| Reauthentication | `{{ .Token }} is your Griit verification code` | `reauthentication.html` |

## Required configuration

- Set the Supabase **Site URL** to `https://griit.me` in production.
- Allow `https://griit.me/auth/callback` in the redirect URL list.
- Keep email-provider click tracking disabled. Link rewriting can break Supabase
  authentication links.
- Test every template in both desktop and mobile email clients before launch.

The templates use Supabase’s supported Go template variables, notably
`{{ .ConfirmationURL }}`, `{{ .Token }}`, `{{ .Email }}`, and
`{{ .NewEmail }}`.

