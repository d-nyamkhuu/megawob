// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { content, rng, util } = _c;
      const { TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      if (true) {
        rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, 'City Explorer');
        brand.dataset.role = 'brand';
      }
      if (true) {
        const n = util.el('nav', 'ref-nav', header);
        const navCount = rng.int(3, 5);
        rng.sample(content.NAV_ITEMS, navCount);
        for (const item of ['Map', 'Places', 'Routes', 'Areas', 'Reports']) {
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
    name: 'design-pan-map-pin-03',
    template: 'site/base',
    design: { parts },
  });
})();
