// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { content, local, nav, rng, util } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      if (true) {
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, 'Riverton Public Library');
        brand.dataset.role = 'brand';
      }
      {
        const n = util.el('nav', 'ref-nav', header);
        const libraryNav = ['Catalog', 'My Account', 'Research', 'Events', 'Help', 'About'];
        const sampledNav = nav ? local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav) : libraryNav;
        for (let i = 0; i < sampledNav.length; i++) {
          const item = libraryNav[i];
          const a = util.el('a', 'ref-navlink', n, item);
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
    name: 'design-scroll-page-carousel-01',
    template: 'site/base',
    design: { parts },
  });
})();
