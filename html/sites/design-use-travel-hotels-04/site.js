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
    'frame.layout': (base) => function (_c) {
      base(_c);
      // This design's note takes space in the flex column; it needs no floating-note reserve.
      document.body.classList.remove('ref-has-note');
    },
    'frame.placement': (base) => function (_c) {
      base(_c);
      // Keep this design's navigation while preserving the template's seeded draws.
      _c.navDraw = _c.nav;
      _c.nav = true;
    },
    'frame.header': (base, S) => function (_c) {
      const { content, display, local, nav, navDraw, rng, util } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      const windowBar = util.el('div', 'ns-titlebar', document.body);
      util.el('strong', '', windowBar, 'Travel Planner');
      const winButtons = util.el('div', 'ns-window-buttons', windowBar);
      for (const mark of ['−', '□', '×']) util.el('span', '', winButtons, mark);
      const menuBar = util.el('div', 'ns-menubar', document.body);
      for (const item of ['File', 'Edit', 'View', 'Search', 'Bookings', 'Windows', 'Help']) util.el('span', '', menuBar, item);
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
      Object.assign(_c, { header, menuBar, winButtons, windowBar });
    },
    'frame.nav': (base, S) => function (_c) {
    },
    'frame.tools': (base) => function (_c) {
      base(_c);
      _c.menuBar.append(_c.headerTools);
    },
    'frame.end': (base) => function (_c) {
      const navigation = _c.header.querySelector('.ref-nav');
      if (navigation) document.body.append(navigation);
      return base(_c);
    },
  };

  env.site({
    name: 'design-use-travel-hotels-04',
    template: 'site/base',
    design: { THEMES, ACCENTS, parts },
  });
})();
