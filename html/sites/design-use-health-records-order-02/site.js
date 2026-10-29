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
      // Obstructions leave the episode controls and its instruction header usable.
      const headerBottom = document.querySelector('.ref-task').getBoundingClientRect().bottom;
      const end = document.querySelector('[data-role="submit"]');
      const endRect = end && end.getBoundingClientRect();
      const lowerClearance = endRect && endRect.top > window.innerHeight / 2
        ? window.innerHeight - endRect.top + 8 : 0;
      if (kind === 'banner') el.style.top = `${headerBottom}px`;
      if (kind === 'promo') {
        el.style.top = `${headerBottom}px`;
        el.style.bottom = `${lowerClearance}px`;
      }
      if (kind === 'cookie' || kind === 'chat') el.style.bottom = `${Math.max(kind === 'chat' ? 20 : 0, lowerClearance)}px`;
      return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
    },
    'frame.theme': (base, S) => function (_c) {
      const { ctx } = _c;
      const { ACCENTS, LOW_ACCENTS, LOW_THEME, THEMES } = S;
      const { rng, util, content } = ctx;
      let name = rng.pick(Object.keys(THEMES));
      const root = document.documentElement;
      let accent = rng.pick(ACCENTS);
      const tr = rng.fork('chrome/theme');
      if (tr.bool(0.08)) {
        name = 'low';
        accent = tr.pick(LOW_ACCENTS);
      }
      for (const [k, v] of Object.entries(name === 'low' ? LOW_THEME : THEMES[name])) root.style.setProperty(`--${k}`, v);
      root.style.setProperty('--accent', accent);
      root.dataset.theme = name;
      // This design is a fixed monochrome desktop application. Keep the legacy draws above
      // so seeded task/frame streams remain stable, then apply its own window palette.
      for (const [k, v] of Object.entries({ bg: '#f4f4f2', panel: '#fbfbfa', fg: '#111315', muted: '#55585a', line: '#bfc1c2' })) root.style.setProperty(`--${k}`, v);
      root.style.setProperty('--accent', '#55585a');
      Object.assign(_c, { accent, content, name, rng, root, tr, util });
    },
    'frame.header': (base, S) => function (_c) {
      const { content, display, nav, rng, util } = _c;
      const { TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      if (display !== 'header' || nav) rng.pick(TITLES); // preserve the legacy frame draw
      const brand = util.el('div', 'ref-brand', header, '✚  Riverside Medical Center');
      brand.dataset.role = 'brand';
      {
        const n = util.el('nav', 'ref-nav', header);
        if (nav) rng.sample(content.NAV_ITEMS, rng.int(3, 5)); // preserve legacy conditional draws
        for (const item of ['Patient Summary', 'Orders', 'Medications', 'Results', 'Nursing', 'Flowsheets', 'Bed Management', 'Appointments']) {
          const a = util.el('a', 'ref-navlink', n, item);
          if (item === 'Orders') a.classList.add('active');
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      Object.assign(_c, { brand, header });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-use-health-records-order-02',
    template: 'site/base',
    design: { parts },
  });
})();
