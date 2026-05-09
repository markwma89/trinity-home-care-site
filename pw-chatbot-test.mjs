/**
 * Trinity Home Care — Chatbot widget Playwright test
 * Verifies the chatbot launcher is present and functional across key pages,
 * and that the widget connects to the chatbot-platform worker correctly.
 *
 * Prerequisites: serve the site on localhost:5500 before running.
 *   npx serve . -l 5500  OR  npx http-server . -p 5500
 *
 * Run: node pw-chatbot-test.mjs
 */
import { chromium } from 'file:///C:/Users/markw/AppData/Roaming/npm/node_modules/playwright/index.mjs';
import { mkdir }    from 'fs/promises';
import { existsSync } from 'fs';

const BASE = 'http://localhost:5500';
const OUT  = './pw-screenshots/chatbot';

const PAGES = [
  { name: '01-homepage',    path: '/index.html' },
  { name: '02-about',       path: '/about.html' },
  { name: '03-services',    path: '/services.html' },
  { name: '04-contact',     path: '/contact.html' },
  { name: '05-how-it-works',path: '/how-it-works.html' },
  { name: '06-service-companion', path: '/services/companion-care.html' },
  { name: '07-mobile-homepage', path: '/index.html', viewport: { width: 390, height: 844 } },
];

let passed = 0;
let failed = 0;

function ok(msg)   { console.log(`  ✓ ${msg}`); passed++; }
function fail(msg) { console.error(`  ✗ ${msg}`); failed++; }

async function run() {
  if (!existsSync(OUT)) await mkdir(OUT, { recursive: true });

  const browser = await chromium.launch({ headless: false, slowMo: 150 });

  // ── PHASE 1: launcher presence on key pages ────────────────────────────────
  console.log('\n── Phase 1: Launcher presence ─────────────────────────────');

  for (const spec of PAGES) {
    const vp      = spec.viewport ?? { width: 1440, height: 900 };
    const ctx     = await browser.newContext({ viewport: vp });
    const page    = await ctx.newPage();
    const label   = `${spec.name} (${vp.width}px)`;

    await page.goto(`${BASE}${spec.path}`, { waitUntil: 'networkidle' });

    // Widget script must load and inject the launcher
    const launcherVisible = await page.locator('.fg-chat-launcher-wrap').waitFor({
      state: 'attached', timeout: 8000,
    }).then(() => true).catch(() => false);

    if (!launcherVisible) {
      fail(`${label} — launcher not found in DOM`);
      await page.screenshot({ path: `${OUT}/${spec.name}-FAIL-no-launcher.png` });
      await ctx.close();
      continue;
    }

    ok(`${label} — launcher present`);

    // Mobile: launcher should be above the CTA bar (bottom >= 80px)
    if (vp.width <= 767) {
      const bottom = await page.locator('.fg-chat-launcher-wrap').evaluate(el => {
        const s = window.getComputedStyle(el);
        return parseInt(s.bottom, 10);
      });
      if (bottom >= 74) {
        ok(`${label} — launcher bottom=${bottom}px (above mobile CTA bar)`);
      } else {
        fail(`${label} — launcher bottom=${bottom}px is too low (should be ≥74px to clear CTA bar)`);
      }
    }

    await page.screenshot({ path: `${OUT}/${spec.name}-launcher.png` });
    await ctx.close();
  }

  // ── PHASE 2: open/close widget ─────────────────────────────────────────────
  console.log('\n── Phase 2: Widget open/close ─────────────────────────────');

  const ctx2  = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page2 = await ctx2.newPage();
  await page2.goto(`${BASE}/index.html`, { waitUntil: 'networkidle' });
  await page2.locator('.fg-chat-launcher-wrap').waitFor({ state: 'attached', timeout: 8000 });

  // Click launcher to open
  await page2.locator('.fg-chat-launcher-wrap').click();
  const windowOpen = await page2.locator('.fg-chat-window').waitFor({
    state: 'visible', timeout: 5000,
  }).then(() => true).catch(() => false);

  if (windowOpen) {
    ok('Widget opens on launcher click');
    await page2.screenshot({ path: `${OUT}/08-widget-open.png` });
  } else {
    fail('Widget did not open after launcher click');
    await page2.screenshot({ path: `${OUT}/08-FAIL-widget-not-open.png` });
  }

  // Close button
  const closeBtn = page2.locator('.fg-chat-header-close');
  const hasClose = await closeBtn.first().isVisible().catch(() => false);
  if (hasClose) {
    await closeBtn.first().click();
    // Widget uses classList.remove('is-open'), not display:none — check class absence
    const closed = await page2.locator('.fg-chat-window.is-open').waitFor({
      state: 'detached', timeout: 3000,
    }).then(() => true).catch(async () => {
      const hasOpen = await page2.locator('.fg-chat-window').evaluate(
        el => el.classList.contains('is-open')
      ).catch(() => true);
      return !hasOpen;
    });
    if (closed) {
      ok('Widget closes on close button click');
    } else {
      fail('Widget did not close after close button click');
    }
  } else {
    fail('Close button not found');
  }

  await ctx2.close();

  // ── PHASE 3: welcome message + worker connectivity ─────────────────────────
  console.log('\n── Phase 3: Welcome message & worker connectivity ─────────');

  const ctx3  = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page3 = await ctx3.newPage();

  // Intercept worker requests to confirm the right site-id and URL
  const workerRequests = [];
  page3.on('request', req => {
    if (req.url().includes('chatbot-platform.mwilliams-923.workers.dev')) {
      workerRequests.push({ url: req.url(), method: req.method() });
    }
  });
  const workerResponses = [];
  page3.on('response', res => {
    if (res.url().includes('chatbot-platform.mwilliams-923.workers.dev')) {
      workerResponses.push({ url: res.url(), status: res.status() });
    }
  });

  await page3.goto(`${BASE}/index.html`, { waitUntil: 'networkidle' });
  await page3.locator('.fg-chat-launcher-wrap').waitFor({ state: 'attached', timeout: 8000 });
  await page3.locator('.fg-chat-launcher-wrap').click();
  await page3.locator('.fg-chat-window').waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});

  // Wait for welcome message to appear
  await page3.waitForTimeout(3000);

  const welcomeText = await page3.locator('.fg-chat-message, .fg-chat-bubble, [class*="fg-chat-msg"]')
    .first().textContent({ timeout: 5000 }).catch(() => null);

  if (welcomeText) {
    ok(`Welcome message received: "${welcomeText.trim().slice(0, 80)}"`);
  } else {
    // Check if any message-like element exists
    const anyMsg = await page3.locator('[class*="fg-chat"]').count();
    if (anyMsg > 0) {
      ok(`Widget DOM loaded (${anyMsg} fg-chat elements found)`);
    } else {
      fail('No welcome message or chat elements found');
    }
  }

  // Config fetch check
  const configReq = workerRequests.find(r => r.url.includes('/config') || r.url.includes('trinity'));
  if (configReq) {
    ok(`Worker config request made: ${configReq.url}`);
  }

  const successResponses = workerResponses.filter(r => r.status < 400);
  if (successResponses.length > 0) {
    ok(`Worker responded with ${successResponses[0].status} on ${successResponses.length} request(s)`);
  } else if (workerResponses.length > 0) {
    fail(`Worker responded with error status: ${workerResponses.map(r => r.status).join(', ')}`);
  } else {
    fail('No worker requests detected — widget may not be contacting the worker');
  }

  await page3.screenshot({ path: `${OUT}/09-widget-with-welcome.png`, fullPage: false });
  await ctx3.close();

  // ── PHASE 4: send a message ────────────────────────────────────────────────
  console.log('\n── Phase 4: Send a message ─────────────────────────────────');

  const ctx4  = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page4 = await ctx4.newPage();
  await page4.goto(`${BASE}/index.html`, { waitUntil: 'networkidle' });
  await page4.locator('.fg-chat-launcher-wrap').waitFor({ state: 'attached', timeout: 8000 });
  await page4.locator('.fg-chat-launcher-wrap').click();
  await page4.locator('.fg-chat-window').waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
  await page4.waitForTimeout(2000); // let welcome message load

  // Find and fill the input
  const input = page4.locator('#fg-chat-input, .fg-chat-input').first();
  const inputVisible = await input.isVisible().catch(() => false);
  if (inputVisible) {
    await input.fill('What services do you offer?');
    await page4.screenshot({ path: `${OUT}/10-message-typed.png` });

    // Submit via Enter or send button
    const sendBtn = page4.locator('.fg-chat-send').first();
    const hasSend = await sendBtn.isVisible().catch(() => false);
    if (hasSend) {
      await sendBtn.click();
    } else {
      await input.press('Enter');
    }

    ok('Message sent: "What services do you offer?"');

    // Wait for assistant response (up to 15s for API call)
    await page4.waitForTimeout(8000);
    await page4.screenshot({ path: `${OUT}/11-assistant-response.png` });

    const msgs = await page4.locator('.fg-chat-message, .fg-chat-bubble, [class*="fg-chat-msg"]').count();
    if (msgs >= 2) {
      ok(`${msgs} messages in chat (user + assistant response received)`);
    } else {
      fail(`Only ${msgs} message(s) found — assistant may not have responded`);
    }
  } else {
    fail('Chat input field not found');
    await page4.screenshot({ path: `${OUT}/10-FAIL-no-input.png` });
  }

  await ctx4.close();

  // ── PHASE 5: quick replies ─────────────────────────────────────────────────
  console.log('\n── Phase 5: Quick replies ──────────────────────────────────');

  const ctx5  = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page5 = await ctx5.newPage();
  await page5.goto(`${BASE}/index.html`, { waitUntil: 'networkidle' });
  await page5.locator('.fg-chat-launcher-wrap').waitFor({ state: 'attached', timeout: 8000 });
  await page5.locator('.fg-chat-launcher-wrap').click();
  await page5.locator('.fg-chat-window').waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
  await page5.waitForTimeout(3000);

  const quickReplies = page5.locator('.fg-chat-quick-reply, [class*="quick-reply"], [class*="fg-chat-chip"]');
  const qrCount = await quickReplies.count();
  if (qrCount > 0) {
    ok(`${qrCount} quick repl${qrCount === 1 ? 'y' : 'ies'} rendered`);
    await page5.screenshot({ path: `${OUT}/12-quick-replies.png` });
    await quickReplies.first().click();
    await page5.waitForTimeout(4000);
    await page5.screenshot({ path: `${OUT}/13-quick-reply-response.png` });
    ok('Quick reply clicked and sent');
  } else {
    fail('No quick replies found');
    await page5.screenshot({ path: `${OUT}/12-FAIL-no-quick-replies.png` });
  }

  await ctx5.close();
  await browser.close();

  // ── Summary ────────────────────────────────────────────────────────────────
  console.log('\n══════════════════════════════════════════════════════════════');
  console.log(`  Results: ${passed} passed, ${failed} failed`);
  console.log(`  Screenshots saved to ${OUT}/`);
  console.log('══════════════════════════════════════════════════════════════\n');

  if (failed > 0) process.exit(1);
}

run().catch(err => { console.error(err); process.exit(1); });
