// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      // Sun workstation window frame and menu bar. These are static frame; task state stays in the widget.
      const winbar = util.el('div', 'ol-windowbar', header);
      util.el('span', 'ol-appmark', winbar, '⬢');
      util.el('strong', 'ol-windowtitle', winbar, 'Inventory Manager');
      const wincontrols = util.el('div', 'ol-wincontrols', winbar);
      for (const glyph of ['—', '□', '×']) util.el('span', 'ol-wincontrol', wincontrols, glyph);
      const menubar = util.el('nav', 'ol-menubar', header);
      for (const label of ['File', 'Edit', 'View', 'Orders', 'Inventory', 'Reports', 'Help']) util.el('span', 'ol-menuitem', menubar, label);
      S.frameBrand(_c, header);
      Object.assign(_c, { header, menubar, winbar, wincontrols });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const rail = util.el('nav', 'ol-rail', body);
      for (const [icon, label, active] of [['⌂', 'Home', false], ['▤', 'Products', true], ['▣', 'Orders', false], ['♟', 'Suppliers', false], ['▥', 'Reports', false], ['⚙', 'Settings', false]]) {
        const item = util.el('div', `ol-railitem${active ? ' active' : ''}`, rail);
        util.el('span', 'ol-railicon', item, icon);
        util.el('span', 'ol-raillabel', item, label);
      }
      const summary = util.el('aside', 'ol-summary', body);
      util.el('div', 'ol-summary-title', summary, 'Summary');
      for (const [label, value] of [['Total Orders', '248'], ['Pending', '62'], ['Shipped', '170'], ['Cancelled', '16']]) {
        const row = util.el('div', 'ol-summary-row', summary);
        util.el('span', '', row, label);
        util.el('strong', '', row, value);
      }
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, rail, summary });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const tip = util.el('div', 'ol-tip', body);
      util.el('span', 'ol-tipmark', tip, '?');
      util.el('span', 'ol-tiptext', tip, 'Tip: Click a column header to sort. Use the column menus for filtering options.\nYou can select multiple products with Shift-click and use the toolbar for bulk actions.');
      const dock = util.el('nav', 'ol-dock', document.body);
      util.el('div', 'ol-dock-logo', dock, 'BeOS');
      for (const [icon, label, active] of [['▤', 'Orders', true], ['♟', 'Customers', false], ['⬢', 'Products', false], ['◆', 'Suppliers', false], ['▥', 'Reports', false]]) {
        const item = util.el('div', `ol-dock-item${active ? ' active' : ''}`, dock);
        util.el('span', 'ol-dock-icon', item, icon);
        util.el('span', '', item, label);
      }
      const dockTray = util.el('div', 'ol-dock-tray', dock);
      util.el('span', '', dockTray, '🌐  WebPositive');
      util.el('span', '', dockTray, '✉  Mail');
      util.el('span', '', dockTray, '◖))');
      util.el('span', '', dockTray, '▣');
      util.el('span', '', dockTray, '10:24 AM');
      Object.assign(_c, { dock, dockTray, stage, tip });
    },
  };

  env.site({
    name: 'design-use-data-grid-sort-02',
    template: 'site/base',
    design: { parts },
  });
})();
