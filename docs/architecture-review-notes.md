# Architecture and Congruency Review
**Last updated:** 2026-04-29
**Scope:** All 22 HTML pages, 7 CSS files, 3 JS files, /assets/ folder
**Prior review:** 2026-04-12 covered only `index.html`, `main.css`, `main.js` — this supersedes it

---

## Summary

The site is a well-disciplined, no-build-tool HTML/CSS/JS project. Design tokens are comprehensive and consistently applied — zero raw hex values appear outside `main.css` itself (where they define the tokens). The CSS section numbering system and IIFE pattern in JS are applied consistently across all files. Prior review findings (ACR-1 through ACR-4) were resolved on 2026-04-12. New issues focus on: a live nav-active-state CSS bug on `careers.html`, form handler separation of concerns, a duplicated hero base class, and SEO gaps on confirmation pages.

---

## CSS Architecture

### ARCH-01 — Active-nav rule duplicated in 4 page CSS files; missing from careers.css (BUG)
- **Type:** pattern-inconsistency / bug
- **Locations:** `.nav-link[aria-current="page"]::after` rule exists in `about.css`, `how-it-works.css`, `services.css`, and `contact.css`. **Missing from `careers.css`.**
- **Effect:** The active navigation underline/highlight does not appear on the careers page.
- **Fix:** Move both nav-active rules into `main.css` §7 (Header & Navigation). Delete copies from all four page files. `careers.html` gets it for free.
- **Priority:** High — live bug

### ARCH-02 — `.section-hero--page` base styles duplicated across 4–5 CSS files
- **Type:** duplicate / separation-of-concerns
- **Locations:** `about.css`, `contact.css`, `services.css`, `how-it-works.css`, `services-page.css` — all include `background-size: cover`, `background-repeat: no-repeat`, `min-height`, and the `svh` fallback pair.
- **Effect:** 4–5 files must change if shared hero height/size values change.
- **Fix:** Add `.section-hero--page` base rule to `main.css`. Each page CSS file keeps only its unique `background-image` and `background-position`.
- **Priority:** Medium

### ARCH-03 — Hardcoded hex values in `how-it-works.css` step card gradients
- **Type:** pattern-inconsistency
- **Location:** `css/how-it-works.css` lines ~150–154
- **Problem:** Raw hex `#5F8F95` (matches `--color-teal`) and `#3d6b70` (close to `--color-teal-muted`) used directly.
- **Fix:** Replace with `var(--color-teal)` and `var(--color-teal-muted)`.
- **Priority:** Low

### ARCH-04 — `#fff` in CSS mask declarations bypasses token system
- **Type:** naming (cosmetic)
- **Locations:** `css/services-page.css` lines ~314–319, `css/careers.css` lines ~286–291`
- **Fix:** Replace with `var(--color-white)` for consistency; `#fff` in mask contexts is functional but inconsistent with zero-raw-hex convention.
- **Priority:** Cosmetic

### ARCH-05 — `main.css` §14 (Process section) contains homepage-only styles
- **Type:** separation-of-concerns
- **Location:** `css/main.css` lines ~1299–1397 — `.section-process` / `.process-step` etc.
- **Problem:** These ~100 lines load on all 22 pages but are used only by `index.html`.
- **Fix:** Extract to `css/index.css` (consistent with the page-specific CSS pattern used everywhere else), or accept the overhead as negligible at this scale.
- **Priority:** Low

---

## JavaScript Architecture

### ARCH-06 — Form validation logic duplicated across 3–4 JS files
- **Type:** separation-of-concerns / duplicate
- **Locations:** `js/main.js:169–197` (contact), `js/main.js:203–259` (careers), `js/how-it-works.js:285–308` (CTA), `js/services-page.js:45–73` (service CTA). Hardcoded error color string appears in all four: `rgba(224, 112, 112, 0.8)`. Minor inconsistency: `how-it-works.js` omits spaces in `rgba()`.
- **Fix:** Extract `validateForm(formEl, onValid)` utility into `main.js`. Move error color to CSS custom property `--color-error` toggled via a class (`.field-invalid`).
- **Priority:** High maintainability

### ARCH-07 — `main.js` carries page-specific form handlers for contact and careers
- **Type:** separation-of-concerns
- **Location:** `js/main.js` lines 169–259 (80 lines of form handling in a global file)
- **Problem:** The file header lists responsibilities as: sticky header, mobile menu, scroll-reveal, smooth anchor scroll, stat counter. Form handling is not listed yet represents ~25% of the file. The careers handler (56 lines, checkbox + radio logic) is especially out of place.
- **Fix:** After ARCH-06 extraction, move contact handler to `js/contact.js` (new, loaded only on `contact.html`) and careers handler to `js/careers.js` (new, loaded only on `careers.html`).
- **Priority:** Medium

### ARCH-08 — How It Works CTA confirmation behavior differs from all other forms
- **Type:** pattern-inconsistency
- **Location:** `js/how-it-works.js` lines ~300–307
- **Problem:** On valid submission, shows "Request Sent" text in-place. Every other form redirects to a thank-you page. Undocumented.
- **Fix:** Either redirect to `thank-you.html` (consistent) or add a comment explaining the intentional divergence.
- **Priority:** Low

### ARCH-09 — `services-page.js` uses alternate IIFE form (cosmetic)
- **Type:** naming (cosmetic)
- **Problem:** `main.js` and `how-it-works.js` use `(function () { ... })()`. `services-page.js` uses `(function () { ... }())`. Both valid; standardize to one form.
- **Priority:** Cosmetic

---

## File Organization

### ARCH-10 — Thank-you pages missing noindex meta and structured head
- **Type:** missing-pattern
- **Location:** `thank-you.html` and `careers-thank-you.html` — both lack `<meta name="robots">`, Open Graph tags, canonical URL, and preload blocks present on every other page.
- **Critical gap:** No `noindex` directive — these pages may be indexed by search engines.
- **Fix:** Add `<meta name="robots" content="noindex, nofollow">` to both pages immediately.
- **Priority:** Medium (SEO)

### ARCH-11 — `services.css` vs `services-page.css` naming is unclear
- **Type:** naming
- **Problem:** `services.css` styles `services.html` (overview page); `services-page.css` styles the 10 individual service detail pages. The distinction is not obvious from names alone.
- **Fix:** Rename `services-page.css` to `service-detail.css` and update all 10 `<link>` tags. Or add header comments to both files.
- **Priority:** Low

### ARCH-12 — No `defer` attribute on any `<script>` tag
- **Type:** missing-pattern
- **Location:** All 22 pages — scripts placed at bottom of `<body>` without `defer`
- **Problem:** Technically correct (bottom placement) but adding `defer` enables parallel download during HTML parse.
- **Fix:** Add `defer` to all `<script src="...">` tags.
- **Priority:** Low

---

## Naming Conventions

CSS class naming uses a consistent BEM-adjacent pattern throughout: block names are semantic (`hiw-`, `service-`, `contact-`, `nav-`), state modifiers use `is-` prefix, variants use `--` modifier. No inconsistencies found.

JS uses `camelCase` for functions and variables, `SCREAMING_SNAKE_CASE` for module-level constants in `how-it-works.js`. Consistent with `main.js`.

File naming is `kebab-case` throughout. The only naming concern is `services.css` / `services-page.css` (ARCH-11).

---

## Pattern Consistency

CSS load order is consistent: `main.css` first, page-specific CSS second. Scripts load `main.js` first, page-specific JS second. All `/services/*.html` pages are fully uniform in their `<head>` structure. Root pages similarly consistent.

`how-it-works.js` correctly mirrors `main.js` structural patterns: IIFE, strict mode, `prefersReducedMotion` at top, optional chaining on DOM refs, event delegation.

One undocumented H3 pattern: every H3 in a list/card context explicitly overrides to `font-family: var(--font-body)` (Inter). This is a consistent design choice (Cormorant Garamond is too light at 18–20px in dense list items) but is achieved through repeated property overrides rather than a documented rule. Worth documenting as: "H3 in UI contexts = Inter SemiBold; H3 in editorial/hero contexts = Cormorant Garamond."

---

## Prior Review Items (2026-04-12) — Resolved

| ID | Finding | Resolution |
|---|---|---|
| ACR-1 | `@keyframes rotateBorder` 1,370 lines after first use | ✅ Moved to top of file on 2026-04-12 |
| ACR-2 | Duplicate 14-stop conic-gradient, no shared source | ✅ Tokenized with `var(--color-*)` on 2026-04-12 |
| ACR-3 | Animated border section unnumbered | ✅ Numbered as §6 on 2026-04-12 |
| ACR-4 | Logo files with non-semantic names/spaces | ✅ Renamed to logo-light2.png, logo-dark2.png on 2026-04-12 |

---

## Recommendations (Priority Order)

| # | Finding | Impact | Effort |
|---|---|---|---|
| 1 | ARCH-01: Move active-nav rule to main.css — fixes live careers bug | High | Low |
| 2 | ARCH-10: Add noindex to both thank-you pages | Medium (SEO) | Low |
| 3 | ARCH-06: Extract shared form validation utility + CSS error class | High maintainability | Medium |
| 4 | ARCH-07: Move page-specific form handlers out of main.js | Medium | Low (after ARCH-06) |
| 5 | ARCH-02: Consolidate .section-hero--page base into main.css | Medium | Low |
| 6 | ARCH-11: Rename services-page.css → service-detail.css | Low | Low |
| 7 | ARCH-12: Add defer to all script tags | Low | Low |
| 8 | ARCH-03: Replace raw hex in how-it-works.css gradients with tokens | Low | Low |
| 9 | ARCH-04: Replace #fff mask values with var(--color-white) | Cosmetic | Low |
| 10 | ARCH-08: Resolve How It Works CTA redirect inconsistency | Low | Low |
