// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = true;
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebar = roomy && rng.bool(0.35);
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
      const titlebar = util.el('div', 'app-titlebar', header);
      util.el('span', 'app-cube', titlebar, '⬢');
      util.el('span', 'app-title', titlebar, 'Product Manager');
      const win = util.el('div', 'app-window-controls', titlebar);
      util.el('span', '', win, '−');
      util.el('span', '', win, '□');
      util.el('span', '', win, '×');
      const menubar = util.el('nav', 'app-menubar', header);
      for (const item of ['File', 'Edit', 'View', 'Tools', 'Reports', 'Help']) {
        const a = util.el('a', 'app-menu-item', menubar, item);
        a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'menu', label: item }); });
      }
      const toolbar = util.el('div', 'app-toolbar', header);
      const toolItems = [['▯','New'],['▰','Open'],['▧','Copy'],['✂','Paste'],['▤','Delete'],['▥','Reports']];
      for (const [icon, label] of toolItems) {
        const b = util.el('button', `app-tool${label === 'Paste' ? ' disabled' : ''}`, toolbar);
        b.type = 'button'; util.el('span', 'app-tool-icon', b, icon); util.el('span', '', b, label);
        b.addEventListener('click', () => env.log('decoy', { what: 'toolbar', label }));
      }
      S.frameBrand(_c, header);
      Object.assign(_c, { header, menubar, titlebar, toolItems, toolbar, win });
    },
    'frame.instruction': (base, S) => function (_c) {
      const { ctx, display, header, util } = _c;
      if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
    },
    'frame.tools': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, label, placement, toolbar, util, wantFooter } = _c;
      let submit = null;
      const headerTools = util.el('div', 'ref-tools', toolbar);
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      Object.assign(_c, { headerTools, submit });
    },
    'frame.body': (base, S) => function (_c) {
      const { content, rng, util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      rng.sample(content.NAV_ITEMS, rng.int(4, 7));
      const side = util.el('aside', 'ref-side app-sidebar', body);
      const sideItems = [['⬡','Products'],['◆','Categories'],['▣','Suppliers'],['▤','Orders'],['♟','Customers'],['▥','Reports']];
      for (const [icon, label] of sideItems) {
        const a = util.el('a', `ref-sidelink${label === 'Products' ? ' active' : ''}`, side);
        util.el('span', 'app-side-icon', a, icon); util.el('span', '', a, label);
        a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label }); });
      }
      const summary = util.el('section', 'app-summary', side);
      util.el('div', 'app-summary-heading', summary, 'Selection Summary');
      for (const [label, value] of [['Available items:', '12'], ['Selected items:', '0'], ['Total items:', '12']]) {
        const row = util.el('div', 'app-summary-row', summary);
        util.el('span', '', row, label); util.el('b', '', row, value);
      }
      Object.assign(_c, { body, side, sideItems, summary });
    },
    'frame.footer': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, label, lr, placement, util, wantFooter, word } = _c;
      let { submit } = _c;
      if (wantFooter) {
        const foot = util.el('footer', 'ref-foot', document.body);
        const footText = '';
        util.el('span', 'ref-foot-text', foot, word ? lr.pick([`© 2024 Example Co. ${word('footRights')}`,
          word('footSaved'), word('footHelp'), `v4.2.1 · ${word('footStatus')}`]) : footText);
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
    name: 'design-transfer-items-rangemix-04',
    template: 'site/base',
    design: { parts },
  });
})();
