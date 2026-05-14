const { chromium } = require('C:\\Users\\markw\\AppData\\Roaming\\npm\\node_modules\\playwright');
const fs = require('fs');
const path = require('path');

const BASE = 'https://trinityhomecarellc.com';
const OUT  = path.join(__dirname, 'breakpoint-screenshots');
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT);

const findings = [];
function log(level, area, msg) {
  findings.push({ level, area, msg });
  console.log(`[${level}] [${area}] ${msg}`);
}

// Widths to test — covers common break points and the gaps between them
const WIDTHS = [320, 360, 390, 430, 480, 540, 600, 640, 680, 720, 768, 800, 900, 960, 1024, 1100, 1200, 1280, 1366, 1440, 1600, 1920];

async function measureHeader(page, width) {
  return await page.evaluate(() => {
    const header = document.getElementById('site-header');
    const nav    = header?.querySelector('nav, [role="navigation"]') ?? header?.querySelector('.nav-desktop, .site-nav');
    const hamburger = document.getElementById('nav-hamburger');
    const logo   = header?.querySelector('img, .site-logo, [class*="logo"]');

    if (!header) return { error: 'no #site-header' };

    const hRect = header.getBoundingClientRect();
    const style = getComputedStyle(header);

    // Detect overflow — any child wider than the header
    const children = Array.from(header.querySelectorAll('*'));
    const overflowing = children.filter(el => {
      const r = el.getBoundingClientRect();
      return r.right > hRect.right + 2 || r.left < hRect.left - 2;
    }).map(el => el.className || el.tagName);

    // Check if nav links are wrapping (height > single line)
    const navLinks = header.querySelectorAll('nav a');
    let wrapping = false;
    if (navLinks.length >= 2) {
      const rects = Array.from(navLinks).map(a => a.getBoundingClientRect());
      const tops  = [...new Set(rects.map(r => Math.round(r.top)))];
      wrapping = tops.length > 1;
    }

    // Hamburger visibility
    const hamStyle     = hamburger ? getComputedStyle(hamburger) : null;
    const hamVisible   = hamStyle ? hamStyle.display !== 'none' && hamStyle.visibility !== 'hidden' : null;

    // Desktop nav visibility
    const desktopNav   = document.querySelector('.nav-desktop, [class*="nav-desktop"]');
    const desktopStyle = desktopNav ? getComputedStyle(desktopNav) : null;
    const desktopNavVisible = desktopStyle ? desktopStyle.display !== 'none' : null;

    // Logo overlap check
    let logoOverlap = false;
    if (logo && nav) {
      const lRect = logo.getBoundingClientRect();
      const nRect = nav.getBoundingClientRect();
      logoOverlap = lRect.right > nRect.left + 4;
    }

    return {
      headerHeight:     Math.round(hRect.height),
      headerWidth:      Math.round(hRect.width),
      overflow:         overflowing.slice(0, 3),
      navWrapping:      wrapping,
      hamVisible,
      desktopNavVisible,
      logoOverlap,
    };
  });
}

(async () => {
  const browser  = await chromium.launch({ headless: true });
  const page     = await browser.newPage();

  await page.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 });

  let prevHamVisible   = null;
  let prevDesktopVisible = null;
  let prevHeight = null;

  for (const width of WIDTHS) {
    await page.setViewportSize({ width, height: 900 });
    await page.waitForTimeout(200);

    const m = await measureHeader(page, width);
    if (m.error) { log('ERROR', `${width}px`, m.error); continue; }

    const label = `${width}px`;

    // Screenshot at every width
    await page.screenshot({ path: path.join(OUT, `${String(width).padStart(4,'0')}-header.png`), clip: { x: 0, y: 0, width, height: 120 } });

    // Nav-wrap detection
    if (m.navWrapping) log('ERROR', label, 'Nav links are wrapping to multiple lines');

    // Logo overlap
    if (m.logoOverlap) log('ERROR', label, 'Logo overlaps nav links');

    // Overflow
    if (m.overflow.length) log('WARN', label, `Elements overflow header: ${m.overflow.join(', ')}`);

    // Header height jump (unexpected)
    if (prevHeight !== null && Math.abs(m.headerHeight - prevHeight) > 20) {
      log('WARN', label, `Header height jumped ${prevHeight}px → ${m.headerHeight}px`);
    }
    prevHeight = m.headerHeight;

    // Hamburger / desktop nav transition point
    if (prevHamVisible !== null && m.hamVisible !== prevHamVisible) {
      log('INFO', label, `Hamburger switches to ${m.hamVisible ? 'VISIBLE' : 'HIDDEN'} (desktop nav switches to ${m.desktopNavVisible ? 'VISIBLE' : 'HIDDEN'})`);
    }

    // Both visible or both hidden — layout bug
    if (m.hamVisible === true && m.desktopNavVisible === true) {
      log('ERROR', label, 'Both hamburger AND desktop nav are visible simultaneously');
    }
    if (m.hamVisible === false && m.desktopNavVisible === false) {
      log('ERROR', label, 'Both hamburger AND desktop nav are hidden simultaneously');
    }

    prevHamVisible    = m.hamVisible;
    prevDesktopVisible = m.desktopNavVisible;

    const status = m.navWrapping || m.logoOverlap || m.overflow.length ? '❌' : '✅';
    console.log(`  ${status} ${label.padEnd(6)} h=${m.headerHeight}px  ham=${String(m.hamVisible).padEnd(5)}  desktopNav=${m.desktopNavVisible}  wrap=${m.navWrapping}  overflow=${m.overflow.length}`);
  }

  // Full-page screenshots at key widths
  for (const w of [768, 1024, 1280, 1440]) {
    await page.setViewportSize({ width: w, height: 900 });
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(OUT, `full-${w}.png`), fullPage: false });
  }

  await browser.close();

  // Summary
  const errors = findings.filter(f => f.level === 'ERROR');
  const warns  = findings.filter(f => f.level === 'WARN');

  console.log('\n════════════════════════════════════════');
  console.log('BREAKPOINT AUDIT SUMMARY');
  console.log('════════════════════════════════════════');
  console.log(`❌ Errors:   ${errors.length}`);
  console.log(`⚠️  Warnings: ${warns.length}`);
  if (errors.length) { console.log('\n── ERRORS ──'); errors.forEach(e => console.log(`  ❌ [${e.area}] ${e.msg}`)); }
  if (warns.length)  { console.log('\n── WARNINGS ──'); warns.forEach(w => console.log(`  ⚠️  [${w.area}] ${w.msg}`)); }
  console.log(`\nScreenshots: ${OUT}`);
})();
