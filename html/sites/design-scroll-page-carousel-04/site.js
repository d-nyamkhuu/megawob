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
        const brand = util.el('div', 'ref-brand', header, '10 Ways to Stay Active on Vacation');
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
    'frame.footer': (base, S) => function (_c) {
      base(_c);
      if (_c.wantFooter) {
        const foot = document.body.querySelector('.ref-foot');
        foot.dataset.hasSubmit = String(_c.placement === 'footer' || _c.placement === 'link');
        foot.querySelector('.ref-foot-text').textContent = 'Ready';
      }
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-scroll-page-carousel-04',
    template: 'site/base',
    design: { parts },
  });
})();
