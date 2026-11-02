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
      // Short windows need the notification's reserved space for table rows.
      if (display === 'toast' && H < 800) display = 'header';
      // reset() reuses the body: a previous toast must not shrink later episodes.
      document.body.classList.toggle('ref-has-note', display === 'toast');

      // Motif workstation frame surrounding the task window.
      const winbar = util.el('div', 'motif-titlebar', document.body);
      util.el('span', 'motif-app-icon', winbar, '▤');
      util.el('strong', '', winbar, 'Inventory Manager');
      util.el('span', 'motif-window-buttons', winbar, '−　□　×');
      const overview = util.el('section', 'inventory-overview', document.body);
      const identity = util.el('div', 'inventory-identity', overview);
      const logo = util.el('div', 'inventory-logo', identity);
      util.el('span', 'carton carton-back', logo);
      util.el('span', 'carton carton-left', logo);
      util.el('span', 'carton carton-right', logo);
      const intro = util.el('div', 'inventory-intro', identity);
      util.el('strong', '', intro, 'Inventory Manager');
      util.el('span', '', intro, 'Medical Supplies');
      util.el('p', '', intro, 'Track stock levels, update items, and manage your inventory.');
      const summary = util.el('section', 'inventory-summary', overview);
      util.el('h2', '', summary, 'Inventory Summary');
      for (const [k, v] of [['Total Items:', '428'], ['In Stock:', '390'], ['Low Stock:', '28'], ['Out of Stock:', '10']]) {
        const row = util.el('div', 'inventory-stat', summary);
        util.el('span', '', row, k); util.el('b', '', row, v);
      }
      const tips = util.el('aside', 'inventory-tips', overview);
      util.el('h2', '', tips, 'ⓘ　Tips');
      const list = util.el('ul', '', tips);
      for (const t of ['Use the search box to quickly find items.', 'Click column headers to sort.', 'Drag a column header to reorder columns.', 'Use Shift-click to select a range of items.', 'Use the toolbar for actions on selected items.']) util.el('li', '', list, t);
      const appTools = util.el('div', 'motif-toolbar', document.body);
      for (const [icon, label] of [['▤','New Item'],['✎','Edit Item'],['✕','Delete'],['▣','Adjust Stock'],['▧','Print']]) {
        const tool = util.el('div', 'motif-tool', appTools);
        util.el('span', 'motif-tool-icon', tool, icon);
        util.el('span', '', tool, label);
      }
      Object.assign(_c, { H, W, appTools, display, identity, intro, list, logo, overview, roomy, summary, tall, tips, winbar });
    },
  };

  env.site({
    name: 'design-use-data-grid-paginate-02',
    template: 'site/base',
    design: { parts },
  });
})();
