// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';


  const TITLES = ['Sunrise Office Suite'];

  const SUITE_TABS = ['Documents', 'Spreadsheets', 'Presentations', 'Mail', 'Contacts', 'Calendar'];

  const DECKS = ['Quarterly Review', 'Product Plan', 'Marketing Strategy', 'Team Update', 'Customer Feedback',
    'Sales Forecast', 'Website Redesign', 'Operations Plan', 'Board Meeting', 'Project Atlas'];

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { content, display, local, lr, nav, rng, util, word } = _c;
      const { K } = S;
      const header = util.el('header', 'ref-task', document.body);
      const title = (display !== 'header' || nav) ? rng.pick(TITLES) : TITLES[0];
      const brand = util.el('div', 'ref-brand', header, word ? word(lr.pick(K.brand)) : title);
      brand.dataset.role = 'brand';
      const utilityLinks = util.el('nav', 'ref-utility-links', header);
      for (const item of ['Ideas', 'People', 'Results']) {
        const link = util.el('a', '', utilityLinks, item);
        link.href = '#';
        link.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'utility', label: item }); });
      }
      if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        const navItems = local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
        for (const [i, item] of SUITE_TABS.entries()) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: navItems[i] || item }); });
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
      Object.assign(_c, { brand, header, title, utilityLinks });
    },
    'frame.body': (base, S) => function (_c) {
      const { content, local, rng, sidebar, util } = _c;
      const { K } = S;
      const body = util.el('div', 'ref-body', document.body);
      if (sidebar) {
        const side = util.el('aside', 'ref-side', body);
        const sideItems = local(rng.sample(content.NAV_ITEMS, rng.int(4, 7)), K.nav);
        for (const [i, item] of DECKS.entries()) {
          const a = util.el('a', 'ref-sidelink', side, item);
          a.dataset.role = 'nav';
          if (i === 1) a.classList.add('ref-selected');
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label: sideItems[i] || item }); });
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
    name: 'design-use-slides-restyle-01',
    template: 'site/base',
    design: { TITLES, parts },
  });
})();
