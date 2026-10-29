// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
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
      if (display !== 'header' || nav) {
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, 'LedgerPro');
        brand.dataset.role = 'brand';
      }
      if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        const sampledNav = local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
        for (const item of ['Dashboard', 'Banking', 'Expenses', 'Payables', 'General Ledger', 'Reports']) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          if (item === 'Banking') a.classList.add('is-current');
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      Object.assign(_c, { header });
    },
    'frame.instruction': (base, S) => function (_c) {
      const { ctx, display, header, util } = _c;
      if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
      else util.el('div', 'ref-spacer', header);
      const search = util.el('div', 'ledger-search', header, 'Search transactions…');
      util.el('span', 'ledger-search-icon', search, '⌕');
      util.el('div', 'ledger-bell', header, '♟');
      util.el('div', 'ledger-avatar', header, 'JS');
      Object.assign(_c, { search });
    },
    'frame.tools': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, display, endBtn, header, label, placement, util, wantFooter } = _c;
      let submit = null;
      const headerTools = util.el('div', 'ref-tools', header);
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      const masthead = util.el('section', 'ledger-masthead', document.body);
      util.el('div', 'ledger-page-title', masthead, 'RECONCILE');
      const account = util.el('div', 'ledger-account', masthead);
      util.el('strong', '', account, 'OPERATING ACCOUNT　⌄');
      util.el('span', '', account, 'First National Bank　 •　 1234');
      const balances = util.el('div', 'ledger-balances', masthead);
      const statement = util.el('div', 'ledger-balance', balances);
      util.el('b', '', statement, 'STATEMENT BALANCE');
      util.el('strong', '', statement, '$24,836.41');
      util.el('span', '', statement, 'as of Apr 30, 2025');
      const book = util.el('div', 'ledger-balance', balances);
      util.el('b', '', book, 'BOOK BALANCE');
      util.el('strong', '', book, '$17,921.03');
      util.el('span', '', book, 'as of Apr 30, 2025');
      const help = util.el('section', 'ledger-help', document.body);
      util.el('strong', 'ledger-help-title', help, 'HOW TO RECONCILE　⌄');
      for (const [number, copy] of [['1', 'Find a bank transaction above that matches a ledger entry below.'],
        ['2', 'Match by date, payee and amount.'], ['3', 'Leave any unmatched items in the bank feed.'],
        ['4', 'Save when you are finished.']]) {
        const step = util.el('div', 'ledger-help-step', help);
        util.el('b', '', step, number);
        util.el('span', '', step, copy);
      }
      if (display === 'header') {
        const instruction = header.querySelector('.ref-instruction');
        if (instruction) masthead.appendChild(instruction);
      }
      Object.assign(_c, { account, balances, book, headerTools, help, masthead, statement, submit });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-use-accounting-reconcile-03',
    template: 'site/base',
    design: { parts },
  });
})();
