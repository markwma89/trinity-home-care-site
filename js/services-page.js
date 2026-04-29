/* ===================================================================
   TRINITY HOME CARE — Service Page JavaScript
   Loaded only on services/*.html pages.
   =================================================================== */

(function () {
  'use strict';

  /* -----------------------------------------------------------------
     FAQ Accordion — one open at a time
     ----------------------------------------------------------------- */
  const faqItems = document.querySelectorAll('.service-faq-item');

  faqItems.forEach((item) => {
    const btn   = item.querySelector('.service-faq-btn');
    const panel = item.querySelector('.service-faq-panel');
    if (!btn || !panel) return;

    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';

      // Close all
      faqItems.forEach((other) => {
        const ob = other.querySelector('.service-faq-btn');
        const op = other.querySelector('.service-faq-panel');
        if (ob) ob.setAttribute('aria-expanded', 'false');
        if (op) op.hidden = true;
      });

      // Open clicked if it was closed
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        panel.hidden = false;
      }
    });
  });

}());
