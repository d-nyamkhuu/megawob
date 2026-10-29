// Design on templates/site/drag-composition-event-02.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-complete-goals-filters-03',
    styles: ['site.css'],
    scripts: [],
    template: 'site/complete-goals-event-02',
    design: {
      parts: {
        'frame.9': (base, S) => function (_c) {
          const { root } = _c;
          for (const [k, v] of Object.entries({ bg:'#fbfaf6', panel:'#ffffff', fg:'#101943', muted:'#6e7ba5', line:'#e0e2e7', accent:'#3987f5' })) root.style.setProperty(`--${k}`, v);
          root.dataset.theme = _c.name;
        },
        'frame.23': (base, S) => function (_c) {
          const { rng, tall } = _c;
          if (_c.placement === 'floating') _c.placement = 'footer';
          const wantFooter = tall && (_c.placement === 'footer' || _c.placement === 'link' || rng.bool(0.3));
          Object.assign(_c, { wantFooter });
        },
        'frame.25': (base, S) => function (_c) {
          const { W, rng, roomy } = _c;
          const sidebarDraw = roomy && rng.bool(0.35);
          const navDraw = W >= 1180 && rng.bool(0.5);
          const sidebar = roomy || sidebarDraw;
          const nav = W >= 1180 || navDraw;
          Object.assign(_c, { nav, navDraw, sidebar, sidebarDraw });
        },
        'frame.26': () => () => {},
        'frame.34': (base, S) => function (_c) {
          const { K, TITLES } = S;
          const { content, header, local, lr, nav, rng, util, word } = _c;
          if (_c.display !== 'header' || nav) {
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, word ? word(lr.pick(K.brand)) : title);
        if (!word) brand.textContent = 'TerraGo';
        brand.dataset.role = 'brand';
      }
          if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        for (const item of (word ? local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav) : ['Explore', 'Plan', 'Discover'])) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
        },
        'frame.35': () => () => {},
        'frame.46': () => () => {},
        'frame.47': () => () => {},
        'frame.48': () => () => {},
        'frame.49': () => () => {},
        'frame.50': () => () => {},
        'frame.51': () => () => {},
        'frame.52': () => () => {},
        'frame.53': () => () => {},
        'frame.54': () => () => {},
        'frame.55': () => () => {},
        'frame.56': () => () => {},
        'frame.57': () => () => {},
        'frame.58': () => () => {},
        'frame.59': () => () => {},
        'frame.60': () => () => {},
        'frame.61': () => () => {},
        'frame.62': () => () => {},
        'frame.63': () => () => {},
        'frame.64': () => () => {},
        'frame.65': () => () => {},
        'frame.66': () => () => {},
        'frame.67': () => () => {},
        'frame.68': () => () => {},
        'frame.69': () => () => {},
        'frame.70': () => () => {},
      },
    },
  });
})();
