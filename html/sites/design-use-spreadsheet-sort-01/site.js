// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
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
      Object.assign(_c, { header, menubar, toolbar, winbar, winbuttons });
    },
  };

  env.site({
    name: 'design-use-spreadsheet-sort-01',
    template: 'site/base',
    design: { parts },
  });
})();
