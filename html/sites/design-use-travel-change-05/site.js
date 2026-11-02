// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    overlay: (base, S) => function overlay(ctx) {
      const { K } = S;
      const { rng, util, kind } = ctx;
      const { text } = ctx.content.bannerText(rng, kind === 'banner' ? 'notice' : kind);
      const word = ctx.lang && ctx.lang !== 'en' && ctx.word ? ctx.word : null;
      const el = util.el('div', `ref-ov ref-ov-${kind}`, document.body);
      el.dataset.role = 'overlay';
      const box = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
      util.el('div', 'ref-ov-text', box, word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text);
      const row = util.el('div', 'ref-ov-row', box);
      const btn = (label, how, primary) => {
        if (word && K.button[label]) label = word(K.button[label]);
        const b = util.el('button', primary ? 'ref-ov-btn ref-ov-primary' : 'ref-ov-btn', row, label);
        b.type = 'button';
        b.addEventListener('click', () => (how ? ctx.dismiss(how) : env.log('overlay-click', { label })));
        return b;
      };
      let dismiss;
      if (kind === 'cookie') {
        if (rng.bool(0.5)) btn('Settings', null, false);
        btn(rng.pick(['Reject all', 'Necessary only']), 'reject', false);
        dismiss = btn(rng.pick(['Accept all', 'Accept', 'Got it']), 'accept', true);
      } else if (kind === 'promo') {
        dismiss = btn(rng.pick(['No thanks', 'Maybe later', 'Close']), 'close', false);
        btn(rng.pick(['Upgrade now', 'Start trial', 'Learn more']), null, true);
      } else if (kind === 'banner') {
        dismiss = btn('Dismiss', 'close', false);
      } else {
        dismiss = btn('×', 'close', false);
        dismiss.setAttribute('aria-label', word ? word('close') : 'Close');
      }
      if (kind === 'banner') {
        const band = document.querySelector('body > .ref-instruction') || document.querySelector('.ref-task');
        if (band) el.style.top = `${band.getBoundingClientRect().bottom}px`;
      }
      if (kind === 'cookie' || kind === 'banner') {
        const emblem = util.el('span', 'ref-ov-info', el, kind === 'cookie' ? 'i' : '⚑');
        el.prepend(emblem);
      }
      if (kind === 'chat' || kind === 'promo') {
        const title = util.el('div', 'ref-ov-title', box, kind === 'chat' ? 'Chat with us' : 'Stay in the know');
        box.prepend(title);
        if (kind === 'chat') {
          title.append(dismiss);
          const compose = util.el('div', 'ref-chat-compose', box);
          const message = util.el('input', '', compose);
          message.type = 'text';
          message.placeholder = 'Type a message…';
          message.setAttribute('aria-label', 'Chat message');
          const send = util.el('button', 'ref-ov-btn', compose, 'Send');
          send.type = 'button';
          send.addEventListener('click', () => env.log('overlay-click', {label:'Send'}));
        }
        else {
          const x = util.el('button', 'ref-ov-close', title, '×');
          x.type = 'button';
          x.setAttribute('aria-label', word ? word('close') : 'Close');
          x.addEventListener('click', () => ctx.dismiss('close'));
          const message = box.querySelector('.ref-ov-text');
          const content = util.el('div', 'ref-promo-content', box);
          title.after(content);
          util.el('span', 'ref-promo-envelope', content, '✉');
          const copy = util.el('div', 'ref-promo-copy', content);
          util.el('strong', 'ref-promo-heading', copy, 'Get travel deals and updates');
          copy.append(message);
          const email = util.el('input', 'ref-promo-email', copy);
          email.type = 'email';
          email.placeholder = 'your.email@example.com';
          email.setAttribute('aria-label', 'Newsletter email');
          const label = util.el('label', 'ref-promo-optin', copy);
          const check = util.el('input', '', label);
          check.type = 'checkbox';
          check.checked = true;
          util.el('span', '', label, 'Yes, send me travel deals and updates.');
        }
      }
      el.classList.toggle('ref-ov-above-end', !!document.querySelector('.ref-foot [data-role="submit"], .ref-float-dock [data-role="submit"]'));
      return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
    },
    'frame.header': (base, S) => function (_c) {
      const { label, rng, util } = _c;
      const { TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      if (true) {
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, 'Travel Manager');
        brand.dataset.role = 'brand';
        const win = util.el('div', 'ref-window-controls', header);
        for (const [glyph, label] of [['−', 'Minimize'], ['□', 'Maximize'], ['×', 'Close window']]) {
          const control = util.el('span', 'ref-window-control', win, glyph);
          control.setAttribute('aria-label', label);
          control.title = label;
        }
      }
      const search = util.el('div', 'mx-search', header);
      search.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M16 16l5 5"/></svg><span>Search trips, destinations or flights</span>';
      const bell = util.el('div', 'mx-bell', header);
      bell.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M6 17V11a6 6 0 0 1 12 0v6l2 2H4zM10 21h4"/></svg>';
      util.el('div', 'mx-avatar', header, 'JY');
      Object.assign(_c, { header });
    },
    'frame.floating': (base, S) => function (_c) {
      const { endBtn, header, label, placement, util } = _c;
      let { submit } = _c;
      if (placement === 'floating') {
        // Reserve the control's space so it cannot intercept task clicks or drags.
        // On scrollable pages the dock follows the content, just like a form footer.
        const dock = util.el('div', 'ref-float-dock', document.body);
        submit = endBtn(dock, 'ref-submit ref-float', label);
      }
      // Keep the note in a separate native message band beneath the title strip.
      const instruction = header.querySelector('.ref-instruction');
      if (instruction) header.after(instruction);
      Object.assign(_c, { instruction, submit });
    },
  };

  env.site({
    name: 'design-use-travel-change-05',
    template: 'site/base',
    design: { parts },
  });
})();
