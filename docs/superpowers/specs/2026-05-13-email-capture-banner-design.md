---
name: email-capture-banner
description: Scroll-triggered email capture modal connecting to Brevo via Cloudflare Pages Function
metadata:
  type: project
---

# Email Capture Banner — Design Spec

**Date:** 2026-05-13
**Project:** Trinity Home Care website
**Goal:** Add a scroll-triggered email capture modal that collects visitor emails and adds them to a Brevo marketing contact list, without breaking or redesigning the existing site.

---

## 1. Architecture Overview

Three components, three files changed or created:

```
[Visitor scrolls 40% on any page]
        ↓
[main.js] — injects modal HTML, manages show/hide/localStorage
        ↓ (on submit)
[POST /api/email-capture] — body: { email }
        ↓
[functions/api/email-capture.js] — validates, calls Brevo API
        ↓
[Brevo Contacts API] — adds contact to list with source tag "website"
```

### Files Changed

| File | Change |
|---|---|
| `js/main.js` | New section appended: email capture modal |
| `css/main.css` | New section appended: email capture modal styles |
| `functions/api/email-capture.js` | New — Cloudflare Pages Function |

Zero HTML page edits required — `main.js` and `main.css` are already loaded on every page.

### Cloudflare Environment Variables

Set in the Cloudflare Pages dashboard under Settings → Environment Variables:

| Variable | Description |
|---|---|
| `BREVO_API_KEY` | Brevo API key — server-side only, never exposed to the browser |
| `BREVO_LIST_ID` | Numeric ID of the Brevo contact list for website leads |

---

## 2. Frontend Modal Component

### Trigger Behavior

- Fires when the user has scrolled ≥ 40% of page height
- Uses a passive `scroll` listener, matching the existing sticky header pattern in `main.js`
- Checks localStorage before opening: if `ec_dismissed` exists and its timestamp is less than 30 days old, the modal does not open
- A boolean guard prevents the modal from opening more than once per page load
- Runs on all pages **except**: `contact.html`, `thank-you.html`, `careers.html`, `careers-thank-you.html`, `terms.html`, `privacy.html`, `policy.html`, `accessibility.html`
  - Exclusion implemented via `window.location.pathname` check in JS

### Modal Structure

Injected into `<body>` as the last child:

```
[Overlay — semi-transparent navy #213A5A at 55% opacity]
  └── [Modal card — white background, gold top border, border-radius 12px, max-width 480px]
        ├── [Close button — top-right ✕, aria-label="Close"]
        ├── [Eyebrow — "TRINITY HOME CARE" in --color-teal, small-caps, letter-spacing]
        ├── [Headline — "Stay Connected with Local Care Updates" in --font-heading]
        ├── [Subtext — "Be the first to know about care openings, resources, and tips for Pittsburgh families."]
        ├── [Email input — uses existing .form-input styles, type="email", required]
        ├── [Submit button — .btn .btn-primary, label "Stay Informed"]
        └── [Dismiss link — "No thanks" in --color-text-muted, below button]
```

### States

| State | UI |
|---|---|
| Default | Form visible |
| Loading | Button text → "Sending…", button disabled |
| Success | Form replaced with "You're on the list — thank you." confirmation |
| Error | Inline error below input: "Something went wrong. Please try again." |

### Dismiss Behavior

- Clicking ✕, "No thanks", or the overlay backdrop sets `ec_dismissed` in localStorage with `Date.now()` timestamp, then closes the modal
- Successful submission also sets `ec_dismissed` to prevent the modal reappearing

### Animations

- Overlay: `opacity 0 → 1` over 260ms (`var(--t-base)`)
- Modal card: `translateY(16px) → translateY(0)` over 260ms (`var(--t-base)`)
- Respects `prefers-reduced-motion`: animations skipped, matching existing site pattern

---

## 3. Backend — Cloudflare Pages Function

**File:** `functions/api/email-capture.js`
**Route:** `POST /api/email-capture`
**Runtime:** Cloudflare Workers (native `fetch`, no dependencies)

### Request

```json
POST /api/email-capture
Content-Type: application/json

{ "email": "user@example.com" }
```

### Logic

```
1. Reject non-POST requests → 405 Method Not Allowed
2. Parse JSON body, validate email (basic regex: contains @ and .)
   → invalid → 400 { error: "Invalid email" }
3. Read BREVO_API_KEY + BREVO_LIST_ID from env
   → missing → 500 { error: "Server misconfigured" }
4. POST to https://api.brevo.com/v3/contacts:
   {
     email,
     listIds: [parseInt(BREVO_LIST_ID)],
     updateEnabled: true,
     attributes: { SOURCE: "website" }
   }
5. Brevo 201 (created) or 204 (already exists) → 200 { success: true }
6. Brevo 4xx/5xx → 500 { error: "Subscription failed" }
```

### Security

- `BREVO_API_KEY` only exists in the Cloudflare Function environment — never shipped to the browser
- CORS: `Access-Control-Allow-Origin: same-origin` (no cross-origin submissions accepted)
- No additional rate limiting in the Function — Cloudflare Pages provides edge-level DDoS protection

---

## 4. Pages Where Modal Appears

**Included** (all content pages):
- `index.html`, `about.html`, `services.html`, `how-it-works.html`
- All `services/*.html` (10 service detail pages)
- All `service-areas/**/*.html` (16 location pages)

**Excluded** (utility, conversion, and legal pages):
- `contact.html` — visitor is already reaching out
- `thank-you.html`, `careers-thank-you.html` — already converted
- `careers.html` — different intent (job seeker, not care seeker)
- `terms.html`, `privacy.html`, `policy.html`, `accessibility.html` — legal/utility pages

---

## 5. Constraints

- Do not expose `BREVO_API_KEY` in any frontend file
- Do not modify any HTML page files
- Do not change existing layout, navigation, header, footer, or form logic
- Do not add npm packages or build steps
- Reuse existing CSS variables and button classes (`--color-navy`, `--color-teal`, `.btn`, `.btn-primary`, etc.)
- The Cloudflare Pages Function uses only the built-in Workers `fetch` API — no external dependencies
