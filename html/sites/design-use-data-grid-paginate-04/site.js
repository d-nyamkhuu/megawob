// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.layout': (base, S) => function (_c) {
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
      document.body.classList.toggle('ref-display-hidden', display === 'hidden');

      // Motif workstation frame surrounding the task window.
      const winbar = util.el('div', 'motif-titlebar', document.body);
      util.el('span', 'motif-app-icon', winbar, '▤');
      util.el('strong', '', winbar, 'Inventory Manager');
      util.el('span', 'motif-window-buttons', winbar, '▁ □ ×');
      const menubar = util.el('nav', 'motif-menubar', document.body);
      for (const item of ['File', 'Edit', 'View', 'Records', 'Tools', 'Window', 'Help']) util.el('span', '', menubar, item);
      Object.assign(_c, { H, W, display, menubar, roomy, tall, winbar });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const index = util.el('aside', 'motif-index', body);
      const railItems = [
        ['◆', 'Dashboard'], ['⬡', 'Inventory'], ['▤', 'Orders'],
        ['♟', 'Suppliers'], ['♟', 'Customers'], ['▥', 'Reports'], ['⚙', 'Settings'],
      ];
      for (const [icon, label] of railItems) {
        const item = util.el('div', `motif-index-item${label === 'Inventory' ? ' is-active' : ''}`, index);
        util.el('span', 'motif-rail-icon', item, icon);
        util.el('span', 'motif-rail-label', item, label);
      }
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, index, railItems });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);

      // Decorative task toolbar between the instruction bar and the workspace.
      const toolbar = util.el('div', 'motif-task-toolbar');
      toolbar.setAttribute('aria-hidden', 'true');
      for (const [icon, text] of [['＋', 'Add Item'], ['✎', 'Edit Item'], ['▤', 'Delete'], ['◆', 'Bulk Update'], ['▧', 'Export']]) {
        const item = util.el('div', 'motif-task-tool', toolbar);
        util.el('span', 'motif-task-tool-icon', item, icon);
        util.el('span', '', item, text);
        if (text === 'Edit Item' || text === 'Delete') item.classList.add('is-separated');
      }
      body.before(toolbar);

      // Static item inspector (filler): fixed sample product, not tied to the grid.
      const inspector = util.el('aside', 'motif-inspector', body);
      util.el('h2', 'motif-inspector-title', inspector, 'Item Details');
      const productArt = util.el('div', 'motif-product-art', inspector);
      util.el('span', 'motif-mug', productArt);
      const details = util.el('dl', 'motif-details', inspector);
      for (const [label, value] of [['SKU', 'MG-2044'], ['Product Name', 'Ceramic mug, 350 ml'], ['Supplier', 'Northfield Ceramics'],
        ['Unit Price', '$8.40'], ['Stock', '412'], ['Updated', 'Jun 3, 2024']]) {
        util.el('dt', '', details, label);
        util.el('dd', '', details, value);
      }
      const attributes = util.el('section', 'motif-attributes', inspector);
      util.el('h3', '', attributes, 'Product Attributes');
      const attributeRows = util.el('dl', 'motif-attribute-list', attributes);
      for (const [label, value] of [['Colour', 'White'], ['Material', 'Stoneware'], ['Capacity', '350 ml']]) {
        util.el('dt', '', attributeRows, label);
        util.el('dd', '', attributeRows, value);
      }
      Object.assign(_c, { attributeRows, attributes, details, inspector, productArt, stage, toolbar });
    },
  };

  env.site({
    name: 'design-use-data-grid-paginate-04',
    template: 'site/base',
    design: { parts },
  });
})();
