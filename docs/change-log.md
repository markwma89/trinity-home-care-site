# Change Log — Trinity Home Care Site

---

## 2026-04-12 — Architecture & Congruency Refactor

**Driven by:** `docs/code-review-summary.md` (ACR-1 through ACR-4)

---

### `css/main.css`

**A1. Moved `@keyframes rotateBorder` to top of file**
- Was: Line ~1734, inside the Contact section
- Now: Immediately after `@property --border-angle` (line ~13)
- Why: The animation system (`@property` + `@keyframes`) should be co-located. The keyframes were being used 1,370 lines before their definition.
- Risk: None — CSS keyframes are not source-order dependent.

**A2. Replaced raw hex values with CSS token references in both gradient blocks**
- Was: 14 hardcoded hex values (e.g., `#172B44`, `#5F8F95`) in `.btn::before` and `.contact-info::before`
- Now: `var(--color-navy-dark)`, `var(--color-teal)`, etc.
- Why: Brand color changes now propagate from the design tokens section automatically; no manual sync required.
- Added cross-reference comments: each block notes to keep in sync with the other.
- Risk: None — `var()` resolves identically to the hex values.

**A3. Numbered the animated gradient border section; renumbered downstream sections**
- Was: Unlabeled block between §5 and §6
- Now: §6 "Animated Gradient Borders"; former §6–17 shifted to §7–18; former §18 "Reduced Motion" is now §19.
- Why: The numbered section system is the primary navigation aid in a 2,000-line stylesheet.
- Risk: None — comment change only.

---

### `index.html`

**B1. Updated all logo `src` references to semantic filenames**
- Header light logo: `Golden elegance of Trinity Home Care.png` → `logo-light.png`
- Header dark logo: `Trinity Home Care logo design (1).png` → `logo-dark.png`
- Footer logo: same light → `logo-light.png`
- Favicon `<link>`: dark → `logo-dark.png`
- Preload `<link>`: light → `logo-light.png`
- Why: Files with spaces in names require URL encoding, are fragile to shell operations, and don't convey variant role.

---

### `assets/logo/`

**B1. Added semantic copies of active logo files**
- `logo-light.png` — copy of "Golden elegance of Trinity Home Care.png" (gold/light variant, used on dark hero)
- `logo-dark.png` — copy of "Trinity Home Care logo design (1).png" (dark variant, used on scrolled header + footer)
- Original files retained for reference; can be archived or removed after client confirms.

---

## Follow-up Items

| Item | Priority | Notes |
|------|----------|-------|
| Remove original logo files with spaces in names | Low | Retain until client confirms no external references |
| Archive unused logo variants (design.png, design (2).png, branding presentation.png) | Low | Move to `docs/assets/` or delete after review |
| Replace Google review placeholder URL in testimonials CTA | High | `https://g.page/r/PLACEHOLDER/review` needs real shortlink |

---

## 2026-04-12 — Mobile & Visual Audit Fixes

**Driven by:** Chrome DevTools visual review (desktop 1440px, iPhone 14 Pro 390px, iPhone SE 375px)

### `css/main.css`

**Logo sizing corrected to industry-standard proportions**
- Was: `height: 70px; width: 100px` — logo was constrained to a square, rendering at ~67px wide (under-utilizing the 1.5:1 aspect ratio)
- Now: `height: 80px; width: auto; max-width: 240px` — renders at ~120×80px
- Mobile: `height: 64px; max-width: 180px`
- Footer: `height: 60px; width: auto; max-width: 200px`

**Nav phone number hidden on mobile**
- Was: `.nav-phone` visible on all viewport widths
- Now: `display: none` at element level; restored via `@media (min-width: 768px)`
- Why: On 375px viewport, the phone number competed with the hamburger for header space.

**Header padding reduced**
- Was: `padding-block: 1.25rem` (scrolled: `0.875rem`)
- Now: `padding-block: 0.75rem` (scrolled: `0.625rem`)
- Why: Tighter header gives logo more proportional weight.

**Hero inner padding-top reduced**
- Was: `8rem` mobile / `10rem` desktop
- Now: `6.5rem` mobile / `8.5rem` desktop
- Why: Compensates for tighter header; hero content now aligns correctly.

**Trust chip layout fixed on mobile**
- Was: `flex-wrap: wrap` with 1.75rem column gap — caused 3-row irregular layout on narrow viewports
- Now: `display: grid; grid-template-columns: 1fr 1fr` on `max-width: 767px` — clean 2×2 layout
- Font size reduced to `0.75rem` on mobile for readability within grid cells.

### `js/main.js`

**Mobile nav rewritten as dropdown (was full-screen overlay)**
- Was: Full-screen modal overlay that obscured page content
- Now: `position: absolute; top: 100%` dropdown panel anchored to header bottom
- Includes `opacity + transform + visibility` transition (no `display` toggle)
- Aria-managed: `aria-expanded`, `aria-hidden`, keyboard Escape key support, focus management
