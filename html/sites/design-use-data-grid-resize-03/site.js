// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.layout': (base, S) =>
      function (_c) {
        const { ctx, util } = _c;
        const W = window.innerWidth;
        const H = window.innerHeight;
        const roomy = W >= 1260;
        const tall = H >= 700;
        let display = ctx.display || 'header';
        if (display === 'panel' && !roomy) display = 'header';
        if (display === 'toast' && !tall) display = 'header';
        // reset() reuses the body: a previous toast must not shrink later episodes.
        document.body.classList.toggle('ref-has-note', display === 'toast');

        // Native-style system menu above the Inventory Pro window.
        const menubar = util.el('div', 'mac-menubar', document.body);
        util.el('span', 'mac-apple', menubar, '●');
        util.el('strong', 'mac-appname', menubar, 'Inventory Pro');
        for (const item of ['File', 'Edit', 'View', 'Records', 'Tools', 'Window', 'Help'])
          util.el('span', 'mac-menuitem', menubar, item);
        util.el('span', 'mac-status', menubar, '◉　◈　⌕　▣　Mon Apr 28　9:41 AM');
        Object.assign(_c, { H, W, display, menubar, roomy, tall });
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { util } = _c;
        const header = util.el('header', 'ref-task', document.body);
        header.insertAdjacentHTML('afterbegin', '<span class="mac-traffic"><i></i><i></i><i></i></span>');
        const appactions = util.el('div', 'mac-actions', header);
        for (const [icon, label] of [
          ['', 'Products'],
          ['', 'Orders'],
          ['', 'Customers'],
          ['', 'Suppliers'],
          ['', 'Employees'],
          ['', 'Reports'],
        ]) {
          const b = util.el('span', 'mac-action', appactions);
          util.el('b', '', b, icon);
          util.el('span', '', b, label);
        }
        util.el('span', 'mac-search', header, '⌕　Search orders...');
        S.frameBrand(_c, header);
        Object.assign(_c, { appactions, header });
      },
    'frame.panel': (base, S) =>
      function (_c) {
        const { body, ctx, display, lr, rng, util, word } = _c;
        const { K } = S;
        if (display === 'panel') {
          const panel = util.el('aside', 'ref-panel', body);
          const heading = rng.pick(['Your task', 'Instructions', 'To do', 'Goal']);
          util.el('div', 'ref-panel-title', panel, word ? word(lr.pick(K.panel)) : heading);
          util.el('div', 'ref-panel-text', panel, ctx.instruction);
          if (rng.bool(0.5)) body.classList.add('ref-panel-right');
        }
        const explorer = util.el('aside', 'win-explorer', body);
        const categoryPane = util.el('section', 'win-pane win-categories', explorer);
        util.el('strong', 'win-pane-title', categoryPane, 'Product Categories');
        const categories = util.el('div', 'win-category-list', categoryPane);
        for (const [label, selected] of [
          ['All Products', true],
          ['Computers', false],
          ['Peripherals', false],
          ['Software', false],
          ['Office Supplies', false],
          ['Furniture', false],
          ['Telecommunications', false],
          ['Audio & Video', false],
          ['Maintenance', false],
        ]) {
          const row = util.el('div', `win-category${selected ? ' selected' : ''}`, categories);
          util.el('span', 'win-tree-toggle', row, '+');
          util.el('span', 'win-folder', row, '');
          util.el('span', 'win-category-label', row, label);
        }
        const relatedPane = util.el('section', 'win-pane win-related', explorer);
        util.el('strong', 'win-pane-title', relatedPane, 'Products (56)');
        const relatedHead = util.el('div', 'win-related-head', relatedPane);
        util.el('span', '', relatedHead, 'SKU');
        util.el('span', '', relatedHead, 'Product Name');
        const relatedRows = util.el('div', 'win-related-rows', relatedPane);
        for (const [sku, product] of [
          ['C-100', 'Desktop PC'],
          ['C-101', 'Laptop Computer'],
          ['C-102', 'LCD Monitor'],
          ['C-103', 'Keyboard'],
          ['C-104', 'Optical Mouse'],
          ['C-105', 'Laser Printer'],
          ['C-106', 'Inkjet Printer'],
          ['C-107', 'Scanner'],
          ['C-108', 'External Hard Drive'],
          ['C-109', 'USB Flash Drive'],
          ['C-110', 'Office Chair'],
          ['C-111', 'Desk'],
          ['C-112', 'Filing Cabinet'],
          ['C-113', 'Telephone'],
        ]) {
          const row = util.el('div', 'win-related-row', relatedRows);
          util.el('span', '', row, sku);
          util.el('span', '', row, product);
        }
        Object.assign(_c, { categories, categoryPane, explorer, relatedHead, relatedPane, relatedRows });
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, util } = _c;
        const stage = util.el('main', 'ref-stage', body);
        const dashboard = util.el('div', 'mac-dashboard', body);
        const metrics = util.el('div', 'mac-metrics', dashboard);
        for (const [a, b, c] of [
          ['Total Orders', '1,284', '↑ 12%'],
          ['Revenue', '$316,540', '↑ 8%'],
          ['Open Orders', '342', '↑ 5%'],
          ['Shipped This Month', '892', '↑ 18%'],
        ]) {
          const card = util.el('div', 'mac-metric', metrics);
          util.el('span', '', card, a);
          util.el('strong', '', card, b);
          util.el('em', '', card, c);
        }
        const activity = util.el('div', 'mac-activity', dashboard);
        util.el('strong', '', activity, 'Recent Activity');
        for (const t of [
          'Order #10824 shipped',
          'Payment received',
          'Inventory updated',
          'Order #10823 invoiced',
          'Low stock alert',
        ])
          util.el('div', '', activity, t);
        body.insertBefore(dashboard, stage);
        const tips = util.el('section', 'mac-tips', document.body);
        util.el('strong', 'mac-tips-title', tips, '💡　Tips & Help');
        const tiprow = util.el('div', 'mac-tiprow', tips);
        for (const [h, t] of [
          ['Sort and filter', 'Click a column header to sort. Use the filter button in each header to narrow results.'],
          [
            'Select multiple',
            'Use Shift-click to select a range, or click the checkbox in the header to select all visible rows.',
          ],
          ['Bulk actions', 'After selecting rows, use the toolbar to ship, invoice, mark as paid, or delete.'],
          ['Adjust columns', 'Drag a column’s right edge to resize. Drag the header to reorder columns.'],
        ]) {
          const x = util.el('div', 'mac-tip', tiprow);
          util.el('b', '', x, h);
          util.el('span', '', x, t);
        }
        S.frameAlign(_c, stage);
        Object.assign(_c, { activity, dashboard, metrics, stage, tiprow, tips });
      },
  };

  env.site({
    name: 'design-use-data-grid-resize-03',
    template: 'site/base',
    design: { parts },
  });
})();
