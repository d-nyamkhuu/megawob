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
      if (kind === 'promo' || kind === 'chat') {
        const title = util.el('div', 'ap-overlay-title', box, kind === 'chat' ? 'Chat with us' : 'Stay in the loop');
        box.prepend(title);
        if (kind === 'promo') {
          const close = util.el('button', 'ap-overlay-close', title, '×');
          close.type = 'button'; close.setAttribute('aria-label', closeLabelForOverlay());
          close.addEventListener('click', () => ctx.dismiss('close'));
          util.el('span', 'ap-envelope', box, '✉');
        } else title.appendChild(dismiss);
        const field = util.el('input', 'ap-overlay-input', box);
        field.type = 'text'; field.setAttribute('aria-label', kind === 'chat' ? 'Message' : 'Email address');
        field.placeholder = kind === 'chat' ? 'Type a message...' : 'Your email address';
        box.insertBefore(field, row);
        if (kind === 'chat') btn('Send', null, true);
      }
      if (kind === 'banner') {
        const header = document.querySelector('.ref-task');
        el.style.top = header.getBoundingClientRect().bottom + 'px';
      }
      const end = document.querySelector('[data-role="submit"]');
      if (end && (kind === 'cookie' || kind === 'chat')) {
        const rect = end.getBoundingClientRect();
        if (rect.top > window.innerHeight - 120) el.style.bottom = window.innerHeight - rect.top + 8 + 'px';
      }
      function closeLabelForOverlay() { return word ? word('close') : 'Close'; }
      return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
    },
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      util.el('div', 'ap-title', header, 'Accounts Payable');
      util.el('div', 'ap-date', header, 'Thu, Apr 24, 2003');
      S.frameBrand(_c, header);
      Object.assign(_c, { header });
    },
  };

  env.site({
    name: 'design-use-accounting-approve-01',
    template: 'site/base',
    design: { parts },
  });
})();
