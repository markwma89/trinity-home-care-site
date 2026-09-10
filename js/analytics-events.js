/* ===================================================================
   TRINITY HOME CARE — GA4 key-event (conversion) tracking
   -------------------------------------------------------------------
   Dependency-free. Uses DELEGATED listeners on `document`, so it works
   on every page and on dynamically-injected elements without any
   per-element wiring.

   Relies on the global gtag() defined by the GA4 (gtag.js) snippet in
   <head>. Every call is guarded with `typeof gtag === 'function'`, so it
   safely no-ops until a real Measurement ID replaces the G-XXXXXXXXXX
   placeholder.

   Key events fired:
     generate_lead  — any <form> submit (contact + careers forms)
                      params: { form_id, page_path }
     click_to_call  — click on a[href^="tel:"] (phone numbers)
                      params: { phone, page_path }
     cta_click      — click on a primary CTA: a `.btn`/`.cta` class, or a
                      link to a conversion page (contact / careers /
                      consultation …). Nav CTAs, FAQ toggles and form
                      submit buttons are intentionally excluded.
                      params: { label, href, page_path }
   =================================================================== */
(function () {
  'use strict';

  // Hrefs that indicate conversion intent on this site (contact + careers
  // funnels, plus the "free consultation" schedule anchors).
  var CONVERSION_HREF = /(contact|careers|consultation|apply|quote|book|booking|schedule|get-?started|appointment|estimate|request)/i;

  function track(name, params) {
    if (typeof gtag === 'function') {
      gtag('event', name, params);
    }
  }

  function pagePath() {
    return location.pathname;
  }

  // True when the element is a form's submit control — those clicks are
  // already captured by the generate_lead form-submit handler, so never
  // double-count them as a cta_click (covers .btn-submit-full, etc.).
  function isFormSubmitControl(el) {
    return el.type === 'submit' && el.form;
  }

  // True when the element lives inside a <nav> (desktop nav-container,
  // mobile nav, or footer legal nav). Nav CTAs such as .nav-cta-btn share
  // the .btn class, so they must be excluded here rather than by class.
  function isInNav(el) {
    return !!(el.closest && el.closest('nav'));
  }

  // Explicit CTA styling: a `btn` or `cta` class token, or any variant
  // whose class name contains "cta". FAQ toggles (.hiw-faq-q) carry no
  // such token and therefore never match.
  function hasCtaClass(el) {
    var list = el.classList;
    if (list && (list.contains('btn') || list.contains('cta'))) return true;
    return /cta/i.test(el.getAttribute('class') || '');
  }

  function isCta(el, href) {
    if (isFormSubmitControl(el)) return false;
    if (isInNav(el)) return false;
    if (hasCtaClass(el)) return true;
    if (el.nodeName === 'A' && href && CONVERSION_HREF.test(href)) return true;
    return false;
  }

  function onSubmit(e) {
    var form = e.target;
    if (!form || form.nodeName !== 'FORM') return;
    var id = form.getAttribute('id') || form.getAttribute('name') || 'unknown';
    track('generate_lead', { form_id: id, page_path: pagePath() });
  }

  function onClick(e) {
    // Resolve to the nearest anchor or button the click landed on.
    var el = e.target && e.target.closest ? e.target.closest('a, button') : null;
    if (!el) return;

    var href = el.getAttribute('href') || '';

    // 1) click_to_call — tel: links (handled first; not also a cta_click)
    if (el.nodeName === 'A' && href.indexOf('tel:') === 0) {
      track('click_to_call', { phone: href.slice(4), page_path: pagePath() });
      return;
    }

    // 2) cta_click — primary calls to action
    if (isCta(el, href)) {
      track('cta_click', {
        label: (el.textContent || '').trim().slice(0, 100),
        href: href,
        page_path: pagePath()
      });
    }
  }

  function init() {
    // Capture phase so we fire even if a page handler calls stopPropagation,
    // and before an AJAX form handler's preventDefault (the submit/click
    // event still reaches us — intent is what we count).
    document.addEventListener('submit', onSubmit, true);
    document.addEventListener('click', onClick, true);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
