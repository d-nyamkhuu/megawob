// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const winbar = util.el('div', 'gtk-windowbar', document.body);
      winbar.textContent = 'Inventory.xlsx';
      const winbuttons = util.el('div', 'gtk-window-buttons', winbar);
      for (const glyph of ['−', '□', '×']) util.el('span', '', winbuttons, glyph);
      const menubar = util.el('nav', 'gtk-menubar', document.body);
      for (const item of ['File', 'Edit', 'View', 'Insert', 'Format', 'Tools', 'Data', 'Window', 'Help']) util.el('span', '', menubar, item);
      const toolbar = util.el('div', 'gtk-toolbar', document.body);
      for (const item of ['▣  View⌄', '⊕  Insert', '▦  Table', '◷  Chart', 'T  Text', '◯  Shape⌄', '▧  Media', '▤  Comment', '⌕  Search', '↥', '•••']) {
        util.el('span', 'gtk-tool', toolbar, item);
      }
      toolbar.after(header);
      const tabs = util.el('nav', 'sheet-tabs', document.body);
      for (const [i, item] of ['Inventory', 'Suppliers', 'Orders', 'Analysis'].entries()) {
        const tab = util.el('span', `sheet-tab${i === 0 ? ' active' : ''}`, tabs, item);
        tab.setAttribute('aria-current', i === 0 ? 'page' : 'false');
      }
      util.el('span', 'sheet-tab-add', tabs, '+');
      S.frameBrand(_c, header);
      Object.assign(_c, { header, menubar, tabs, toolbar, winbar, winbuttons });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      const summary = util.el('aside', 'sheet-summary', body);
      util.el('strong', 'summary-title', summary, 'Inventory Summary');
      util.el('span', 'summary-more', summary, '•••');
      const metrics = util.el('div', 'summary-metrics', summary);
      for (const [value, label, icon, color] of [
        ['36', 'Total Items', '⬡', '#1683ff'], ['8', 'Categories', '◇', '#28a66a'],
        ['9', 'Suppliers', '♙', '#9564eb'], ['165,531.40', 'Total Value', '◉', '#ff8a00'],
      ]) {
        const card = util.el('div', 'summary-card', metrics);
        util.el('b', '', card, value);
        util.el('span', 'summary-icon', card, icon).style.color = color;
        util.el('small', '', card, label);
      }
      util.el('div', 'summary-divider', summary);
      util.el('strong', 'summary-chart-title', summary, 'Items by Category');
      const chart = util.el('div', 'summary-chart', summary);
      util.el('div', 'chart-hole', chart, '36');
      const legend = util.el('div', 'summary-legend', summary);
      for (const [label, count, color] of [['Accessories','16','#1683ff'],['Monitors','4','#41b979'],['Audio','4','#ffae27'],['Storage','3','#f15e61'],['Furniture','2','#9b69e8'],['Other','7','#909baa']]) {
        const row = util.el('div', 'summary-legend-row', legend);
        util.el('i', '', row).style.background = color;
        util.el('span', '', row, label);
        util.el('b', '', row, count);
      }
      S.frameAlign(_c, stage);
      Object.assign(_c, { chart, legend, metrics, stage, summary });
    },
  };

  env.site({
    name: 'design-use-spreadsheet-sort-03',
    template: 'site/base',
    design: { parts },
  });
})();
