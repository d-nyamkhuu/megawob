// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      // Sun workstation window frame and menu bar. These are static frame; task state stays in the widget.
      const winbar = util.el('div', 'ol-windowbar', header);
      util.el('span', 'ol-appmark', winbar, '✥');
      util.el('strong', 'ol-windowtitle', winbar, 'Northwind Inventory');
      const wincontrols = util.el('div', 'ol-wincontrols', winbar);
      for (const glyph of ['—', '□', '×']) util.el('span', 'ol-wincontrol', wincontrols, glyph);
      const menubar = util.el('nav', 'ol-menubar', header);
      for (const label of ['File', 'Edit', 'View', 'Tools', 'Help']) util.el('span', 'ol-menuitem', menubar, label);
      S.frameBrand(_c, header);
      Object.assign(_c, { header, menubar, winbar, wincontrols });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const rail = util.el('nav', 'ol-rail', body);
      for (const [icon, label, active] of [['▦', 'Dashboard', false], ['⬢', 'Products', true], ['▣', 'Orders', false], ['♟', 'Customers', false], ['♜', 'Suppliers', false], ['▥', 'Reports', false]]) {
        const item = util.el('div', `ol-railitem${active ? ' active' : ''}`, rail);
        util.el('span', 'ol-railicon', item, icon);
        util.el('span', 'ol-raillabel', item, label);
      }
      const inspector = util.el('aside', 'ol-inspector', body);
      util.el('div', 'ol-inspector-title', inspector, 'Product Details');
      const product = util.el('div', 'ol-product', inspector);
      util.el('div', 'ol-product-image', product);
      const summary = util.el('div', 'ol-product-summary', product);
      util.el('strong', '', summary, 'Aniseed Syrup');
      util.el('span', '', summary, 'Product ID: 1');
      util.el('span', '', summary, 'Category: Condiments');
      util.el('span', '', summary, 'Supplier: Exotic Liquids');
      util.el('span', '', summary, 'Unit: 12 - 550 ml bottles');
      const stats = util.el('div', 'ol-product-stats', inspector);
      for (const [k, v] of [['Unit Price:', '$10.00'], ['Units In Stock:', '13'], ['Units On Order:', '70'], ['Reorder Level:', '25']]) {
        util.el('span', '', stats, k); util.el('b', '', stats, v);
      }
      util.el('div', 'ol-product-description-label', inspector, 'Description:');
      util.el('div', 'ol-product-description', inspector, 'Sweet and flavorful syrup with an aniseed taste.');
      util.el('div', 'ol-supplier-title', inspector, 'Supplier Information');
      util.el('strong', 'ol-supplier-name', inspector, 'Exotic Liquids');
      util.el('div', 'ol-supplier-address', inspector, '49 Gilbert St.\nLondon, EC1 4SD\nUK');
      util.el('div', 'ol-supplier-contact', inspector, 'Phone:    (171) 555-2222');
      util.el('div', 'ol-supplier-contact', inspector, 'Contact:   Charlotte Cooper');
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, inspector, product, rail, stats, summary });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const tip = util.el('div', 'ol-tip', body);
      util.el('span', 'ol-tipmark', tip, '?');
      util.el('span', 'ol-tiptext', tip, 'Tip: Click a column header to sort. Use the column menus for filtering options.\nYou can select multiple products with Shift-click and use the toolbar for bulk actions.');
      Object.assign(_c, { stage, tip });
    },
  };

  env.site({
    name: 'design-use-data-grid-sort-04',
    template: 'site/base',
    design: { parts },
  });
})();
