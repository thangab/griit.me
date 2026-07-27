import 'server-only';

import { sendTransactionalEmail } from '@/lib/services/transactional-email';
import type { BillingInterval } from '@/lib/types/billing';

type ProWelcomeEmailProps = {
  email: string;
  displayName?: string | null;
  billingInterval: BillingInterval;
};

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export async function sendProWelcomeEmail({
  email,
  displayName,
  billingInterval,
}: ProWelcomeEmailProps) {
  const appUrl = (
    process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  ).replace(/\/$/, '');
  const dashboardUrl = `${appUrl}/dashboard`;
  const subscribeUrl = `${appUrl}/dashboard/subscribe`;
  const safeName = displayName?.trim() ? escapeHtml(displayName.trim()) : null;
  const greeting = safeName ? `Hey ${safeName},` : 'Hey athlete,';
  const intervalLabel = billingInterval === 'year' ? 'Annual' : 'Monthly';

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Welcome to GRIIT Pro</title>
  </head>
  <body style="margin:0;background:#f4f5f7;color:#151515;font-family:Arial,Helvetica,sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">Your GRIIT Pro features are now unlocked.</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f5f7;padding:28px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;overflow:hidden;border:1px solid #e1e4ea;border-radius:28px;background:#ffffff;">
            <tr>
              <td style="padding:24px 30px;border-bottom:1px solid #eceef2;">
                <span style="font-size:21px;font-weight:900;letter-spacing:-0.8px;">GRIIT<span style="color:#3157ff;">.</span></span>
              </td>
            </tr>
            <tr>
              <td style="padding:42px 30px 22px;">
                <span style="display:inline-block;border-radius:999px;background:#e8edff;color:#3157ff;padding:8px 12px;font-size:11px;font-weight:800;letter-spacing:1.4px;text-transform:uppercase;">Pro activated</span>
                <h1 style="margin:22px 0 14px;font-size:40px;line-height:1.02;letter-spacing:-1.8px;">Your next level<br />starts now.</h1>
                <p style="margin:0;color:#596173;font-size:16px;line-height:1.7;">${greeting}</p>
                <p style="margin:8px 0 0;color:#596173;font-size:16px;line-height:1.7;">Your GRIIT Pro ${intervalLabel} plan is active. Your public profile now has everything it needs to match the ambition behind it.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 30px 28px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-radius:20px;background:#151515;color:#ffffff;">
                  <tr><td style="padding:24px 24px 10px;font-size:13px;font-weight:800;letter-spacing:1.2px;text-transform:uppercase;color:#a9ed35;">Now unlocked</td></tr>
                  <tr><td style="padding:7px 24px;font-size:15px;line-height:1.5;"><span style="color:#a9ed35;font-weight:900;">✓</span>&nbsp;&nbsp;Every template, font and advanced style</td></tr>
                  <tr><td style="padding:7px 24px;font-size:15px;line-height:1.5;"><span style="color:#a9ed35;font-weight:900;">✓</span>&nbsp;&nbsp;Unlimited profile blocks and goals</td></tr>
                  <tr><td style="padding:7px 24px;font-size:15px;line-height:1.5;"><span style="color:#a9ed35;font-weight:900;">✓</span>&nbsp;&nbsp;Advanced analytics and audience insights</td></tr>
                  <tr><td style="padding:7px 24px 24px;font-size:15px;line-height:1.5;"><span style="color:#a9ed35;font-weight:900;">✓</span>&nbsp;&nbsp;Multiple athlete profiles and priority support</td></tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:0 30px 38px;">
                <a href="${dashboardUrl}" style="display:block;border-radius:999px;background:#3157ff;color:#ffffff;padding:16px 24px;text-align:center;font-size:15px;font-weight:800;text-decoration:none;">Customize my profile →</a>
                <p style="margin:18px 0 0;text-align:center;color:#8a91a0;font-size:12px;line-height:1.6;">You can view or manage your subscription anytime from <a href="${subscribeUrl}" style="color:#596173;">your dashboard</a>.</p>
              </td>
            </tr>
          </table>
          <p style="margin:18px 0 0;color:#949aa6;font-size:11px;">Built for the work behind the result. © GRIIT</p>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const text = `${greeting}

Your GRIIT Pro ${intervalLabel} plan is active.

Now unlocked:
- Every template, font and advanced style
- Unlimited profile blocks and goals
- Advanced analytics and audience insights
- Multiple athlete profiles and priority support

Customize your profile: ${dashboardUrl}
Manage your subscription: ${subscribeUrl}

Built for the work behind the result. — GRIIT`;

  await sendTransactionalEmail({
    to: email,
    subject: 'You’re Pro — your next level starts now',
    html,
    text,
  });
}
