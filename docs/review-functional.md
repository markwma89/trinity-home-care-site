# Functional Integrity Review
**Date:** 2026-04-29
**Method:** Reasoning-based source review — no automated tests exist in this project

---

## Summary

**PASS with critical gaps.** Navigation links, relative paths, CSS wiring, asset references, and page-to-page linking are structurally clean across all 22 pages. The critical risk is that **all forms send zero data** — no backend is wired and no form service is connected. One high-priority JS selector targets an ID that doesn't exist. A live placeholder URL is in production code. Confidence level: high for structural findings, medium for runtime JS edge cases.

---

## Critical Issues

### CRIT-1 — All forms send zero data; submissions are silently lost
- **Type:** form-issue
- **Locations:** `index.html` line ~842, `contact.html` line ~423, `careers.html` line ~437, plus the embedded contact form on `about.html` and `services.html`
- **Description:** Every form uses `action="#"` with no `netlify` attribute, no Formspree endpoint, no `fetch()` POST. The `main.js` submit handlers call `e.preventDefault()`, do client-side validation, then `setTimeout(() => { window.location.href = 'thank-you.html' }, 800)`. No data is transmitted. Users see a redirect confirmation but the inquiry is lost. A comment in `main.js` at line ~193 explicitly flags this: *"Replace setTimeout with real fetch/POST when wiring to a backend or form service."*
- **Severity:** Critical
- **Fix:** For Netlify deployment: add `netlify` attribute + `<input type="hidden" name="form-name" value="contact">` to each form, remove `e.preventDefault()` + `setTimeout` block, let Netlify POST handle it. Or replace the `setTimeout` with a `fetch()` POST to Formspree/EmailJS and keep the JS redirect on success.

### CRIT-2 — `how-it-works.js` targets `id="cta-form"` which doesn't exist on the page
- **Type:** selector-mismatch
- **Locations:** `js/how-it-works.js` lines ~151 and ~285; `how-it-works.html` (no matching element)
- **Description:** The JS binds to `document.getElementById('cta-form')` for form submission, and injects `<a href="#cta-form">start the conversation</a>` into the Step 5 detail panel. The form handler silently no-ops; the anchor scroll goes nowhere. The `#cta-form` ID does not appear anywhere in `how-it-works.html`.
- **Severity:** Critical
- **Fix:** Add `id="cta-form"` to the CTA form element in `how-it-works.html`, or rename the JS selector to match the actual element ID on the page.

---

## High Priority Issues

### HIGH-1 — Google Review button is a live placeholder URL
- **Type:** broken-link
- **Location:** `index.html` line ~717
- **Description:** `href="https://g.page/r/PLACEHOLDER/review"` is publicly visible. Every visitor who clicks "Leave a Review" is sent to a dead Google URL opened in a new tab.
- **Severity:** High
- **Fix:** Replace `PLACEHOLDER` with the actual Google Business Profile review shortlink from the Google Business dashboard.

### HIGH-2 — services-page.js CTA form handler is dead code on all 10 service pages
- **Type:** selector-mismatch
- **Location:** `js/services-page.js` lines 42–73
- **Description:** Handler looks for `getElementById('cta-form')`. None of the 10 `/services/*.html` pages contain a form with that ID — they have a `<section id="cta-section">` with only a phone link and an external link to `contact.html`. Handler returns at line 43 (`if (!form) return;`) on every service page load.
- **Severity:** High (dead code; no current crash, but the intended inline form is missing from all service pages)
- **Fix:** Remove the form block from `services-page.js` if no inline form is planned, or add a contact form with `id="cta-form"` to each service page.

### HIGH-3 — Rating data is contradictory on the homepage
- **Type:** content integrity
- **Location:** `index.html` stats strip (3.3 ★) vs testimonials section ("4.9 on Google · 200+ verified reviews")
- **Description:** Two different Google ratings appear on the same page. The star graphic in testimonials renders 5 filled stars, consistent with 4.9 — not 3.3. The stats strip value is incorrect.
- **Severity:** High (credibility damage — visible to every homepage visitor)
- **Fix:** Verify the actual current rating and update both the stats strip figure and the testimonials claim. Ensure the star display matches the rating figure.

---

## Medium / Low Issues

### MED-1 — `index.html` preloads wrong logo file
- **Type:** performance / path-error
- **Location:** `index.html` line ~26
- **Description:** `<link rel="preload" as="image" href="assets/logo/logo-light.png">` — but the nav `<img>` tags reference `logo-light2.png`. The preloaded file is unused; the actual active logo is not preloaded.
- **Severity:** Medium (performance — preload is wasted, active logo fetched without preload hint)
- **Fix:** Change line ~26 to `href="assets/logo/logo-light2.png"`.

### MED-2 — careers.html JSON-LD marks in-person role as TELECOMMUTE
- **Type:** seo-issue
- **Location:** `careers.html` line ~758, `<script type="application/ld+json">`
- **Description:** `"jobLocationType": "TELECOMMUTE"` on a position requiring physical presence in client homes. This routes the job into remote-work search filters, misleading applicants.
- **Severity:** Medium
- **Fix:** Remove the `jobLocationType` property entirely.

### MED-3 — Homepage contact form missing email field
- **Type:** form-issue
- **Location:** `index.html` contact section form (~lines 842–897)
- **Description:** The inline homepage form collects name, phone, who-needs-care, message — but no email. The dedicated `contact.html` form includes email. Homepage leads arrive without a return email address.
- **Severity:** Medium
- **Fix:** Add an optional `<input type="email">` field to the homepage form.

### LOW-1 — Duplicate favicon declarations on all root pages
- **Type:** path-error
- **Location:** All root HTML pages (index.html, about.html, etc.), lines ~10–22
- **Description:** Three `<link rel="icon">` entries for the correct favicon (`Trinity Home Care logo design favicon.png`) are followed by a fourth `<link rel="icon" href="assets/logo/logo-dark.png">` that overrides them in most desktop browsers. The full-width wordmark logo is being used as the favicon.
- **Severity:** Low (functional, not broken — favicon still displays, but wrong file is used)
- **Fix:** Remove the fourth `<link rel="icon" href="assets/logo/logo-dark.png">` from all root pages.

### LOW-2 — How It Works CTA redirect behavior differs from all other forms
- **Type:** pattern-inconsistency
- **Location:** `js/how-it-works.js` lines ~300–307
- **Description:** On valid submission, the How It Works CTA shows "Request Sent" text in-place. Every other form redirects to a thank-you page. This behavioral divergence is invisible from the HTML and undocumented.
- **Severity:** Low
- **Fix:** Either redirect to `thank-you.html` (consistent with other forms), or add a comment explaining the intentional in-place confirmation.

### LOW-3 — Thank-you pages not marked noindex
- **Type:** seo-issue
- **Location:** `thank-you.html` and `careers-thank-you.html` — missing `<meta name="robots">` tag
- **Description:** Both confirmation pages may be indexed by search engines. They should not appear in search results.
- **Severity:** Low (SEO hygiene)
- **Fix:** Add `<meta name="robots" content="noindex, nofollow">` to both pages.

---

## Asset Integrity

All image and video references checked against actual directory contents.

| Asset Category | Status |
|---|---|
| Hero images | ✅ All present |
| Supporting images | ✅ All present |
| Service images | ✅ All present |
| Logo files (logo-light2.png, logo-dark2.png, favicon) | ✅ All present |
| Videos (hero, contact page, personal-care) | ✅ All present |
| CSS files (7) | ✅ All present |
| JS files (3) | ✅ All present |

---

## Navigation Link Integrity

All internal nav links verified as pointing to existing files. Service pages correctly use `../` prefix for root-level targets. Footer links on service pages correctly use `../privacy.html`, `../terms.html`, etc. Root-page footers use `services/personal-care.html` etc. — all correct and consistent.

---

## Form Handling Summary

| Form | Pages | Backend | Redirect target | Target exists |
|---|---|---|---|---|
| `contact-form` | index, contact, about, services | **None** | `thank-you.html` | ✅ |
| `careers-form` | careers | **None** | `careers-thank-you.html` | ✅ |
| `cta-form` | how-it-works | **None** | No redirect | ID missing on page |
| `cta-form` | service pages | **None** | In-place text | Form element missing |
