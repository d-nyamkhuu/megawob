// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { rng, util } = _c;
      const { TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      const title = rng.pick(TITLES);
      const brand = util.el('div', 'ref-brand', header, 'TownView');
      brand.dataset.tagline = 'Community News & Information';
      brand.dataset.role = 'brand';
      Object.assign(_c, { brand, header, title });
    },
  };

  env.site({
    name: 'design-use-site-builder-seo-01',
    template: 'site/base',
    design: { parts },
  });
})();
