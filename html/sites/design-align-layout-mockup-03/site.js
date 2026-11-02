// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { content, ctx, display, label, local, nav, rng, util } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      header.style.background = 'linear-gradient(180deg, #07599f 0%, #064b89 54%, #073d70 100%)';
      const title = rng.pick(TITLES);
      const brand = util.el('div', 'ref-brand', header, 'Layout Studio');
      brand.dataset.role = 'brand';
      Object.assign(brand.style, { position: 'absolute', left: '84px', top: '9px', color: '#f4f8fc',
        font: 'bold 29px/39px Arial, Helvetica, sans-serif', textShadow: '0 1px 1px #17476f' });
      if (nav) local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
      const n = util.el('nav', 'ref-nav', header);
      for (const [i, item] of ['Layout', 'Elements', 'Styles', 'Preview'].entries()) {
        const a = util.el('a', `ref-navlink${i === 0 ? ' is-active' : ''}`, n, item);
        Object.assign(a.style, { color: i === 0 ? '#102950' : '#f4f8fc', font: 'bold 20px Arial, sans-serif' });
        a.dataset.role = 'nav';
        a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
      }
      Object.assign(_c, { brand, header, n, title });
    },
    'frame.body': (base, S) => function (_c) {
      const { content, local, rng, sidebar, util } = _c;
      const { K } = S;
      // Keep the original sampled navigation/sidebar draws stable across designs.
      const body = util.el('div', 'ref-body', document.body);
      body.style.background = 'linear-gradient(135deg, #d8e8f5 0%, #b9d2e8 100%)';
      if (sidebar) {
        const sidebarItems = local(rng.sample(content.NAV_ITEMS, rng.int(4, 7)), K.nav);
        const side = util.el('aside', 'ref-side', body);
        for (const item of sidebarItems) {
          const a = util.el('a', 'ref-sidelink', side, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label: item }); });
        }
      }
      Object.assign(_c, { body });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const rail = util.el('aside', 'layout-rail', body);
      const layers = util.el('section', 'layout-rail-box', rail);
      util.el('div', 'layout-rail-title', layers, 'Layers');
      for (const [i, label] of ['A', 'B', 'C'].entries()) {
        const row = util.el('div', 'layout-layer-row', layers);
        util.el('span', `layout-swatch layout-swatch-${i}`, row);
        util.el('span', '', row, label);
        util.el('span', 'layout-eye', row, '◉');
      }
      const info = util.el('section', 'layout-rail-box layout-info', rail);
      util.el('div', 'layout-rail-title', info, 'Canvas Info');
      for (const [label, value] of [['Width:', '600'], ['Height:', '400'], ['Objects:', '3']]) {
        const row = util.el('div', 'layout-info-row', info);
        util.el('span', '', row, label);
        util.el('span', '', row, value);
      }
      Object.assign(_c, { info, layers, rail, stage });
    },
    'frame.nav': (base, S) => function (_c) {
    },
    'frame.instruction': (base, S) => function (_c) {
      base(_c);
    },
    'frame.controls': (base, S) => function (_c) {
      base(_c);
    },
  };

  env.site({
    name: 'design-align-layout-mockup-03',
    template: 'site/base',
    design: { parts },
  });
})();
