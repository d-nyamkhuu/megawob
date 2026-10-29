// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  function pixelIcon(kind) {
    const paths = {
      box: '<path d="M3 11 20 3l17 8-17 9z" fill="#f4d16b"/><path d="M3 11v21l17 7V20z" fill="#e4b84d"/><path d="M20 20v19l17-8V11z" fill="#c6972b"/><path d="m12 7 17 9v12M28 7 11 16v10" fill="none" stroke="#7796ad" stroke-width="2"/>',
      home: '<path d="m3 19 17-15 17 15-4 4-4-4v18H11V19l-4 4z"/><path d="M17 37V24h7v13M27 10V4h6v12" fill="#b5d9f4"/>',
      orders: '<path d="M9 3h19l7 8v27H9z"/><path d="M27 3v9h8M14 17h15M14 22h15M14 27h15M14 32h15" fill="none"/>',
      truck:
        '<path d="M2 9h23v21H2zM25 17h9l5 8v5H25z" fill="#99d9eb"/><path d="M28 19h5l4 6h-9z" fill="#eef9ff"/><path d="M7 29h6v7H7zM29 29h6v7h-6z" fill="#f9fbff"/>',
      people:
        '<path d="M4 22h10v14H2V25zM27 22h10l2 4v10H27zM13 19h15l3 6v13H10V25z" fill="#b5d9ef"/><path d="M7 9h7v10H7zM28 9h7v10h-7zM17 4h9v12h-9z"/>',
      reports: '<path d="M4 22h7v15H4zM16 14h7v23h-7zM28 4h7v33h-7z" fill="#b9dff5"/>',
      settings:
        '<path d="m16 2 8 0 1 6 6-2 5 6-4 5 6 3-1 8-6 1 1 6-8 4-4-5-5 5-7-4 2-6-6-2 0-8 6-2-2-6 6-5 5 3z" fill="#b7cee6"/><path d="M15 15h11v12H15z" fill="#faf8ed"/>',
    };
    return (
      '<svg viewBox="0 0 42 42" aria-hidden="true" shape-rendering="crispEdges"><g fill="#f4f7fc" stroke="#091747" stroke-width="2" stroke-linejoin="miter">' +
      (paths[kind] || paths.box) +
      '</g></svg>'
    );
  }

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
        document.body.dataset.instruction = display;
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
    'frame.placement': (base, S) =>
      function (_c) {
        const { W, content, ctx, local, lr, rng, roomy, tall, word } = _c;
        const { K, endLabel } = S;
        // End control placement (none in finish mode).
        let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
        const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
        if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
        const sidebar = roomy && rng.bool(0.35);
        const nav = W >= 1180 && rng.bool(0.5);
        const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
        let label = endLabel(rng, content);
        if (rng.fork('chrome/acme-end-label').bool(0.5)) label = 'Save';
        if (word) label = word(lr.pick(K.end));
        // A decoy that reads like an end control (another end word, never this episode's label).
        const { collide, cr } = S.frameCollide(_c, label);
        Object.assign(_c, { collide, cr, decoys, label, nav, placement, sidebar, wantFooter });
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { util } = _c;
        const header = util.el('header', 'ref-task', document.body);
        const company = util.el('div', 'acme-brand', header);
        company.insertAdjacentHTML('beforeend', pixelIcon('box'));
        util.el('span', '', company, 'Acme Supply Co.');
        const account = util.el('div', 'acme-account', header);
        for (const item of ['Welcome, jsmith', '|', 'Help', '|', 'Sign Out']) util.el('span', '', account, item);
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
        Object.assign(_c, { account, appactions, company, header });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { util } = _c;
        const body = util.el('div', 'ref-body', document.body);
        const rail = util.el('nav', 'acme-rail', body);
        for (const [title, icon] of [
          ['Dashboard', 'home'],
          ['Orders', 'orders'],
          ['Inventory', 'box'],
          ['Suppliers', 'truck'],
          ['Customers', 'people'],
          ['Reports', 'reports'],
          ['Settings', 'settings'],
        ]) {
          const item = util.el('div', 'acme-nav-item' + (title === 'Inventory' ? ' active' : ''), rail);
          item.insertAdjacentHTML('beforeend', pixelIcon(icon));
          util.el('span', '', item, title);
        }
        S.frameSidebar(_c, body);
        Object.assign(_c, { body, rail });
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, util } = _c;
        const stage = util.el('main', 'ref-stage', body);
        const inspector = util.el('aside', 'acme-inspector', body);
        const inspectorHead = util.el('div', 'acme-inspector-head', inspector);
        inspectorHead.insertAdjacentHTML('beforeend', pixelIcon('box'));
        util.el('strong', '', inspectorHead, 'Item Details');
        const inspectorRows = util.el('div', 'acme-inspector-rows', inspector);
        const inspectorData = [
          ['Item ID:', 'ITM-1001'],
          ['Item Name:', 'Blue Widget'],
          ['Category:', 'Widgets'],
          ['Supplier:', 'Global Parts Co.'],
          ['Price:', '$2.50'],
          ['In Stock:', '120'],
          ['Status:', 'Active'],
          ['Last Ordered:', 'Mar 01, 2005'],
        ];
        for (const [field, value] of inspectorData) {
          const row = util.el('div', 'acme-inspector-row', inspectorRows);
          util.el('span', '', row, field);
          util.el('span', '', row, value);
        }
        const art = util.el('div', 'acme-inspector-art', inspector);
        art.insertAdjacentHTML(
          'beforeend',
          '<svg viewBox="0 0 96 96" aria-hidden="true" shape-rendering="crispEdges"><path d="M18 27 46 11l34 13-30 18z" fill="#55b9f4" stroke="#061b3f" stroke-width="4"/><path d="M18 27v39l32 18V42z" fill="#1878c8" stroke="#061b3f" stroke-width="4"/><path d="M50 42v42l30-20V24z" fill="#07549c" stroke="#061b3f" stroke-width="4"/><path d="m32 19 31 14M34 36v37M65 36v36" fill="none" stroke="#87d5ff" stroke-width="4"/></svg>',
        );
        const description = util.el('div', 'acme-inspector-description', inspector, 'Description:');
        util.el('div', 'acme-description-text', description, 'Standard blue widget for general use.');
        for (const field of ['Weight:', 'Dimensions:', 'Location:']) {
          const row = util.el('div', 'acme-inspector-row acme-inspector-extra', inspector);
          util.el('span', '', row, field);
          util.el(
            'span',
            '',
            row,
            field === 'Weight:' ? '0.2 kg' : field === 'Dimensions:' ? '5 x 5 x 5 cm' : 'Aisle 1, Bin A3',
          );
        }
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
        Object.assign(_c, {
          activity,
          art,
          dashboard,
          description,
          inspector,
          inspectorData,
          inspectorHead,
          inspectorRows,
          metrics,
          stage,
          tiprow,
          tips,
        });
      },
  };

  env.site({
    name: 'design-use-data-grid-resize-04',
    template: 'site/base',
    design: { parts },
  });
})();
