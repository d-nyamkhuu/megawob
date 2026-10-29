// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, tall, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebar = roomy && rng.bool(0.35);
      const nav = (W >= 1180 && rng.bool(0.5)) || true;
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, placement, sidebar, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { content, ctx, display, lr, nav, rng, util, word } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      const titlebar = util.el('div', 'ol-titlebar', header);
      const mark = util.el('span', 'ol-mark', titlebar, '▧');
      const titleText = util.el('span', 'ol-window-title', titlebar, 'LogiTrack Dispatch Console');
      const winControls = util.el('div', 'ol-window-controls', titlebar);
      for (const glyph of ['−', '□', '×']) util.el('span', 'ol-window-control', winControls, glyph);
      const menubar = util.el('div', 'ol-menubar', header);
      if (display !== 'header' || nav) {
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', menubar, word ? word(lr.pick(K.brand)) : title);
        brand.dataset.role = 'brand';
      }
      if (nav) {
        const n = util.el('nav', 'ref-nav', menubar);
        const navItems = rng.sample(content.NAV_ITEMS, rng.int(3, 5));
        for (const [i, item] of ['Dispatch', 'Route Planning', 'Inventory', 'Vehicles', 'Customers', 'Reports'].entries()) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.olIcon = ['▣', '⌕', '▰', '▤', '▥', '⚒'][i];
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      if (display === 'header') util.el('div', 'ref-instruction', menubar, ctx.instruction);
      else util.el('div', 'ref-spacer', menubar);
      Object.assign(_c, { header, mark, menubar, titleText, titlebar, winControls });
    },
    'frame.tools': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, label, menubar, placement, util, wantFooter } = _c;
      let submit = null;
      const headerTools = util.el('div', 'ref-tools', menubar);
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      Object.assign(_c, { headerTools, submit });
    },
    'frame.body': (base, S) => function (_c) {
      const { ctx, util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const inspector = util.el('aside', 'carbon-inspector', body);
      const section = (title, rows) => {
        util.el('div', 'carbon-inspector-title', inspector, title);
        for (const [k, v] of rows) {
          const row = util.el('div', 'carbon-inspector-row', inspector);
          util.el('span', '', row, k);
          util.el('span', '', row, v);
        }
      };
      const spec = ctx.spec;
      const capacity = spec.routeCapacity;
      const load = spec.items.reduce((sum, item) => sum + item.weight, 0);
      const kg = (n) => `${n.toLocaleString('en-US')} kg`;
      section('Vehicle', [['Vehicle ID', 'VAN-3'], ['Type', 'Box Van (Medium)'], ['Capacity (weight)', kg(capacity)],
        ['Current load', kg(load)], ['Remaining capacity', kg(capacity - load)]]);
      section('Dispatch', [['Reference', spec.code || 'DSP-4178'], ['Date', 'Tue, Apr 22, 2025'], ['Driver', 'Morgan Reed']]);
      section('Stop Details', [['Location', '—'], ['Address', '—'], ['Delivery weight', '—'], ['Service time', '—']]);
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, inspector, section });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      _c.stage = stage;
    },
    'frame.nav': (base, S) => function (_c) {
    },
    'frame.instruction': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-use-dispatch-route-order-03',
    template: 'site/base',
    design: { parts },
  });
})();
