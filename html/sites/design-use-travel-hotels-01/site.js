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
        const brand = util.el('div', 'ref-brand', header, 'VoyageNow');
        brand.dataset.role = 'brand';
      }
      if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        // Consume the original seeded navigation draws to keep all later frame stable.
        const oldItems = navDraw ? local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav) : null;
        for (const item of ['⌂  Home', 'Flights', 'Hotels', 'Cars', 'My Itinerary', 'Travel Guides']) {
          const a = util.el('a', 'ref-navlink', n, item);
          if (item === 'Hotels') a.classList.add('ref-nav-active');
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      Object.assign(_c, { header });
    },
    'frame.panel': (base, S) => function (_c) {
      const { body, ctx, display, lr, rng, util, word } = _c;
      const { K } = S;
      if (display === 'panel') {
        const panel = util.el('aside', 'ref-panel', body);
        const heading = rng.pick(['Your task', 'Instructions', 'To do', 'Goal']);
        util.el('div', 'ref-panel-title', panel, word ? word(lr.pick(K.panel)) : heading);
        util.el('div', 'ref-panel-text', panel, ctx.instruction);
        if (rng.bool(0.5)) body.classList.add('ref-panel-right');
      }
      // Travel itinerary rail: static related-record context, kept outside the task widget.
      const trip = util.el('aside', 'travel-trip', body);
      const tripBox = util.el('section', 'travel-trip-box', trip);
      util.el('h3', '', tripBox, 'My Trip');
      for (const [icon, title, date] of [['✈', 'San Francisco (SFO)', 'Fri, May 16'], ['▣', 'Palma', 'May 16 – May 21'], ['✈', 'Return to San Francisco', 'Wed, May 21']]) {
        const row = util.el('div', 'travel-trip-row', tripBox);
        util.el('b', '', row, icon);
        const copy = util.el('span', '', row);
        util.el('strong', '', copy, title);
        util.el('small', '', copy, date);
        util.el('i', '', row, '›');
      }
      const related = util.el('section', 'travel-trip-box travel-related', trip);
      util.el('h3', '', related, 'Other Hotels in Palma');
      for (const [name, price, rating] of [['Hotel Almudaina','$180','8.5'],['Palma Marina Hotel','$210','8.3'],['Hotel Costa Azul','$150','8.1'],['Sun Club Palma','$190','8.4'],['Hotel Bellver','$220','8.2']]) {
        const row = util.el('div', 'travel-related-row', related);
        util.el('span', 'travel-thumb', row, '▧');
        const copy = util.el('span', '', row);
        util.el('strong', '', copy, name);
        util.el('small', '', copy, `${price} · ${rating}`);
      }
      Object.assign(_c, { related, trip, tripBox });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-use-travel-hotels-01',
    template: 'site/base',
    design: { THEMES, ACCENTS, parts },
  });
})();
