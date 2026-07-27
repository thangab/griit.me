import 'server-only';

type TransactionalEmail = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

const resendEndpoint = 'https://api.resend.com/emails';

export function isTransactionalEmailConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);
}

export async function sendTransactionalEmail(email: TransactionalEmail) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    throw new Error(
      'Transactional email is not configured. Add RESEND_API_KEY and EMAIL_FROM.',
    );
  }

  const response = await fetch(resendEndpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [email.to],
      subject: email.subject,
      html: email.html,
      text: email.text,
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(
      `Transactional email failed (${response.status}): ${details}`,
    );
  }
}
