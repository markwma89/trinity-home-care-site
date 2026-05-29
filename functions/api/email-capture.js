// functions/api/email-capture.js
import { sendEmail, addAudienceContact } from '../_shared/resend.js';

const FROM    = 'forms@forms.trinityhomecarellc.com';
const HEADERS = { 'Content-Type': 'application/json' };

export async function onRequestPost(context) {
  const { request, env } = context;
  const { RESEND_API_KEY, RESEND_AUDIENCE_ID } = env;

  if (!RESEND_API_KEY || !RESEND_AUDIENCE_ID) {
    console.error('[email-capture] Missing RESEND_API_KEY or RESEND_AUDIENCE_ID');
    return json({ error: 'Server misconfigured' }, 500);
  }

  let body;
  try { body = await request.json(); } catch {
    return json({ error: 'Invalid request' }, 400);
  }

  const email = (body?.email ?? '').trim();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: 'Invalid email' }, 400);
  }

  const welcomeHtml = `
<div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
  <h2 style="color:#213A5A;">You're connected with Trinity Home Care</h2>
  <p style="font-size:16px;line-height:1.6;color:#333;">Thank you for staying connected. We'll keep you informed about care resources, openings, and tips for Pittsburgh families.</p>
  <p style="font-size:16px;line-height:1.6;color:#333;">Need to talk? Call us at <a href="tel:4123453721" style="color:#213A5A;">412-345-3721</a>.</p>
  <p style="font-size:15px;color:#777;margin-top:32px;">— The Trinity Home Care Team</p>
</div>`;

  try {
    await Promise.all([
      addAudienceContact(RESEND_API_KEY, RESEND_AUDIENCE_ID, email),
      sendEmail(RESEND_API_KEY, {
        from: FROM,
        to: email,
        subject: "You're connected with Trinity Home Care",
        html: welcomeHtml,
      }),
    ]);
    return json({ success: true }, 200);
  } catch (err) {
    console.error('[email-capture] error:', err.message);
    return json({ error: 'Subscription failed' }, 500);
  }
}

export async function onRequest() {
  return new Response(null, { status: 405, headers: { Allow: 'POST, OPTIONS' } });
}

export async function onRequestOptions() {
  return new Response(null, { status: 204 });
}

function json(data, status) {
  return new Response(JSON.stringify(data), { status, headers: HEADERS });
}
