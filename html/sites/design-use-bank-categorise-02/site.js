// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { display, nav, rng, util } = _c;
      const { TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      // Keep the period bank title visible in every instruction mode. Preserve the
      // legacy title draw so the seeded frame layout remains unchanged.
      if (display !== 'header' || nav) rng.pick(TITLES);
      const brand = util.el('div', 'ref-brand', header, 'Riverton Bank – Online Banking');
      brand.dataset.role = 'brand';
      Object.assign(_c, { brand, header });
    },
    'frame.instruction': (base, S) => function (_c) {
      const { ctx, display, header, util } = _c;
      if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
      else util.el('div', 'ref-spacer', header);
      const menu = util.el('nav', 'rb-menubar', document.body);
      for (const item of ['File', 'Edit', 'View', 'Accounts', 'Payments', 'Cards', 'Tools', 'Help']) {
        const a = util.el('a', 'rb-menuitem', menu, item);
        a.href = '#';
        a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'menu', label: item }); });
      }

      // Application iconbar, beneath the classic menu row.
      const appbar = util.el('nav', 'rb-iconbar', document.body);
      const icons = [
        ['⌂', 'Home'], ['⇄', 'Transfer'], ['▤', 'Pay Bills'], ['▰', 'Cards'],
        ['▤', 'Transactions'], ['?', 'Help'],
      ];
      for (const [glyph, text] of icons) {
        const item = util.el('button', `rb-iconitem${text === 'Transactions' ? ' active' : ''}`, appbar);
        item.type = 'button';
        util.el('span', 'rb-icon', item, glyph);
        util.el('span', 'rb-icon-label', item, text);
        item.addEventListener('click', () => env.log('decoy', { what: 'nav', label: text }));
      }
      Object.assign(_c, { appbar, icons, menu });
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
    name: 'design-use-bank-categorise-02',
    template: 'site/base',
    design: { parts },
  });
})();
