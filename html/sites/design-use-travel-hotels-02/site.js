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
    'frame.theme': (base, S) => function (_c) {
      const { ctx } = _c;
      const { LOW_ACCENTS, LOW_THEME } = S;
      const { rng, util, content } = ctx;
      rng.pick(Object.keys(THEMES));
      let name = 'warm';
      const root = document.documentElement;
      rng.pick(ACCENTS);
      let accent = '#ff790d';
      const tr = rng.fork('chrome/theme');
      if (tr.bool(0.08)) {
        tr.pick(LOW_ACCENTS);
      }
      for (const [k, v] of Object.entries(name === 'low' ? LOW_THEME : THEMES[name])) root.style.setProperty(`--${k}`, v);
      root.style.setProperty('--accent', accent);
      root.dataset.theme = name;
      Object.assign(_c, { accent, content, name, rng, root, tr, util });
    },
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, tall, util, word } = _c;
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
      const windowBar = util.el('div', 'travel-windowbar', document.body);
      util.el('span', 'travel-mark', windowBar, '✈');
      util.el('span', 'travel-window-name', windowBar, 'TravelHub');
      const windowControls = util.el('div', 'travel-window-controls', windowBar);
      util.el('span', '', windowControls, '−');
      util.el('span', '', windowControls, '□');
      util.el('span', '', windowControls, '×');
      Object.assign(_c, { collide, cr, decoys, label, nav, navDraw, placement, sidebar, wantFooter, windowBar, windowControls });
    },
    'frame.header': (base, S) => function (_c) {
      const { content, display, local, nav, navDraw, rng, util } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      if (display !== 'header' || nav) {
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, 'TravelHub');
        brand.dataset.role = 'brand';
      }
      if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        // Consume the original seeded navigation draws to keep all later frame stable.
        const oldItems = navDraw ? local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav) : null;
        for (const item of ['Flights', 'Hotels', 'Cars', 'My Trips']) {
          const a = util.el('a', 'ref-navlink', n, item);
          if (item === 'Hotels') a.classList.add('ref-nav-active');
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      Object.assign(_c, { header });
    },
    'frame.tools': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, header, label, placement, util, wantFooter } = _c;
      let submit = null;
      const headerTools = util.el('div', 'ref-tools', header);
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      const hero = util.el('section', 'travel-hero', document.body);
      util.el('div', 'travel-hero-photo travel-hero-left', hero);
      const trip = util.el('div', 'travel-hero-copy', hero);
      util.el('h1', '', trip, 'Brno, Czech Republic');
      util.el('div', 'travel-trip-meta', trip, '▦　Jun 14, 2018 – Jun 17, 2018　 │　 3 nights　 │　♟　2 guests');
      util.el('div', 'travel-hero-photo travel-hero-right', hero);
      Object.assign(_c, { headerTools, hero, submit, trip });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const destination = util.el('aside', 'travel-destination-inspector', body);
      const map = util.el('div', 'travel-map', destination);
      for (let i = 0; i < 5; i++) {
        const pin = util.el('span', `travel-map-pin travel-map-pin-${i + 1}`, map, '');
        pin.setAttribute('aria-hidden', 'true');
      }
      util.el('div', 'travel-map-city', map, 'Brno');
      const detail = util.el('div', 'travel-destination-copy', destination);
      util.el('h2', '', detail, 'Brno, Czech Republic');
      util.el('p', '', detail, 'A vibrant university city known for its modern architecture, historic sites and lively food scene.');
      const facts = util.el('div', 'travel-destination-facts', detail);
      for (const [icon, key, value] of [['◆', 'Language', 'Czech'], ['◉', 'Currency', 'Czech koruna (CZK)'], ['☼', 'Time zone', 'CEST (UTC+2)']]) {
        const row = util.el('div', 'travel-destination-fact', facts);
        util.el('span', 'travel-fact-icon', row, icon);
        util.el('span', '', row, key);
        util.el('span', '', row, value);
      }
      Object.assign(_c, { destination, detail, facts, map, stage });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-use-travel-hotels-02',
    template: 'site/base',
    design: { THEMES, ACCENTS, parts },
  });
})();
