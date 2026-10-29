// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';


  const THEMES = {
    light: { bg: '#eef7fc', panel: '#ffffff', fg: '#17375f', muted: '#536b88', line: '#c8e1f0' },
    dark: { bg: '#15171c', panel: '#20232b', fg: '#e8eaf0', muted: '#9aa1ad', line: '#3a3f4b' },
    warm: { bg: '#eef7fc', panel: '#ffffff', fg: '#17375f', muted: '#536b88', line: '#c8e1f0' },
  };

  const ACCENTS = ['#2475b9', '#2475b9', '#2475b9', '#2475b9', '#2475b9', '#2475b9'];

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
    'frame.header': (base, S) => function (_c) {
      const { content, display, local, nav, navDraw, rng, util } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      if (display !== 'header' || nav) {
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, 'TravelNow');
        brand.dataset.role = 'brand';
      }
      if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        // Consume the original seeded navigation draws to keep all later frame stable.
        const oldItems = navDraw ? local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav) : null;
        for (const item of ['⌂  Home', 'Stays', 'Flights', 'Trains', 'Car Rentals', 'My Trips', 'Saved', '⚙  Settings']) {
          const a = util.el('a', 'ref-navlink', n, item);
          if (item === 'Stays') a.classList.add('ref-nav-active');
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      Object.assign(_c, { header });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-use-travel-hotels-03',
    template: 'site/base',
    design: { THEMES, ACCENTS, parts },
  });
})();
