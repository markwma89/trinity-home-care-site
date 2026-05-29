// functions/api/contact.js
import { sendEmail } from '../_shared/resend.js';

const FROM    = 'forms@forms.trinityhomecarellc.com';
const NOTIFY  = 'mail@trinityhomecarellc.com';
const HEADERS = { 'Content-Type': 'application/json' };

export async function onRequestPost(context) {
  const { request, env } = context;
  const { RESEND_API_KEY } = env;

  if (!RESEND_API_KEY) {
    console.error('[contact] Missing RESEND_API_KEY');
    return json({ error: 'Server misconfigured' }, 500);
  }

  let body;
  try { body = await request.json(); } catch {
    return json({ error: 'Invalid request' }, 400);
  }

  const {
    first_name = '', last_name = '', phone = '',
    email = '', who_needs_care = '', message = '',
  } = body;

  if (!first_name.trim() || !last_name.trim() || !phone.trim()) {
    return json({ error: 'Missing required fields' }, 400);
  }

  const notifyHtml = `
<div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
  <h2 style="color:#213A5A;margin-bottom:16px;">New Care Inquiry</h2>
  <table style="width:100%;border-collapse:collapse;font-size:15px;">
    <tr style="border-bottom:1px solid #eee;"><td style="padding:10px 8px;font-weight:600;color:#555;width:150px;">Name</td><td style="padding:10px 8px;">${esc(first_name)} ${esc(last_name)}</td></tr>
    <tr style="border-bottom:1px solid #eee;"><td style="padding:10px 8px;font-weight:600;color:#555;">Phone</td><td style="padding:10px 8px;"><a href="tel:${esc(phone)}" style="color:#213A5A;">${esc(phone)}</a></td></tr>
    ${email ? `<tr style="border-bottom:1px solid #eee;"><td style="padding:10px 8px;font-weight:600;color:#555;">Email</td><td style="padding:10px 8px;">${esc(email)}</td></tr>` : ''}
    ${who_needs_care ? `<tr style="border-bottom:1px solid #eee;"><td style="padding:10px 8px;font-weight:600;color:#555;">Who needs care</td><td style="padding:10px 8px;">${esc(who_needs_care)}</td></tr>` : ''}
    ${message ? `<tr><td style="padding:10px 8px;font-weight:600;color:#555;vertical-align:top;">Message</td><td style="padding:10px 8px;white-space:pre-wrap;">${esc(message)}</td></tr>` : ''}
  </table>
</div>`;

  const replyHtml = `
<div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
  <h2 style="color:#213A5A;">We received your message</h2>
  <p style="font-size:16px;line-height:1.6;color:#333;">Hi ${esc(first_name)},</p>
  <p style="font-size:16px;line-height:1.6;color:#333;">Thank you for reaching out to Trinity Home Care. A member of our team will contact you within 24 hours.</p>
  <p style="font-size:16px;line-height:1.6;color:#333;">If you need immediate assistance, call us at <a href="tel:4123453721" style="color:#213A5A;">412-345-3721</a>.</p>
  <p style="font-size:15px;color:#777;margin-top:32px;">— The Trinity Home Care Team</p>
</div>`;

  try {
    const sends = [
      sendEmail(RESEND_API_KEY, {
        from: FROM,
        to: NOTIFY,
        replyTo: email.trim() || undefined,
        subject: `New Care Inquiry — ${first_name.trim()} ${last_name.trim()}`,
        html: notifyHtml,
      }),
    ];

    if (email.trim()) {
      sends.push(sendEmail(RESEND_API_KEY, {
        from: FROM,
        to: email.trim(),
        subject: 'We received your message — Trinity Home Care',
        html: replyHtml,
      }));
    }

    await Promise.all(sends);
    return json({ success: true }, 200);
  } catch (err) {
    console.error('[contact] send error:', err.message);
    return json({ error: 'Failed to send' }, 500);
  }
}

export async function onRequest() {
  return new Response(null, { status: 405, headers: { Allow: 'POST' } });
}

function json(data, status) {
  return new Response(JSON.stringify(data), { status, headers: HEADERS });
}

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
