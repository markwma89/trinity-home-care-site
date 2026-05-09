/**
 * Trinity Home Care — Footer credit review
 * Confirms "Website by FluxGrid Studio" is present, centered, and correctly
 * laid out on the live site at trinityhomecarellc.com.
 *
 * Run: node pw-footer-credit-review.mjs
 */
import { chromium } from 'file:///C:/Users/markw/AppData/Roaming/npm/node_modules/playwright/index.mjs';
import { mkdir }    from 'fs/promises';
import { existsSync } from 'fs';

const BASE = 'https://trinityhomecarellc.com';
const OUT  = './pw-screenshots/footer-credit';

const PAGES = [
  // Root pages
  { name: '01-homepage',      path: '/' },
  { name: '02-about',         path: '/about.html' },
  { name: '03-services',      path: '/services.html' },
  { name: '04-contact',       path: '/contact.html' },
  { name: '05-how-it-works',  path: '/how-it-works.html' },
  { name: '06-privacy',       path: '/privacy.html' },
  { name: '07-terms',         path: '/terms.html' },
  // Service pages
  { name: '08-companion-care',       path: '/services/companion-care.html' },
  { name: '09-personal-care',        path: '/services/personal-care.html' },
  { name: '10-dementia-care',        path: '/services/dementia-alzheimers-care.html' },
  { name: '11-veteran-care',         path: '/services/veteran-care.html' },
  { name: '12-respite-care',         path: '/services/respite-care.html' },
  // Mobile check
  { name: '13-homepage-mobile', path: '/', viewport: { width: 390, height: 844 } },
];

let passed = 0;
let failed = 0;
function ok(msg)   { console.log(`  ✓ ${msg}`); passed++; }
function fail(msg) { console.error(`  ✗ ${msg}`); failed++; }

async function run() {
  if (!existsSync(OUT)) await mkdir(OUT, { recursive: true });

  const browser = await chromium.launch({ headless: false, slowMo: 100 });

  for (const spec of PAGES) {
    const vp   = spec.viewport ?? { width: 1440, height: 900 };
    const ctx  = await browser.newContext({ viewport: vp });
    const page = await ctx.newPage();
    const tag  = `${spec.name} (${vp.width}px)`;

    await page.goto(`${BASE}${spec.path}`, { waitUntil: 'networkidle', timeout: 20000 });

    // ── 1. Credit element exists ────────────────────────────────────────────
    const credit = page.locator('.footer-credit');
    const exists = await credit.count() > 0;
    if (!exists) { fail(`${tag} — .footer-credit not found`); await ctx.close(); continue; }
    ok(`${tag} — .footer-credit present`);

    // ── 2. FluxGrid logo image loads ────────────────────────────────────────
    const img = credit.locator('img');
    const imgLoaded = await img.evaluate(el =>
      el.complete && el.naturalWidth > 0
    ).catch(() => false);
    imgLoaded ? ok(`${tag} — logo image loaded`) : fail(`${tag} — logo image broken`);

    // ── 3. Text content correct ─────────────────────────────────────────────
    const text = await credit.textContent();
    text.includes('FluxGrid Studio')
      ? ok(`${tag} — text "Website by FluxGrid Studio" present`)
      : fail(`${tag} — credit text missing or wrong: "${text.trim()}"`);

    // ── 4. Link href correct ────────────────────────────────────────────────
    const href = await credit.locator('a').getAttribute('href');
    href === 'https://fluxgridstudio.com/'
      ? ok(`${tag} — link href correct`)
      : fail(`${tag} — link href wrong: "${href}"`);

    // ── 5. Centered — credit link centered within its container ────────────
    const creditBox      = await credit.boundingBox();
    const footerBottom   = page.locator('.footer-bottom');
    const containerBox   = await footerBottom.boundingBox();
    const creditLinkBox  = await credit.locator('a').boundingBox();
    // The <a> inside should be centered within the footer-bottom container
    const containerCenterX = containerBox.x + containerBox.width / 2;
    const linkCenterX      = creditLinkBox.x + creditLinkBox.width / 2;
    const offset = Math.abs(linkCenterX - containerCenterX);
    offset < 40
      ? ok(`${tag} — centered (link offset ${Math.round(offset)}px from container center)`)
      : fail(`${tag} — NOT centered (link offset ${Math.round(offset)}px from container center)`);

    // ── 6. Below the legal nav ──────────────────────────────────────────────
    const legalNav = page.locator('.footer-legal');
    if (await legalNav.count() > 0) {
      const legalBox  = await legalNav.boundingBox();
      const creditTop = creditBox.y;
      creditTop > legalBox.y
        ? ok(`${tag} — credit is below legal nav`)
        : fail(`${tag} — credit is NOT below legal nav`);
    }


    // ── 7. Logo + text horizontal (same row) ────────────────────────────────
    const imgBox  = await img.boundingBox();
    const spanBox = await credit.locator('span').boundingBox();
    if (imgBox && spanBox) {
      const vertOverlap = imgBox.y < spanBox.y + spanBox.height &&
                          spanBox.y < imgBox.y + imgBox.height;
      vertOverlap
        ? ok(`${tag} — logo and text are on the same horizontal line`)
        : fail(`${tag} — logo and text are NOT on the same line`);
    }

    // ── Screenshot: scroll to footer and crop ───────────────────────────────
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(400);
    await credit.screenshot({ path: `${OUT}/${spec.name}-credit.png` });

    // Full footer-bottom screenshot for context
    if (await footerBottom.count() > 0) {
      await footerBottom.screenshot({ path: `${OUT}/${spec.name}-footer-bottom.png` });
    }

    await ctx.close();
  }

  await browser.close();

  console.log('\n══════════════════════════════════════════════════════════');
  console.log(`  Results: ${passed} passed, ${failed} failed`);
  console.log(`  Screenshots → ${OUT}/`);
  console.log('══════════════════════════════════════════════════════════\n');
  if (failed > 0) process.exit(1);
}

run().catch(err => { console.error(err); process.exit(1); });
