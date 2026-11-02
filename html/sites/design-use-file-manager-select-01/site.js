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
      const navDraw = W >= 1180 && rng.bool(0.5);
      const nav = true;
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, navDraw, placement, sidebar, wantFooter });
    },
    'frame.nav': (base, S) => function (_c) {
      const { content, header, local, nav, navDraw, rng, util } = _c;
      const { K } = S;
      if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        // Keep the legacy seeded draw in place, while presenting the reference app's tabs.
        if (navDraw) local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
        for (const item of ['Files', 'Recents', 'Shared', 'Favorites']) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      const appTools = util.el('div', 'ref-app-tools', header);
      const views = util.el('div', 'ref-view-switch', appTools);
      for (const glyph of ['☷', '▦', '◫']) {
        const v = util.el('span', 'ref-view-icon', views, glyph);
        if (glyph === '☷') v.classList.add('active');
      }
      const search = util.el('div', 'ref-search', appTools);
      util.el('span', 'ref-search-glass', search, '⌕');
      util.el('span', 'ref-search-label', search, 'Search');
      Object.assign(_c, { appTools, search, views });
    },
  };

  env.site({
    name: 'design-use-file-manager-select-01',
    template: 'site/base',
    design: { parts },
  });
})();
