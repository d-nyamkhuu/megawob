// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
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

      // Northwind's classic app menu and product actions sit between the title bar
      // and the data workspace. Keep these controls ornamental; task actions live
      // in the table widget below.
      const menu = util.el('nav', 'nw-menubar', document.body);
      for (const item of ['File', 'Edit', 'View', 'Go', 'Tools', 'Help']) {
        util.el('span', 'nw-menuitem', menu, item);
      }
      const appbar = util.el('div', 'nw-appbar', document.body);
      for (const [icon, label] of [['＋', 'New Product'], ['✎', 'Edit'], ['▤', 'Delete'], ['↥', 'Import'], ['↧', 'Export'], ['▮', 'Reports']]) {
        const action = util.el('div', 'nw-action', appbar);
        util.el('span', 'nw-action-icon', action, icon);
        util.el('span', '', action, label);
      }
      Object.assign(_c, { appbar, headerTools, menu, submit });
    },
  };

  env.site({
    name: 'design-use-data-grid-bulk-01',
    template: 'site/base',
    design: { parts },
  });
})();
