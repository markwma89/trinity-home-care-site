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

  /* ── Zaraz consent bridge ── */

  function waitForZaraz(callback, attempts) {
    attempts = attempts || 0;
    if (window.zaraz && typeof window.zaraz.setConsent === 'function') {
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

  function pushZarazConsent(choice) {
    var payload = {};
    payload[ZARAZ_PURPOSES.essential]  = true;
    payload[ZARAZ_PURPOSES.analytics]  = Boolean(choice.analytics);
    payload[ZARAZ_PURPOSES.marketing]  = Boolean(choice.marketing);

    waitForZaraz(function () {
      if (window.zaraz && typeof window.zaraz.setConsent === 'function') {
        window.zaraz.setConsent(payload);
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
            'We use essential features to keep this site working. With your permission, we may also use analytics and marketing tools to improve our services and measure performance. ' +
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

        '<div class="tc-privacy-category">' +
          '<div class="tc-privacy-category-top">' +
            '<div>' +
              '<h3>Marketing</h3>' +
              '<p>Helps Trinity Home Care measure advertising performance and provide more relevant marketing messages.</p>' +
            '</div>' +
            '<label class="tc-privacy-toggle">' +
              '<input type="checkbox" data-tc-purpose="marketing" />' +
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
    btn.textContent = 'Privacy Preferences';
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
        applyConsent({ analytics: true, marketing: true });
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
