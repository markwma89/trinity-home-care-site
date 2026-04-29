# Formality and Style Review
**Date:** 2026-04-29
**Scope:** All 22 pages, 7 CSS files, 3 JS files

---

## Summary

The codebase is professionally structured with clean naming and consistent CSS conventions. The primary code quality issues are inconsistent error-state handling across JS form validators and a handful of dead-code artifacts. The more impactful findings are in UX copy: a critical trust-destroying contradiction between star ratings on the same page, a live placeholder URL, and multiple inconsistent CTA labels that should be unified.

---

## Code Style Issues

### CS-1 — Dead variable in main.js
- **Location:** `js/main.js` line 110
- **Problem:** `startVal = 0` is an unused variable — the counter always starts from zero and the variable adds false generality.
- **Why it matters:** Dead code adds noise and suggests incomplete refactoring.
- **Recommended fix:** Remove `startVal` and simplify to `Math.round(target * eased)`.

### CS-2 — Comment restates obvious code
- **Location:** `js/main.js` line 319
- **Problem:** Comment `// hide the list when it was open, show it when it was closed` exactly restates `!isOpen` — pure noise.
- **Why it matters:** Restatement comments accumulate and dilute meaningful comments.
- **Recommended fix:** Delete the comment.

### CS-3 — Inconsistent error state between form handlers
- **Location:** `js/main.js` lines 178–181 (contact) vs lines 241–243 (careers)
- **Problem:** Contact form handler applies error state via `field.style.borderColor = 'rgba(...)'` (inline JS style mutation); careers form handler uses `classList.add('is-invalid')`. Two different mechanisms for the same UI state.
- **Why it matters:** If error appearance ever changes, two patterns must be updated separately. CSS specificity issues may arise mixing inline styles and classes.
- **Recommended fix:** Move error color to CSS (`.field-invalid { border-color: var(--color-error); }`), toggle a class in both handlers.

### CS-4 — Footer category labels with 7 inlined CSS declarations
- **Location:** Every page footer — 4 instances per footer × 22 pages = 88 inline `style` attributes
- **Problem:** Footer group labels carry `font-size:0.6875rem; font-weight:700; letter-spacing:0.07em; text-transform:uppercase; color:var(--color-teal); padding-bottom:2px; display:block` inline.
- **Why it matters:** Inline styles are the highest specificity and hardest to override. 88 occurrences of the same 7 declarations is a maintenance burden. Changing the style requires 88 edits.
- **Recommended fix:** Add `.footer-group-label` to `main.css`, apply class to HTML.

### CS-5 — Undefined CSS token `--space-md` in thank-you.html
- **Location:** `thank-you.html` line 79 (inline `<style>` block)
- **Problem:** References `var(--space-md)` — a CSS custom property that does not exist anywhere in `main.css`. The container gets `padding: 0` as a fallback, causing a layout issue on mobile.
- **Why it matters:** This is a live visual bug — padding collapses to zero on the thank-you page.
- **Recommended fix:** Replace `var(--space-md)` with `1.25rem` or define `--space-md: 1.25rem` in `main.css`.

### CS-6 — thank-you.html uses `<div>` where all other pages use `<section>`
- **Location:** `thank-you.html` lines 331 and 344
- **Problem:** Hero and body regions use `<div>` while every other page uses `<section aria-labelledby="...">`. Breaks the landmark navigation pattern used consistently across the site.
- **Why it matters:** Screen reader users navigating by landmarks will miss the thank-you page structure.
- **Recommended fix:** Convert to `<section>` with `aria-labelledby` matching the heading `id`.

### CS-7 — aria-hidden on meaningful content
- **Location:** `index.html` line 597
- **Problem:** `aria-hidden="true"` on the process image column hides the caption "Free assessment — at your home, at your convenience" from screen readers. The caption is meaningful content, not decoration.
- **Why it matters:** WCAG 2.1 failure — meaningful text is hidden from assistive technology.
- **Recommended fix:** Remove `aria-hidden` from the column or move it to only the decorative image element.

---

## UX Copy Issues

### CP-1 — CRITICAL: Contradictory star ratings on the same page
- **Location:** `index.html` stats strip (3.3 ★ Google Rating) vs testimonials section ("4.9 on Google · 200+ verified reviews")
- **Problem:** Two different ratings appear on the same page. The star display in the testimonials section renders 5 filled stars, consistent with 4.9 — not 3.3. The stats strip shows the wrong number.
- **Why it matters:** This destroys trust. A prospective client seeing both values will notice the contradiction and question all stated claims on the site.
- **Recommended fix:** Verify the actual current Google rating, update the stats strip to match, ensure the star display reflects the correct number of filled/half-filled stars.

### CP-2 — Live placeholder URL in production
- **Location:** `index.html` line 717
- **Problem:** `href="https://g.page/r/PLACEHOLDER/review"` is publicly accessible. Every visitor who clicks "Leave a Review" is sent to a dead Google URL.
- **Why it matters:** Dead links in public production code damage credibility and prevent review acquisition.
- **Recommended fix:** Replace `PLACEHOLDER` with the actual Google Business Profile review shortlink.

### CP-3 — Generic homepage H1
- **Location:** `index.html` h1
- **Problem:** "Compassionate In-Home Care for Families" is the same headline used by every home care competitor. The more differentiating language is below the fold ("Not a franchise. Not a call center.").
- **Why it matters:** The H1 is the highest-impact copy on the site. Generic phrasing wastes the most visible real estate.
- **Recommended fix (suggested):** "In-Home Care That Treats Your Family Like Family" or lead with the local/non-franchise differentiator at the headline level.

### CP-4 — All six service cards use identical CTA
- **Location:** `index.html` services section — all 6 service cards
- **Problem:** Every card uses "Ask about this service" — vague, passive, and identical.
- **Why it matters:** Repeated identical CTAs train users to ignore them. Specific CTAs ("Learn about personal care →") drive higher engagement.
- **Recommended fix:** Write a unique, service-specific CTA per card, or link each card to its respective service page.

### CP-5 — Four different CTA label variants site-wide
- **Locations:** Site-wide — "Schedule a Free Consultation", "Request a Free Assessment", "Free Consultation", "Schedule a Consultation"
- **Problem:** No consistent language for the primary conversion action.
- **Why it matters:** Inconsistent labels make the brand feel unpolished and reduce conversion by creating decision friction.
- **Recommended fix:** Standardize to one label site-wide. Recommended: "Request a Free Assessment" (action-oriented, specific to home care).

### CP-6 — "We're here." is too casual for the brand register
- **Location:** `index.html` contact section headline: "Ready to talk? We're here."
- **Problem:** The fragment "We're here." is more casual than the brand voice established elsewhere.
- **Recommended fix:** "Ready to talk? We'd love to help." — warmer without being sloppy.

### CP-7 — Thank-you page H1 is boilerplate
- **Location:** `thank-you.html` h1
- **Problem:** "Thank You for Reaching Out" is the most generic confirmation heading possible. It does not reassure the visitor or set next-step expectations.
- **Recommended fix:** "We received your message — and we're glad you reached out." or "Your message is in good hands." followed by a specific next-step promise ("We'll be in touch within one business day.").

### CP-8 — "Send another message" link confuses the confirmation experience
- **Location:** `thank-you.html`
- **Problem:** "Send another message" link on the confirmation page implies the first message was inadequate.
- **Recommended fix:** Relabel to "Visit our contact page" or remove it. Replace with a clear next-step link (e.g., "While you wait, learn about our services").

### CP-9 — Careers trust badges are generic
- **Location:** `careers.html` hero section — trust badges: Supportive Team Culture / Flexible Scheduling / Locally Owned / Meaningful Work
- **Problem:** These four claims are identical or near-identical to every competitor's careers page. They don't differentiate Trinity.
- **Recommended fix:** Make them specific: "A coordinator you can actually reach", "Schedules built around your life", "Owner-operated — not a franchise."

### CP-10 — No compensation information on careers page
- **Location:** `careers.html`
- **Problem:** No mention of pay rate, compensation range, or benefits anywhere on the page. For frontline caregivers, this is a primary evaluation factor; its absence may suppress applications.
- **Recommended fix:** Add a compensation/benefits section or at minimum a range statement ("Competitive pay · Flexible hours · Mileage reimbursement").

### CP-11 — careers JSON-LD marks in-person role as TELECOMMUTE
- **Location:** `careers.html` line 758, `<script type="application/ld+json">`
- **Problem:** `"jobLocationType": "TELECOMMUTE"` is set on a position requiring physical presence in client homes. This routes the job into remote-work search filters on Google Jobs.
- **Why it matters:** Misrepresents the role to job seekers; candidates clicking through expecting remote work will immediately bounce.
- **Recommended fix:** Remove the `jobLocationType` property entirely. The `jobLocation` address block already correctly identifies the role as Pittsburgh-based.

### CP-12 — "We prefer easy" misframes the brand value
- **Location:** `contact.html`
- **Problem:** "We prefer easy" is the most casual line on the site. It slightly undersells the brand's premium positioning.
- **Recommended fix:** "Reach us the way that works for you." — maintains the approachable tone without the casual slip.

---

## Priority Fixes (Ranked by Impact)

| # | Issue ID | Description | Effort |
|---|---|---|---|
| 1 | CP-1 | Fix contradictory star ratings (3.3 vs 4.9) | Low |
| 2 | CP-2 | Replace live `PLACEHOLDER` Google review URL | Low |
| 3 | CS-5 | Fix undefined `--space-md` CSS token in thank-you.html | Low |
| 4 | CP-11 | Remove `jobLocationType: TELECOMMUTE` from careers JSON-LD | Low |
| 5 | CS-7 | Remove aria-hidden from meaningful content on index.html | Low |
| 6 | CP-5 | Standardize CTA labels site-wide | Medium |
| 7 | CP-7 | Rewrite thank-you page H1 from boilerplate | Low |
| 8 | CP-4 | Rewrite service card CTAs (all 6 identical) | Low |
| 9 | CS-3 | Unify error-state styling across JS form handlers | Low–Medium |
| 10 | CS-4 | Extract footer category label styles from 88 inline occurrences | Medium |
