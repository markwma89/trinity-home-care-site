/* ===================================================================
   TRINITY HOME CARE — How It Works Page JS
   Responsibilities: step data, timeline interaction, FAQ accordion,
   CTA form validation
   =================================================================== */

(function () {
  'use strict';

  const prefersReducedMotion =
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* -----------------------------------------------------------------
     Step data — single source of truth for all 5 step detail panels.
     prevLabel / nextLabel drive the Prev/Next navigation buttons.
     ----------------------------------------------------------------- */
  const STEPS = [
    {
      num: '01',
      title: 'Free Consultation',
      subtitle: 'a real conversation, not a sales call.',
      body: [
        "When you reach out to Trinity, you’re connected directly with a care coordinator — not a call center. We take the time to hear what’s happening, what you’re worried about, and what your loved one’s life looks like right now. There’s no script and no pressure to commit to anything.",
        "Most families tell us this first call feels more like talking to a knowledgeable neighbor than a business appointment. That’s exactly how we want it to feel."
      ],
      calloutLabel: 'What to expect',
      calloutItems: [
        "15–20 minute conversation — we do the listening",
        "Honest answers, even if the answer is “we may not be the right fit”",
        "No commitment, no paperwork, no follow-up pressure",
        "We’ll suggest a free in-home assessment if it makes sense"
      ],
      photo: 'assets/images/supporting/caregiver-talking-to-senior-chairside.jpg',
      photoAlt: 'Trinity caregiver in a warm conversation with a senior client at home',
      prevLabel: null,
      nextLabel: 'In-Home Assessment'
    },
    {
      num: '02',
      title: 'In-Home Assessment',
      subtitle: 'we come to you, and we listen carefully.',
      body: [
        "One of our care coordinators visits your loved one at home — not to evaluate or judge, but to truly understand. We look at their daily routine, their living environment, their health needs, and what they value most about their independence. This visit usually takes about an hour and feels like a relaxed conversation.",
        "Everything we learn shapes the personalized care plan we build together. There’s no pressure to decide anything during the visit."
      ],
      calloutLabel: 'What to expect',
      calloutItems: [
        'We visit at your home, on your schedule',
        "No forms to fill out beforehand — we ask the right questions when we’re there",
        "Your loved one’s preferences guide everything",
        'A draft care plan is ready within 24 hours of the visit'
      ],
      photo: 'assets/images/supporting/caregiver-reviewing-paperwork-with-senior.jpg',
      photoAlt: 'Care coordinator reviewing a care plan with a senior client at home',
      prevLabel: 'Free Consultation',
      nextLabel: 'Caregiver Matching'
    },
    {
      num: '03',
      title: 'Caregiver Matching',
      subtitle: 'chosen for fit, not just availability.',
      body: [
        "This is where Trinity is genuinely different. We don’t assign whoever is available on a given Tuesday. We study the care plan, learn what matters to your loved one — their routines, their sense of humor, their need for privacy or conversation — and hand-select a caregiver who is a real fit.",
        "Before care begins, we introduce the caregiver personally so nothing feels like a surprise."
      ],
      calloutLabel: 'What to expect',
      calloutItems: [
        'Match is based on personality, routine, and care needs — not schedule logistics',
        'You meet the caregiver before the first day of care',
        "If the match isn’t right, we find a new one quickly and without drama",
        'All caregivers are background-checked, bonded, and insured'
      ],
      photo: 'assets/images/supporting/team-caregiver-client-portrait.jpg',
      photoAlt: 'Trinity caregiver and client portrait showing genuine connection',
      prevLabel: 'In-Home Assessment',
      nextLabel: 'Care Begins'
    },
    {
      num: '04',
      title: 'Care Begins',
      subtitle: 'day one is supported, never dropped.',
      body: [
        "The first day of care is handled with intention. Your caregiver arrives knowing your loved one’s name, preferences, and the care plan. A Trinity coordinator checks in within the first few hours to make sure everything feels right. You’ll hear from us — you won’t need to chase us down.",
        "We treat the first week like an extended introduction, making small adjustments until the routine is natural and comfortable."
      ],
      calloutLabel: 'What to expect',
      calloutItems: [
        'Care coordinator check-in on day one',
        'Family update call after the first week',
        'Routine adjustments made as needed — your feedback drives them',
        '24/7 support line for existing clients from day one'
      ],
      photo: 'assets/images/supporting/caregiver-client-home-visit.jpg',
      photoAlt: 'Trinity caregiver on a warm first home care visit with a senior client',
      prevLabel: 'Caregiver Matching',
      nextLabel: 'Ongoing Partnership'
    },
    {
      num: '05',
      title: 'Ongoing Partnership',
      subtitle: 'care that grows with your family.',
      body: [
        "Care needs change over time, and a plan that was right six months ago may need to evolve. We schedule regular care plan reviews and stay in close contact with both families and caregivers. If something changes — a health event, a change in routine, a new need — we adjust quickly.",
        "Trinity isn’t a vendor you manage. We’re a partner who stays informed and stays engaged, for as long as your family needs us."
      ],
      calloutLabel: 'What to expect',
      calloutItems: [
        'Scheduled care plan reviews every 60–90 days',
        'Proactive family communication — we call you before you call us',
        'Care scales up or down as needs change',
        'No penalty for adjusting hours or schedule'
      ],
      photo: 'assets/images/supporting/caregiver-holding-senior-hand.jpg',
      photoAlt: 'Trinity caregiver holding the hand of a senior client, showing ongoing connection',
      prevLabel: 'Care Begins',
      nextLabel: null
    }
  ];

  /* -----------------------------------------------------------------
     DOM refs — all optional-chained; page degrades gracefully if a
     section is absent.
     ----------------------------------------------------------------- */
  const detailPanel  = document.getElementById('step-detail-panel');
  const stepCards    = document.querySelectorAll('.hiw-step-card');
  const dots         = document.querySelectorAll('.hiw-dot');
  const header       = document.getElementById('site-header');

  /* -----------------------------------------------------------------
     renderStep — builds detail panel HTML from data array.
     Called by activateStep every time the active step changes.
     ----------------------------------------------------------------- */
  function renderStep(index) {
    if (!detailPanel) return;
    const step = STEPS[index];

    const calloutItemsHTML = step.calloutItems
      .map(item => `<li class="hiw-detail-callout-item">${item}</li>`)
      .join('');

    const bodyHTML = step.body
      .map(p => `<p class="hiw-detail-body">${p}</p>`)
      .join('');

    const prevHTML = step.prevLabel
      ? `<button class="hiw-detail-prev" data-index="${index - 1}">← ${step.prevLabel}</button>`
      : `<span class="hiw-detail-prev hiw-detail-prev--hidden"></span>`;

    const nextHTML = step.nextLabel
      ? `<button class="hiw-detail-next" data-index="${index + 1}">Next: ${step.nextLabel} →</button>`
      : `<span class="hiw-detail-next hiw-detail-next--end">You’re all set — <a href="#cta-form" class="hiw-detail-cta-link">start the conversation</a>.</span>`;

    detailPanel.innerHTML = `
      <div class="hiw-detail-inner">
        <div class="hiw-detail-copy">
          <div class="hiw-detail-num" aria-hidden="true">${step.num}</div>
          <h2 class="hiw-detail-heading">${step.title} — <em>${step.subtitle}</em></h2>
          ${bodyHTML}
          <div class="hiw-detail-callout">
            <span class="hiw-detail-callout-label">${step.calloutLabel}</span>
            <ul class="hiw-detail-callout-list">${calloutItemsHTML}</ul>
          </div>
          <div class="hiw-detail-nav">${prevHTML}${nextHTML}</div>
        </div>
        <div class="hiw-detail-photo-col">
          <img src="${step.photo}"
               alt="${step.photoAlt}"
               class="hiw-detail-photo"
               loading="lazy">
        </div>
      </div>
    `;

    /* Bind prev/next buttons freshly after each render */
    detailPanel.querySelector('.hiw-detail-prev[data-index]')
      ?.addEventListener('click', e =>
        activateStep(parseInt(e.currentTarget.dataset.index, 10), true));
    detailPanel.querySelector('.hiw-detail-next[data-index]')
      ?.addEventListener('click', e =>
        activateStep(parseInt(e.currentTarget.dataset.index, 10), true));
  }

  /* -----------------------------------------------------------------
     activateStep — updates active state on cards/dots, renders panel,
     optionally smooth-scrolls to the detail section.
     ----------------------------------------------------------------- */
  function activateStep(index, shouldScroll) {
    stepCards.forEach((c, i) => {
      c.classList.toggle('is-active', i === index);
      c.setAttribute('aria-selected', i === index ? 'true' : 'false');
    });
    dots.forEach((d, i) => {
      d.classList.toggle('is-active', i === index);
      d.setAttribute('aria-selected', i === index ? 'true' : 'false');
    });

    renderStep(index);

    if (shouldScroll) {
      const target = document.getElementById('step-detail');
      if (!target) return;
      const offset = (header?.offsetHeight ?? 80) + 16;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      if (prefersReducedMotion) {
        window.scrollTo({ top });
      } else {
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  }

  /* -----------------------------------------------------------------
     Step card click / keyboard (Space/Enter)
     ----------------------------------------------------------------- */
  document.querySelector('.hiw-step-cards')
    ?.addEventListener('click', e => {
      const card = e.target.closest('.hiw-step-card');
      if (!card) return;
      activateStep(parseInt(card.dataset.step, 10), true);
    });

  document.querySelector('.hiw-step-cards')
    ?.addEventListener('keydown', e => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const card = e.target.closest('.hiw-step-card');
      if (!card) return;
      e.preventDefault();
      activateStep(parseInt(card.dataset.step, 10), true);
    });

  /* -----------------------------------------------------------------
     Timeline dot clicks
     ----------------------------------------------------------------- */
  document.querySelector('.hiw-dots')
    ?.addEventListener('click', e => {
      const dot = e.target.closest('.hiw-dot');
      if (!dot) return;
      activateStep(parseInt(dot.dataset.step, 10), true);
    });

  /* -----------------------------------------------------------------
     FAQ accordion — one item open at a time
     ----------------------------------------------------------------- */
  document.querySelector('.hiw-faq-list')
    ?.addEventListener('click', e => {
      const q = e.target.closest('.hiw-faq-q');
      if (!q) return;
      const item = q.closest('.hiw-faq-item');
      const isOpen = item.classList.contains('is-open');
      document.querySelectorAll('.hiw-faq-item').forEach(i => {
        i.classList.remove('is-open');
        i.querySelector('.hiw-faq-q')?.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('is-open');
        q.setAttribute('aria-expanded', 'true');
      }
    });

  /* -----------------------------------------------------------------
     CTA form — mirrors main.js contact form validation
     ----------------------------------------------------------------- */
  const ctaForm = document.getElementById('cta-form');
  ctaForm?.addEventListener('submit', function (e) {
    e.preventDefault();
    const required = this.querySelectorAll('[required]');
    let isValid = true;
    required.forEach(field => {
      field.style.borderColor = '';
      if (!field.value.trim()) {
        isValid = false;
        field.style.borderColor = 'rgba(224,112,112,0.8)';
        if (isValid === false && field === required[0]) field.focus();
      }
    });
    if (!isValid) return;
    const btn = this.querySelector('[type="submit"]');
    btn.textContent = 'Sending…';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = 'Request Sent';
      btn.style.background = 'var(--color-teal-muted)';
    }, 1200);
  });

  /* -----------------------------------------------------------------
     Init — activate Step 1 on page load (no scroll)
     ----------------------------------------------------------------- */
  activateStep(0, false);

})();
