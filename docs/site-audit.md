# Trinity Home Care LLC — Full Website Audit

**URL:** https://trinityhomecarellc.com
**Pages Reviewed:** Home, About, Services, Careers, Contact
**Built With:** WordPress + Elementor + Gravity Forms
**Audit Date:** April 10, 2026

---

## Page-by-Page Breakdown

### Home Page

**Hero:** Slider with 3 images. Headline: *"Enabling Comfort & Independence"* / *"Your Home, Your Care."* Single CTA: **"Get Started"** — functional but destination is unclear (should lead to contact or services, not just scroll down).

**Sections reviewed:**
- Welcome/About block — solid intro, CTA says "Read More" (vague)
- Why Choose Us — good concept, weak execution
- Services grid — clean visual layout, 8 services listed
- Contact form — embedded and functional
- Testimonials carousel — only 2 testimonials, one is from an employee (Tonya D), not a client
- Team section — no photos, no names, generic copy; CTA says "GET IN TOUCH"
- Footer — functional

**Critical Issue — Broken Stat Placeholders:**
The homepage displays two statistics blocks that were never filled in:
- **Years In Business: `[0+]`**
- **Caring Staff: `[0+]`**

These are live on the site and immediately destroy credibility. This is the single most damaging issue on the entire website.

---

### About Page

Content covers licensing/insurance/bonding, caregiver screening, equipment training, and a mission statement. Solid foundational content but:
- No staff photos or bios
- Mission statement is buried in paragraph text — not visually emphasized
- No accreditation badges or license numbers displayed
- Three generic stock images with no alt captions or context

---

### Services Page

All 8 services have dedicated descriptions — this is the strongest page on the site. Each service has a clear paragraph explaining the value. However:
- No pricing tiers or insurance/waiver program info
- No visual icons or service cards — likely plain text blocks
- CTA at bottom: *"Contact us to set up an appointment today"* — good but no phone number directly alongside it
- No differentiation from competitors (every home care agency offers these same 8 services)

---

### Careers Page

The strongest interactive page. Multi-step Gravity Form (3 steps, progress bar shown) collects personal info, availability, employment history, and resume upload.

**Typo: "Joint Our Team"** — should be **"Join Our Team."** This is the page headline and it's a significant credibility error for a professional care company.

---

### Contact Page

Simple, functional. Form collects name, email, phone, message. AJAX submission (no page reload). Character counter on message field is a nice touch. No business hours listed. No Google Maps embed. No confirmation of response time ("We'll respond within 24 hours").

---

## Comprehensive Issue Analysis

### Buttons & CTAs

| Location | CTA Text | Issue |
|---|---|---|
| Hero | "Get Started" | Generic — unclear destination |
| Homepage welcome | "Read More" | Vague — goes where? |
| Team section | "GET IN TOUCH" | Good, but all-caps is aggressive |
| Services page | "Contact us to set up an appointment" | Best CTA on site, still no urgency |
| Careers | "Joint Our Team" | **Typo** |
| Contact form | "Send" | Too minimal |

No phone number CTA in the hero. For home care — an emotional, trust-heavy decision — a prominent **"Call us now: 412-345-3721"** in the hero is essential. Phone calls convert dramatically better than form fills in this industry.

---

### Copy Quality

- Hero copy (*"Enabling Comfort & Independence"*) is generic — used by dozens of home care agencies
- *"What people say about us?"* — grammatically incorrect (missing "do")
- Stats placeholders `[0+]` live in production — critical error
- "Joint Our Team" typo on Careers
- Diversity statement repeated **verbatim** in the footer of every page — excessive repetition
- About page copy is solid but buries key trust signals (licensed, insured, bonded) deep in the body text
- No emotional storytelling — no client success stories, no named caregivers, no founder story

---

### Animations & Interactivity

- Hero image carousel (3 slides) — functional
- Testimonial carousel with prev/next arrows — functional but thin (2 entries)
- Elementor scroll/fade-in animations — likely present but not unique or intentional
- No hover effects confirmed on CTAs or service cards
- Multi-step form with progress bar on Careers — best interactive element on the site
- No scroll-triggered animations or micro-interactions
- No video content whatsoever

---

### Architecture & Information Design

**Sitemap:**
```
Home → About → Services → Careers → Contact
```

This is an extremely flat 5-page site with no depth. Missing entirely:
- FAQ page (huge in home care — families have many questions)
- Service area / coverage map page
- Testimonials / Reviews dedicated page
- Insurance & Payment info page (Medicaid waiver? Private pay? Long-term care insurance?)
- Blog / Resources (critical for SEO and trust)
- Emergency / 24-hour care info

---

### Trust Signals Audit

| Signal | Present? | Notes |
|---|---|---|
| Licensed & insured | Partial | Mentioned on About, not visible on Home |
| Accreditation badges | No | None displayed |
| Google Reviews | No | Not integrated |
| BBB or industry certs | No | None |
| Staff photos | No | Generic stock images only |
| Client count / years in business | Broken | `[0+]` placeholders |
| Testimonials | 2 | One is from an employee, not a client |
| Response time guarantee | No | No SLA on contact form |
| License numbers | No | Not displayed |

---

### SEO & Discoverability

- No blog — zero content marketing footprint
- No FAQ schema markup likely
- No service area pages (Pittsburgh, Coraopolis, Allegheny County, etc.)
- Phone number in header is good for local SEO
- No Google Business Profile link or embed

---

## Overall Grade

| Category | Score | Notes |
|---|---|---|
| Visual Design | C+ | Clean but generic Elementor template |
| Copy & Messaging | C | Typos, placeholders, generic headlines |
| CTAs & Conversion | C- | Weak, vague, no phone in hero |
| Trust & Credibility | D+ | Broken stats, thin testimonials, no certs |
| Site Architecture | C | Too flat, missing key pages |
| Interactivity / UX | C+ | Forms work; no meaningful animations |
| SEO Foundation | D+ | No blog, no local landing pages |
| Mobile Readiness | B | Elementor is responsive by default |

## Overall Grade: C-

The site is live and functional, which is the baseline — but for a home care company where families are making deeply emotional, trust-dependent decisions, this site would lose most visitors before they convert. The broken stat placeholders and typo alone could disqualify the company in the eyes of a cautious family.

---

## Priority Improvements

### Immediate (Fix This Week)

1. **Fix `[0+]` stat placeholders** — fill in real numbers or remove the section entirely
2. **Fix "Joint Our Team" typo** on Careers page
3. **Add a clickable phone number CTA in the hero** — *"Call us: 412-345-3721"*
4. **Fix "What people say about us?"** — should be *"What do people say about us?"*

### Short-Term (Next 30 Days)

5. Add **3–5 genuine client testimonials** — remove the employee testimonial from the client section
6. Display **licensed/insured/bonded** badges prominently on the homepage
7. Add **business hours** and expected response time on the Contact page
8. Add a **Google Maps embed** on the Contact page
9. Add **insurance & payment information** (Medicaid, private pay, long-term care insurance) — this is a top decision factor for families
10. Rewrite hero copy to be location-specific: *"Compassionate In-Home Care for Pittsburgh-Area Families"*

### Strategic (60–90 Days)

11. Add a **FAQ page** (top 10 questions families ask about home care)
12. Add **service area landing pages** for Pittsburgh, Coraopolis, Allegheny County
13. Start a **blog** with monthly educational content for SEO
14. Add **staff/caregiver bios with photos** — the human element is everything in this industry
15. Integrate a **Google Reviews** widget
16. Add a **"Why Trinity vs. Other Agencies"** comparison section
17. Implement **schema markup** (LocalBusiness, FAQPage, Review)
18. Consider a **live chat widget** for immediate family inquiries
