# Individual Service Pages — Design Spec
**Trinity Home Care · services/*.html**
Date: 2026-04-29
Approach: A — Pure static HTML, 10 full files

---

## Goal

Create individual SEO-optimized landing pages for each of Trinity's 10 services. Each page targets local search intent ("personal care Pittsburgh", "dementia care near me"), delivers rich content that builds trust, and ends with a low-pressure CTA form. Pages are accessible via a grouped dropdown in the main nav and footer links.

Primary audience: adult child (age 45–65) researching care for a parent, late evening, likely on mobile.

---

## Architecture

- 10 complete standalone HTML files at `/services/*.html`
- All content in HTML — no JS rendering (maximum SEO value)
- Shared `css/services-page.css` loaded only on service pages
- Shared `js/services-page.js` for FAQ accordion + form validation
- Nav dropdown added to `main.css` + `main.js` and applied to all pages
- `services.html` hub page updated to link each card to its individual page

---

## File Structure

### New files (12)
```
services/
  personal-care.html
  companion-care.html
  medication-reminders.html
  meal-preparation.html
  light-housekeeping.html
  mobility-safety-support.html
  dementia-alzheimers-care.html
  respite-care.html
  post-hospital-recovery.html
  veteran-care.html

css/services-page.css
js/services-page.js
```

### Modified files (7)
```
main.css          — nav dropdown styles
main.js           — nav dropdown JS behavior
index.html        — dropdown HTML in desktop nav + mobile nav
services.html     — dropdown HTML + service card links updated
about.html        — dropdown HTML
contact.html      — dropdown HTML
how-it-works.html — dropdown HTML
```

---

## Nav Dropdown Spec

### Current nav structure (all pages)
Services link currently reads: `<a href="services.html" class="nav-link">Services</a>`

### Desktop nav HTML replacement
Replace the Services `<li>` in the desktop nav on ALL pages with:

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

**Note:** From inside `/services/*.html` pages, paths prepend `../` — e.g. `href="../services.html"`, `href="../services/personal-care.html"`.

### Mobile nav HTML replacement
Replace the Services `<li>` in the mobile nav on ALL pages with:

```html
<li class="mobile-nav-item mobile-nav-has-dropdown">
  <button class="mobile-nav-link mobile-nav-trigger" aria-expanded="false">
    Services <span class="mobile-chevron" aria-hidden="true">›</span>
  </button>
  <ul class="mobile-nav-dropdown" hidden>
    <li><a href="services.html" class="mobile-nav-dropdown-all">All Services →</a></li>
    <li class="mobile-nav-group-label mobile-nav-group-label--teal">Core Services</li>
    <li><a href="services/personal-care.html">Personal Care</a></li>
    <li><a href="services/companion-care.html">Companion Care</a></li>
    <li><a href="services/medication-reminders.html">Medication Reminders</a></li>
    <li><a href="services/meal-preparation.html">Meal Preparation</a></li>
    <li><a href="services/light-housekeeping.html">Light Housekeeping</a></li>
    <li><a href="services/mobility-safety-support.html">Mobility &amp; Safety Support</a></li>
    <li class="mobile-nav-group-label mobile-nav-group-label--gold">Specialized Care</li>
    <li><a href="services/dementia-alzheimers-care.html">Dementia &amp; Alzheimer's Care</a></li>
    <li><a href="services/respite-care.html">Respite Care</a></li>
    <li><a href="services/post-hospital-recovery.html">Post-Hospital Recovery</a></li>
    <li><a href="services/veteran-care.html">Veteran Care</a></li>
  </ul>
</li>
```

### CSS additions to main.css

```css
/* ── Nav Dropdown ──────────────────────────────────────── */
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
  transition: color 150ms;
}
.nav-dropdown li a:not(.nav-dropdown-all):hover { color: var(--color-teal); }

/* Mobile dropdown */
.mobile-nav-trigger {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  font: inherit;
  padding: 0;
  color: inherit;
}
.mobile-chevron {
  transition: transform 200ms;
  font-style: normal;
}
.mobile-nav-trigger[aria-expanded="true"] .mobile-chevron { transform: rotate(90deg); }

.mobile-nav-dropdown {
  list-style: none;
  margin: 4px 0 0 0;
  padding: 0 0 0 12px;
  border-left: 2px solid var(--color-ivory-dark);
}
.mobile-nav-dropdown li a {
  display: block;
  padding: 6px 0;
  font-size: 0.9375rem;
}
.mobile-nav-dropdown-all {
  font-weight: 600;
  color: var(--color-navy);
  padding-bottom: 8px;
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

### JS additions to main.js

Add to the DOMContentLoaded block (after existing mobile nav logic):

```js
// Desktop nav dropdown — hover intent + keyboard
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

// Mobile nav dropdown accordion
document.querySelectorAll('.mobile-nav-trigger').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var isOpen = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!isOpen));
    var list = btn.nextElementSibling;
    if (list) list.hidden = isOpen;
  });
});
```

---

## Service Page Template (9 sections)

Every service page follows this exact section order. Section IDs, CSS classes, and HTML structure are consistent across all 10 pages.

### HTML boilerplate (head)
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[Service Name] in Pittsburgh, PA | Trinity Home Care</title>
  <meta name="description" content="[150-160 char description]">
  <link rel="canonical" href="https://trinityhomecarepgh.com/services/[slug].html">
  <!-- Same font/preconnect links as all other pages -->
  <link rel="stylesheet" href="../css/main.css">
  <link rel="stylesheet" href="../css/services-page.css">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "[Service Name]",
    "provider": {
      "@type": "HomeAndConstructionBusiness",
      "name": "Trinity Home Care",
      "telephone": "+14123453721",
      "address": { "@type": "PostalAddress", "addressLocality": "Pittsburgh", "addressRegion": "PA" }
    },
    "areaServed": "Pittsburgh, PA",
    "description": "[Same as meta description]"
  }
  </script>
</head>
```

### §1 Hero
- Class: `.section-hero--page` (same as about.html, contact.html, how-it-works.html)
- Background image set via inline `style="background-image: url('../[photo path]')"` on `.section-hero--page`
- Eyebrow: service name (e.g., "Personal Care")
- H1: per-service (see Content section)
- Subhead: per-service
- CTA dual buttons: Primary `btn-teal` → `#cta-form` | Ghost `btn-outline` → `tel:4123453721`
- Trust badges (4): No Obligation · Free Assessment · Locally Owned · Care Starts Fast

### §2 What We Provide
- Background: white
- Section label: "What We Provide"
- H2: "What does [service name] include?"
- Layout (desktop): copy column (flex 3) + photo column (flex 2)
- Copy: 2 body paragraphs + `.service-callout` box (white bg, `border-left: 3px solid var(--color-teal)`, card shadow)
  - Callout label: "What's included" (teal uppercase)
  - Checklist: 5-6 items with `✓` prefix
- Photo: `<img>` with `object-fit: cover`, `border-radius: var(--radius-md)`, `box-shadow: var(--shadow-photo)`
- `[data-animate]` on section

### §3 Who It Helps
- Background: ivory
- Section label: "Who It Helps"
- H2: "Who benefits most from [service name]?"
- Pill tags: `.service-pill` (white bg, `1px solid var(--color-ivory-dark)`, border-radius 20px) — 4-5 tags
- Body paragraph (1)
- `[data-animate]`

### §4 Signs You May Need This
- Background: white
- Section label: "Common Signs"
- H2: "Signs your loved one may need [service name]"
- Intro sentence + unordered list (4-5 items), styled with `•` bullet and left padding
- `[data-animate]`

### §5 A Day in the Life
- Background: ivory
- Section label: "A Day in the Life" (gold label)
- H2: "What [service] looks like in practice"
- Layout (desktop): photo column (flex 2, left) + copy column (flex 3, right)
- Photo: supporting image, same treatment as §2 photo
- Copy: 1 narrative paragraph (3-4 sentences), italic style
- `[data-animate]`

### §6 What Families Tell Us
- Background: white
- Single testimonial card: white bg, `border-top: 3px solid var(--color-gold)`, card shadow, star rating, Cormorant italic quote, Inter attribution
- `[data-animate]`

### §7 Often Paired With
- Background: ivory
- Section label: "Often Paired With"
- 2-3 linked service cards: white bg, `1px solid var(--color-teal)` border, teal text, `border-radius: var(--radius-md)`, arrow → links to related service page
- **Link paths:** all service pages live in the same `/services/` directory, so links between them use just the filename — e.g. `href="companion-care.html"` (no `../services/` prefix needed)
- `[data-animate]`

### §8 Common Questions
- Background: white
- Section label: "Common Questions"
- H2: "Questions about [service name]"
- 3 FAQ accordion items — same one-open-at-a-time pattern as how-it-works.js
  - Each item: `.service-faq-item`, button with `aria-expanded`, answer panel
- Footer link: "See all FAQs →" → `contact.html` (fallback until faq.html exists)
- `[data-animate]`

### §9 CTA
- Background: navy (`var(--color-navy)`)
- Class: `.section-service-cta`
- `clip-path: polygon(0 32px, 100% 0, 100% 100%, 0 100%)` + `margin-top: -32px`
- H2: "Start the conversation. *No pressure, ever.*"
- Sub: "We'll answer your questions and help you figure out what's right for your family."
- Large phone link: `tel:4123453721`
- Inline form (`id="cta-form"`): First Name + Last Name (row) · Phone (required) · Email (optional) · "Who needs care?" dropdown · Submit: "Request a Free Assessment →" (btn-teal) · Disclaimer: "No obligation. We typically respond within one business hour."

---

## CSS Spec — css/services-page.css

Contains only service-page-scoped styles. No changes to main.css except nav dropdown (above).

Key rules:
- `.section-hero--page` background-image override — handled inline per page
- `.service-what-provides` — 2-column flex layout, stacks on mobile ≤768px
- `.service-callout` — white bg, `border-left: 3px solid var(--color-teal)`, `box-shadow: var(--shadow-card)`, padding 1.25rem 1.5rem
- `.service-callout-label` — teal, uppercase, 0.6875rem, letter-spacing
- `.service-callout-item::before { content: '✓ '; color: var(--color-teal); }`
- `.service-who-helps` — ivory bg, pill tags flex-wrap
- `.service-pill` — white bg, `1px solid var(--color-ivory-dark)`, `border-radius: 20px`, padding 4px 14px, font-size 0.875rem
- `.service-day-in-life` — ivory bg, 2-column flex (photo left), stacks on mobile ≤768px, photo on bottom
- `.service-day-copy` — italic body text, `color: var(--color-text-sub)`
- `.service-testimonial` — white bg, testimonial card (gold border-top, shadow, star rating, Cormorant quote)
- `.service-related` — ivory bg, flex row of 2-3 cards
- `.service-related-card` — white bg, `1px solid var(--color-teal)`, `border-radius: var(--radius-md)`, padding 14px 18px, teal link text
- `.service-faq-item` — same structure as how-it-works FAQ items (white card, chevron, `aria-expanded`)
- `.section-service-cta` — navy bg, clip-path chevron, margin-top -32px (same as `.section-contact-final`)
- Mobile: all 2-column sections stack; photo below copy except §5 where photo above copy

---

## JS Spec — js/services-page.js

Vanilla JS, IIFE, `'use strict'`.

```
1. FAQ accordion — one-open-at-a-time
   - querySelectorAll('.service-faq-item button')
   - On click: if already open, close it; else close all, open clicked
   - Manages aria-expanded + panel visibility

2. Form validation — same firstInvalid tracker pattern as how-it-works.js
   - Required: phone field
   - On submit: find first invalid, focus it, show inline error message
   - On success (no action, just prevent default + show confirmation message)
```

---

## SEO Conventions

| Element | Pattern |
|---------|---------|
| `<title>` | `[Service Name] in Pittsburgh, PA \| Trinity Home Care` |
| `<meta description>` | 150-160 chars, includes "Pittsburgh", service name, key benefit |
| `<link rel="canonical">` | `https://trinityhomecarepgh.com/services/[slug].html` |
| JSON-LD type | `Service` with `provider` LocalBusiness |
| H1 | Unique per page, Cormorant, includes italic emphasis |
| Image alt text | Descriptive, no keyword stuffing |

---

## Image Assignments

| Service | Hero image | Supporting image (§2 + §5) |
|---------|-----------|---------------------------|
| Personal Care | `assets/images/services/service-bathing-assistance.jpg` | `assets/images/supporting/caregiver-supporting-senior-shoulders.jpg` |
| Companion Care | `assets/images/supporting/caregiver-senior-reading-tea.jpg` | `assets/images/supporting/caregiver-helping-senior-computer.jpg` |
| Medication Reminders | `assets/images/services/service-medication-reminders.jpg` | `assets/images/supporting/caregiver-talking-to-senior-chairside.jpg` |
| Meal Preparation | `assets/images/services/caregiver-supporting-senior-meal-planning.jpg` | `assets/images/supporting/caregiver-client-home-visit.jpg` |
| Light Housekeeping | `assets/images/services/service-light-housekeeping.jpg` | `assets/images/services/service-home-care-assistance.jpg` |
| Mobility & Safety | `assets/images/supporting/caregiver-senior-cane-support.jpg` | `assets/images/supporting/caregiver-senior-exercise-support.jpg` |
| Dementia & Alzheimer's | `assets/images/supporting/caregiver-holding-senior-hand.jpg` | `assets/images/supporting/group-seniors-caregiver-smiling.jpg` |
| Respite Care | `assets/images/supporting/caregiver-client-home-visit-alt.jpg` | `assets/images/supporting/caregiver-standing-with-senior-wheelchair.jpg` |
| Post-Hospital Recovery | `assets/images/supporting/caregiver-reviewing-paperwork-with-senior.jpg` | `assets/images/supporting/team-caregiver-client-portrait.jpg` |
| Veteran Care | `assets/images/hero/hero-caregiver-wheelchair-support.jpg` | `assets/images/supporting/caregiver-smiling-with-senior-wheelchair.jpg` |

---

## Service Page Content

All copy is final for implementation. Placeholder attributions — replace with real client quotes when available.

---

### 1. Personal Care
**URL:** `/services/personal-care.html`
**Title:** `Personal Care in Pittsburgh, PA | Trinity Home Care`
**Meta:** `Trinity Home Care provides compassionate personal care in Pittsburgh — bathing, grooming, dressing, and hygiene support delivered with patience and deep respect for dignity.`
**Canonical:** `https://trinityhomecarepgh.com/services/personal-care.html`
**JSON-LD name:** `Personal Care`

**§1 Hero**
Eyebrow: Personal Care
H1: `Dignified, hands-on care —<br><em>at home.</em>`
Subhead: Bathing, dressing, grooming, and personal hygiene — handled with patience, skill, and deep respect for your loved one's dignity.

**§2 What We Provide**
H2: What does personal care include?
Para 1: Personal care covers the most intimate aspects of daily life — the tasks that require both skill and sensitivity. A Trinity caregiver helps your loved one with bathing, dressing, grooming, oral hygiene, and toileting in a way that preserves their dignity and their sense of self. We approach every visit with patience, not efficiency.
Para 2: We match each client with a caregiver who understands their preferences — whether that means a quiet morning routine, a particular way of doing things, or simply needing a little more time than most. Personal care works best when it feels natural, and that takes a caregiver who genuinely listens.
Checklist: Bathing, showering, and sponge baths · Dressing and clothing selection · Hair, oral, and nail care · Toileting and incontinence support · Skin care and pressure sore prevention · Transfer assistance (bed to chair, chair to standing)

**§3 Who It Helps**
H2: Who benefits most from personal care?
Pills: Seniors with limited mobility · Post-surgery recovery · Chronic illness · Parkinson's or stroke recovery · Family caregiver relief
Para: Personal care is most valuable when physical limitations make self-care difficult, uncomfortable, or unsafe — and when family members aren't in a position to provide hands-on help themselves. It's also one of the most emotionally sensitive services we offer, which is why caregiver fit matters more here than anywhere else.

**§4 Signs You May Need This**
H2: Signs your loved one may need personal care
Intro: These are the signs families notice most often before reaching out:
Bullets:
- Your loved one is wearing the same clothing for several days at a time
- You've noticed a change in their grooming or personal hygiene
- They've had a fall or near-fall in the bathroom
- They express embarrassment or resistance about asking family for help
- A recent health event has made independent bathing unsafe

**§5 A Day in the Life**
H2: What personal care looks like in practice
Narrative: Maria arrives at 8:00 a.m. to help Robert start his day. She lays out the clothes they selected together the day before, runs a warm shower, and stays close — not hovering, but present. By 8:45, Robert is dressed, groomed, and sitting at the kitchen table with coffee. He hasn't needed to ask his daughter to help him bathe in three months, and neither of them has to carry that discomfort anymore.

**§6 Testimonial**
Stars: 5
Quote: "I was dreading having to help my father with bathing — and I think he was dreading asking me. Trinity sent someone who made it so natural. He actually looks forward to his mornings now."
Attribution: — Carol B., Pittsburgh, daughter

**§7 Often Paired With**
Companion Care · Medication Reminders · Mobility & Safety Support

**§8 FAQs**
Q1: Can I request a same-gender caregiver?
A1: Yes, always. We take caregiver-client fit seriously, and that includes gender preference. Just let us know when you call and we'll match accordingly.

Q2: How long does a typical personal care visit last?
A2: Most personal care visits run 2–4 hours, though we can arrange shorter check-in visits or longer half-day arrangements depending on what's needed.

Q3: Does insurance cover personal care at home?
A3: It depends on the policy. Most standard health insurance and Medicare don't cover non-medical personal care, but long-term care insurance often does. We can help you think through your options when you call.

---

### 2. Companion Care
**URL:** `/services/companion-care.html`
**Title:** `Companion Care in Pittsburgh, PA | Trinity Home Care`
**Meta:** `Trinity Home Care offers companion care in Pittsburgh — meaningful conversation, shared activities, and a warm, consistent presence that eases loneliness and keeps families connected.`
**Canonical:** `https://trinityhomecarepgh.com/services/companion-care.html`
**JSON-LD name:** `Companion Care`

**§1 Hero**
Eyebrow: Companion Care
H1: `More than a helping hand —<br><em>real company.</em>`
Subhead: Meaningful conversation, shared activities, and a consistent presence that makes the day feel less empty.

**§2 What We Provide**
H2: What does companion care include?
Para 1: Loneliness is one of the most serious — and most overlooked — health risks for older adults. A companion caregiver from Trinity is there not just to help with small tasks, but to genuinely engage: conversation over coffee, a walk around the neighborhood, a card game, a shared TV program. The goal is connection, not just coverage.
Para 2: Companion care can stand alone as a regular social visit, or it can be paired with personal care or errands to create a fuller schedule of support. Families often start with companion care and find that it opens the door to a relationship that makes everything else easier.
Checklist: Conversation and social engagement · Games, hobbies, and shared activities · Light reading aloud or book discussions · Accompaniment to appointments or outings · Monitoring mood and alerting family to changes · Light meal preparation and household tidying

**§3 Who It Helps**
H2: Who benefits most from companion care?
Pills: Seniors living alone · Early cognitive decline · Recently bereaved · Family lives at a distance · Recovering from a health event
Para: Companion care is the right fit when your loved one is physically capable but emotionally or socially isolated — or when you simply can't be there as often as you'd like and want to know someone warm and consistent is checking in.

**§4 Signs You May Need This**
H2: Signs your loved one may need companion care
Intro: These are the signs families notice most often before reaching out:
Bullets:
- Your loved one mentions feeling lonely or bored most days
- You've noticed a drop in mood or motivation since retiring or losing a spouse
- They've stopped pursuing hobbies they used to enjoy
- You live more than an hour away and worry about isolation
- Their world has narrowed since a health event or life change

**§5 A Day in the Life**
H2: What companion care looks like in practice
Narrative: Helen and her caregiver, Diane, have been meeting on Tuesday and Thursday mornings for four months. Today they're working through a 500-piece puzzle while Diane listens to Helen talk about her years as a schoolteacher in Greenfield. Helen's daughter notices her mother's voice is brighter on the phone these days. She calls it the Diane effect.

**§6 Testimonial**
Stars: 5
Quote: "My mother lives alone and I was 800 miles away, worrying constantly. Her companion caregiver has become someone she genuinely looks forward to seeing. I can hear it in her voice — she's less isolated. That matters more than anything."
Attribution: — David K., son (remote caregiver)

**§7 Often Paired With**
Personal Care · Meal Preparation · Mobility & Safety Support

**§8 FAQs**
Q1: What kinds of activities does a companion caregiver typically do?
A1: It depends entirely on your loved one. Some clients want a walking partner, others prefer cards or conversation, others like having help with hobbies or video calls with family. We match caregivers in part based on shared interests and personality.

Q2: How is companion care different from personal care?
A2: Companion care focuses on social engagement, emotional support, and light daily activities. Personal care involves hands-on help with bathing, grooming, and hygiene. Many clients receive both.

Q3: Can a companion caregiver drive my loved one to appointments?
A3: Yes, with prior arrangement. Transportation to appointments, errands, or social outings is something many of our companion caregivers provide. Just mention it when we set up the schedule.

---

### 3. Medication Reminders
**URL:** `/services/medication-reminders.html`
**Title:** `Medication Reminders in Pittsburgh, PA | Trinity Home Care`
**Meta:** `Trinity Home Care provides medication reminder services in Pittsburgh — reliable, gentle support that keeps seniors on schedule and families reassured, without replacing medical care.`
**Canonical:** `https://trinityhomecarepgh.com/services/medication-reminders.html`
**JSON-LD name:** `Medication Reminder Services`

**§1 Hero**
Eyebrow: Medication Reminders
H1: `The right dose —<br><em>at the right time.</em>`
Subhead: Gentle, reliable reminders that keep your loved one's medication schedule on track — without replacing what their doctor prescribed.

**§2 What We Provide**
H2: What do medication reminder services include?
Para 1: Missing or doubling up on medications is one of the leading causes of preventable hospitalizations among older adults. A Trinity caregiver doesn't administer medications, but they do sit with your loved one at the right time, remind them what needs to be taken, and make sure it actually happens — rather than being forgotten in the rush of the morning.
Para 2: Caregivers can also help organize medications into weekly pill organizers, keep a log of what was taken and when, and alert the family or care coordinator if something seems off. It's a small intervention with a significant impact.
Checklist: Verbal reminders at scheduled medication times · Assisting client in locating and opening medication containers · Weekly pill organizer setup · Medication log documentation · Alerting family if doses are missed or client expresses concerns · Coordination with family on schedule changes

**§3 Who It Helps**
H2: Who benefits most from medication reminders?
Pills: Managing multiple medications · Memory concerns · Post-discharge patients · Complex schedules · Living alone
Para: Medication reminders are especially important for seniors managing multiple prescriptions, those with early cognitive decline, or anyone recently discharged from a hospital where the regimen may have changed. When medications are taken consistently, everything else tends to improve.

**§4 Signs You May Need This**
H2: Signs your loved one may need medication reminder support
Intro: These are the signs families notice most often before reaching out:
Bullets:
- Pill bottles are frequently emptied too quickly or too slowly
- Your loved one can't reliably recall whether they took their morning medication
- A recent hospitalization was linked to a missed or incorrect dose
- Their medication schedule has recently changed and is difficult to track
- They live alone with no daily family contact

**§5 A Day in the Life**
H2: What medication reminder support looks like in practice
Narrative: At 9:00 a.m., James's caregiver knocks on his bedroom door with a glass of water and a small tray — three pills, as always. James isn't always sure which ones are which anymore, but he knows the routine, and the routine is what keeps things working. His cardiologist mentioned at the last visit that his numbers have been unusually stable. James credits his caregiver.

**§6 Testimonial**
Stars: 5
Quote: "After my dad got out of the hospital they sent him home with four new medications on top of the three he was already taking. He kept missing doses and we kept worrying. His Trinity caregiver made that whole problem go away — it just stopped being an issue."
Attribution: — Patricia N., Pittsburgh, daughter

**§7 Often Paired With**
Personal Care · Post-Hospital Recovery · Companion Care

**§8 FAQs**
Q1: Can a Trinity caregiver administer medications?
A1: No — our caregivers are not licensed to administer or dispense medications. What they can do is remind, encourage, assist with opening containers, organize pill boxes, and log what was taken. For medical administration, a licensed home health nurse is the right resource.

Q2: What if my loved one refuses to take their medication?
A2: We document refusals and notify the family. We won't force or coerce — that's never appropriate. But we'll alert you so you and their doctor can follow up.

Q3: Can caregivers help set up a weekly pill organizer?
A3: Yes. Many caregivers help clients organize their medications at the start of the week as part of their regular visit. It's one of the most practical things we do.

---

### 4. Meal Preparation
**URL:** `/services/meal-preparation.html`
**Title:** `Meal Preparation Services in Pittsburgh, PA | Trinity Home Care`
**Meta:** `Trinity Home Care provides in-home meal preparation services in Pittsburgh — balanced, home-cooked meals tailored to your loved one's tastes, dietary needs, and daily routine.`
**Canonical:** `https://trinityhomecarepgh.com/services/meal-preparation.html`
**JSON-LD name:** `Meal Preparation Services`

**§1 Hero**
Eyebrow: Meal Preparation
H1: `Nourishing meals —<br><em>made with care.</em>`
Subhead: Balanced, home-cooked meals prepared around your loved one's tastes, dietary needs, and daily rhythm.

**§2 What We Provide**
H2: What does meal preparation include?
Para 1: Good nutrition is foundational to health, independence, and quality of life — but cooking becomes harder as mobility, energy, and appetite change with age. A Trinity caregiver prepares fresh meals that your loved one will actually eat, not institutional food delivered from elsewhere. They cook in the home kitchen, use familiar recipes when requested, and share the meal when that's what the client enjoys.
Para 2: Caregivers also keep track of dietary restrictions and preferences, and can handle grocery shopping if needed. Meal preparation visits often become the social highlight of the day — not just nutrition, but a reason to sit down, eat well, and feel cared for.
Checklist: Breakfast, lunch, or dinner preparation · Accommodation of dietary restrictions (diabetic, low-sodium, soft diet, etc.) · Use of client's preferred recipes or familiar dishes · Kitchen cleanup after each meal · Grocery shopping coordination · Monitoring appetite and alerting family to changes

**§3 Who It Helps**
H2: Who benefits most from meal preparation support?
Pills: Limited mobility · Dietary restrictions · Poor appetite · Post-surgery recovery · Living alone
Para: Meal prep support is ideal for seniors who are physically capable of most activities but find cooking difficult, tiring, or dangerous — and for anyone who has stopped enjoying food since losing a cooking partner.

**§4 Signs You May Need This**
H2: Signs your loved one may need meal preparation help
Intro: These are the signs families notice most often before reaching out:
Bullets:
- The refrigerator is mostly empty or filled with expired items
- Your loved one has lost weight without explanation
- They're relying on frozen dinners or skipping meals
- Cooking has become a safety concern (forgotten burners, burns)
- They mention not being hungry — often a sign of depression or poor nutrition

**§5 A Day in the Life**
H2: What meal preparation looks like in practice
Narrative: Dorothy loves chicken soup made the way her late husband used to make it, and she wrote down his recipe years ago. Her caregiver, Ana, makes it every other Tuesday. The recipe takes an hour and fills the whole apartment with the smell of home. Dorothy eats two bowls and asks for the rest to be frozen for later in the week.

**§6 Testimonial**
Stars: 5
Quote: "My mother wasn't eating well at all — she'd lost seven pounds and we didn't understand why. Her caregiver started cooking for her and within a month she was back to her normal weight. She told me last week that she looks forward to meal days. That was everything to me."
Attribution: — Sandra R., Pittsburgh, daughter

**§7 Often Paired With**
Companion Care · Light Housekeeping · Personal Care

**§8 FAQs**
Q1: Can caregivers accommodate special diets like diabetic or low-sodium?
A1: Yes. We document dietary restrictions at the time of the care assessment and match caregivers who have experience with those requirements. We ask families to share any guidelines from the client's doctor.

Q2: Do caregivers also do grocery shopping?
A2: Yes, with prior arrangement. Some caregivers shop during the visit (if the client stays home), and some accompany the client. We'll build the approach into the care plan.

Q3: Do caregivers clean up after cooking?
A3: Yes — kitchen cleanup is included as part of the meal preparation service.

---

### 5. Light Housekeeping
**URL:** `/services/light-housekeeping.html`
**Title:** `Light Housekeeping Services in Pittsburgh, PA | Trinity Home Care`
**Meta:** `Trinity Home Care provides light housekeeping for seniors in Pittsburgh — regular cleaning, laundry, and home organization that keeps living spaces safe, clean, and comfortable.`
**Canonical:** `https://trinityhomecarepgh.com/services/light-housekeeping.html`
**JSON-LD name:** `Light Housekeeping Services`

**§1 Hero**
Eyebrow: Light Housekeeping
H1: `A tidy home.<br><em>A clearer mind.</em>`
Subhead: Safe, clean living spaces maintained without disrupting routines or rearranging what matters.

**§2 What We Provide**
H2: What does light housekeeping include?
Para 1: A cluttered or dusty home isn't just aesthetically uncomfortable — it's a fall hazard, a source of stress, and often a sign that someone needs more support than they've been asking for. Light housekeeping from Trinity keeps living spaces clean, organized, and safe without overwhelming a client who values their privacy or routine.
Para 2: Our caregivers approach housekeeping with the same respect as all our other services: they follow the client's preferences, don't rearrange without asking, and focus on the rooms and tasks that matter most. Most clients pair housekeeping with another service so the caregiver is already there — it becomes a natural part of the visit.
Checklist: Vacuuming, sweeping, and mopping · Dusting surfaces and common areas · Kitchen and bathroom cleaning · Laundry, washing, and folding · Trash removal and recycling · Decluttering and organizing as requested

**§3 Who It Helps**
H2: Who benefits most from light housekeeping?
Pills: Mobility limitations · Recovering from illness · Arthritis or limited strength · Family lives at a distance · Anyone needing consistent maintenance
Para: Light housekeeping is right for seniors who want a clean home but can no longer safely or comfortably maintain it themselves — and for families who want peace of mind that their loved one's environment is safe and dignified.

**§4 Signs You May Need This**
H2: Signs your loved one may need housekeeping support
Intro: These are the signs families notice most often before reaching out:
Bullets:
- Laundry is piling up or not being done regularly
- The bathroom or kitchen hasn't been cleaned in some time
- There are fall hazards — clutter, loose items, poor organization
- Your loved one mentions feeling embarrassed about the state of their home
- They've stopped having family or friends visit

**§5 A Day in the Life**
H2: What light housekeeping looks like in practice
Narrative: Every Friday, Ruth's caregiver arrives at 10:00 a.m. with a simple routine: bathroom first, then kitchen, then a quick vacuum of the living room and bedroom. Ruth stays in her favorite chair and watches the morning news. By noon the apartment smells clean, the laundry is folded on the bed, and Ruth's daughter can stop worrying about what she'll find on her next visit.

**§6 Testimonial**
Stars: 5
Quote: "I visited my father in September and the state of his house alarmed me — he just couldn't keep up with it anymore but he'd never ask for help. Trinity has made it part of his regular care and he seems more relaxed now that his home feels like his home again."
Attribution: — Brian T., Pittsburgh, son

**§7 Often Paired With**
Meal Preparation · Personal Care · Companion Care

**§8 FAQs**
Q1: What does "light" housekeeping include and exclude?
A1: Light housekeeping covers regular cleaning tasks — vacuuming, dusting, laundry, bathroom and kitchen cleaning, trash. It doesn't include deep-cleaning projects, heavy furniture moving, or exterior work.

Q2: Can caregivers do laundry?
A2: Yes — washing, drying, and folding laundry is included.

Q3: Will the caregiver rearrange things without asking?
A3: No. We follow the client's preferences and always ask before moving or reorganizing anything of significance. The goal is a cleaner version of their home, not a different one.

---

### 6. Mobility & Safety Support
**URL:** `/services/mobility-safety-support.html`
**Title:** `Mobility & Safety Support in Pittsburgh, PA | Trinity Home Care`
**Meta:** `Trinity Home Care offers mobility and safety support in Pittsburgh — fall prevention, transfer assistance, and movement support that keeps seniors active, confident, and safely at home.`
**Canonical:** `https://trinityhomecarepgh.com/services/mobility-safety-support.html`
**JSON-LD name:** `Mobility and Safety Support`

**§1 Hero**
Eyebrow: Mobility & Safety Support
H1: `Move safely.<br><em>Stay independent.</em>`
Subhead: Fall prevention, transfer assistance, and movement support so your loved one can stay active and at home — on their own terms.

**§2 What We Provide**
H2: What does mobility and safety support include?
Para 1: Falls are the leading cause of injury-related hospitalization among older adults — and fear of falling can be as limiting as falling itself. A Trinity caregiver trained in mobility support helps your loved one move through their day safely: standing up from chairs, navigating stairs, getting in and out of the car, and completing exercises their therapist has prescribed.
Para 2: Mobility support isn't just physical. A caregiver who walks beside someone with a steady arm and a calm presence changes the whole experience of moving through the day. Clients tell us they feel more confident and more willing to move when they're not doing it alone.
Checklist: Transfer assistance (bed to chair, chair to standing) · Safe ambulation support (walker, cane, or arm assistance) · Fall prevention environment monitoring · Assistance with prescribed home exercises · Accompaniment on walks and community outings · Guidance with wheelchair or mobility aid use

**§3 Who It Helps**
H2: Who benefits most from mobility and safety support?
Pills: Fall risk seniors · Post-surgery or post-stroke recovery · Parkinson's patients · Walker or wheelchair users · Rebuilding strength after inactivity
Para: Mobility support is most valuable for clients recovering from a fall, a joint replacement, a stroke, or any event that has diminished their confidence or capacity to move independently. It also provides critical protection for those whose balance or coordination has declined with age.

**§4 Signs You May Need This**
H2: Signs your loved one may need mobility support
Intro: These are the signs families notice most often before reaching out:
Bullets:
- Your loved one has fallen once in the past year
- They grip walls or furniture when moving around the home
- They've stopped going outside to avoid the risk of falling
- A doctor or physical therapist has noted fall risk in a recent visit
- They pause too long before standing — fear, not just caution

**§5 A Day in the Life**
H2: What mobility support looks like in practice
Narrative: George had a hip replacement four months ago. He's mostly back to himself, but getting up from his recliner in the evening is still hard. When his caregiver is there, she stands in front of him, hands steady, and they do it together — three seconds, easy. When she's not there, George sometimes stays seated longer than he should just to avoid the moment. Trinity is working on extending the evening visit.

**§6 Testimonial**
Stars: 5
Quote: "My husband had a stroke two years ago and he was terrified to walk. His caregiver worked with him slowly, never pushing, just steady and present. He's walking to the mailbox now. Six months ago I wouldn't have believed it."
Attribution: — Martha S., Pittsburgh, wife

**§7 Often Paired With**
Personal Care · Post-Hospital Recovery · Dementia & Alzheimer's Care

**§8 FAQs**
Q1: Are Trinity caregivers trained in safe transfer and lift techniques?
A1: Yes. All caregivers receive training in safe transfer techniques and body mechanics. For clients with complex mobility needs, we assess those needs during the in-home assessment and match accordingly.

Q2: Can a caregiver assist with physical therapy exercises?
A2: Caregivers can support and encourage prescribed home exercises provided by a physical therapist, but they do not perform or modify therapy. We coordinate with the PT when needed.

Q3: Can you help reduce fall risks in the home?
A3: Yes. As part of the in-home assessment, we note fall hazards — loose rugs, poor lighting, cluttered pathways — and bring them to the family's attention. We don't make modifications ourselves, but we make sure you know about them.

---

### 7. Dementia & Alzheimer's Care
**URL:** `/services/dementia-alzheimers-care.html`
**Title:** `Dementia & Alzheimer's Care in Pittsburgh, PA | Trinity Home Care`
**Meta:** `Trinity Home Care provides dementia and Alzheimer's care in Pittsburgh — patient, structured home care tailored to memory loss at every stage, with close family communication throughout.`
**Canonical:** `https://trinityhomecarepgh.com/services/dementia-alzheimers-care.html`
**JSON-LD name:** `Dementia and Alzheimer's Care`

**§1 Hero**
Eyebrow: Dementia & Alzheimer's Care
H1: `Gentle, consistent care —<br><em>through every stage.</em>`
Subhead: Memory care delivered at home with patience, structure, and the kind of calm presence that makes hard days better.

**§2 What We Provide**
H2: What does dementia and Alzheimer's care include?
Para 1: Caring for someone with dementia or Alzheimer's requires a different kind of skill. It's not just about physical tasks — it's about reading the room, maintaining a consistent routine, responding to confusion with calm rather than correction, and knowing when to redirect and when to simply sit together. Trinity selects and trains caregivers for memory care specifically, not just generally.
Para 2: We also work closely with families. The disease affects everyone in the household, and caregivers are trained to notice changes in condition, communicate them clearly, and support family members who are navigating their own grief alongside the day-to-day of caregiving. We take the whole picture seriously.
Checklist: Consistent daily routines tailored to the client's patterns · Redirection and de-escalation during confusion or agitation · Personal care with dementia-specific communication · Safety monitoring and wandering prevention · Engagement through familiar activities, music, and memory cues · Regular family updates and care team communication

**§3 Who It Helps**
H2: Who benefits most from dementia and Alzheimer's care?
Pills: Early, moderate, and late-stage Alzheimer's · Vascular dementia · Lewy body dementia · Families providing unpaid care · Clients who have resisted facility placement
Para: Dementia care at home is often possible longer than families expect — with the right caregiver. It's best suited for clients who are still most comfortable in a familiar environment and for families who want to delay or avoid memory care facility placement.

**§4 Signs You May Need This**
H2: Signs your loved one may need dementia care support
Intro: These are the signs families notice most often before reaching out:
Bullets:
- Your loved one is frequently confused about time, place, or people
- They've had wandering incidents or close calls at home
- Caregiver burnout is affecting your own health or relationships
- Sundowning is creating evening tension and sleep disruption
- Personal hygiene or meals are being missed or refused

**§5 A Day in the Life**
H2: What dementia care looks like in practice
Narrative: Some mornings Frank doesn't know what day it is, and his caregiver, Debra, doesn't tell him directly. She says good morning, mentions that breakfast smells good, and they walk to the kitchen together. By the time they sit down, Frank is calm and present. Debra has been working with him for eight months. His wife says the hardest part of the week is the days Debra isn't there.

**§6 Testimonial**
Stars: 5
Quote: "My mother has Alzheimer's and the progression has been hard for all of us. Her Trinity caregiver has a way with her that I can't fully explain — she knows when to be quiet, when to redirect, when to just hold her hand. My mother is calmer than she's been in two years."
Attribution: — Thomas W., Pittsburgh, son

**§7 Often Paired With**
Respite Care · Personal Care · Mobility & Safety Support

**§8 FAQs**
Q1: Are Trinity caregivers specifically trained in dementia care?
A1: Yes. Caregivers assigned to memory care clients receive specialized training in dementia communication, behavioral support, and safety monitoring — beyond our standard training.

Q2: How do you handle agitation or difficult behaviors?
A2: Our caregivers are trained in de-escalation, redirection, and calm presence techniques that reduce — rather than react to — agitation. We document behavioral patterns and communicate them to families so everyone is working from the same picture.

Q3: Can you provide care as the disease progresses to later stages?
A3: Yes. We develop care plans that can evolve with the client's needs. As care requirements increase, we adjust hours, caregiver selection, and service types accordingly.

---

### 8. Respite Care
**URL:** `/services/respite-care.html`
**Title:** `Respite Care in Pittsburgh, PA | Trinity Home Care`
**Meta:** `Trinity Home Care provides respite care in Pittsburgh — temporary relief for family caregivers who need time to rest, recover, or step away, while their loved one receives consistent, compassionate care.`
**Canonical:** `https://trinityhomecarepgh.com/services/respite-care.html`
**JSON-LD name:** `Respite Care`

**§1 Hero**
Eyebrow: Respite Care
H1: `Rest for you.<br><em>Continuity for them.</em>`
Subhead: Temporary relief for family caregivers — planned or urgent — so you can step away without worry.

**§2 What We Provide**
H2: What does respite care include?
Para 1: Family caregiving is one of the most demanding and underrecognized roles there is. Respite care exists specifically for the caregiver — to give you time to rest, handle your own obligations, or simply step out of the role long enough to come back to it with more to give. It is not a failure to ask for this. It is what makes sustained caregiving possible.
Para 2: Trinity provides respite care for a few hours, a full day, or an extended stretch when a family caregiver needs surgery, travel, or time to recover. We step in with the same structure and warmth your loved one is used to, so the transition is smooth and the return feels natural.
Checklist: Short-term coverage (a few hours to a full day) · Extended respite for planned family travel or events · Emergency or short-notice coverage when possible · Full personal care, companion, meal, and housekeeping services during respite · Daily family updates during extended respite · Transition support when the family caregiver returns

**§3 Who It Helps**
H2: Who benefits most from respite care?
Pills: Exhausted family caregivers · Recovering from their own health events · Work or travel obligations · Families in crisis · Anyone who needs a break without guilt
Para: Respite care is for the caregiver as much as the client. If you've been providing daily care for months or years, you don't need a reason to ask for relief — you need to be told it's available and that your loved one will be well cared for while you're gone.

**§4 Signs You May Need This**
H2: Signs you may need respite care
Intro: Caregiver burnout is real, and these are the signs it's building:
Bullets:
- You've put off your own medical appointments to manage care
- You feel resentful, exhausted, or like there is no end in sight
- You have an upcoming commitment — travel, work, surgery — with no coverage plan
- You've snapped at your loved one and felt ashamed about it
- Your own health is suffering from the demands of caregiving

**§5 A Day in the Life**
H2: What respite care looks like in practice
Narrative: Lisa has been caring for her mother full-time for fourteen months. Her sister is visiting from Cleveland and they've planned a weekend trip — the first time Lisa has been out of Pittsburgh in over a year. Trinity steps in for 52 hours: personal care, meals, companion visits, the full routine. When Lisa returns Sunday evening, her mother is watching television and doesn't seem to have noticed she was gone. Lisa cries in the car before going inside.

**§6 Testimonial**
Stars: 5
Quote: "I hadn't slept a full night in eight months. My husband was ill and I was his only caregiver. Trinity came for three days while I went to my sister's, and for the first time in almost a year I felt like myself again. It changed everything."
Attribution: — Eleanor H., Pittsburgh, wife

**§7 Often Paired With**
Dementia & Alzheimer's Care · Personal Care · Companion Care

**§8 FAQs**
Q1: How long can a respite care arrangement last?
A1: As long as you need. We've done a few hours, long weekends, and multi-week arrangements. We build the schedule and care plan around whatever works for your family.

Q2: Will my loved one's routine change during respite?
A2: We make every effort to maintain familiar routines during respite — meals at the same time, the same morning and evening patterns. The goal is continuity, not substitution.

Q3: Can respite care be arranged on short notice?
A3: We do our best. We can't guarantee same-day coverage in every situation, but for urgent needs we make it a priority. Call us and we'll tell you honestly what we can do.

---

### 9. Post-Hospital Recovery
**URL:** `/services/post-hospital-recovery.html`
**Title:** `Post-Hospital Home Care in Pittsburgh, PA | Trinity Home Care`
**Meta:** `Trinity Home Care provides post-hospital recovery care in Pittsburgh — attentive home support from discharge day through recovery, reducing readmission risk and keeping families informed.`
**Canonical:** `https://trinityhomecarepgh.com/services/post-hospital-recovery.html`
**JSON-LD name:** `Post-Hospital Recovery Care`

**§1 Hero**
Eyebrow: Post-Hospital Recovery
H1: `From discharge day<br><em>to fully home.</em>`
Subhead: Skilled, attentive support during the most vulnerable window in recovery — the first weeks back home.

**§2 What We Provide**
H2: What does post-hospital recovery care include?
Para 1: The transition from hospital to home is one of the highest-risk periods in an older adult's health trajectory. Instructions are often complex, medications have changed, and the energy required to follow through on recovery isn't always there. A Trinity caregiver arrives on discharge day and stays as involved as needed to keep the recovery on track and prevent a return to the hospital.
Para 2: Post-hospital care is temporary by nature — it ends when your loved one is stable, confident, and fully back to their routine. We build the care plan around the recovery timeline and adjust as things improve. Most clients find they need us for two to six weeks, sometimes longer after a major event.
Checklist: Discharge day pickup and home transition · Medication reminder support following the discharge regimen · Wound care monitoring (caregiver alerts family to changes; does not treat) · Appointment transportation and preparation · Assistance with prescribed PT home exercises · Progress updates to family and coordination with care team

**§3 Who It Helps**
H2: Who benefits most from post-hospital recovery care?
Pills: Joint replacement recovery · Post-cardiac event · Stroke rehabilitation · Major surgery recovery · Fall or fracture recovery · Readmission risk
Para: Post-hospital care is most critical for older adults returning home after a major procedure or health event, especially those who live alone or who are at elevated readmission risk. The first two weeks after discharge are when complications most often occur.

**§4 Signs You May Need This**
H2: Signs post-hospital care is the right fit
Intro: These are the situations that typically call for post-hospital support:
Bullets:
- Your loved one has been discharged and you're worried about what comes next
- They've been readmitted to the hospital within 30 days before
- They live alone and won't have consistent family coverage
- Discharge instructions are complex and hard to manage independently
- A physical therapist or doctor has recommended home support

**§5 A Day in the Life**
H2: What post-hospital recovery care looks like in practice
Narrative: Arthur was discharged after hip surgery on a Tuesday. His caregiver met him at the front door of the hospital with his daughter and helped settle him into the house. By Thursday, Arthur had taken all the right medications, attended one PT visit, and eaten three real meals. He called his daughter on Friday and told her he felt better than he expected. She called Trinity to say she'd like to continue through week four.

**§6 Testimonial**
Stars: 5
Quote: "My father came home from a major cardiac procedure and I was terrified. He lives alone and I work full time. His Trinity caregiver was there on discharge day, knew his whole medication schedule by heart, and kept me updated every day. He didn't go back to the hospital. That was everything."
Attribution: — Michael T., Pittsburgh, son

**§7 Often Paired With**
Medication Reminders · Mobility & Safety Support · Personal Care

**§8 FAQs**
Q1: When should home care start after hospital discharge?
A1: Ideally, on discharge day. The transition from hospital to home is the highest-risk period — having a caregiver there from the first day reduces the risk of early complications and sets the recovery routine immediately.

Q2: Can a Trinity caregiver coordinate with my loved one's medical team?
A2: Caregivers don't communicate with medical teams directly, but they document and report changes in condition to the family and care coordinator so you can follow up with the care team quickly. We keep you informed so you can keep them informed.

Q3: What if my loved one needs more care than expected?
A3: We adjust. Care plans are built to be modified. If recovery takes longer or new needs emerge, we extend or expand the plan accordingly. There's no penalty for changing course.

---

### 10. Veteran Care
**URL:** `/services/veteran-care.html`
**Title:** `Home Care for Veterans in Pittsburgh, PA | Trinity Home Care`
**Meta:** `Trinity Home Care provides home care for veterans in Pittsburgh — respectful, personalized support for those who served, with guidance on VA benefits including Aid & Attendance.`
**Canonical:** `https://trinityhomecarepgh.com/services/veteran-care.html`
**JSON-LD name:** `Veteran Home Care`

**§1 Hero**
Eyebrow: Veteran Care
H1: `For those who<br><em>served.</em>`
Subhead: Home care delivered with genuine respect for veterans — their service, their independence, and their right to age on their own terms.

**§2 What We Provide**
H2: What does veteran care include?
Para 1: Veterans have a different relationship with asking for help — they often delay it longer, frame it differently, and need to know that the person caring for them understands and respects that. Trinity provides home care for veterans who want to remain at home with the same dignity they've always carried, served by caregivers who approach them with real appreciation for what they've given.
Para 2: We work with families to understand each veteran's service history, preferences, and any service-related health considerations that should inform care. We also help families navigate potential VA benefits — including Aid & Attendance — that may offset the cost of home care.
Checklist: Personal care and companion services tailored to veteran preferences · Sensitivity to service-related injuries, PTSD, and health conditions · Assistance navigating VA Aid & Attendance benefit information · Flexible scheduling for VA clinic or medical appointments · Transportation to VA appointments · Caregiver matching based on veterans' personalities and communication styles

**§3 Who It Helps**
H2: Who benefits most from veteran care?
Pills: Veterans of all eras · Service-related conditions · Reluctant to ask for help · Family at a distance · May qualify for VA Aid & Attendance
Para: Veteran care is for any older veteran who needs home care and wants it delivered by people who understand and respect their background. It's also for families who want the cost conversation handled thoughtfully — VA benefits can make home care significantly more accessible.

**§4 Signs You May Need This**
H2: Signs your veteran family member may need care support
Intro: These are the situations families describe most often before reaching out:
Bullets:
- Your veteran family member refuses to accept help from "strangers"
- They have service-related injuries or conditions affecting daily life
- The family isn't sure what VA benefits they might be eligible for
- They've been reluctant to pursue care from agencies they see as impersonal
- Care needs are increasing but your veteran wants to stay home

**§5 A Day in the Life**
H2: What veteran care looks like in practice
Narrative: Bill served in Vietnam and spent forty years telling his family he didn't need any help. He's 78 now and agreed to try Trinity after his daughter mentioned that his caregiver was a former Army medic. They spend part of each visit talking. Bill still says he doesn't need help. But he makes sure he's ready when his caregiver arrives.

**§6 Testimonial**
Stars: 5
Quote: "My father is a Korean War veteran and getting him to accept care was its own mission. Trinity found someone who spoke his language — not literally, but in terms of respect and directness. He finally feels like he's being taken care of by someone who gets it."
Attribution: — Nancy L., Pittsburgh, daughter

**§7 Often Paired With**
Personal Care · Companion Care · Mobility & Safety Support

**§8 FAQs**
Q1: Does Trinity accept VA benefits or Aid & Attendance?
A1: We work with families to help navigate the Aid & Attendance benefit, which can help eligible veterans and surviving spouses offset the cost of home care. We recommend speaking directly with the VA or a VA-accredited claims agent for the eligibility process, and we're happy to discuss how our services align with what the benefit covers.

Q2: Are caregivers trained to work with veterans?
A2: Yes. Caregivers assigned to veteran clients are briefed on service history, any service-related health considerations, and the specific communication preferences that make care feel respectful rather than managed.

Q3: What if my veteran family member is reluctant to accept help?
A3: That's one of the most common things we hear. A free, no-pressure consultation call often helps — both with you and, if they're willing, directly with your family member. We've helped many families navigate that first conversation.

---

## services.html Updates

Each service card on `services.html` must link to its individual page. Add `href` to the "Learn More" or card CTA link on each card:

| Service card | Link |
|-------------|------|
| Personal Care | `services/personal-care.html` |
| Companion Care | `services/companion-care.html` |
| Medication Reminders | `services/medication-reminders.html` |
| Meal Preparation | `services/meal-preparation.html` |
| Light Housekeeping | `services/light-housekeeping.html` |
| Mobility & Safety Support | `services/mobility-safety-support.html` |
| Dementia & Alzheimer's Care | `services/dementia-alzheimers-care.html` |
| Respite Care | `services/respite-care.html` |
| Post-Hospital Recovery | `services/post-hospital-recovery.html` |
| Veteran Care | `services/veteran-care.html` |

## Footer Updates

All pages share the same footer. The footer currently has a "Quick Links" or "Services" section that links to `services.html`. Expand this into a two-group list matching the dropdown structure:

**Group label "Core Services" (teal):**
Personal Care · Companion Care · Medication Reminders · Meal Preparation · Light Housekeeping · Mobility & Safety Support

**Group label "Specialized Care" (gold):**
Dementia & Alzheimer's Care · Respite Care · Post-Hospital Recovery · Veteran Care

Paths from root pages (index, about, contact, services, how-it-works): `services/personal-care.html` etc.
Paths from service pages: `personal-care.html` etc. (same `/services/` directory)

---

## Constraints & Conventions

- **No external JS libraries.** Vanilla JS only.
- **No changes to main.css** beyond nav dropdown additions.
- **`[data-animate]` + IntersectionObserver** — all section entry points use existing system from main.js.
- **`prefers-reduced-motion`** respected — no animation that can't be suppressed.
- **Mobile-first** — all 2-column sections stack on mobile (≤768px). Photos below copy except §5 (photo on top).
- **Font load** — same `<link>` preconnects as all other pages (Cormorant Garamond + Inter).
- **Image paths** — service pages live in `/services/`, so all asset paths use `../assets/images/...`.
- **Nav active state** — service pages: add `aria-current="page"` to the specific dropdown link matching the current page; also add class `is-active` to the `.nav-dropdown-trigger` ("Services") so it receives the same active underline/color treatment as other nav links — but do NOT add `aria-current` to the trigger itself.
- **Relative paths for service pages** — all hrefs to other pages need `../` prefix (e.g. `../index.html`, `../services.html`, `../contact.html`).
- **Placeholder testimonials** — all testimonials marked as placeholders; replace with real client quotes when available.
- **No new images needed** — all photos exist in `assets/images/services/` and `assets/images/supporting/`.
