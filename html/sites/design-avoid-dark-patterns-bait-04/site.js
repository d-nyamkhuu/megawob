// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.theme': (base, S) => function (_c) {
      const { ctx } = _c;
      const { ACCENTS, LOW_ACCENTS, LOW_THEME, THEMES } = S;
      const { rng, util, content } = ctx;
      let name = rng.pick(Object.keys(THEMES));
      const root = document.documentElement;
      let accent = rng.pick(ACCENTS);
      const tr = rng.fork('chrome/theme');
      if (tr.bool(0.08)) {
        name = 'low';
        accent = tr.pick(LOW_ACCENTS);
      }
      for (const [k, v] of Object.entries(name === 'low' ? LOW_THEME : THEMES[name])) root.style.setProperty(`--${k}`, v);
      root.style.setProperty('--accent', accent);
      // The reference design has a fixed parchment-and-olive palette across episodes.
      for (const [k, v] of Object.entries({ bg:'#fbfaf7', panel:'#fffefa', fg:'#171713', muted:'#655f55', line:'#e2ddd3', accent:'#29372a' })) root.style.setProperty(`--${k}`, v);
      root.dataset.theme = name;
      Object.assign(_c, { accent, content, name, rng, root, tr, util });
    },
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      header.classList.add('air-header');
      const winbar = util.el('div', 'shop-titlebar', header);
      util.el('span', 'shop-mark', winbar, '▣');
      util.el('strong', '', winbar, 'KitchenShop - Home & Cookware');
      util.el('span', 'shop-window-controls', winbar, '−　□　×');
      const menubar = util.el('nav', 'shop-menubar', header);
      for (const item of ['File', 'Edit', 'View', 'Go', 'Favorites', 'Tools', 'Help']) util.el('span', '', menubar, item);
      const toolbar = util.el('nav', 'shop-toolbar', header);
      const toolbarIcons = [
        ['back','Back','<path d="M21 12H4m0 0 8-8m-8 8 8 8"/>'],
        ['forward','Forward','<path d="M3 12h17m0 0-8-8m8 8-8 8"/>'],
        ['home','Home','<path d="M3 11 12 3l9 8M6 10v10h12V10M10 20v-6h4v6"/>'],
        ['search','Search','<circle cx="10" cy="10" r="6.5"/><path d="m15 15 6 6"/>'],
        ['products','Products','<path d="M6 3h9l4 4v14H6zM15 3v5h5M9 12h7M9 16h7"/>'],
        ['basket','Basket','<path d="M3 5h2l2.2 11h11.5l2-8H6M9 10l3-4 3 4M9 20a1 1 0 1 0 0 .1M17 20a1 1 0 1 0 0 .1"/>'],
        ['help','Help','<path d="M8.5 8.5a3.6 3.6 0 1 1 5.8 2.9c-1.3 1-2.3 1.6-2.3 3.6M12 19v.1"/>'],
      ];
      for (const [key, item, paths] of toolbarIcons) {
        const tool = util.el('div', 'shop-tool', toolbar);
        const icon = util.el('b', `shop-icon shop-icon-${key}`, tool);
        icon.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${paths}</svg>`;
        util.el('span', '', tool, item);
      }
      const masthead = util.el('div', 'shop-masthead', header);
      const identity = util.el('div', 'shop-identity', masthead);
      util.el('strong', '', identity, 'KitchenShop');
      util.el('span', '', identity, 'Quality Cookware for Every Kitchen');
      const storeNav = util.el('nav', 'shop-links', masthead);
      for (const item of ['Cookware', 'Knives', 'Bakeware', 'Electrical', 'Tableware', 'Special Offers']) {
        const link = util.el('a', '', storeNav, item);
        link.href = '#';
        link.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what:'store-nav', label:item }); });
      }
      const basket = util.el('div', 'shop-basket', masthead);
      util.el('strong', '', basket, '🛒　Your Basket');
      util.el('span', '', basket, '0 items');
      util.el('span', '', basket, 'Total: €0.00');
      const basketLink = util.el('a', '', basket, 'View Basket');
      basketLink.href = '#';
      basketLink.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what:'basket' }); });
      const airbrand = util.el('div', 'air-brand', header, 'KitchenShop');
      const airtabs = util.el('nav', 'air-tabs', header);
      for (const item of ['Cookware', 'Knives', 'Bakeware', 'Electrical', 'Tableware', 'Special Offers']) {
        const a = util.el('a', `air-tab${item === 'Flights' ? ' active' : ''}`, airtabs, item);
        a.href = '#';
        a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
      }
      S.frameBrand(_c, header);
      Object.assign(_c, { airbrand, airtabs, basket, basketLink, header, identity, masthead, menubar, storeNav, toolbar, toolbarIcons, winbar });
    },
    'frame.tools': (base, S) => function (_c) {
      base(_c);
      _c.toolbar.appendChild(_c.headerTools);
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      body.classList.add('air-body');
      const inspector = util.el('aside', 'air-inspector', body);
      util.el('h2', '', inspector, 'Shop by Category');
      const section = (title, rows) => {
        const box = util.el('section', 'air-section', inspector);
        util.el('h3', '', box, title);
        for (const [k, v] of rows) {
          const row = util.el('div', 'air-detail', box);
          util.el('span', '', row, k); util.el('span', '', row, v);
        }
      };
      section('Categories', [['Knives', '›'], ['Cookware', '›'], ['Bakeware', '›'], ['Electrical', '›'], ['Tableware', '›'], ['Food Preparation', '›'], ['Storage', '›'], ['Special Offers', '›']]);
      section('Customer Service', [['Delivery Information', ''], ['Returns', ''], ['Help & FAQs', ''], ['Contact Us', '']]);
      const summary = util.el('aside', 'shop-summary', body);
      const summarySection = (title) => {
        const box = util.el('section', 'shop-summary-section', summary);
        util.el('h2', '', box, title);
        return box;
      };
      const reasons = summarySection('Why Shop With Us?');
      const points = util.el('ul', 'shop-benefits', reasons);
      for (const item of ['Quality brands', 'Great prices', 'Fast delivery', '30 day returns', 'Secure payment']) util.el('li', '', points, item);
      const rating = summarySection('Customer Rating');
      util.el('div', 'shop-stars', rating, '★★★★★');
      util.el('div', '', rating, '4.8 out of 5');
      util.el('div', '', rating, '(1,245 reviews)');
      const brands = summarySection('Popular Brands');
      for (const item of ['Global', 'Victorinox', 'Zwilling', 'Wüsthof', 'Scanpan']) {
        const link = util.el('a', 'shop-brand-link', brands, item);
        link.href = '#';
        link.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what:'brand', label:item }); });
      }
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, brands, inspector, points, rating, reasons, section, summary, summarySection });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, inspector, util } = _c;
      // Sidebar frame takes space in the existing category column, outside the stage.
      for (const panel of body.querySelectorAll('.ref-panel, .ref-side')) inspector.prepend(panel);
      const stage = util.el('main', 'ref-stage', body);
      stage.classList.add('air-results');
      const resultsHead = util.el('div', 'air-results-head', stage);
      const routeTitle = util.el('div', 'air-route-title', resultsHead, 'Professional Tools for Real Cooking');
      util.el('div', 'air-route-meta', resultsHead, 'Trusted brands. Great prices. For home chefs.');
      const sort = util.el('div', 'air-sort', resultsHead);
      util.el('span', '', sort, 'Sort by');
      util.el('span', 'air-sort-value', sort, 'Best value　⌄');
      body.insertBefore(resultsHead, stage);
      S.frameAlign(_c, stage);
      Object.assign(_c, { resultsHead, routeTitle, sort, stage });
    },
  };

  env.site({
    name: 'design-avoid-dark-patterns-bait-04',
    template: 'site/base',
    design: { parts },
  });
})();
