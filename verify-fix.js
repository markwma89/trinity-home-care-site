const { chromium } = require('C:\\Users\\markw\\AppData\\Roaming\\npm\\node_modules\\playwright');
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, 'verify-screenshots');
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT);

// The CSS patch to apply
const CSS_PATCH = `
  @media (min-width: 1200px) { .nav-links { display: flex !important; } }
  @media (max-width: 1199px) { .nav-links { display: none !important; } }
  @media (min-width: 1200px) { .nav-hamburger { display: none !important; } }
  @media (max-width: 1199px) { .nav-hamburger { display: flex !important; } }
  @media (min-width: 1200px) { .nav-mobile { display: none !important; } }
  @media (max-width: 1199px) { .hero-content { max-width: 100% !important; } }
`;

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page    = await browser.newPage();
  await page.goto('https://trinityhomecarellc.com', { waitUntil: 'networkidle' });

  async function test(width, patched) {
    await page.setViewportSize({ width, height: 900 });
    await page.waitForTimeout(150);

    if (patched) await page.addStyleTag({ content: CSS_PATCH });

    const m = await page.evaluate(() => {
      const navLinks  = document.querySelector('.nav-links');
      const logo      = document.querySelector('.nav-logo');
      const ctaGroup  = document.querySelector('.nav-cta-group');
      const container = document.querySelector('.nav-container');
      const hamburger = document.getElementById('nav-hamburger');
      const hamStyle  = getComputedStyle(hamburger);
      const navStyle  = getComputedStyle(navLinks);
      const hamVisible = hamStyle.display !== 'none';
      const navVisible = navStyle.display !== 'none';
      if (!navVisible) return { navVisible: false, hamVisible };
      const nr   = navLinks.getBoundingClientRect();
      const lr   = logo.getBoundingClientRect();
      const cr   = ctaGroup.getBoundingClientRect();
      return {
        navVisible, hamVisible,
        gapLogoToNav: Math.round(nr.left - lr.right),
        gapNavToCta:  Math.round(cr.left - nr.right),
      };
    });

    const label = `${patched ? 'FIXED' : 'ORIG '} ${width}px`;
    if (!m.navVisible) {
      console.log(`  ✅ ${label} | hamburger mode (ham=${m.hamVisible})`);
    } else {
      const ok = m.gapLogoToNav >= 0 && m.gapNavToCta >= 0;
      console.log(`  ${ok?'✅':'❌'} ${label} | gap logo↔nav=${m.gapLogoToNav}px | gap nav↔cta=${m.gapNavToCta}px`);
    }

    await page.screenshot({ path: path.join(OUT, `${patched?'fixed':'orig'}-${width}.png`), clip: { x:0, y:0, width, height: 110 } });
  }

  console.log('─── BEFORE fix (live site) ───');
  for (const w of [1024, 1100, 1200, 1280, 1440]) await test(w, false);

  // Reload to get clean state, then inject fix
  await page.goto('https://trinityhomecarellc.com', { waitUntil: 'networkidle' });
  console.log('\n─── AFTER fix (CSS patched) ───');
  for (const w of [1024, 1100, 1200, 1280, 1440]) await test(w, true);

  await browser.close();
  console.log(`\nScreenshots: ${OUT}`);
})();
