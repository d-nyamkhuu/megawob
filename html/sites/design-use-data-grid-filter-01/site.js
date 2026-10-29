// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      // Native Workplace Shell window frame: app title, menu row and compact toolbar.
      const osTitle = util.el('div', 'os-title', header);
      util.el('span', 'os-appicon', osTitle, '▣');
      util.el('strong', 'os-apptitle', osTitle, 'Inventory Manager - Products');
      const osWindow = util.el('div', 'os-window-controls', osTitle);
      for (const mark of ['−', '□', '×']) util.el('span', 'os-window-button', osWindow, mark);
      const osMenu = util.el('nav', 'os-menu', header);
      for (const label of ['File', 'Edit', 'View', 'Products', 'Tools', 'Reports', 'Window', 'Help']) {
        util.el('span', 'os-menu-item', osMenu, label);
      }
      const osBar = util.el('div', 'os-toolbar', header);
      for (const [icon, label] of [['▧','New'], ['✎','Edit'], ['▤','Delete'], ['▣','Print'], ['▧','Export'], ['◉','Adjust Stock'], ['⚒','More⌄']]) {
        const item = util.el('span', 'os-tool-item', osBar);
        util.el('b', 'os-tool-icon', item, icon);
        util.el('span', '', item, label);
      }
      const summary = util.el('section', 'os-summary', header);
      const boxes = util.el('div', 'os-summary-icon', summary, '▧');
      boxes.setAttribute('aria-hidden', 'true');
      const totals = util.el('div', 'os-summary-group', summary);
      util.el('strong', '', totals, 'Products');
      for (const [k, v] of [['Total Products:', '342'], ['Active Products:', '318'], ['Reserved Products:', '36'], ['Discontinued Products:', '12']]) {
        const row = util.el('div', 'os-summary-row', totals); util.el('span', '', row, k); util.el('b', '', row, v);
      }
      const filters = util.el('div', 'os-summary-group os-summary-filters', summary);
      for (const [k, v] of [['Category:', 'All Categories'], ['Supplier:', 'All Suppliers'], ['Location:', 'All Locations'], ['Status:', 'All Statuses']]) {
        const row = util.el('div', 'os-summary-row', filters); util.el('span', '', row, k); util.el('b', '', row, v);
      }
      util.el('div', 'os-summary-warehouse', summary, '▣');
      const meta = util.el('div', 'os-summary-group os-summary-meta', summary);
      for (const [k, v] of [['Last Updated:', 'Mar 12, 1994  10:24 AM'], ['Data Source:', 'Main Warehouse'], ['Currency:', 'USD']]) {
        const row = util.el('div', 'os-summary-row', meta); util.el('span', '', row, k); util.el('b', '', row, v);
      }
      S.frameBrand(_c, header);
      Object.assign(_c, { boxes, filters, header, meta, osBar, osMenu, osTitle, osWindow, summary, totals });
    },
  };

  env.site({
    name: 'design-use-data-grid-filter-01',
    template: 'site/base',
    design: { parts },
  });
})();
