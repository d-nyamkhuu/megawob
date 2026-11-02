// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.layout': (base, S) => function (_c) {
      const { ctx } = _c;
      const W = window.innerWidth;
      const H = window.innerHeight;
      const roomy = W >= 1260;
      const tall = H >= 700;
      let display = ctx.display || 'header';
      if (display === 'panel' && !roomy) display = 'header';
      if (display === 'toast' && !tall) display = 'header';
      // reset() reuses the body: a previous toast must not shrink later episodes.
      document.body.classList.toggle('ref-has-note', display === 'toast');
      document.body.dataset.instruction = display;
      Object.assign(_c, { H, W, display, roomy, tall });
    },
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, tall, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      rng.bool(0.35); // retain the scaffold's frame draw sequence
      const sidebar = true;
      const nav = W >= 1180 && rng.bool(0.5);
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, placement, sidebar, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const bankHead = util.el('div', 'bank-titlebar', header);
      util.el('div', 'bank-mark', bankHead);
      util.el('div', 'bank-wordmark', bankHead, 'Regions Bank');
      const accountLinks = util.el('div', 'bank-account-links', bankHead);
      util.el('div', 'bank-account-top', accountLinks, 'Messages (2)　 |　 Profile　 |　 Help　 |　 Sign Out');
      util.el('div', 'bank-account-greeting', accountLinks, 'Good afternoon, Taylor Morgan　 |　 Customer Since 1998');
      const search = util.el('div', 'bank-search', bankHead, '⌕　Search transactions, payees, or help...');
      const avatar = util.el('div', 'bank-avatar', bankHead, 'JS');
      S.frameBrand(_c, header);
      Object.assign(_c, { accountLinks, avatar, bankHead, header, search });
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
      const menu = util.el('nav', 'bank-menubar', document.body);
      for (const item of ['File', 'Edit', 'View', 'Accounts', 'Payments', 'Cards', 'Tools', 'Help']) {
        util.el('span', 'bank-menu-item', menu, item);
      }
      const toolbar = util.el('nav', 'bank-toolbar', document.body);
      const toolbarItems = [
        ['⌂', 'My Accounts'], ['▤', 'Bill Pay'], ['⇄', 'Transfers'], ['▣', 'Cards'],
        ['▥', 'eStatements'], ['◷', 'Customer Service'],
      ];
      for (const [icon, text] of toolbarItems) {
        const item = util.el('div', `bank-tool${text === 'Cards' ? ' selected' : ''}`, toolbar);
        util.el('span', 'bank-tool-icon', item, icon);
        util.el('span', 'bank-tool-label', item, text);
      }
      Object.assign(_c, { headerTools, menu, submit, toolbar, toolbarItems });
    },
    'frame.body': (base, S) => function (_c) {
      const { content, local, rng, sidebar, util } = _c;
      const { K } = S;
      const body = util.el('div', 'ref-body', document.body);
      if (sidebar) {
        const side = util.el('aside', 'ref-side', body);
        const sampledSideLabels = local(rng.sample(content.NAV_ITEMS, rng.int(4, 7)), K.nav);
        const sideLabels = ['Account Summary', 'Transactions', 'Card Services', 'Bill Pay', 'Transfers', 'Account Settings', 'Messages (2)'];
        for (const item of sideLabels.slice(0, Math.max(4, sampledSideLabels.length))) {
          const a = util.el('a', 'ref-sidelink', side, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label: item }); });
        }
      }
      Object.assign(_c, { body });
    },
  };

  env.site({
    name: 'design-use-bank-limits-02',
    template: 'site/base',
    design: { parts },
  });
})();
