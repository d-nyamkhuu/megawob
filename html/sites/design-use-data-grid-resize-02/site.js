// Design on templates/site/base.js: retain the template's frame and controls.
(function () {
  'use strict';
  const parts = {
    'frame.header': (base) => function (_c) {
      const { util } = _c;
        // Native-style system menu above the Inventory Pro window.
        const menubar = util.el('div', 'mac-menubar', document.body);
        const apple = util.el('span', 'mac-apple', menubar);
        apple.innerHTML =
          '<svg viewBox="0 0 24 28" aria-hidden="true"><path fill="currentColor" d="M15 6c2-1 3-3 3-5-3 0-5 2-5 5zM20 15c-4-3-2-6 0-7-3-3-5-2-7-1-3-2-6-1-8 1-4 4-2 12 1 16 2 3 4 1 6 1 3 0 4 2 6-1 2-2 3-5 3-6-1 0-1-1-1-3z"/></svg>';
        util.el('strong', 'mac-appname', menubar, 'Orders');
        for (const item of ['File', 'Edit', 'View', 'Records', 'Tools', 'Window', 'Help'])
          util.el('span', 'mac-menuitem', menubar, item);
        util.el('span', 'mac-status', menubar, '▣　');

      base(_c);
      const { header } = _c;
      _c.menubar = menubar;
        header.insertAdjacentHTML('afterbegin', '<span class="mac-traffic"><i></i><i></i><i></i></span>');
        menubar.appendChild(header.querySelector('.mac-traffic'));
        const appactions = util.el('div', 'mac-actions', header);
        const icons = {
          document: '<path d="M5 2h13l8 8v24H5zM18 2v9h8"/>',
          ship: '<path fill="currentColor" stroke="none" d="M1 12h16V3H7v9H1v14h4a5 5 0 0 1 10 0h9a5 5 0 0 1 10 0h3V15l-6-8H20v15h-3V12z"/><path d="M24 10h6l4 7H24z"/><circle cx="10" cy="27" r="3"/><circle cx="29" cy="27" r="3"/>',
          cancel: '<path d="M4 4l26 26M30 4L4 30"/>',
          delete: '<path d="M8 10h19v23H8zM4 6h27M12 6V2h11v4M14 14v14M21 14v14"/>',
        };
        for (const [icon, label] of [
          ['document', 'New Order'],
          ['ship', 'Ship'],
          ['cancel', 'Cancel'],
          ['delete', 'Delete'],
        ]) {
          const b = util.el('span', 'mac-action', appactions);
          util.el('b', '', b).innerHTML =
            '<svg viewBox="0 0 38 36" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true">' +
            icons[icon] +
            '</svg>';
          util.el('span', '', b, label);
        }
        const search = util.el('span', 'mac-search', header);
        search.innerHTML =
          '<svg viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true"><circle cx="13" cy="13" r="10"/><path d="M21 21l12 12"/></svg><span>Search orders…</span>';
        const show = util.el('span', 'mac-show', header);
        show.innerHTML = '<span>Show:</span><span class="mac-show-value">All Orders<i>▴<br>▾</i></span>';
      document.body.dataset.instruction = _c.display;
    },
    'frame.instruction': (base) => function (_c) {
      const header = _c.header;
      _c.header = _c.menubar;
      base(_c);
      _c.header = header;
    },
    'frame.tools': (base) => function (_c) {
      const header = _c.header;
      const completion = _c.util.el('div', 'mac-completion', document.body);
      _c.completion = completion;
      _c.header = completion;
      base(_c);
      _c.header = header;
    },
    'frame.panel': (base) => function (_c) {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
    },
    'frame.stage': (base) => function (_c) {
      const { body, header, util } = _c;
        const dashboard = util.el('div', 'mac-dashboard', body);
        const intro = util.el('div', 'mac-intro', dashboard);
        util.el('span', 'mac-document', intro).innerHTML =
          '<svg viewBox="0 0 80 100" fill="white" stroke="currentColor" stroke-width="3" aria-hidden="true"><path d="M8 3h48l20 22v72H2V8h6z"/><path d="M8 8h47v23h21M18 25h29M18 37h43M18 49h43M18 61h43M18 73h43M18 85h30"/></svg>';
        const identity = util.el('div', 'mac-identity', intro);
        util.el('strong', '', identity, 'Orders');
        util.el('span', '', identity, 'Manage customer orders, track status and shipments.');
        const metrics = util.el('div', 'mac-metrics', dashboard);
        for (const [a, b, c] of [
          ['Total Orders', '254', ''],
          ['Open Orders', '68', ''],
          ['Shipped Orders', '167', ''],
          ['Cancelled Orders', '19', ''],
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
        header.insertBefore(dashboard, header.querySelector('.mac-actions'));
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
      base(_c);
    },
    'frame.footer': (base) => function (_c) {
      base(_c);
      const foot = document.querySelector('.ref-foot');
      if (foot) {
        foot.querySelector('.ref-foot-text').textContent = 'Ready';
        // Keep secondary controls in the usual bottom action row.
        for (const button of foot.querySelectorAll('.ref-xtra')) _c.headerTools.appendChild(button);
        if (_c.display === 'panel' && ['footer', 'link'].includes(_c.placement)) {
          _c.headerTools.appendChild(_c.submit);
        }
      }
    },
    'frame.floating': (base) => function (_c) {
      base(_c);
      if (_c.display === 'panel' && _c.placement === 'floating') {
        _c.headerTools.appendChild(_c.submit);
      }
      const { completion } = _c;
      const tools = _c.headerTools;
      document.body.classList.toggle('mac-has-footer-controls', tools.children.length > 0);
      document.body.style.setProperty('--completion-width', tools.children.length ? completion.getBoundingClientRect().width + 48 + 'px' : '30px');
    },
  };
  env.site({
    name: 'design-use-data-grid-resize-02',
    template: 'site/base',
    design: { parts },
  });
})();
