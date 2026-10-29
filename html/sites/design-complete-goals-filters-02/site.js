// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.theme': (base, S) =>
      function (_c) {
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
        for (const [k, v] of Object.entries(name === 'low' ? LOW_THEME : THEMES[name]))
          root.style.setProperty(`--${k}`, v);
        root.style.setProperty('--accent', accent);
        // This design uses the same fixed notebook palette in every seeded episode.
        for (const [k, v] of Object.entries({
          bg: '#e8f3ef',
          panel: '#eff7f3',
          fg: '#17352d',
          muted: '#557068',
          line: '#b8d0c8',
          accent: '#176452',
        }))
          root.style.setProperty(`--${k}`, v);
        root.dataset.theme = name;
        Object.assign(_c, { accent, content, name, rng, root, tr, util });
      },
    'frame.placement': (base, S) =>
      function (_c) {
        const { W, content, ctx, local, lr, rng, roomy, tall, word } = _c;
        const { K, endLabel } = S;
        // End control placement (none in finish mode).
        let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
        if (placement === 'floating') placement = 'footer';
        const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
        if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
        const sidebarDraw = roomy && rng.bool(0.35);
        const navDraw = W >= 1180 && rng.bool(0.5);
        const sidebar = roomy || sidebarDraw;
        const nav = W >= 1180 || navDraw;
        const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
        let label = endLabel(rng, content);
        if (word) label = word(lr.pick(K.end));
        // A decoy that reads like an end control (another end word, never this episode's label).
        const { collide, cr } = S.frameCollide(_c, label);
        Object.assign(_c, { collide, cr, decoys, label, nav, navDraw, placement, sidebar, sidebarDraw, wantFooter });
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { content, display, local, lr, nav, rng, util, word } = _c;
        const { K, TITLES } = S;
        const header = util.el('header', 'ref-task', document.body);
        const winbar = util.el('div', 'office-titlebar', document.body, '▣  Product Explorer');
        const wincontrols = util.el('div', 'office-wincontrols', winbar);
        for (const mark of ['−', '□', '×']) util.el('span', '', wincontrols, mark);
        if (display !== 'header' || nav) {
          const title = rng.pick(TITLES);
          const brand = util.el('div', 'ref-brand', header, word ? word(lr.pick(K.brand)) : title);
          if (!word) brand.textContent = 'TerraGo';
          brand.dataset.role = 'brand';
        }
        if (nav) {
          const n = util.el('nav', 'ref-nav', header);
          for (const item of word
            ? local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav)
            : ['Explore', 'Plan', 'Discover']) {
            const a = util.el('a', 'ref-navlink', n, item);
            a.dataset.role = 'nav';
            a.addEventListener('click', (e) => {
              e.preventDefault();
              env.log('decoy', { what: 'nav', label: item });
            });
          }
        }
        Object.assign(_c, { header, winbar, wincontrols });
      },
    'frame.instruction': (base, S) =>
      function (_c) {
        const { ctx, display, header, util } = _c;
        if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
        else util.el('div', 'ref-spacer', header);
        const ribbon = util.el('div', 'office-ribbon', document.body);
        const ribbonTabs = util.el('div', 'office-ribbon-tabs', ribbon);
        for (const [i, tab] of ['Home', 'View', 'Tools'].entries()) {
          const t = util.el('span', i === 0 ? 'selected' : '', ribbonTabs, tab);
        }
        const ribbonTools = util.el('div', 'office-ribbon-tools', ribbon);
        for (const [icon, title, sub] of [
          ['◉', 'Browse', 'Navigate'],
          ['★', 'Favorites', ''],
          ['◷', 'History', ''],
          ['▰', 'Collections', ''],
          ['☷', 'New List', 'Manage'],
          ['✚', 'Add to List', ''],
          ['✖', 'Remove', ''],
          ['▤', 'Copy Details', ''],
          ['▣', 'Print', 'Share'],
          ['✉', 'Send', ''],
          ['☷', 'Sort', 'View'],
          ['▽', 'Filter', ''],
          ['▤', 'Group', ''],
        ]) {
          const tool = util.el('div', 'office-tool', ribbonTools);
          util.el('b', '', tool, icon);
          util.el('span', '', tool, title);
        }
        const navtabs = util.el('div', 'office-category-tabs', document.body);
        for (const [i, tab] of [
          'All Products',
          'Snacks',
          'Beverages',
          'Groceries',
          'Household',
          'Personal Care',
          'Office Supplies',
        ].entries()) {
          util.el('span', i === 0 ? 'selected' : '', navtabs, tab);
        }
        util.el('div', 'office-search', navtabs, '⌕  Search products...');
        Object.assign(_c, { navtabs, ribbon, ribbonTabs, ribbonTools });
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, util } = _c;
        const stage = util.el('main', 'ref-stage', body);
        S.frameAlign(_c, stage);
        const products = util.el('aside', 'office-products', body);
        util.el('strong', '', products, 'Products');
        util.el('span', 'count', products, '263 items');
        const table = util.el('table', 'office-product-table', products);
        const head = util.el('thead', '', table);
        const hr = util.el('tr', '', head);
        for (const title of ['', 'Name  ▴', 'Category', 'Size']) util.el('th', '', hr, title);
        const rows = [
          ['🥜', 'Almonds', 'Snacks', '200 g'],
          ['🍚', 'Basmati Rice', 'Groceries', '1 kg'],
          ['🍵', 'Black Tea', 'Beverages', '100 g'],
          ['🥜', 'Cashew Nuts', 'Snacks', '250 g'],
          ['🌶️', 'Chili Sauce', 'Groceries', '500 ml'],
          ['🍪', 'Chocolate Cookies', 'Snacks', '300 g'],
          ['🥥', 'Coconut Milk', 'Groceries', '400 ml'],
          ['🍊', 'Dried Apricots', 'Snacks', '200 g'],
          ['🍵', 'Green Tea', 'Beverages', '100 g'],
          ['🥜', 'Mixed Nuts', 'Snacks', '300 g'],
          ['🥣', 'Oatmeal', 'Groceries', '500 g'],
          ['🫒', 'Olive Oil', 'Groceries', '1 L'],
          ['🥜', 'Salted Pistachios', 'Snacks', '300 g'],
          ['🍅', 'Tomato Ketchup', 'Groceries', '500 ml'],
        ];
        const tb = util.el('tbody', '', table);
        for (const [icon, name, category, size] of rows) {
          const row = util.el('tr', '', tb);
          util.el('td', 'product-thumb', row, icon);
          util.el('td', '', row, name);
          util.el('td', '', row, category);
          util.el('td', '', row, size);
        }
        util.el('div', 'office-scroll-tail', products).setAttribute('aria-hidden', 'true');
        Object.assign(_c, { head, hr, products, rows, stage, table, tb });
      },
    'frame.nav': (base, S) => function (_c) {},
  };

  env.site({
    name: 'design-complete-goals-filters-02',
    template: 'site/base',
    design: { parts },
  });
})();
