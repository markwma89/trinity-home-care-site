# Asset Audit
## Trinity Home Care — Brand Asset Inventory & Readiness Review

---

## Asset Inventory

### LOGO ASSETS (`/assets/logo/`)

| File | Description | Format | Status |
|------|-------------|--------|--------|
| `Trinity Home Care logo design.png` | Stacked/vertical logo (symbol above wordmark + tagline) | PNG on gold gradient background | ⚠️ Not web-ready |
| `Trinity Home Care logo design (1).png` | Horizontal logo (symbol left, wordmark + tagline right) | PNG on gold gradient background | ⚠️ Not web-ready |
| `Trinity Home Care branding presentation.png` | Full brand system board (logo, palette, typography, mockup) | PNG composite image | ✅ Reference only |

**No SVG, no transparent PNG, no dark/reversed variant, no favicon.** See Critical Issues below.

---

### PHOTOGRAPHY ASSETS (`/assets/images/`)

| File | Subject | Quality | Recommended Use |
|------|---------|---------|----------------|
| `AdobeStock_530217957.jpeg` | Caregiver holding client's hands, warm home interior, soft natural light, emotional moment | ★★★★★ | Hero, testimonial section, emotional CTA section |
| `AdobeStock_354250038.jpeg` | Caregiver and senior woman smiling face-to-face, natural window light, warm and genuine | ★★★★★ | Homepage hero, About, Why Trinity |
| `AdobeStock_572805905.jpeg` | Caregiver and senior woman reviewing paperwork on sofa, natural sunlit home, warm atmosphere | ★★★★★ | How It Works, consultation/assessment section |
| `54-1.jpg` | Caregiver and senior woman reading together on sofa, sharing a tea cup, very warm and domestic | ★★★★★ | Companion Care service page, homepage emotional section |
| `steven_aggressive_solutions_home_care_nurse_c977-copy.jpg` | Female caregiver headshot in teal scrubs, genuine warm smile, home interior bokeh background | ★★★★☆ | Staff/caregiver profile, About page |
| `steven_aggressive_solutions_home_care_nurse_f2de-copy.jpg` | Female caregiver headshot in navy scrubs with glasses, confident professional expression | ★★★★☆ | Staff/caregiver profile, About page |
| `AdobeStock_121383067.jpeg` | Group scene — two seniors and a caregiver outdoors sharing tablet, genuine laughter | ★★★★☆ | Companion Care, social engagement, community section |
| `AdobeStock_572805915-copy.jpeg` | (Variant of 572805905 or alternate crop) | ★★★★☆ | Secondary use alongside primary |
| `home_care_assisantance.jpg` | Caregiver crouching to talk with seated senior outdoors, connected body language | ★★★★☆ | Services overview, companion care |
| `AdobeStock_124636699.jpeg` | Caregiver holding senior's hand in wheelchair outdoors, garden setting, sunny | ★★★★☆ | Personal care, about, emotional section |
| `ourservices-copy-scaled.jpg` | Caregiver and senior woman reading/sharing on sofa with tea, bright home interior | ★★★★☆ | Services overview page hero |
| `medication_reminders-copy.jpg` | Caregiver showing medication to senior woman in chair — clear task context | ★★★☆☆ | Medication reminders service card/page |
| `AdobeStock_143418179.jpeg` | (Not yet inspected — likely similar care context) | Unreviewed | Supplemental |
| `AdobeStock_180542045.jpeg` | Senior woman with cane being supported by caregiver in white coat, clinical feel | ★★★☆☆ | Personal care page (secondary); too clinical for homepage |
| `AdobeStock_506407673.jpeg` | Caregiver assisting elderly man with physical care — focused, attentive | ★★★☆☆ | Personal/specialized care pages |
| `AdobeStock_515377933.jpeg` | Male caregiver in blue scrubs helping man with walker — clinical/rehab feel | ★★★☆☆ | Post-hospital recovery page; not homepage |
| `AdobeStock_534939175-1536x1024.jpeg` | Caregiver with senior indoors, appears assessment/conversation context | ★★★☆☆ | How It Works step illustration |
| `uhgfd.jpg` | Caregiver in white assisting senior man with exercise/stretch on floor | ★★★☆☆ | Specialized care, rehabilitation support |
| `light_house_keeping-copy.jpg` | Young woman in blue scrubs cleaning a window — caregiver context visible | ★★★☆☆ | Light housekeeping service card (adequate) |
| `AdobeStock_277841044.jpeg` | Male patient in wheelchair and female caregiver both gazing quietly out a window | ★★☆☆☆ | Avoid — mood is somber/melancholic, wrong for homepage |
| `laundry_services.jpg` | Blonde woman in blue casual clothes holding a laundry basket, smiling | ★★☆☆☆ | Do not use — reads as a cleaning service ad, no senior or care context |
| `bathing_assistance-1.jpeg` | Senior woman in wheelchair in bathroom setting, caregiver attending | ★★☆☆☆ | Bathing/personal care page only; low resolution, institutional bathroom |
| `AdobeStock_124636699-copy.jpeg` | Duplicate/variant of 124636699 | Same as above | Use primary; discard copy |
| `54-1-copy.jpg` | Duplicate/variant of 54-1 | Same rating | Discard; use original |
| `medication_reminders-copy-2-1.png` | Variant of medication reminders | Same | Consolidate |

---

## Critical Issues — Logo

### Issue 1: No Transparent Logo File — BLOCKING
**Both logo PNG files are embedded in a gold metallic gradient background.** They cannot be placed on any web surface — white, navy, cream, or photographic — without displaying the gold rectangle artifact. This is the single most critical gap.

**What this prevents:** Every logo placement on the website — header, footer, favicon, og:image, email signature — requires a transparent or isolated version.

**What is needed:**
- [ ] Logo on transparent background (PNG, 2x resolution minimum)
- [ ] SVG version of the wordmark
- [ ] SVG version of the icon mark only

### Issue 2: No SVG Source Files
All logo files are PNGs. PNGs cannot scale without quality loss. The header, retina displays, and any print usage will degrade. SVG is the required format for all web logos.

### Issue 3: No Dark/Reversed Variant
There is no white version of the logo for use on the navy footer, dark hero overlays, or dark social images. Without a white reversed logo, dark backgrounds must be avoided — limiting the design significantly.

### Issue 4: No Favicon
No `.ico`, `.svg`, or `192×192 PNG` favicon exists. The icon mark exists in the branding presentation (clean, isolated on white background) — this should be exported as a favicon set.

### Issue 5: No One-Color Versions
No black-only or navy-only version exists for:
- Letterhead and print
- Embossed/embroidery use
- Fax headers or black-and-white documents

### Issue 6: Palette Discrepancy
The branding presentation image shows hex codes: `#1F3754`, `#70A598`, `#F3EEEB`, `#4E5A64`, and a fifth color (appears to be a neutral grayish tone around `#99677A` or similar dusty mauve).

The brand concept document specifies: `#213A5A`, `#5F8F95`, `#C7D8D3`, `#F6F2EB`, `#C8C3BA`, `#B89A5E`.

These are close but not identical. The **branding presentation is the authoritative visual source** — the hex values shown in that document should be confirmed by sampling the actual presentation swatches at pixel level, and one canonical palette file should be created.

---

## Critical Issues — Photography

### Issue 7: No Hero-Format Wide Image
No image in the library is formatted for a full-bleed hero section (16:9 or wider, 1920px+ width, with safe compositional space for text overlay). The closest candidates — `AdobeStock_530217957` and `AdobeStock_354250038` — are square or 4:3 format. They can be used with creative cropping and overlay but are not optimized for hero use.

### Issue 8: No Local Pittsburgh Photography
The brand mockup explicitly uses Pittsburgh as a geographic identifier and features the Pittsburgh bridges. None of the current photography assets show any Pittsburgh context. This matters for local SEO credibility and the "local" positioning against national franchise competitors.

**Needed:** At least one Pittsburgh-relevant background image (skyline, bridge, neighborhood, or subtle local reference) for use in the hero or a location-specific section.

### Issue 9: No Adult Child / Family Decision-Maker Photography
The primary conversion audience is adult children (age 45–65) researching care for a parent. None of the current images show this dynamic — an adult child visiting a parent, a family conversation about care, or a grown child with an elderly parent. Every image shows a caregiver + senior, missing the family trust moment.

### Issue 10: No Owner or Team Photography
There are two AI-generated caregiver headshots (the `steven_*` files) but no real owner photo, no team group shot, and no branded staff portraits. Local trust is built through real people with names — this is a content gap that affects the About page and the Contact/CTA section.

### Issue 11: `laundry_services.jpg` — Do Not Use
This image depicts a young woman in casual clothing carrying laundry. No senior, no caregiver uniform, no care context. It reads as a cleaning service or home goods ad. Using this image on a home care website will undermine professional credibility.

### Issue 12: `AdobeStock_277841044.jpeg` — Avoid for Homepage
Both subjects (caregiver and client) are gazing quietly out a window. The mood is introspective and somber — it does not convey the warmth, connection, or reassurance that the homepage needs. Reserve for editorial/blog use only if needed.

---

## Missing Assets — Full List

| Asset | Priority | Notes |
|-------|----------|-------|
| Logo — transparent PNG (stacked) | 🔴 Critical | Required for every web placement |
| Logo — transparent PNG (horizontal) | 🔴 Critical | Required for header |
| Logo — SVG (icon mark only) | 🔴 Critical | Favicon, header, social profile |
| Logo — SVG (full wordmark) | 🔴 Critical | Scalable web use |
| Logo — white reversed version | 🔴 Critical | Dark backgrounds, footer |
| Logo — navy one-color version | 🟠 High | Print, letterhead |
| Favicon set (16, 32, 180, 192px) | 🔴 Critical | Browser tab, mobile bookmark |
| og:image / social share card | 🟠 High | Social sharing, link previews |
| Hero-format wide photography | 🔴 Critical | Homepage hero section |
| Pittsburgh / local photography | 🟠 High | Local trust, SEO credibility |
| Adult child + senior family photo | 🟠 High | Primary audience representation |
| Owner / real staff portraits | 🟠 High | About page, contact section |
| Canonical hex color palette file | 🟡 Medium | Design system consistency |
| Icon set (services, process steps) | 🟡 Medium | Services grid, How It Works |
| Email signature template | 🟡 Medium | Business communication |
| Business card / print template | 🟢 Low | Physical materials |
| Brand board (single-sheet PDF) | 🟢 Low | Handoff reference |

---

## Recommended Use of Each Existing Asset

### Logo Files
- `logo design.png` (stacked) — Reference only until transparent version is produced. Use to understand proportions and placement of the stacked configuration.
- `logo design (1).png` (horizontal) — Reference only. This is the correct header orientation once the transparent version exists.
- `branding presentation.png` — Use as the brand system reference and design direction document. The clean white-background icon visible in the bottom-right corner should be cropped and used as the favicon source until the proper SVG is ready.

### Photography — Tier 1 (Homepage-Ready)
These five images can be used immediately in high-visibility positions:
1. `AdobeStock_530217957` — Emotional hero candidate; caregiver/client hand-holding moment
2. `AdobeStock_354250038` — Smiling caregiver/client face-to-face; homepage emotional section
3. `AdobeStock_572805905` — Consultation scene; How It Works, assessment step
4. `54-1.jpg` — Domestic warmth; companion care, homepage mid-section
5. `home_care_assisantance.jpg` — Connection scene outdoors; services page

### Photography — Tier 2 (Service Pages)
Use for individual service pages, not homepage:
- `medication_reminders-copy.jpg` → Medication reminders page
- `light_house_keeping-copy.jpg` → Light housekeeping page
- `AdobeStock_121383067` → Companion care, social engagement
- `AdobeStock_124636699` → Personal care, wheelchair/outdoor
- `bathing_assistance-1` → Bathing assistance page (small/low-res — use only if nothing better is available)
- `uhgfd.jpg` → Rehabilitation/exercise support
- `AdobeStock_515377933` → Post-hospital recovery page
- `AdobeStock_506407673` → Personal/specialized care

### Staff Portraits (Caregiver Section)
- `steven_*c977` — Usable as a caregiver profile headshot (teal scrubs, warm smile)
- `steven_*f2de` — Usable as a second caregiver profile headshot (navy scrubs, professional)
- Note: Both appear AI-generated — verify authenticity before labeling as "Our Caregivers"

### Do Not Use (On Main Site)
- `laundry_services.jpg` — No care context; risks misrepresenting the service
- `AdobeStock_277841044` — Somber mood; not for homepage or primary pages
- All `*-copy` and duplicate files — Consolidate; use the originals only
