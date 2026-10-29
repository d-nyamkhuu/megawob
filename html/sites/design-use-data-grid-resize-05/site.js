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
        document.body.style.setProperty('--u', Math.max(.65, Math.min(1, W / 1672)));
        document.body.classList.toggle('wb-header-note', display === 'header');

        // A single Workbench-style application window.
        const menubar = util.el('div', 'mac-menubar', document.body);
        util.el('span', 'mac-apple', menubar).innerHTML = '<svg viewBox="0 0 24 28" aria-hidden="true"><path d="M3 3h5v22H3zM11 3h4v8l6-8v9l-5 4 5 9h-6l-4-10z" fill="#111"/></svg>';
        util.el('strong', 'mac-appname', menubar, 'Company Manager 2.1　-　Orders');
        const gadgets = util.el('span', 'mac-status', menubar);
        for (const glyph of ['▁', '▣', '×']) util.el('span', '', gadgets, glyph);
        Object.assign(_c, { H, W, display, menubar, roomy, tall });
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { util } = _c;
        const header = util.el('header', 'ref-task', document.body);
        const appactions = util.el('div', 'mac-actions', header);
        const art = {
          Orders: '<path fill="#eee" d="M7 2h23v30H7z"/><path fill="#164a9e" d="M10 5h5v6h-5zm0 9h5v6h-5zm0 9h5v6h-5z"/><path d="M18 6h8m-8 4h6m-6 6h8m-8 4h6m-6 5h8m-8 4h6"/>',
          Customers: '<path fill="#164a9e" d="M3 28v-8l7-4h15l7 4v8z"/><path fill="#bbb" d="M9 5h7v10H9zM21 4h7v11h-7z"/><path fill="#164a9e" d="M12 29v-8l6-5 6 5v8z"/><path fill="#bbb" d="M15 7h8v11h-8z"/>',
          Inventory: '<path fill="#d7a45d" d="m3 9 15-7 15 7v19l-15 7-15-7z"/><path fill="#e8b776" d="m3 9 15 7 15-7-15-7z"/><path d="M18 16v19M10 6l15 7v7"/>',
          Reports: '<path fill="#174b9e" d="M5 32V17h5v15zm10 0V5h5v27zm10 0V12h5v20z"/><path d="M2 33h32"/>'
        };
        for (const [icon, label] of [
          ['▤', 'Orders'],
          ['♟', 'Customers'],
          ['▧', 'Inventory'],
          ['♟', 'Employees'],
          ['▥', 'Reports'],
        ]) {
          const b = util.el('span', 'mac-action', appactions);
          util.el('b', '', b).innerHTML = '<svg viewBox="0 0 36 38" aria-hidden="true" fill="none" stroke="#111" stroke-width="2" stroke-linejoin="miter">' + art[label === 'Employees' ? 'Customers' : label] + '</svg>';
          util.el('span', '', b, label);
        }
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
        const tips = util.el('section', 'mac-tips', body);
        util.el('strong', 'mac-tips-title', tips, 'Help & Tips');
        const panel = body.querySelector('.ref-panel');
        if (panel) tips.append(panel);
        const tiprow = util.el('div', 'mac-tiprow', tips);
        util.el('h3', 'wb-help-heading', tiprow, 'Working with Orders');
        util.el('p', 'wb-help-intro', tiprow, 'Use the table to view and manage orders. You can sort, filter, select multiple records and perform bulk actions using the toolbar.');
        util.el('h3', 'wb-help-heading', tiprow, 'Tips');
        for (const t of [
          'Click a column header to sort ascending or descending.',
          'Drag a column header to reorder columns.',
          'Drag the right edge of a column header to resize the column.',
          'Use the Find box to quickly search orders.',
          'Use the Show menu to filter by status.',
          'Select multiple rows with Shift-click or Ctrl-click.',
          'Use the toolbar for bulk actions like Delete or Print.',
        ]) {
          const x = util.el('div', 'mac-tip', tiprow);
          util.el('span', '', x, t);
        }
        S.frameAlign(_c, stage);
        Object.assign(_c, { activity, dashboard, metrics, stage, tiprow, tips });
      },
    'frame.toast': (base, S) => (_c) => {
      base(_c);
      const note = document.querySelector('.ref-note');
      if (note) _c.tips.append(note);
    },
  };

  env.site({
    name: 'design-use-data-grid-resize-05',
    template: 'site/base',
    design: { parts },
  });
})();
