/* ===================================================================
   TRINITY HOME CARE — Main JavaScript
   Responsibilities: sticky header, mobile menu, scroll-reveal,
   smooth anchor scroll, stat counter animation,
   reduced-motion compliance
   =================================================================== */

(function () {
  'use strict';

  const prefersReducedMotion =
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* -----------------------------------------------------------------
     Sticky Header
     Toggles .is-scrolled at 64px to swap logo and update header styles.
     ----------------------------------------------------------------- */
  const header = document.getElementById('site-header');

  function syncHeader() {
    header.classList.toggle('is-scrolled', window.scrollY > 64);
  }

  window.addEventListener('scroll', syncHeader, { passive: true });
  syncHeader();

  /* -----------------------------------------------------------------
     Mobile Navigation Dropdown
     Dropdown panel anchored to header bottom. Aria-managed, keyboard
     accessible, closes on outside click or Escape.
     ----------------------------------------------------------------- */
  const hamburger   = document.getElementById('nav-hamburger');
  const mobileNav   = document.getElementById('nav-mobile');
  const mobileLinks = mobileNav ? mobileNav.querySelectorAll('a') : [];

  function openMenu() {
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.setAttribute('aria-label', 'Close navigation menu');
    mobileNav.classList.add('is-open');
    mobileNav.removeAttribute('aria-hidden');
    const firstLink = mobileNav.querySelector('button, a');
    if (firstLink) firstLink.focus();
  }

  function closeMenu() {
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open navigation menu');
    mobileNav.classList.remove('is-open');
    mobileNav.setAttribute('aria-hidden', 'true');
  }

  hamburger?.addEventListener('click', e => {
    e.stopPropagation();
    hamburger.getAttribute('aria-expanded') === 'true'
      ? closeMenu()
      : openMenu();
  });

  mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

  // Close when clicking outside the header
  document.addEventListener('click', e => {
    if (
      mobileNav?.classList.contains('is-open') &&
      !header?.contains(e.target)
    ) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobileNav?.classList.contains('is-open')) {
      closeMenu();
      hamburger?.focus();
    }
  });

  /* -----------------------------------------------------------------
     Scroll-Reveal Animations
     IntersectionObserver triggers .is-visible on [data-animate] elements.
     Skipped for users who prefer reduced motion.
     ----------------------------------------------------------------- */
  const animatedElements = document.querySelectorAll('[data-animate]');

  if (prefersReducedMotion) {
    animatedElements.forEach(el => el.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -24px 0px' }
    );

    animatedElements.forEach(el => revealObserver.observe(el));
  }

  /* -----------------------------------------------------------------
     Stat Counter Animation
     Counts up from 0 to [data-count-to] when the stats strip enters
     the viewport. Skipped for reduced-motion users.
     ----------------------------------------------------------------- */
  function animateCounter(el, target, duration) {
    const start     = performance.now();

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased    = 1 - Math.pow(1 - progress, 3);
      const current  = Math.round(target * eased);
      el.textContent = current.toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  if (!prefersReducedMotion) {
    const counterEls = document.querySelectorAll('[data-count-to]');

    if (counterEls.length) {
      const counterObserver = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const el     = entry.target;
              const target = parseInt(el.getAttribute('data-count-to'), 10);
              animateCounter(el, target, 1400);
              counterObserver.unobserve(el);
            }
          });
        },
        { threshold: 0.5 }
      );

      counterEls.forEach(el => counterObserver.observe(el));
    }
  }

  /* -----------------------------------------------------------------
     Smooth Anchor Scroll
     Offsets for the fixed header height.
     ----------------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const offset = (header?.offsetHeight ?? 80) + 16;
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* -----------------------------------------------------------------
     Contact Form — client-side validation feedback
     The form action must be wired to a backend or form service.
     ----------------------------------------------------------------- */
  const contactForm = document.getElementById('contact-form');

  contactForm?.addEventListener('submit', function (e) {
    e.preventDefault();

    const requiredFields = this.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
      field.style.borderColor = '';
      if (!field.value.trim()) {
        isValid = false;
        field.style.borderColor = 'rgba(224, 112, 112, 0.8)';
        if (isValid === false && field === requiredFields[0]) field.focus();
      }
    });

    if (!isValid) return;

    const submitBtn  = this.querySelector('[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending\u2026';
    submitBtn.disabled = true;

    // Replace setTimeout with real fetch/POST when wiring to a backend or form service.
    setTimeout(() => {
      window.location.href = 'thank-you.html';
    }, 800);
  });

  /* -----------------------------------------------------------------
     Careers Form — client-side validation feedback
     The form action must be wired to a backend or form service.
     ----------------------------------------------------------------- */
  const careersForm = document.getElementById('careers-form');

  careersForm?.addEventListener('submit', function (e) {
    e.preventDefault();

    const requiredFields = this.querySelectorAll('[required]');
    let isValid = true;
    let firstInvalid = null;

    requiredFields.forEach(field => {
      field.style.borderColor = '';

      // Checkbox validity check
      if (field.type === 'checkbox') {
        const wrap = field.closest('.form-check-wrap');
        if (!field.checked) {
          isValid = false;
          if (wrap) wrap.classList.add('is-invalid');
          if (!firstInvalid) firstInvalid = field;
        } else {
          if (wrap) wrap.classList.remove('is-invalid');
        }
        return;
      }

      // Radio group: check at least one in the group is selected
      if (field.type === 'radio') {
        const group = this.querySelectorAll(`[name="${field.name}"]`);
        const anyChecked = Array.from(group).some(r => r.checked);
        if (!anyChecked) {
          isValid = false;
          if (!firstInvalid) firstInvalid = field;
        }
        return;
      }

      if (!field.value.trim()) {
        isValid = false;
        field.style.borderColor = 'rgba(224, 112, 112, 0.8)';
        if (!firstInvalid) firstInvalid = field;
      }
    });

    if (!isValid) {
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    const submitBtn = this.querySelector('[type="submit"]');
    submitBtn.textContent = 'Submitting…';
    submitBtn.disabled = true;

    // Replace setTimeout with real fetch/POST when wiring to a backend or form service.
    setTimeout(() => {
      window.location.href = 'careers-thank-you.html';
    }, 800);
  });

  /* -----------------------------------------------------------------
     Desktop nav dropdown — hover intent (150ms) + keyboard + outside click
     ----------------------------------------------------------------- */
  const dropdowns = document.querySelectorAll('.nav-has-dropdown');
  dropdowns.forEach((el) => {
    let timer;
    const trigger = el.querySelector('.nav-dropdown-trigger');
    if (!trigger) return;

    el.addEventListener('mouseenter', () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        trigger.setAttribute('aria-expanded', 'true');
        el.classList.add('is-open');
      }, 150);
    });

    el.addEventListener('mouseleave', () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        trigger.setAttribute('aria-expanded', 'false');
        el.classList.remove('is-open');
      }, 150);
    });

    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const isOpen = el.classList.contains('is-open');
        trigger.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
        el.classList.toggle('is-open', !isOpen);
      }
      if (e.key === 'Escape') {
        trigger.setAttribute('aria-expanded', 'false');
        el.classList.remove('is-open');
        trigger.focus();
      }
    });
  });

  document.addEventListener('click', (e) => {
    dropdowns.forEach((el) => {
      if (!el.contains(e.target)) {
        const trigger = el.querySelector('.nav-dropdown-trigger');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
        el.classList.remove('is-open');
      }
    });
  });

  /* -----------------------------------------------------------------
     Mobile nav sub-dropdown accordion
     ----------------------------------------------------------------- */
  document.querySelectorAll('.mobile-nav-trigger').forEach((btn) => {
    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
      const list = btn.nextElementSibling;
      if (list) list.hidden = !isOpen;
    });
  });

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
    overlay.setAttribute('aria-hidden', 'true');
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
      overlay.removeAttribute('aria-hidden');
      overlay.classList.add('is-visible');
      requestAnimationFrame(() => emailInput.focus());
    }

    function onKeydown(e) {
      if (e.key === 'Escape' && overlay.classList.contains('is-visible')) closeModal();
    }

    function closeModal() {
      suppress();
      document.removeEventListener('keydown', onKeydown);
      overlay.classList.remove('is-visible');
      overlay.setAttribute('aria-hidden', 'true');
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
    document.addEventListener('keydown', onKeydown);

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
        setTimeout(() => {
          overlay.classList.remove('is-visible');
          overlay.setAttribute('aria-hidden', 'true');
        }, 3000);
      } catch {
        submitBtn.textContent = 'Stay Informed';
        submitBtn.disabled = false;
        errorEl.textContent = 'Something went wrong. Please try again.';
      }
    });
  })();

})();
