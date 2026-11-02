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
      if (kind === 'banner') document.querySelector('.ref-task').after(el);
      if (kind === 'promo' || kind === 'toast') el.style.top = document.querySelector('.ref-task').getBoundingClientRect().bottom + 10 + 'px';
      const box = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
      if (kind === 'promo') {
        util.el('div', 'ledger-promo-art', box, '✉');
        util.el('h2', 'ledger-overlay-title', box, 'Stay in the know');
      }
      if (kind === 'chat') {
        const chatHeading = util.el('div', 'ledger-chat-heading', box);
        util.el('strong', '', chatHeading, 'Need help?');
        util.el('small', '', chatHeading, 'Our team is here to help.');
      }
      util.el('div', 'ref-ov-text', box, word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text);
      if (kind === 'promo' || kind === 'chat') {
        const field = util.el('input', 'ledger-overlay-input', box);
        field.placeholder = kind === 'promo' ? 'Enter your email address' : 'Type a message...';
        field.setAttribute('aria-label', field.placeholder);
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
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, tall, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebar = roomy && rng.bool(0.35);
      const navDraw = W >= 1180 && rng.bool(0.5);
      const nav = true;
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, navDraw, placement, sidebar, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { content, display, local, nav, rng, util } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      header.classList.toggle('has-instruction', display === 'header');
      const iconPaths = {
        Home: 'm3 10 9-7 9 7v11h-7v-7h-4v7H3z',
        Reconcile: 'm3 8 9-5 9 5z M5 10v8m7-8v8m7-8v8M3 21h18',
        Journal: 'M4 3h15v18H4z M8 3v18 M11 8h5m-5 4h5',
        Expenses: 'M5 3h14v18H5z M8 7h3m3 0h2M8 11h8m-8 4h3m3 0h2',
        Bills: 'M5 2h9l5 5v15H5z M14 2v6h5 M8 12h8m-8 4h6',
        Reports: 'M3 3v18h18M7 16v-5m5 5V7m5 9V4',
      };
      const drawIcon = (parent, name) => {
        const svg = util.svg('svg', {viewBox:'0 0 24 24', class:'ledger-chrome-icon', 'aria-hidden':'true'}, parent);
        util.svg('path', {d:iconPaths[name] || iconPaths.Journal}, svg);
      };
      const appTitle = util.el('div', 'ledger-app-title', header);
      const appIcon = util.el('span', 'ledger-app-logo', appTitle);
      drawIcon(appIcon, 'Journal');
      util.el('span', '', appTitle, 'LedgerPro  —  Mountain View Accounting');
      const windowControls = util.el('div', 'ledger-window-controls', header);
      for (const symbol of ['—', '□', '×']) util.el('span', '', windowControls, symbol);
      if (display !== 'header' || nav) {
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, 'Riverton Community Services');
        brand.dataset.role = 'brand';
      }
      if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        const sampledNav = local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
        for (const item of ['Home', 'Reconcile', 'Journal', 'Expenses', 'Bills', 'Reports']) {
          const a = util.el('a', 'ref-navlink', n);
          drawIcon(a, item);
          util.el('span', '', a, item);
          a.dataset.role = 'nav';
          if (item === 'Reconcile') a.classList.add('is-current');
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      const globalSearch = util.el('div', 'ledger-global-search', header);
      util.el('span', '', globalSearch, '⌕');
      util.el('span', '', globalSearch, 'Search transactions...');
      Object.assign(_c, { appIcon, appTitle, drawIcon, globalSearch, header, iconPaths, windowControls });
    },
    'frame.panel': (base, S) => function (_c) {
      const { body, ctx, display, lr, rng, util, word } = _c;
      const { K } = S;
      if (display === 'panel') {
        const panel = util.el('section', 'ref-panel', body);
        const heading = rng.pick(['Your task', 'Instructions', 'To do', 'Goal']);
        util.el('div', 'ref-panel-title', panel, word ? word(lr.pick(K.panel)) : heading);
        util.el('div', 'ref-panel-text', panel, ctx.instruction);
        if (rng.bool(0.5)) body.classList.add('ref-panel-right');
      }
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-use-accounting-reconcile-02',
    template: 'site/base',
    design: { parts },
  });
})();
