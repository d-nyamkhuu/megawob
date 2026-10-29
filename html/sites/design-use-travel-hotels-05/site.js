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
      const titlebar = util.el('div', 'legacy-titlebar', header);
      util.el('span', 'legacy-globe', titlebar, '🌐');
      util.el('strong', '', titlebar, 'GlobeTrack Travel Services');
      util.el('span', 'legacy-window', titlebar, '−　□　×');
      const menu = util.el('div', 'legacy-menu', header);
      util.el('span', '', menu, 'File'); util.el('span', '', menu, 'Edit'); util.el('span', '', menu, 'View');
      util.el('span', '', menu, 'Search'); util.el('span', '', menu, 'Bookings'); util.el('span', '', menu, 'Tools'); util.el('span', '', menu, 'Help');
      const toolbar = util.el('div', 'legacy-toolbar', header);
      for (const [icon, label] of [['✈','Flights'],['▣','Hotels'],['🚘','Cars'],['▰','My Trips'],['♟','Travelers'],['▤','Reports']]) {
        const item = util.el('span', 'legacy-tool', toolbar); util.el('b', '', item, icon); util.el('span', '', item, label);
      }
      const tabs = util.el('div', 'legacy-tabs', header);
      for (const label of ['Search','Hotel Results','Hotel Details','Manage Booking','Travel Resources']) {
        const tab = util.el('span', 'legacy-tab', tabs, label); if (label === 'Search') tab.classList.add('selected');
      }
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
      // Generic search help, independent of the instruction and target criteria.
      const trip = util.el('aside', 'travel-trip', body);
      const tripBox = util.el('section', 'travel-trip-box', trip);
      util.el('h3', '', tripBox, 'Your Search');
      for (const [label, value] of [['Destination','See hotel results'],['Check-in','Jun 14, 2024'],['Check-out','Jun 17, 2024'],['Rooms','1'],['Adults','2'],['Children','0'],['Price per night','Adjust price filter'],['Guest rating','Compare guest reviews'],['Amenities','See property details']]) {
        const row = util.el('div', 'summary-row', tripBox); util.el('span','',row,label); util.el('b','',row,value);
      }
      const related = util.el('section', 'travel-trip-box travel-related', trip);
      util.el('h3', '', related, 'Results Summary');
      for (const [label, value] of [['Properties','Browse results'],['Prices','Per night in USD'],['Guest ratings','Verified stays'],['Availability','Subject to confirmation']]) {
        const row = util.el('div', 'summary-row', related); util.el('span','',row,label); util.el('b','',row,value);
      }
      const map = util.el('section', 'travel-trip-box travel-map', trip); util.el('h3','',map,'Map');
      util.el('div','map-art',map,'City map');
      Object.assign(_c, { related, trip, tripBox });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-use-travel-hotels-05',
    template: 'site/base',
    design: { THEMES, ACCENTS, parts },
  });
})();
