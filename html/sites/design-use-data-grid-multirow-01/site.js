// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  function stationeryIcon(kind) {
    const paths = {
      paper: '<path d="M5 2h9l5 5v15H5zM14 2v5h5M8 11h8M8 15h8"/>',
      box: '<path d="m3 7 9-5 9 5v11l-9 5-9-5zM3 7l9 5 9-5M12 12v11M8 4l9 5"/>',
      clipboard: '<path d="M7 4H4v18h16V4h-3M8 2h8v5H8zM7 11h10M7 15h10M7 19h7"/>',
      people:
        '<circle cx="9" cy="8" r="4"/><path d="M2 21v-2a7 7 0 0 1 14 0v2zM17 4a4 4 0 0 1 0 8M18 15a6 6 0 0 1 4 6"/>',
      chart: '<path d="M3 21h19M5 18h4V9H5zM11 18h4V4h-4zM17 18h4v-6h-4z"/>',
      folder: '<path d="M2 6h8l2 3h10v12H2z"/>',
      building: '<path d="M3 21h18M5 21V8l7-5 7 5v13M9 21v-6h6v6M8 10h2m4 0h2"/>',
      list: '<path d="M8 5h13M8 12h13M8 19h13"/><circle cx="3.5" cy="5" r=".8"/><circle cx="3.5" cy="12" r=".8"/><circle cx="3.5" cy="19" r=".8"/>',
      warning: '<path d="M12 3 2 21h20zM12 9v5m0 3v1"/>',
      clock: '<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 3"/>',
      archive: '<path d="M3 4h18v5H3zM5 9v12h14V9M9 13h6"/>',
      book: '<path d="M2 5q5-3 10 1 5-4 10-1v15q-5-2-10 2-5-4-10-2zM12 6v16"/>',
      window: '<path d="M2 3h20v18H2zM2 8h20M5 5.5h1m3 0h1"/>',
    };
    return `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${paths[kind] || paths.paper}</svg>`;
  }

  const parts = {
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, ctx, display, header, util } = _c;
        const stage = util.el('main', 'ref-stage', body);
        S.frameAlign(_c, stage);

        // Lisa-era inventory window. Keep the generated stage and all task controls intact;
        // only replace the sibling dashboard's presentation frame.
        const oldControls = [...document.querySelectorAll('.ref-tools button, .ref-tools a')];
        header.replaceChildren();
        header.className = 'ref-task window-title';
        const appIcon = util.el('span', 'app-paper-icon', header);
        appIcon.innerHTML = stationeryIcon('paper');
        appIcon.setAttribute('aria-hidden', 'true');
        util.el('strong', 'app-title', header, 'Acme Supply Co.  —  Inventory');
        const winControls = util.el('div', 'window-controls', header);
        for (const mark of ['−', '□', '×']) util.el('span', 'window-control', winControls, mark);
        const modulebar = util.el('nav', 'modulebar', header);
        for (const [icon, label, active] of [
          ['box', 'Catalog', true],
          ['paper', 'Orders'],
          ['clipboard', 'Invoices'],
          ['people', 'Suppliers'],
          ['chart', 'Reports'],
        ]) {
          const item = util.el('span', `module-item${active ? ' active' : ''}`, modulebar);
          const iconEl = util.el('b', 'module-icon', item);
          iconEl.innerHTML = stationeryIcon(icon);
          util.el('span', '', item, label);
        }
        if (display === 'header') util.el('div', 'ref-instruction app-header-note', header, ctx.instruction);

        // Discard randomized dashboard navigation and provide the target app's stable rails.
        for (const child of [...body.children]) if (child !== stage) child.remove();
        body.classList.add('inventory-layout');
        const leftRail = util.el('aside', 'inventory-rail', body);
        util.el('h2', '', leftRail, 'Inventory');
        for (const [icon, label, active] of [
          ['archive', 'Products', true],
          ['folder', 'Categories'],
          ['people', 'Suppliers'],
          ['building', 'Locations'],
        ]) {
          const a = util.el('div', `rail-item${active ? ' selected' : ''}`, leftRail);
          const glyph = util.el('span', 'rail-icon', a);
          glyph.innerHTML = stationeryIcon(icon);
          util.el('span', '', a, label);
        }
        util.el('hr', '', leftRail);
        util.el('h2', '', leftRail, 'Views');
        for (const [icon, label, active] of [
          ['list', 'All Products', true],
          ['warning', 'Low Stock'],
          ['clock', 'Recently Added'],
          ['archive', 'Archived'],
        ]) {
          const a = util.el('div', `rail-item${active ? ' selected' : ''}`, leftRail);
          const glyph = util.el('span', 'rail-icon', a);
          glyph.innerHTML = stationeryIcon(icon);
          util.el('span', '', a, label);
        }
        body.insertBefore(leftRail, stage);
        const tips = util.el('aside', 'tips-panel', body);
        const tipsTitle = util.el('h2', '', tips);
        const tipsIcon = util.el('span', 'tips-icon', tipsTitle);
        tipsIcon.innerHTML = stationeryIcon('book');
        util.el('span', '', tipsTitle, 'Tips & Help');
        for (const [title, copy] of [
          ['Working with products', 'Sort by clicking a column header. Click again to reverse the order.'],
          ['Find products', 'Use the search box or Filters… to narrow the list by name, category, supplier or status.'],
          ['Select multiple rows', 'Click a row to select it. Shift-click to select a range of rows.'],
          [
            'Bulk actions',
            'Use the buttons below the table to archive, edit, change category or delete the selected products.',
          ],
          [
            'Other tips',
            '•  Drag column headers to reorder.\n•  Drag the column edges to resize.\n•  Use the page controls to browse through records.',
          ],
        ]) {
          const section = util.el('section', 'tip-section', tips);
          util.el('strong', '', section, title);
          util.el('div', '', section, copy);
        }
        if (display === 'panel') {
          const note = util.el('aside', 'inventory-task-note', body);
          util.el('strong', '', note, 'Your task');
          util.el('div', '', note, ctx.instruction);
          body.insertBefore(note, stage);
        }
        Object.assign(_c, { appIcon, leftRail, modulebar, oldControls, stage, tips, tipsIcon, tipsTitle, winControls });
      },
    'frame.floating': (base, S) =>
      function (_c) {
        const { endBtn, label, oldControls, placement, util } = _c;
        let { submit } = _c;
        if (placement === 'floating') {
          // Reserve the control's space so it cannot intercept task clicks or drags.
          // On scrollable pages the dock follows the content, just like a form footer.
          const dock = util.el('div', 'ref-float-dock', document.body);
          submit = endBtn(dock, 'ref-submit ref-float', label);
        }
        // The end control remains separate from any instruction note and always reachable.
        let appFooter = document.querySelector('.ref-foot');
        if (!appFooter) appFooter = util.el('footer', 'ref-foot', document.body);
        const footerControls = new Set([
          ...oldControls,
          ...document.querySelectorAll('.ref-tools button, .ref-tools a'),
        ]);
        appFooter.replaceChildren();
        util.el('span', 'ref-foot-text', appFooter, 'Inventory  •  All changes saved');
        const appFooterTools = util.el('div', 'ref-tools app-footer-tools', appFooter);
        for (const control of footerControls) appFooterTools.appendChild(control);
        Object.assign(_c, { appFooter, appFooterTools, submit });
      },
  };

  env.site({
    name: 'design-use-data-grid-multirow-01',
    template: 'site/base',
    design: { parts },
  });
})();
