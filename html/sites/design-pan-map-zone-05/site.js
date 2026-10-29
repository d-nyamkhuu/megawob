// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { display, lr, nav, rng, util, word } = _c;
      const { K, TITLES } = S;
      document.body.dataset.instructionMode = display;
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
      for (const [icon, label] of [['M2 4l6-2 8 3 6-2v17l-6 2-8-3-6 2V4zm6-1v16m8-14v16', 'Map'], ['M9 5h13M9 12h13M9 19h13M2 5h2M2 12h2M2 19h2', 'Addresses'], ['M2 5h12v13H2V5zm12 5h5l4 5v3h-9v-8zM6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm13 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6z', 'Deliveries'], ['M10 1h4l1 4 3 1 3-2 3 4-3 3v3l3 2-2 4-4-1-3 2-1 3h-4l-1-4-3-1-3 2-3-4 3-3v-3L0 9l2-4 4 1 3-2 1-3zm2 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8', 'Settings']]) {
        const a = util.el('a', `orbit-rail-link${label === 'Map' ? ' active' : ''}`, rail);
        const iconBox=util.el('span', 'orbit-rail-icon', a);
        iconBox.innerHTML=`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${icon}" fill="${label==='Addresses'?'none':'currentColor'}" stroke="currentColor" stroke-width="${label==='Addresses'?2.7:0.5}" stroke-linejoin="round"/></svg>`;
        util.el('span', '', a, label);
        a.href = '#';
        a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label }); });
      }
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, rail });
    },
  };

  env.site({
    name: 'design-pan-map-zone-05',
    template: 'site/base',
    design: { parts },
  });
})();
