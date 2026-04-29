# Code Review Summary — Trinity Home Care Site
**Last updated:** 2026-04-29
**Scope:** All 22 HTML pages, 7 CSS files, 3 JS files

> Full detail: [architecture-review-notes.md](architecture-review-notes.md) | [review-duplicates.md](review-duplicates.md) | [review-style.md](review-style.md) | [review-functional.md](review-functional.md)

---

## Prior Review (2026-04-12) — Resolved

All four prior findings (ACR-1 through ACR-4) were resolved on 2026-04-12. See [change-log.md](change-log.md) for details.

---

## Current Findings — 2026-04-29 Review

### CRITICAL — Fix Immediately

**CRIT-01 — All forms send zero data**
- **Files:** `index.html`, `contact.html`, `careers.html`, `about.html`, `services.html`
- `action="#"`, no backend wired, no form service. `main.js` validates then redirects via `setTimeout`. Submissions are silently lost. A dev comment in `main.js` ~line 193 explicitly flags this as a placeholder.
- **Fix:** Add `netlify` attribute + hidden `form-name` input for Netlify deployment, OR replace `setTimeout` with `fetch()` POST to Formspree/EmailJS.

**CRIT-02 — `how-it-works.js` targets `#cta-form` which doesn't exist**
- **Files:** `js/how-it-works.js` lines ~151, ~285; `how-it-works.html` (missing element)
- Form handler silently no-ops. Anchor scroll goes nowhere. ID not present on the page.
- **Fix:** Add `id="cta-form"` to the CTA form element in `how-it-works.html`.

**CRIT-03 — Star ratings contradict each other on the homepage**
- **File:** `index.html` — stats strip shows `3.3 ★` but testimonials section shows `4.9 on Google · 200+ verified reviews`
- Trust-destroying contradiction visible to every homepage visitor.
- **Fix:** Verify actual current Google rating; update stats strip to match. Ensure star display fills correctly.

---

### HIGH — Fix This Sprint

**HIGH-01 — Live placeholder Google review URL**
- **File:** `index.html` line ~717 — `href="https://g.page/r/PLACEHOLDER/review"`
- **Fix:** Replace with actual Google Business Profile review shortlink.

**HIGH-02 — careers.html active nav state broken**
- **File:** `css/careers.css` — missing `.nav-link[aria-current="page"]` rule present in 4 other page CSS files
- **Fix:** Move active-nav rule into `main.css` §7; delete per-page copies.

**HIGH-03 — services-page.js CTA form handler is dead code on all service pages**
- **File:** `js/services-page.js` lines 42–73 — targets `#cta-form` which doesn't exist on any service page
- **Fix:** Remove block, or add a form with that ID to service pages.

**HIGH-04 — `index.html` preloads wrong logo file**
- **File:** `index.html` line ~26 — preloads `logo-light.png` but active logo is `logo-light2.png`
- **Fix:** Update `<link rel="preload">` href to `logo-light2.png`.

**HIGH-05 — careers.html JSON-LD marks in-person role as TELECOMMUTE**
- **File:** `careers.html` line ~758 — `"jobLocationType": "TELECOMMUTE"` on a physical caregiving role
- **Fix:** Remove `jobLocationType` property entirely.

**HIGH-06 — Thank-you pages not noindex**
- **Files:** `thank-you.html`, `careers-thank-you.html`
- Missing `<meta name="robots" content="noindex, nofollow">` — pages may be indexed.
- **Fix:** Add noindex meta to both pages.

---

### MEDIUM — Fix Next

**MED-01 — Undefined CSS token `--space-md` in thank-you.html**
- **File:** `thank-you.html` inline `<style>` — `var(--space-md)` doesn't exist in main.css; padding collapses to 0
- **Fix:** Replace with `1.25rem` or define `--space-md` in main.css.

**MED-02 — Inconsistent error state styling across form handlers**
- **Files:** `js/main.js` — contact handler uses `field.style.borderColor`; careers handler uses `classList.add('is-invalid')`
- **Fix:** Move error color to CSS (`.field-invalid` class), toggle class in both handlers.

**MED-03 — Homepage contact form missing email field**
- **File:** `index.html` contact form — collects name, phone, need, message but no email address
- **Fix:** Add optional `<input type="email">` field.

**MED-04 — Form validation logic duplicated 3–4× across JS files**
- **Files:** `js/main.js` (×2), `js/how-it-works.js`, `js/services-page.js`
- Same pattern, same hardcoded error color string, four implementations
- **Fix:** Extract `validateForm(formEl, onValid)` utility. See [review-duplicates.md](review-duplicates.md) DUP-07.

**MED-05 — Rotating gradient border CSS duplicated in 4 files**
- **Files:** `css/main.css` (×2), `css/contact.css`, `css/careers.css`
- 14-stop conic-gradient must be kept in sync manually. Author left "keep in sync" comment.
- **Fix:** Define gradient as a CSS custom property on `:root`. See DUP-06.

**MED-06 — `.section-hero--page` base styles duplicated in 4–5 CSS files**
- **Files:** `about.css`, `contact.css`, `services.css`, `how-it-works.css`, `services-page.css`
- **Fix:** Move base styles to `main.css`. Each page file keeps only `background-image` and `background-position`.

**MED-07 — 22-page HTML skeleton fully copy-pasted (no templating system)**
- Header, nav dropdown, footer, mobile CTA bar are ~160 lines × 22 pages ≈ 3,520 lines of duplicate markup
- Nav drift already started: `about.html` CTA href is `#contact` while all others use `contact.html`
- **Fix:** Adopt SSG (Eleventy or Astro) or a minimal HTML-partials build step. See DUP-01.

**MED-08 — `aria-hidden` on meaningful content**
- **File:** `index.html` line ~597 — caption "Free assessment — at your home, at your convenience" is hidden from screen readers
- **Fix:** Remove `aria-hidden` from the column, or scope it to only the decorative image.

---

### LOW — Polish Pass

**LOW-01 — CTA label inconsistency site-wide (4 variants)**
- "Schedule a Free Consultation", "Request a Free Assessment", "Free Consultation", "Schedule a Consultation"
- **Fix:** Standardize to "Request a Free Assessment" everywhere.

**LOW-02 — 6 identical service card CTAs on homepage**
- All 6 cards say "Ask about this service" — vague and identical
- **Fix:** Write service-specific CTAs or link cards to individual service pages.

**LOW-03 — Duplicate favicon declaration overrides correct favicon**
- **Files:** All root HTML pages — `logo-dark.png` `<link rel="icon">` overrides correct favicon
- **Fix:** Remove the redundant `<link rel="icon" href="assets/logo/logo-dark.png">` from all root pages.

**LOW-04 — Footer group label inline styles (88 occurrences)**
- 7 CSS declarations inlined per label × 4 per footer × 22 pages
- **Fix:** Move to `.footer-group-label` in `main.css`. See DUP-11.

**LOW-05 — `thank-you.html` uses `<div>` where every other page uses `<section>`**
- Breaks landmark navigation pattern
- **Fix:** Convert to `<section aria-labelledby>`.

**LOW-06 — Hardcoded hex in `how-it-works.css`**
- `#5F8F95` and `#3d6b70` instead of `var(--color-teal)` and `var(--color-teal-muted)`
- **Fix:** Replace with tokens.

**LOW-07 — No `defer` on any `<script>` tag**
- All 22 pages place scripts at bottom of `<body>` without `defer`
- **Fix:** Add `defer` to all `<script src>` tags.

**LOW-08 — `services-page.css` naming unclear**
- Styles individual service detail pages; name implies generic services styling
- **Fix:** Rename to `service-detail.css`, update 10 `<link>` tags.

**LOW-09 — Dead variable and restatement comment in `main.js`**
- `startVal = 0` is never read; comment at line ~319 restates the code literally
- **Fix:** Remove both. See review-style.md CS-1, CS-2.

**LOW-10 — UX copy issues (11 items)**
- See [review-style.md](review-style.md) CP-1 through CP-12 for full list.
- Top items: contradictory ratings (CP-1), placeholder URL (CP-2), generic H1 (CP-3), identical CTAs (CP-4), 4 CTA label variants (CP-5), TELECOMMUTE schema (CP-11).

---

## Issues by Severity Count

| Severity | Count |
|---|---|
| Critical | 3 |
| High | 6 |
| Medium | 8 |
| Low | 10+ |
| **Total** | **27+** |
