// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) =>
      function (_c) {
        const { util } = _c;
        const header = util.el('header', 'ref-task', document.body);
        // Native Workplace Shell window frame: app title, menu row and compact toolbar.
        const osTitle = util.el('div', 'os-title', header);
        util.el('span', 'os-appicon', osTitle, '▣');
        util.el('strong', 'os-apptitle', osTitle, 'Inventory Manager - Products');
        const osWindow = util.el('div', 'os-window-controls', osTitle);
        for (const mark of ['−', '□', '×']) util.el('span', 'os-window-button', osWindow, mark);
        const skyline = util.el('div', 'masthead-skyline', header);
        skyline.innerHTML =
          '<svg viewBox="0 0 600 110" aria-hidden="true" focusable="false"><g fill="none" stroke="#176477" stroke-width="2"><path d="M8 99h584M22 97l27-9 24 8 20-5 24 6M115 98V55h44v43m-39-36h8v8h-8zm17 0h8v8h-8zm-17 15h8v8h-8zm17 0h8v8h-8zM177 98V20h20v78m-15-68h10m-10 12h10m-10 12h10m-10 12h10m-10 12h10M213 98V43h48v55m-42-45h9v9h-9zm18 0h9v9h-9zm-18 16h9v9h-9zm18 0h9v9h-9zm-18 16h9v9h-9zm18 0h9v9h-9zM278 98V9h18v89m-14-78h10m-10 14h10m-10 14h10m-10 14h10m-10 14h10m-10 14h10M313 98V34h40v64m-34-52h9v9h-9zm17 0h9v9h-9zm-17 16h9v9h-9zm17 0h9v9h-9zm-17 16h9v9h-9zm17 0h9v9h-9zM365 98V49h56v49m-49-38h10v9h-10zm18 0h10v9h-10zm18 0h10v9h-10zm-36 17h10v9h-10zm18 0h10v9h-10zm18 0h10v9h-10zm-36 17h10v9h-10zm18 0h10v9h-10zm18 0h10v9h-10zM438 98V28h23v70m-18-58h12m-12 14h12m-12 14h12m-12 14h12M474 98V56h43v42m-36-30h10v8h-10zm17 0h10v8h-10zm-17 14h10v8h-10zm17 0h10v8h-10zM536 98V42h35v56m-29-43h9v8h-9zm15 0h9v8h-9zm-15 14h9v8h-9zm15 0h9v8h-9z"/><path d="M225 41l12-17 12 17m-12-17v-9m-2 0h4M95 97l8-18 8 18m367 0 8-17 8 17" stroke-width="3"/></g></svg>';
        const osMenu = util.el('nav', 'os-menu', header);
        for (const label of ['File', 'Edit', 'View', 'Products', 'Tools', 'Reports', 'Window', 'Help']) {
          util.el('span', 'os-menu-item', osMenu, label);
        }
        const osBar = util.el('div', 'os-toolbar', header);
        for (const [icon, label] of [
          ['＋', 'Add Product'],
          ['✎', 'Edit'],
          ['▣', 'Duplicate'],
          ['▤', 'Delete'],
          ['⚒', 'More Actions⌄'],
        ]) {
          const item = util.el('span', 'os-tool-item', osBar);
          util.el('b', 'os-tool-icon', item, icon);
          util.el('span', '', item, label);
        }
        S.frameBrand(_c, header);
        Object.assign(_c, { header, osBar, osMenu, osTitle, osWindow, skyline });
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, util } = _c;
        const stage = util.el('main', 'ref-stage', body);
        S.frameAlign(_c, stage);
        // Persistent app navigation dock, matching the inventory utility's bottom rail.
        const dock = util.el('nav', 'inventory-dock', document.body);
        const dockBrand = util.el('div', 'inventory-dock-brand', dock);
        util.el('span', 'dock-cube', dockBrand, '▧');
        util.el('strong', '', dockBrand, 'Acme Supply Co.');
        const dockItems = [
          ['⌂', 'Dashboard'],
          ['▧', 'Inventory'],
          ['🛒', 'Orders'],
          ['♟', 'Customers'],
          ['▮', 'Reports'],
          ['⚙', 'Settings'],
        ];
        for (const [icon, title] of dockItems) {
          const a = util.el('a', `dock-link${title === 'Inventory' ? ' active' : ''}`, dock, '');
          a.href = '#';
          a.dataset.role = 'nav';
          util.el('span', 'dock-icon', a, icon);
          util.el('span', 'dock-label', a, title);
          a.addEventListener('click', (e) => {
            e.preventDefault();
            env.log('decoy', { what: 'nav', label: title });
          });
        }
        const dockDate = util.el('div', 'dock-account', dock);
        util.el('span', '', dockDate, 'Apr 12, 2015');
        util.el('i', '', dockDate, '');
        util.el('b', 'dock-avatar', dockDate, '●');
        util.el('span', '', dockDate, 'JS⌄');
        Object.assign(_c, { dock, dockBrand, dockDate, dockItems, stage });
      },
  };

  env.site({
    name: 'design-use-data-grid-filter-04',
    template: 'site/base',
    design: { parts },
  });
})();
