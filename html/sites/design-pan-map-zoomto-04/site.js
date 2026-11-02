// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.placement': (base, S) => function (_c) {
      base(_c);
      if (_c.W >= 1180) _c.nav = true;
      else if (_c.W >= 760) _c.nav = _c.rng.bool(0.5);
    },
    'frame.footer': (base, S) => function (_c) {
      base(_c);
      const status = document.querySelector('.ref-foot-text');
      if (status) status.textContent = 'Rivermere City Atlas · Ready';
    },
    'frame.nav': (base, S) => function (_c) {
      const { content, header, nav, rng, util } = _c;
      if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        rng.sample(content.NAV_ITEMS, rng.int(3, 5));
        for (const item of ['Map', 'Places', 'Routes', 'Areas', 'Reports']) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
    },
  };

  env.site({
    name: 'design-pan-map-zoomto-04',
    template: 'site/base',
    design: { parts },
  });
})();
