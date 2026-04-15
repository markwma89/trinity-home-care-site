# Code Review Summary — Trinity Home Care Site

**Last updated:** 2026-04-12

---

## Architecture & Congruency Review

> Full notes: [`architecture-review-notes.md`](architecture-review-notes.md)

### ACR-1 — `@keyframes rotateBorder` defined 1,370 lines after first use
- **File:** `css/main.css:1734`
- **Problem:** Keyframe is declared inside the Contact section but first applied at line 397 (Buttons). The `@property --border-angle` registration is at line 8. The animation system is split across 1,700 lines of file.
- **Why it matters:** Future developers changing the animation must find and update two disparate locations. The `@property` + `@keyframes` pair defines a system that should be self-contained.
- **Recommendation:** Move `@keyframes rotateBorder` to immediately after `@property --border-angle` at the top of the file (line ~12).

---

### ACR-2 — Duplicate 14-stop conic-gradient, no shared source
- **File:** `css/main.css:371` and `css/main.css:1752`
- **Problem:** The animated border gradient is defined twice with identical hardcoded hex values. Brand color changes require manual sync of both blocks.
- **Why it matters:** The two blocks will drift out of sync. The design tokens section already defines all these colors as CSS custom properties.
- **Recommendation:** Replace raw hex values with `var(--color-*)` tokens in both gradient declarations. Add `/* keep in sync with .contact-info::before */` comment to `.btn::before` and vice versa.

---

### ACR-3 — Animated border section is unnumbered
- **File:** `css/main.css:351–398`
- **Problem:** The "Animated gradient border — all CTAs" block sits between §5 and §6 without a number, breaking the section navigation system.
- **Why it matters:** The numbered-section system is the primary navigation aid in a 2,000-line stylesheet.
- **Recommendation:** Number as §6 "Animated Gradient Borders" and shift subsequent sections to §7–19.

---

### ACR-4 — Logo files use non-semantic names with spaces
- **File:** `assets/logo/`
- **Problem:** Files named "Golden elegance of Trinity Home Care.png" and "Trinity Home Care logo design (1).png" require URL encoding, don't convey their variant role, and are fragile to rename.
- **Why it matters:** Filenames with spaces break shell scripts, require `%20` encoding in URLs, and add cognitive load for every developer referencing them.
- **Recommendation:** Rename to `logo-light.png` / `logo-dark.png` and update all references.

---

*Review conducted via source inspection + Chrome DevTools visual audit.*
