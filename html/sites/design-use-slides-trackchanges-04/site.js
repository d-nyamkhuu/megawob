// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';


  const TITLES = ['Aurora Office'];

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { content, display, label, local, nav, rng, util } = _c;
      const { K } = S;
      const header = util.el('header', 'ref-task', document.body);
      if (display !== 'header' || nav) {
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, '✦  Aurora Office');
        brand.dataset.role = 'brand';
      }
      if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        const navItems = local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
        const labels = ['Home', 'Documents', 'Presentations', 'Spreadsheets', 'Contacts', 'Calendar'];
        for (const [i, item] of navItems.entries()) {
          const label = labels[i] || item;
          const a = util.el('a', 'ref-navlink', n, label);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label }); });
        }
      }
      Object.assign(_c, { header });
    },
    'frame.tools': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, header, label, placement, util, wantFooter } = _c;
      let submit = null;
      const headerTools = util.el('div', 'ref-tools', header);
      const search = util.el('div', 'ref-search', headerTools);
      util.el('span', 'ref-search-icon', search, '⌕');
      util.el('span', 'ref-search-label', search, 'Search documents');
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      Object.assign(_c, { headerTools, search, submit });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-use-slides-trackchanges-04',
    template: 'site/base',
    design: { TITLES, parts },
  });
})();
