// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, ctx, display, header, util } = _c;
        const stage = util.el('main', 'ref-stage', body);
        S.frameAlign(_c, stage);
        const summary = util.el('section', 'inventory-summary', stage);
        util.el('h1', '', summary, 'Products');
        const cards = util.el('div', 'inventory-summary-cards', summary);
        for (const [value, label, color, icon] of [
          ['247', 'Total Products', 'blue', '⬡'],
          ['164', 'In Stock', 'green', '▣'],
          ['58', 'Low Stock', 'orange', '⚠'],
          ['25', 'Out of Stock', 'red', '⊘'],
        ]) {
          const card = util.el('div', `summary-card ${color}`, cards);
          util.el('strong', '', card, value);
          util.el('span', '', card, label);
          util.el('b', '', card, icon);
        }

        // Lisa-era inventory window. Keep the generated stage and all task controls intact;
        // only replace the sibling dashboard's presentation frame.
        const oldControls = [...document.querySelectorAll('.ref-tools button, .ref-tools a')];
        header.replaceChildren();
        header.className = 'ref-task window-title';
        const cubeIcon = (parent, className, palette) => {
          const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          svg.setAttribute('class', className);
          svg.setAttribute('viewBox', '0 0 24 24');
          svg.setAttribute('aria-hidden', 'true');
          for (const [points, fill] of [
            ['12,1 23,7 12,13 1,7', palette[0]],
            ['1,7 12,13 12,24 1,18', palette[1]],
            ['23,7 12,13 12,24 23,18', palette[2]],
          ]) {
            const face = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            face.setAttribute('points', points);
            face.setAttribute('fill', fill);
            svg.appendChild(face);
          }
          parent.appendChild(svg);
        };
        const appIcon = util.el('span', 'app-paper-icon', header);
        appIcon.setAttribute('aria-hidden', 'true');
        cubeIcon(appIcon, 'app-cube', ['#fff', '#dff2ff', '#a9dcfa']);
        util.el('strong', 'app-title', header, 'Northwind Inventory Manager');
        const winControls = util.el('div', 'window-controls', header);
        for (const mark of ['−', '□', '×']) util.el('span', 'window-control', winControls, mark);
        const menubar = util.el('nav', 'app-menubar', header);
        for (const label of ['File', 'Edit', 'View', 'Tools', 'Reports', 'Help'])
          util.el('span', 'menu-item', menubar, label);
        const modulebar = util.el('nav', 'modulebar', header);
        const actionPaths = {
          file: ['M5 2.5h9l4 4v15H5z', 'M14 2.5v5h4'],
          edit: ['M4 17.5 17.5 4l3 3L7 20.5 3 21z', 'M15.8 5.7l3 3'],
          delete: ['M5 7h14', 'M9 7V4h6v3', 'M7 7l1 14h8l1-14', 'M10 10v8', 'M14 10v8'],
          stock: [
            'M2 6h12v11H2z',
            'M14 10h4l4 4v3h-8',
            'M6 20a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z',
            'M18 20a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z',
          ],
          tag: ['M3 4h11l7 8-8 9-10-10z', 'M8 8h.01'],
          export: ['M4 9v11h16V9', 'M12 15V2', 'M7 7l5-5 5 5'],
        };
        for (const [icon, label] of [
          ['file', 'New Product'],
          ['edit', 'Edit'],
          ['delete', 'Delete'],
          ['stock', 'Adjust Stock'],
          ['tag', 'Change Category'],
          ['export', 'Export'],
        ]) {
          const item = util.el('span', 'module-item', modulebar);
          const iconBox = util.el('b', 'module-icon', item);
          const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          svg.setAttribute('class', 'toolbar-svg');
          svg.setAttribute('viewBox', '0 0 24 24');
          svg.setAttribute('aria-hidden', 'true');
          for (const d of actionPaths[icon]) {
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', d);
            svg.appendChild(path);
          }
          iconBox.appendChild(svg);
          util.el('span', '', item, label);
        }
        if (display === 'header') util.el('div', 'ref-instruction app-header-note', header, ctx.instruction);
        const overview = util.el('section', 'inventory-overview', document.body);
        document.body.insertBefore(overview, body);
        util.el('h1', '', overview, 'Products');
        const overviewCards = util.el('div', 'overview-cards', overview);
        for (const [value, label, color, icon] of [
          ['247', 'Total Products', 'blue', '⬡'],
          ['164', 'In Stock', 'green', '▣'],
          ['58', 'Low Stock', 'orange', '⚠'],
          ['25', 'Out of Stock', 'red', '⊘'],
        ]) {
          const card = util.el('div', `overview-card ${color}`, overviewCards);
          util.el('strong', '', card, value);
          util.el('span', '', card, label);
          util.el('b', '', card, icon);
        }

        // Discard randomized dashboard navigation and provide the target app's stable rails.
        for (const child of [...body.children]) if (child !== stage) child.remove();
        body.classList.add('inventory-layout');
        const leftRail = util.el('aside', 'inventory-rail', body);
        body.insertBefore(leftRail, stage);
        for (const [icon, label, active] of [
          ['▥', 'Dashboard'],
          ['▣', 'Products', true],
          ['🛒', 'Orders'],
          ['♧', 'Suppliers'],
          ['♟', 'Customers'],
          ['▤', 'Reports'],
        ]) {
          const a = util.el('div', `rail-item${active ? ' selected' : ''}`, leftRail);
          util.el('span', 'rail-icon', a, icon);
          util.el('span', '', a, label);
        }
        util.el('hr', '', leftRail);
        const inspector = util.el('aside', 'product-inspector', body);
        util.el('h2', '', inspector, 'Product Details');
        const emptyProduct = util.el('div', 'inspector-empty', inspector);
        const emptyCube = util.el('b', 'empty-cube', emptyProduct);
        cubeIcon(emptyCube, 'inspector-cube', ['#d9dde0', '#c8cdd1', '#b6bdc2']);
        util.el('span', '', emptyProduct, 'No product selected');
        for (const label of [
          'Product Name',
          'Category',
          'Supplier',
          'Unit Price',
          'Stock Status',
          'Quantity',
          'SKU',
          'Barcode',
          'Reorder Level',
          'Location',
          'Description',
        ]) {
          const row = util.el('div', 'inspector-row', inspector);
          util.el('span', '', row, label);
          util.el('b', '', row, '—');
        }
        const tips = util.el('aside', 'tips-panel', body);
        util.el('h2', '', tips, '♧  Tips & Help');
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
        Object.assign(_c, {
          actionPaths,
          appIcon,
          cards,
          cubeIcon,
          emptyCube,
          emptyProduct,
          inspector,
          leftRail,
          menubar,
          modulebar,
          oldControls,
          overview,
          overviewCards,
          stage,
          summary,
          tips,
          winControls,
        });
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
        const appControls = new Set([...oldControls, ...document.querySelectorAll('.ref-tools button, .ref-tools a')]);
        appFooter.replaceChildren();
        util.el('span', 'ref-foot-text', appFooter, 'Inventory  •  All changes saved');
        const appFooterTools = util.el('div', 'ref-tools app-footer-tools', appFooter);
        for (const control of appControls) appFooterTools.appendChild(control);
        Object.assign(_c, { appFooter, appFooterTools, submit });
      },
  };

  env.site({
    name: 'design-use-data-grid-multirow-04',
    template: 'site/base',
    design: { parts },
  });
})();
