// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const mast = util.el('div', 'risograph-mast', header);
      util.el('div', 'risograph-title', mast, 'Inventory Workbook');
      util.el('div', 'risograph-subtitle', mast, 'Product list and stock levels');
      const stats = util.el('div', 'risograph-stats', header);
      for (const [value, caption] of [['36', 'Total Items'], ['12', 'Categories'], ['8', 'Suppliers'], ['$12,480', 'Total Value']]) {
        const stat = util.el('div', 'risograph-stat', stats);
        util.el('strong', '', stat, value);
        util.el('span', '', stat, caption);
      }
      const winbar = util.el('div', 'gtk-windowbar', document.body);
      winbar.textContent = '▣  Inventory.xlsx - Spreadsheet';
      const winbuttons = util.el('div', 'gtk-window-buttons', winbar);
      for (const glyph of ['−', '□', '×']) util.el('span', '', winbuttons, glyph);
      const menubar = util.el('nav', 'gtk-menubar', document.body);
      for (const item of ['File', 'Edit', 'View', 'Insert', 'Format', 'Tools', 'Data', 'Window', 'Help']) util.el('span', '', menubar, item);
      const toolbar = util.el('div', 'gtk-toolbar', document.body);
      for (const item of ['▢', '📂', '▣', '✂', '▤', '▣', '↶', '↷', 'Sans', '10', 'B', 'I', 'U', '≡', '▦', '%', '↕', 'Σ']) {
        util.el('span', 'gtk-tool', toolbar, item);
      }
      toolbar.after(header);
      S.frameBrand(_c, header);
      Object.assign(_c, { header, mast, menubar, stats, toolbar, winbar, winbuttons });
    },
  };

  env.site({
    name: 'design-use-spreadsheet-sort-02',
    template: 'site/base',
    design: { parts },
  });
})();
