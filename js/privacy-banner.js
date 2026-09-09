(function () {
  'use strict';

  var STORAGE_KEY = 'trinity_zaraz_consent_v1';

  // Must match the Purpose *names* configured in Zaraz Consent dashboard
  var ZARAZ_PURPOSES = {
    analytics: 'Analytics',
    marketing: 'Marketing',
    essential: 'Essential'
  };

  var defaultChoice = {
    analytics: false,
    marketing: false,
    updatedAt: null
  };

  /* ── Storage ── */

  function getStoredChoice() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? Object.assign({}, defaultChoice, JSON.parse(raw)) : null;
    } catch (e) {
      return null;
    }
  }

  function saveChoice(choice) {
    var next = Object.assign({}, defaultChoice, choice, {
      updatedAt: new Date().toISOString()
    });
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {}
    window.TrinityPrivacyChoice = next;
    return next;
  }

  /* ── Zaraz consent bridge ──
   *
   * Cloudflare's modern Consent API keys consent on auto-generated purpose
   * IDs (e.g. "YIbD"), reached via zaraz.consent.set({ <id>: bool }) — NOT the
   * legacy zaraz.setConsent({ <PurposeName>: bool }). We resolve IDs at runtime
   * by matching the display names in zaraz.consent.purposes, so we never hard-
   * code zone-specific IDs and only ever set purposes that actually exist
   * (required purposes like Essential, and unassigned purposes, are skipped —
   * calling set() on those throws "Unknown purpose id"). A legacy fallback is
   * kept for any zone still on the old API.
   */

  function modernConsentReady() {
    return !!(window.zaraz && window.zaraz.consent &&
      typeof window.zaraz.consent.set === 'function' &&
      window.zaraz.consent.purposes);
  }

  function legacyConsentReady() {
    return !!(window.zaraz && typeof window.zaraz.setConsent === 'function');
  }

  // Map a display name (e.g. "Analytics") to its Zaraz purpose ID, or null.
  function resolvePurposeId(displayName) {
    try {
      var purposes = window.zaraz.consent.purposes || {};
      var wanted = String(displayName).toLowerCase();
      for (var id in purposes) {
        if (!Object.prototype.hasOwnProperty.call(purposes, id)) continue;
        var p = purposes[id];
        var name = p && p.name ? (p.name.en || p.name) : '';
        if (String(name).toLowerCase() === wanted) return id;
      }
    } catch (e) {}
    return null;
  }

  function waitForZaraz(callback, attempts) {
    attempts = attempts || 0;
    if (modernConsentReady() || legacyConsentReady()) {
      callback();
      return;
    }
    if (attempts > 40) {
      callback();
      return;
    }
    window.setTimeout(function () {
      waitForZaraz(callback, attempts + 1);
    }, 250);
  }

  // Set a single purpose in its own call. A purpose can be *defined* (present
  // in zaraz.consent.purposes) yet not *registered* for consent because no tool
  // is assigned to it — set() then throws "Unknown purpose id". Setting each
  // purpose independently (with its own try/catch) means one such purpose can't
  // block the others in the same batch. Essential is required and is never set.
  function setPurpose(id, value) {
    if (!id) return;
    try {
      var one = {};
      one[id] = Boolean(value);
      window.zaraz.consent.set(one);
    } catch (e) {}
  }

  function pushZarazConsent(choice) {
    waitForZaraz(function () {
      var z = window.zaraz;

      // Modern Consent API: zaraz.consent.set({ <purposeId>: boolean })
      if (modernConsentReady()) {
        setPurpose(resolvePurposeId(ZARAZ_PURPOSES.analytics), choice.analytics);
        setPurpose(resolvePurposeId(ZARAZ_PURPOSES.marketing), choice.marketing);
        if (typeof z.consent.sendQueuedEvents === 'function') {
          try { z.consent.sendQueuedEvents(); } catch (e) {}
        }
        return;
      }

      // Legacy fallback: zaraz.setConsent({ <PurposeName>: boolean })
      if (legacyConsentReady()) {
        var legacy = {};
        legacy[ZARAZ_PURPOSES.essential] = true;
        legacy[ZARAZ_PURPOSES.analytics] = Boolean(choice.analytics);
        legacy[ZARAZ_PURPOSES.marketing] = Boolean(choice.marketing);
        try { z.setConsent(legacy); } catch (e) {}
      }
    });
  }

  /* ── Apply consent (save + push + UI) ── */

  function applyConsent(choice) {
    var saved = saveChoice(choice);
    pushZarazConsent(saved);

    window.dispatchEvent(new CustomEvent('trinity:consent-updated', {
      detail: saved
    }));

    hideBanner();
    hideModal();
    showPrefsButton();
  }

  /* ── Banner HTML ── */

  function createBanner() {
    var el = document.createElement('section');
    el.className = 'tc-privacy-banner';
    el.id = 'tcPrivacyBanner';
    el.setAttribute('aria-label', 'Privacy preferences');
    el.innerHTML =
      '<div class="tc-privacy-panel">' +
        '<div class="tc-privacy-copy">' +
          '<p class="tc-privacy-eyebrow">Privacy Preferences</p>' +
          '<h2 class="tc-privacy-title">Choose how Trinity Home Care can use cookies.</h2>' +
          '<p class="tc-privacy-text">' +
            'We use essential features to keep this site working. With your permission, we may also use analytics tools to measure and improve how the site performs. ' +
            '<a href="/privacy.html">Privacy Policy</a>' +
          '</p>' +
        '</div>' +
        '<div class="tc-privacy-actions">' +
          '<button class="tc-privacy-btn tc-privacy-btn--link" type="button" data-tc-manage>Manage</button>' +
          '<button class="tc-privacy-btn" type="button" data-tc-reject>Decline Optional</button>' +
          '<button class="tc-privacy-btn tc-privacy-btn--primary" type="button" data-tc-accept>Accept All</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(el);
  }

  /* ── Manage Modal HTML ── */

  function createModal() {
    var el = document.createElement('section');
    el.className = 'tc-privacy-modal';
    el.id = 'tcPrivacyModal';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.setAttribute('aria-label', 'Manage privacy preferences');
    el.innerHTML =
      '<div class="tc-privacy-modal-panel">' +
        '<div class="tc-privacy-modal-header">' +
          '<div>' +
            '<h2>Manage Privacy Preferences</h2>' +
            '<p>Essential features are always active. Choose which optional tools Trinity Home Care may use.</p>' +
          '</div>' +
          '<button class="tc-privacy-close" type="button" aria-label="Close" data-tc-close>×</button>' +
        '</div>' +

        '<div class="tc-privacy-category">' +
          '<div class="tc-privacy-category-top">' +
            '<div>' +
              '<h3>Essential</h3>' +
              '<p>Required for the website to work properly. These features cannot be turned off.</p>' +
            '</div>' +
            '<label class="tc-privacy-toggle">' +
              '<input type="checkbox" checked disabled />' +
              '<span>Always active</span>' +
            '</label>' +
          '</div>' +
        '</div>' +

        '<div class="tc-privacy-category">' +
          '<div class="tc-privacy-category-top">' +
            '<div>' +
              '<h3>Analytics</h3>' +
              '<p>Helps Trinity Home Care understand how visitors use the website so we can improve the experience for families and caregivers.</p>' +
            '</div>' +
            '<label class="tc-privacy-toggle">' +
              '<input type="checkbox" data-tc-purpose="analytics" />' +
              '<span>Allow</span>' +
            '</label>' +
          '</div>' +
        '</div>' +

        '<div class="tc-privacy-modal-actions">' +
          '<button class="tc-privacy-btn" type="button" data-tc-reject>Decline Optional</button>' +
          '<button class="tc-privacy-btn" type="button" data-tc-save>Save Preferences</button>' +
          '<button class="tc-privacy-btn tc-privacy-btn--primary" type="button" data-tc-accept>Accept All</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(el);
  }

  /* ── Fixed preferences button (shown after consent is given) ── */

  function createPrefsButton() {
    var btn = document.createElement('button');
    btn.className = 'tc-privacy-preferences-fixed';
    btn.id = 'tcPrivacyPrefsBtn';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Privacy Preferences');
    btn.innerHTML =
      '<span class="tc-prefs-label" aria-hidden="true">Privacy Preferences</span>' +
      '<span class="tc-prefs-icon" aria-hidden="true">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="22" height="22">' +
          '<circle cx="12" cy="12" r="10"/>' +
          '<circle cx="12" cy="8" r="1.8" fill="currentColor" stroke="none"/>' +
          '<line x1="8.5" y1="11.5" x2="15.5" y2="11.5"/>' +
          '<line x1="12" y1="11.5" x2="12" y2="16"/>' +
          '<polyline points="9.5,19.5 12,16 14.5,19.5"/>' +
        '</svg>' +
      '</span>';
    btn.addEventListener('click', showModal);
    document.body.appendChild(btn);
  }

  /* ── Visibility helpers ── */

  function showBanner() {
    var el = document.getElementById('tcPrivacyBanner');
    if (el) el.classList.add('is-visible');
  }

  function hideBanner() {
    var el = document.getElementById('tcPrivacyBanner');
    if (el) el.classList.remove('is-visible');
  }

  function showModal() {
    var choice = getStoredChoice() || defaultChoice;
    document.querySelectorAll('[data-tc-purpose]').forEach(function (input) {
      input.checked = Boolean(choice[input.dataset.tcPurpose]);
    });
    var el = document.getElementById('tcPrivacyModal');
    if (el) el.classList.add('is-visible');
  }

  function hideModal() {
    var el = document.getElementById('tcPrivacyModal');
    if (el) el.classList.remove('is-visible');
  }

  function showPrefsButton() {
    var el = document.getElementById('tcPrivacyPrefsBtn');
    if (el) el.classList.add('is-visible');
  }

  /* ── Event delegation ── */

  function bindEvents() {
    document.addEventListener('click', function (e) {
      var t = e.target;

      if (t.hasAttribute('data-tc-accept')) {
        // Marketing has no assigned Zaraz tool and no visible toggle, so we
        // don't record consent for it. Re-add `marketing: true` here when a
        // marketing tool + toggle are reintroduced.
        applyConsent({ analytics: true, marketing: false });
        return;
      }

      if (t.hasAttribute('data-tc-reject')) {
        applyConsent({ analytics: false, marketing: false });
        return;
      }

      if (t.hasAttribute('data-tc-manage')) {
        showModal();
        return;
      }

      if (t.hasAttribute('data-tc-close')) {
        hideModal();
        return;
      }

      if (t.hasAttribute('data-tc-save')) {
        var selected = { analytics: false, marketing: false };
        document.querySelectorAll('[data-tc-purpose]').forEach(function (input) {
          selected[input.dataset.tcPurpose] = input.checked;
        });
        applyConsent(selected);
        return;
      }

      // Click outside modal panel closes it
      if (t.id === 'tcPrivacyModal') {
        hideModal();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') hideModal();
    });
  }

  /* ── Init ── */

  function init() {
    createBanner();
    createModal();
    createPrefsButton();
    bindEvents();

    var stored = getStoredChoice();

    if (stored) {
      window.TrinityPrivacyChoice = stored;
      pushZarazConsent(stored);
      showPrefsButton();
    } else {
      showBanner();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Called by footer "Privacy Preferences" buttons on every page
  window.trinityPrivacyShowPreferences = function () { showModal(); };

}());
