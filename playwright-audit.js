const { chromium } = require('C:\\Users\\markw\\AppData\\Roaming\\npm\\node_modules\\playwright');
const fs = require('fs');
const path = require('path');

const BASE = 'https://trinityhomecarellc.com';
const OUT  = path.join(__dirname, 'audit-screenshots');
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT);

const findings = [];
function log(level, area, msg) {
  const entry = { level, area, msg };
  findings.push(entry);
  console.log(`[${level}] [${area}] ${msg}`);
}

async function auditPage(page, label, url, isMobile) {
  const consoleErrors = [];
  const networkErrors = [];
  const brokenImages  = [];

  page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  page.on('pageerror', e => consoleErrors.push(e.message));
  page.on('response', r => { if (!r.ok() && r.request().resourceType() !== 'document') networkErrors.push(`${r.status()} ${r.url()}`); });

  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);

  // Screenshot
  const slug = label.replace(/[^a-z0-9]/gi, '-').toLowerCase();
  await page.screenshot({ path: path.join(OUT, `${slug}.png`), fullPage: true });

  // Console errors
  if (consoleErrors.length) {
    consoleErrors.forEach(e => log('ERROR', `${label} / Console`, e));
  } else {
    log('OK', `${label} / Console`, 'No JS errors');
  }

  // Network errors (ignore analytics/tracking noise)
  const sigNetErrors = networkErrors.filter(e => !e.includes('google') && !e.includes('analytics') && !e.includes('facebook') && !e.includes('clarity'));
  if (sigNetErrors.length) {
    sigNetErrors.forEach(e => log('ERROR', `${label} / Network`, e));
  } else {
    log('OK', `${label} / Network`, 'No significant network errors');
  }

  // Broken images
  const imgResults = await page.evaluate(() => {
    return Array.from(document.images).map(img => ({
      src: img.src,
      ok: img.complete && img.naturalWidth > 0,
      alt: img.alt,
    }));
  });
  const broken = imgResults.filter(i => !i.ok);
  if (broken.length) broken.forEach(i => log('ERROR', `${label} / Images`, `Broken: ${i.src}`));
  else log('OK', `${label} / Images`, `${imgResults.length} images loaded correctly`);

  return { consoleErrors, networkErrors: sigNetErrors, brokenImages };
}

(async () => {
  const browser = await chromium.launch({ headless: true });

  // ── DESKTOP ──────────────────────────────────────────────────────────────
  const desktop = await browser.newPage();
  await desktop.setViewportSize({ width: 1440, height: 900 });

  // Home
  await auditPage(desktop, 'desktop-home', BASE, false);

  // Check hero video
  const videoState = await desktop.evaluate(() => {
    const v = document.querySelector('.hero-video');
    if (!v) return { exists: false };
    return {
      exists: true,
      paused: v.paused,
      muted: v.muted,
      autoplay: v.autoplay,
      playsinline: v.hasAttribute('playsinline'),
      readyState: v.readyState,
      src: v.currentSrc || v.querySelector('source')?.src,
    };
  });
  if (videoState.exists) {
    if (!videoState.paused) log('OK',    'Desktop / Hero Video', 'Autoplaying');
    else                      log('WARN', 'Desktop / Hero Video', `Paused — readyState=${videoState.readyState}`);
    log('INFO', 'Desktop / Hero Video', `muted=${videoState.muted} autoplay=${videoState.autoplay} playsinline=${videoState.playsinline}`);
  } else {
    log('INFO', 'Desktop / Hero Video', 'No .hero-video element (reduced motion or hidden)');
  }

  // Sticky header scroll test
  await desktop.evaluate(() => window.scrollTo(0, 200));
  await desktop.waitForTimeout(400);
  const isScrolled = await desktop.evaluate(() => document.getElementById('site-header')?.classList.contains('is-scrolled'));
  log(isScrolled ? 'OK' : 'WARN', 'Desktop / Sticky Header', isScrolled ? 'is-scrolled class added on scroll' : 'is-scrolled NOT applied');
  await desktop.evaluate(() => window.scrollTo(0, 0));
  await desktop.waitForTimeout(300);

  // Desktop nav links — top level
  const navLinks = await desktop.evaluate(() =>
    Array.from(document.querySelectorAll('nav a[href]')).map(a => ({ text: a.textContent.trim(), href: a.href }))
  );
  log('INFO', 'Desktop / Nav', `${navLinks.length} nav links found`);

  // Dropdown hover
  const dropdownTrigger = await desktop.$('.nav-dropdown-trigger');
  if (dropdownTrigger) {
    await dropdownTrigger.hover();
    await desktop.waitForTimeout(300);
    const isOpen = await desktop.evaluate(el => el.closest('.nav-has-dropdown')?.classList.contains('is-open'), dropdownTrigger);
    log(isOpen ? 'OK' : 'WARN', 'Desktop / Dropdown', isOpen ? 'Dropdown opens on hover' : 'Dropdown did not open on hover');
    await desktop.screenshot({ path: path.join(OUT, 'desktop-dropdown-open.png') });
    await desktop.mouse.move(0, 0);
    await desktop.waitForTimeout(300);
  } else {
    log('WARN', 'Desktop / Dropdown', 'No .nav-dropdown-trigger found');
  }

  // Email capture modal — scroll to 41%
  const scrollTarget = await desktop.evaluate(() => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    return Math.round(scrollable * 0.41);
  });
  await desktop.evaluate(y => window.scrollTo(0, y), scrollTarget);
  await desktop.waitForTimeout(1500);
  const modalVisible = await desktop.evaluate(() => document.querySelector('.ec-overlay')?.classList.contains('is-visible'));
  log(modalVisible ? 'OK' : 'WARN', 'Desktop / Email Modal', modalVisible ? 'Modal appears at 40% scroll' : 'Modal did NOT appear at 40% scroll');
  if (modalVisible) {
    await desktop.screenshot({ path: path.join(OUT, 'desktop-modal-open.png') });
    // Close it
    const closeBtn = await desktop.$('.ec-modal__close');
    if (closeBtn) { await closeBtn.click(); await desktop.waitForTimeout(400); }
  }
  await desktop.evaluate(() => window.scrollTo(0, 0));

  // Contact page
  await auditPage(desktop, 'desktop-contact', `${BASE}/contact.html`, false);
  const contactFormEl = await desktop.$('#contact-form');
  log(contactFormEl ? 'OK' : 'ERROR', 'Desktop / Contact Form', contactFormEl ? 'Form found' : 'Form missing');
  if (contactFormEl) {
    // Validation — try submit empty
    await desktop.click('[type="submit"]', { force: true });
    await desktop.waitForTimeout(400);
    const hasError = await desktop.evaluate(() => {
      const fields = document.querySelectorAll('#contact-form [required]');
      return Array.from(fields).some(f => f.style.borderColor && f.style.borderColor !== '');
    });
    log(hasError ? 'OK' : 'WARN', 'Desktop / Contact Form', hasError ? 'Validation fires on empty submit' : 'No visible validation on empty submit');
    await desktop.screenshot({ path: path.join(OUT, 'desktop-contact-validation.png') });
  }

  // Careers page
  await auditPage(desktop, 'desktop-careers', `${BASE}/careers.html`, false);
  const careersFormEl = await desktop.$('#careers-form');
  log(careersFormEl ? 'OK' : 'ERROR', 'Desktop / Careers Form', careersFormEl ? 'Form found' : 'Form missing');

  // Services page
  await auditPage(desktop, 'desktop-services', `${BASE}/services.html`, false);

  // About page
  await auditPage(desktop, 'desktop-about', `${BASE}/about.html`, false);

  // ── MOBILE  ──────────────────────────────────────────────────────────────
  const mobile = await browser.newPage();
  await mobile.setViewportSize({ width: 390, height: 844 }); // iPhone 14

  await auditPage(mobile, 'mobile-home', BASE, true);

  // Hero video on mobile
  const mobileVideoState = await mobile.evaluate(() => {
    const v = document.querySelector('.hero-video');
    if (!v) return { exists: false };
    return { exists: true, paused: v.paused, readyState: v.readyState, display: getComputedStyle(v).display };
  });
  if (mobileVideoState.exists) {
    log(mobileVideoState.display === 'none' ? 'INFO' : (mobileVideoState.paused ? 'WARN' : 'OK'),
      'Mobile / Hero Video',
      mobileVideoState.display === 'none'
        ? 'Video hidden (prefers-reduced-motion or mobile CSS)'
        : (mobileVideoState.paused ? `Paused — readyState=${mobileVideoState.readyState}` : 'Autoplaying'));
  }

  // Mobile hamburger menu
  const hamburger = await mobile.$('#nav-hamburger');
  if (hamburger) {
    await hamburger.click();
    await mobile.waitForTimeout(400);
    const menuOpen = await mobile.evaluate(() => document.getElementById('nav-mobile')?.classList.contains('is-open'));
    log(menuOpen ? 'OK' : 'WARN', 'Mobile / Hamburger', menuOpen ? 'Mobile menu opens on tap' : 'Mobile menu did NOT open');
    if (menuOpen) {
      await mobile.screenshot({ path: path.join(OUT, 'mobile-menu-open.png') });
      // Close via hamburger
      await hamburger.click();
      await mobile.waitForTimeout(300);
      const menuClosed = await mobile.evaluate(() => !document.getElementById('nav-mobile')?.classList.contains('is-open'));
      log(menuClosed ? 'OK' : 'WARN', 'Mobile / Hamburger', menuClosed ? 'Mobile menu closes on second tap' : 'Mobile menu did NOT close');
    }
  } else {
    log('WARN', 'Mobile / Hamburger', '#nav-hamburger not found');
  }

  // Email modal excluded on contact page (mobile)
  await mobile.goto(`${BASE}/contact.html`, { waitUntil: 'networkidle' });
  await mobile.evaluate(y => window.scrollTo(0, y), 99999);
  await mobile.waitForTimeout(1500);
  const modalOnContact = await mobile.evaluate(() => document.querySelector('.ec-overlay')?.classList.contains('is-visible'));
  log(!modalOnContact ? 'OK' : 'ERROR', 'Mobile / Modal Exclusion', !modalOnContact ? 'Modal correctly suppressed on /contact.html' : 'Modal incorrectly appeared on /contact.html');

  await auditPage(mobile, 'mobile-services', `${BASE}/services.html`, true);
  await auditPage(mobile, 'mobile-about', `${BASE}/about.html`, true);

  // ── CSS / COLOURS / LAYOUT ──────────────────────────────────────────────
  await desktop.goto(BASE, { waitUntil: 'networkidle' });
  const cssVars = await desktop.evaluate(() => {
    const s = getComputedStyle(document.documentElement);
    return {
      navy:  s.getPropertyValue('--color-navy').trim(),
      teal:  s.getPropertyValue('--color-teal').trim(),
      gold:  s.getPropertyValue('--color-gold').trim(),
      ivory: s.getPropertyValue('--color-ivory').trim(),
      white: s.getPropertyValue('--color-white').trim(),
    };
  });
  log('INFO', 'CSS Vars', JSON.stringify(cssVars));
  const allPresent = Object.values(cssVars).every(v => v.length > 0);
  log(allPresent ? 'OK' : 'ERROR', 'CSS Vars', allPresent ? 'All brand CSS variables resolving' : 'Some CSS variables missing');

  // CTA buttons
  const btnColor = await desktop.evaluate(() => {
    const btn = document.querySelector('.btn-primary');
    if (!btn) return null;
    return getComputedStyle(btn).backgroundColor;
  });
  log(btnColor ? 'OK' : 'WARN', 'Desktop / CTA Buttons', btnColor ? `btn-primary bg: ${btnColor}` : 'No .btn-primary found');

  // Page titles
  const pages = [
    { url: BASE,                    expected: 'Trinity' },
    { url: `${BASE}/about.html`,    expected: 'About' },
    { url: `${BASE}/services.html`, expected: 'Services' },
    { url: `${BASE}/contact.html`,  expected: 'Contact' },
    { url: `${BASE}/careers.html`,  expected: 'Careers' },
  ];
  for (const p of pages) {
    await desktop.goto(p.url, { waitUntil: 'networkidle' });
    const title = await desktop.title();
    const ok = title.includes(p.expected);
    log(ok ? 'OK' : 'WARN', `Page Title: ${p.url.split('/').pop() || 'home'}`, `"${title}"`);
  }

  // Footer links
  await desktop.goto(BASE, { waitUntil: 'networkidle' });
  const footerLinks = await desktop.evaluate(() =>
    Array.from(document.querySelectorAll('footer a[href]')).map(a => ({ text: a.textContent.trim(), href: a.href }))
  );
  log('INFO', 'Desktop / Footer', `${footerLinks.length} footer links`);

  // Stat counter visible
  const statEl = await desktop.$('[data-count-to]');
  if (statEl) {
    await desktop.evaluate(el => el.scrollIntoView(), statEl);
    await desktop.waitForTimeout(1800);
    const statVal = await statEl.textContent();
    log(parseInt(statVal) > 0 ? 'OK' : 'WARN', 'Desktop / Stat Counter', `Counter value: "${statVal}"`);
  }

  await browser.close();

  // ── SUMMARY REPORT ────────────────────────────────────────────────────────
  console.log('\n\n════════════════════════════════════════════════════════════');
  console.log('AUDIT SUMMARY');
  console.log('════════════════════════════════════════════════════════════');
  const errors = findings.filter(f => f.level === 'ERROR');
  const warns  = findings.filter(f => f.level === 'WARN');
  const oks    = findings.filter(f => f.level === 'OK');
  console.log(`\n✅ OK:    ${oks.length}`);
  console.log(`⚠️  WARN:  ${warns.length}`);
  console.log(`❌ ERROR: ${errors.length}`);

  if (errors.length) {
    console.log('\n─── ERRORS ───');
    errors.forEach(e => console.log(`  ❌ [${e.area}] ${e.msg}`));
  }
  if (warns.length) {
    console.log('\n─── WARNINGS ───');
    warns.forEach(w => console.log(`  ⚠️  [${w.area}] ${w.msg}`));
  }
  console.log('\n─── ALL CHECKS ───');
  findings.forEach(f => {
    const icon = f.level === 'OK' ? '✅' : f.level === 'WARN' ? '⚠️ ' : f.level === 'ERROR' ? '❌' : 'ℹ️ ';
    console.log(`  ${icon} [${f.area}] ${f.msg}`);
  });

  console.log(`\nScreenshots saved to: ${OUT}`);
})();
