# Email Capture Banner Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a scroll-triggered center-overlay email capture modal to the Trinity Home Care website that collects visitor emails and adds them to a Brevo contact list via a secure Cloudflare Pages Function backend.

**Architecture:** The modal HTML is injected into `<body>` by `main.js` and triggered by a 40% scroll depth listener. A Cloudflare Pages Function at `/api/email-capture` handles the Brevo API call server-side so `BREVO_API_KEY` never reaches the browser. Suppression state lives in localStorage for 30 days after dismiss or successful submit.

**Tech Stack:** Vanilla JavaScript (ES2020), custom CSS with CSS variables, Cloudflare Pages Functions (Workers runtime, native `fetch`), Brevo Contacts API v3.

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `functions/api/email-capture.js` | Create | POST handler: validate email, call Brevo API, return JSON |
| `css/main.css` | Append (after line 2211) | Modal overlay + card styles, animations, reduced-motion, mobile |
| `js/main.js` | Insert (before final `})();` on line 322) | Modal injection, scroll trigger, localStorage suppression, form submit |

Zero HTML page edits — `main.js` and `main.css` are already loaded on every page.

---

## Task 1: Create the Cloudflare Pages Function

**Files:**
- Create: `functions/api/email-capture.js`

- [ ] **Step 1.1: Create the functions directory and file**

Create `functions/api/email-capture.js` with this exact content:

```javascript
// functions/api/email-capture.js
// Cloudflare Pages Function — POST /api/email-capture
// Adds submitted email to a Brevo contact list.
// Requires env vars: BREVO_API_KEY, BREVO_LIST_ID

export async function onRequestPost(context) {
  const { request, env } = context;
  const JSON_HEADERS = { 'Content-Type': 'application/json' };

  // Parse request body
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request' }), {
      status: 400,
      headers: JSON_HEADERS,
    });
  }

  // Validate email
  const email = (body?.email ?? '').trim();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return new Response(JSON.stringify({ error: 'Invalid email' }), {
      status: 400,
      headers: JSON_HEADERS,
    });
  }

  // Check env vars
  const { BREVO_API_KEY, BREVO_LIST_ID } = env;
  if (!BREVO_API_KEY || !BREVO_LIST_ID) {
    console.error('[email-capture] Missing BREVO_API_KEY or BREVO_LIST_ID');
    return new Response(JSON.stringify({ error: 'Server misconfigured' }), {
      status: 500,
      headers: JSON_HEADERS,
    });
  }

  // Call Brevo Contacts API
  let brevoRes;
  try {
    brevoRes = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'api-key': BREVO_API_KEY,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        email,
        listIds: [parseInt(BREVO_LIST_ID, 10)],
        updateEnabled: true,
        attributes: { SOURCE: 'website' },
      }),
    });
  } catch (err) {
    console.error('[email-capture] Brevo fetch error:', err);
    return new Response(JSON.stringify({ error: 'Subscription failed' }), {
      status: 500,
      headers: JSON_HEADERS,
    });
  }

  // Brevo returns 201 (created) or 204 (contact already exists, updated)
  if (brevoRes.status === 201 || brevoRes.status === 204) {
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: JSON_HEADERS,
    });
  }

  const brevoBody = await brevoRes.text();
  console.error('[email-capture] Brevo error:', brevoRes.status, brevoBody);
  return new Response(JSON.stringify({ error: 'Subscription failed' }), {
    status: 500,
    headers: JSON_HEADERS,
  });
}

// Reject non-POST methods with 405
export async function onRequest() {
  return new Response(null, { status: 405 });
}

// Handle preflight (same-origin requests don't need this, but it's harmless)
export async function onRequestOptions() {
  return new Response(null, { status: 204 });
}
```

- [ ] **Step 1.2: Commit the function file**

```bash
git add functions/api/email-capture.js
git commit -m "feat: add Cloudflare Pages Function for Brevo email capture"
```

---

## Task 2: Configure Cloudflare Environment Variables

These must be set before the function can reach Brevo. **Do not put these values in any file.**

- [ ] **Step 2.1: Get your Brevo API key**

1. Log in to [app.brevo.com](https://app.brevo.com)
2. Go to **Account → SMTP & API → API Keys**
3. Click **Generate a new API key**, name it `Trinity Home Care Website`
4. Copy the key — you will not see it again

- [ ] **Step 2.2: Get your Brevo list ID**

1. In Brevo go to **Contacts → Lists**
2. Create a new list named `Website Leads` if one doesn't exist
3. The list ID is the number in the URL when viewing the list (e.g., `https://app.brevo.com/contact/list/edit/id/42` → ID is `42`)
4. Note this number

- [ ] **Step 2.3: Set environment variables in Cloudflare Pages**

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com) → **Pages** → **trinity-home-care**
2. Click **Settings** → **Environment variables**
3. Under **Production**, click **Add variable** and add both:

| Variable name | Value |
|---|---|
| `BREVO_API_KEY` | (paste your Brevo API key) |
| `BREVO_LIST_ID` | (paste your list numeric ID, e.g. `42`) |

4. Mark both as **Encrypted**
5. Click **Save**

> Note: For local testing with wrangler, run:
> `npx wrangler pages dev . --binding BREVO_API_KEY=your_key --binding BREVO_LIST_ID=your_id`
> from the project root (requires Node.js; wrangler is auto-downloaded via npx).

---

## Task 3: Add Modal CSS to main.css

**Files:**
- Modify: `css/main.css` — append after the final line (currently line 2211)

- [ ] **Step 3.1: Append the email capture styles to the end of css/main.css**

Open `css/main.css` and append this block after the last line:

```css

/* -------------------------------------------------------------------
   Email Capture Modal
   Center overlay triggered at 40% scroll depth.
   Uses existing brand tokens — no new custom properties needed.
   ------------------------------------------------------------------- */

.ec-overlay {
  position: fixed;
  inset: 0;
  background: rgba(33, 58, 90, 0.55);
  z-index: var(--z-modal);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  opacity: 0;
  transition: opacity var(--t-base);
  pointer-events: none;
}

.ec-overlay.is-visible {
  opacity: 1;
  pointer-events: auto;
}

.ec-modal {
  background: var(--color-white);
  border-radius: var(--radius-md);
  border-top: 3px solid var(--color-gold);
  max-width: 480px;
  width: 100%;
  padding: 2.5rem 2rem 2rem;
  position: relative;
  box-shadow: 0 24px 64px rgba(33, 58, 90, 0.28);
  transform: translateY(16px);
  transition: transform var(--t-base);
}

.ec-overlay.is-visible .ec-modal {
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  .ec-overlay,
  .ec-modal {
    transition: none;
  }
}

.ec-modal__close {
  position: absolute;
  top: 0.875rem;
  right: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-stone);
  font-size: 1.25rem;
  line-height: 1;
  padding: 0.25rem;
  transition: color var(--t-fast);
}

.ec-modal__close:hover { color: var(--color-text); }

.ec-modal__close:focus-visible {
  outline: 3px solid var(--color-teal);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}

.ec-modal__eyebrow {
  font-family: var(--font-body);
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-teal);
  margin-bottom: 0.75rem;
}

.ec-modal__heading {
  font-family: var(--font-heading);
  font-size: 1.75rem;
  font-weight: 500;
  line-height: 1.2;
  color: var(--color-navy);
  margin-bottom: 0.75rem;
}

.ec-modal__subtext {
  font-size: 0.9375rem;
  color: var(--color-text-sub);
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.ec-modal__form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.ec-modal__input {
  width: 100%;
  padding: 0.75rem 1rem;
  font-family: var(--font-body);
  font-size: 0.9375rem;
  color: var(--color-text);
  background: var(--color-ivory);
  border: 1.5px solid var(--color-stone);
  border-radius: var(--radius-sm);
  transition: border-color var(--t-fast), box-shadow var(--t-fast);
  min-height: 48px;
}

.ec-modal__input:focus {
  outline: none;
  border-color: var(--color-teal);
  box-shadow: 0 0 0 3px rgba(95, 143, 149, 0.18);
}

.ec-modal__input::placeholder { color: var(--color-text-muted); }

.ec-modal__error {
  font-size: 0.875rem;
  color: #c0392b;
  min-height: 1.25rem;
}

.ec-modal__success { text-align: center; padding: 1rem 0; }

.ec-modal__success-heading {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  color: var(--color-navy);
  margin-bottom: 0.5rem;
}

.ec-modal__success-text {
  font-size: 0.9375rem;
  color: var(--color-text-sub);
}

.ec-modal__dismiss {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.8125rem;
  color: var(--color-text-muted);
  text-align: center;
  padding: 0.25rem;
  transition: color var(--t-fast);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.ec-modal__dismiss:hover { color: var(--color-text-sub); }

@media (max-width: 480px) {
  .ec-modal {
    padding: 2rem 1.25rem 1.5rem;
  }
  .ec-modal__heading { font-size: 1.5rem; }
}
```

- [ ] **Step 3.2: Verify the file still has valid CSS**

```bash
node --check css/main.css 2>/dev/null || echo "CSS does not need node check — open in browser to verify"
```

Open `index.html` in a browser and confirm the page looks unchanged (modal not visible at page load is correct — it injects via JS).

- [ ] **Step 3.3: Commit**

```bash
git add css/main.css
git commit -m "feat: add email capture modal CSS"
```

---

## Task 4: Add Modal JavaScript to main.js

**Files:**
- Modify: `js/main.js` — insert a new IIFE just before the closing `})();` on line 322

- [ ] **Step 4.1: Insert the email capture IIFE into main.js**

In `js/main.js`, find the last two lines of the file:

```javascript
})();
```

Replace them with:

```javascript
  /* -----------------------------------------------------------------
     Email Capture Modal
     Center overlay triggered at 40% scroll depth. After dismiss or
     successful submit, suppressed for 30 days via localStorage key
     "ec_dismissed". Not shown on contact, thank-you, careers, or
     legal/utility pages.
     ----------------------------------------------------------------- */
  (function initEmailCapture() {
    const EXCLUDED_PATHS = [
      '/contact', '/contact.html',
      '/thank-you', '/thank-you.html',
      '/careers', '/careers.html',
      '/careers-thank-you', '/careers-thank-you.html',
      '/terms', '/terms.html',
      '/privacy', '/privacy.html',
      '/policy', '/policy.html',
      '/accessibility', '/accessibility.html',
    ];

    const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
    if (EXCLUDED_PATHS.some(p => currentPath === p || currentPath.endsWith(p))) return;

    const STORAGE_KEY = 'ec_dismissed';
    const SUPPRESS_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && Date.now() - parseInt(stored, 10) < SUPPRESS_MS) return;

    let hasOpened = false;

    // Inject modal HTML
    const overlay = document.createElement('div');
    overlay.className = 'ec-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'ec-heading');
    overlay.innerHTML = `
      <div class="ec-modal">
        <button class="ec-modal__close" aria-label="Close">&times;</button>
        <p class="ec-modal__eyebrow">Trinity Home Care</p>
        <h2 class="ec-modal__heading" id="ec-heading">Stay Connected with Local Care Updates</h2>
        <p class="ec-modal__subtext">Be the first to know about care openings, resources, and tips for Pittsburgh families.</p>
        <div class="ec-modal__form-wrap">
          <form class="ec-modal__form" novalidate>
            <input class="ec-modal__input" type="email" name="email"
                   placeholder="your@email.com" autocomplete="email" required>
            <p class="ec-modal__error" role="alert"></p>
            <button type="submit" class="btn btn-primary" style="width:100%">Stay Informed</button>
            <button type="button" class="ec-modal__dismiss">No thanks</button>
          </form>
          <div class="ec-modal__success" hidden>
            <p class="ec-modal__success-heading">You&#x2019;re on the list.</p>
            <p class="ec-modal__success-text">Thank you for staying connected with Trinity Home Care.</p>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    const emailInput = overlay.querySelector('.ec-modal__input');
    const errorEl    = overlay.querySelector('.ec-modal__error');
    const successEl  = overlay.querySelector('.ec-modal__success');
    const form       = overlay.querySelector('.ec-modal__form');
    const submitBtn  = form.querySelector('[type="submit"]');

    function suppress() {
      localStorage.setItem(STORAGE_KEY, String(Date.now()));
    }

    function openModal() {
      if (hasOpened) return;
      hasOpened = true;
      overlay.classList.add('is-visible');
      requestAnimationFrame(() => emailInput.focus());
    }

    function closeModal() {
      suppress();
      overlay.classList.remove('is-visible');
    }

    // Scroll trigger — fires once at 40% scroll depth
    function onScroll() {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable > 0 && window.scrollY / scrollable >= 0.40) {
        window.removeEventListener('scroll', onScroll);
        openModal();
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    // Dismiss: backdrop click, close button, "No thanks"
    overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
    overlay.querySelector('.ec-modal__close').addEventListener('click', closeModal);
    overlay.querySelector('.ec-modal__dismiss').addEventListener('click', closeModal);
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && overlay.classList.contains('is-visible')) closeModal();
    });

    // Form submit
    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      const email = emailInput.value.trim();
      errorEl.textContent = '';

      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errorEl.textContent = 'Please enter a valid email address.';
        emailInput.focus();
        return;
      }

      submitBtn.textContent = 'Sending…';
      submitBtn.disabled = true;

      try {
        const res = await fetch('/api/email-capture', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });

        if (!res.ok) throw new Error('server');

        form.hidden = true;
        successEl.hidden = false;
        suppress();
        setTimeout(() => overlay.classList.remove('is-visible'), 3000);
      } catch {
        submitBtn.textContent = 'Stay Informed';
        submitBtn.disabled = false;
        errorEl.textContent = 'Something went wrong. Please try again.';
      }
    });
  })();

})();
```

- [ ] **Step 4.2: Verify the JS file parses without errors**

```bash
node --check js/main.js
```

Expected output: no output (exit code 0). If there's a syntax error, node will print the line number.

- [ ] **Step 4.3: Manually trigger the modal in the browser to verify it appears**

Open `index.html` via the dev server or a deployed preview. Open the browser console and run:

```javascript
// Clear suppression so the modal isn't blocked by a previous test
localStorage.removeItem('ec_dismissed');

// Force-open (bypasses scroll trigger for visual testing)
document.querySelector('.ec-overlay').classList.add('is-visible');
```

Expected: the overlay fades in, the modal card slides up from below, the email input receives focus.

- [ ] **Step 4.4: Test each dismiss path in the browser**

With the modal open, verify each of the following closes the modal and sets localStorage:

```javascript
// After each action, check suppression was stored:
localStorage.getItem('ec_dismissed'); // should be a timestamp string

// Reset between tests:
localStorage.removeItem('ec_dismissed');
document.querySelector('.ec-overlay').classList.add('is-visible');
```

Dismiss paths to test:
1. Click the **✕** button — modal should close
2. Click the **"No thanks"** button — modal should close
3. Click **outside the card** (on the dark overlay) — modal should close
4. Press **Escape** key — modal should close

- [ ] **Step 4.5: Test the validation state**

With the modal open:

```javascript
// Submit with empty email
document.querySelector('.ec-modal__form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
```

Expected: error message "Please enter a valid email address." appears below the input.

- [ ] **Step 4.6: Commit**

```bash
git add js/main.js
git commit -m "feat: add scroll-triggered email capture modal"
```

---

## Task 5: Deploy and End-to-End Verification

- [ ] **Step 5.1: Push to trigger a Cloudflare Pages deployment**

```bash
git push origin main
```

Wait for the deployment to complete. Cloudflare Pages will detect the new `functions/` directory automatically — no wrangler.toml needed.

- [ ] **Step 5.2: Verify the function rejects an invalid email**

Replace `your-deployment.pages.dev` with your actual Pages URL (or the live domain):

```bash
curl -s -X POST https://www.trinityhomecarellc.com/api/email-capture \
  -H "Content-Type: application/json" \
  -d '{"email":"notanemail"}' | cat
```

Expected response: `{"error":"Invalid email"}`

- [ ] **Step 5.3: Verify the function rejects a non-POST request**

```bash
curl -s -o /dev/null -w "%{http_code}" \
  https://www.trinityhomecarellc.com/api/email-capture
```

Expected: `405`

- [ ] **Step 5.4: Submit a real test email and verify it reaches Brevo**

Use a real email address you control (e.g., a Gmail + alias like `you+test@gmail.com`):

```bash
curl -s -X POST https://www.trinityhomecarellc.com/api/email-capture \
  -H "Content-Type: application/json" \
  -d '{"email":"you+test@gmail.com"}' | cat
```

Expected response: `{"success":true}`

Then in Brevo → Contacts → your Website Leads list, confirm the contact appears with `SOURCE = website`.

- [ ] **Step 5.5: Verify the env-vars-missing path (optional — only if staging env available)**

If you have a separate Pages environment without the env vars set, `curl` the staging URL:

Expected response: `{"error":"Server misconfigured"}`

- [ ] **Step 5.6: Smoke-test the modal on the live site**

1. Open `https://www.trinityhomecarellc.com` in an incognito window
2. Scroll past 40% of the page
3. Confirm the modal appears with correct copy and brand styling
4. Submit a test email — confirm success state shows
5. Reload the page — confirm modal does NOT reappear (localStorage suppression)

- [ ] **Step 5.7: Verify excluded pages do NOT show the modal**

Open each of these pages and scroll to the bottom — the modal must NOT appear:
- `/contact.html`
- `/thank-you.html`
- `/careers.html`
- `/terms.html`

- [ ] **Step 5.8: Verify the modal does not appear on a second visit within 30 days**

Open the browser console on any content page and confirm:

```javascript
localStorage.getItem('ec_dismissed'); // should be a timestamp from the previous test
```

Scroll to the bottom — modal should NOT appear.

---

## Summary of All Changes

| File | Status | Purpose |
|---|---|---|
| `functions/api/email-capture.js` | Created | Secure backend: Brevo API call |
| `css/main.css` | Appended | Modal overlay, card, input, states, animation, mobile |
| `js/main.js` | Appended | Modal inject, scroll trigger, localStorage, form submit |

No HTML files modified. No npm packages added. No build steps added.
