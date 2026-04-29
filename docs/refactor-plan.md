# Refactor Plan — Trinity Home Care Site
**Last updated:** 2026-04-29
**Source:** docs/code-review-summary.md (full 22-page review)

---

## Prior Plan Items (2026-04-12) — Completed

Groups A and B from the 2026-04-12 plan were fully executed. See change-log.md for details.

---

## New Plan — 2026-04-29 Review

### Group 0 — Fix Before Next Deploy (No Tolerance for These in Production)

**0-A. Wire all forms to a backend** (CRIT-01)
- Decide on form backend: Netlify Forms (simplest, free tier), Formspree (reliable, email delivery), or EmailJS (JS-only, no server)
- For Netlify Forms: add `netlify` attribute to each `<form>`, add `<input type="hidden" name="form-name" value="[name]">`, remove `e.preventDefault()` + `setTimeout` block in main.js
- Files: `index.html`, `contact.html`, `careers.html`, `about.html`, `services.html`, `js/main.js`
- Risk: Medium — involves form submission behavior and redirect logic
- Test: Submit each form and verify data arrives at destination before deploying

**0-B. Fix homepage star ratings contradiction** (CRIT-03)
- Determine actual Google rating, update stats strip figure
- Files: `index.html`
- Risk: None — data correction

**0-C. Replace Google Review placeholder URL** (HIGH-01)
- Get real review shortlink from Google Business Profile dashboard
- Files: `index.html` line ~717
- Risk: None

**0-D. Remove careers TELECOMMUTE schema** (HIGH-05)
- Remove `"jobLocationType": "TELECOMMUTE"` from JSON-LD in `careers.html`
- Files: `careers.html`
- Risk: None

---

### Group 1 — High-Impact Functional Fixes (Next Sprint)

**1-A. Fix `how-it-works.js` targeting missing `#cta-form`** (CRIT-02)
- Add `id="cta-form"` to CTA form element in `how-it-works.html`, OR rename JS selector to match existing element ID
- Files: `how-it-works.html`, optionally `js/how-it-works.js`
- Risk: Low

**1-B. Fix active nav state on careers page** (HIGH-02)
- Move `.nav-link[aria-current="page"]::after` and `.site-header.is-scrolled .nav-link[aria-current="page"]` from 4 page CSS files into `main.css` §7
- Delete duplicate rules from `about.css`, `how-it-works.css`, `services.css`, `contact.css`
- Files: `css/main.css`, `css/about.css`, `css/how-it-works.css`, `css/services.css`, `css/contact.css`
- Risk: Low

**1-C. Add noindex meta to thank-you pages** (HIGH-06)
- Add `<meta name="robots" content="noindex, nofollow">` to `thank-you.html` and `careers-thank-you.html`
- Files: `thank-you.html`, `careers-thank-you.html`
- Risk: None

**1-D. Fix preload pointing to wrong logo file** (HIGH-04)
- Update `<link rel="preload" as="image">` in `index.html` to reference `logo-light2.png`
- Files: `index.html` line ~26
- Risk: None

**1-E. Remove dead code: services-page.js form handler** (HIGH-03)
- Remove lines 42–73 from `js/services-page.js` (form block that no-ops on every service page)
- Files: `js/services-page.js`
- Risk: None — the handler already exits at line 43

**1-F. Remove duplicate favicon override on root pages** (LOW-03)
- Remove `<link rel="icon" href="assets/logo/logo-dark.png">` from all root HTML pages
- Files: All 12 root HTML pages
- Risk: None — restores correct favicon

---

### Group 2 — CSS Architecture Cleanup (Planned Sprint)

**2-A. Consolidate `.section-hero--page` base styles into main.css** (ARCH-02 / MED-06)
- Extract shared declarations (background-size, background-repeat, min-height, svh fallback) from 4–5 page CSS files into `main.css`
- Files: `css/main.css`, `css/about.css`, `css/contact.css`, `css/services.css`, `css/how-it-works.css`, `css/services-page.css`
- Risk: Low — test hero sections on each page after change

**2-B. Fix undefined `--space-md` CSS token** (MED-01)
- Add `--space-md: 1.25rem` to `:root` in `main.css`, OR replace `var(--space-md)` in `thank-you.html` inline style with `1.25rem`
- Files: `thank-you.html` (or `css/main.css`)
- Risk: None

**2-C. Replace raw hex in `how-it-works.css` with tokens** (ARCH-03)
- Replace `#5F8F95` with `var(--color-teal)` and `#3d6b70` with `var(--color-teal-muted)` in `css/how-it-works.css`
- Files: `css/how-it-works.css`
- Risk: None

**2-D. Move footer group label styles to main.css** (DUP-11 / LOW-04)
- Add `.footer-group-label` rule to `main.css`
- Replace all 88 inline `style="..."` occurrences on footer group label spans with `class="footer-group-label"`
- Files: All 22 HTML pages (footer section only)
- Risk: Low — mechanical find-and-replace

**2-E. Add `defer` to all script tags** (ARCH-12 / LOW-07)
- Add `defer` attribute to all `<script src="...">` tags across all 22 pages
- Files: All 22 HTML pages (3 script tags per page = 66 edits)
- Risk: Very low — scripts already at bottom of body; `defer` is effectively a no-op here

---

### Group 3 — JS Architecture Cleanup

**3-A. Extract shared form validation utility** (ARCH-06 / DUP-07 / MED-04)
- Create `validateForm(formEl, { onSuccess, formName })` in `main.js`
- Move error color to CSS: add `--color-error: rgba(224, 112, 112, 0.8)` to `:root`, define `.field-invalid` class
- Refactor all 4 call sites to use the utility
- Files: `js/main.js`, `js/how-it-works.js`, `js/services-page.js`, `css/main.css`
- Risk: Medium — test all 4 form validation flows after change

**3-B. Move page-specific form handlers out of main.js** (ARCH-07)
- After Group 3-A, move contact handler to new `js/contact.js` (load only on `contact.html`)
- Move careers handler to new `js/careers.js` (load only on `careers.html`)
- Update `<script>` tags in respective HTML pages
- Files: `js/main.js`, new `js/contact.js`, new `js/careers.js`, `contact.html`, `careers.html`
- Risk: Low after 3-A extraction

**3-C. Consolidate FAQ accordion implementations** (DUP-08)
- Create `initAccordion(listSel, itemSel, triggerSel, panelSel)` using `services-page.js` as the canonical pattern (has `aria-expanded` and `hidden` attribute management)
- Update `how-it-works.js` to use the shared function
- Files: `js/how-it-works.js`, `js/services-page.js`
- Risk: Low — test accordion on both pages

---

### Group 4 — UX Copy Fixes (Content Pass)

**4-A. Standardize CTA labels** (LOW-01 / CP-5)
- Audit all button/CTA text site-wide
- Standardize to "Request a Free Assessment" as primary CTA
- Files: All HTML pages with CTA buttons (~10–15 pages)
- Risk: Low

**4-B. Rewrite thank-you page H1 and remove confusing "Send another message" link** (CP-7, CP-8)
- Files: `thank-you.html`
- Risk: None

**4-C. Fix thank-you.html landmark structure** (LOW-05)
- Convert `<div>` regions to `<section aria-labelledby>`
- Files: `thank-you.html`
- Risk: None

**4-D. Remove aria-hidden from meaningful content** (MED-08)
- Remove `aria-hidden="true"` from the process image column in `index.html` line ~597
- Files: `index.html`
- Risk: None

**4-E. Remove `TELECOMMUTE` from careers schema** (already in Group 0-D)

---

### Group 5 — Long-Term (SSG Migration)

**5-A. Adopt a static site generator** (DUP-01 through DUP-05, DUP-10)
- Recommended: Eleventy (minimal, pure HTML/CSS/JS compatible) or Astro (component-friendly)
- Extract header and footer to shared partials
- Define SITE_CONFIG (phone, email, address, service list) as a single data source
- Expected to resolve 6 of 11 duplication findings in one migration
- Risk: High (architecture change); Effort: High
- Prerequisite: Decide on static site generator before starting

---

## Execution Order Summary

| Priority | Group | Description |
|---|---|---|
| 🔴 Now | 0 | Wire forms, fix ratings, fix placeholder URL, remove TELECOMMUTE |
| 🟠 This sprint | 1 | Fix CRIT-02, active nav, noindex, preload, dead code, favicon |
| 🟡 Next sprint | 2 | CSS hero consolidation, undefined token, raw hex, footer labels, defer |
| 🟡 Next sprint | 3 | JS form validation extract, page-specific handlers, FAQ accordion |
| 🟢 Content pass | 4 | CTA labels, thank-you copy, landmark structure, aria-hidden |
| 🔵 Future | 5 | SSG migration |
