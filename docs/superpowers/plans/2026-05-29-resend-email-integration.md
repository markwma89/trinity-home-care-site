# Resend Email Integration — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire all three site forms (contact/assessment, careers, email-capture modal) to deliver email via Resend using Cloudflare Pages Functions.

**Architecture:** Three Pages Functions handle all Resend API calls server-side, keeping the API key out of the browser. A shared helper module (`functions/_shared/resend.js`) provides `sendEmail()` and `addAudienceContact()`. The contact and careers form handlers in `main.js` replace their `setTimeout` stubs with real `fetch()` calls.

**Tech Stack:** Cloudflare Pages Functions (ES modules), Resend API, plain HTML/CSS/JS frontend

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `functions/_shared/resend.js` | Create | Resend API wrapper: `sendEmail()`, `addAudienceContact()` |
| `functions/api/contact.js` | Create | Contact form: notify + auto-reply |
| `functions/api/careers.js` | Create | Careers form: notify with resume attachment + auto-reply |
| `functions/api/email-capture.js` | Modify | Migrate Brevo → Resend: add to audience + welcome email |
| `js/main.js` | Modify | Replace two `setTimeout` stubs with `fetch()` calls |
| `index.html` + ~35 others | Modify | Add optional email field to contact forms |

---

## Task 1: Create shared Resend helper

**Files:**
- Create: `functions/_shared/resend.js`

- [ ] **Step 1: Create the file**

```javascript
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
```

- [ ] **Step 2: Commit**

```bash
git add functions/_shared/resend.js
git commit -m "feat: add shared Resend email/audience helper"
```

---

## Task 2: Create contact form Pages Function

**Files:**
- Create: `functions/api/contact.js`

- [ ] **Step 1: Create the file**

```javascript
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
```

- [ ] **Step 2: Commit**

```bash
git add functions/api/contact.js
git commit -m "feat: add contact form Pages Function (Resend)"
```

---

## Task 3: Create careers form Pages Function

**Files:**
- Create: `functions/api/careers.js`

The careers form sends `multipart/form-data` (it has a file upload). Parse with `request.formData()`. Base64-encode the resume for Resend's `attachments` field using a loop (not spread, which stack-overflows on large files).

- [ ] **Step 1: Create the file**

```javascript
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

  // Encode resume — use a loop, not spread, to avoid stack overflow on large files
  const attachments = [];
  const resumeFile = fd.get('resume');
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
```

- [ ] **Step 2: Commit**

```bash
git add functions/api/careers.js
git commit -m "feat: add careers form Pages Function (Resend + resume attachment)"
```

---

## Task 4: Migrate email-capture Pages Function from Brevo to Resend

**Files:**
- Modify: `functions/api/email-capture.js`

Replace the entire file contents. The frontend in `main.js` already calls `POST /api/email-capture` with `{ email }` — that interface stays the same.

- [ ] **Step 1: Replace the file**

```javascript
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
```

- [ ] **Step 2: Commit**

```bash
git add functions/api/email-capture.js
git commit -m "feat: migrate email-capture from Brevo to Resend"
```

---

## Task 5: Wire contact form fetch in main.js

**Files:**
- Modify: `js/main.js:187-195`

The contact form handler currently has this stub at approximately line 192:

```javascript
    // Replace setTimeout with real fetch/POST when wiring to a backend or form service.
    setTimeout(() => {
      window.location.href = 'thank-you.html';
    }, 800);
```

- [ ] **Step 1: Replace the setTimeout stub**

Find the block in `js/main.js` that reads:

```javascript
    // Replace setTimeout with real fetch/POST when wiring to a backend or form service.
    setTimeout(() => {
      window.location.href = 'thank-you.html';
    }, 800);
```

Replace it with:

```javascript
    const data = {};
    new FormData(this).forEach((v, k) => { data[k] = v.toString(); });

    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
      .then(function (res) { return res.json(); })
      .then(function (json) {
        if (json.success) {
          window.location.href = 'thank-you.html';
        } else {
          throw new Error(json.error || 'unknown');
        }
      })
      .catch(function () {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        var errEl = contactForm.querySelector('.form-submit-error');
        if (!errEl) {
          errEl = document.createElement('p');
          errEl.className = 'form-submit-error';
          errEl.style.cssText = 'color:#c0392b;font-size:0.875rem;margin-top:0.75rem;';
          submitBtn.parentNode.appendChild(errEl);
        }
        errEl.textContent = 'Something went wrong. Please try again or call 412-345-3721.';
      });
```

- [ ] **Step 2: Commit**

```bash
git add js/main.js
git commit -m "feat: wire contact form to POST /api/contact"
```

---

## Task 6: Wire careers form fetch in main.js

**Files:**
- Modify: `js/main.js:250-257`

The careers form handler stub is at approximately line 254:

```javascript
    // Replace setTimeout with real fetch/POST when wiring to a backend or form service.
    setTimeout(() => {
      window.location.href = 'careers-thank-you.html';
    }, 800);
```

Note: the careers form uses `enctype="multipart/form-data"` for the file upload. Pass `FormData` directly to `fetch` — do **not** set a `Content-Type` header (the browser sets the correct `multipart/form-data; boundary=...` automatically).

- [ ] **Step 1: Replace the setTimeout stub**

Find the block in `js/main.js` that reads:

```javascript
    // Replace setTimeout with real fetch/POST when wiring to a backend or form service.
    setTimeout(() => {
      window.location.href = 'careers-thank-you.html';
    }, 800);
```

Replace it with:

```javascript
    fetch('/api/careers', {
      method: 'POST',
      body: new FormData(careersForm),
      // No Content-Type header — browser sets multipart/form-data boundary automatically
    })
      .then(function (res) { return res.json(); })
      .then(function (json) {
        if (json.success) {
          window.location.href = 'careers-thank-you.html';
        } else {
          throw new Error(json.error || 'unknown');
        }
      })
      .catch(function () {
        submitBtn.textContent = 'Submit Application';
        submitBtn.disabled = false;
        var errEl = careersForm.querySelector('.form-submit-error');
        if (!errEl) {
          errEl = document.createElement('p');
          errEl.className = 'form-submit-error';
          errEl.style.cssText = 'color:#c0392b;font-size:0.875rem;margin-top:0.75rem;';
          submitBtn.parentNode.appendChild(errEl);
        }
        errEl.textContent = 'Something went wrong. Please try again or call 412-345-3721.';
      });
```

- [ ] **Step 2: Commit**

```bash
git add js/main.js
git commit -m "feat: wire careers form to POST /api/careers"
```

---

## Task 7: Add email field to contact forms

**Files:**
- Modify: `index.html`, `about.html`, `services.html`, `how-it-works.html`, all `service-areas/**/*.html`, all `services/*.html` (~36 files)
- Skip: `contact.html` (already has email field)

The contact form on most pages has this phone field but no email field. Use PowerShell to insert the email field after the phone `</div>` on all affected pages.

- [ ] **Step 1: Run the PowerShell script**

The pattern to find (the closing `</div>` after the phone input — unique to the contact form, not the careers form which uses `id="c-phone"`):

```powershell
$emailField = @'

                <div class="form-group">
                  <label for="email" class="form-label">Email Address</label>
                  <input type="email" id="email" name="email" class="form-input"
                         placeholder="you@example.com" autocomplete="email">
                </div>
'@

$files = Get-ChildItem -Path "F:\projects\trinity-home-care-site" -Recurse -Filter "*.html" |
  Where-Object {
    $_.FullName -notmatch '\.superpowers' -and
    $_.Name -ne 'googlee8b56ae81c5fedd5.html' -and
    $_.Name -ne 'contact.html'   # already has email field
  }

$updated = 0
foreach ($file in $files) {
  $content = Get-Content $file.FullName -Raw -Encoding UTF8
  # Only pages with the contact form phone pattern AND no email field yet
  if ($content -match 'name="phone"' -and $content -notmatch 'name="email"') {
    $anchor = '                         placeholder="(412) 000-0000" required autocomplete="tel">' + "`r`n" + '                </div>'
    if ($content -match [regex]::Escape($anchor)) {
      $newContent = $content -replace [regex]::Escape($anchor), ($anchor + $emailField)
      [System.IO.File]::WriteAllText($file.FullName, $newContent, [System.Text.Encoding]::UTF8)
      $updated++
      Write-Output "Updated: $($file.Name)"
    }
  }
}
Write-Output "Done — $updated files updated"
```

Expected output: ~36 files updated. If the count is 0, check the exact whitespace of the `placeholder` line in `index.html` and adjust the `$anchor` string.

- [ ] **Step 2: Verify one file manually**

Open `index.html` and confirm the email field appears between phone and the `who-needs-care` select. Search for `name="email"` — should appear once in the contact form area, not in the careers form.

- [ ] **Step 3: Commit**

```bash
git add index.html about.html services.html how-it-works.html service-areas/ services/
git commit -m "feat: add optional email field to contact forms across all pages"
```

---

## Task 8: Manual setup (DNS + Resend dashboard + env vars)

These steps are done in external dashboards — no code changes.

- [ ] **Step 1: Create the sending domain in Resend**

  1. Go to [Resend dashboard](https://resend.com) → **Domains** → **Add Domain**
  2. Enter `forms.trinityhomecarellc.com`
  3. Resend will show you three DNS records to add (DKIM CNAME, SPF TXT, MX)

- [ ] **Step 2: Add DNS records in Cloudflare**

  Log in to the [Cloudflare dashboard](https://dash.cloudflare.com) → `trinityhomecarellc.com` → **DNS** → **Records**.

  Add each of the three records Resend provides. They will look similar to:

  | Type | Name | Value |
  |------|------|-------|
  | CNAME | `resend._domainkey.forms` | `(value from Resend)` |
  | TXT | `forms` | `v=spf1 include:amazonses.com ~all` |
  | MX | `forms` | `feedback-smtp.us-east-1.amazonses.com` (priority 10) |

  **Important:** For Cloudflare-proxied domains, set the CNAME **Proxy status to DNS only** (grey cloud), not proxied.

- [ ] **Step 3: Verify domain in Resend**

  Back in Resend → Domains → click **Verify** next to `forms.trinityhomecarellc.com`. DNS propagation is usually under 5 minutes on Cloudflare.

- [ ] **Step 4: Create an Audience in Resend**

  Resend dashboard → **Audiences** → **Create Audience** → name it `Trinity Website` → copy the Audience ID (a UUID).

- [ ] **Step 5: Create an API Key in Resend**

  Resend dashboard → **API Keys** → **Create API Key** → name it `Trinity Production` → copy the key (shown once).

- [ ] **Step 6: Add environment variables in Cloudflare Pages**

  Cloudflare dashboard → **Pages** → `trinity-home-care-site` → **Settings** → **Environment Variables** → **Add variable** (for both Production and Preview):

  | Variable | Value |
  |----------|-------|
  | `RESEND_API_KEY` | The API key from Step 5 |
  | `RESEND_AUDIENCE_ID` | The audience UUID from Step 4 |

---

## Task 9: Deploy and verify

- [ ] **Step 1: Push to trigger Cloudflare Pages deploy**

```bash
git push
```

Watch the deployment in Cloudflare Pages → Deployments. Should complete in ~1 minute.

- [ ] **Step 2: Test contact form**

  Go to `https://trinityhomecarellc.com/contact.html`. Fill in all required fields **including email**. Submit.

  Expected:
  - Page redirects to `thank-you.html`
  - `mail@trinityhomecarellc.com` receives notification email within ~30 seconds
  - The email address you entered receives an auto-reply

- [ ] **Step 3: Test contact form without email**

  Submit the contact form with all required fields but **leave email blank**.

  Expected:
  - Page redirects to `thank-you.html`
  - `mail@trinityhomecarellc.com` receives notification
  - No auto-reply (no email to send to)

- [ ] **Step 4: Test email capture modal**

  On `index.html`, open browser DevTools console and run:
  ```javascript
  localStorage.removeItem('ec_dismissed');
  ```
  Scroll 40% down the page. The modal should appear. Enter an email and submit.

  Expected:
  - Modal shows success state
  - The email receives a welcome email
  - The email appears in Resend → Audiences → Trinity Website → Contacts

- [ ] **Step 5: Test careers form**

  Go to `https://trinityhomecarellc.com/careers.html`. Fill in all required fields, optionally attach a small PDF as a resume. Submit.

  Expected:
  - Page redirects to `careers-thank-you.html`
  - `mail@trinityhomecarellc.com` receives notification email with resume attached (if uploaded)
  - Applicant email receives auto-reply

- [ ] **Step 6: Test error state**

  Temporarily remove `RESEND_API_KEY` from Cloudflare Pages env vars, redeploy, submit the contact form.

  Expected:
  - Submit button re-enables
  - Error message appears: "Something went wrong. Please try again or call 412-345-3721."

  Restore the env var and redeploy when done.

- [ ] **Step 7: Final commit (if any fixes were needed)**

```bash
git add -A
git commit -m "fix: post-deploy adjustments"
git push
```
