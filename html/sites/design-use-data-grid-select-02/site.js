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
      root.dataset.theme = name;
      // This design has one stable GNOME Human palette; keep the original draws above
      // so the page's seeded frame choices do not shift any later values.
      for (const [k, v] of Object.entries({ bg: '#efede6', panel: '#fbfaf7', fg: '#171b25', muted: '#655d55', line: '#bdb7ad' })) root.style.setProperty(`--${k}`, v);
      root.style.setProperty('--accent', '#fa8124');
      Object.assign(_c, { accent, content, name, rng, root, tr, util });
    },
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, tall, util, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      if (roomy) rng.bool(0.35);
      const sidebar = false;
      const showNav = W >= 1180 && rng.bool(0.5);
      const nav = true;
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      const titlebar = util.el('div', 'human-titlebar', document.body);
      util.el('strong', 'human-app-title', titlebar, 'Inventory');
      const productSearch = util.el('div', 'human-product-search', titlebar);
      util.el('span', 'human-search-icon', productSearch, '⌕');
      util.el('span', 'human-search-placeholder', productSearch, 'Search products...');
      const winControls = util.el('div', 'human-window-controls', titlebar);
      util.el('span', 'human-winbtn', winControls, '−');
      util.el('span', 'human-winbtn', winControls, '□');
      util.el('span', 'human-winbtn human-close', winControls, '×');
      const menubar = util.el('nav', 'human-menubar', document.body);
      for (const label of ['File', 'Edit', 'View', 'Go', 'Tools', 'Help']) util.el('span', 'human-menuitem', menubar, label);
      Object.assign(_c, { collide, cr, decoys, label, menubar, nav, placement, productSearch, showNav, sidebar, titlebar, wantFooter, winControls });
    },
    'frame.nav': (base, S) => function (_c) {
      const { content, header, nav, rng, showNav, util } = _c;
      if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        if (showNav) rng.sample(content.NAV_ITEMS, rng.int(3, 5));
        for (const item of ['⌂　Home', '▧　Products', '▤　Orders', '♟　Suppliers', '▥　Reports']) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
    },
    'frame.tools': (base, S) => function (_c) {
      base(_c);
      _c.titlebar.insertBefore(_c.headerTools, _c.productSearch);
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const summary = util.el('section', 'inventory-summary', body);
      const metrics = util.el('div', 'inventory-metrics', summary);
      for (const [value, label, cls] of [['248', 'Total Products', ''], ['12', 'In Stock', 'green'],
        ['7', 'Backordered', 'orange'], ['229', 'Out of Stock', '']]) {
        const metric = util.el('div', `inventory-metric ${cls}`, metrics);
        util.el('strong', '', metric, value);
        util.el('span', '', metric, label);
      }
      const chart = util.el('div', 'inventory-chart', summary);
      util.el('div', 'inventory-donut', chart);
      const legend = util.el('div', 'inventory-legend', summary);
      util.el('strong', 'inventory-legend-title', legend, 'Inventory Status');
      for (const [color, label, value] of [['green', 'In Stock', '12 (5%)'], ['orange', 'Backordered', '7 (3%)'], ['gray', 'Out of Stock', '229 (92%)']]) {
        const row = util.el('div', 'inventory-legend-row', legend);
        util.el('i', `inventory-dot ${color}`, row);
        util.el('span', '', row, label);
        util.el('span', 'inventory-legend-value', row, value);
      }
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, chart, legend, metrics, summary });
    },
    'frame.panel': (base, S) => function (_c) {
      const { body, ctx, display, lr, rng, util, word } = _c;
      const { K } = S;
      document.body.classList.toggle('human-instruction-panel', display === 'panel');
      if (display === 'panel') {
        const panel = util.el('aside', 'ref-panel', body);
        const heading = rng.pick(['Your task', 'Instructions', 'To do', 'Goal']);
        util.el('div', 'ref-panel-title', panel, word ? word(lr.pick(K.panel)) : heading);
        util.el('div', 'ref-panel-text', panel, ctx.instruction);
        if (rng.bool(0.5)) body.classList.add('ref-panel-right');
      }
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      const categories = util.el('aside', 'inventory-categories', body);
      util.el('strong', '', categories, 'Categories');
      for (const [label, count, selected] of [['All Products', '248', true], ['Accessories', '142'], ['Displays', '28'],
        ['Ergonomics', '18'], ['Audio', '24'], ['Networking', '16'], ['Storage', '12'], ['Power', '8']]) {
        const row = util.el('div', `inventory-category${selected ? ' selected' : ''}`, categories);
        util.el('span', '', row, label);
        util.el('span', '', row, count);
      }
      S.frameAlign(_c, stage);
      Object.assign(_c, { categories, stage });
    },
  };

  env.site({
    name: 'design-use-data-grid-select-02',
    template: 'site/base',
    design: { parts },
  });
})();
