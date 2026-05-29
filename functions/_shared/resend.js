// functions/_shared/resend.js
const RESEND_API = 'https://api.resend.com';

export async function sendEmail(apiKey, { from, to, subject, html, attachments }) {
  const res = await fetch(`${RESEND_API}/emails`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      ...(attachments?.length ? { attachments } : {}),
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Resend ${res.status}: ${body}`);
  }
  return res.json();
}

export async function addAudienceContact(apiKey, audienceId, email) {
  const res = await fetch(`${RESEND_API}/audiences/${audienceId}/contacts`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, unsubscribed: false }),
  });
  // 409 = contact already exists — not an error
  if (!res.ok && res.status !== 409) {
    const body = await res.text();
    throw new Error(`Resend audience ${res.status}: ${body}`);
  }
}
