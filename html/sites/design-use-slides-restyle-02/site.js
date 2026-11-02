// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';


  const TITLES = ['Riverton Public Library — Catalog'];

  const SUITE_TABS = ['File', 'Edit', 'View', 'Search', 'Catalog', 'Circulation', 'Tools', 'Window', 'Help'];

  const DECKS = ['All Items', 'Books', 'Periodicals', 'Audiovisual', 'Maps', 'Manuscripts',
    'Special Collections', 'Patrons', 'Circulation', 'Reports'];

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
      // Keep the embedded editor in the library's parchment palette across seeded theme draws.
      root.dataset.theme = 'warm';
      Object.assign(_c, { accent, content, name, rng, root, tr, util });
    },
    'frame.header': (base, S) => function (_c) {
      const { content, display, local, lr, nav, rng, util, word } = _c;
      const { K } = S;
      const header = util.el('header', 'ref-task', document.body);
      const title = (display !== 'header' || nav) ? rng.pick(TITLES) : TITLES[0];
      const brand = util.el('div', 'ref-brand', header, word ? word(lr.pick(K.brand)) : title);
      brand.dataset.role = 'brand';
      if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        const navItems = local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
        for (const [i, item] of SUITE_TABS.entries()) {
          const a = util.el('a', 'ref-navlink', n, item || navItems[i % navItems.length]);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      if (!nav) {
        const n = util.el('nav', 'ref-nav', header);
        SUITE_TABS.forEach((item) => {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        });
      }
      Object.assign(_c, { brand, header, title });
    },
    'frame.body': (base, S) => function (_c) {
      const { content, local, rng, sidebar, util } = _c;
      const { K } = S;
      const body = util.el('div', 'ref-body', document.body);
      if (sidebar) {
        const side = util.el('aside', 'ref-side', body);
        const sideItems = local(rng.sample(content.NAV_ITEMS, rng.int(4, 7)), K.nav);
        for (const [i, item] of sideItems.entries()) {
          const a = util.el('a', 'ref-sidelink', side, DECKS[i] || item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label: item }); });
        }
      }
      if (!sidebar) {
        const side = util.el('aside', 'ref-side', body);
        DECKS.forEach((item, i) => {
          const a = util.el('a', 'ref-sidelink', side, item);
          a.dataset.role = 'nav';
          if (i === 1) a.classList.add('ref-selected');
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label: item }); });
        });
      }
      Object.assign(_c, { body });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-use-slides-restyle-02',
    template: 'site/base',
    design: { TITLES, parts },
  });
})();
