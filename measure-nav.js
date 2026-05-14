const { chromium } = require('C:\\Users\\markw\\AppData\\Roaming\\npm\\node_modules\\playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://trinityhomecarellc.com', { waitUntil: 'networkidle' });

  async function measure(width) {
    await page.setViewportSize({ width, height: 900 });
    await page.waitForTimeout(200);
    return await page.evaluate(() => {
      const navLinks  = document.querySelector('.nav-links');
      const logo      = document.querySelector('.nav-logo');
      const ctaGroup  = document.querySelector('.nav-cta-group');
      const container = document.querySelector('.nav-container');
      if (!navLinks) return { navVisible: false };
      const nr   = navLinks.getBoundingClientRect();
      const lr   = logo.getBoundingClientRect();
      const cr   = ctaGroup.getBoundingClientRect();
      const conr = container.getBoundingClientRect();
      return {
        navVisible:      getComputedStyle(navLinks).display !== 'none',
        navWidth:        Math.round(nr.width),
        gapLogoToNav:    Math.round(nr.left - lr.right),
        gapNavToCta:     Math.round(cr.left - nr.right),
        logoWidth:       Math.round(lr.width),
        ctaWidth:        Math.round(cr.width),
        containerWidth:  Math.round(conr.width),
      };
    });
  }

  for (const w of [1024, 1100, 1200, 1280, 1366, 1440, 1600]) {
    const m = await measure(w);
    if (!m.navVisible) { console.log(`${w}px: desktop nav hidden (hamburger mode)`); continue; }
    const ok = m.gapLogoToNav >= 0 && m.gapNavToCta >= 0;
    console.log(`${ok ? '✅' : '❌'} ${w}px | nav=${m.navWidth}px | gap logo↔nav=${m.gapLogoToNav}px | gap nav↔cta=${m.gapNavToCta}px | logo=${m.logoWidth}px | cta=${m.ctaWidth}px | container=${m.containerWidth}px`);
  }

  await browser.close();
})();
