# How It Works Page — Design Spec
**Trinity Home Care · how-it-works.html**
Date: 2026-04-28
Layout approach: C — Timeline + Expandable Step Detail

---

## Goal

Remove the fear of the unknown. The biggest barrier to a first contact is not knowing what happens after you call. This page answers that question completely, step by step, with warmth and zero pressure.

Primary audience: adult child (age 45–65) researching care for a parent, late evening, likely on mobile.

---

## Page Architecture — 6 Sections

### §1 Hero
**Background:** `assets/images/supporting/caregiver-client-home-visit.jpg` — static image, same pattern as about.html and contact.html (`.section-hero--page` class).

**Eyebrow:** "How It Works"

**H1:**
> From your first call to<br>
> your loved one's<br>
> *first care day.*

**Subhead:** "We know the unknown is the hardest part. Here's exactly what happens — step by step, with no surprises and no pressure."

**CTAs (dual):**
- Primary: "Start the Conversation" → `#cta-form`
- Secondary (ghost): "Call 412-345-3721" → `tel:4123453721`

**Trust badges (4):** No Obligation · Free Assessment · Locally Owned · Care Starts Fast

---

### §2 The 5-Step Journey
**Background:** white (`var(--color-white)`)

**Section label:** "Your Care Journey"

**H2:** "Five steps to *peace of mind.*"

**Subhead:** "Every family's path to care is a little different — but the commitment at every step is the same: honest, unhurried, and always centered on your loved one."

#### Timeline track
- Full-width horizontal bar, 3px tall, CSS `linear-gradient(to right, var(--color-teal), var(--color-gold))`
- 5 milestone dots (`17×17px`) evenly spaced across the track using flexbox `justify-content: space-between`
- Each dot: navy fill, gold border; active dot: gold fill, scaled up 1.25×
- Each dot has a small label beneath it (Free Call · Assessment · Matching · Care Begins · Partnership)

#### 5 Step cards (below track)
- 5-column flex row on desktop; 2-column on tablet; single scrollable row (overflow-x scroll with snap) on mobile
- Each card: white bg, `1.5px solid var(--color-ivory-dark)` border, `border-radius: var(--radius-md)`, card shadow
- Card structure: **image zone** (56px tall, CSS gradient placeholder) → **body** (step number in gold Cormorant, bold title in Inter, 1-line teaser in muted, "↓ Details" teal label)
- **Active card:** gold border `2px solid var(--color-gold)`, gold box-shadow
- Clicking a card: (1) activates that card + its dot, (2) scrolls to §3 Step Detail, (3) swaps §3 content to that step's data

**Step card image gradients (CSS, no photo):**
| Step | Gradient direction | Purpose |
|------|--------------------|---------|
| 01   | teal-green → dark green | warm/home |
| 02   | teal → dark teal | professional |
| 03   | slate-blue → navy | trust/matching |
| 04   | warm amber → brown | connection |
| 05   | sage green → muted teal | continuity |

---

### §3 Step Detail Panel
**Background:** ivory (`var(--color-ivory)`)
**Border-top:** 3px gradient `linear-gradient(90deg, var(--color-gold), var(--color-teal))` — same accent used on testimonial cards in homepage

This is a single-panel section whose content **swaps when a step card is clicked**. Step 1 is open by default on page load. No collapse/expand accordion — the panel is always visible and always shows one step at a time.

**Panel layout (desktop):** copy column (flex: 3) + photo column (flex: 2), gap 3rem. Mobile: stacked, photo below copy.

**Copy column contains:**
1. Large step number (Cormorant Garamond, ~4rem, gold, 60% opacity) — decorative
2. H2 in Cormorant: step title + italic descriptor (e.g., "Free Consultation — *a real conversation, not a sales call.*")
3. Two body paragraphs (Inter, ~0.9375rem, `var(--color-text-sub)`)
4. **Callout box** — white card, `border-left: 3px solid var(--color-teal)`, card shadow, label "What to expect" (teal uppercase label), ✓ checklist (4 items)
5. **Prev / Next navigation** — "← Previous" and "Next: [Step Name] →" as teal text links; "Skip to Step N" as muted link

**Photo column:** real photo from asset library (see assignments below), `border-radius: var(--radius-md)`, `box-shadow: var(--shadow-photo)`, `object-fit: cover`, height 240px desktop.

**Photo assignments per step:**
| Step | Photo file |
|------|-----------|
| 01   | `caregiver-talking-to-senior-chairside.jpg` |
| 02   | `caregiver-reviewing-paperwork-with-senior.jpg` |
| 03   | `team-caregiver-client-portrait.jpg` |
| 04   | `caregiver-client-home-visit.jpg` |
| 05   | `caregiver-holding-senior-hand.jpg` |

**Step content — all 5 steps:**

#### Step 1 — Free Consultation
**Subtitle:** *a real conversation, not a sales call.*
**Body:** When you reach out to Trinity, you're connected directly with a care coordinator — not a call center. We take time to hear what's happening, what you're worried about, and what your loved one's life looks like right now. There's no script and no pressure to commit. Most families tell us this first call feels more like talking to a knowledgeable neighbor than a business appointment.
**Callout items:**
- 15–20 minute conversation — we do the listening
- Honest answers, even if the answer is "we may not be the right fit"
- No commitment, no paperwork, no follow-up pressure
- We'll suggest a free in-home assessment if it makes sense

#### Step 2 — In-Home Assessment
**Subtitle:** *we come to you, and we listen carefully.*
**Body:** One of our care coordinators visits your loved one at home — not to evaluate or judge, but to truly understand. We look at their daily routine, their living environment, their health needs, and what they value most about their independence. This visit usually takes about an hour and feels like a relaxed conversation. Everything we learn shapes the personalized care plan we build together.
**Callout items:**
- We visit at your home, on your schedule
- No forms to fill out beforehand — we ask the right questions when we're there
- Your loved one's preferences guide everything
- A draft care plan is ready within 24 hours of the visit

#### Step 3 — Caregiver Matching
**Subtitle:** *chosen for fit, not just availability.*
**Body:** This is where Trinity is genuinely different. We don't assign whoever is available on a given Tuesday. We study the care plan, learn what matters to your loved one — their routines, their sense of humor, their need for privacy or conversation — and hand-select a caregiver who is a real fit. Before care begins, we introduce them personally so nothing feels like a surprise.
**Callout items:**
- Match is based on personality, routine, and care needs — not schedule logistics
- You meet the caregiver before the first day of care
- If the match isn't right, we find a new one quickly and without drama
- All caregivers are background-checked, bonded, and insured

#### Step 4 — Care Begins
**Subtitle:** *day one is supported, never dropped.*
**Body:** The first day of care is handled with intention. Your caregiver arrives knowing your loved one's name, preferences, and the care plan. A Trinity coordinator checks in within the first few hours to make sure everything feels right. You'll hear from us — you won't need to chase us down. We treat the first week like an extended introduction, making small adjustments until the routine is natural and comfortable.
**Callout items:**
- Care coordinator check-in on day one
- Family update call after the first week
- Routine adjustments made as needed — your feedback drives them
- 24/7 support line for existing clients from day one

#### Step 5 — Ongoing Partnership
**Subtitle:** *care that grows with your family.*
**Body:** Care needs change over time, and a plan that was right six months ago may need to evolve. We schedule regular care plan reviews and stay in close contact with both families and caregivers. If something changes — a health event, a change in routine, a new need — we adjust quickly. Trinity isn't a vendor you manage. We're a partner who stays informed and stays engaged, for as long as your family needs us.
**Callout items:**
- Scheduled care plan reviews every 60–90 days
- Proactive family communication — we call you before you call us
- Care scales up or down as needs change
- No penalty for adjusting hours or schedule

---

### §4 Testimonials
**Background:** white (`var(--color-white)`)

**Section label:** "What Families Tell Us"
**H2:** "The moment you *stop wondering.*"

**2 testimonial cards** using the same visual pattern as the homepage testimonial cards (white bg, gold border-top, star rating, Cormorant italic quote, Inter attribution). Write new scoped CSS in `how-it-works.css` rather than sharing the homepage class — the homepage version is tightly coupled to its carousel context:
- White bg, `border-top: 3px solid var(--color-gold)`, card shadow, star rating, Cormorant italic quote, Inter attribution

**Card 1 — Linda M., Pittsburgh, daughter:**
> "I called Trinity not knowing what to expect, and honestly I was dreading it. But the woman I spoke with was so calm and kind — she listened to everything, didn't rush me once, and by the end I actually felt relieved for the first time in months."

**Card 2 — James T., Coraopolis, son:**
> "They found a caregiver who actually matched my father's personality — he's quiet, private, a little stubborn. Maria was perfect for him from day one. I had no idea a care agency would put that much thought into something like that."

*(Placeholder attributions — replace with real client names/quotes when available.)*

---

### §5 Process FAQ
**Background:** ivory (`var(--color-ivory)`)

**Section label:** "Common Questions"
**H2:** "A few things *families always ask.*"

3 accordion items using the same visual pattern as the homepage FAQ (white card, chevron, Inter body text). Write new scoped CSS in `how-it-works.css` — don't share the homepage selector. Open state: answer visible, chevron rotates 180°.

**Q1:** How quickly can care start after the assessment?
**A:** In most cases, we can have a caregiver in place within 24–72 hours of your assessment. For urgent situations, we do our best to arrange care within the same day — just let us know when you call.

**Q2:** What if my loved one doesn't connect with their caregiver?
**A:** We take the match seriously, but if it isn't right we want to know immediately. We'll find a better fit without any drama — the relationship between client and caregiver matters more than the schedule.

**Q3:** Do I have to sign a long-term contract?
**A:** No. We believe care arrangements should be as flexible as your family's needs. While many families stay with us for months or years because it works, you're never locked in to a contract that doesn't fit your situation.

**Footer link:** "See all FAQs →" — links to `faq.html` (future page; use `contact.html` as fallback for now)

---

### §6 Final CTA
**Background:** navy (`var(--color-navy)`)
**CSS:** reuse `.section-contact-final` clip-path chevron from contact.html exactly (`clip-path: polygon(0 32px, 100% 0, 100% 100%, 0 100%); margin-top: -32px`)

**H2:** "Start the conversation. *No pressure, ever.*"
**Sub:** "You've seen every step. You know what to expect. When you're ready — even if 'ready' just means having a conversation — we're here."
**Phone:** large clickable number, `tel:4123453721`

**Inline form** (id="cta-form") — same field set as contact.html:
- First Name + Last Name (row)
- Phone Number (required)
- Email (optional)
- Who needs care? (dropdown)
- Submit: "Request a Free Assessment →" (`btn-teal`)
- Disclaimer: "No obligation. We typically respond within one business hour."

---

## JavaScript Behavior

All JS lives in `js/how-it-works.js` (separate from main.js):

```
1. On DOMContentLoaded:
   - Activate Step 1 card + dot + load Step 1 content into detail panel

2. On step card click (event delegation on .step-cards container):
   - Deactivate all cards and dots
   - Activate clicked card + corresponding dot
   - Swap detail panel content (data stored in JS array — no fetch needed)
   - Smooth scroll to #step-detail with header offset

3. Prev/Next links in detail panel:
   - Advance or retreat the active step
   - Trigger same activate + scroll logic as card click

4. Existing main.js handles:
   - Sticky header, mobile nav, scroll-reveal ([data-animate]), stat counters, smooth anchors
```

**Step data array** — 5 objects, each with: `num`, `title`, `subtitle`, `body` (array of paragraphs), `calloutLabel`, `calloutItems` (array), `photo` (path), `photoAlt`, `prevLabel`, `nextLabel`.

**No dependency on any library.** Vanilla JS only.

---

## New CSS File

`css/how-it-works.css` — loaded only on how-it-works.html. Contains:

- Hero background image override (`.section-hero--page` — same as contact/about)
- Timeline track, dot, and label styles
- Step card grid + active states
- Step detail panel layout (`#step-detail`)
- Testimonials grid (reuse existing `.testimonial-card` if possible, else scope new)
- FAQ accordion styles (reuse existing `.faq-item` if possible)
- Mobile overrides (step cards horizontal scroll, panel stacks)

**No changes to main.css.** All new styles scoped to how-it-works.css.

---

## Nav Link Updates

All four existing pages have a nav link pointing to `index.html#how-it-works`. These must be updated to `how-it-works.html`:

- `index.html` — desktop nav + mobile nav (2 links)
- `services.html` — desktop nav + mobile nav (2 links)
- `about.html` — desktop nav + mobile nav (2 links)
- `contact.html` — desktop nav + mobile nav (2 links)

Footer links referencing `#how-it-works` on index.html should also be updated.

---

## Files to Create

| File | Purpose |
|------|---------|
| `how-it-works.html` | The page |
| `css/how-it-works.css` | Page-scoped styles |
| `js/how-it-works.js` | Timeline + step-swap JS |

## Files to Modify

| File | Change |
|------|--------|
| `index.html` | Nav links: `#how-it-works` → `how-it-works.html` (×2 desktop+mobile + footer) |
| `services.html` | Nav links (×2) |
| `about.html` | Nav links (×2) |
| `contact.html` | Nav links (×2) |

---

## Constraints & Conventions

- **No external JS libraries.** Vanilla only, matching main.js pattern.
- **`[data-animate]` + IntersectionObserver** — all scroll-reveal elements use the existing system in main.js; no new observer needed.
- **`prefers-reduced-motion`** — JS reads `window.matchMedia('(prefers-reduced-motion: reduce)')` before any animation; step transitions skip smooth scroll in reduced-motion mode.
- **Accessible** — step cards are `role="button"` with `aria-selected`, detail panel is `aria-live="polite"`, FAQ uses `aria-expanded`.
- **Mobile-first** — step cards scroll horizontally on mobile with CSS snap; detail panel stacks (photo below copy); timeline dots remain visible but labels hide below 480px.
- **Font load** — same `<link>` as all other pages (Cormorant Garamond + Inter, already in main.css preconnect pattern).
- **No new images needed** — all 5 step photos exist in `assets/images/supporting/`.
