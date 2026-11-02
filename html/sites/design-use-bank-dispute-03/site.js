// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.theme': (base, S) => function (_c) {
      const { ctx } = _c;
      const { LOW_ACCENTS, LOW_THEME, THEMES } = S;
      const { rng, util, content } = ctx;
      let name = 'light';
      const root = document.documentElement;
      let accent = '#ff6b25';
      const tr = rng.fork('chrome/theme');
      if (tr.bool(0.08)) {
        name = 'low';
        accent = tr.pick(LOW_ACCENTS);
      }
      for (const [k, v] of Object.entries(name === 'low' ? LOW_THEME : THEMES[name])) root.style.setProperty(`--${k}`, v);
      root.style.setProperty('--accent', accent);
      root.dataset.theme = name;
      Object.assign(_c, { accent, content, name, rng, root, tr, util });
    },
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, tall, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      if (roomy) rng.bool(0.35);
      if (W >= 1180) rng.bool(0.5);
      const sidebar = false;
      const nav = false;
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, placement, sidebar, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { display, nav, rng, util } = _c;
      const { TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      if (display !== 'header' || nav) rng.pick(TITLES);
      const brand = util.el('div', 'ref-brand', header, 'Rivermere Bank');
      brand.dataset.role = 'brand';
      const leaf = util.svg('svg', { viewBox: '0 0 54 48', 'aria-hidden': 'true', class: 'bank-leaf' }, brand);
      util.svg('path', { fill: '#9bc74d', d: 'M25 43C8 43 2 31 2 18c12 0 19 11 23 25ZM27 40C21 22 27 7 36 2c2 17-2 29-9 38ZM30 43C34 23 44 9 52 2c3 23-4 40-22 41Z' }, leaf);
      const bankActions = util.el('nav', 'bank-masthead-actions', header);
      ['Messages', 'Help', 'Settings', 'Sign Out'].forEach((item) => {
        const link = util.el('a', 'bank-masthead-link', bankActions, item);
        link.href = '#';
        link.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'utility', label: item }); });
      });
      Object.assign(_c, { bankActions, brand, header, leaf });
    },
    'frame.tools': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, header, label, placement, util, wantFooter } = _c;
      let submit = null;
      const headerTools = util.el('div', 'ref-tools', header);
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }

      // Rivermere's numbered notebook navigation sits between the masthead and workspace.
      const bankNav = util.el('nav', 'bank-notebook-nav', document.body);
      const bankTabs = ['Accounts', 'Transfers', 'Bill Pay', 'Cards', 'Transactions', 'Statements', 'Profile'];
      bankTabs.forEach((item, i) => {
        const tab = util.el('a', `bank-notebook-tab${i === 3 ? ' is-current' : ''}`, bankNav);
        tab.href = '#';
        util.el('span', 'bank-tab-index', tab, String(i + 1));
        util.el('span', '', tab, item);
        tab.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'navigation', label: item }); });
      });
      Object.assign(_c, { bankNav, bankTabs, headerTools, submit });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const accountRail = util.el('aside', 'bank-account-rail', body);
      const cardBlock = util.el('section', 'bank-rail-block', accountRail);
      util.el('h2', '', cardBlock, 'My Cards');
      const currentCard = util.el('div', 'bank-card-current', cardBlock);
      util.el('span', 'bank-card-name', currentCard, 'Rivermere Rewards Visa');
      util.el('span', 'bank-card-number', currentCard, '•••• 4421');
      const secondCard = util.el('div', 'bank-card-secondary', cardBlock);
      util.el('span', 'bank-card-name', secondCard, 'Everyday Mastercard');
      util.el('span', 'bank-card-number', secondCard, '•••• 8810');
      const serviceBlock = util.el('section', 'bank-rail-block', accountRail);
      util.el('h2', '', serviceBlock, 'Card Services');
      ['View Transactions', 'Make a Payment', 'Manage Card Controls', 'Report Lost or Stolen', 'Dispute a Transaction', 'Replace Card'].forEach((item) => {
        const link = util.el('a', `bank-rail-link${item === 'Dispute a Transaction' ? ' is-current' : ''}`, serviceBlock, item);
        link.href = '#'; link.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label: item }); });
      });
      const quickBlock = util.el('section', 'bank-rail-block', accountRail);
      util.el('h2', '', quickBlock, 'Quick Links');
      ['Set Spending Limits', 'Block a Merchant', 'Travel Notice'].forEach((item) => {
        const link = util.el('a', 'bank-rail-link', quickBlock, item);
        link.href = '#'; link.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label: item }); });
      });
      S.frameSidebar(_c, body);
      Object.assign(_c, { accountRail, body, cardBlock, currentCard, quickBlock, secondCard, serviceBlock });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      const helpRail = util.el('aside', 'bank-help-rail', body);
      const helpBlock = util.el('section', 'bank-help-block', helpRail);
      util.el('h2', '', helpBlock, 'Help & Information');
      const instructionPanel = body.querySelector('.ref-panel');
      if (instructionPanel) helpBlock.appendChild(instructionPanel);
      util.el('h3', '', helpBlock, 'When to file a dispute');
      util.el('p', '', helpBlock, 'You can dispute a transaction if you didn’t make it, the goods or services weren’t received, or there is an error in the amount charged.');
      util.el('h3', '', helpBlock, 'Common reasons');
      const reasons = util.el('ul', '', helpBlock);
      ['Goods not received', 'Services not provided', 'Incorrect amount', 'Duplicate charge', 'Unrecognised transaction'].forEach((item) => util.el('li', '', reasons, item));
      util.el('h3', '', helpBlock, 'What happens next');
      util.el('p', '', helpBlock, 'We’ll review your dispute and may contact you for more information. You’ll be notified of the outcome by secure message.');
      S.frameAlign(_c, stage);
      Object.assign(_c, { helpBlock, helpRail, instructionPanel, reasons, stage });
    },
    'frame.footer': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, label, lr, placement, rng, util, wantFooter, word } = _c;
      let { submit } = _c;
      if (wantFooter) {
        const foot = util.el('footer', 'ref-foot', document.body);
        const footText = rng.pick(['© 2024 Example Co.', 'All changes are saved automatically.',
          'Need help? Contact your administrator.', 'v4.2.1 · Status: all systems normal']);
        util.el('span', 'ref-foot-text', foot, word ? lr.pick([`© 2024 Example Co. ${word('footRights')}`,
          word('footSaved'), word('footHelp'), `v4.2.1 · ${word('footStatus')}`]) : footText);
        foot.querySelector('.ref-foot-text').textContent = 'Rivermere Bank · Secure online banking';
        const tools = util.el('div', 'ref-tools', foot);
        if (decoys.length > 1) decoyBtn(tools, decoys[1]);
        if (collide && collide.where === 'footer') decoyBtn(tools, collide.text, true);
        if (placement === 'footer') submit = endBtn(tools, 'ref-submit', label);
        if (placement === 'link') submit = endBtn(tools, 'ref-endlink', `${label} ›`);
      }
      Object.assign(_c, { submit });
    },
  };

  env.site({
    name: 'design-use-bank-dispute-03',
    template: 'site/base',
    design: { parts },
  });
})();
