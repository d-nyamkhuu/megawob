// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.tools': (base, S) => function (_c) {
      base(_c);
      const { util } = _c;

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
      Object.assign(_c, { appbar, menu });
    },
  };

  env.site({
    name: 'design-use-data-grid-bulk-01',
    template: 'site/base',
    design: { parts },
  });
})();
