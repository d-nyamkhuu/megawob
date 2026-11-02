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
      const titleBar = document.querySelector('.ref-task');
      const lowerBar = document.querySelector('.ref-float-dock') || document.querySelector('.ref-foot');
      const topEdge = titleBar ? titleBar.getBoundingClientRect().bottom + 2 : 42;
      const bottomEdge = lowerBar ? lowerBar.getBoundingClientRect().height + 8 : 12;
      if (kind === 'banner') el.style.top = topEdge + 'px';
      if (kind === 'cookie' || kind === 'chat') el.style.bottom = bottomEdge + 'px';
      if (kind === 'promo') { el.style.top = topEdge + 'px'; el.style.bottom = bottomEdge + 'px'; }
      const box = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
      if (kind === 'promo') {
        util.el('div', 'aqua-mail-emblem', box, '✉');
        util.el('h2', 'aqua-promo-title', box, 'Get city updates');
      }
      if (kind === 'chat') util.el('strong', 'aqua-chat-title', box, 'Need help?');
      util.el('div', 'ref-ov-text', box, word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text);
      if (kind === 'promo') {
        const email = util.el('input', 'aqua-overlay-input', box);
        email.placeholder = 'Your email address'; email.setAttribute('aria-label','Your email address');
      }
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
      if (kind === 'chat') {
        const input = util.el('input', 'aqua-overlay-input', box);
        input.placeholder = 'Type a message…'; input.setAttribute('aria-label','Chat message');
      }
      return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
    },
  };

  env.site({
    name: 'design-pan-map-pin-05',
    template: 'site/base',
    design: { parts },
  });
})();
