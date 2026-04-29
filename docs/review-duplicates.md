# Duplicate Code Review Findings
**Date:** 2026-04-29
**Scope:** All 22 HTML pages, 7 CSS files, 3 JS files

---

## Summary

The site was built by copy-pasting a template page and manually editing per-page content. No shared include system, no templating, no component abstraction. This produces two categories of duplication: (1) structural skeleton — header, nav dropdown, footer, and mobile CTA bar are copy-pasted verbatim across all 22 pages; and (2) repeated implementation details — same CSS declarations, JS logic blocks, and HTML fragments appearing 2–4 times independently. Eleven distinct findings below, ordered by impact.

---

## Findings

### DUP-01: Service page HTML skeleton (header + footer + mobile CTA bar)
- **Type:** exact
- **Locations:** All 22 HTML pages — header (~lines 1–140), footer (~lines 370–437), mobile CTA bar (~lines 439–450). ~160 lines per page × 22 pages ≈ 3,520 lines of structural duplication.
- **Why it matters:** Any navigation update requires 22 manual edits. Drift has already begun: `about.html` nav CTA href is `#contact` while all other pages use `contact.html`.
- **Recommended fix:** Adopt SSG (Eleventy, Astro) or a minimal HTML-partials build step. Extract header and footer into `_partials/header.html` and `_partials/footer.html`. Per-page variables needed: `pageTitle`, `metaDescription`, `canonicalUrl`, `ogImage`, `heroImage`, `ariaCurrentPage`, body content block.
- **Risk if left:** high
- **Effort:** medium

### DUP-02: Nav services dropdown HTML
- **Type:** exact
- **Locations:** Every page header — identical `<ul class="nav-dropdown">` block (~40 lines) listing all 10 service links. Service pages prefix with `../`; root pages use `services/`. 22 copies total.
- **Why it matters:** Adding, removing, or renaming a service requires editing the dropdown in every page.
- **Recommended fix:** Absorbed by DUP-01. Interim: JS nav injection from a single `_nav.html` fetch.
- **Risk if left:** high
- **Effort:** low (if DUP-01 in progress); medium (standalone)

### DUP-03: Service page CTA section
- **Type:** exact
- **Locations:** All 10 `services/*.html` files, ~lines 351–371. Only the `id` attribute on the `<h2>` differs. Body copy, phone number, disclaimer are word-for-word identical across all 10.
- **Why it matters:** Phone number `412-345-3721` appears here 10 times. A number change requires 10 edits.
- **Recommended fix:** Extract as `_partials/service-cta.html`. Interim: JS injection into a `<div id="service-cta-mount">` placeholder.
- **Risk if left:** medium
- **Effort:** low

### DUP-04: Hero trust badges block
- **Type:** exact
- **Locations:** All 10 `services/*.html` files, ~lines 170–187. Identical 4-item list (No Obligation, Free Assessment, Locally Owned, Care Starts Fast) with identical inline SVGs.
- **Why it matters:** Adding or reordering a badge requires editing 10 files. Inline SVG paths add ~320 lines of identical markup site-wide.
- **Recommended fix:** Move SVGs to a sprite (`assets/icons/sprite.svg`). Extract block as a partial.
- **Risk if left:** low
- **Effort:** low (partial); medium (full SVG sprite)

### DUP-05: Phone number SVG button (mobile CTA bar and hero)
- **Type:** exact
- **Locations:** Mobile CTA bar on all 10 service pages (~lines 439–450); hero phone link on all 10 service pages (~lines 155–165); root page CTA bars. 20+ copies of the same phone SVG path and `tel:` href.
- **Why it matters:** A phone number change is a 20+ file operation. Missed `tel:` links on any page lose call conversions.
- **Recommended fix:** SVG sprite for icon. Store phone number as a single JS or build variable injected into all `tel:` links.
- **Risk if left:** medium
- **Effort:** low (find-and-replace script); medium (proper centralization)

### DUP-06: Rotating gradient border (14-stop conic-gradient)
- **Type:** exact
- **Locations:** `css/main.css` ~line 371 (`.btn::before`), ~line 1752 (`.contact-info::before`), `css/contact.css` ~line 283 (`.contact-form-card::before`), `css/careers.css` ~line 262 (`.careers-form-card::before`). Author left "keep in sync" comments acknowledging the manual sync requirement.
- **Why it matters:** 4 copies must be updated in lockstep when any color token changes.
- **Recommended fix:** Define gradient once as a CSS custom property on `:root`: `--gradient-border: conic-gradient(from var(--border-angle), …)`. Reference from all four selectors.
- **Risk if left:** medium
- **Effort:** low

### DUP-07: Form validation JS core pattern
- **Type:** near-duplicate
- **Locations:** `js/main.js` lines 169–197 (contact), `js/main.js` lines 202–259 (careers), `js/how-it-works.js` lines 284–308 (CTA), `js/services-page.js` lines 41–73 (service CTA). Shared literal across all four: `field.style.borderColor = 'rgba(224, 112, 112, 0.8)'`. Minor formatting inconsistency: `how-it-works.js` omits spaces in `rgba()`.
- **Why it matters:** Error color, disabled-button pattern, and field-loop logic must be kept in sync across 4 locations. New forms will likely miss the checkbox/radio special-casing.
- **Recommended fix:** Extract `validateForm(formEl, { onSuccess })` in `main.js`. Each call site passes its own `onSuccess` callback.
- **Risk if left:** medium
- **Effort:** low

### DUP-08: FAQ accordion JS
- **Type:** near-duplicate
- **Locations:** `js/how-it-works.js` lines 265–280 (uses `.hiw-faq-list`, lacks `aria-expanded`), `js/services-page.js` lines 11–37 (uses `.service-faq-item`, manages `aria-expanded` and `hidden`).
- **Why it matters:** Two accordion implementations for the same pattern. `how-it-works.js` lacks `aria-expanded`, making it less accessible. The more capable services-page implementation should be canonical.
- **Recommended fix:** Consolidate into `initAccordion(listSel, itemSel, triggerSel, panelSel)` using the `services-page.js` approach.
- **Risk if left:** low
- **Effort:** low

### DUP-09: contact.css vs careers.css form intro and note styles
- **Type:** exact
- **Locations:** `css/contact.css` ~lines 245–272 (`.form-intro > p` + `.form-intro-note`), `css/careers.css` ~lines 203–221 (`.careers-form-intro > p` + `.careers-form-note`). Identical declarations, different class names.
- **Why it matters:** Style changes require editing two files. Inconsistent class naming obscures the relationship.
- **Recommended fix:** Move shared declarations to `main.css` utility classes. Update HTML to use shared class names.
- **Risk if left:** low
- **Effort:** low

### DUP-10: Schema.org provider block in JSON-LD
- **Type:** exact
- **Locations:** All 10 `services/*.html` files, `<script type="application/ld+json">` block (~lines 20–53). Identical `provider` object with business name, telephone, and Pittsburgh PA address.
- **Why it matters:** Phone number lives here as well as in visible HTML. A number change must update DUP-05 locations and these 10 JSON-LD blocks.
- **Recommended fix:** Build-time variable injection via SSG (resolved by DUP-01). Interim: small script that patches the `ld+json` block from `window.SITE_CONFIG`.
- **Risk if left:** low
- **Effort:** low

### DUP-11: Footer group label inline styles
- **Type:** exact
- **Locations:** Every page footer (22 pages). Each `<span class="footer-link">` group label carries a 7-property inline `style` attribute. 4 instances per footer × 22 pages = 88 inline style blocks.
- **Why it matters:** These styles belong in `main.css`. Inline styles override CSS specificity. Any value change requires 88 attribute edits.
- **Recommended fix:** Move declarations to `.footer-group-label` in `main.css`. Replace inline `style="…"` with the shared class.
- **Risk if left:** low
- **Effort:** low

---

## Priority Order

| Priority | ID | Title | Risk | Effort |
|---|---|---|---|---|
| 1 | DUP-01 | HTML skeleton (header + footer + mobile CTA) | high | medium |
| 2 | DUP-02 | Nav services dropdown | high | low* |
| 3 | DUP-03 | Service CTA section | medium | low |
| 4 | DUP-07 | Form validation JS | medium | low |
| 5 | DUP-05 | Phone number / SVG button | medium | low |
| 6 | DUP-06 | Rotating gradient border CSS | medium | low |
| 7 | DUP-04 | Hero trust badges block | low | low |
| 8 | DUP-08 | FAQ accordion JS | low | low |
| 9 | DUP-09 | contact.css vs careers.css form styles | low | low |
| 10 | DUP-10 | Schema.org provider block | low | low |
| 11 | DUP-11 | Footer group label inline styles | low | low |

*DUP-02 effort is "low" if DUP-01 SSG migration is underway; medium as a standalone fix.

**Recommended sequencing:** Adopt SSG/partials first (resolves DUP-01, 02, 03, 04, 05, 10 in one migration). Then extract shared form validation (DUP-07) and gradient border custom property (DUP-06) as quick isolated wins. Clean up inline footer styles (DUP-11) and consolidate accordion/form CSS (DUP-08, DUP-09) last.
