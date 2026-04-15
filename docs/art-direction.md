# Art Direction
## Trinity Home Care — Digital Experience Direction

---

## Emotional Tone

**Primary register:** Calm, earned confidence.
The visitor arrives in a state of anxiety — guilt, urgency, fear of making the wrong choice for a parent. The design must resolve that anxiety within three seconds. Not by being cheerful or corporate, but by being *steady*. The brand should feel like a trusted professional who has seen this before and knows exactly what to do.

**Secondary register:** Warmth without sentimentality.
The photography and typography communicate genuine human care, not greeting-card softness. Warmth is communicated through warm color temperature, generous line height, serif headlines, and photography of real human connection — not through excessive softness, pastel palettes, or script fonts.

---

## Visual Energy Level

**Moderate.** Not minimal to the point of coldness; not busy to the point of overwhelm. The page breathes. Each section has one job and executes it without competing with adjacent sections. Sections alternate between light (ivory, white) and dark (navy) to create rhythm without relying on imagery at every break.

---

## Contrast

**High in the hero and CTA sections.** Deep navy background + white typography = unambiguous authority. The warm ivory (#F6F2EB) background creates soft contrast against white cards — not clinical, not flat.

**Low contrast used deliberately** for secondary text, captions, and metadata — guiding the eye without demanding it.

---

## Density vs. Airiness

**Airy.** Maximum three columns on desktop. Section vertical padding is generous (96px desktop). Headlines are never cramped. The hero has open sky above the text. Cards have 32px internal padding. Whitespace is active, not absent — it communicates premium.

---

## Softness vs. Sharpness

**Slightly soft.** 12px border radius on cards, no hard borders, gentle drop shadows. But typography is sharp and confident — Cormorant Garamond is an editorial serif with precise stroke contrast. The brand is warm but not apologetic.

---

## Warmth vs. Coolness

**Warm.** Page background is ivory (#F6F2EB), not white. Photography uses warm natural light (elevated amber tones). The navy is a warm navy (blue-indigo base, not blue-gray). The gold accent (#B89A5E) is the warmest element in the palette — used sparingly, like a candle in a room.

Avoid cool blues, pure gray neutrals, or desaturated photography. The brand does not belong in a hospital corridor.

---

## Realism vs. Stylization

**Realist.** Real photography of real human moments. No illustration, no iconography that reads as medical clipart, no abstract geometric representations of care. The iconography (service icons) is line-weight SVG — clean and neutral, not expressive.

---

## Motion Style

**Subtle. Respectful. Purposeful.**

- Hero entrance: staggered fade-up on page load (CSS only, no JS required). Each hero element enters 200ms after the previous. Total sequence: ~1.2s. Creates the sense of a page that *arrives* with intention.
- Scroll reveals: fade-up (18px translateY, 0.6s ease). Triggered by IntersectionObserver. One element or a staggered group per section.
- Card hover: translateY(-3–4px) + shadow deepens. 0.26s ease. Communicates interactivity without drama.
- Nav transition: transparent over hero → ivory background, 0.26s ease on scroll.
- No autoplay carousels. No parallax. No entrance chaos.
- All motion respects `prefers-reduced-motion: reduce`.

---

## Typography Attitude

**Editorial premium.** Cormorant Garamond is the unmistakable brand voice — wide, generous, unhurried. It announces quality before a single word is read. Use it for H1, H2, testimonial quotes, and select pull quotes. Never condense it. Never all-caps it. Never use it below 18px.

Inter is the workhorse: precise, legible, accessible. Used for body copy, navigation, buttons, form labels, and all UI text. At 17px, 1.75 line height, it communicates clarity and trust.

The contrast between serif headline and sans body is itself a brand signature — premium brands use this pairing (editorial, legal, financial) and home care rarely does. It creates instant visual differentiation from every franchise competitor.

---

## Image Treatment

- Natural color temperature. Warm, slightly elevated brightness.
- No heavy filters, no duotones, no dark overlays that suppress faces.
- No desaturation. No blue-tinted or clinically cold treatment.
- Hero image: full-bleed background with a left-to-right navy gradient overlay (heavy left for text, light right to reveal the photo).
- Service cards: icons only (no photos in service grid cards).
- Testimonials: initial-avatar circles (navy text on sage background) — no fabricated portrait photos.

---

## Shape Language

- Cards: 12px border radius. Not pill, not fully square.
- Buttons: 6–7px border radius. Slightly softer than sharp, slightly firmer than rounded.
- Process step markers: perfect circles (60×60px), navy fill.
- Gold hairline rules (1.5px, 48px wide) beneath key section headings — a restrained luxury signal.
- No blobs, no organic abstract shapes, no mesh gradients.

---

## Section Rhythm

```
Hero                 → Full-bleed photo, heavy navy gradient, high drama
Stats Strip          → Navy fill, white type, 4 social-proof numbers
Why Trinity          → White fill, 3 feature cards on ivory
Services Grid        → Ivory fill, 6 clean service cards on white
How It Works         → White fill, 3-step process with horizontal connector
Testimonials         → Ivory fill, 3 quoted cards with gold top accent
Contact / Final CTA  → Navy fill, form + contact info side by side
Footer               → Deep navy, white type, 4-column layout
```

Never two navy sections adjacent without a light section between them.

---

## Layout Characteristics

- Max content width: 1200px, centered, 2rem side padding.
- Grid: 12 columns desktop, 4 mobile. Gutters 28px.
- Cards: 3 columns (1024px+), 2 columns (640–1023px), 1 column (mobile).
- Hero content: left-aligned on desktop (max 62% width), centered on mobile.
- Process steps: 3 columns desktop with a connecting horizontal rule, stacked on mobile.
- Contact section: 2 equal columns desktop, stacked mobile.

---

## Button Personality

- **Primary (light bg):** Navy fill, white text, 6px radius. Hover: slightly darker navy. Generous padding (14px 28px).
- **Primary (dark bg):** Ivory fill, navy text. Hover: pure white fill. Stands out warmly against navy.
- **Secondary:** Transparent, navy border, navy text. Hover: navy fill, white text. Understated, professional.
- **Phone/ghost (dark bg):** Transparent, white border, white text. Hover: subtle white tint fill.
- **Teal CTA:** Teal fill, white text. Used for nav CTA and form submit. A distinctly actionable color.

Never more than 2 CTAs of equal visual weight on the same screen view.

---

## Card Treatment

Service cards: white background, 1px subtle border, 12px radius, 2px shadow. Icon area: 52×52px cream background tile with teal SVG icon. Hover: lift 3px, shadow deepens. Cursor pointer.

Why Trinity cards: ivory background, matching border, same radius. Icon area: 56×56px navy background with gold SVG icon. More substantial — communicates the brand differentiators with authority.

Testimonial cards: white, 12px radius, subtle shadow, 3px gradient top accent (gold → teal, 60% opacity). Quote in Cormorant Garamond Italic. Attribution in Inter, slate color.

---

## Negative Space

Used as a premium signal throughout. No section feels stuffed. Section headings are followed by 56–64px of space before the grid begins. The hero eyebrow has breathing room above and below. Process steps are vertically generous.

---

## Overlays, Gradients, Texture

- Hero: directional gradient (110° angle, navy 92% at left → 20% at right). Warm and readable, not dark.
- Contact section: subtle teal radial glow in the top-right corner (8% opacity). Adds depth without distracting.
- No grain texture. No glassmorphism (except the contact form panel which uses a frosted glass card on navy — appropriate at that opacity level).
- Footer: solid deep navy (#172B44). No gradient needed — clean and grounding.

---

## Implementation Priority

1. Get the typography right first — the serif/sans pairing is the most visible brand decision.
2. The gold hairline rule under key section headings is non-negotiable — it is the signature detail.
3. Ensure the hero gradient does not obscure the photograph on the right side. Test on 1440px+ wide displays.
4. The mobile CTA bar (fixed bottom, phone + schedule) is essential — it is the primary conversion mechanism for mobile visitors.
5. Transparent logo PNG is required for production. Use SVG trefoil placeholder until delivered.
