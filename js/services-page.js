/* ===================================================================
   TRINITY HOME CARE — Service Page JavaScript
   Loaded only on services/*.html pages.
   Responsibilities: FAQ accordion, CTA form validation.
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

  /* -----------------------------------------------------------------
     CTA Form validation
     ----------------------------------------------------------------- */
  const form = document.getElementById('cta-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const requiredFields = form.querySelectorAll('[required]');
    let firstInvalid     = null;

    requiredFields.forEach((field) => {
      field.style.borderColor = '';
      if (!field.value.trim()) {
        field.style.borderColor = 'rgba(224, 112, 112, 0.8)';
        if (!firstInvalid) firstInvalid = field;
      }
    });

    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled    = true;

    // Replace with real endpoint (Netlify, Formspree, etc.) when ready
    setTimeout(() => {
      submitBtn.textContent = 'Request Sent ✓';
      submitBtn.style.background = 'var(--color-teal-muted, #4a7a7f)';
    }, 1200);
  });

}());
