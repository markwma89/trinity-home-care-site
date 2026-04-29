# Individual Service Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build 10 individual SEO-optimized service landing pages at `/services/*.html`, add a grouped dropdown to the Services nav item across all pages, and update footer links site-wide.

**Architecture:** Pure static HTML — 10 complete HTML files sharing `css/services-page.css` and `js/services-page.js`. Nav dropdown CSS/JS lives in `main.css`/`main.js`. All content is in HTML (no JS rendering). Service pages live at `/services/` and use `../` prefix for all asset/nav paths.

**Tech Stack:** Vanilla HTML/CSS/JS. No build step. No frameworks. Syntax check: `node --check`. Visual verification in browser.

**Spec:** `docs/superpowers/specs/2026-04-29-individual-service-pages-design.md`

---

## File Map

**Create (12):**
```
services/personal-care.html
services/companion-care.html
services/medication-reminders.html
services/meal-preparation.html
services/light-housekeeping.html
services/mobility-safety-support.html
services/dementia-alzheimers-care.html
services/respite-care.html
services/post-hospital-recovery.html
services/veteran-care.html
css/services-page.css
js/services-page.js
```

**Modify (7):**
```
main.css          — append nav dropdown styles
main.js           — add dropdown JS before closing })();
index.html        — desktop nav + mobile nav + footer Services column
about.html        — desktop nav + mobile nav + footer Services column
contact.html      — desktop nav + mobile nav + footer Services column
how-it-works.html — desktop nav + mobile nav + footer Services column
services.html     — desktop nav + mobile nav + service card links + footer
```

---

### Task 1: Nav dropdown CSS — main.css

**Files:**
- Modify: `main.css` (append to end of file)

- [ ] **Step 1: Verify the dropdown doesn't exist yet**

```bash
grep -n "nav-has-dropdown\|nav-dropdown" css/main.css
```
Expected: no matches.

- [ ] **Step 2: Append the nav dropdown styles to the end of main.css**

Open `main.css` and append this block after the last line:

```css
/* ── Nav Dropdown ──────────────────────────────────────────────────── */
.nav-has-dropdown { position: relative; }

.nav-chevron {
  display: inline-block;
  font-style: normal;
  font-size: 0.75rem;
  margin-left: 3px;
  transition: transform 200ms;
}
.nav-has-dropdown.is-open .nav-chevron { transform: rotate(90deg); }

.nav-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: -16px;
  background: var(--color-white);
  border: 1px solid var(--color-ivory-dark);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);
  min-width: 240px;
  padding: 6px 0;
  list-style: none;
  margin: 0;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-6px);
  transition: opacity 200ms, transform 200ms, visibility 0s 200ms;
  z-index: 200;
}

.nav-has-dropdown:hover .nav-dropdown,
.nav-has-dropdown.is-open .nav-dropdown {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
  transition: opacity 200ms, transform 200ms, visibility 0s;
}

.nav-dropdown-all {
  display: block;
  padding: 8px 16px;
  color: var(--color-navy);
  font-weight: 600;
  font-size: 0.875rem;
  text-decoration: none;
  border-bottom: 1px solid var(--color-ivory-dark);
}
.nav-dropdown-all:hover { color: var(--color-teal); }

.nav-dropdown-group-label {
  display: block;
  padding: 8px 16px 2px;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.nav-dropdown-group-label--teal { color: var(--color-teal); }
.nav-dropdown-group-label--gold { color: var(--color-gold); margin-top: 4px; }

.nav-dropdown li a:not(.nav-dropdown-all) {
  display: block;
  padding: 5px 16px 5px 24px;
  color: var(--color-text-sub);
  font-size: 0.875rem;
  text-decoration: none;
  transition: color 150ms;
}
.nav-dropdown li a:not(.nav-dropdown-all):hover { color: var(--color-teal); }
.nav-dropdown li a[aria-current="page"] { color: var(--color-teal); font-weight: 600; }

/* Mobile nav dropdown */
.mobile-nav-has-dropdown { display: contents; }

.mobile-nav-trigger {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  font: inherit;
  padding: 0;
  color: inherit;
  text-align: left;
}
.mobile-chevron {
  transition: transform 200ms;
  font-style: normal;
}
.mobile-nav-trigger[aria-expanded="true"] .mobile-chevron { transform: rotate(90deg); }

.mobile-nav-dropdown {
  list-style: none;
  margin: 4px 0 8px 0;
  padding: 0 0 0 12px;
  border-left: 2px solid var(--color-ivory-dark);
}
.mobile-nav-dropdown li a {
  display: block;
  padding: 6px 0;
  font-size: 0.9375rem;
  text-decoration: none;
  color: inherit;
}
.mobile-nav-dropdown-all {
  font-weight: 600;
  color: var(--color-navy);
  padding-bottom: 8px !important;
  border-bottom: 1px solid var(--color-ivory-dark);
  margin-bottom: 4px;
}
.mobile-nav-group-label {
  display: block;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 6px 0 2px;
}
.mobile-nav-group-label--teal { color: var(--color-teal); }
.mobile-nav-group-label--gold { color: var(--color-gold); }
```

- [ ] **Step 3: Verify no syntax errors**

```bash
node --check css/main.css
```
CSS files don't run through Node — instead open `index.html` in a browser and confirm there are no console errors.

- [ ] **Step 4: Commit**

```bash
git add css/main.css
git commit -m "feat: add nav dropdown CSS to main.css"
```

---

### Task 2: Nav dropdown JS — main.js

**Files:**
- Modify: `js/main.js`

- [ ] **Step 1: Fix mobile menu focus target (line 41)**

Current line 41:
```js
    const firstLink = mobileNav.querySelector('a');
```
Replace with:
```js
    const firstLink = mobileNav.querySelector('button, a');
```
This ensures focus lands on the Services trigger button (not a hidden dropdown link) when the mobile menu opens.

- [ ] **Step 2: Add dropdown JS before the closing `})();` at line 200**

Insert this block at line 199 (before `})();`):

```js
  /* -----------------------------------------------------------------
     Desktop nav dropdown — hover intent (150ms) + keyboard + outside click
     ----------------------------------------------------------------- */
  (function () {
    var dropdowns = document.querySelectorAll('.nav-has-dropdown');
    dropdowns.forEach(function (el) {
      var timer;
      var trigger = el.querySelector('.nav-dropdown-trigger');
      if (!trigger) return;

      el.addEventListener('mouseenter', function () {
        clearTimeout(timer);
        timer = setTimeout(function () {
          trigger.setAttribute('aria-expanded', 'true');
          el.classList.add('is-open');
        }, 150);
      });

      el.addEventListener('mouseleave', function () {
        clearTimeout(timer);
        timer = setTimeout(function () {
          trigger.setAttribute('aria-expanded', 'false');
          el.classList.remove('is-open');
        }, 150);
      });

      trigger.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          var isOpen = el.classList.contains('is-open');
          trigger.setAttribute('aria-expanded', String(!isOpen));
          el.classList.toggle('is-open', !isOpen);
        }
        if (e.key === 'Escape') {
          trigger.setAttribute('aria-expanded', 'false');
          el.classList.remove('is-open');
          trigger.focus();
        }
      });
    });

    document.addEventListener('click', function (e) {
      dropdowns.forEach(function (el) {
        if (!el.contains(e.target)) {
          var trigger = el.querySelector('.nav-dropdown-trigger');
          if (trigger) trigger.setAttribute('aria-expanded', 'false');
          el.classList.remove('is-open');
        }
      });
    });
  }());

  /* -----------------------------------------------------------------
     Mobile nav sub-dropdown accordion
     ----------------------------------------------------------------- */
  document.querySelectorAll('.mobile-nav-trigger').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var isOpen = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!isOpen));
      var list = btn.nextElementSibling;
      if (list) list.hidden = isOpen;
    });
  });
```

- [ ] **Step 3: Syntax check**

```bash
node --check js/main.js
```
Expected: no output (clean).

- [ ] **Step 4: Commit**

```bash
git add js/main.js
git commit -m "feat: add nav dropdown and mobile accordion JS to main.js"
```

---

### Task 3: Nav + footer HTML — index.html

**Files:**
- Modify: `index.html`

The desktop nav Services `<li>` is at line 77. The mobile nav Services `<a>` is at line 112. The footer Services column is at lines 888–899.

- [ ] **Step 1: Replace desktop nav Services `<li>` (line 77)**

Replace:
```html
          <li><a href="services.html"      class="nav-link">Services</a></li>
```
With:
```html
          <li class="nav-item nav-has-dropdown">
            <a href="services.html" class="nav-link nav-dropdown-trigger"
               aria-haspopup="true" aria-expanded="false">
              Services <span class="nav-chevron" aria-hidden="true">›</span>
            </a>
            <ul class="nav-dropdown" role="menu" aria-label="Services menu">
              <li role="presentation">
                <a href="services.html" class="nav-dropdown-all" role="menuitem">All Services →</a>
              </li>
              <li role="presentation" class="nav-dropdown-group-label nav-dropdown-group-label--teal" aria-hidden="true">Core Services</li>
              <li role="presentation"><a href="services/personal-care.html" role="menuitem">Personal Care</a></li>
              <li role="presentation"><a href="services/companion-care.html" role="menuitem">Companion Care</a></li>
              <li role="presentation"><a href="services/medication-reminders.html" role="menuitem">Medication Reminders</a></li>
              <li role="presentation"><a href="services/meal-preparation.html" role="menuitem">Meal Preparation</a></li>
              <li role="presentation"><a href="services/light-housekeeping.html" role="menuitem">Light Housekeeping</a></li>
              <li role="presentation"><a href="services/mobility-safety-support.html" role="menuitem">Mobility &amp; Safety Support</a></li>
              <li role="presentation" class="nav-dropdown-group-label nav-dropdown-group-label--gold" aria-hidden="true">Specialized Care</li>
              <li role="presentation"><a href="services/dementia-alzheimers-care.html" role="menuitem">Dementia &amp; Alzheimer's Care</a></li>
              <li role="presentation"><a href="services/respite-care.html" role="menuitem">Respite Care</a></li>
              <li role="presentation"><a href="services/post-hospital-recovery.html" role="menuitem">Post-Hospital Recovery</a></li>
              <li role="presentation"><a href="services/veteran-care.html" role="menuitem">Veteran Care</a></li>
            </ul>
          </li>
```

- [ ] **Step 2: Replace mobile nav Services `<a>` (line 112)**

Replace:
```html
      <a href="services.html"      class="nav-mobile-link">Services</a>
```
With:
```html
      <button class="nav-mobile-link mobile-nav-trigger" aria-expanded="false">
        Services <span class="mobile-chevron" aria-hidden="true">›</span>
      </button>
      <ul class="mobile-nav-dropdown" hidden>
        <li><a href="services.html" class="mobile-nav-dropdown-all">All Services →</a></li>
        <li><span class="mobile-nav-group-label mobile-nav-group-label--teal">Core Services</span></li>
        <li><a href="services/personal-care.html">Personal Care</a></li>
        <li><a href="services/companion-care.html">Companion Care</a></li>
        <li><a href="services/medication-reminders.html">Medication Reminders</a></li>
        <li><a href="services/meal-preparation.html">Meal Preparation</a></li>
        <li><a href="services/light-housekeeping.html">Light Housekeeping</a></li>
        <li><a href="services/mobility-safety-support.html">Mobility &amp; Safety Support</a></li>
        <li><span class="mobile-nav-group-label mobile-nav-group-label--gold">Specialized Care</span></li>
        <li><a href="services/dementia-alzheimers-care.html">Dementia &amp; Alzheimer's Care</a></li>
        <li><a href="services/respite-care.html">Respite Care</a></li>
        <li><a href="services/post-hospital-recovery.html">Post-Hospital Recovery</a></li>
        <li><a href="services/veteran-care.html">Veteran Care</a></li>
      </ul>
```

- [ ] **Step 3: Replace the footer Services column (lines 888–899)**

Replace:
```html
        <!-- Services -->
        <div>
          <h4 class="footer-col-title">Services</h4>
          <ul class="footer-links" role="list">
            <li><a href="services.html#services"         class="footer-link">Personal Care</a></li>
            <li><a href="services.html#services"         class="footer-link">Companion Care</a></li>
            <li><a href="services.html#services"         class="footer-link">Medication Reminders</a></li>
            <li><a href="services.html#services"         class="footer-link">Meal Preparation</a></li>
            <li><a href="services.html#services"         class="footer-link">Light Housekeeping</a></li>
            <li><a href="services.html#specialized-care" class="footer-link">Specialized Care</a></li>
          </ul>
        </div>
```
With:
```html
        <!-- Services -->
        <div>
          <h4 class="footer-col-title">Services</h4>
          <ul class="footer-links" role="list">
            <li><span class="footer-link" style="font-size:0.6875rem;font-weight:700;letter-spacing:0.07em;text-transform:uppercase;color:var(--color-teal);padding-bottom:2px;display:block;">Core Services</span></li>
            <li><a href="services/personal-care.html"        class="footer-link">Personal Care</a></li>
            <li><a href="services/companion-care.html"       class="footer-link">Companion Care</a></li>
            <li><a href="services/medication-reminders.html" class="footer-link">Medication Reminders</a></li>
            <li><a href="services/meal-preparation.html"     class="footer-link">Meal Preparation</a></li>
            <li><a href="services/light-housekeeping.html"   class="footer-link">Light Housekeeping</a></li>
            <li><a href="services/mobility-safety-support.html" class="footer-link">Mobility &amp; Safety</a></li>
            <li><span class="footer-link" style="font-size:0.6875rem;font-weight:700;letter-spacing:0.07em;text-transform:uppercase;color:var(--color-gold);padding-top:6px;padding-bottom:2px;display:block;">Specialized Care</span></li>
            <li><a href="services/dementia-alzheimers-care.html" class="footer-link">Dementia &amp; Alzheimer's</a></li>
            <li><a href="services/respite-care.html"             class="footer-link">Respite Care</a></li>
            <li><a href="services/post-hospital-recovery.html"   class="footer-link">Post-Hospital Recovery</a></li>
            <li><a href="services/veteran-care.html"             class="footer-link">Veteran Care</a></li>
          </ul>
        </div>
```

- [ ] **Step 4: Open index.html in browser — verify dropdown appears on hover over Services, mobile accordion expands/collapses, footer shows 10 service links**

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "feat: add services dropdown nav and updated footer links to index.html"
```

---

### Task 4: Nav + footer HTML — about.html

**Files:**
- Modify: `about.html`

Same substitutions as Task 3, but paths stay at root level (no change to path prefix). The mobile nav `aria-current="page"` is on the About link, not Services.

- [ ] **Step 1: Replace desktop nav Services `<li>` (line 76)**

Replace:
```html
          <li><a href="services.html"      class="nav-link">Services</a></li>
```
With the same full dropdown block from Task 3 Step 1 (identical — all paths are at root level).

- [ ] **Step 2: Replace mobile nav Services `<a>` (line 111)**

Replace:
```html
      <a href="services.html"      class="nav-mobile-link">Services</a>
```
With the same mobile dropdown block from Task 3 Step 2.

- [ ] **Step 3: Replace footer Services column (lines 692–700)**

Replace:
```html
          <ul class="footer-links" role="list">
            <li><a href="services.html#services"         class="footer-link">Personal Care</a></li>
            <li><a href="services.html#services"         class="footer-link">Companion Care</a></li>
            <li><a href="services.html#services"         class="footer-link">Medication Reminders</a></li>
            <li><a href="services.html#services"         class="footer-link">Meal Preparation</a></li>
            <li><a href="services.html#services"         class="footer-link">Light Housekeeping</a></li>
            <li><a href="services.html#specialized-care" class="footer-link">Specialized Care</a></li>
          </ul>
```
With the same 12-item footer list from Task 3 Step 3.

- [ ] **Step 4: Verify in browser — dropdown works, footer updated**

- [ ] **Step 5: Commit**

```bash
git add about.html
git commit -m "feat: add services dropdown nav and updated footer links to about.html"
```

---

### Task 5: Nav + footer HTML — contact.html

**Files:**
- Modify: `contact.html`

- [ ] **Step 1: Find the desktop nav Services line**

```bash
grep -n "nav-link.*Services\|Services.*nav-link" contact.html
```

- [ ] **Step 2: Replace desktop nav Services `<li>` with the full dropdown block from Task 3 Step 1**

- [ ] **Step 3: Find and replace mobile nav Services `<a>` with the mobile block from Task 3 Step 2**

```bash
grep -n "nav-mobile-link.*Services\|Services.*nav-mobile" contact.html
```

- [ ] **Step 4: Find and replace footer Services column**

```bash
grep -n "footer-link.*Personal Care\|services.html#services" contact.html
```
Replace the 6-item list with the 12-item list from Task 3 Step 3.

- [ ] **Step 5: Verify in browser**

- [ ] **Step 6: Commit**

```bash
git add contact.html
git commit -m "feat: add services dropdown nav and updated footer links to contact.html"
```

---

### Task 6: Nav + footer HTML — how-it-works.html

**Files:**
- Modify: `how-it-works.html`

- [ ] **Step 1: Find and replace desktop nav Services `<li>`**

```bash
grep -n "nav-link.*Services\|Services.*nav-link" how-it-works.html
```
Replace with the full dropdown block from Task 3 Step 1.

- [ ] **Step 2: Find and replace mobile nav Services `<a>`**

```bash
grep -n "nav-mobile-link" how-it-works.html
```
Replace the Services `<a>` with the mobile block from Task 3 Step 2.

- [ ] **Step 3: Find and replace footer Services column**

```bash
grep -n "footer-link.*Personal\|services.html#services" how-it-works.html
```
Replace with the 12-item list from Task 3 Step 3.

- [ ] **Step 4: Verify in browser**

- [ ] **Step 5: Commit**

```bash
git add how-it-works.html
git commit -m "feat: add services dropdown nav and updated footer links to how-it-works.html"
```

---

### Task 7: services.html — nav dropdown + card links + footer

**Files:**
- Modify: `services.html`

- [ ] **Step 1: Replace desktop nav Services `<li>` (line 76)**

The Services `<a>` on `services.html` should get `aria-current="page"` on the "All Services →" dropdown link, and the trigger should get class `is-active`:

Replace:
```html
          <li><a href="services.html"      class="nav-link" aria-current="page">Services</a></li>
```
With:
```html
          <li class="nav-item nav-has-dropdown">
            <a href="services.html" class="nav-link nav-dropdown-trigger is-active"
               aria-haspopup="true" aria-expanded="false">
              Services <span class="nav-chevron" aria-hidden="true">›</span>
            </a>
            <ul class="nav-dropdown" role="menu" aria-label="Services menu">
              <li role="presentation">
                <a href="services.html" class="nav-dropdown-all" role="menuitem" aria-current="page">All Services →</a>
              </li>
              <li role="presentation" class="nav-dropdown-group-label nav-dropdown-group-label--teal" aria-hidden="true">Core Services</li>
              <li role="presentation"><a href="services/personal-care.html" role="menuitem">Personal Care</a></li>
              <li role="presentation"><a href="services/companion-care.html" role="menuitem">Companion Care</a></li>
              <li role="presentation"><a href="services/medication-reminders.html" role="menuitem">Medication Reminders</a></li>
              <li role="presentation"><a href="services/meal-preparation.html" role="menuitem">Meal Preparation</a></li>
              <li role="presentation"><a href="services/light-housekeeping.html" role="menuitem">Light Housekeeping</a></li>
              <li role="presentation"><a href="services/mobility-safety-support.html" role="menuitem">Mobility &amp; Safety Support</a></li>
              <li role="presentation" class="nav-dropdown-group-label nav-dropdown-group-label--gold" aria-hidden="true">Specialized Care</li>
              <li role="presentation"><a href="services/dementia-alzheimers-care.html" role="menuitem">Dementia &amp; Alzheimer's Care</a></li>
              <li role="presentation"><a href="services/respite-care.html" role="menuitem">Respite Care</a></li>
              <li role="presentation"><a href="services/post-hospital-recovery.html" role="menuitem">Post-Hospital Recovery</a></li>
              <li role="presentation"><a href="services/veteran-care.html" role="menuitem">Veteran Care</a></li>
            </ul>
          </li>
```

- [ ] **Step 2: Replace mobile nav Services `<a>` (line 111)**

Replace:
```html
      <a href="services.html"      class="nav-mobile-link" aria-current="page">Services</a>
```
With:
```html
      <button class="nav-mobile-link mobile-nav-trigger" aria-expanded="false">
        Services <span class="mobile-chevron" aria-hidden="true">›</span>
      </button>
      <ul class="mobile-nav-dropdown" hidden>
        <li><a href="services.html" class="mobile-nav-dropdown-all" aria-current="page">All Services →</a></li>
        <li><span class="mobile-nav-group-label mobile-nav-group-label--teal">Core Services</span></li>
        <li><a href="services/personal-care.html">Personal Care</a></li>
        <li><a href="services/companion-care.html">Companion Care</a></li>
        <li><a href="services/medication-reminders.html">Medication Reminders</a></li>
        <li><a href="services/meal-preparation.html">Meal Preparation</a></li>
        <li><a href="services/light-housekeeping.html">Light Housekeeping</a></li>
        <li><a href="services/mobility-safety-support.html">Mobility &amp; Safety Support</a></li>
        <li><span class="mobile-nav-group-label mobile-nav-group-label--gold">Specialized Care</span></li>
        <li><a href="services/dementia-alzheimers-care.html">Dementia &amp; Alzheimer's Care</a></li>
        <li><a href="services/respite-care.html">Respite Care</a></li>
        <li><a href="services/post-hospital-recovery.html">Post-Hospital Recovery</a></li>
        <li><a href="services/veteran-care.html">Veteran Care</a></li>
      </ul>
```

- [ ] **Step 3: Add "Learn More →" links to each core service card**

Each `<article class="service-detail-card">` ends with `</div></article>`. Add a link before the inner `</div>` close. For each of the 6 core cards, find the `</ul>` that ends the checklist and add:

Personal Care card — add after its `</ul>`:
```html
              <a href="services/personal-care.html" class="service-detail-link">Learn more about Personal Care →</a>
```

Companion Care — add after its `</ul>`:
```html
              <a href="services/companion-care.html" class="service-detail-link">Learn more about Companion Care →</a>
```

Medication Reminders:
```html
              <a href="services/medication-reminders.html" class="service-detail-link">Learn more about Medication Reminders →</a>
```

Meal Preparation:
```html
              <a href="services/meal-preparation.html" class="service-detail-link">Learn more about Meal Preparation →</a>
```

Light Housekeeping:
```html
              <a href="services/light-housekeeping.html" class="service-detail-link">Learn more about Light Housekeeping →</a>
```

Mobility & Safety Support:
```html
              <a href="services/mobility-safety-support.html" class="service-detail-link">Learn more about Mobility &amp; Safety Support →</a>
```

- [ ] **Step 4: Add links to each specialized card**

Each `<div class="specialized-card">` — add a link after the `</p>` inside the card body. Use this pattern for each:

Dementia & Alzheimer's Care:
```html
            <a href="services/dementia-alzheimers-care.html" class="service-detail-link">Learn more →</a>
```

Respite Care:
```html
            <a href="services/respite-care.html" class="service-detail-link">Learn more →</a>
```

Post-Hospital Recovery:
```html
            <a href="services/post-hospital-recovery.html" class="service-detail-link">Learn more →</a>
```

Veteran Care:
```html
            <a href="services/veteran-care.html" class="service-detail-link">Learn more →</a>
```

- [ ] **Step 5: Add `.service-detail-link` style to services.css (not main.css)**

Open `css/services.css` and append:
```css
.service-detail-link {
  display: inline-block;
  margin-top: 10px;
  color: var(--color-teal);
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  transition: color 150ms;
}
.service-detail-link:hover { color: var(--color-navy); }
```

- [ ] **Step 6: Replace footer Services column (lines 759–764)**

Replace:
```html
            <li><a href="services.html#services"          class="footer-link">Personal Care</a></li>
            <li><a href="services.html#services"          class="footer-link">Companion Care</a></li>
            <li><a href="services.html#services"          class="footer-link">Medication Reminders</a></li>
            <li><a href="services.html#services"          class="footer-link">Meal Preparation</a></li>
            <li><a href="services.html#services"          class="footer-link">Light Housekeeping</a></li>
            <li><a href="services.html#specialized-care"  class="footer-link">Specialized Care</a></li>
```
With:
```html
            <li><span class="footer-link" style="font-size:0.6875rem;font-weight:700;letter-spacing:0.07em;text-transform:uppercase;color:var(--color-teal);padding-bottom:2px;display:block;">Core Services</span></li>
            <li><a href="services/personal-care.html"        class="footer-link">Personal Care</a></li>
            <li><a href="services/companion-care.html"       class="footer-link">Companion Care</a></li>
            <li><a href="services/medication-reminders.html" class="footer-link">Medication Reminders</a></li>
            <li><a href="services/meal-preparation.html"     class="footer-link">Meal Preparation</a></li>
            <li><a href="services/light-housekeeping.html"   class="footer-link">Light Housekeeping</a></li>
            <li><a href="services/mobility-safety-support.html" class="footer-link">Mobility &amp; Safety</a></li>
            <li><span class="footer-link" style="font-size:0.6875rem;font-weight:700;letter-spacing:0.07em;text-transform:uppercase;color:var(--color-gold);padding-top:6px;padding-bottom:2px;display:block;">Specialized Care</span></li>
            <li><a href="services/dementia-alzheimers-care.html" class="footer-link">Dementia &amp; Alzheimer's</a></li>
            <li><a href="services/respite-care.html"             class="footer-link">Respite Care</a></li>
            <li><a href="services/post-hospital-recovery.html"   class="footer-link">Post-Hospital Recovery</a></li>
            <li><a href="services/veteran-care.html"             class="footer-link">Veteran Care</a></li>
```

- [ ] **Step 7: Verify in browser — dropdown works on services.html, all 10 card links navigate correctly, footer updated**

- [ ] **Step 8: Commit**

```bash
git add services.html css/services.css
git commit -m "feat: add dropdown nav, service page links, and updated footer to services.html"
```

---

### Task 8: css/services-page.css

**Files:**
- Create: `css/services-page.css`

- [ ] **Step 1: Create the file with the full CSS**

```css
/* ===================================================================
   TRINITY HOME CARE — Service Page Styles
   Loaded only on services/*.html pages.
   All rules scoped to service page sections — no changes to main.css.
   =================================================================== */

/* ── Section base backgrounds ─────────────────────────────────────── */
.section-service-what,
.section-service-signs,
.section-service-testimonial,
.section-service-faq {
  background: var(--color-white);
}

.section-service-who,
.section-service-day,
.section-service-related {
  background: var(--color-ivory);
}

/* ── §2 What We Provide ───────────────────────────────────────────── */
.service-what-layout {
  display: flex;
  gap: 3rem;
  align-items: flex-start;
}
.service-what-copy { flex: 3; }
.service-what-photo { flex: 2; }
.service-what-photo img {
  width: 100%;
  height: 260px;
  object-fit: cover;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-photo);
}

.service-callout {
  background: var(--color-white);
  border-left: 3px solid var(--color-teal);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  box-shadow: var(--shadow-card);
  padding: 1.25rem 1.5rem;
  margin-top: 1.5rem;
}
.service-callout-label {
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: var(--color-teal);
  margin-bottom: 0.75rem;
}
.service-callout-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
.service-callout-item {
  font-size: 0.9375rem;
  color: var(--color-text-sub);
  line-height: 1.5;
}
.service-callout-item::before {
  content: '✓  ';
  color: var(--color-teal);
  font-weight: 600;
}

/* ── §3 Who It Helps ──────────────────────────────────────────────── */
.service-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
}
.service-pill {
  display: inline-block;
  background: var(--color-white);
  border: 1px solid var(--color-ivory-dark);
  border-radius: 20px;
  padding: 5px 14px;
  font-size: 0.875rem;
  color: var(--color-text-sub);
  white-space: nowrap;
}

/* ── §4 Signs ─────────────────────────────────────────────────────── */
.service-signs-list {
  list-style: none;
  padding: 0;
  margin: 1rem 0 0 0;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}
.service-signs-list li {
  padding-left: 1.25rem;
  position: relative;
  font-size: 0.9375rem;
  color: var(--color-text-sub);
  line-height: 1.55;
}
.service-signs-list li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: var(--color-teal);
  font-weight: 700;
}

/* ── §5 Day in the Life ───────────────────────────────────────────── */
.service-day-layout {
  display: flex;
  gap: 3rem;
  align-items: center;
}
.service-day-photo { flex: 2; }
.service-day-photo img {
  width: 100%;
  height: 240px;
  object-fit: cover;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-photo);
}
.service-day-copy {
  flex: 3;
  font-style: italic;
  font-size: 1.0625rem;
  color: var(--color-text-sub);
  line-height: 1.7;
}

/* ── §6 Testimonial ───────────────────────────────────────────────── */
.service-testimonial-wrap {
  max-width: 680px;
  margin: 0 auto;
}
.service-testimonial-card {
  background: var(--color-white);
  border-top: 3px solid var(--color-gold);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);
  padding: 2rem 2.25rem;
}
.service-testimonial-stars {
  color: var(--color-gold);
  font-size: 1rem;
  letter-spacing: 2px;
  margin-bottom: 1rem;
}
.service-testimonial-quote {
  font-family: var(--font-display);
  font-style: italic;
  font-size: 1.1875rem;
  color: var(--color-navy);
  line-height: 1.65;
  margin-bottom: 1rem;
}
.service-testimonial-attr {
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

/* ── §7 Often Paired With ─────────────────────────────────────────── */
.service-related-strip {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;
}
.service-related-card {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  background: var(--color-white);
  border: 1px solid var(--color-teal);
  border-radius: var(--radius-md);
  padding: 0.75rem 1.25rem;
  color: var(--color-teal);
  font-size: 0.9375rem;
  font-weight: 500;
  text-decoration: none;
  transition: background 150ms, color 150ms;
}
.service-related-card:hover {
  background: var(--color-teal);
  color: var(--color-white);
}

/* ── §8 FAQ Accordion ─────────────────────────────────────────────── */
.service-faq-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
}
.service-faq-item {
  border: 1px solid var(--color-ivory-dark);
  border-radius: var(--radius-md);
  overflow: hidden;
}
.service-faq-btn {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  background: var(--color-white);
  border: none;
  padding: 1.125rem 1.25rem;
  font-family: var(--font-body);
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--color-navy);
  cursor: pointer;
  text-align: left;
}
.service-faq-btn:hover { background: var(--color-ivory); }
.service-faq-chevron {
  color: var(--color-teal);
  font-size: 1.125rem;
  font-style: normal;
  flex-shrink: 0;
  transition: transform 200ms;
}
.service-faq-btn[aria-expanded="true"] .service-faq-chevron {
  transform: rotate(90deg);
}
.service-faq-panel {
  padding: 0 1.25rem 1.125rem;
  background: var(--color-white);
}
.service-faq-panel p {
  font-size: 0.9375rem;
  color: var(--color-text-sub);
  line-height: 1.65;
  margin: 0;
}
.service-faq-footer {
  margin-top: 1.25rem;
  font-size: 0.875rem;
}
.service-faq-footer a {
  color: var(--color-teal);
  font-weight: 500;
}

/* ── §9 CTA ───────────────────────────────────────────────────────── */
.section-service-cta {
  background: var(--color-navy);
  clip-path: polygon(0 32px, 100% 0, 100% 100%, 0 100%);
  margin-top: -32px;
  padding-top: calc(3rem + 32px);
  padding-bottom: 4rem;
}
.service-cta-phone {
  display: block;
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-gold);
  text-decoration: none;
  margin: 1rem 0 2rem;
  letter-spacing: -0.01em;
}
.service-cta-phone:hover { color: var(--color-white); }

.service-cta-form {
  background: rgba(255,255,255,0.07);
  border-radius: var(--radius-md);
  padding: 2rem;
  max-width: 560px;
}
.service-cta-form .form-row {
  display: flex;
  gap: 1rem;
}
.service-cta-form .form-row .form-group { flex: 1; }
.service-cta-form .form-group { margin-bottom: 1rem; }
.service-cta-form label {
  display: block;
  font-size: 0.8125rem;
  font-weight: 500;
  color: rgba(255,255,255,0.75);
  margin-bottom: 0.375rem;
}
.service-cta-form input,
.service-cta-form select {
  width: 100%;
  padding: 0.625rem 0.875rem;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: var(--radius-sm);
  color: var(--color-white);
  font-family: var(--font-body);
  font-size: 0.9375rem;
}
.service-cta-form input::placeholder { color: rgba(255,255,255,0.4); }
.service-cta-form select option { color: var(--color-navy); background: var(--color-white); }
.service-cta-disclaimer {
  font-size: 0.8125rem;
  color: rgba(255,255,255,0.5);
  margin-top: 0.75rem;
}

/* ── Mobile overrides ─────────────────────────────────────────────── */
@media (max-width: 768px) {
  .service-what-layout,
  .service-day-layout {
    flex-direction: column;
  }
  .service-what-photo,
  .service-day-photo { order: 2; }
  .service-what-copy,
  .service-day-copy  { order: 1; }

  .service-what-photo img,
  .service-day-photo img {
    height: 200px;
  }

  .service-related-strip { flex-direction: column; }
  .service-cta-form .form-row { flex-direction: column; }
  .service-cta-form .form-row .form-group { flex: unset; }
}

@media (max-width: 480px) {
  .service-pills { gap: 0.375rem; }
  .service-pill  { font-size: 0.8125rem; padding: 4px 11px; }
}
```

- [ ] **Step 2: Verify file created**

```bash
node --check css/services-page.css
```
CSS syntax can't be checked with node — instead open `services/personal-care.html` after Task 10 to confirm styles apply.

- [ ] **Step 3: Commit**

```bash
git add css/services-page.css
git commit -m "feat: add services-page.css shared styles for service landing pages"
```

---

### Task 9: js/services-page.js

**Files:**
- Create: `js/services-page.js`

- [ ] **Step 1: Create the file**

```js
/* ===================================================================
   TRINITY HOME CARE — Service Page JavaScript
   Loaded only on services/*.html pages.
   Responsibilities: FAQ accordion, CTA form validation.
   =================================================================== */

(function () {
  'use strict';

  /* -----------------------------------------------------------------
     FAQ Accordion — one open at a time
     ----------------------------------------------------------------- */
  var faqItems = document.querySelectorAll('.service-faq-item');

  faqItems.forEach(function (item) {
    var btn   = item.querySelector('.service-faq-btn');
    var panel = item.querySelector('.service-faq-panel');
    if (!btn || !panel) return;

    btn.addEventListener('click', function () {
      var isOpen = btn.getAttribute('aria-expanded') === 'true';

      // Close all
      faqItems.forEach(function (other) {
        var ob = other.querySelector('.service-faq-btn');
        var op = other.querySelector('.service-faq-panel');
        if (ob) ob.setAttribute('aria-expanded', 'false');
        if (op) op.hidden = true;
      });

      // Open clicked if it was closed
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        panel.hidden = false;
      }
    });
  });

  /* -----------------------------------------------------------------
     CTA Form validation
     ----------------------------------------------------------------- */
  var form = document.getElementById('cta-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var requiredFields = form.querySelectorAll('[required]');
    var firstInvalid   = null;

    requiredFields.forEach(function (field) {
      field.style.borderColor = '';
      if (!field.value.trim()) {
        field.style.borderColor = 'rgba(224, 112, 112, 0.8)';
        if (!firstInvalid) firstInvalid = field;
      }
    });

    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    var submitBtn = form.querySelector('[type="submit"]');
    var origText  = submitBtn.textContent;
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled    = true;

    // Replace with real endpoint (Netlify, Formspree, etc.) when ready
    setTimeout(function () {
      submitBtn.textContent = 'Request Sent ✓';
      submitBtn.style.background = 'var(--color-teal-muted, #4a7a7f)';
    }, 1200);
  });

}());
```

- [ ] **Step 2: Syntax check**

```bash
node --check js/services-page.js
```
Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add js/services-page.js
git commit -m "feat: add services-page.js FAQ accordion and form validation"
```

---

### Task 10: services/personal-care.html

**Files:**
- Create: `services/personal-care.html`

This is the reference template for all service pages. Study it carefully — Tasks 11–19 use the same structure with different content.

- [ ] **Step 1: Create the `services/` directory if it doesn't exist**

```bash
mkdir -p services
```

- [ ] **Step 2: Create the file with the complete HTML**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Personal Care in Pittsburgh, PA | Trinity Home Care</title>
  <meta name="description" content="Trinity Home Care provides compassionate personal care in Pittsburgh — bathing, grooming, dressing, and hygiene support delivered with patience and deep respect for dignity.">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://trinityhomecarepgh.com/services/personal-care.html">
  <link rel="icon" type="image/png" href="../assets/logo/Trinity Home Care logo design favicon.png">

  <!-- Open Graph -->
  <meta property="og:type"        content="website">
  <meta property="og:url"         content="https://trinityhomecarepgh.com/services/personal-care.html">
  <meta property="og:title"       content="Personal Care in Pittsburgh, PA | Trinity Home Care">
  <meta property="og:description" content="Bathing, dressing, grooming, and personal hygiene — handled with patience and deep respect for your loved one's dignity.">
  <meta property="og:image"       content="https://trinityhomecarepgh.com/assets/images/services/service-bathing-assistance.jpg">

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,600&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">

  <!-- Preload hero image -->
  <link rel="preload" as="image" href="../assets/images/services/service-bathing-assistance.jpg">

  <!-- Styles -->
  <link rel="stylesheet" href="../css/main.css">
  <link rel="stylesheet" href="../css/services-page.css">

  <noscript>
    <style>[data-animate] { opacity: 1 !important; transform: none !important; }</style>
  </noscript>

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Personal Care",
    "provider": {
      "@type": "HomeAndConstructionBusiness",
      "name": "Trinity Home Care",
      "telephone": "+14123453721",
      "address": { "@type": "PostalAddress", "addressLocality": "Pittsburgh", "addressRegion": "PA" }
    },
    "areaServed": "Pittsburgh, PA",
    "description": "Trinity Home Care provides compassionate personal care in Pittsburgh — bathing, grooming, dressing, and hygiene support delivered with patience and deep respect for dignity."
  }
  </script>
</head>
<body>

  <a href="#main" class="skip-link">Skip to main content</a>

  <!-- HEADER -->
  <header id="site-header" class="site-header" role="banner">
    <div class="container">
      <nav class="nav-container" role="navigation" aria-label="Main navigation">

        <a href="../index.html" class="nav-logo" aria-label="Trinity Home Care — return to homepage">
          <div class="logo-swap">
            <img src="../assets/logo/logo-light2.png" alt="Trinity Home Care" class="logo-img logo-img--light" loading="eager">
            <img src="../assets/logo/logo-dark2.png"  alt="" class="logo-img logo-img--dark" loading="eager" aria-hidden="true">
          </div>
        </a>

        <ul class="nav-links" role="list">
          <li class="nav-item nav-has-dropdown">
            <a href="../services.html" class="nav-link nav-dropdown-trigger is-active"
               aria-haspopup="true" aria-expanded="false">
              Services <span class="nav-chevron" aria-hidden="true">›</span>
            </a>
            <ul class="nav-dropdown" role="menu" aria-label="Services menu">
              <li role="presentation"><a href="../services.html" class="nav-dropdown-all" role="menuitem">All Services →</a></li>
              <li role="presentation" class="nav-dropdown-group-label nav-dropdown-group-label--teal" aria-hidden="true">Core Services</li>
              <li role="presentation"><a href="personal-care.html" role="menuitem" aria-current="page">Personal Care</a></li>
              <li role="presentation"><a href="companion-care.html" role="menuitem">Companion Care</a></li>
              <li role="presentation"><a href="medication-reminders.html" role="menuitem">Medication Reminders</a></li>
              <li role="presentation"><a href="meal-preparation.html" role="menuitem">Meal Preparation</a></li>
              <li role="presentation"><a href="light-housekeeping.html" role="menuitem">Light Housekeeping</a></li>
              <li role="presentation"><a href="mobility-safety-support.html" role="menuitem">Mobility &amp; Safety Support</a></li>
              <li role="presentation" class="nav-dropdown-group-label nav-dropdown-group-label--gold" aria-hidden="true">Specialized Care</li>
              <li role="presentation"><a href="dementia-alzheimers-care.html" role="menuitem">Dementia &amp; Alzheimer's Care</a></li>
              <li role="presentation"><a href="respite-care.html" role="menuitem">Respite Care</a></li>
              <li role="presentation"><a href="post-hospital-recovery.html" role="menuitem">Post-Hospital Recovery</a></li>
              <li role="presentation"><a href="veteran-care.html" role="menuitem">Veteran Care</a></li>
            </ul>
          </li>
          <li><a href="../about.html"         class="nav-link">About</a></li>
          <li><a href="../how-it-works.html"  class="nav-link">How It Works</a></li>
          <li><a href="../index.html#testimonials" class="nav-link">Reviews</a></li>
          <li><a href="../contact.html"       class="nav-link">Contact</a></li>
        </ul>

        <div class="nav-cta-group">
          <a href="tel:4123453721" class="nav-phone" aria-label="Call 412-345-3721">412-345-3721</a>
          <a href="#cta-form" class="btn btn-teal nav-cta-btn">Free Consultation</a>
        </div>

        <button id="nav-hamburger" class="nav-hamburger" type="button"
                aria-label="Open navigation menu" aria-expanded="false" aria-controls="nav-mobile">
          <span class="hamburger-bar" aria-hidden="true"></span>
          <span class="hamburger-bar" aria-hidden="true"></span>
          <span class="hamburger-bar" aria-hidden="true"></span>
        </button>

      </nav>
    </div>

    <nav id="nav-mobile" class="nav-mobile" aria-label="Mobile navigation" aria-hidden="true">
      <button class="nav-mobile-link mobile-nav-trigger" aria-expanded="false">
        Services <span class="mobile-chevron" aria-hidden="true">›</span>
      </button>
      <ul class="mobile-nav-dropdown" hidden>
        <li><a href="../services.html" class="mobile-nav-dropdown-all">All Services →</a></li>
        <li><span class="mobile-nav-group-label mobile-nav-group-label--teal">Core Services</span></li>
        <li><a href="personal-care.html" aria-current="page">Personal Care</a></li>
        <li><a href="companion-care.html">Companion Care</a></li>
        <li><a href="medication-reminders.html">Medication Reminders</a></li>
        <li><a href="meal-preparation.html">Meal Preparation</a></li>
        <li><a href="light-housekeeping.html">Light Housekeeping</a></li>
        <li><a href="mobility-safety-support.html">Mobility &amp; Safety Support</a></li>
        <li><span class="mobile-nav-group-label mobile-nav-group-label--gold">Specialized Care</span></li>
        <li><a href="dementia-alzheimers-care.html">Dementia &amp; Alzheimer's Care</a></li>
        <li><a href="respite-care.html">Respite Care</a></li>
        <li><a href="post-hospital-recovery.html">Post-Hospital Recovery</a></li>
        <li><a href="veteran-care.html">Veteran Care</a></li>
      </ul>
      <a href="../about.html"              class="nav-mobile-link">About</a>
      <a href="../how-it-works.html"       class="nav-mobile-link">How It Works</a>
      <a href="../index.html#testimonials" class="nav-mobile-link">Reviews</a>
      <a href="../contact.html"            class="nav-mobile-link">Contact</a>
      <div class="nav-mobile-ctas">
        <a href="tel:4123453721" class="btn btn-secondary">Call 412-345-3721</a>
        <a href="#cta-form"      class="btn btn-primary">Request Free Assessment</a>
      </div>
    </nav>
  </header>

  <main id="main">

    <!-- §1 HERO -->
    <section class="section-hero section-hero--page"
             style="background-image: url('../assets/images/services/service-bathing-assistance.jpg')"
             aria-labelledby="pc-hero-heading">
      <div class="hero-overlay" aria-hidden="true"></div>
      <div class="container">
        <div class="hero-inner">
          <div class="hero-content">
            <p class="hero-eyebrow">Personal Care</p>
            <h1 id="pc-hero-heading" class="hero-heading">
              Dignified, hands-on care —<br>
              <em>at home.</em>
            </h1>
            <p class="hero-subhead">
              Bathing, dressing, grooming, and personal hygiene — handled with patience, skill, and deep respect for your loved one's dignity.
            </p>
            <div class="hero-ctas">
              <a href="#cta-form" class="btn btn-hero-primary">Request a Free Assessment</a>
              <a href="tel:4123453721" class="btn btn-hero-secondary">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                     stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.44a2 2 0 0 1 2-2H6a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.1a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 15.5v1.42z"/>
                </svg>
                412-345-3721
              </a>
            </div>
            <div class="hero-trust" role="list" aria-label="Trust credentials">
              <span class="hero-trust-item" role="listitem">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M12 2 3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7l-9-5z"/></svg>
                No Obligation
              </span>
              <span class="hero-trust-item" role="listitem">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M12 2 3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7l-9-5z"/></svg>
                Free Assessment
              </span>
              <span class="hero-trust-item" role="listitem">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M12 2 3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7l-9-5z"/></svg>
                Locally Owned
              </span>
              <span class="hero-trust-item" role="listitem">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M12 2 3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7l-9-5z"/></svg>
                Care Starts Fast
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- §2 WHAT WE PROVIDE -->
    <section class="section section-service-what" aria-labelledby="pc-what-heading" data-animate>
      <div class="container">
        <span class="section-label">What We Provide</span>
        <h2 id="pc-what-heading" class="section-heading">What does personal care include?</h2>
        <hr class="gold-rule" aria-hidden="true">
        <div class="service-what-layout">
          <div class="service-what-copy">
            <p>Personal care covers the most intimate aspects of daily life — the tasks that require both skill and sensitivity. A Trinity caregiver helps your loved one with bathing, dressing, grooming, oral hygiene, and toileting in a way that preserves their dignity and their sense of self. We approach every visit with patience, not efficiency.</p>
            <p>We match each client with a caregiver who understands their preferences — whether that means a quiet morning routine, a particular way of doing things, or simply needing a little more time than most. Personal care works best when it feels natural, and that takes a caregiver who genuinely listens.</p>
            <div class="service-callout">
              <p class="service-callout-label">What's included</p>
              <ul class="service-callout-list" aria-label="Personal Care includes">
                <li class="service-callout-item">Bathing, showering, and sponge baths</li>
                <li class="service-callout-item">Dressing and clothing selection</li>
                <li class="service-callout-item">Hair, oral, and nail care</li>
                <li class="service-callout-item">Toileting and incontinence support</li>
                <li class="service-callout-item">Skin care and pressure sore prevention</li>
                <li class="service-callout-item">Transfer assistance (bed to chair, chair to standing)</li>
              </ul>
            </div>
          </div>
          <div class="service-what-photo">
            <img src="../assets/images/supporting/caregiver-supporting-senior-shoulders.jpg"
                 alt="Trinity caregiver providing personal care assistance to a senior at home"
                 loading="lazy">
          </div>
        </div>
      </div>
    </section>

    <!-- §3 WHO IT HELPS -->
    <section class="section section-service-who" aria-labelledby="pc-who-heading" data-animate>
      <div class="container">
        <span class="section-label">Who It Helps</span>
        <h2 id="pc-who-heading" class="section-heading">Who benefits most from personal care?</h2>
        <hr class="gold-rule" aria-hidden="true">
        <div class="service-pills" role="list" aria-label="Personal care is suited for">
          <span class="service-pill" role="listitem">Seniors with limited mobility</span>
          <span class="service-pill" role="listitem">Post-surgery recovery</span>
          <span class="service-pill" role="listitem">Chronic illness</span>
          <span class="service-pill" role="listitem">Parkinson's or stroke recovery</span>
          <span class="service-pill" role="listitem">Family caregiver relief</span>
        </div>
        <p>Personal care is most valuable when physical limitations make self-care difficult, uncomfortable, or unsafe — and when family members aren't in a position to provide hands-on help themselves. It's also one of the most emotionally sensitive services we offer, which is why caregiver fit matters more here than anywhere else.</p>
      </div>
    </section>

    <!-- §4 SIGNS YOU MAY NEED THIS -->
    <section class="section section-service-signs" aria-labelledby="pc-signs-heading" data-animate>
      <div class="container">
        <span class="section-label">Common Signs</span>
        <h2 id="pc-signs-heading" class="section-heading">Signs your loved one may need personal care</h2>
        <hr class="gold-rule" aria-hidden="true">
        <p>These are the signs families notice most often before reaching out:</p>
        <ul class="service-signs-list">
          <li>Your loved one is wearing the same clothing for several days at a time</li>
          <li>You've noticed a change in their grooming or personal hygiene</li>
          <li>They've had a fall or near-fall in the bathroom</li>
          <li>They express embarrassment or resistance about asking family for help</li>
          <li>A recent health event has made independent bathing unsafe</li>
        </ul>
      </div>
    </section>

    <!-- §5 A DAY IN THE LIFE -->
    <section class="section section-service-day" aria-labelledby="pc-day-heading" data-animate>
      <div class="container">
        <span class="section-label" style="color: var(--color-gold);">A Day in the Life</span>
        <h2 id="pc-day-heading" class="section-heading">What personal care looks like in practice</h2>
        <hr class="gold-rule" aria-hidden="true">
        <div class="service-day-layout">
          <div class="service-day-photo">
            <img src="../assets/images/services/service-bathing-assistance.jpg"
                 alt="Caregiver providing dignified personal care assistance at home"
                 loading="lazy">
          </div>
          <div class="service-day-copy">
            <p>Maria arrives at 8:00 a.m. to help Robert start his day. She lays out the clothes they selected together the day before, runs a warm shower, and stays close — not hovering, but present. By 8:45, Robert is dressed, groomed, and sitting at the kitchen table with coffee. He hasn't needed to ask his daughter to help him bathe in three months, and neither of them has to carry that discomfort anymore.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- §6 TESTIMONIAL -->
    <section class="section section-service-testimonial" aria-labelledby="pc-testimonial-heading" data-animate>
      <div class="container">
        <span class="section-label">What Families Tell Us</span>
        <h2 id="pc-testimonial-heading" class="section-heading visually-hidden">Family testimonial</h2>
        <div class="service-testimonial-wrap">
          <div class="service-testimonial-card">
            <div class="service-testimonial-stars" aria-label="5 out of 5 stars">★★★★★</div>
            <blockquote class="service-testimonial-quote">
              "I was dreading having to help my father with bathing — and I think he was dreading asking me. Trinity sent someone who made it so natural. He actually looks forward to his mornings now."
            </blockquote>
            <cite class="service-testimonial-attr">— Carol B., Pittsburgh, daughter</cite>
          </div>
        </div>
      </div>
    </section>

    <!-- §7 OFTEN PAIRED WITH -->
    <section class="section section-service-related" aria-labelledby="pc-related-heading" data-animate>
      <div class="container">
        <span class="section-label">Often Paired With</span>
        <h2 id="pc-related-heading" class="section-heading">Services families frequently combine</h2>
        <hr class="gold-rule" aria-hidden="true">
        <div class="service-related-strip">
          <a href="companion-care.html" class="service-related-card">Companion Care <span aria-hidden="true">→</span></a>
          <a href="medication-reminders.html" class="service-related-card">Medication Reminders <span aria-hidden="true">→</span></a>
          <a href="mobility-safety-support.html" class="service-related-card">Mobility &amp; Safety Support <span aria-hidden="true">→</span></a>
        </div>
      </div>
    </section>

    <!-- §8 FAQ -->
    <section class="section section-service-faq" aria-labelledby="pc-faq-heading" data-animate>
      <div class="container">
        <span class="section-label">Common Questions</span>
        <h2 id="pc-faq-heading" class="section-heading">Questions about personal care</h2>
        <hr class="gold-rule" aria-hidden="true">
        <div class="service-faq-list">

          <div class="service-faq-item">
            <button class="service-faq-btn" aria-expanded="false" aria-controls="faq-pc-1">
              Can I request a same-gender caregiver?
              <span class="service-faq-chevron" aria-hidden="true">›</span>
            </button>
            <div id="faq-pc-1" class="service-faq-panel" hidden>
              <p>Yes, always. We take caregiver-client fit seriously, and that includes gender preference. Just let us know when you call and we'll match accordingly.</p>
            </div>
          </div>

          <div class="service-faq-item">
            <button class="service-faq-btn" aria-expanded="false" aria-controls="faq-pc-2">
              How long does a typical personal care visit last?
              <span class="service-faq-chevron" aria-hidden="true">›</span>
            </button>
            <div id="faq-pc-2" class="service-faq-panel" hidden>
              <p>Most personal care visits run 2–4 hours, though we can arrange shorter check-in visits or longer half-day arrangements depending on what's needed.</p>
            </div>
          </div>

          <div class="service-faq-item">
            <button class="service-faq-btn" aria-expanded="false" aria-controls="faq-pc-3">
              Does insurance cover personal care at home?
              <span class="service-faq-chevron" aria-hidden="true">›</span>
            </button>
            <div id="faq-pc-3" class="service-faq-panel" hidden>
              <p>It depends on the policy. Most standard health insurance and Medicare don't cover non-medical personal care, but long-term care insurance often does. We can help you think through your options when you call.</p>
            </div>
          </div>

        </div>
        <p class="service-faq-footer"><a href="../contact.html">See all FAQs →</a></p>
      </div>
    </section>

    <!-- §9 CTA -->
    <section class="section section-service-cta" id="cta-form" aria-labelledby="pc-cta-heading">
      <div class="container">
        <div class="section-heading-center">
          <h2 id="pc-cta-heading" class="section-heading" style="color: var(--color-white);">
            Start the conversation.<br><em style="color: var(--color-gold);">No pressure, ever.</em>
          </h2>
          <p class="section-subhead" style="color: rgba(255,255,255,0.72);">
            We'll answer your questions and help you figure out what's right for your family.
          </p>
          <a href="tel:4123453721" class="service-cta-phone">412-345-3721</a>
        </div>

        <form class="service-cta-form" novalidate>
          <div class="form-row">
            <div class="form-group">
              <label for="cta-first">First Name</label>
              <input type="text" id="cta-first" name="first_name" placeholder="First name" autocomplete="given-name">
            </div>
            <div class="form-group">
              <label for="cta-last">Last Name</label>
              <input type="text" id="cta-last" name="last_name" placeholder="Last name" autocomplete="family-name">
            </div>
          </div>
          <div class="form-group">
            <label for="cta-phone">Phone Number <span aria-hidden="true">*</span></label>
            <input type="tel" id="cta-phone" name="phone" placeholder="(412) 000-0000" required autocomplete="tel">
          </div>
          <div class="form-group">
            <label for="cta-email">Email <span style="opacity:0.6;font-weight:400;">(optional)</span></label>
            <input type="email" id="cta-email" name="email" placeholder="your@email.com" autocomplete="email">
          </div>
          <div class="form-group">
            <label for="cta-who">Who needs care?</label>
            <select id="cta-who" name="who_needs_care">
              <option value="">— Select —</option>
              <option value="parent">A parent</option>
              <option value="spouse">A spouse or partner</option>
              <option value="self">Myself</option>
              <option value="other">Someone else</option>
            </select>
          </div>
          <button type="submit" class="btn btn-teal" style="width:100%;padding:0.875rem;">
            Request a Free Assessment →
          </button>
          <p class="service-cta-disclaimer">No obligation. We typically respond within one business hour.</p>
        </form>
      </div>
    </section>

  </main>

  <!-- FOOTER -->
  <footer class="site-footer" role="contentinfo">
    <div class="container">
      <div class="footer-top">

        <div class="footer-brand">
          <a href="../index.html" class="nav-logo" aria-label="Trinity Home Care">
            <img src="../assets/logo/logo-light2.png" alt="Trinity Home Care" class="logo-img" loading="lazy">
          </a>
          <p class="footer-tagline">Compassionate, personalized in-home care for Pittsburgh-area families.</p>
        </div>

        <div>
          <h4 class="footer-col-title">Services</h4>
          <ul class="footer-links" role="list">
            <li><span class="footer-link" style="font-size:0.6875rem;font-weight:700;letter-spacing:0.07em;text-transform:uppercase;color:var(--color-teal);padding-bottom:2px;display:block;">Core Services</span></li>
            <li><a href="personal-care.html"        class="footer-link" aria-current="page">Personal Care</a></li>
            <li><a href="companion-care.html"       class="footer-link">Companion Care</a></li>
            <li><a href="medication-reminders.html" class="footer-link">Medication Reminders</a></li>
            <li><a href="meal-preparation.html"     class="footer-link">Meal Preparation</a></li>
            <li><a href="light-housekeeping.html"   class="footer-link">Light Housekeeping</a></li>
            <li><a href="mobility-safety-support.html" class="footer-link">Mobility &amp; Safety</a></li>
            <li><span class="footer-link" style="font-size:0.6875rem;font-weight:700;letter-spacing:0.07em;text-transform:uppercase;color:var(--color-gold);padding-top:6px;padding-bottom:2px;display:block;">Specialized Care</span></li>
            <li><a href="dementia-alzheimers-care.html" class="footer-link">Dementia &amp; Alzheimer's</a></li>
            <li><a href="respite-care.html"             class="footer-link">Respite Care</a></li>
            <li><a href="post-hospital-recovery.html"   class="footer-link">Post-Hospital Recovery</a></li>
            <li><a href="veteran-care.html"             class="footer-link">Veteran Care</a></li>
          </ul>
        </div>

        <div>
          <h4 class="footer-col-title">Company</h4>
          <ul class="footer-links" role="list">
            <li><a href="../about.html"                  class="footer-link">About Us</a></li>
            <li><a href="../how-it-works.html"           class="footer-link">How It Works</a></li>
            <li><a href="../index.html#testimonials"     class="footer-link">Family Stories</a></li>
            <li><a href="../index.html#contact"          class="footer-link">Join Our Team</a></li>
          </ul>
        </div>

        <div>
          <h4 class="footer-col-title">Contact</h4>
          <ul class="footer-links" role="list">
            <li><a href="tel:4123453721"                   class="footer-link">412-345-3721</a></li>
            <li><a href="mailto:info@trinityhomecare.com"  class="footer-link">info@trinityhomecare.com</a></li>
            <li><span class="footer-link footer-location">Pittsburgh, Pennsylvania</span></li>
            <li><a href="#cta-form" class="footer-link">Free Assessment &rarr;</a></li>
          </ul>
        </div>

      </div>
      <div class="footer-bottom">
        <p class="footer-copyright">&copy; 2026 Trinity Home Care. All rights reserved.</p>
        <nav class="footer-legal" aria-label="Legal">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Accessibility</a>
        </nav>
      </div>
    </div>
  </footer>

  <!-- Mobile sticky CTA bar -->
  <div class="mobile-cta-bar" role="complementary" aria-label="Quick contact">
    <a href="tel:4123453721" class="btn btn-hero-secondary" aria-label="Call Trinity Home Care at 412-345-3721">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
           stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"
           style="width:17px;height:17px;flex-shrink:0;">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.44a2 2 0 0 1 2-2H6a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.1a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 15.5v1.42z"/>
      </svg>
      Call Now
    </a>
    <a href="#cta-form" class="btn btn-primary">Free Assessment</a>
  </div>

  <script src="../js/main.js"></script>
  <script src="../js/services-page.js"></script>

</body>
</html>
```

- [ ] **Step 3: Open `services/personal-care.html` in browser. Verify:**
  - Hero background image loads
  - Nav dropdown opens on hover with correct grouped links
  - Mobile menu opens and Services sub-accordion expands
  - All 9 sections render correctly
  - FAQ accordion opens one item at a time
  - CTA form validates (submit with empty phone shows error)
  - "Often Paired With" links work

- [ ] **Step 4: Commit**

```bash
git add services/personal-care.html
git commit -m "feat: add personal care service page"
```

---

### Task 11: services/companion-care.html

**Files:**
- Create: `services/companion-care.html`

- [ ] **Step 1: Copy `services/personal-care.html` to `services/companion-care.html`**

- [ ] **Step 2: Apply these substitutions throughout the file:**

| Element | Replace with |
|---------|-------------|
| `<title>` | `Companion Care in Pittsburgh, PA \| Trinity Home Care` |
| `<meta name="description" content="...">` | `Trinity Home Care offers companion care in Pittsburgh — meaningful conversation, shared activities, and a warm, consistent presence that eases loneliness and keeps families connected.` |
| `<link rel="canonical" href="...">` | `https://trinityhomecarepgh.com/services/companion-care.html` |
| `og:url` | `https://trinityhomecarepgh.com/services/companion-care.html` |
| `og:title` | `Companion Care in Pittsburgh, PA \| Trinity Home Care` |
| `og:description` | `Meaningful conversation, shared activities, and a consistent presence that makes the day feel less empty.` |
| `og:image` | `https://trinityhomecarepgh.com/assets/images/supporting/caregiver-senior-reading-tea.jpg` |
| hero `<link rel="preload" as="image" href="...">` | `../assets/images/supporting/caregiver-senior-reading-tea.jpg` |
| JSON-LD `"name"` | `Companion Care` |
| JSON-LD `"description"` | `Trinity Home Care offers companion care in Pittsburgh — meaningful conversation, shared activities, and a warm, consistent presence that eases loneliness and keeps families connected.` |
| Hero section `style="background-image: url(...)"` | `url('../assets/images/supporting/caregiver-senior-reading-tea.jpg')` |
| Hero `aria-labelledby` | `cc-hero-heading` |
| `id="pc-hero-heading"` | `id="cc-hero-heading"` |
| Hero eyebrow | `Companion Care` |
| H1 | `More than a helping hand —<br><em>real company.</em>` |
| Hero subhead | `Meaningful conversation, shared activities, and a consistent presence that makes the day feel less empty.` |
| All other section `aria-labelledby` and `id` values | Replace `pc-` prefix with `cc-` (e.g. `cc-what-heading`, `cc-who-heading`, etc.) |
| All FAQ `aria-controls` and `id` values | Replace `faq-pc-` with `faq-cc-` |
| §2 H2 | `What does companion care include?` |
| §2 para 1 | `Loneliness is one of the most serious — and most overlooked — health risks for older adults. A companion caregiver from Trinity is there not just to help with small tasks, but to genuinely engage: conversation over coffee, a walk around the neighborhood, a card game, a shared TV program. The goal is connection, not just coverage.` |
| §2 para 2 | `Companion care can stand alone as a regular social visit, or it can be paired with personal care or errands to create a fuller schedule of support. Families often start with companion care and find that it opens the door to a relationship that makes everything else easier.` |
| §2 callout label | `What's included` |
| §2 checklist items | Conversation and social engagement · Games, hobbies, and shared activities · Light reading aloud or book discussions · Accompaniment to appointments or outings · Monitoring mood and alerting family to changes · Light meal preparation and household tidying |
| §2 photo `src` | `../assets/images/supporting/caregiver-helping-senior-computer.jpg` |
| §2 photo `alt` | `Trinity caregiver engaging in companion care activities with a senior client` |
| §3 H2 | `Who benefits most from companion care?` |
| §3 pills | Seniors living alone · Early cognitive decline · Recently bereaved · Family lives at a distance · Recovering from a health event |
| §3 paragraph | `Companion care is the right fit when your loved one is physically capable but emotionally or socially isolated — or when you simply can't be there as often as you'd like and want to know someone warm and consistent is checking in.` |
| §4 H2 | `Signs your loved one may need companion care` |
| §4 bullets | Your loved one mentions feeling lonely or bored most days · You've noticed a drop in mood or motivation since retiring or losing a spouse · They've stopped pursuing hobbies they used to enjoy · You live more than an hour away and worry about isolation · Their world has narrowed since a health event or life change |
| §5 H2 | `What companion care looks like in practice` |
| §5 photo `src` | `../assets/images/supporting/caregiver-helping-senior-computer.jpg` |
| §5 photo `alt` | `Caregiver and senior engaged in a shared activity during a companion care visit` |
| §5 narrative | `Helen and her caregiver, Diane, have been meeting on Tuesday and Thursday mornings for four months. Today they're working through a 500-piece puzzle while Diane listens to Helen talk about her years as a schoolteacher in Greenfield. Helen's daughter notices her mother's voice is brighter on the phone these days. She calls it the Diane effect.` |
| §6 testimonial quote | `"My mother lives alone and I was 800 miles away, worrying constantly. Her companion caregiver has become someone she genuinely looks forward to seeing. I can hear it in her voice — she's less isolated. That matters more than anything."` |
| §6 attribution | `— David K., son (remote caregiver)` |
| §7 related service links | `<a href="personal-care.html" class="service-related-card">Personal Care <span aria-hidden="true">→</span></a>` · `<a href="meal-preparation.html" class="service-related-card">Meal Preparation <span aria-hidden="true">→</span></a>` · `<a href="mobility-safety-support.html" class="service-related-card">Mobility &amp; Safety Support <span aria-hidden="true">→</span></a>` |
| §8 H2 | `Questions about companion care` |
| §8 FAQ 1 question | `What kinds of activities does a companion caregiver typically do?` |
| §8 FAQ 1 answer | `It depends entirely on your loved one. Some clients want a walking partner, others prefer cards or conversation, others like having help with hobbies or video calls with family. We match caregivers in part based on shared interests and personality.` |
| §8 FAQ 2 question | `How is companion care different from personal care?` |
| §8 FAQ 2 answer | `Companion care focuses on social engagement, emotional support, and light daily activities. Personal care involves hands-on help with bathing, grooming, and hygiene. Many clients receive both.` |
| §8 FAQ 3 question | `Can a companion caregiver drive my loved one to appointments?` |
| §8 FAQ 3 answer | `Yes, with prior arrangement. Transportation to appointments, errands, or social outings is something many of our companion caregivers provide. Just mention it when we set up the schedule.` |
| Footer `aria-current="page"` | Move from `personal-care.html` link to `companion-care.html` link |
| Nav desktop dropdown `aria-current="page"` | Move from `personal-care.html` to `companion-care.html` |
| Nav mobile `aria-current="page"` | Move from `personal-care.html` to `companion-care.html` |

- [ ] **Step 3: Open `services/companion-care.html` in browser and verify all sections render with correct content**

- [ ] **Step 4: Commit**

```bash
git add services/companion-care.html
git commit -m "feat: add companion care service page"
```

---

### Task 12: services/medication-reminders.html

**Files:**
- Create: `services/medication-reminders.html`

- [ ] **Step 1: Copy `services/personal-care.html` to `services/medication-reminders.html`**

- [ ] **Step 2: Apply these substitutions (replace `pc-` IDs with `mr-`, `faq-pc-` with `faq-mr-`):**

| Element | Value |
|---------|-------|
| `<title>` | `Medication Reminders in Pittsburgh, PA \| Trinity Home Care` |
| Meta description | `Trinity Home Care provides medication reminder services in Pittsburgh — reliable, gentle support that keeps seniors on schedule and families reassured, without replacing medical care.` |
| Canonical | `https://trinityhomecarepgh.com/services/medication-reminders.html` |
| JSON-LD name | `Medication Reminder Services` |
| Hero bg image (preload + inline style) | `../assets/images/services/service-medication-reminders.jpg` |
| Hero eyebrow | `Medication Reminders` |
| H1 | `The right dose —<br><em>at the right time.</em>` |
| Hero subhead | `Gentle, reliable reminders that keep your loved one's medication schedule on track — without replacing what their doctor prescribed.` |
| §2 H2 | `What do medication reminder services include?` |
| §2 para 1 | `Missing or doubling up on medications is one of the leading causes of preventable hospitalizations among older adults. A Trinity caregiver doesn't administer medications, but they do sit with your loved one at the right time, remind them what needs to be taken, and make sure it actually happens — rather than being forgotten in the rush of the morning.` |
| §2 para 2 | `Caregivers can also help organize medications into weekly pill organizers, keep a log of what was taken and when, and alert the family or care coordinator if something seems off. It's a small intervention with a significant impact.` |
| §2 checklist items | Verbal reminders at scheduled medication times · Assisting client in locating and opening medication containers · Weekly pill organizer setup · Medication log documentation · Alerting family if doses are missed or client expresses concerns · Coordination with family on schedule changes |
| §2 photo src | `../assets/images/supporting/caregiver-talking-to-senior-chairside.jpg` |
| §2 photo alt | `Caregiver providing medication reminder support to a senior client` |
| §3 H2 | `Who benefits most from medication reminders?` |
| §3 pills | Managing multiple medications · Memory concerns · Post-discharge patients · Complex schedules · Living alone |
| §3 paragraph | `Medication reminders are especially important for seniors managing multiple prescriptions, those with early cognitive decline, or anyone recently discharged from a hospital where the regimen may have changed. When medications are taken consistently, everything else tends to improve.` |
| §4 H2 | `Signs your loved one may need medication reminder support` |
| §4 bullets | Pill bottles are frequently emptied too quickly or too slowly · Your loved one can't reliably recall whether they took their morning medication · A recent hospitalization was linked to a missed or incorrect dose · Their medication schedule has recently changed and is difficult to track · They live alone with no daily family contact |
| §5 H2 | `What medication reminder support looks like in practice` |
| §5 photo src | `../assets/images/services/service-medication-reminders.jpg` |
| §5 photo alt | `Caregiver assisting senior with medication reminder routine` |
| §5 narrative | `At 9:00 a.m., James's caregiver knocks on his bedroom door with a glass of water and a small tray — three pills, as always. James isn't always sure which ones are which anymore, but he knows the routine, and the routine is what keeps things working. His cardiologist mentioned at the last visit that his numbers have been unusually stable. James credits his caregiver.` |
| §6 quote | `"After my dad got out of the hospital they sent him home with four new medications on top of the three he was already taking. He kept missing doses and we kept worrying. His Trinity caregiver made that whole problem go away — it just stopped being an issue."` |
| §6 attribution | `— Patricia N., Pittsburgh, daughter` |
| §7 related links | Personal Care · Post-Hospital Recovery · Companion Care |
| §8 H2 | `Questions about medication reminders` |
| FAQ 1 Q | `Can a Trinity caregiver administer medications?` |
| FAQ 1 A | `No — our caregivers are not licensed to administer or dispense medications. What they can do is remind, encourage, assist with opening containers, organize pill boxes, and log what was taken. For medical administration, a licensed home health nurse is the right resource.` |
| FAQ 2 Q | `What if my loved one refuses to take their medication?` |
| FAQ 2 A | `We document refusals and notify the family. We won't force or coerce — that's never appropriate. But we'll alert you so you and their doctor can follow up.` |
| FAQ 3 Q | `Can caregivers help set up a weekly pill organizer?` |
| FAQ 3 A | `Yes. Many caregivers help clients organize their medications at the start of the week as part of their regular visit. It's one of the most practical things we do.` |
| Footer/nav `aria-current="page"` | `medication-reminders.html` link |

- [ ] **Step 3: Verify in browser**

- [ ] **Step 4: Commit**

```bash
git add services/medication-reminders.html
git commit -m "feat: add medication reminders service page"
```

---

### Task 13: services/meal-preparation.html

**Files:**
- Create: `services/meal-preparation.html`

- [ ] **Step 1: Copy `services/personal-care.html` to `services/meal-preparation.html`**

- [ ] **Step 2: Apply substitutions (replace `pc-` IDs with `mp-`, `faq-pc-` with `faq-mp-`):**

| Element | Value |
|---------|-------|
| `<title>` | `Meal Preparation Services in Pittsburgh, PA \| Trinity Home Care` |
| Meta description | `Trinity Home Care provides in-home meal preparation services in Pittsburgh — balanced, home-cooked meals tailored to your loved one's tastes, dietary needs, and daily routine.` |
| Canonical | `https://trinityhomecarepgh.com/services/meal-preparation.html` |
| JSON-LD name | `Meal Preparation Services` |
| Hero bg image | `../assets/images/services/caregiver-supporting-senior-meal-planning.jpg` |
| Hero eyebrow | `Meal Preparation` |
| H1 | `Nourishing meals —<br><em>made with care.</em>` |
| Hero subhead | `Balanced, home-cooked meals prepared around your loved one's tastes, dietary needs, and daily rhythm.` |
| §2 H2 | `What does meal preparation include?` |
| §2 para 1 | `Good nutrition is foundational to health, independence, and quality of life — but cooking becomes harder as mobility, energy, and appetite change with age. A Trinity caregiver prepares fresh meals that your loved one will actually eat, not institutional food delivered from elsewhere. They cook in the home kitchen, use familiar recipes when requested, and share the meal when that's what the client enjoys.` |
| §2 para 2 | `Caregivers also keep track of dietary restrictions and preferences, and can handle grocery shopping if needed. Meal preparation visits often become the social highlight of the day — not just nutrition, but a reason to sit down, eat well, and feel cared for.` |
| §2 checklist items | Breakfast, lunch, or dinner preparation · Accommodation of dietary restrictions (diabetic, low-sodium, soft diet, etc.) · Use of client's preferred recipes or familiar dishes · Kitchen cleanup after each meal · Grocery shopping coordination · Monitoring appetite and alerting family to changes |
| §2 photo src | `../assets/images/supporting/caregiver-client-home-visit.jpg` |
| §2 photo alt | `Caregiver preparing a nutritious home-cooked meal for a senior client` |
| §3 H2 | `Who benefits most from meal preparation support?` |
| §3 pills | Limited mobility · Dietary restrictions · Poor appetite · Post-surgery recovery · Living alone |
| §3 paragraph | `Meal prep support is ideal for seniors who are physically capable of most activities but find cooking difficult, tiring, or dangerous — and for anyone who has stopped enjoying food since losing a cooking partner.` |
| §4 H2 | `Signs your loved one may need meal preparation help` |
| §4 bullets | The refrigerator is mostly empty or filled with expired items · Your loved one has lost weight without explanation · They're relying on frozen dinners or skipping meals · Cooking has become a safety concern (forgotten burners, burns) · They mention not being hungry — often a sign of depression or poor nutrition |
| §5 H2 | `What meal preparation looks like in practice` |
| §5 photo src | `../assets/images/services/caregiver-supporting-senior-meal-planning.jpg` |
| §5 photo alt | `Caregiver and senior working together on a home-cooked meal` |
| §5 narrative | `Dorothy loves chicken soup made the way her late husband used to make it, and she wrote down his recipe years ago. Her caregiver, Ana, makes it every other Tuesday. The recipe takes an hour and fills the whole apartment with the smell of home. Dorothy eats two bowls and asks for the rest to be frozen for later in the week.` |
| §6 quote | `"My mother wasn't eating well at all — she'd lost seven pounds and we didn't understand why. Her caregiver started cooking for her and within a month she was back to her normal weight. She told me last week that she looks forward to meal days. That was everything to me."` |
| §6 attribution | `— Sandra R., Pittsburgh, daughter` |
| §7 related links | Companion Care · Light Housekeeping · Personal Care |
| §8 H2 | `Questions about meal preparation` |
| FAQ 1 Q | `Can caregivers accommodate special diets like diabetic or low-sodium?` |
| FAQ 1 A | `Yes. We document dietary restrictions at the time of the care assessment and match caregivers who have experience with those requirements. We ask families to share any guidelines from the client's doctor.` |
| FAQ 2 Q | `Do caregivers also do grocery shopping?` |
| FAQ 2 A | `Yes, with prior arrangement. Some caregivers shop during the visit (if the client stays home), and some accompany the client. We'll build the approach into the care plan.` |
| FAQ 3 Q | `Do caregivers clean up after cooking?` |
| FAQ 3 A | `Yes — kitchen cleanup is included as part of the meal preparation service.` |
| Footer/nav `aria-current="page"` | `meal-preparation.html` link |

- [ ] **Step 3: Verify in browser**

- [ ] **Step 4: Commit**

```bash
git add services/meal-preparation.html
git commit -m "feat: add meal preparation service page"
```

---

### Task 14: services/light-housekeeping.html

**Files:**
- Create: `services/light-housekeeping.html`

- [ ] **Step 1: Copy `services/personal-care.html` to `services/light-housekeeping.html`**

- [ ] **Step 2: Apply substitutions (IDs: `lh-`, FAQs: `faq-lh-`):**

| Element | Value |
|---------|-------|
| `<title>` | `Light Housekeeping Services in Pittsburgh, PA \| Trinity Home Care` |
| Meta description | `Trinity Home Care provides light housekeeping for seniors in Pittsburgh — regular cleaning, laundry, and home organization that keeps living spaces safe, clean, and comfortable.` |
| Canonical | `https://trinityhomecarepgh.com/services/light-housekeeping.html` |
| JSON-LD name | `Light Housekeeping Services` |
| Hero bg image | `../assets/images/services/service-light-housekeeping.jpg` |
| Hero eyebrow | `Light Housekeeping` |
| H1 | `A tidy home.<br><em>A clearer mind.</em>` |
| Hero subhead | `Safe, clean living spaces maintained without disrupting routines or rearranging what matters.` |
| §2 H2 | `What does light housekeeping include?` |
| §2 para 1 | `A cluttered or dusty home isn't just aesthetically uncomfortable — it's a fall hazard, a source of stress, and often a sign that someone needs more support than they've been asking for. Light housekeeping from Trinity keeps living spaces clean, organized, and safe without overwhelming a client who values their privacy or routine.` |
| §2 para 2 | `Our caregivers approach housekeeping with the same respect as all our other services: they follow the client's preferences, don't rearrange without asking, and focus on the rooms and tasks that matter most. Most clients pair housekeeping with another service so the caregiver is already there — it becomes a natural part of the visit.` |
| §2 checklist items | Vacuuming, sweeping, and mopping · Dusting surfaces and common areas · Kitchen and bathroom cleaning · Laundry, washing, and folding · Trash removal and recycling · Decluttering and organizing as requested |
| §2 photo src | `../assets/images/services/service-home-care-assistance.jpg` |
| §2 photo alt | `Caregiver assisting with light housekeeping tasks for a senior` |
| §3 H2 | `Who benefits most from light housekeeping?` |
| §3 pills | Mobility limitations · Recovering from illness · Arthritis or limited strength · Family lives at a distance · Consistent maintenance needed |
| §3 paragraph | `Light housekeeping is right for seniors who want a clean home but can no longer safely or comfortably maintain it themselves — and for families who want peace of mind that their loved one's environment is safe and dignified.` |
| §4 H2 | `Signs your loved one may need housekeeping support` |
| §4 bullets | Laundry is piling up or not being done regularly · The bathroom or kitchen hasn't been cleaned in some time · There are fall hazards — clutter, loose items, poor organization · Your loved one mentions feeling embarrassed about the state of their home · They've stopped having family or friends visit |
| §5 H2 | `What light housekeeping looks like in practice` |
| §5 photo src | `../assets/images/services/service-light-housekeeping.jpg` |
| §5 photo alt | `Caregiver completing light housekeeping tasks in a senior's home` |
| §5 narrative | `Every Friday, Ruth's caregiver arrives at 10:00 a.m. with a simple routine: bathroom first, then kitchen, then a quick vacuum of the living room and bedroom. Ruth stays in her favorite chair and watches the morning news. By noon the apartment smells clean, the laundry is folded on the bed, and Ruth's daughter can stop worrying about what she'll find on her next visit.` |
| §6 quote | `"I visited my father in September and the state of his house alarmed me — he just couldn't keep up with it anymore but he'd never ask for help. Trinity has made it part of his regular care and he seems more relaxed now that his home feels like his home again."` |
| §6 attribution | `— Brian T., Pittsburgh, son` |
| §7 related links | Meal Preparation · Personal Care · Companion Care |
| §8 H2 | `Questions about light housekeeping` |
| FAQ 1 Q | `What does "light" housekeeping include and exclude?` |
| FAQ 1 A | `Light housekeeping covers regular cleaning tasks — vacuuming, dusting, laundry, bathroom and kitchen cleaning, trash. It doesn't include deep-cleaning projects, heavy furniture moving, or exterior work.` |
| FAQ 2 Q | `Can caregivers do laundry?` |
| FAQ 2 A | `Yes — washing, drying, and folding laundry is included.` |
| FAQ 3 Q | `Will the caregiver rearrange things without asking?` |
| FAQ 3 A | `No. We follow the client's preferences and always ask before moving or reorganizing anything of significance. The goal is a cleaner version of their home, not a different one.` |
| Footer/nav `aria-current="page"` | `light-housekeeping.html` link |

- [ ] **Step 3: Verify in browser**

- [ ] **Step 4: Commit**

```bash
git add services/light-housekeeping.html
git commit -m "feat: add light housekeeping service page"
```

---

### Task 15: services/mobility-safety-support.html

**Files:**
- Create: `services/mobility-safety-support.html`

- [ ] **Step 1: Copy `services/personal-care.html` to `services/mobility-safety-support.html`**

- [ ] **Step 2: Apply substitutions (IDs: `ms-`, FAQs: `faq-ms-`):**

| Element | Value |
|---------|-------|
| `<title>` | `Mobility & Safety Support in Pittsburgh, PA \| Trinity Home Care` |
| Meta description | `Trinity Home Care offers mobility and safety support in Pittsburgh — fall prevention, transfer assistance, and movement support that keeps seniors active, confident, and safely at home.` |
| Canonical | `https://trinityhomecarepgh.com/services/mobility-safety-support.html` |
| JSON-LD name | `Mobility and Safety Support` |
| Hero bg image | `../assets/images/supporting/caregiver-senior-cane-support.jpg` |
| Hero eyebrow | `Mobility & Safety Support` |
| H1 | `Move safely.<br><em>Stay independent.</em>` |
| Hero subhead | `Fall prevention, transfer assistance, and movement support so your loved one can stay active and at home — on their own terms.` |
| §2 H2 | `What does mobility and safety support include?` |
| §2 para 1 | `Falls are the leading cause of injury-related hospitalization among older adults — and fear of falling can be as limiting as falling itself. A Trinity caregiver trained in mobility support helps your loved one move through their day safely: standing up from chairs, navigating stairs, getting in and out of the car, and completing exercises their therapist has prescribed.` |
| §2 para 2 | `Mobility support isn't just physical. A caregiver who walks beside someone with a steady arm and a calm presence changes the whole experience of moving through the day. Clients tell us they feel more confident and more willing to move when they're not doing it alone.` |
| §2 checklist items | Transfer assistance (bed to chair, chair to standing) · Safe ambulation support (walker, cane, or arm assistance) · Fall prevention environment monitoring · Assistance with prescribed home exercises · Accompaniment on walks and community outings · Guidance with wheelchair or mobility aid use |
| §2 photo src | `../assets/images/supporting/caregiver-senior-exercise-support.jpg` |
| §2 photo alt | `Caregiver providing mobility and safety support for a senior` |
| §3 H2 | `Who benefits most from mobility and safety support?` |
| §3 pills | Fall risk seniors · Post-surgery or post-stroke recovery · Parkinson's patients · Walker or wheelchair users · Rebuilding strength |
| §3 paragraph | `Mobility support is most valuable for clients recovering from a fall, a joint replacement, a stroke, or any event that has diminished their confidence or capacity to move independently. It also provides critical protection for those whose balance or coordination has declined with age.` |
| §4 H2 | `Signs your loved one may need mobility support` |
| §4 bullets | Your loved one has fallen once in the past year · They grip walls or furniture when moving around the home · They've stopped going outside to avoid the risk of falling · A doctor or physical therapist has noted fall risk in a recent visit · They pause too long before standing — fear, not just caution |
| §5 H2 | `What mobility support looks like in practice` |
| §5 photo src | `../assets/images/supporting/caregiver-senior-cane-support.jpg` |
| §5 photo alt | `Caregiver providing steady support for a senior using a cane` |
| §5 narrative | `George had a hip replacement four months ago. He's mostly back to himself, but getting up from his recliner in the evening is still hard. When his caregiver is there, she stands in front of him, hands steady, and they do it together — three seconds, easy. When she's not there, George sometimes stays seated longer than he should just to avoid the moment. Trinity is working on extending the evening visit.` |
| §6 quote | `"My husband had a stroke two years ago and he was terrified to walk. His caregiver worked with him slowly, never pushing, just steady and present. He's walking to the mailbox now. Six months ago I wouldn't have believed it."` |
| §6 attribution | `— Martha S., Pittsburgh, wife` |
| §7 related links | Personal Care · Post-Hospital Recovery · Dementia & Alzheimer's Care |
| §8 H2 | `Questions about mobility and safety support` |
| FAQ 1 Q | `Are Trinity caregivers trained in safe transfer and lift techniques?` |
| FAQ 1 A | `Yes. All caregivers receive training in safe transfer techniques and body mechanics. For clients with complex mobility needs, we assess those needs during the in-home assessment and match accordingly.` |
| FAQ 2 Q | `Can a caregiver assist with physical therapy exercises?` |
| FAQ 2 A | `Caregivers can support and encourage prescribed home exercises provided by a physical therapist, but they do not perform or modify therapy. We coordinate with the PT when needed.` |
| FAQ 3 Q | `Can you help reduce fall risks in the home?` |
| FAQ 3 A | `Yes. As part of the in-home assessment, we note fall hazards — loose rugs, poor lighting, cluttered pathways — and bring them to the family's attention. We don't make modifications ourselves, but we make sure you know about them.` |
| Footer/nav `aria-current="page"` | `mobility-safety-support.html` link |

- [ ] **Step 3: Verify in browser**

- [ ] **Step 4: Commit**

```bash
git add services/mobility-safety-support.html
git commit -m "feat: add mobility and safety support service page"
```

---

### Task 16: services/dementia-alzheimers-care.html

**Files:**
- Create: `services/dementia-alzheimers-care.html`

- [ ] **Step 1: Copy `services/personal-care.html` to `services/dementia-alzheimers-care.html`**

- [ ] **Step 2: Apply substitutions (IDs: `da-`, FAQs: `faq-da-`):**

| Element | Value |
|---------|-------|
| `<title>` | `Dementia & Alzheimer's Care in Pittsburgh, PA \| Trinity Home Care` |
| Meta description | `Trinity Home Care provides dementia and Alzheimer's care in Pittsburgh — patient, structured home care tailored to memory loss at every stage, with close family communication throughout.` |
| Canonical | `https://trinityhomecarepgh.com/services/dementia-alzheimers-care.html` |
| JSON-LD name | `Dementia and Alzheimer's Care` |
| Hero bg image | `../assets/images/supporting/caregiver-holding-senior-hand.jpg` |
| Hero eyebrow | `Dementia & Alzheimer's Care` |
| H1 | `Gentle, consistent care —<br><em>through every stage.</em>` |
| Hero subhead | `Memory care delivered at home with patience, structure, and the kind of calm presence that makes hard days better.` |
| §2 H2 | `What does dementia and Alzheimer's care include?` |
| §2 para 1 | `Caring for someone with dementia or Alzheimer's requires a different kind of skill. It's not just about physical tasks — it's about reading the room, maintaining a consistent routine, responding to confusion with calm rather than correction, and knowing when to redirect and when to simply sit together. Trinity selects and trains caregivers for memory care specifically, not just generally.` |
| §2 para 2 | `We also work closely with families. The disease affects everyone in the household, and caregivers are trained to notice changes in condition, communicate them clearly, and support family members who are navigating their own grief alongside the day-to-day of caregiving. We take the whole picture seriously.` |
| §2 checklist items | Consistent daily routines tailored to the client's patterns · Redirection and de-escalation during confusion or agitation · Personal care with dementia-specific communication · Safety monitoring and wandering prevention · Engagement through familiar activities, music, and memory cues · Regular family updates and care team communication |
| §2 photo src | `../assets/images/supporting/group-seniors-caregiver-smiling.jpg` |
| §2 photo alt | `Caregiver engaging warmly with a senior during a memory care visit` |
| §3 H2 | `Who benefits most from dementia and Alzheimer's care?` |
| §3 pills | Early, moderate, and late-stage Alzheimer's · Vascular dementia · Lewy body dementia · Families providing unpaid care · Clients who prefer to stay home |
| §3 paragraph | `Dementia care at home is often possible longer than families expect — with the right caregiver. It's best suited for clients who are still most comfortable in a familiar environment and for families who want to delay or avoid memory care facility placement.` |
| §4 H2 | `Signs your loved one may need dementia care support` |
| §4 bullets | Your loved one is frequently confused about time, place, or people · They've had wandering incidents or close calls at home · Caregiver burnout is affecting your own health or relationships · Sundowning is creating evening tension and sleep disruption · Personal hygiene or meals are being missed or refused |
| §5 H2 | `What dementia care looks like in practice` |
| §5 photo src | `../assets/images/supporting/caregiver-holding-senior-hand.jpg` |
| §5 photo alt | `Caregiver sitting with and comforting a senior during a memory care visit` |
| §5 narrative | `Some mornings Frank doesn't know what day it is, and his caregiver, Debra, doesn't tell him directly. She says good morning, mentions that breakfast smells good, and they walk to the kitchen together. By the time they sit down, Frank is calm and present. Debra has been working with him for eight months. His wife says the hardest part of the week is the days Debra isn't there.` |
| §6 quote | `"My mother has Alzheimer's and the progression has been hard for all of us. Her Trinity caregiver has a way with her that I can't fully explain — she knows when to be quiet, when to redirect, when to just hold her hand. My mother is calmer than she's been in two years."` |
| §6 attribution | `— Thomas W., Pittsburgh, son` |
| §7 related links | Respite Care · Personal Care · Mobility & Safety Support |
| §8 H2 | `Questions about dementia and Alzheimer's care` |
| FAQ 1 Q | `Are Trinity caregivers specifically trained in dementia care?` |
| FAQ 1 A | `Yes. Caregivers assigned to memory care clients receive specialized training in dementia communication, behavioral support, and safety monitoring — beyond our standard training.` |
| FAQ 2 Q | `How do you handle agitation or difficult behaviors?` |
| FAQ 2 A | `Our caregivers are trained in de-escalation, redirection, and calm presence techniques that reduce — rather than react to — agitation. We document behavioral patterns and communicate them to families so everyone is working from the same picture.` |
| FAQ 3 Q | `Can you provide care as the disease progresses to later stages?` |
| FAQ 3 A | `Yes. We develop care plans that can evolve with the client's needs. As care requirements increase, we adjust hours, caregiver selection, and service types accordingly.` |
| Footer/nav `aria-current="page"` | `dementia-alzheimers-care.html` link |

- [ ] **Step 3: Verify in browser**

- [ ] **Step 4: Commit**

```bash
git add services/dementia-alzheimers-care.html
git commit -m "feat: add dementia and alzheimers care service page"
```

---

### Task 17: services/respite-care.html

**Files:**
- Create: `services/respite-care.html`

- [ ] **Step 1: Copy `services/personal-care.html` to `services/respite-care.html`**

- [ ] **Step 2: Apply substitutions (IDs: `rc-`, FAQs: `faq-rc-`):**

| Element | Value |
|---------|-------|
| `<title>` | `Respite Care in Pittsburgh, PA \| Trinity Home Care` |
| Meta description | `Trinity Home Care provides respite care in Pittsburgh — temporary relief for family caregivers who need time to rest, recover, or step away, while their loved one receives consistent, compassionate care.` |
| Canonical | `https://trinityhomecarepgh.com/services/respite-care.html` |
| JSON-LD name | `Respite Care` |
| Hero bg image | `../assets/images/supporting/caregiver-client-home-visit-alt.jpg` |
| Hero eyebrow | `Respite Care` |
| H1 | `Rest for you.<br><em>Continuity for them.</em>` |
| Hero subhead | `Temporary relief for family caregivers — planned or urgent — so you can step away without worry.` |
| §2 H2 | `What does respite care include?` |
| §2 para 1 | `Family caregiving is one of the most demanding and underrecognized roles there is. Respite care exists specifically for the caregiver — to give you time to rest, handle your own obligations, or simply step out of the role long enough to come back to it with more to give. It is not a failure to ask for this. It is what makes sustained caregiving possible.` |
| §2 para 2 | `Trinity provides respite care for a few hours, a full day, or an extended stretch when a family caregiver needs surgery, travel, or time to recover. We step in with the same structure and warmth your loved one is used to, so the transition is smooth and the return feels natural.` |
| §2 checklist items | Short-term coverage (a few hours to a full day) · Extended respite for planned family travel or events · Emergency or short-notice coverage when possible · Full personal care, companion, meal, and housekeeping services during respite · Daily family updates during extended respite · Transition support when the family caregiver returns |
| §2 photo src | `../assets/images/supporting/caregiver-standing-with-senior-wheelchair.jpg` |
| §2 photo alt | `Caregiver providing attentive respite care for a senior at home` |
| §3 H2 | `Who benefits most from respite care?` |
| §3 pills | Exhausted family caregivers · Recovering from their own health events · Work or travel obligations · Families in crisis · Anyone needing a break |
| §3 paragraph | `Respite care is for the caregiver as much as the client. If you've been providing daily care for months or years, you don't need a reason to ask for relief — you need to be told it's available and that your loved one will be well cared for while you're gone.` |
| §4 H2 | `Signs you may need respite care` |
| §4 intro | `Caregiver burnout is real, and these are the signs it's building:` |
| §4 bullets | You've put off your own medical appointments to manage care · You feel resentful, exhausted, or like there is no end in sight · You have an upcoming commitment — travel, work, surgery — with no coverage plan · You've snapped at your loved one and felt ashamed about it · Your own health is suffering from the demands of caregiving |
| §5 H2 | `What respite care looks like in practice` |
| §5 photo src | `../assets/images/supporting/caregiver-client-home-visit-alt.jpg` |
| §5 photo alt | `Caregiver providing continuity of care during a family respite period` |
| §5 narrative | `Lisa has been caring for her mother full-time for fourteen months. Her sister is visiting from Cleveland and they've planned a weekend trip — the first time Lisa has been out of Pittsburgh in over a year. Trinity steps in for 52 hours: personal care, meals, companion visits, the full routine. When Lisa returns Sunday evening, her mother is watching television and doesn't seem to have noticed she was gone. Lisa cries in the car before going inside.` |
| §6 quote | `"I hadn't slept a full night in eight months. My husband was ill and I was his only caregiver. Trinity came for three days while I went to my sister's, and for the first time in almost a year I felt like myself again. It changed everything."` |
| §6 attribution | `— Eleanor H., Pittsburgh, wife` |
| §7 related links | Dementia & Alzheimer's Care · Personal Care · Companion Care |
| §8 H2 | `Questions about respite care` |
| FAQ 1 Q | `How long can a respite care arrangement last?` |
| FAQ 1 A | `As long as you need. We've done a few hours, long weekends, and multi-week arrangements. We build the schedule and care plan around whatever works for your family.` |
| FAQ 2 Q | `Will my loved one's routine change during respite?` |
| FAQ 2 A | `We make every effort to maintain familiar routines during respite — meals at the same time, the same morning and evening patterns. The goal is continuity, not substitution.` |
| FAQ 3 Q | `Can respite care be arranged on short notice?` |
| FAQ 3 A | `We do our best. We can't guarantee same-day coverage in every situation, but for urgent needs we make it a priority. Call us and we'll tell you honestly what we can do.` |
| Footer/nav `aria-current="page"` | `respite-care.html` link |

- [ ] **Step 3: Verify in browser**

- [ ] **Step 4: Commit**

```bash
git add services/respite-care.html
git commit -m "feat: add respite care service page"
```

---

### Task 18: services/post-hospital-recovery.html

**Files:**
- Create: `services/post-hospital-recovery.html`

- [ ] **Step 1: Copy `services/personal-care.html` to `services/post-hospital-recovery.html`**

- [ ] **Step 2: Apply substitutions (IDs: `ph-`, FAQs: `faq-ph-`):**

| Element | Value |
|---------|-------|
| `<title>` | `Post-Hospital Home Care in Pittsburgh, PA \| Trinity Home Care` |
| Meta description | `Trinity Home Care provides post-hospital recovery care in Pittsburgh — attentive home support from discharge day through recovery, reducing readmission risk and keeping families informed.` |
| Canonical | `https://trinityhomecarepgh.com/services/post-hospital-recovery.html` |
| JSON-LD name | `Post-Hospital Recovery Care` |
| Hero bg image | `../assets/images/supporting/caregiver-reviewing-paperwork-with-senior.jpg` |
| Hero eyebrow | `Post-Hospital Recovery` |
| H1 | `From discharge day<br><em>to fully home.</em>` |
| Hero subhead | `Skilled, attentive support during the most vulnerable window in recovery — the first weeks back home.` |
| §2 H2 | `What does post-hospital recovery care include?` |
| §2 para 1 | `The transition from hospital to home is one of the highest-risk periods in an older adult's health trajectory. Instructions are often complex, medications have changed, and the energy required to follow through on recovery isn't always there. A Trinity caregiver arrives on discharge day and stays as involved as needed to keep the recovery on track and prevent a return to the hospital.` |
| §2 para 2 | `Post-hospital care is temporary by nature — it ends when your loved one is stable, confident, and fully back to their routine. We build the care plan around the recovery timeline and adjust as things improve. Most clients find they need us for two to six weeks, sometimes longer after a major event.` |
| §2 checklist items | Discharge day pickup and home transition · Medication reminder support following the discharge regimen · Wound care monitoring (caregiver alerts family to changes; does not treat) · Appointment transportation and preparation · Assistance with prescribed PT home exercises · Progress updates to family and coordination with care team |
| §2 photo src | `../assets/images/supporting/team-caregiver-client-portrait.jpg` |
| §2 photo alt | `Trinity caregiver supporting a senior's recovery at home after a hospital stay` |
| §3 H2 | `Who benefits most from post-hospital recovery care?` |
| §3 pills | Joint replacement recovery · Post-cardiac event · Stroke rehabilitation · Major surgery recovery · Fall or fracture recovery |
| §3 paragraph | `Post-hospital care is most critical for older adults returning home after a major procedure or health event, especially those who live alone or who are at elevated readmission risk. The first two weeks after discharge are when complications most often occur.` |
| §4 H2 | `Signs post-hospital care is the right fit` |
| §4 intro | `These are the situations that typically call for post-hospital support:` |
| §4 bullets | Your loved one has been discharged and you're worried about what comes next · They've been readmitted to the hospital within 30 days before · They live alone and won't have consistent family coverage · Discharge instructions are complex and hard to manage independently · A physical therapist or doctor has recommended home support |
| §5 H2 | `What post-hospital recovery care looks like in practice` |
| §5 photo src | `../assets/images/supporting/caregiver-reviewing-paperwork-with-senior.jpg` |
| §5 photo alt | `Caregiver and family member reviewing post-hospital care instructions together` |
| §5 narrative | `Arthur was discharged after hip surgery on a Tuesday. His caregiver met him at the front door of the hospital with his daughter and helped settle him into the house. By Thursday, Arthur had taken all the right medications, attended one PT visit, and eaten three real meals. He called his daughter on Friday and told her he felt better than he expected. She called Trinity to say she'd like to continue through week four.` |
| §6 quote | `"My father came home from a major cardiac procedure and I was terrified. He lives alone and I work full time. His Trinity caregiver was there on discharge day, knew his whole medication schedule by heart, and kept me updated every day. He didn't go back to the hospital. That was everything."` |
| §6 attribution | `— Michael T., Pittsburgh, son` |
| §7 related links | Medication Reminders · Mobility & Safety Support · Personal Care |
| §8 H2 | `Questions about post-hospital recovery care` |
| FAQ 1 Q | `When should home care start after hospital discharge?` |
| FAQ 1 A | `Ideally, on discharge day. The transition from hospital to home is the highest-risk period — having a caregiver there from the first day reduces the risk of early complications and sets the recovery routine immediately.` |
| FAQ 2 Q | `Can a Trinity caregiver coordinate with my loved one's medical team?` |
| FAQ 2 A | `Caregivers don't communicate with medical teams directly, but they document and report changes in condition to the family and care coordinator so you can follow up with the care team quickly. We keep you informed so you can keep them informed.` |
| FAQ 3 Q | `What if my loved one needs more care than expected?` |
| FAQ 3 A | `We adjust. Care plans are built to be modified. If recovery takes longer or new needs emerge, we extend or expand the plan accordingly. There's no penalty for changing course.` |
| Footer/nav `aria-current="page"` | `post-hospital-recovery.html` link |

- [ ] **Step 3: Verify in browser**

- [ ] **Step 4: Commit**

```bash
git add services/post-hospital-recovery.html
git commit -m "feat: add post-hospital recovery service page"
```

---

### Task 19: services/veteran-care.html

**Files:**
- Create: `services/veteran-care.html`

- [ ] **Step 1: Copy `services/personal-care.html` to `services/veteran-care.html`**

- [ ] **Step 2: Apply substitutions (IDs: `vc-`, FAQs: `faq-vc-`):**

| Element | Value |
|---------|-------|
| `<title>` | `Home Care for Veterans in Pittsburgh, PA \| Trinity Home Care` |
| Meta description | `Trinity Home Care provides home care for veterans in Pittsburgh — respectful, personalized support for those who served, with guidance on VA benefits including Aid & Attendance.` |
| Canonical | `https://trinityhomecarepgh.com/services/veteran-care.html` |
| JSON-LD name | `Veteran Home Care` |
| Hero bg image | `../assets/images/hero/hero-caregiver-wheelchair-support.jpg` |
| Hero eyebrow | `Veteran Care` |
| H1 | `For those who<br><em>served.</em>` |
| Hero subhead | `Home care delivered with genuine respect for veterans — their service, their independence, and their right to age on their own terms.` |
| §2 H2 | `What does veteran care include?` |
| §2 para 1 | `Veterans have a different relationship with asking for help — they often delay it longer, frame it differently, and need to know that the person caring for them understands and respects that. Trinity provides home care for veterans who want to remain at home with the same dignity they've always carried, served by caregivers who approach them with real appreciation for what they've given.` |
| §2 para 2 | `We work with families to understand each veteran's service history, preferences, and any service-related health considerations that should inform care. We also help families navigate potential VA benefits — including Aid & Attendance — that may offset the cost of home care.` |
| §2 checklist items | Personal care and companion services tailored to veteran preferences · Sensitivity to service-related injuries, PTSD, and health conditions · Assistance navigating VA Aid & Attendance benefit information · Flexible scheduling for VA clinic or medical appointments · Transportation to VA appointments · Caregiver matching based on veterans' personalities and communication styles |
| §2 photo src | `../assets/images/supporting/caregiver-smiling-with-senior-wheelchair.jpg` |
| §2 photo alt | `Trinity caregiver providing respectful care for a veteran at home` |
| §3 H2 | `Who benefits most from veteran care?` |
| §3 pills | Veterans of all eras · Service-related conditions · Reluctant to ask for help · Family at a distance · May qualify for VA Aid & Attendance |
| §3 paragraph | `Veteran care is for any older veteran who needs home care and wants it delivered by people who understand and respect their background. It's also for families who want the cost conversation handled thoughtfully — VA benefits can make home care significantly more accessible.` |
| §4 H2 | `Signs your veteran family member may need care support` |
| §4 intro | `These are the situations families describe most often before reaching out:` |
| §4 bullets | Your veteran family member refuses to accept help from "strangers" · They have service-related injuries or conditions affecting daily life · The family isn't sure what VA benefits they might be eligible for · They've been reluctant to pursue care from agencies they see as impersonal · Care needs are increasing but your veteran wants to stay home |
| §5 H2 | `What veteran care looks like in practice` |
| §5 photo src | `../assets/images/hero/hero-caregiver-wheelchair-support.jpg` |
| §5 photo alt | `Caregiver providing compassionate support for a veteran at home` |
| §5 narrative | `Bill served in Vietnam and spent forty years telling his family he didn't need any help. He's 78 now and agreed to try Trinity after his daughter mentioned that his caregiver was a former Army medic. They spend part of each visit talking. Bill still says he doesn't need help. But he makes sure he's ready when his caregiver arrives.` |
| §6 quote | `"My father is a Korean War veteran and getting him to accept care was its own mission. Trinity found someone who spoke his language — not literally, but in terms of respect and directness. He finally feels like he's being taken care of by someone who gets it."` |
| §6 attribution | `— Nancy L., Pittsburgh, daughter` |
| §7 related links | Personal Care · Companion Care · Mobility & Safety Support |
| §8 H2 | `Questions about veteran care` |
| FAQ 1 Q | `Does Trinity accept VA benefits or Aid & Attendance?` |
| FAQ 1 A | `We work with families to help navigate the Aid & Attendance benefit, which can help eligible veterans and surviving spouses offset the cost of home care. We recommend speaking directly with the VA or a VA-accredited claims agent for the eligibility process, and we're happy to discuss how our services align with what the benefit covers.` |
| FAQ 2 Q | `Are caregivers trained to work with veterans?` |
| FAQ 2 A | `Yes. Caregivers assigned to veteran clients are briefed on service history, any service-related health considerations, and the specific communication preferences that make care feel respectful rather than managed.` |
| FAQ 3 Q | `What if my veteran family member is reluctant to accept help?` |
| FAQ 3 A | `That's one of the most common things we hear. A free, no-pressure consultation call often helps — both with you and, if they're willing, directly with your family member. We've helped many families navigate that first conversation.` |
| Footer/nav `aria-current="page"` | `veteran-care.html` link |

- [ ] **Step 3: Open each of the 10 service pages and verify they all render correctly with unique content, nav dropdown works, footer links work**

- [ ] **Step 4: Commit**

```bash
git add services/veteran-care.html
git commit -m "feat: add veteran care service page — completes all 10 service pages"
```

---

## Final Verification

After all 19 tasks:

- [ ] Open `index.html` — hover Services nav, confirm dropdown shows all 10 services in two groups
- [ ] Tap hamburger on mobile — confirm Services accordion expands/collapses
- [ ] Click each core service card on `services.html` — confirm it navigates to the correct page
- [ ] On each service page — confirm nav `aria-current="page"` is on the correct dropdown link
- [ ] On each service page — confirm FAQ opens one at a time
- [ ] On each service page — confirm CTA form validates (submit with blank phone)
- [ ] Confirm footer shows 10 service links on all pages

```bash
node --check js/main.js
node --check js/services-page.js
```
Expected: no output for both.
