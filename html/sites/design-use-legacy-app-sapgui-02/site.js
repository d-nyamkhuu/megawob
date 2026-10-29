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
      const header = document.querySelector('.ref-task');
      const footer = document.querySelector('.ref-foot:has(button,a), .ref-float-dock');
      if (kind === 'banner') el.style.top = `${header.getBoundingClientRect().bottom}px`;
      if (kind === 'promo' || kind === 'toast') el.style.top = `${header.getBoundingClientRect().bottom + 12}px`;
      if (footer && ['cookie', 'chat', 'promo'].includes(kind)) {
        el.style.bottom = `${footer.getBoundingClientRect().height + 12}px`;
      }
      const box = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
      if (kind === 'chat') util.el('div', 'sap-chat-title', box, 'Need help?');
      if (kind === 'promo') {
        const icon = util.el('div', 'sap-promo-icon', box, '✉');
        icon.setAttribute('aria-hidden', 'true');
        util.el('h2', 'sap-promo-title', box, 'Stay in the know');
      }
      util.el('div', 'ref-ov-text', box, word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text);
      if (kind === 'promo' || kind === 'chat') {
        const input = util.el('input', 'sap-overlay-input', box);
        input.type = 'text';
        input.placeholder = kind === 'promo' ? 'Enter your email address' : 'Type a message...';
        input.setAttribute('aria-label', input.placeholder);
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
      return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
    },
    'frame.header': (base, S) => function (_c) {
      const { content, local, rng, util } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      {
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, 'ACME');
        const building = util.svg('svg', { viewBox: '0 0 32 32', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.8', 'aria-hidden': 'true' }, brand);
        util.svg('path', { d: 'M2 29h29M5 29V7h6M11 29V2h13v27M24 10h4v19M15 29v-6h5v6M14 6h3m3 0h1M14 10h3m3 0h1M14 14h3m3 0h1M14 18h3m3 0h1M8 11v3m0 3v3m0 3v3M26 14v3m0 3v3' }, building);
        brand.dataset.role = 'brand';
      }
      {
        const n = util.el('nav', 'ref-nav', header);
        const sampledNav = local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
        for (const item of ['Home', 'Finance', 'Sales', 'Purchasing', 'Inventory', 'Customers', 'Reporting']) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      const utilities = util.el('div', 'sap-top-utilities', header);
      const search = util.el('div', 'sap-search', utilities);
      const searchIcon = util.svg('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.8', 'aria-hidden': 'true' }, search);
      util.svg('circle', { cx: '10', cy: '10', r: '6.5' }, searchIcon);
      util.svg('path', { d: 'm15 15 6 6' }, searchIcon);
      util.el('span', '', search, 'Search customers...');
      const bell = util.svg('svg', { viewBox: '0 0 24 24', fill: 'currentColor', 'aria-hidden': 'true', class: 'sap-bell' }, utilities);
      util.svg('path', { d: 'M12 2a2 2 0 0 0-2 2C6.5 5 6 8 6 11v4l-2 3h16l-2-3v-4c0-3-.5-6-4-7a2 2 0 0 0-2-2zm-2 18a2 2 0 0 0 4 0z' }, bell);
      util.el('span', 'sap-avatar', utilities, 'JD');
      Object.assign(_c, { bell, header, search, searchIcon, utilities });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, display, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const inspector = util.el('aside', 'sap-inspector', body);
      util.el('h2', '', inspector, 'Transaction Information');
      const details = [['Transaction Code', 'ZREC'], ['Description', 'Customer Maintenance'],
        ['Module', 'Customer Master'], ['Transaction Type', 'Record Maintenance'], ['Status', 'Ready'],
        ['Authorization', 'Enabled'], ['Default View', 'General Data'], ['Last Used', 'Mar 3, 2014 10:24 AM']];
      const grid = util.el('div', 'sap-inspector-grid', inspector);
      for (const [key, value] of details) {
        util.el('span', '', grid, key);
        util.el('strong', '', grid, value);
      }
      if (display === 'panel') {
        const column = util.el('div', 'sap-inspector-column', body);
        column.appendChild(inspector);
        column.appendChild(body.querySelector('.ref-panel'));
      }
      Object.assign(_c, { details, grid, inspector, stage });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-use-legacy-app-sapgui-02',
    template: 'site/base',
    design: { parts },
  });
})();
