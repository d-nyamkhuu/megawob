// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.instruction': (base, S) => function (_c) {
      const { ctx, display, header, util } = _c;
      if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
      else util.el('div', 'ref-spacer', header);

      // RISC OS style application iconbar. Keep it separate from the window title.
      const appbar = util.el('nav', 'rb-iconbar', document.body);
      const icons = [
        ['⌂', 'Home'], ['▣', 'Accounts'], ['⇄', 'Transfers'], ['▤', 'Bill Pay'], ['▤', 'Transactions'],
        ['◕', 'Categories'], ['▰', 'Cards'], ['⬡', 'Disputes'], ['⚙', 'Settings'],
      ];
      for (const [glyph, text] of icons) {
        const item = util.el('button', `rb-iconitem${text === 'Transactions' ? ' active' : ''}`, appbar);
        item.type = 'button';
        util.el('span', 'rb-icon', item, glyph);
        util.el('span', 'rb-icon-label', item, text);
        item.addEventListener('click', () => env.log('decoy', { what: 'nav', label: text }));
      }
      Object.assign(_c, { appbar, icons });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);

      // The editorial transaction index and date strip are static page frame.
      // They add no task state and consume no episode randomness.
      const accounts = util.el('section', 'rb-account-strip', body);
      const cards = [
        ['▣', 'Everyday Checking', '•••• 4821', '$3,261.54'],
        ['♧', 'Savings', '•••• 7190', '$12,480.00'],
        ['▱', 'Travel Rewards Card', '•••• 1108', '$942.17'],
        ['⌂', 'Home Loan', '•••• 5537', '$210,314.20'],
      ];
      for (let i = 0; i < cards.length; i++) {
        const [glyph, title, number, balance] = cards[i];
        const card = util.el('div', `rb-account-card${i === 0 ? ' selected' : ''}`, accounts);
        util.el('span', 'rb-account-glyph', card, glyph);
        const detail = util.el('span', 'rb-account-detail', card);
        util.el('strong', '', detail, title);
        util.el('small', '', detail, number);
        util.el('b', 'rb-account-balance', card, balance);
      }
      const ledgerbar = util.el('div', 'rb-ledgerbar', body);
      const tabs = util.el('nav', 'rb-ledger-tabs', ledgerbar);
      for (const [label, active] of [['Recent Transactions', true], ['Scheduled Payments', false], ['Recurring Transfers', false]]) {
        const tab = util.el('span', `rb-ledger-tab${active ? ' active' : ''}`, tabs, label);
      }
      const search = util.el('div', 'rb-ledger-search', ledgerbar);
      util.el('span', '', search, '⌕');
      util.el('span', '', search, 'Search transactions');
      util.el('div', 'rb-ledger-date', ledgerbar, '▦  Jan 1, 2015 – Jan 31, 2015   ⌄');
      body.insertBefore(accounts, stage);
      body.insertBefore(ledgerbar, stage);
      Object.assign(_c, { accounts, cards, ledgerbar, search, stage, tabs });
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
        const tools = util.el('div', 'ref-tools', foot);
        if (decoys.length > 1) decoyBtn(tools, decoys[1]);
        if (collide && collide.where === 'footer') decoyBtn(tools, collide.text, true);
        if (placement === 'footer') submit = endBtn(tools, 'ref-submit', label);
        if (placement === 'link') submit = endBtn(tools, 'ref-endlink', `${label} ›`);
      }
      const status = util.el('div', 'rb-status', document.body);
      util.el('strong', 'rb-status-brand', status, '▤  RiscBank');
      util.el('span', 'rb-status-time', status, 'Mon 17 Apr 1989   10:24');
      Object.assign(_c, { status, submit });
    },
  };

  env.site({
    name: 'design-use-bank-categorise-04',
    template: 'site/base',
    design: { parts },
  });
})();
