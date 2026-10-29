// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const brand = util.el('div', 'ref-brand', header, 'Riverton Delivery Planner');
      brand.dataset.role = 'brand';
      const winControls = util.el('div', 'win-controls', header);
      for (const mark of ['_', '□', '×']) util.el('span', 'win-control', winControls, mark);
      const menu = util.el('nav', 'win-menu', header);
      for (const item of ['File', 'Edit', 'View', 'Tools', 'Help']) util.el('span', 'win-menu-item', menu, item);
      const tabs = util.el('nav', 'win-tabs', header);
      for (const item of ['Map', 'Addresses', 'Deliveries', 'Vehicles', 'Reports']) {
        const tab = util.el('span', `win-tab${item === 'Map' ? ' active' : ''}`, tabs, item);
      }
      Object.assign(_c, { brand, header, menu, tabs, winControls });
    },
  };

  env.site({
    name: 'design-pan-map-zone-02',
    template: 'site/base',
    design: { parts },
  });
})();
