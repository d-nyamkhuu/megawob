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
      if (kind === 'banner') el.style.top = `${document.querySelector('.ref-task').getBoundingClientRect().bottom}px`;
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
      return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
    },
    'frame.header': (base, S) => function (_c) {
      const { display, lr, nav, rng, util, word } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      if (display !== 'header' || nav) {
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, word ? word(lr.pick(K.brand)) : 'File Manager');
        brand.dataset.role = 'brand';
      }
      Object.assign(_c, { header });
    },
    'frame.instruction': (base, S) => function (_c) {
      const { ctx, display, header, label, util } = _c;
      if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
      else util.el('div', 'ref-spacer', header);
      if (!header.querySelector('.ref-brand')) util.el('div', 'ref-brand', header, 'File Manager');
      const appIcon = util.el('span', 'gem-app-icon', header);
      appIcon.innerHTML = '<svg viewBox="0 0 32 32" fill="#eee" stroke="#111" stroke-width="2"><path d="M5 3h22v24H5ZM2 16h28v14H2Z"/><path d="M8 7h16v7H8ZM7 21h18v7H7Z"/></svg>';
      const gadgets = util.el('div', 'gem-gadgets', header);
      for (const label of ['−', '□', '×']) util.el('span', '', gadgets, label);
      const menu = util.el('nav', 'gem-menu', document.body);
      for (const label of ['File', 'Edit', 'View', 'Go', 'Favorites', 'Options', 'Help']) {
        const item = util.el('span', '', menu, label);
        item.addEventListener('click', () => env.log('decoy', { what: 'menu', label }));
      }
      Object.assign(_c, { appIcon, gadgets, menu });
    },
  };

  env.site({
    name: 'design-use-file-manager-rename-04',
    template: 'site/base',
    design: { parts },
  });
})();
