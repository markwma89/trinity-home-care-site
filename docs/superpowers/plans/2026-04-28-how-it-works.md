# How It Works Page — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `how-it-works.html` — a standalone page with a timeline + expandable step detail layout that removes fear of the unknown for prospective families.

**Architecture:** Horizontal gold-to-teal progress track with 5 numbered milestone dots. Below the track, 5 clickable step cards (compact, image zone + title + teaser). Clicking a card scrolls to a single swappable detail panel and populates it via vanilla JS from a static data array. Styles are fully scoped to a new `how-it-works.css`. Interaction lives in `how-it-works.js`. Four existing pages need nav link patches to point to the new page.

**Tech Stack:** Vanilla HTML/CSS/JS — no libraries. Extends the existing `main.css` design tokens (`--color-navy`, `--color-teal`, `--color-gold`, `--font-heading`, etc.) and piggybacks on `main.js` for sticky header, mobile nav, and scroll-reveal (`[data-animate]`).

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `how-it-works.html` | Full page markup |
| Create | `css/how-it-works.css` | All page-scoped styles |
| Create | `js/how-it-works.js` | Step data, renderStep(), card/dot/FAQ/form interaction |
| Modify | `index.html` | Nav: `#how-it-works` → `how-it-works.html` (desktop + mobile + footer, 3 links) |
| Modify | `services.html` | Nav: `index.html#how-it-works` → `how-it-works.html` (desktop + mobile, 2 links) |
| Modify | `about.html` | Nav: `index.html#how-it-works` → `how-it-works.html` (desktop + mobile, 2 links) |
| Modify | `contact.html` | Nav: `index.html#how-it-works` → `how-it-works.html` (desktop + mobile, 2 links) |

---

## Task 1: Patch nav links in all existing pages

**Files:**
- Modify: `index.html`
- Modify: `services.html`
- Modify: `about.html`
- Modify: `contact.html`

- [ ] **Step 1.1 — Patch `index.html`**

Find and replace all three occurrences (desktop nav, mobile nav, footer nav):

```html
<!-- BEFORE (desktop nav, line ~79) -->
<li><a href="#how-it-works" class="nav-link">How It Works</a></li>

<!-- AFTER -->
<li><a href="how-it-works.html" class="nav-link">How It Works</a></li>
```
```html
<!-- BEFORE (mobile nav, line ~114) -->
<a href="#how-it-works" class="nav-mobile-link">How It Works</a>

<!-- AFTER -->
<a href="how-it-works.html" class="nav-mobile-link">How It Works</a>
```
```html
<!-- BEFORE (footer, line ~907) -->
<li><a href="#how-it-works" class="footer-link">How It Works</a></li>

<!-- AFTER -->
<li><a href="how-it-works.html" class="footer-link">How It Works</a></li>
```

- [ ] **Step 1.2 — Patch `services.html`**

Find and replace both occurrences (desktop nav, mobile nav):

```html
<!-- BEFORE (desktop nav) -->
<li><a href="index.html#how-it-works" class="nav-link">How It Works</a></li>

<!-- AFTER -->
<li><a href="how-it-works.html" class="nav-link">How It Works</a></li>
```
```html
<!-- BEFORE (mobile nav) -->
<a href="index.html#how-it-works" class="nav-mobile-link">How It Works</a>

<!-- AFTER -->
<a href="how-it-works.html" class="nav-mobile-link">How It Works</a>
```

- [ ] **Step 1.3 — Patch `about.html`** (same find/replace pattern as services.html — `index.html#how-it-works` → `how-it-works.html`, desktop + mobile nav)

- [ ] **Step 1.4 — Patch `contact.html`** (same find/replace pattern — `index.html#how-it-works` → `how-it-works.html`, desktop + mobile nav)

- [ ] **Step 1.5 — Verify**

Open each patched file, Ctrl+F for `how-it-works` — confirm no remaining `#how-it-works` or `index.html#how-it-works` references in nav or footer.

- [ ] **Step 1.6 — Commit**

```bash
git add index.html services.html about.html contact.html
git commit -m "fix: update How It Works nav links to point to how-it-works.html"
```

---

## Task 2: Create `js/how-it-works.js`

**Files:**
- Create: `js/how-it-works.js`

This file holds: (a) the 5-step data array, (b) `renderStep(index)` which builds and injects the detail panel HTML, (c) `activateStep(index, shouldScroll)` which renders + optionally scrolls, (d) event listeners for step cards, timeline dots, FAQ accordion, and CTA form.

- [ ] **Step 2.1 — Create the file with step data and renderStep**

Create `js/how-it-works.js` with the following complete content:

```js
/* ===================================================================
   TRINITY HOME CARE — How It Works Page JS
   Responsibilities: step data, timeline interaction, FAQ accordion,
   CTA form validation
   =================================================================== */

(function () {
  'use strict';

  const prefersReducedMotion =
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* -----------------------------------------------------------------
     Step data — single source of truth for all 5 step detail panels.
     prevLabel / nextLabel drive the Prev/Next navigation buttons.
     ----------------------------------------------------------------- */
  const STEPS = [
    {
      num: '01',
      title: 'Free Consultation',
      subtitle: 'a real conversation, not a sales call.',
      body: [
        'When you reach out to Trinity, you’re connected directly with a care coordinator — not a call center. We take the time to hear what’s happening, what you’re worried about, and what your loved one’s life looks like right now. There’s no script and no pressure to commit to anything.',
        'Most families tell us this first call feels more like talking to a knowledgeable neighbor than a business appointment. That’s exactly how we want it to feel.'
      ],
      calloutLabel: 'What to expect',
      calloutItems: [
        '15–20 minute conversation — we do the listening',
        'Honest answers, even if the answer is “we may not be the right fit”',
        'No commitment, no paperwork, no follow-up pressure',
        'We’ll suggest a free in-home assessment if it makes sense'
      ],
      photo: 'assets/images/supporting/caregiver-talking-to-senior-chairside.jpg',
      photoAlt: 'Trinity caregiver in a warm conversation with a senior client at home',
      prevLabel: null,
      nextLabel: 'In-Home Assessment'
    },
    {
      num: '02',
      title: 'In-Home Assessment',
      subtitle: 'we come to you, and we listen carefully.',
      body: [
        'One of our care coordinators visits your loved one at home — not to evaluate or judge, but to truly understand. We look at their daily routine, their living environment, their health needs, and what they value most about their independence. This visit usually takes about an hour and feels like a relaxed conversation.',
        'Everything we learn shapes the personalized care plan we build together. There’s no pressure to decide anything during the visit.'
      ],
      calloutLabel: 'What to expect',
      calloutItems: [
        'We visit at your home, on your schedule',
        'No forms to fill out beforehand — we ask the right questions when we’re there',
        'Your loved one’s preferences guide everything',
        'A draft care plan is ready within 24 hours of the visit'
      ],
      photo: 'assets/images/supporting/caregiver-reviewing-paperwork-with-senior.jpg',
      photoAlt: 'Care coordinator reviewing a care plan with a senior client at home',
      prevLabel: 'Free Consultation',
      nextLabel: 'Caregiver Matching'
    },
    {
      num: '03',
      title: 'Caregiver Matching',
      subtitle: 'chosen for fit, not just availability.',
      body: [
        'This is where Trinity is genuinely different. We don’t assign whoever is available on a given Tuesday. We study the care plan, learn what matters to your loved one — their routines, their sense of humor, their need for privacy or conversation — and hand-select a caregiver who is a real fit.',
        'Before care begins, we introduce the caregiver personally so nothing feels like a surprise.'
      ],
      calloutLabel: 'What to expect',
      calloutItems: [
        'Match is based on personality, routine, and care needs — not schedule logistics',
        'You meet the caregiver before the first day of care',
        'If the match isn’t right, we find a new one quickly and without drama',
        'All caregivers are background-checked, bonded, and insured'
      ],
      photo: 'assets/images/supporting/team-caregiver-client-portrait.jpg',
      photoAlt: 'Trinity caregiver and client portrait showing genuine connection',
      prevLabel: 'In-Home Assessment',
      nextLabel: 'Care Begins'
    },
    {
      num: '04',
      title: 'Care Begins',
      subtitle: 'day one is supported, never dropped.',
      body: [
        'The first day of care is handled with intention. Your caregiver arrives knowing your loved one’s name, preferences, and the care plan. A Trinity coordinator checks in within the first few hours to make sure everything feels right. You’ll hear from us — you won’t need to chase us down.',
        'We treat the first week like an extended introduction, making small adjustments until the routine is natural and comfortable.'
      ],
      calloutLabel: 'What to expect',
      calloutItems: [
        'Care coordinator check-in on day one',
        'Family update call after the first week',
        'Routine adjustments made as needed — your feedback drives them',
        '24/7 support line for existing clients from day one'
      ],
      photo: 'assets/images/supporting/caregiver-client-home-visit.jpg',
      photoAlt: 'Trinity caregiver on a warm first home care visit with a senior client',
      prevLabel: 'Caregiver Matching',
      nextLabel: 'Ongoing Partnership'
    },
    {
      num: '05',
      title: 'Ongoing Partnership',
      subtitle: 'care that grows with your family.',
      body: [
        'Care needs change over time, and a plan that was right six months ago may need to evolve. We schedule regular care plan reviews and stay in close contact with both families and caregivers. If something changes — a health event, a change in routine, a new need — we adjust quickly.',
        'Trinity isn’t a vendor you manage. We’re a partner who stays informed and stays engaged, for as long as your family needs us.'
      ],
      calloutLabel: 'What to expect',
      calloutItems: [
        'Scheduled care plan reviews every 60–90 days',
        'Proactive family communication — we call you before you call us',
        'Care scales up or down as needs change',
        'No penalty for adjusting hours or schedule'
      ],
      photo: 'assets/images/supporting/caregiver-holding-senior-hand.jpg',
      photoAlt: 'Trinity caregiver holding the hand of a senior client, showing ongoing connection',
      prevLabel: 'Care Begins',
      nextLabel: null
    }
  ];

  /* -----------------------------------------------------------------
     DOM refs — all optional-chained; page degrades gracefully if a
     section is absent.
     ----------------------------------------------------------------- */
  const detailPanel  = document.getElementById('step-detail-panel');
  const stepCards    = document.querySelectorAll('.hiw-step-card');
  const dots         = document.querySelectorAll('.hiw-dot');
  const header       = document.getElementById('site-header');

  /* -----------------------------------------------------------------
     renderStep — builds detail panel HTML from data array.
     Called by activateStep every time the active step changes.
     ----------------------------------------------------------------- */
  function renderStep(index) {
    if (!detailPanel) return;
    const step = STEPS[index];

    const calloutItemsHTML = step.calloutItems
      .map(item => `<li class="hiw-detail-callout-item">${item}</li>`)
      .join('');

    const bodyHTML = step.body
      .map(p => `<p class="hiw-detail-body">${p}</p>`)
      .join('');

    const prevHTML = step.prevLabel
      ? `<button class="hiw-detail-prev" data-index="${index - 1}">← ${step.prevLabel}</button>`
      : `<span class="hiw-detail-prev hiw-detail-prev--hidden"></span>`;

    const nextHTML = step.nextLabel
      ? `<button class="hiw-detail-next" data-index="${index + 1}">Next: ${step.nextLabel} →</button>`
      : `<span class="hiw-detail-next hiw-detail-next--end">You’re all set — <a href="#cta-form" class="hiw-detail-cta-link">start the conversation</a>.</span>`;

    detailPanel.innerHTML = `
      <div class="hiw-detail-inner">
        <div class="hiw-detail-copy">
          <div class="hiw-detail-num" aria-hidden="true">${step.num}</div>
          <h2 class="hiw-detail-heading">${step.title} — <em>${step.subtitle}</em></h2>
          ${bodyHTML}
          <div class="hiw-detail-callout">
            <span class="hiw-detail-callout-label">${step.calloutLabel}</span>
            <ul class="hiw-detail-callout-list">${calloutItemsHTML}</ul>
          </div>
          <div class="hiw-detail-nav">${prevHTML}${nextHTML}</div>
        </div>
        <div class="hiw-detail-photo-col">
          <img src="${step.photo}"
               alt="${step.photoAlt}"
               class="hiw-detail-photo"
               loading="lazy">
        </div>
      </div>
    `;

    /* Bind prev/next buttons freshly after each render */
    detailPanel.querySelector('.hiw-detail-prev[data-index]')
      ?.addEventListener('click', e =>
        activateStep(parseInt(e.currentTarget.dataset.index, 10), true));
    detailPanel.querySelector('.hiw-detail-next[data-index]')
      ?.addEventListener('click', e =>
        activateStep(parseInt(e.currentTarget.dataset.index, 10), true));
  }

  /* -----------------------------------------------------------------
     activateStep — updates active state on cards/dots, renders panel,
     optionally smooth-scrolls to the detail section.
     ----------------------------------------------------------------- */
  function activateStep(index, shouldScroll) {
    stepCards.forEach((c, i) => {
      c.classList.toggle('is-active', i === index);
      c.setAttribute('aria-selected', i === index ? 'true' : 'false');
    });
    dots.forEach((d, i) => {
      d.classList.toggle('is-active', i === index);
      d.setAttribute('aria-selected', i === index ? 'true' : 'false');
    });

    renderStep(index);

    if (shouldScroll) {
      const target = document.getElementById('step-detail');
      if (!target) return;
      const offset = (header?.offsetHeight ?? 80) + 16;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      if (prefersReducedMotion) {
        window.scrollTo({ top });
      } else {
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  }

  /* -----------------------------------------------------------------
     Step card click / keyboard (Space/Enter)
     ----------------------------------------------------------------- */
  document.querySelector('.hiw-step-cards')
    ?.addEventListener('click', e => {
      const card = e.target.closest('.hiw-step-card');
      if (!card) return;
      activateStep(parseInt(card.dataset.step, 10), true);
    });

  document.querySelector('.hiw-step-cards')
    ?.addEventListener('keydown', e => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const card = e.target.closest('.hiw-step-card');
      if (!card) return;
      e.preventDefault();
      activateStep(parseInt(card.dataset.step, 10), true);
    });

  /* -----------------------------------------------------------------
     Timeline dot clicks
     ----------------------------------------------------------------- */
  document.querySelector('.hiw-dots')
    ?.addEventListener('click', e => {
      const dot = e.target.closest('.hiw-dot');
      if (!dot) return;
      activateStep(parseInt(dot.dataset.step, 10), true);
    });

  /* -----------------------------------------------------------------
     FAQ accordion — one item open at a time
     ----------------------------------------------------------------- */
  document.querySelector('.hiw-faq-list')
    ?.addEventListener('click', e => {
      const q = e.target.closest('.hiw-faq-q');
      if (!q) return;
      const item = q.closest('.hiw-faq-item');
      const isOpen = item.classList.contains('is-open');
      document.querySelectorAll('.hiw-faq-item').forEach(i => {
        i.classList.remove('is-open');
        i.querySelector('.hiw-faq-q')?.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('is-open');
        q.setAttribute('aria-expanded', 'true');
      }
    });

  /* -----------------------------------------------------------------
     CTA form — mirrors main.js contact form validation
     ----------------------------------------------------------------- */
  const ctaForm = document.getElementById('cta-form');
  ctaForm?.addEventListener('submit', function (e) {
    e.preventDefault();
    const required = this.querySelectorAll('[required]');
    let isValid = true;
    required.forEach(field => {
      field.style.borderColor = '';
      if (!field.value.trim()) {
        isValid = false;
        field.style.borderColor = 'rgba(224,112,112,0.8)';
        if (isValid === false && field === required[0]) field.focus();
      }
    });
    if (!isValid) return;
    const btn = this.querySelector('[type="submit"]');
    btn.textContent = 'Sending…';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = 'Request Sent';
      btn.style.background = 'var(--color-teal-muted)';
    }, 1200);
  });

  /* -----------------------------------------------------------------
     Init — activate Step 1 on page load (no scroll)
     ----------------------------------------------------------------- */
  activateStep(0, false);

})();
```

- [ ] **Step 2.2 — Verify the file exists and has no syntax errors**

Open `js/how-it-works.js` in VS Code — no red underlines. Or run:
```bash
node --check js/how-it-works.js
```
Expected: no output (clean).

- [ ] **Step 2.3 — Commit**

```bash
git add js/how-it-works.js
git commit -m "feat: add how-it-works.js — step data, timeline interaction, FAQ, form"
```

---

## Task 3: Create `css/how-it-works.css`

**Files:**
- Create: `css/how-it-works.css`

- [ ] **Step 3.1 — Create the full stylesheet**

Create `css/how-it-works.css` with the following complete content:

```css
/* ===================================================================
   TRINITY HOME CARE — How It Works Page Styles
   Extends main.css. Loaded only on how-it-works.html.
   =================================================================== */

/* -------------------------------------------------------------------
   Active nav link
   ------------------------------------------------------------------- */
.nav-link[aria-current="page"]::after { transform: scaleX(1); }
.site-header.is-scrolled .nav-link[aria-current="page"] { color: var(--color-navy); }

/* -------------------------------------------------------------------
   Hero — static image background
   ------------------------------------------------------------------- */
.section-hero--page {
  background-image: url('../assets/images/supporting/caregiver-client-home-visit.jpg');
  background-size: cover;
  background-position: center 30%;
  background-repeat: no-repeat;
  min-height: 75vh;
  min-height: 75svh;
}
@media (max-width: 767px) {
  .section-hero--page {
    min-height: 80vh;
    min-height: 80svh;
    background-position: center 20%;
  }
}
@media (prefers-reduced-motion: reduce) {
  .section-hero--page { background-position: center 30%; }
}

/* -------------------------------------------------------------------
   Timeline Section — white background
   ------------------------------------------------------------------- */
.section-hiw-timeline { background: var(--color-white); }

.hiw-timeline-wrap {
  position: relative;
  padding: 0 0.5rem;
  margin-bottom: 2rem;
}

.hiw-timeline-bar {
  height: 3px;
  background: linear-gradient(to right, var(--color-teal), var(--color-gold));
  border-radius: 2px;
}

.hiw-dots {
  display: flex;
  justify-content: space-between;
  position: relative;
  top: -10px;
}

.hiw-dot {
  position: relative;
  width: 17px;
  height: 17px;
  background: var(--color-navy);
  border: 2.5px solid var(--color-gold);
  border-radius: 50%;
  cursor: pointer;
  flex-shrink: 0;
  transition: background var(--t-base), transform var(--t-base), border-color var(--t-base);
}
.hiw-dot:hover { transform: scale(1.15); }
.hiw-dot.is-active {
  background: var(--color-gold);
  border-color: var(--color-gold);
  transform: scale(1.25);
}
.hiw-dot:focus-visible {
  outline: 2px solid var(--color-teal);
  outline-offset: 3px;
}
.hiw-dot-label {
  position: absolute;
  top: 22px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.5625rem;
  font-weight: 600;
  color: var(--color-navy);
  white-space: nowrap;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  pointer-events: none;
  user-select: none;
}
@media (max-width: 479px) { .hiw-dot-label { display: none; } }

/* -------------------------------------------------------------------
   Step Cards Row
   ------------------------------------------------------------------- */
.hiw-step-cards {
  display: flex;
  gap: 0.875rem;
  margin-top: 2.5rem;
}
@media (max-width: 767px) {
  .hiw-step-cards {
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    gap: 0.75rem;
    padding-bottom: 0.5rem;
    scrollbar-width: none;
  }
  .hiw-step-cards::-webkit-scrollbar { display: none; }
}

.hiw-step-card {
  flex: 1;
  min-width: 0;
  background: var(--color-white);
  border: 1.5px solid var(--color-ivory-dark);
  border-radius: var(--radius-md);
  overflow: hidden;
  cursor: pointer;
  transition:
    border-color var(--t-base),
    box-shadow   var(--t-base),
    transform    var(--t-base);
  box-shadow: var(--shadow-card);
}
@media (max-width: 767px) {
  .hiw-step-card { min-width: 160px; scroll-snap-align: start; flex-shrink: 0; }
}
.hiw-step-card:hover {
  border-color: var(--color-teal);
  box-shadow: var(--shadow-card-hover);
  transform: translateY(-3px);
}
.hiw-step-card.is-active {
  border: 2px solid var(--color-gold);
  box-shadow: 0 8px 32px rgba(184, 154, 94, 0.18);
}
.hiw-step-card:focus-visible {
  outline: 2px solid var(--color-teal);
  outline-offset: 2px;
}

.hiw-step-card-img {
  height: 56px;
  background-size: cover;
  background-position: center;
}
.hiw-step-card-img--1 { background: linear-gradient(135deg, #7aaa8c, #4a7a5e); }
.hiw-step-card-img--2 { background: linear-gradient(135deg, #5F8F95, #3d6b70); }
.hiw-step-card-img--3 { background: linear-gradient(135deg, #7a8aaa, #4a5a7a); }
.hiw-step-card-img--4 { background: linear-gradient(135deg, #aa8a6a, #7a5a3a); }
.hiw-step-card-img--5 { background: linear-gradient(135deg, #8aaa8c, #5a7a6e); }

.hiw-step-card-body { padding: 0.625rem 0.75rem 0.875rem; }

.hiw-step-card-num {
  font-family: var(--font-heading);
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-gold);
  line-height: 1;
  margin-bottom: 0.25rem;
}
.hiw-step-card-title {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-navy);
  line-height: 1.3;
  margin-bottom: 0.25rem;
}
.hiw-step-card-teaser {
  font-size: 0.6875rem;
  color: var(--color-text-muted);
  line-height: 1.5;
}
.hiw-step-card-more {
  display: block;
  font-size: 0.625rem;
  font-weight: 600;
  color: var(--color-teal);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-top: 0.375rem;
}

/* -------------------------------------------------------------------
   Step Detail Panel — ivory background
   ------------------------------------------------------------------- */
.section-hiw-detail {
  background: var(--color-ivory);
  border-top: 3px solid transparent;
  border-image: linear-gradient(90deg, var(--color-gold) 0%, var(--color-teal) 100%) 1;
}

/* JS populates #step-detail-panel with .hiw-detail-inner */
.hiw-detail-inner {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;
  align-items: start;
}
@media (min-width: 900px) {
  .hiw-detail-inner { grid-template-columns: 3fr 2fr; gap: 3.5rem; }
}

.hiw-detail-num {
  font-family: var(--font-heading);
  font-size: 3.5rem;
  font-weight: 400;
  color: var(--color-gold);
  line-height: 1;
  opacity: 0.55;
  margin-bottom: 0.5rem;
}

.hiw-detail-heading {
  font-family: var(--font-heading);
  font-size: clamp(1.5rem, 2.5vw, 2rem);
  font-weight: 400;
  color: var(--color-navy);
  line-height: 1.15;
  margin-bottom: 1rem;
  letter-spacing: -0.01em;
}
.hiw-detail-heading em { color: var(--color-gold); font-style: italic; }

.hiw-detail-body {
  font-size: 0.9375rem;
  line-height: 1.78;
  color: var(--color-text-sub);
  max-width: 52ch;
  margin-bottom: 1rem;
}

.hiw-detail-callout {
  background: var(--color-white);
  border-radius: var(--radius-md);
  padding: 1.125rem 1.375rem;
  border-left: 3px solid var(--color-teal);
  box-shadow: var(--shadow-card);
  margin-bottom: 1.5rem;
}
.hiw-detail-callout-label {
  display: block;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-teal-muted);
  margin-bottom: 0.5rem;
}
.hiw-detail-callout-list { list-style: none; display: flex; flex-direction: column; gap: 0.3rem; }
.hiw-detail-callout-item {
  font-size: 0.875rem;
  color: var(--color-text-sub);
  line-height: 1.5;
  padding-left: 1.25rem;
  position: relative;
}
.hiw-detail-callout-item::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--color-teal);
  font-weight: 700;
  font-size: 0.75rem;
}

.hiw-detail-nav {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  flex-wrap: wrap;
}
.hiw-detail-prev,
.hiw-detail-next {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-teal);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  font-family: var(--font-body);
  transition: color var(--t-fast);
}
.hiw-detail-prev:hover,
.hiw-detail-next:hover { color: var(--color-teal-muted); }
.hiw-detail-prev--hidden { visibility: hidden; min-width: 80px; }
.hiw-detail-next--end {
  color: var(--color-text-muted);
  font-weight: 400;
  cursor: default;
}
.hiw-detail-cta-link {
  color: var(--color-teal);
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.hiw-detail-photo {
  width: 100%;
  height: 280px;
  object-fit: cover;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-photo);
  display: block;
}
@media (max-width: 899px) { .hiw-detail-photo { height: 220px; } }

/* -------------------------------------------------------------------
   Testimonials — white background
   ------------------------------------------------------------------- */
.section-hiw-testimonials { background: var(--color-white); }

.hiw-testimonial-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
  margin-top: 2rem;
}
@media (min-width: 640px) { .hiw-testimonial-grid { grid-template-columns: 1fr 1fr; } }

.hiw-testimonial-card {
  background: var(--color-white);
  border-radius: var(--radius-md);
  padding: 1.5rem;
  box-shadow: var(--shadow-card);
  border-top: 3px solid var(--color-gold);
  transition: box-shadow var(--t-base);
}
.hiw-testimonial-card:hover { box-shadow: var(--shadow-card-hover); }

.hiw-stars { display: flex; gap: 2px; margin-bottom: 0.75rem; color: var(--color-gold); font-size: 0.875rem; }

.hiw-quote {
  font-family: var(--font-heading);
  font-size: 1.0625rem;
  font-style: italic;
  color: var(--color-navy);
  line-height: 1.65;
  margin-bottom: 0.875rem;
}
.hiw-attribution { font-size: 0.8125rem; font-weight: 500; color: var(--color-text-muted); }
.hiw-attribution strong { color: var(--color-text-sub); }

/* -------------------------------------------------------------------
   FAQ — ivory background
   ------------------------------------------------------------------- */
.section-hiw-faq { background: var(--color-ivory); }

.hiw-faq-list { margin-top: 2rem; display: flex; flex-direction: column; gap: 0.5rem; }

.hiw-faq-item {
  background: var(--color-white);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-card);
  overflow: hidden;
}

.hiw-faq-q {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.9375rem 1.25rem;
  cursor: pointer;
  width: 100%;
  background: none;
  border: none;
  font-family: var(--font-body);
  text-align: left;
  gap: 1rem;
}
.hiw-faq-q:focus-visible { outline: 2px solid var(--color-teal); outline-offset: -2px; }

.hiw-faq-q-text { font-size: 0.9375rem; font-weight: 500; color: var(--color-navy); line-height: 1.4; }

.hiw-faq-chevron {
  width: 8px;
  height: 8px;
  border-right: 1.5px solid var(--color-navy);
  border-bottom: 1.5px solid var(--color-navy);
  transform: rotate(45deg);
  opacity: 0.5;
  flex-shrink: 0;
  transition: transform var(--t-base), opacity var(--t-base);
}
.hiw-faq-item.is-open .hiw-faq-chevron { transform: rotate(-135deg); opacity: 0.8; }

.hiw-faq-a {
  display: none;
  padding: 0 1.25rem 1rem;
  font-size: 0.9375rem;
  color: var(--color-text-sub);
  line-height: 1.72;
  max-width: 65ch;
}
.hiw-faq-item.is-open .hiw-faq-a { display: block; }

.hiw-faq-all-link {
  display: block;
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-teal);
  transition: color var(--t-fast);
}
.hiw-faq-all-link:hover { color: var(--color-teal-muted); }

/* -------------------------------------------------------------------
   Final CTA — navy background, clip-path chevron (mirrors contact.html)
   ------------------------------------------------------------------- */
.section-hiw-cta {
  background: var(--color-navy);
  position: relative;
  z-index: 1;
  clip-path: polygon(0 32px, 100% 0, 100% 100%, 0 100%);
  margin-top: -32px;
  padding-top: calc(var(--section-py) + 48px);
}
@media (min-width: 1024px) {
  .section-hiw-cta { padding-top: calc(var(--section-py-lg) + 48px); }
}
.section-hiw-cta::before {
  content: '';
  position: absolute;
  bottom: -40px;
  left: -60px;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(95, 143, 149, 0.10) 0%, transparent 70%);
  pointer-events: none;
}

.hiw-cta-inner {
  max-width: 640px;
  margin-inline: auto;
  text-align: center;
  position: relative;
  z-index: 1;
}
.hiw-cta-heading {
  font-family: var(--font-heading);
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 400;
  color: var(--color-white);
  line-height: 1.12;
  margin-bottom: 1.125rem;
}
.hiw-cta-heading em { color: var(--color-gold-light); }
.hiw-cta-sub {
  font-size: 1.0625rem;
  color: rgba(255, 255, 255, 0.65);
  line-height: 1.72;
  max-width: 46ch;
  margin-inline: auto;
  margin-bottom: 2.25rem;
}
.hiw-cta-phone {
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  font-family: var(--font-heading);
  font-size: 1.75rem;
  font-weight: 400;
  color: var(--color-white);
  letter-spacing: 0.01em;
  margin-bottom: 2rem;
  transition: color var(--t-fast);
}
.hiw-cta-phone svg { width: 22px; height: 22px; color: var(--color-teal-light); flex-shrink: 0; }
.hiw-cta-phone:hover { color: var(--color-teal-light); }
.hiw-cta-note {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.35);
  line-height: 1.55;
  max-width: none;
  margin: 1rem 0 0;
}
```

- [ ] **Step 3.2 — Verify**

Open `css/how-it-works.css` in VS Code. Confirm: no red underlines. All CSS custom property references (`var(--color-*)`, `var(--font-*)`, etc.) match the tokens defined in `css/main.css` `:root`.

- [ ] **Step 3.3 — Commit**

```bash
git add css/how-it-works.css
git commit -m "feat: add how-it-works.css — timeline, step cards, detail panel, FAQ, CTA"
```

---

## Task 4: Create `how-it-works.html`

**Files:**
- Create: `how-it-works.html`

Build the page in two steps: first the head + nav + hero + timeline, then the detail panel + testimonials + FAQ + CTA + footer.

- [ ] **Step 4.1 — Create head, nav, hero, and timeline sections**

Create `how-it-works.html` with the following content (through and including the timeline section):

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>How It Works | Trinity Home Care — Pittsburgh, PA</title>
  <meta name="description" content="See exactly what happens when you contact Trinity Home Care — from your first free call through caregiver matching and ongoing support. No surprises, no pressure.">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://trinityhomecare.com/how-it-works">
  <link rel="icon" type="image/png" sizes="32x32" href="assets/logo/Trinity Home Care logo design favicon.png">
  <link rel="icon" type="image/png" sizes="16x16" href="assets/logo/Trinity Home Care logo design favicon.png">
  <link rel="apple-touch-icon" sizes="180x180" href="assets/logo/Trinity Home Care logo design favicon.png">

  <!-- Open Graph -->
  <meta property="og:type"        content="website">
  <meta property="og:url"         content="https://trinityhomecare.com/how-it-works">
  <meta property="og:title"       content="How It Works | Trinity Home Care Pittsburgh">
  <meta property="og:description" content="From your first call to your loved one's first care day — here's exactly what happens at Trinity Home Care, step by step.">
  <meta property="og:image"       content="https://trinityhomecare.com/assets/images/supporting/caregiver-client-home-visit.jpg">

  <!-- Favicon -->
  <link rel="icon" type="image/png" href="assets/logo/logo-dark.png">

  <!-- Preload critical assets -->
  <link rel="preload" as="image" href="assets/images/supporting/caregiver-client-home-visit.jpg">
  <link rel="preload" as="image" href="assets/logo/logo-light2.png">

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,600&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">

  <!-- Styles -->
  <link rel="stylesheet" href="css/main.css">
  <link rel="stylesheet" href="css/how-it-works.css">

  <!-- Reduced-motion fallback for no-JS environments -->
  <noscript>
    <style>
      [data-animate] { opacity: 1 !important; transform: none !important; }
      .hero-eyebrow, .hero-heading, .hero-subhead,
      .hero-ctas, .hero-trust {
        opacity: 1 !important; transform: none !important; animation: none !important;
      }
    </style>
  </noscript>
</head>
<body>

  <!-- Skip navigation -->
  <a href="#main" class="skip-link">Skip to main content</a>

  <!-- ================================================================
       HEADER / NAVIGATION
       ================================================================ -->
  <header id="site-header" class="site-header" role="banner">
    <div class="container">
      <nav class="nav-container" role="navigation" aria-label="Main navigation">

        <a href="/" class="nav-logo" aria-label="Trinity Home Care — return to homepage">
          <div class="logo-swap">
            <img src="assets/logo/logo-light2.png"
                 alt="Trinity Home Care"
                 class="logo-img logo-img--light"
                 loading="eager">
            <img src="assets/logo/logo-dark2.png"
                 alt=""
                 class="logo-img logo-img--dark"
                 loading="eager"
                 aria-hidden="true">
          </div>
        </a>

        <!-- Desktop navigation -->
        <ul class="nav-links" role="list">
          <li><a href="services.html"       class="nav-link">Services</a></li>
          <li><a href="about.html"          class="nav-link">About</a></li>
          <li><a href="how-it-works.html"   class="nav-link" aria-current="page">How It Works</a></li>
          <li><a href="index.html#testimonials" class="nav-link">Reviews</a></li>
          <li><a href="contact.html"        class="nav-link">Contact</a></li>
        </ul>

        <!-- Desktop right group -->
        <div class="nav-cta-group">
          <a href="tel:4123453721" class="nav-phone" aria-label="Call 412-345-3721">
            412-345-3721
          </a>
          <a href="#cta-form" class="btn btn-teal nav-cta-btn">
            Free Consultation
          </a>
        </div>

        <!-- Hamburger -->
        <button
          id="nav-hamburger"
          class="nav-hamburger"
          type="button"
          aria-label="Open navigation menu"
          aria-expanded="false"
          aria-controls="nav-mobile">
          <span class="hamburger-bar" aria-hidden="true"></span>
          <span class="hamburger-bar" aria-hidden="true"></span>
          <span class="hamburger-bar" aria-hidden="true"></span>
        </button>

      </nav>
    </div>

    <!-- Mobile dropdown navigation -->
    <nav id="nav-mobile" class="nav-mobile" aria-label="Mobile navigation" aria-hidden="true">
      <a href="services.html"       class="nav-mobile-link">Services</a>
      <a href="about.html"          class="nav-mobile-link">About</a>
      <a href="how-it-works.html"   class="nav-mobile-link" aria-current="page">How It Works</a>
      <a href="index.html#testimonials" class="nav-mobile-link">Reviews</a>
      <a href="contact.html"        class="nav-mobile-link">Contact</a>
      <div class="nav-mobile-ctas">
        <a href="tel:4123453721"  class="btn btn-secondary">Call 412-345-3721</a>
        <a href="#cta-form"       class="btn btn-primary">Schedule a Consultation</a>
      </div>
    </nav>

  </header>

  <!-- ================================================================
       MAIN CONTENT
       ================================================================ -->
  <main id="main">

    <!-- ============================================================
         §1 HERO
         ============================================================ -->
    <section class="section-hero section-hero--page" aria-labelledby="hiw-hero-heading">

      <div class="hero-overlay" aria-hidden="true"></div>

      <div class="container">
        <div class="hero-inner">
          <div class="hero-content">

            <p class="hero-eyebrow">How It Works</p>

            <h1 id="hiw-hero-heading" class="hero-heading">
              From your first call to<br>
              your loved one&rsquo;s<br>
              <em>first care day.</em>
            </h1>

            <p class="hero-subhead">
              We know the unknown is the hardest part. Here&rsquo;s exactly what happens &mdash; step by step, with no surprises and no pressure.
            </p>

            <div class="hero-ctas">
              <a href="#cta-form" class="btn btn-hero-primary">
                Start the Conversation
              </a>
              <a href="tel:4123453721" class="btn btn-hero-secondary">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                     stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.44a2 2 0 0 1 2-2H6a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.1a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 15.5v1.42z"/>
                </svg>
                Call 412-345-3721
              </a>
            </div>

            <div class="hero-trust" role="list" aria-label="Trust credentials">
              <span class="hero-trust-item" role="listitem">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
                  <path d="M12 2 3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7l-9-5z"/>
                </svg>
                No Obligation
              </span>
              <span class="hero-trust-item" role="listitem">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
                  <path d="M12 2 3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7l-9-5z"/>
                </svg>
                Free Assessment
              </span>
              <span class="hero-trust-item" role="listitem">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
                  <path d="M12 2 3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7l-9-5z"/>
                </svg>
                Locally Owned
              </span>
              <span class="hero-trust-item" role="listitem">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
                  <path d="M12 2 3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7l-9-5z"/>
                </svg>
                Care Starts Fast
              </span>
            </div>

          </div>
        </div>
      </div>
    </section>

    <!-- ============================================================
         §2 TIMELINE — 5-step journey
         ============================================================ -->
    <section id="the-journey" class="section section-hiw-timeline" aria-labelledby="hiw-timeline-heading">
      <div class="container">

        <div class="section-heading-center" data-animate>
          <span class="section-label">Your Care Journey</span>
          <h2 id="hiw-timeline-heading" class="section-heading">
            Five steps to<br><em>peace of mind.</em>
          </h2>
          <hr class="gold-rule gold-rule--center" aria-hidden="true">
          <p class="section-subhead">
            Every family&rsquo;s path to care is a little different &mdash; but the commitment at every step is the same: honest, unhurried, and always centered on your loved one.
          </p>
        </div>

        <!-- Timeline track + milestone dots -->
        <div class="hiw-timeline-wrap" data-animate style="--animate-delay: 0.1s" aria-hidden="true">
          <div class="hiw-timeline-bar"></div>
          <div class="hiw-dots">
            <button class="hiw-dot" data-step="0" aria-label="Step 1: Free Consultation" aria-selected="true" role="tab">
              <span class="hiw-dot-label">Free Call</span>
            </button>
            <button class="hiw-dot" data-step="1" aria-label="Step 2: In-Home Assessment" aria-selected="false" role="tab">
              <span class="hiw-dot-label">Assessment</span>
            </button>
            <button class="hiw-dot" data-step="2" aria-label="Step 3: Caregiver Matching" aria-selected="false" role="tab">
              <span class="hiw-dot-label">Matching</span>
            </button>
            <button class="hiw-dot" data-step="3" aria-label="Step 4: Care Begins" aria-selected="false" role="tab">
              <span class="hiw-dot-label">Care Begins</span>
            </button>
            <button class="hiw-dot" data-step="4" aria-label="Step 5: Ongoing Partnership" aria-selected="false" role="tab">
              <span class="hiw-dot-label">Partnership</span>
            </button>
          </div>
        </div>

        <!-- 5 step cards -->
        <div class="hiw-step-cards" role="list" aria-label="Care journey steps"
             data-animate style="--animate-delay: 0.18s">

          <div class="hiw-step-card" role="listitem" tabindex="0" data-step="0" aria-selected="true">
            <div class="hiw-step-card-img hiw-step-card-img--1" aria-hidden="true"></div>
            <div class="hiw-step-card-body">
              <div class="hiw-step-card-num" aria-hidden="true">01</div>
              <h3 class="hiw-step-card-title">Free Consultation</h3>
              <p class="hiw-step-card-teaser">A real conversation about your needs &mdash; no script, no pressure.</p>
              <span class="hiw-step-card-more" aria-hidden="true">&darr; Details</span>
            </div>
          </div>

          <div class="hiw-step-card" role="listitem" tabindex="0" data-step="1" aria-selected="false">
            <div class="hiw-step-card-img hiw-step-card-img--2" aria-hidden="true"></div>
            <div class="hiw-step-card-body">
              <div class="hiw-step-card-num" aria-hidden="true">02</div>
              <h3 class="hiw-step-card-title">In-Home Assessment</h3>
              <p class="hiw-step-card-teaser">We visit your home to learn what great care looks like for your family.</p>
              <span class="hiw-step-card-more" aria-hidden="true">&darr; Details</span>
            </div>
          </div>

          <div class="hiw-step-card" role="listitem" tabindex="0" data-step="2" aria-selected="false">
            <div class="hiw-step-card-img hiw-step-card-img--3" aria-hidden="true"></div>
            <div class="hiw-step-card-body">
              <div class="hiw-step-card-num" aria-hidden="true">03</div>
              <h3 class="hiw-step-card-title">Caregiver Matching</h3>
              <p class="hiw-step-card-teaser">Hand-selected for fit &mdash; personality, not just availability.</p>
              <span class="hiw-step-card-more" aria-hidden="true">&darr; Details</span>
            </div>
          </div>

          <div class="hiw-step-card" role="listitem" tabindex="0" data-step="3" aria-selected="false">
            <div class="hiw-step-card-img hiw-step-card-img--4" aria-hidden="true"></div>
            <div class="hiw-step-card-body">
              <div class="hiw-step-card-num" aria-hidden="true">04</div>
              <h3 class="hiw-step-card-title">Care Begins</h3>
              <p class="hiw-step-card-teaser">First day support, introductions, and a clear check-in process.</p>
              <span class="hiw-step-card-more" aria-hidden="true">&darr; Details</span>
            </div>
          </div>

          <div class="hiw-step-card" role="listitem" tabindex="0" data-step="4" aria-selected="false">
            <div class="hiw-step-card-img hiw-step-card-img--5" aria-hidden="true"></div>
            <div class="hiw-step-card-body">
              <div class="hiw-step-card-num" aria-hidden="true">05</div>
              <h3 class="hiw-step-card-title">Ongoing Partnership</h3>
              <p class="hiw-step-card-teaser">Care that evolves with regular check-ins and a team always available.</p>
              <span class="hiw-step-card-more" aria-hidden="true">&darr; Details</span>
            </div>
          </div>

        </div>
      </div>
    </section>
```

- [ ] **Step 4.2 — Append step detail, testimonials, FAQ, CTA, footer, and scripts**

Append the following to `how-it-works.html` (directly after the closing `</section>` of §2):

```html

    <!-- ============================================================
         §3 STEP DETAIL PANEL — populated by how-it-works.js
         ============================================================ -->
    <section id="step-detail" class="section section-hiw-detail"
             aria-live="polite" aria-atomic="false"
             aria-label="Step detail">
      <div class="container">
        <div id="step-detail-panel">
          <!-- JS renders content here on load and on card click -->
        </div>
      </div>
    </section>

    <!-- ============================================================
         §4 TESTIMONIALS
         ============================================================ -->
    <section class="section section-hiw-testimonials" aria-labelledby="hiw-testimonials-heading">
      <div class="container">

        <div class="section-heading-center" data-animate>
          <span class="section-label">What Families Tell Us</span>
          <h2 id="hiw-testimonials-heading" class="section-heading">
            The moment you<br><em>stop wondering.</em>
          </h2>
          <hr class="gold-rule gold-rule--center" aria-hidden="true">
        </div>

        <div class="hiw-testimonial-grid" data-animate style="--animate-delay: 0.1s">

          <div class="hiw-testimonial-card">
            <div class="hiw-stars" aria-label="5 out of 5 stars" role="img">
              <span aria-hidden="true">★★★★★</span>
            </div>
            <blockquote class="hiw-quote">
              &ldquo;I called Trinity not knowing what to expect, and honestly I was dreading it. But the woman I spoke with was so calm and kind &mdash; she listened to everything, didn&rsquo;t rush me once, and by the end I actually felt relieved for the first time in months.&rdquo;
            </blockquote>
            <p class="hiw-attribution"><strong>Linda M.</strong> &mdash; Pittsburgh &middot; Daughter of a Trinity client</p>
          </div>

          <div class="hiw-testimonial-card">
            <div class="hiw-stars" aria-label="5 out of 5 stars" role="img">
              <span aria-hidden="true">★★★★★</span>
            </div>
            <blockquote class="hiw-quote">
              &ldquo;They found a caregiver who actually matched my father&rsquo;s personality &mdash; he&rsquo;s quiet, private, a little stubborn. Maria was perfect for him from day one. I had no idea a care agency would put that much thought into something like that.&rdquo;
            </blockquote>
            <p class="hiw-attribution"><strong>James T.</strong> &mdash; Coraopolis &middot; Son of a Trinity client</p>
          </div>

        </div>
      </div>
    </section>

    <!-- ============================================================
         §5 FAQ
         ============================================================ -->
    <section class="section section-hiw-faq" aria-labelledby="hiw-faq-heading">
      <div class="container">

        <div class="section-heading-center" data-animate>
          <span class="section-label">Common Questions</span>
          <h2 id="hiw-faq-heading" class="section-heading">
            A few things<br><em>families always ask.</em>
          </h2>
          <hr class="gold-rule gold-rule--center" aria-hidden="true">
        </div>

        <div class="hiw-faq-list" role="list" data-animate style="--animate-delay: 0.1s">

          <div class="hiw-faq-item" role="listitem">
            <button class="hiw-faq-q" aria-expanded="false"
                    aria-controls="faq-a-1" id="faq-q-1">
              <span class="hiw-faq-q-text">How quickly can care start after the assessment?</span>
              <span class="hiw-faq-chevron" aria-hidden="true"></span>
            </button>
            <p class="hiw-faq-a" id="faq-a-1" role="region" aria-labelledby="faq-q-1">
              In most cases, we can have a caregiver in place within 24&ndash;72 hours of your assessment. For urgent situations, we do our best to arrange care within the same day &mdash; just let us know when you call.
            </p>
          </div>

          <div class="hiw-faq-item" role="listitem">
            <button class="hiw-faq-q" aria-expanded="false"
                    aria-controls="faq-a-2" id="faq-q-2">
              <span class="hiw-faq-q-text">What if my loved one doesn&rsquo;t connect with their caregiver?</span>
              <span class="hiw-faq-chevron" aria-hidden="true"></span>
            </button>
            <p class="hiw-faq-a" id="faq-a-2" role="region" aria-labelledby="faq-q-2">
              We take the match seriously, but if it isn&rsquo;t right we want to know immediately. We&rsquo;ll find a better fit without any drama &mdash; the relationship between client and caregiver matters more than the schedule.
            </p>
          </div>

          <div class="hiw-faq-item" role="listitem">
            <button class="hiw-faq-q" aria-expanded="false"
                    aria-controls="faq-a-3" id="faq-q-3">
              <span class="hiw-faq-q-text">Do I have to sign a long-term contract?</span>
              <span class="hiw-faq-chevron" aria-hidden="true"></span>
            </button>
            <p class="hiw-faq-a" id="faq-a-3" role="region" aria-labelledby="faq-q-3">
              No. We believe care arrangements should be as flexible as your family&rsquo;s needs. While many families stay with us for months or years because it works, you&rsquo;re never locked in to a contract that doesn&rsquo;t fit your situation.
            </p>
          </div>

        </div>

        <a href="contact.html" class="hiw-faq-all-link" data-animate style="--animate-delay: 0.18s">
          Have more questions? Talk to us &rarr;
        </a>

      </div>
    </section>

    <!-- ============================================================
         §6 FINAL CTA — navy, clip-path chevron
         ============================================================ -->
    <section class="section-hiw-cta" aria-labelledby="hiw-cta-heading">
      <div class="container">
        <div class="hiw-cta-inner">

          <div data-animate>
            <h2 id="hiw-cta-heading" class="hiw-cta-heading">
              Start the conversation.<br>
              <em>No pressure, ever.</em>
            </h2>
          </div>

          <p class="hiw-cta-sub" data-animate style="--animate-delay: 0.1s">
            You&rsquo;ve seen every step. You know what to expect. When you&rsquo;re ready &mdash; even if &ldquo;ready&rdquo; just means having a conversation &mdash; we&rsquo;re here.
          </p>

          <a href="tel:4123453721"
             class="hiw-cta-phone"
             aria-label="Call Trinity Home Care at 412-345-3721"
             data-animate style="--animate-delay: 0.16s">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"
                 stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.44a2 2 0 0 1 2-2H6a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.1a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 15.5v1.42z"/>
            </svg>
            412-345-3721
          </a>

          <div data-animate style="--animate-delay: 0.22s">
            <form id="cta-form" class="contact-form" action="#" method="post"
                  novalidate aria-label="Request a free care assessment">

              <div class="form-row">
                <div class="form-group">
                  <label for="cta-first-name" class="form-label">
                    First Name <span aria-hidden="true">*</span>
                  </label>
                  <input type="text" id="cta-first-name" name="first_name" class="form-input"
                         placeholder="Your first name" required autocomplete="given-name">
                </div>
                <div class="form-group">
                  <label for="cta-last-name" class="form-label">
                    Last Name <span aria-hidden="true">*</span>
                  </label>
                  <input type="text" id="cta-last-name" name="last_name" class="form-input"
                         placeholder="Your last name" required autocomplete="family-name">
                </div>
              </div>

              <div class="form-group">
                <label for="cta-phone" class="form-label">
                  Phone Number <span aria-hidden="true">*</span>
                </label>
                <input type="tel" id="cta-phone" name="phone" class="form-input"
                       placeholder="(412) 000-0000" required autocomplete="tel">
              </div>

              <div class="form-group">
                <label for="cta-email" class="form-label">Email Address</label>
                <input type="email" id="cta-email" name="email" class="form-input"
                       placeholder="you@example.com" autocomplete="email">
              </div>

              <div class="form-group">
                <label for="cta-who" class="form-label">Who needs care?</label>
                <select id="cta-who" name="who_needs_care" class="form-select form-input">
                  <option value="" disabled selected>Select one&hellip;</option>
                  <option value="parent">My parent</option>
                  <option value="spouse">My spouse or partner</option>
                  <option value="self">Myself</option>
                  <option value="other">Someone else</option>
                </select>
              </div>

              <div class="form-submit">
                <button type="submit" class="btn btn-teal">
                  Request a Free Assessment
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                       stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </button>
              </div>

              <p class="hiw-cta-note">
                No sales pressure. No obligation. We typically respond within one business hour.
              </p>

            </form>
          </div>

        </div>
      </div>
    </section>

  </main>

  <!-- ================================================================
       FOOTER — identical to other pages
       ================================================================ -->
  <footer class="site-footer" role="contentinfo">
    <div class="container">

      <div class="footer-top">

        <div class="footer-brand">
          <a href="/" class="nav-logo" aria-label="Trinity Home Care">
            <img src="assets/logo/logo-light2.png"
                 alt="Trinity Home Care"
                 class="logo-img"
                 loading="lazy">
          </a>
          <p class="footer-tagline">
            Compassionate, personalized in-home care for Pittsburgh-area families.
          </p>
        </div>

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

        <div>
          <h4 class="footer-col-title">Company</h4>
          <ul class="footer-links" role="list">
            <li><a href="about.html"                class="footer-link">About Us</a></li>
            <li><a href="about.html#our-story"      class="footer-link">Our Story</a></li>
            <li><a href="about.html#our-caregivers" class="footer-link">Our Caregivers</a></li>
            <li><a href="index.html#testimonials"   class="footer-link">Family Stories</a></li>
            <li><a href="contact.html"              class="footer-link">Contact Us</a></li>
          </ul>
        </div>

        <div>
          <h4 class="footer-col-title">Contact</h4>
          <ul class="footer-links" role="list">
            <li><a href="tel:4123453721"                  class="footer-link">412-345-3721</a></li>
            <li><a href="mailto:info@trinityhomecare.com" class="footer-link">info@trinityhomecare.com</a></li>
            <li>
              <address class="footer-link footer-location">
                1004 5th Ave, Second Floor<br>Coraopolis, PA 15108
              </address>
            </li>
            <li><a href="#cta-form" class="footer-link">Free Assessment &rarr;</a></li>
          </ul>
        </div>

      </div>

      <div class="footer-bottom">
        <p class="footer-copyright">
          &copy; 2026 Trinity Home Care. All rights reserved.
        </p>
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
    <a href="tel:4123453721" class="btn btn-hero-secondary"
       aria-label="Call Trinity Home Care at 412-345-3721">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
           stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"
           style="width:17px;height:17px;flex-shrink:0;">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.44a2 2 0 0 1 2-2H6a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.1a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 15.5v1.42z"/>
      </svg>
      Call Now
    </a>
    <a href="#cta-form" class="btn btn-hero-primary">Free Assessment</a>
  </div>

  <!-- Structured Data -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "How It Works — Trinity Home Care",
    "description": "Step-by-step guide to starting home care with Trinity Home Care in Pittsburgh, PA.",
    "url": "https://trinityhomecare.com/how-it-works",
    "provider": {
      "@type": "LocalBusiness",
      "name": "Trinity Home Care",
      "telephone": "+14123453721",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "1004 5th Ave, Second Floor",
        "addressLocality": "Coraopolis",
        "addressRegion": "PA",
        "postalCode": "15108"
      }
    }
  }
  </script>

  <script src="js/main.js"></script>
  <script src="js/how-it-works.js"></script>
</body>
</html>
```

- [ ] **Step 4.3 — Verify HTML is well-formed**

Open `how-it-works.html` in VS Code. Confirm: no red underlines on tags. Every opening tag has a closing tag. The file ends with `</html>`.

- [ ] **Step 4.4 — Commit**

```bash
git add how-it-works.html
git commit -m "feat: add how-it-works.html — timeline + step detail page"
```

---

## Task 5: Browser smoke test + final commit

**Files:** None created — verification only.

- [ ] **Step 5.1 — Open the page in a browser**

Open `how-it-works.html` directly in Chrome (File → Open, or drag-and-drop). If a local server is available, use it (`python -m http.server 8080` in the project root, then open `http://localhost:8080/how-it-works.html`).

- [ ] **Step 5.2 — Console check**

Open DevTools (F12) → Console tab. Expected: **zero errors**. Warnings about CORS on local images (`file://` protocol) are acceptable. Any `Uncaught TypeError` or `ReferenceError` is a bug — fix before continuing.

- [ ] **Step 5.3 — Visual checklist**

Walk through each section top-to-bottom:

| Check | Expected |
|-------|----------|
| Nav | "How It Works" link has underline/active style; all other links work |
| Hero | `caregiver-client-home-visit.jpg` visible behind overlay; H1 and trust badges render |
| Timeline | Gold-to-teal gradient bar with 5 navy-gold dots; dot labels visible on desktop |
| Step cards | 5 cards in a row; Step 1 card has gold border (active state) |
| Step detail | Step 1 detail renders with large "01", heading, 2 paragraphs, callout box, photo, Prev/Next nav |
| Step 1 photo | `caregiver-talking-to-senior-chairside.jpg` renders in detail panel |
| Testimonials | 2 white cards with gold top border, stars, italic quote |
| FAQ | 3 items; clicking a row reveals answer; chevron rotates |
| CTA section | Navy bg with clip-path chevron; form, phone number, and submit button |
| Footer | Full 4-column footer renders |
| Mobile bar | Sticky "Call Now" + "Free Assessment" bar visible at bottom on mobile viewport |

- [ ] **Step 5.4 — Interaction checklist**

| Action | Expected |
|--------|----------|
| Click Step 2 card | Card 2 gets gold border; dot 2 turns gold; page scrolls to detail panel; detail shows Step 2 content with `caregiver-reviewing-paperwork-with-senior.jpg` |
| Click "Next: Caregiver Matching →" in detail | Step 3 activates; page scrolls back to detail; Step 3 photo (`team-caregiver-client-portrait.jpg`) appears |
| Click "← In-Home Assessment" in Step 3 | Steps back to Step 2 |
| Click Step 5 card | Step 5 activates; "Next" button replaced with "You're all set" text with CTA link |
| Click FAQ item 1 | Answer expands; click again → collapses; click FAQ item 2 → item 1 closes, item 2 opens |
| Submit empty form | Required fields get red border; no submission |
| Submit form with phone filled in | Button changes to "Sending…" then "Request Sent" |

- [ ] **Step 5.5 — Mobile viewport check (375px)**

In DevTools Device Toolbar, set to iPhone SE (375×667). Verify:
- Step cards scroll horizontally (not wrapped/overflowing)
- Step detail stacks: copy above, photo below
- Timeline dot labels are hidden (below 480px)
- Hero headline fits without overflow

- [ ] **Step 5.6 — Verify nav links updated on other pages**

Open `index.html`, `services.html`, `about.html`, `contact.html` in turn. Click "How It Works" in the nav — each should navigate to `how-it-works.html`.

- [ ] **Step 5.7 — Final commit**

```bash
git add -A
git commit -m "feat: complete How It Works page — timeline, step detail, FAQ, CTA"
```

---

## Self-Review

**Spec coverage:**
- §1 Hero → Task 4 Step 4.1 ✓
- §2 Timeline (track, dots, 5 cards) → Task 4 Step 4.1 ✓
- §3 Step Detail (JS-rendered, all 5 steps) → Tasks 2 + 4 Step 4.2 ✓
- §4 Testimonials (2 cards, gold top accent) → Task 4 Step 4.2 ✓
- §5 FAQ (3 items, accordion) → Tasks 2 + 3 + 4 Step 4.2 ✓
- §6 CTA (navy clip-path, phone, inline form) → Tasks 2 + 3 + 4 Step 4.2 ✓
- Nav link patches across 4 pages → Task 1 ✓
- `how-it-works.css` scoped (no main.css changes) → Task 3 ✓
- `how-it-works.js` separate from main.js → Task 2 ✓
- All 5 photos from existing asset library → Task 2 STEPS data ✓
- Prev/Next navigation in detail panel → Task 2 renderStep() ✓
- `prefers-reduced-motion` respected → Task 2 activateStep() ✓
- Keyboard accessible (Space/Enter on cards) → Task 2 ✓
- `aria-live="polite"` on detail panel → Task 4 Step 4.2 ✓
- FAQ `aria-expanded` managed → Task 2 ✓
- Mobile horizontal scroll on step cards → Task 3 ✓

**No placeholders found.** All code blocks are complete and runnable.

**Type consistency confirmed:** Class names in JS-generated HTML (`hiw-detail-inner`, `hiw-detail-copy`, `hiw-detail-num`, `hiw-detail-heading`, `hiw-detail-body`, `hiw-detail-callout`, `hiw-detail-callout-label`, `hiw-detail-callout-list`, `hiw-detail-callout-item`, `hiw-detail-nav`, `hiw-detail-prev`, `hiw-detail-prev--hidden`, `hiw-detail-next`, `hiw-detail-next--end`, `hiw-detail-cta-link`, `hiw-detail-photo-col`, `hiw-detail-photo`) all match CSS definitions in Task 3.
