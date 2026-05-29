// functions/api/careers.js
import { sendEmail } from '../_shared/resend.js';

const FROM    = 'forms@forms.trinityhomecarellc.com';
const NOTIFY  = 'mail@trinityhomecarellc.com';
const HEADERS = { 'Content-Type': 'application/json' };

export async function onRequestPost(context) {
  const { request, env } = context;
  const { RESEND_API_KEY } = env;

  if (!RESEND_API_KEY) {
    console.error('[careers] Missing RESEND_API_KEY');
    return json({ error: 'Server misconfigured' }, 500);
  }

  let fd;
  try { fd = await request.formData(); } catch {
    return json({ error: 'Invalid request' }, 400);
  }

  const g = (k) => (fd.get(k) ?? '').toString().trim();

  const first_name   = g('first_name');
  const last_name    = g('last_name');
  const phone        = g('phone');
  const email        = g('email');
  const street       = g('street');
  const city         = g('city');
  const state        = g('state');
  const zip          = g('zip');
  const position     = g('position');
  const start_date   = g('start_date');
  const schedule     = g('schedule');
  const experience   = g('experience');
  const certifications = g('certifications');
  const message      = g('message');

  if (!first_name || !last_name || !phone || !email) {
    return json({ error: 'Missing required fields' }, 400);
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: 'Invalid email address' }, 400);
  }

  // Encode resume — use a loop, not spread, to avoid stack overflow on large files
  const attachments = [];
  const resumeFile = fd.get('resume');
  if (resumeFile && resumeFile.size > 5 * 1024 * 1024) {
    return json({ error: 'Resume must be under 5 MB' }, 400);
  }
  if (resumeFile && resumeFile.size > 0) {
    const buffer = await resumeFile.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    attachments.push({ filename: resumeFile.name || 'resume', content: btoa(binary) });
  }

  const address = [street, city, state, zip].filter(Boolean).join(', ');

  const notifyHtml = `
<div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
  <h2 style="color:#213A5A;margin-bottom:16px;">New Application — ${esc(position) || 'Position not specified'}</h2>
  <table style="width:100%;border-collapse:collapse;font-size:15px;">
    <tr style="border-bottom:1px solid #eee;"><td style="padding:10px 8px;font-weight:600;color:#555;width:160px;">Name</td><td style="padding:10px 8px;">${esc(first_name)} ${esc(last_name)}</td></tr>
    <tr style="border-bottom:1px solid #eee;"><td style="padding:10px 8px;font-weight:600;color:#555;">Phone</td><td style="padding:10px 8px;"><a href="tel:${esc(phone)}" style="color:#213A5A;">${esc(phone)}</a></td></tr>
    <tr style="border-bottom:1px solid #eee;"><td style="padding:10px 8px;font-weight:600;color:#555;">Email</td><td style="padding:10px 8px;">${esc(email)}</td></tr>
    ${address ? `<tr style="border-bottom:1px solid #eee;"><td style="padding:10px 8px;font-weight:600;color:#555;">Address</td><td style="padding:10px 8px;">${esc(address)}</td></tr>` : ''}
    ${position ? `<tr style="border-bottom:1px solid #eee;"><td style="padding:10px 8px;font-weight:600;color:#555;">Position</td><td style="padding:10px 8px;">${esc(position)}</td></tr>` : ''}
    ${start_date ? `<tr style="border-bottom:1px solid #eee;"><td style="padding:10px 8px;font-weight:600;color:#555;">Start Date</td><td style="padding:10px 8px;">${esc(start_date)}</td></tr>` : ''}
    ${schedule ? `<tr style="border-bottom:1px solid #eee;"><td style="padding:10px 8px;font-weight:600;color:#555;">Schedule</td><td style="padding:10px 8px;">${esc(schedule)}</td></tr>` : ''}
    ${experience ? `<tr style="border-bottom:1px solid #eee;"><td style="padding:10px 8px;font-weight:600;color:#555;">Experience</td><td style="padding:10px 8px;">${esc(experience)}</td></tr>` : ''}
    ${certifications ? `<tr style="border-bottom:1px solid #eee;"><td style="padding:10px 8px;font-weight:600;color:#555;vertical-align:top;">Certifications</td><td style="padding:10px 8px;white-space:pre-wrap;">${esc(certifications)}</td></tr>` : ''}
    ${message ? `<tr><td style="padding:10px 8px;font-weight:600;color:#555;vertical-align:top;">Notes</td><td style="padding:10px 8px;white-space:pre-wrap;">${esc(message)}</td></tr>` : ''}
  </table>
  <p style="margin-top:16px;font-size:13px;color:${attachments.length ? '#555' : '#999'};">
    ${attachments.length ? 'Resume attached.' : 'No resume uploaded.'}
  </p>
</div>`;

  const replyHtml = `
<div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
  <h2 style="color:#213A5A;">Application received</h2>
  <p style="font-size:16px;line-height:1.6;color:#333;">Hi ${esc(first_name)},</p>
  <p style="font-size:16px;line-height:1.6;color:#333;">We received your application${position ? ` for <strong>${esc(position)}</strong>` : ''}. We review every application personally and will be in touch within two business days.</p>
  <p style="font-size:16px;line-height:1.6;color:#333;">Questions? Call us at <a href="tel:4123453721" style="color:#213A5A;">412-345-3721</a>.</p>
  <p style="font-size:15px;color:#777;margin-top:32px;">— The Trinity Home Care Team</p>
</div>`;

  try {
    await Promise.all([
      sendEmail(RESEND_API_KEY, {
        from: FROM,
        to: NOTIFY,
        replyTo: email,
        subject: `New Application — ${first_name} ${last_name}${position ? ` (${position})` : ''}`,
        html: notifyHtml,
        attachments,
      }),
      sendEmail(RESEND_API_KEY, {
        from: FROM,
        to: email,
        subject: 'Application received — Trinity Home Care',
        html: replyHtml,
      }),
    ]);
    return json({ success: true }, 200);
  } catch (err) {
    console.error('[careers] send error:', err.message);
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
