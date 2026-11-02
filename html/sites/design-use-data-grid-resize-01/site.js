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
        util.el('span', 'mac-apple', menubar).innerHTML =
          '<svg viewBox="0 0 18 18" aria-hidden="true"><path d="M12.5 9.5c0-1.8 1.5-2.7 1.6-2.8-.9-1.3-2.3-1.5-2.8-1.5-1.2-.1-2.3.7-2.9.7-.6 0-1.5-.7-2.5-.7-1.3 0-2.5.8-3.2 2-.1.2-1.7 3 .4 6.3.5.8 1.1 1.6 1.9 1.6.8 0 1.1-.5 2.2-.5 1 0 1.3.5 2.2.5.9 0 1.4-.8 1.9-1.6.6-.9.8-1.8.8-1.8s-1.6-.6-1.6-2.2ZM10.7 4.1c.5-.6.8-1.4.7-2.2-.7 0-1.6.5-2.1 1.1-.5.5-.8 1.4-.7 2.1.8.1 1.6-.4 2.1-1Z"/></svg>';
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
          ['♧', 'New Order'],
          ['▱', 'Edit'],
          ['▤', 'Delete'],
          ['♧', 'Ship'],
          ['▣', 'Invoice'],
          ['•••', 'More'],
        ]) {
          const b = util.el('span', 'mac-action', appactions);
          util.el('b', '', b, icon);
          util.el('span', '', b, label);
        }
        util.el('span', 'mac-search', header, '⌕　Search orders...');
        S.frameBrand(_c, header);
        Object.assign(_c, { appactions, header });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { util } = _c;
        const body = util.el('div', 'ref-body', document.body);
        const macSide = util.el('aside', 'mac-sidebar', body);
        const sideIcons = {
          Orders: '<path d="M2 3h2l2.1 10h8.8l2-7H5"/><circle cx="7" cy="16" r="1"/><circle cx="14" cy="16" r="1"/>',
          Inventory: '<path d="m9 2 6 3.5v7L9 16l-6-3.5v-7L9 2Z"/><path d="m3.2 5.7 5.8 3.4 5.8-3.4M9 9v7"/>',
          Customers:
            '<circle cx="7" cy="6" r="3"/><path d="M1.5 16c.4-3 2.4-4.5 5.5-4.5s5.1 1.5 5.5 4.5M13 4a3 3 0 0 1 0 5.8M14 12c1.6.5 2.4 1.8 2.6 4"/>',
          Reports: '<path d="M2 15h3V8H2v7Zm5 0h3V3H7v12Zm5 0h3V6h-3v9Zm5 0h2V1h-2v14Z"/>',
          Settings:
            '<circle cx="9" cy="9" r="3"/><path d="m9 1.5 1 .3.6 1.8 1.3.8 1.8-.4 1.2 1.6-.8 1.7.1 1.5 1.3 1.2-.8 1.9-1.9.1-1.1 1-.3 1.9H8.6l-.5-1.8-1.3-.8-1.8.4-1.2-1.6.8-1.7-.1-1.5-1.3-1.2.8-1.9 1.9-.1 1.1-1 .3-1.9H9Z"/>',
        };
        for (const [text, current] of [
          ['Orders', true],
          ['Inventory', false],
          ['Customers', false],
          ['Reports', false],
          ['Settings', false],
        ]) {
          const item = util.el('button', current ? 'mac-sideitem current' : 'mac-sideitem', macSide);
          util.el('span', 'mac-sideicon', item).innerHTML =
            `<svg viewBox="0 0 18 18" aria-hidden="true">${sideIcons[text]}</svg>`;
          util.el('span', '', item, text);
          item.type = 'button';
          item.addEventListener('click', () => env.log('decoy', { what: 'sidebar', label: text }));
        }
        S.frameSidebar(_c, body);
        Object.assign(_c, { body, macSide, sideIcons });
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
    name: 'design-use-data-grid-resize-01',
    template: 'site/base',
    design: { parts },
  });
})();
