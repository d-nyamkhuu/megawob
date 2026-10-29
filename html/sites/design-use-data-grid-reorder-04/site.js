// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.floating': (base, S) =>
      function (_c) {
        const { body, endBtn, header, label, placement, util } = _c;
        let { submit } = _c;
        if (placement === 'floating') {
          // Reserve the control's space so it cannot intercept task clicks or drags.
          // On scrollable pages the dock follows the content, just like a form footer.
          const dock = util.el('div', 'ref-float-dock', document.body);
          submit = endBtn(dock, 'ref-submit ref-float', label);
        }

        // Atari GEM desktop and application dock. These are inert navigation frame.
        const glyphs = {
          disk: '<rect x="5" y="3" width="22" height="26"/><rect x="10" y="5" width="11" height="8" fill="#eee"/><rect x="11" y="7" width="8" height="4"/><rect x="9" y="17" width="14" height="2" fill="#eee"/><rect x="9" y="21" width="14" height="2" fill="#eee"/>',
          files:
            '<path d="M7 2h13l7 7v21H7z"/><path d="M20 2v8h7M11 15h12M11 19h12M11 23h12" fill="none" stroke="#111" stroke-width="2"/>',
          apps: '<rect x="4" y="5" width="24" height="21"/><path d="M4 11h24M10 8h2m3 0h2m3 0h2M9 15h5v5H9zm9 0h6v9h-6z" fill="#eee"/>',
          trash:
            '<path d="M8 9h16l-2 20H10zM6 6h20M12 3h8M13 12v12m6-12v12" fill="none" stroke="#111" stroke-width="2.4"/>',
          orders:
            '<path d="M11 2h15v20H11zM7 6H4v21h16v-3M8 10h13M8 14h13M8 18h13" fill="none" stroke="#111" stroke-width="2.3"/>',
          people:
            '<circle cx="12" cy="9" r="4"/><circle cx="22" cy="11" r="3"/><path d="M3 27c0-7 3-11 9-11s9 4 9 11M19 17c5 0 8 3 8 9" fill="none" stroke="#111" stroke-width="2.5"/>',
          boxes:
            '<path d="m16 2 12 7-12 7L4 9zM4 9v14l12 7 12-7V9M16 16v14M10 5l12 7" fill="none" stroke="#111" stroke-width="2.2"/>',
          employee: '<circle cx="16" cy="8" r="5"/><path d="M5 29c0-8 4-13 11-13s11 5 11 13z"/>',
          reports:
            '<path d="M4 28V4h24v24zM9 23v-6h4v6m2 0V9h4v14m2 0v-9h4v9" fill="none" stroke="#111" stroke-width="2.4"/>',
          settings:
            '<path d="m16 2 3 2 4-1 2 4 4 2-1 4 2 4-3 3v4l-5 1-2 4-4-2-4 2-2-4-5-1v-4l-3-3 2-4-1-4 4-2 2-4 4 1z"/><circle cx="16" cy="15" r="5" fill="#eee" stroke="#111" stroke-width="2"/>',
        };
        const icon = (parent, key, cls) => {
          const svg = util.el('span', cls || 'gem-icon', parent);
          svg.setAttribute('aria-hidden', 'true');
          svg.innerHTML = `<svg viewBox="0 0 32 32" focusable="false">${glyphs[key]}</svg>`;
          return svg;
        };
        const rail = util.el('nav', 'gem-rail', document.body);
        for (const [label, key] of [
          ['Desk', 'disk'],
          ['Files', 'files'],
          ['Apps', 'apps'],
          ['Trash', 'trash'],
        ]) {
          const item = util.el('a', 'gem-rail-item', rail);
          item.href = '#';
          item.addEventListener('click', (e) => {
            e.preventDefault();
            env.log('decoy', { what: 'desktop', label });
          });
          icon(item, key);
          util.el('span', '', item, label);
        }
        // Keep the episode's navigation alongside the desktop shortcuts.
        for (const item of [...header.children, ...body.children]) {
          if (item.classList.contains('ref-nav') || item.classList.contains('ref-side')) rail.append(item);
        }
        util.el('div', 'gem-title', body, 'Orders  -  Falcon Trading Co.                                      ─  □  ×');
        util.el(
          'div',
          'gem-summary',
          body,
          '▤  Orders\nCustomer orders and invoices     │ Total Orders  248 │ Open Orders  62 │ Total Value  $124,830 │ Date Range  1986',
        );
        const inspector = util.el('aside', 'gem-inspector', body);
        for (const item of [...body.children]) {
          if (item.classList.contains('ref-panel')) inspector.append(item);
        }
        util.el(
          'div',
          'gem-details',
          inspector,
          'Order Details\n\nOrder #:   1001\nCustomer:  Acme Industrial\nContact:   John Carter\nInvoice:   INV-7763\nStatus:    Shipped\nOrder Date: Jan 12, 1986\nShip Date:  Jan 14, 1986\nTotal:     $1,240.00\n\n───────────────────\nShipping Address:\n\nAcme Industrial\n123 Market St.\nSpringfield, IL 62704\nUSA\n\n───────────────────\nNotes:\n\nPriority customer.\nShip complete order.',
        );
        const appDock = util.el('nav', 'gem-dock', document.body);
        for (const [label, key] of [
          ['Orders', 'orders'],
          ['Customers', 'people'],
          ['Products', 'boxes'],
          ['Employees', 'employee'],
          ['Reports', 'reports'],
          ['Settings', 'settings'],
        ]) {
          const item = util.el('a', 'gem-dock-item', appDock);
          item.href = '#';
          item.addEventListener('click', (e) => {
            e.preventDefault();
            env.log('decoy', { what: 'nav', label });
          });
          icon(item, key);
          util.el('span', '', item, label);
        }
        Object.assign(_c, { appDock, glyphs, icon, rail, submit });
      },
  };

  env.site({
    name: 'design-use-data-grid-reorder-04',
    template: 'site/base',
    design: { parts },
  });
})();
