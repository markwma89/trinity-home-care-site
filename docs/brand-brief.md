# Brand Brief
## Trinity Home Care — Implementation-Ready Design System

This document defines the brand personality, visual system, and design direction for Trinity Home Care. All guidance is grounded in the actual logo assets, branding presentation, photography library, and Pittsburgh market positioning.

---

## Brand Personality

### Five Core Adjectives
These are not aspirational — they describe what the visual assets and brand concept already communicate. Every design decision should reinforce all five simultaneously.

1. **Warm** — The brand is human before it is professional. Warmth is the primary signal in every asset: the gold in the logo, the soft cream background tones, the natural-light photography. Cold, clinical, or corporate anything is a brand failure.
2. **Elevated** — Trinity is not a discount agency. The serif wordmark (Cormorant Garamond), the gold accent, and the navy anchor color all signal quality and care. Design decisions should default to restraint and refinement, not decoration.
3. **Trusted** — The brand earns confidence slowly and holds it permanently. The navy conveys stability and authority. Trust is never claimed — it is demonstrated through specificity, real names, real faces, and real numbers.
4. **Local** — Trinity is Pittsburgh. Not a franchise. Not a call center. Not a national brand with a local phone number. Every design element that signals "place" and "person" over "system" is an asset.
5. **Calm** — Families in crisis need to feel the opposite of crisis when they land on this site. No alarm colors, no flashing CTAs, no urgency mechanics. The brand presence should feel like a steady hand.

### Brand Voice Summary
Speak to the adult child (age 45–65) who is doing research late at night, carrying guilt and fear. Write like a trusted neighbor who happens to be an expert. Confident but never clinical. Warm but never sentimental. Specific but never overwhelming.

---

## Visual Tone

### Emotional Register
**Premium local care — the kind you'd recommend to a close friend.**

The visual tone sits in the specific space between:
- Too clinical (hospital branding, insurance companies)
- Too casual (a neighborhood flyer)
- Too corporate (national franchise sameness)
- Too sentimental (soft filters, script fonts, generic hand-holding stock)

The target aesthetic: **a respected local professional practice that genuinely cares about its community.** Think: a long-established architectural firm, a respected family-owned law practice, or a top-tier independent restaurant. Quality is obvious but never announced.

### Perceived Price Point
**Premium to upper-premium** — comparable to Comfort Keepers or TheKey, above Visiting Angels or Synergy, below the ultra-premium concierge care market. The brand should attract families who are willing to pay for quality and who need reassurance that the price is justified.

### Modernity Level
**Classic with modern execution.** Cormorant Garamond is a 16th-century typeface rendered at modern weights. Navy and gold are traditional colors used with contemporary spacing and typographic precision. The brand is not trendy — it will look appropriate in 2034. Avoid anything with an obvious "built in 2024" signature (glassmorphism, dark mode defaults, gradient mesh, oversized blobs).

---

## Color Direction

### Canonical Palette — UPDATED 2026-04-29

**The deployed CSS values are now authoritative.** The values below from the original planning document have been superseded by the actual implementation. Use the deployed values for all future work.

**Deployed (canonical — from `css/main.css`):**
```
Navy (Primary):    #213A5A   — dominant anchor; headers, footers, primary CTAs, key text
Teal (Secondary):  #5F8F95   — accent, icons, hover states, secondary buttons, supporting UI
Ivory (Base):      #F6F2EB   — primary background; section alternates; card backgrounds
Gold (Luxury):     #B89A5E   — logo accent, decorative elements, star ratings, premium callouts
White:             #FFFFFF   — text on dark backgrounds; card surfaces
```

**Original planning values (do not use for new work):**
```
Navy:   #1F3754   ← superseded by #213A5A
Teal:   #70A598   ← superseded by #5F8F95
Cream:  #F3EEEB   ← superseded by #F6F2EB (renamed Ivory in deployed system)
Slate:  #4E5A64   ← not used in deployed system; navy used for all text
Gold:   #B89A5E   ← unchanged
```

**Note:** The Slate neutral (#4E5A64) from the original brief is not present in the deployed CSS. Navy (#213A5A) is used for both brand surfaces and primary text. The `--color-text` token equals `--color-navy` exactly — if navy ever needs to shift, text color must be updated separately.

**Note on the 5th palette color:** The branding presentation shows a fifth swatch (dusty mauve/rose-gray, ~#99677A). This color is not implemented in the deployed CSS and should not be added without confirmation from the brand owner.

### How to Use Each Color

**Navy (#1F3754):**
- Navigation background
- Footer background
- "Why Trinity" / differentiator section background
- Final CTA section background
- H1 text on light backgrounds (cream or white)
- Primary button background

**Teal (#70A598):**
- Accent lines, dividers, icon fills
- Secondary button border and text (outlined style)
- Hover states on links and cards
- Trust strip icon fills
- Section accent elements
- Avoid as a large background color — it softens credibility when dominant

**Cream (#F3EEEB):**
- Page base background (preferred over pure white; warmer, more residential)
- Alternating section backgrounds
- Card and panel backgrounds
- Form field backgrounds

**Slate (#4E5A64):**
- Body text
- Secondary headings
- Captions and labels
- Muted metadata (dates, locations, categories)

**Gold (#B89A5E):**
- Logo accent color — use exactly as rendered in the logo assets
- Star ratings in testimonials and Google review display
- Select decorative line or border elements (not overused — one or two per page maximum)
- Premium badge or certification accents
- Never use as a large block background — it reads as flashy rather than premium

### Color Don'ts
- No pure black (#000000) text on any background — use slate or near-black only
- No bright orange, red, or electric blue — wrong emotional register entirely
- No generic healthcare teal (#00BCD4 territory) — that is competitor territory
- No heavy color gradients — they read dated and cheapen the brand
- Never place gold text on any background other than deep navy

---

## Typography Direction

### Confirmed Typeface Pairing

**Headings: Cormorant Garamond**
- Confirmed present in the branding presentation image
- Use at 400 (Regular) and 600 (SemiBold) weights; avoid 700+ (too heavy for this face)
- Set all H1/H2 in Cormorant Garamond; H3 and below may use Inter SemiBold for clarity at smaller sizes
- Appropriate for: headlines, section titles, testimonial pull quotes, taglines
- Avoid for: body copy, navigation, form labels, small UI text (readability degrades under 20px)

**Body and UI: Inter**
- Confirmed present in the branding presentation image
- Use at 400 (Regular) and 500 (Medium) for body; 600 (SemiBold) for UI labels and button text
- Appropriate for: all body copy, navigation, buttons, form elements, captions, metadata

**Tagline treatment:**
- "Care You Can Trust. Comfort at Home." — always set in Inter or Cormorant Garamond Light Italic
- Never stylize or distort the tagline — render as-is

### Type Scale

| Level | Font | Weight | Desktop | Mobile | Line Height |
|-------|------|--------|---------|--------|-------------|
| H1 | Cormorant Garamond | 400 | 56–64px | 36–42px | 1.1 |
| H2 | Cormorant Garamond | 400 | 38–44px | 28–34px | 1.15 |
| H3 | Cormorant Garamond or Inter SemiBold | 600 | 26–30px | 22–26px | 1.2 |
| H4 | Inter | 600 | 18–20px | 17–18px | 1.3 |
| Body Large | Inter | 400 | 18px | 17px | 1.75 |
| Body | Inter | 400 | 16–17px | 16px | 1.7 |
| Caption | Inter | 500 | 13–14px | 13px | 1.5 |
| Button | Inter | 600 | 15–16px | 15px | — |
| Label | Inter | 500 (uppercase) | 12–13px | 12px | — |

### What to Avoid
- No decorative script fonts — too soft, too low-contrast, accessibility failures
- No geometric sans-serifs (Futura, Montserrat, Raleway) — they read corporate/startup, not care
- No condensed type in any context
- No all-caps in headings — defeats the elegance of Cormorant Garamond
- No light-weight Inter (300) at body sizes on cream backgrounds — fails contrast requirements

---

## UI Direction

### Button System

**Primary Button (Navy):**
- Background: #1F3754
- Text: #FFFFFF, Inter SemiBold
- Border radius: 6–8px (not pill, not fully square)
- Padding: 14px 28px desktop / 12px 24px mobile
- Hover: slightly lighter navy (#2A4A6B or similar), no border change
- Use for: "Get a Free Care Assessment," "Contact Us," primary form submission

**Secondary Button (Outlined Teal):**
- Background: transparent
- Border: 2px solid #70A598
- Text: #70A598, Inter SemiBold
- Hover: fill with #70A598, text to white
- Use for: "See Our Services," "Learn More," "View All Services"

**Ghost Button (White on Dark):**
- Background: transparent
- Border: 2px solid #FFFFFF
- Text: #FFFFFF, Inter SemiBold
- Hover: fill white, text to navy
- Use for: CTAs within the navy footer or dark green sections

**CTA Text Link:**
- Color: #70A598
- Underline on hover only
- Arrow icon after text: →
- Use for: "Learn More →" within service cards, inline navigation prompts

### Card System

**Service Card:**
- Background: #FFFFFF
- Border: 1px solid rgba(31, 55, 84, 0.1) — very subtle navy tint
- Border radius: 10–12px
- Shadow: 0 2px 12px rgba(31, 55, 84, 0.08)
- Hover: slight lift (translateY -2px), shadow deepens
- Icon area: teal (#70A598) on cream (#F3EEEB) background

**Testimonial Card:**
- Background: #FFFFFF
- Left border accent: 3px solid #B89A5E (gold)
- No outer drop shadow — use subtle border instead
- Quote text: Cormorant Garamond Italic, 20–22px
- Attribution: Inter 500, slate (#4E5A64)

**Stat/Trust Strip Block:**
- Background: transparent (inherits section bg)
- Number: Cormorant Garamond SemiBold, 40–48px, navy
- Label: Inter 500, 14px, uppercase, slate or teal
- Divider between blocks: 1px solid rgba(31, 55, 84, 0.15)

### Spacing System
- Base unit: 8px
- Section vertical padding: 96px desktop / 64px mobile
- Content max-width: 1200px (1280px max)
- Grid columns: 12 (desktop), 4 (mobile)
- Grid gutter: 28px desktop / 16px mobile
- Card padding: 32px desktop / 24px mobile

### Border Radius Direction
- Buttons: 6–8px
- Cards: 10–12px
- Images in cards: 8px
- Input fields: 6px
- No pill buttons for primary CTAs (too casual); pill style acceptable only for tags/badges

### Iconography
- Line-style icons, 1.5–2px stroke weight
- Icon size in service cards: 28–32px in a 56–64px container
- Container fill: #F3EEEB (cream); icon stroke: #70A598 (teal)
- Do not use filled/solid icons — they read too heavy against the refined typography
- No emoji as functional UI elements

---

## Image and Video Direction

### Photography Philosophy
**Real warmth over performed warmth.** The existing photography library is strong. Use it selectively. The best images (Tier 1) show caregiver-client connection in genuine domestic moments — not clinical settings, not posed smiles, not stock perfection.

### Image Treatment
- Color temperature: warm (amber tones elevated, not desaturated or filtered blue)
- Brightness: slightly elevated — never moody, never dark
- No heavy color grading, no filters, no duotones
- No vignetted edges
- No stock images that appear on competitor sites (check the `do not use` list in asset-audit.md)
- No medical imagery on homepage or service overview pages

### Hero Image Specification
- Format: 16:9 or 3:2, minimum 1920px wide
- Subject: caregiver + client in a domestic moment — no hospital or clinical setting
- Mood: warm, genuine, connected — not posed, not performative
- Text overlay zone: left 50% of the frame should have compositional breathing room
- Color overlay (if needed for text contrast): warm navy at 35–45% opacity maximum — never full darkening
- **Current gap:** No hero-format image exists in the library (see asset-audit.md Issue 7)

### Image Placement by Page Section

| Section | Image Approach |
|---------|---------------|
| Hero | Full-bleed background, warm overlay for text legibility |
| Why Trinity / Differentiator | Supporting portrait: teal-scrubs caregiver (steven_*c977 or f2de) |
| Testimonials | Initials avatars (no photos available); client name + relationship only |
| How It Works | Small contextual illustrations or icons (not photos — process should be diagrammatic) |
| Services Grid | Icon-based cards (not photos in the grid itself) |
| Individual Service Pages | One featured photo per page; pull from Tier 2 photography by relevance |
| Companion Care page | `54-1.jpg` or `AdobeStock_121383067` |
| Medication Reminders page | `medication_reminders-copy.jpg` |
| Light Housekeeping page | `light_house_keeping-copy.jpg` |
| Personal Care page | `AdobeStock_124636699` |
| Post-Hospital Recovery page | `AdobeStock_515377933` |
| About / Meet Our Team | AI-generated caregiver headshots are usable for caregiver cards — do not label as specific named employees until real photos are obtained |
| Contact / Final CTA | Owner photo placeholder until real photo is available; use warm abstract background in the interim |

### Photography Gaps Requiring Action (Priority Order)
1. Transparent logo files (blocks all photography placement decisions in header/footer)
2. Hero-format wide image — Pittsburgh market or domestic warm interior
3. Owner/real staff portraits — most urgent for About and CTA sections
4. Adult child + elderly parent photograph — the primary audience representation gap

---

## Implementation Notes for Web Design

### Pre-Build Checklist

Before writing any CSS, confirm the following asset questions are resolved with the brand owner:
- [ ] Transparent logo PNG (stacked and horizontal) — **required before header can be built**
- [ ] White/reversed logo version — **required before footer can be built**
- [ ] Exact hex for the 5th palette swatch (dusty mauve from branding presentation)
- [ ] Owner name, phone number, and service area zip codes for copy
- [ ] Whether any real Google reviews exist yet (affects testimonials section)

### CSS Architecture Notes

**Recommended CSS custom properties (design tokens):**
```css
:root {
  /* Colors */
  --color-navy:     #1F3754;
  --color-teal:     #70A598;
  --color-cream:    #F3EEEB;
  --color-slate:    #4E5A64;
  --color-gold:     #B89A5E;
  --color-white:    #FFFFFF;
  --color-bg:       #F3EEEB;
  --color-text:     #1F3754;
  --color-text-sub: #4E5A64;

  /* Typography */
  --font-heading:   'Cormorant Garamond', Georgia, serif;
  --font-body:      'Inter', system-ui, sans-serif;

  /* Spacing */
  --space-section-desktop: 96px;
  --space-section-mobile:  64px;
  --content-max-width:     1200px;
  --grid-gutter:           28px;

  /* Radius */
  --radius-btn:    7px;
  --radius-card:   12px;
  --radius-input:  6px;
}
```

### Section Background Rotation

The alternating section pattern prevents visual monotony without images in every section:
```
Hero           → photographic background + navy overlay
Trust Strip    → cream (#F3EEEB)
Services Grid  → white (#FFFFFF)
Why Trinity    → navy (#1F3754) — white text
Testimonials   → cream (#F3EEEB)
How It Works   → white (#FFFFFF)
Family Section → warm photo (left) + white (right) split
Certifications → white (#FFFFFF) — greyscale logos
Caregivers     → cream (#F3EEEB)
Final CTA      → navy (#1F3754) — white text
Footer         → navy (#1F3754) — white text
```

Never place two cream sections or two navy sections adjacent without a white or image section between them.

### Google Fonts Load
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
```

### Logo Placeholder Strategy (Until Transparent Files Are Delivered)
Until transparent logo assets are produced, use one of the following interim approaches:
1. **CSS background removal:** The gold background in the existing PNGs is consistent enough that CSS `mix-blend-mode: multiply` on a navy or green background will partially eliminate the gold rectangle artifact for internal prototyping only.
2. **Branding presentation icon crop:** The bottom-right quadrant of `Trinity Home Care branding presentation.png` shows the icon mark on a clean white background — crop and use at 1:1 aspect ratio as a temporary favicon source.
3. **Never ship the gold-background logo as a production asset** — it will degrade every page where it appears.

### Mobile-First Considerations
- Navigation: hamburger menu below 768px; logo horizontal locked in header
- Hero: on mobile, background image should be lower-positioned to favor face visibility; heading drops to 36–40px
- Service cards: single column below 640px; 2-column between 640–1024px; 3-column above 1024px
- Phone number: tap-target minimum 48px height; always `href="tel:..."` linked
- Final CTA form: stack to single column below 768px; form first, contact info second

### Accessibility Minimums
- All text on cream (#F3EEEB) backgrounds must use navy (#1F3754) or slate (#4E5A64) — both pass WCAG AA at body sizes
- Gold (#B89A5E) text on white fails WCAG AA below 18px — do not use gold as body text color
- Teal (#70A598) on white is borderline at small sizes — always pair with a weight of 500+ or use only for decorative accents
- All photography must have descriptive alt text (not "caregiver image" — but "Caregiver and senior woman sharing tea at kitchen table")
- Focus states must be visible: use `outline: 2px solid #70A598; outline-offset: 3px` minimum

### Performance Notes
- Load Cormorant Garamond with `font-display: swap` to prevent invisible text on slow connections
- Hero image: serve in WebP format, 1920px wide, compressed under 300KB
- Lazy-load all photography below the fold
- No carousels that autoplay without pause controls (accessibility requirement)

---

## Brand Dos and Don'ts

### Do
- Use Cormorant Garamond for H1 and H2 — it is the single clearest signal of brand premium
- Show the phone number in the header, hero, and footer — it is the #1 conversion element
- Use cream (#F3EEEB) as the default page background — never pure white
- Name the caregiver in every caregiver photo you display
- Write to the adult child, not to the senior
- Use real numbers wherever possible: years of service, clients served, review count
- Let the gold accent be rare — one or two uses per page, never decorative wallpaper

### Don't
- Place the existing logo PNGs (with gold gradient background) on any live page surface
- Use teal as a dominant background color — it reads like a dental practice
- Write generic headlines ("Compassionate care in the comfort of your home") — every competitor uses them
- Add medical imagery to the homepage (wheelchairs in clinical settings, stethoscopes, hospital rooms)
- Use `laundry_services.jpg` anywhere on the site — it signals the wrong service category
- Display the somber window-gazing image (`AdobeStock_277841044`) on homepage or service pages
- Use AI-generated caregiver headshots labeled with specific real names — confirm authenticity first
- Add more than two CTAs of equal visual weight to any single screen
