// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { display, lr, nav, rng, util, word } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      if (display !== 'header' || nav) {
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, word ? word(lr.pick(K.brand)) : 'OrbitMap');
        brand.dataset.role = 'brand';
      }
      Object.assign(_c, { header });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const rail = util.el('nav', 'orbit-rail', body);
      for (const [icon, label] of [['◫', 'Map'], ['♧', 'Deliveries'], ['♙', 'Customers'],
        ['♧', 'Places'], ['⬡', 'Zones'], ['▥', 'Reports'], ['⚙', 'Settings']]) {
        const a = util.el('a', `orbit-rail-link${label === 'Map' ? ' active' : ''}`, rail);
        util.el('span', 'orbit-rail-icon', a, icon);
        util.el('span', '', a, label);
        a.href = '#';
        a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label }); });
      }
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, rail });
    },
  };

  env.site({
    name: 'design-pan-map-zone-01',
    template: 'site/base',
    design: { parts },
  });
})();
