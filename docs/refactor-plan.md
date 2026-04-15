# Refactor Plan — Trinity Home Care Site

**Date:** 2026-04-12  
**Source:** `docs/code-review-summary.md`, `docs/architecture-review-notes.md`  
**Scope:** `css/main.css`, `index.html`, `assets/logo/`

---

## Change Groups

### Group A — Architecture Cleanup (main.css)

**A1. Move `@keyframes rotateBorder` to top of file**
- Remove from line ~1734 (Contact section)
- Insert immediately after `@property --border-angle` (line 12)
- Risk: None — CSS keyframes are not order-dependent; browsers hoist them
- Expected outcome: Animation system fully co-located at top of file

**A2. Replace raw hex with `var(--color-*)` tokens in both gradient blocks**
- Targets: `.btn::before` gradient (~line 371) and `.contact-info::before` gradient (~line 1752)
- Mapping: See architecture-review-notes.md §2 for full token table
- Risk: Low — CSS custom properties resolve identically to their values
- Expected outcome: Single source of truth; brand color changes propagate automatically

**A3. Number the animated border section**
- Change section header from unlabeled to "6. Animated Gradient Borders"
- Renumber §6 Header → §7, §7 Mobile Nav → §8, …§17 Mobile CTA Bar → §18, §18 Reduced Motion → §19
- Risk: None — cosmetic comment change only

---

### Group B — Asset Rename (assets/logo/)

**B1. Rename logo files to semantic names**
- `Golden elegance of Trinity Home Care.png` → `logo-light.png`
- `Trinity Home Care logo design (1).png` → `logo-dark.png`
- Update all references in `index.html` and `css/main.css`
- Risk: Low — static site, all references in two files

---

## Execution Order

1. A3 — Numbering (zero-risk, clerical)
2. A1 — Move keyframes (zero-risk, browser-hoisted)
3. A2 — Tokenize gradient colors (low-risk, pure equivalence)
4. B1 — Rename logo files + update references (low-risk, reference update)

---

## Out of Scope

- Consolidating the two gradient blocks into a single declaration (not possible in CSS without custom properties or a build step)
- Adding a z-index comment to the hero section (documented but not worth a file change)
