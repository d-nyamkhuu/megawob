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

      // Classic Platinum application frame: title strip, app menus and icon toolbar.
      const titlebar = util.el('div', 'mac-titlebar', document.body);
      util.el('span', 'mac-app-icon', titlebar, '▲');
      util.el('strong', '', titlebar, 'Halcyon Supply');
      util.el('span', 'store-tagline', titlebar, 'EVERYDAY THINGS FOR A BRIGHTER TOMORROW');
      const search = util.el('div', 'store-search', titlebar);
      const searchInput = util.el('span', 'store-search-input', search, 'Search products...');
      util.el('button', 'store-search-go', search, 'Go');
      util.el('span', 'store-cart', titlebar, '🛒　Cart (2)');
      util.el('span', 'mac-window-buttons', titlebar, '▁　□　×');
      const menubar = util.el('nav', 'mac-menubar', document.body);
      for (const item of ['Home', 'Shop ▾', 'Bestsellers', 'Home & Garden', 'Stationery', 'Toys & Games', 'Outdoors', 'Gifts', 'Sale']) {
        const tab = util.el('span', item === 'Stationery' ? 'store-tab is-active' : 'store-tab', menubar, item);
      }
      const toolbar = util.el('div', 'mac-toolbar', document.body);
      for (const [icon, label] of [['◀','Back'],['▶','Forward'],['⌂','Home'],['▱','Events'],['♟','My Account'],['🛒','Basket']]) {
        const b = util.el('div', 'mac-tool', toolbar);
        util.el('span', 'mac-tool-icon', b, icon);
        util.el('span', '', b, label);
      }
      Object.assign(_c, { H, W, display, menubar, roomy, search, searchInput, tall, titlebar, toolbar });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const inspector = util.el('aside', 'store-inspector', body);
      const details = util.el('section', 'store-inspector-card', inspector);
      util.el('div', 'store-inspector-title', details, 'Item Details');
      const product = util.el('div', 'store-inspector-product', details);
      util.el('div', 'store-inspector-mark', product, '✦');
      const description = util.el('div', 'store-inspector-description', product);
      util.el('strong', '', description, 'Selected basket item');
      util.el('div', '', description, 'Item name, quantity and price appear in your basket.');
      const facts = util.el('div', 'store-inspector-facts', details);
      for (const [label, value] of [['Brand', 'Halcyon Supply'], ['Quantity', 'Adjust in basket'], ['Price', 'Shown per item']]) {
        const row = util.el('div', 'store-inspector-fact', facts);
        util.el('strong', '', row, `${label}:`);
        util.el('span', '', row, value);
      }
      const benefits = util.el('section', 'store-inspector-card store-benefits', inspector);
      util.el('div', 'store-inspector-title', benefits, 'Why shop with us?');
      for (const [icon, line] of [['▰', 'Free standard shipping on orders over $25'], ['▦', '30-day returns, hassle-free'], ['▣', 'Secure checkout; your data is safe']]) {
        const row = util.el('div', 'store-benefit', benefits);
        util.el('span', 'store-benefit-icon', row, icon);
        util.el('span', '', row, line);
      }
      Object.assign(_c, { benefits, description, details, facts, inspector, product, stage });
    },
  };

  env.site({
    name: 'design-avoid-dark-patterns-sneak-02',
    template: 'site/base',
    design: { parts },
  });
})();
