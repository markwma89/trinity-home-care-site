# Resend Email Integration — Design Spec

**Date:** 2026-05-29  
**Project:** Trinity Home Care (`trinityhomecarellc.com`)  
**Status:** Approved

---

## Overview

Wire all three site forms to deliver email via Resend. The site is plain HTML/CSS/JS deployed on Cloudflare Pages with Cloudflare DNS. All API calls to Resend happen inside Cloudflare Pages Functions — the API key never reaches the browser.

---

## Sending Domain

| Field | Value |
|-------|-------|
| Domain | `forms.trinityhomecarellc.com` |
| From address | `forms@forms.trinityhomecarellc.com` |
| Notification inbox | `mail@trinityhomecarellc.com` |
| DNS provider | Cloudflare dashboard |

Resend requires three DNS records on `forms.trinityhomecarellc.com`:
- **DKIM** — one CNAME record (provided by Resend after domain creation)
- **SPF** — one TXT record on the subdomain
- **Bounce MX** — one MX record (provided by Resend)

All records are added in the Cloudflare DNS dashboard. Resend verifies automatically within minutes.

---

## Environment Variables

Set in Cloudflare Pages → Settings → Environment Variables (Production + Preview):

| Variable | Value |
|----------|-------|
| `RESEND_API_KEY` | From Resend dashboard → API Keys |
| `RESEND_AUDIENCE_ID` | From Resend dashboard → Audiences → create "Trinity Website" audience |

---

## Endpoints

### `POST /api/contact`

**Trigger:** Contact/assessment form submission on any page.

**Input:** JSON body
```json
{
  "first_name": "Sandra",
  "last_name": "K.",
  "phone": "412-555-0100",
  "email": "sandra@example.com",
  "who_needs_care": "parent",
  "message": "Looking for help with my mother..."
}
```
`email` is optional — if absent, auto-reply is skipped.

**Actions:**
1. Validate required fields (`first_name`, `last_name`, `phone`).
2. Send **notification email** to `mail@trinityhomecarellc.com` with all form fields formatted as an HTML table.
3. If `email` is present, send **auto-reply** to the submitter confirming receipt.

**Success response:** `{ "success": true }` — frontend redirects to `thank-you.html`.  
**Error response:** `{ "error": "..." }` with appropriate HTTP status.

---

### `POST /api/careers`

**Trigger:** Careers application form submission on `careers.html`.

**Input:** `multipart/form-data` (because of the resume file upload).

**Fields:**
- Personal: `first_name`, `last_name`, `phone`, `email` (required), `street`, `city`, `state`, `zip`
- Position: `position`, `start_date`, `schedule`, `experience`
- Additional: `certifications`, `message`
- File: `resume` (PDF, DOC, DOCX — optional)

**Actions:**
1. Validate required fields.
2. If `resume` is present: read file bytes, base64-encode, include as attachment in notification email.
3. Send **notification email** to `mail@trinityhomecarellc.com` with all fields + resume attachment.
4. Send **auto-reply** to applicant's email confirming application received.

**Success response:** `{ "success": true }` — frontend redirects to `careers-thank-you.html`.

---

### `POST /api/email-capture`

**Trigger:** Email capture modal (fires at 40% scroll depth on non-excluded pages).

**Input:** JSON body
```json
{ "email": "subscriber@example.com" }
```

**Actions:**
1. Validate email format.
2. Add contact to Resend Audience (`RESEND_AUDIENCE_ID`) via `POST /audiences/{id}/contacts`.
3. Send **welcome email** to the subscriber.

**Success response:** `{ "success": true }` — modal shows success state.

> This replaces the existing Brevo-based `functions/api/email-capture.js`.

---

## Email Templates

All emails are sent as HTML with a plain-text fallback. Templates are inline strings inside each Pages Function (no template engine needed at this scale).

### Contact Notification (to `mail@trinityhomecarellc.com`)
- **Subject:** `New Care Inquiry — {first_name} {last_name}`
- **Body:** HTML table of all submitted fields. Phone number is a `tel:` link.

### Contact Auto-Reply (to submitter)
- **Subject:** `We received your message — Trinity Home Care`
- **Body:** "Hi {first_name}, thank you for reaching out. A member of our team will contact you within 24 hours. If you need immediate assistance, call us at 412-345-3721."

### Careers Notification (to `mail@trinityhomecarellc.com`)
- **Subject:** `New Application — {first_name} {last_name} ({position})`
- **Body:** HTML table of all fields. Resume attached if uploaded.

### Careers Auto-Reply (to applicant)
- **Subject:** `Application received — Trinity Home Care`
- **Body:** "Hi {first_name}, we received your application for {position}. We review every application personally and will be in touch within two business days."

### Lead Capture Welcome (to subscriber)
- **Subject:** `You're connected with Trinity Home Care`
- **Body:** "Thank you for staying connected. We'll keep you informed about care resources and updates for Pittsburgh families."

---

## Frontend Changes (`js/main.js`)

### Contact form handler
Replace `setTimeout` stub with a `fetch('POST', '/api/contact', formData)` call. On success, redirect to `thank-you.html`. On network/server error, re-enable the submit button and show an inline error message near the form.

### Careers form handler
Replace `setTimeout` stub with a `fetch('POST', '/api/careers', formData)` using `FormData` (not JSON) to preserve the file upload. On success, redirect to `careers-thank-you.html`.

### Email capture modal
The modal already calls `/api/email-capture`. Update the fetch payload from Brevo format to `{ email }` JSON — the endpoint interface is the same, only the server implementation changes. No change needed to the trigger logic or modal HTML.

---

## HTML Changes

The contact form on `index.html` and all inner pages (about, services, service area pages, service detail pages) is missing an email field present on `contact.html`. Add an **optional** email field to these forms:

```html
<div class="form-group">
  <label for="email" class="form-label">Email Address</label>
  <input type="email" id="email" name="email" class="form-input"
         placeholder="you@example.com" autocomplete="email">
</div>
```

Placed after the phone field. Not required — auto-reply fires only when provided.

**Pages affected:** `index.html`, `about.html`, `services.html`, `how-it-works.html`, all `service-areas/**/*.html`, all `services/*.html` (~36 files).

---

## Files to Create / Modify

| File | Action |
|------|--------|
| `functions/api/contact.js` | Create |
| `functions/api/careers.js` | Create |
| `functions/api/email-capture.js` | Modify (Brevo → Resend) |
| `js/main.js` | Modify (wire fetch calls) |
| `index.html` + ~35 others | Modify (add email field) |

---

## Manual Setup Steps (Before Deploying)

These must be done by hand before the integration will work:

1. **Resend dashboard** → Domains → Add `forms.trinityhomecarellc.com`
2. **Cloudflare DNS** → Add the 3 records Resend provides (DKIM CNAME, SPF TXT, MX)
3. **Resend dashboard** → Wait for domain verification (green checkmark)
4. **Resend dashboard** → Audiences → Create audience named "Trinity Website" → copy the Audience ID
5. **Cloudflare Pages dashboard** → Settings → Environment Variables → add `RESEND_API_KEY` and `RESEND_AUDIENCE_ID`
6. **Deploy** (git push → Cloudflare Pages auto-deploys)

---

## Error Handling

- Missing required fields → `400` with field-level error message
- Resend API error → log to console, return `500 { error: "Failed to send" }` — never expose raw Resend errors to the client
- Invalid email format → `400`
- Missing env vars → `500` with console error (never silently swallow)
- Frontend: on any non-`success` response, re-enable submit button and show: *"Something went wrong. Please try again or call us at 412-345-3721."*

---

## Out of Scope

- Email unsubscribe flow (Resend Audiences handles this automatically via the unsubscribe link in the welcome email)
- CRM integration
- SMS notifications
- Form spam protection (can add Turnstile in a follow-up)
