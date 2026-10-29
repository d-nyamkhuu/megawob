// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    overlay: (base, S) =>
      function overlay(ctx) {
        const { K } = S;
        const { rng, util, kind } = ctx;
        const { text } = ctx.content.bannerText(rng, kind === 'banner' ? 'notice' : kind);
        const word = ctx.lang && ctx.lang !== 'en' && ctx.word ? ctx.word : null;
        const el = util.el('div', `ref-ov ref-ov-${kind}`, document.body);
        el.dataset.role = 'overlay';
        const box = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
        if (kind === 'promo') {
          const title = util.el('div', 'civic-dialog-title', box, 'Get helpful updates');
          const close = util.el('button', 'civic-dialog-close', title, '×');
          close.type = 'button';
          close.setAttribute('aria-label', word ? word('close') : 'Close');
          close.addEventListener('click', () => ctx.dismiss('close'));
          util.el('div', 'civic-dialog-icon', box, '✉');
        }
        util.el(
          'div',
          'ref-ov-text',
          box,
          word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text,
        );
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
        if (kind === 'banner') document.querySelector('.ref-task').after(el);
        return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { content, display, local, lr, nav, rng, util, word } = _c;
        const { K, TITLES } = S;
        const header = util.el('header', 'ref-task', document.body);
        util.el('div', 'civic-window-title', header, 'Civic Support Application');
        const gadgets = util.el('div', 'civic-window-gadgets', header);
        gadgets.setAttribute('aria-hidden', 'true');
        util.el('span', 'civic-minimize', gadgets, '−');
        util.el('span', 'civic-maximize', gadgets, '');
        util.el('span', 'civic-close', gadgets, '×');
        const iconbar = util.el('div', 'gov-iconbar', header);
        const iconArt = [
          '<path d="M3 8h10l3 3h11v14H3z" fill="#e6c568" stroke="#1b3040" stroke-width="1.6"/><path d="M3 8l3-4h8l3 4" fill="#f1d987" stroke="#1b3040" stroke-width="1.6"/><path d="M4 12h22" stroke="#fff" stroke-width="1"/>',
          '<path d="M8 3h11l5 5v19H8z" fill="#eaf3f7" stroke="#1b3040" stroke-width="1.6"/><path d="M19 3v6h5M11 14h10M11 18h10M11 22h8" fill="none" stroke="#35536a" stroke-width="1.5"/>',
          '<rect x="5" y="3" width="19" height="25" rx="1" fill="#c9b36e" stroke="#263746" stroke-width="1.6"/><path d="M8 6h13v5H8zM8 14h13v4H8zM8 21h13v4H8z" fill="#efe0a8" stroke="#263746" stroke-width="1.2"/><circle cx="18" cy="8.5" r="1" fill="#263746"/><circle cx="18" cy="16" r="1" fill="#263746"/><circle cx="18" cy="23" r="1" fill="#263746"/>',
          '<path d="M7 10V4h18v6M6 22H3v-9q0-3 3-3h20q3 0 3 3v9h-4" fill="#c9d9e0" stroke="#1b3040" stroke-width="1.8"/><path d="M7 18h18v10H7z" fill="#f4f3ec" stroke="#1b3040" stroke-width="1.8"/><path d="M10 21h12M10 24h12" stroke="#607383" stroke-width="1.2"/><circle cx="25" cy="14" r="1" fill="#263746"/>',
        ];
        for (const art of iconArt) {
          const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          svg.setAttribute('viewBox', '0 0 32 32');
          svg.setAttribute('aria-hidden', 'true');
          svg.innerHTML = art;
          iconbar.appendChild(svg);
        }
        if (display !== 'header' || nav) {
          const title = rng.pick(TITLES);
          const brand = util.el('div', 'ref-brand', header, word ? word(lr.pick(K.brand)) : 'Rivermere Council');
          brand.dataset.role = 'brand';
        }
        if (nav) {
          const n = util.el('nav', 'ref-nav', header);
          const navItems = local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
          const councilNav = ['Home', 'Benefits & Support', 'Housing', 'Council Tax', 'Services', 'My Account'];
          for (const [index, sampled] of navItems.entries()) {
            const item = word ? sampled : councilNav[index % councilNav.length];
            const a = util.el('a', 'ref-navlink', n, item);
            a.dataset.role = 'nav';
            a.addEventListener('click', (e) => {
              e.preventDefault();
              env.log('decoy', { what: 'nav', label: item });
            });
          }
        }
        Object.assign(_c, { gadgets, header, iconArt, iconbar });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { util } = _c;
        const body = util.el('div', 'ref-body', document.body);
        const status = util.el('section', 'civic-stats', body);
        const statusCols = [
          ['Application: Housing Support', 'Saved: 14 Mar 2024   10:26'],
          ['Form sections: 6', 'Completed: 3', 'Missing or to check: 3'],
          ['Evidence items: 4', 'Added: 2', 'Missing: 2'],
        ];
        for (const rows of statusCols) {
          const col = util.el('div', 'gov-summary-col', status);
          for (const row of rows) util.el('div', '', col, row);
        }
        S.frameSidebar(_c, body);
        Object.assign(_c, { body, status, statusCols });
      },
    'frame.nav': (base, S) => function (_c) {},
  };

  env.site({
    name: 'design-use-gov-portal-saveresume-03',
    template: 'site/base',
    design: { parts },
  });
})();
