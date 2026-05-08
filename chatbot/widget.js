// chatbot-platform/widget/widget.js
(function () {
  'use strict';

  /* ========== BOOTSTRAP ========== */
  const scriptTag = document.currentScript || document.querySelector('script[data-site-id]');
  const SITE_ID = scriptTag ? scriptTag.dataset.siteId : null;
  const WORKER_URL = (scriptTag && scriptTag.dataset.workerUrl)
    ? scriptTag.dataset.workerUrl.replace(/\/$/, '')
    : 'https://chatbot-platform.mwilliams-923.workers.dev';
  const MAX_HISTORY = 20;

  if (!SITE_ID) {
    console.warn('[chatbot] missing data-site-id attribute on script tag');
    return;
  }

  const STORAGE_KEY = 'chat_v1_' + SITE_ID;

  /* Runtime config — populated after /config fetch */
  let cfg = null;

  /* DOM element refs */
  let root, wrap, launcher, window_, messages, input, sendBtn, badge;

  /* Lead capture state */
  let leadStepIndex = 0;

  /* ========== CONFIG LOADING ========== */
  async function fetchConfig() {
    return fetch(`${WORKER_URL}/config`, {
      method: 'GET',
      headers: { 'X-Site-Id': SITE_ID },
    });
  }

  async function loadConfig() {
    let res;
    try {
      res = await fetchConfig();
    } catch {
      await new Promise(r => setTimeout(r, 1500));
      try { res = await fetchConfig(); }
      catch {
        console.warn(`[chatbot] config failed for siteId: ${SITE_ID} (network error)`);
        return false;
      }
    }

    if (!res.ok) {
      await new Promise(r => setTimeout(r, 1500));
      try { res = await fetchConfig(); }
      catch {
        console.warn(`[chatbot] config failed for siteId: ${SITE_ID}`);
        return false;
      }
      if (!res.ok) {
        console.warn(`[chatbot] config failed for siteId: ${SITE_ID} (${res.status})`);
        return false;
      }
    }

    cfg = await res.json();
    console.log(
      `[chatbot] siteId: ${cfg.siteId} | configVersion: ${cfg.configVersion} | widgetVersion: ${cfg.widgetVersion}`
    );
    return true;
  }

  /* ========== THEME INJECTION ========== */
  function applyTheme() {
    const t = cfg.theme;
    const style = document.createElement('style');
    style.textContent = `
      #fg-chat-root {
        --chat-primary:      ${t.primaryColor};
        --chat-accent:       ${t.accentColor};
        --chat-bg:           ${t.bgColor};
        --chat-panel-bg:     ${t.panelBg};
        --chat-text:         ${t.textColor};
        --chat-muted:        ${t.mutedTextColor};
        --chat-font-heading: ${t.fontHeading};
        --chat-font-body:    ${t.fontBody};
        --fg-chat-z:         ${cfg.widgetBehavior.zIndex};
      }
    `;
    document.head.appendChild(style);

    // Apply launcher position and visibility classes
    if (cfg.theme.launcherStyle !== 'spinning-border') root.classList.add('fg-chat-no-spin');
    if (cfg.widgetBehavior.showOnDesktop === false) root.classList.add('fg-chat-hide-desktop');
    if (cfg.widgetBehavior.showOnMobile  === false) root.classList.add('fg-chat-hide-mobile');
  }

  /* ========== STATE ========== */
  function getState() {
    try { return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '{}'); }
    catch { return {}; }
  }
  function setState(u) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ siteId: SITE_ID, ...getState(), ...u }));
  }
  function getMessages() { return getState().messages || []; }
  function pushMessage(role, content) {
    const msgs = getMessages();
    msgs.push({ role, content });
    setState({ messages: msgs.slice(-MAX_HISTORY) });
  }
  function getLeadData() { return getState().leadData || {}; }
  function setLeadField(id, value) {
    const ld = getLeadData();
    ld[id] = value;
    setState({ leadData: ld });
  }
  function isLeadSubmitted() { return getState().leadSubmitted || false; }
  function markLeadSubmitted() { setState({ leadSubmitted: true }); }
  function getStage() { return getState().stage || 'greeting'; }
  function setStage(s) { setState({ stage: s }); }
  function getChatOpen() { return getState().isOpen || false; }
  function setChatOpen(v) { setState({ isOpen: v }); }

  /* ========== DOM HELPERS ========== */
  function el(tag, cls, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }
  function svgIcon(paths, vb = '0 0 24 24') {
    return `<svg viewBox="${vb}" fill="none" stroke="currentColor" stroke-width="2"
      stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
  }

  /* ========== BUILD DOM ========== */
  function buildRoot() {
    root = el('div', '');
    root.id = 'fg-chat-root';
    document.body.appendChild(root);
  }

  function buildLauncher() {
    wrap = el('div', 'fg-chat-launcher-wrap');

    launcher = el('button', 'fg-chat-launcher');
    launcher.setAttribute('aria-label', `Open ${cfg.businessName} chat assistant`);
    launcher.setAttribute('aria-expanded', 'false');
    launcher.setAttribute('aria-controls', 'fg-chat-window');
    launcher.innerHTML = svgIcon(
      '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    );

    badge = el('span', 'fg-chat-badge');
    badge.setAttribute('aria-label', 'New message');
    badge.hidden = true;
    launcher.appendChild(badge);
    wrap.appendChild(launcher);
    root.appendChild(wrap);
  }

  function buildWindow() {
    const av = cfg.theme.avatar;
    const avatarHtml = av.logoUrl
      ? `<img src="${escapeHtml(av.logoUrl)}" alt="${escapeHtml(cfg.businessName)}" style="width:36px;height:36px;border-radius:50%;object-fit:cover">`
      : escapeHtml(av.initials);

    window_ = el('div', 'fg-chat-window');
    window_.setAttribute('id', 'fg-chat-window');
    window_.setAttribute('role', 'dialog');
    window_.setAttribute('aria-label', `${cfg.businessName} Chat Assistant`);
    window_.setAttribute('aria-modal', 'true');

    const header = el('div', 'fg-chat-header');
    header.innerHTML = `
      <div class="fg-chat-header-avatar">${avatarHtml}</div>
      <div class="fg-chat-header-info">
        <div class="fg-chat-header-name">${escapeHtml(cfg.businessName)}</div>
        <div class="fg-chat-header-sub">AI Assistant</div>
      </div>
    `;
    const closeBtn = el('button', 'fg-chat-header-close');
    closeBtn.setAttribute('aria-label', 'Close chat');
    closeBtn.innerHTML = svgIcon(
      '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>'
    );
    closeBtn.addEventListener('click', closeChat);
    header.appendChild(closeBtn);

    messages = el('div', 'fg-chat-messages');
    messages.setAttribute('aria-live', 'polite');
    messages.setAttribute('aria-relevant', 'additions');
    messages.setAttribute('tabindex', '0');

    const inputArea = el('div', 'fg-chat-input-area');
    input = el('input', 'fg-chat-input');
    input.setAttribute('id', 'fg-chat-input');
    input.setAttribute('name', 'fg-chat-input');
    input.setAttribute('type', 'text');
    input.setAttribute('placeholder', cfg.widgetBehavior.placeholderText);
    input.setAttribute('aria-label', 'Type your message');
    input.setAttribute('autocomplete', 'off');
    input.setAttribute('maxlength', '1000');

    sendBtn = el('button', 'fg-chat-send');
    sendBtn.setAttribute('aria-label', 'Send message');
    sendBtn.setAttribute('disabled', '');
    sendBtn.innerHTML = svgIcon(
      '<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>'
    );

    inputArea.appendChild(input);
    inputArea.appendChild(sendBtn);
    window_.appendChild(header);
    window_.appendChild(messages);
    window_.appendChild(inputArea);
    root.appendChild(window_);
  }

  /* ========== OPEN / CLOSE ========== */
  function openChat() {
    setChatOpen(true);
    window_.classList.add('is-open');
    wrap.classList.add('is-open');
    launcher.setAttribute('aria-expanded', 'true');
    badge.hidden = true;
    input.focus();
    const msgs = getMessages();
    if (msgs.length === 0) renderEmpty();
    else renderAllMessages();
  }

  function closeChat() {
    setChatOpen(false);
    window_.classList.remove('is-open');
    wrap.classList.remove('is-open');
    launcher.setAttribute('aria-expanded', 'false');
    launcher.focus();
  }

  /* ========== RENDER HELPERS ========== */
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function clearMessages() { messages.innerHTML = ''; }

  function renderEmpty() {
    clearMessages();
    const av = cfg.theme.avatar;
    const avatarHtml = av.logoUrl
      ? `<img src="${escapeHtml(av.logoUrl)}" alt="${escapeHtml(cfg.businessName)}" style="width:48px;height:48px;border-radius:50%;object-fit:cover">`
      : escapeHtml(av.initials);

    const empty = el('div', 'fg-chat-empty');
    empty.innerHTML = `
      <div class="fg-chat-empty-avatar">${avatarHtml}</div>
      <div class="fg-chat-empty-title">${escapeHtml(cfg.widgetBehavior.welcomeMessage)}</div>
    `;
    const chipsWrap = el('div', 'fg-chat-empty-chips');
    (cfg.widgetBehavior.quickReplies || []).forEach((label) => {
      const chip = el('button', 'fg-chat-chip', escapeHtml(label));
      chip.addEventListener('click', () => handleChipClick(label));
      chipsWrap.appendChild(chip);
    });
    empty.appendChild(chipsWrap);
    messages.appendChild(empty);
  }

  function renderAllMessages() {
    clearMessages();
    let prevRole = null;
    getMessages().forEach((m) => {
      const isFirst = m.role !== prevRole;
      appendBubble(m.role, m.content, isFirst);
      prevRole = m.role;
    });
    scrollToBottom();
  }

  function appendBubble(role, content, showAvatar = false) {
    const isBot = role === 'assistant' || role === 'bot';
    const row = el('div',
      `fg-chat-msg fg-chat-msg--${isBot ? 'bot' : 'user'}${isBot && showAvatar ? ' has-avatar' : ''}`
    );
    if (isBot) {
      const avatar = el('div', 'fg-chat-msg-avatar', escapeHtml(cfg.theme.avatar.initials));
      const bubble = el('div', 'fg-chat-bubble', escapeHtml(content));
      row.appendChild(avatar);
      row.appendChild(bubble);
    } else {
      row.appendChild(el('div', 'fg-chat-bubble', escapeHtml(content)));
    }
    messages.appendChild(row);
    scrollToBottom();
    return row;
  }

  function appendBotMessage(content, chips = [], action = null) {
    appendBubble('assistant', content, true);
    if (chips.length > 0) {
      const chipsWrap = el('div', 'fg-chat-chips');
      chips.forEach((label) => {
        const chip = el('button', 'fg-chat-chip', escapeHtml(label));
        chip.addEventListener('click', () => { chipsWrap.remove(); handleChipClick(label); });
        chipsWrap.appendChild(chip);
      });
      messages.appendChild(chipsWrap);
    }
    if (action) renderCtaAction(action);
    scrollToBottom();
  }

  function renderCtaAction(action) {
    const row = el('div', 'fg-chat-cta-row');
    if (action === 'show_intake_cta' && cfg.routing.intakeUrl) {
      const btn = el('a', 'fg-chat-btn fg-chat-btn--primary', 'Start the Intake Form →');
      btn.href = cfg.routing.intakeUrl;
      row.appendChild(btn);
    } else if (action === 'show_scheduler_cta' && cfg.routing.schedulerUrl) {
      const btn = el('a', 'fg-chat-btn fg-chat-btn--primary',
        cfg.booking.bookingPromptText ? 'Book a Call →' : 'Schedule →'
      );
      btn.href = cfg.routing.schedulerUrl;
      btn.target = '_blank';
      btn.rel = 'noopener noreferrer';
      row.appendChild(btn);
    } else if (action === 'show_contact_cta' && cfg.routing.contactUrl) {
      const btn = el('a', 'fg-chat-btn fg-chat-btn--secondary', 'Contact Us →');
      btn.href = cfg.routing.contactUrl;
      row.appendChild(btn);
    }
    if (row.children.length > 0) messages.appendChild(row);
  }

  function showTyping() {
    const typing = el('div', 'fg-chat-typing');
    typing.id = 'fg-chat-typing';
    typing.appendChild(el('div', 'fg-chat-msg-avatar', escapeHtml(cfg.theme.avatar.initials)));
    const dots = el('div', 'fg-chat-typing-dots');
    dots.innerHTML = `
      <span class="fg-chat-typing-dot"></span>
      <span class="fg-chat-typing-dot"></span>
      <span class="fg-chat-typing-dot"></span>
    `;
    typing.appendChild(dots);
    messages.appendChild(typing);
    scrollToBottom();
  }

  function hideTyping() {
    const t = document.getElementById('fg-chat-typing');
    if (t) t.remove();
  }

  function scrollToBottom() { messages.scrollTop = messages.scrollHeight; }

  /* ========== INPUT EVENTS ========== */
  function bindInputEvents() {
    input.addEventListener('input', () => {
      sendBtn.disabled = input.value.trim().length === 0;
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey && input.value.trim()) {
        e.preventDefault();
        handleSend();
      }
    });
    sendBtn.addEventListener('click', handleSend);
    launcher.addEventListener('click', () => (getChatOpen() ? closeChat() : openChat()));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && getChatOpen()) closeChat();
    });
    window_.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab' || !getChatOpen()) return;
      const focusable = [...window_.querySelectorAll(
        'button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )];
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  /* ========== WORKER REQUESTS ========== */
  async function sendToWorker(msgs) {
    const res = await fetch(`${WORKER_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Site-Id': SITE_ID,
      },
      body: JSON.stringify({ siteId: SITE_ID, messages: msgs }),
    });
    if (!res.ok) throw new Error(`Worker error ${res.status}`);
    return res.json();
  }

  async function submitLead(leadData) {
    const res = await fetch(`${WORKER_URL}/lead`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Site-Id': SITE_ID,
      },
      body: JSON.stringify({ siteId: SITE_ID, ...leadData }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || `Lead error ${res.status}`);
    }
    return res.json();
  }

  /* ========== SEND ========== */
  async function handleSend(textOverride) {
    const text = typeof textOverride === 'string' ? textOverride : input.value.trim();
    if (!text) return;

    if (getStage() === 'lead_capture') { handleLeadInput(text); return; }

    input.value = '';
    sendBtn.disabled = true;
    if (messages.querySelector('.fg-chat-empty')) messages.innerHTML = '';
    appendBubble('user', text);
    pushMessage('user', text);
    showTyping();

    try {
      const { reply, action } = await sendToWorker(getMessages());
      hideTyping();
      appendBotMessage(reply, [], action);
      pushMessage('assistant', reply);
      processAction(action);
    } catch {
      hideTyping();
      appendBotMessage(
        `I'm having a bit of trouble right now. You can reach ${escapeHtml(cfg.businessName)} directly at ${escapeHtml(cfg.routing.contactUrl || 'our contact page')}.`,
        [], 'show_intake_cta'
      );
    }
  }

  function handleChipClick(label) {
    if (messages.querySelector('.fg-chat-empty')) messages.innerHTML = '';
    appendBubble('user', label);
    pushMessage('user', label);
    input.value = '';
    sendBtn.disabled = true;
    showTyping();
    sendToWorker(getMessages())
      .then(({ reply, action }) => {
        hideTyping();
        appendBotMessage(reply, [], action);
        pushMessage('assistant', reply);
        processAction(action);
      })
      .catch(() => {
        hideTyping();
        appendBotMessage(
          `I'm having trouble right now. Please contact ${escapeHtml(cfg.businessName)} directly.`,
          [], null
        );
      });
  }

  function processAction(action) {
    if (action === 'capture_lead' && !isLeadSubmitted()) {
      setStage('lead_capture');
      startLeadCapture();
    }
  }

  /* ========== LEAD CAPTURE — SCHEMA DRIVEN ========== */
  function buildLeadSteps() {
    return [...(cfg.leadCapture.fields || [])]
      .sort((a, b) => a.order - b.order)
      .map(f => ({
        id:               f.id,
        prompt:           f.helperText ? `${f.label}\n${f.helperText}` : f.label,
        required:         f.required,
        skippable:        f.skippable || false,
        minLength:        f.minLength || 0,
        validationMessage:f.validationMessage || `Please enter your ${f.label.toLowerCase()}.`,
      }));
  }

  function startLeadCapture() {
    leadStepIndex = 0;
    const steps = buildLeadSteps();
    if (steps.length === 0) { finishLeadCapture(); return; }
    appendBotMessage(steps[0].prompt, [], null);
    pushMessage('assistant', steps[0].prompt);
  }

  function handleLeadInput(value) {
    const steps = buildLeadSteps();
    if (leadStepIndex >= steps.length) return;

    const step = steps[leadStepIndex];
    input.value = '';
    sendBtn.disabled = true;
    appendBubble('user', value);
    pushMessage('user', value);

    const trimmed = value.trim();

    if (step.skippable && (!trimmed || trimmed.toLowerCase() === 'skip')) {
      // optional — skip without saving
    } else if (step.required && trimmed.length === 0) {
      appendBotMessage(step.validationMessage, [], null);
      pushMessage('assistant', step.validationMessage);
      return; // don't advance
    } else if (step.minLength && trimmed.length < step.minLength) {
      appendBotMessage(step.validationMessage, [], null);
      pushMessage('assistant', step.validationMessage);
      return;
    } else {
      setLeadField(step.id, trimmed);
    }

    leadStepIndex++;

    if (leadStepIndex < steps.length) {
      appendBotMessage(steps[leadStepIndex].prompt, [], null);
      pushMessage('assistant', steps[leadStepIndex].prompt);
    } else {
      finishLeadCapture();
    }
  }

  function finishLeadCapture() {
    setStage('routed');
    const submittingMsg = `Got it — sending your details to ${cfg.businessName} now.`;
    appendBotMessage(submittingMsg, [], null);
    pushMessage('assistant', submittingMsg);

    submitLead(getLeadData())
      .then(() => {
        markLeadSubmitted();
        appendBotMessage(
          cfg.booking.confirmationMessage ||
            `Done! Your info has been sent. We'll be in touch soon.`,
          [], 'show_intake_cta'
        );
        pushMessage('assistant', 'Lead submitted successfully.');
      })
      .catch(() => {
        appendBotMessage(
          `Something went wrong sending your details. Please contact ${escapeHtml(cfg.businessName)} directly.`,
          [], null
        );
      });
  }

  /* ========== INIT ========== */
  async function init() {
    const ok = await loadConfig();
    if (!ok) return; // silent fail — no widget rendered

    buildRoot();
    applyTheme();
    buildLauncher();
    buildWindow();
    bindInputEvents();

    if (getChatOpen()) openChat();
    if (cfg.widgetBehavior.autoOpen) openChat();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
