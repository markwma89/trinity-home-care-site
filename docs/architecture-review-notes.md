# Architecture Review — Trinity Home Care Site

**Reviewed:** 2026-04-12  
**Scope:** `css/main.css`, `index.html`, `js/main.js`  
**Site type:** Static single-page HTML5/CSS3/vanilla JS

---

## Summary

The codebase is a well-structured, single-page static site. The HTML, CSS, and JS each own their responsibilities cleanly. No framework drift, no mixing of concerns. The numbered section system in `main.css` is the primary architecture pattern — deviations from it are the main source of maintainability risk.

---

## Structural Issues

### 1. `@keyframes rotateBorder` defined 1,370 lines after first use

**Severity:** Medium — maintainability risk  
**Location:** `css/main.css:1734` (definition) vs `css/main.css:397` (first use in `.btn::before`)

`@keyframes rotateBorder` is declared inside the Contact Section block (§15), but the animation is first applied to `.btn::before` in the Buttons section (§5). The `@property --border-angle` registration lives at line 8.

The animation system (`@property` + `@keyframes`) should be co-located at the top of the file, directly below the `@property` declaration. This makes the animated border system self-contained and findable without scrolling 1,700 lines.

**Recommended fix:** Move `@keyframes rotateBorder` to immediately follow the `@property --border-angle` block at the top of the file (around line 12). Remove it from the Contact Section.

---

### 2. Duplicate conic-gradient color stops — two copies, no shared source

**Severity:** Medium — sync hazard  
**Locations:** `css/main.css:371–397` (buttons) and `css/main.css:1752–1784` (contact containers)

The 14-stop conic-gradient strip is defined twice with identical color stops. If brand colors change, both blocks must be updated manually and in sync. Native CSS has no mechanism to alias a full gradient, but:

- Both blocks can reference `var(--color-*)` tokens for each stop instead of raw hex. CSS `conic-gradient()` accepts `var()` for color values.
- A comment above each block should explicitly link them: `/* See also: .btn::before (§5) — keep color stops in sync */`

**Recommended fix:** Replace all raw hex color values in both gradients with the corresponding CSS custom properties. Add sync-warning comments. Example:

```css
background: conic-gradient(
  from var(--border-angle),
  var(--color-navy-dark)   0deg,
  var(--color-navy-dark)   285deg,
  var(--color-navy)        293deg,
  var(--color-navy-mid)    300deg,
  var(--color-teal-muted)  307deg,
  var(--color-teal)        313deg,
  var(--color-teal-light)  317deg,
  var(--color-sage)        320deg,
  var(--color-ivory-dark)  323deg,
  var(--color-gold-light)  326deg,
  var(--color-gold)        332deg,
  var(--color-teal-muted)  342deg,
  var(--color-navy)        353deg,
  var(--color-navy-dark)   360deg
);
```

---

### 3. Animated border block is unnumbered — breaks the section system

**Severity:** Low — discoverability  
**Location:** `css/main.css:351–398`

The animated gradient border block sits between "5. Buttons" and "6. Header & Navigation" without a section number. The numbered section system is the primary navigation aid in a 2,000-line file. The unnumbered block creates a blind spot.

**Recommended fix:** Number it as section 5a or renumber subsequent sections and call it "6. Animated Gradient Borders." The latter is preferable since it cleanly separates button styles from their animation decoration.

---

## Naming Issues

### 4. Logo filenames are non-semantic and contain spaces

**Severity:** Low — developer experience  
**Location:** `assets/logo/`

Current filenames:
- `Golden elegance of Trinity Home Care.png` (light/gold version)
- `Trinity Home Care logo design (1).png` (dark version)
- `Trinity Home Care logo design (2).png` (unused)
- `Trinity Home Care logo design.png` (unused)
- `Trinity Home Care branding presentation.png` (reference asset)

These names break URL encoding conventions and are hard to reference. They also don't convey which variant each file is (light/dark, header/footer/favicon).

**Recommended rename:**

| Current | Recommended |
|---------|-------------|
| `Golden elegance of Trinity Home Care.png` | `logo-light.png` |
| `Trinity Home Care logo design (1).png` | `logo-dark.png` |
| `Trinity Home Care logo design.png` | `logo-variant-a.png` (archive) |
| `Trinity Home Care logo design (2).png` | `logo-variant-b.png` (archive) |
| `Trinity Home Care branding presentation.png` | (move to `docs/assets/`) |

Update all references in `index.html` and `css/main.css` accordingly.

---

## Congruency Issues

### 5. Z-index tokens inconsistently applied in hero section

**Severity:** Low — cosmetic  
**Location:** `css/main.css:758, 772, 789`

The design tokens define a z-index scale (`--z-base: 1`, `--z-above: 10`, `--z-header: 100`, `--z-modal: 200`). The hero section uses raw values (z-index: 0, 1, 2) for the stacking context of video/overlay/content. This is technically correct — these values are relative to the hero stacking context, not the document — but the pattern diverges from the token system.

The raw values are defensible here since 0/1/2 are a local stacking context, not document-level z-indexes. No change required, but a comment explaining the local-context intent would prevent future confusion.

---

## What's Working Well

- **Single-file architecture is correct** for a one-page static site. Splitting into partials would add build tooling complexity with no benefit at this scale.
- **Design tokens are comprehensive** and consistently used throughout the property declarations.
- **CSS section numbering** (1–18) makes the file navigable despite its length.
- **Separation of concerns** is clean: HTML for structure, CSS for presentation, JS for behavior. No inline styles, no embedded scripts.
- **Accessibility patterns** are consistently applied: `aria-label`, `aria-hidden`, `role` attributes, `skip-link`, `.sr-only`, keyboard nav, focus rings.
- **`prefers-reduced-motion`** is honored in both CSS (Section 18) and JS.
- **Asset folder structure** (`images/hero/`, `images/services/`, `images/supporting/`, `video/`) is semantic and scales cleanly.

---

## Recommended Architecture Changes (Priority Order)

| Priority | Change | Impact |
|----------|--------|--------|
| 1 | Move `@keyframes rotateBorder` to top of file near `@property` | High — eliminates forward-reference confusion |
| 2 | Replace raw hex in gradients with `var(--color-*)` tokens | Medium — single source of truth for brand colors |
| 3 | Number the animated border section | Low — discoverability in a 2,000-line file |
| 4 | Rename logo files to semantic names | Low — developer experience, URL cleanliness |
| 5 | Add local-context comment to hero z-index values | Low — prevents future confusion |
