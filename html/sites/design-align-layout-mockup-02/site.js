// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { content, display, label, local, lr, nav, rng, util, word } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      // Fixed editorial rail frame; static and consumes no episode randomness.
      util.el('div', 'ref-rail-brand', header, 'LAYOUT\nSTUDIO');
      const rail = util.el('nav', 'ref-rail-nav', header);
      const railItems = [
        ['Canvas', '<rect x="3" y="3" width="22" height="22"/><path d="M9 9h10v10H9zM13 7v3"/>'],
        ['Templates', '<rect x="3" y="3" width="22" height="22"/><path d="M14 3v22M3 14h22"/>'],
        ['Assets', '<rect x="3" y="4" width="22" height="20"/><circle cx="10" cy="10" r="2"/><path d="m5 21 7-7 4 4 3-3 5 6"/>'],
        ['Text', '<path d="M4 5h20M14 5v19M9 24h10"/>'],
        ['Shapes', '<rect x="4" y="4" width="20" height="20"/>'],
        ['Colors', '<path d="M14 3C11 8 5 13 5 18a9 9 0 0 0 18 0c0-5-6-10-9-15z"/>'],
      ];
      railItems.forEach(([label, path], i) => {
        const link = util.el('a', `ref-rail-item${i === 0 ? ' active' : ''}`, rail);
        link.href = '#';
        link.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label }); });
        const icon = util.el('span', 'ref-rail-icon', link);
        icon.innerHTML = `<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="square" stroke-linejoin="miter">${path}</svg>`;
        util.el('span', '', link, label);
      });
      const railFooter = util.el('div', 'ref-rail-footer', header);
      for (const [label, path] of [
        ['Settings', '<path d="M14 3v3m0 16v3M3 14h3m16 0h3M6.2 6.2l2.1 2.1m11.4 11.4 2.1 2.1m0-15.6-2.1 2.1M8.3 19.7l-2.1 2.1"/><circle cx="14" cy="14" r="7"/><circle cx="14" cy="14" r="2"/>'],
        ['Help', '<circle cx="14" cy="14" r="11"/><path d="M10.8 10a3.3 3.3 0 1 1 5.6 2.4c-1.5 1.2-2.4 1.7-2.4 3.6M14 20v.2"/>'],
      ]) {
        const link = util.el('a', 'ref-rail-footer-item', railFooter);
        link.href = '#';
        link.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label }); });
        const icon = util.el('span', 'ref-rail-icon', link);
        icon.innerHTML = `<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;
        util.el('span', '', link, label);
      }
      if (display !== 'header' || nav) {
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, word ? word(lr.pick(K.brand)) : 'Studio');
        brand.dataset.role = 'brand';
      }
      if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        const sampledNav = local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
        const editorialNav = ['Assets', 'Templates', 'Brand', 'Projects'];
        for (let i = 0; i < sampledNav.length; i++) {
          const item = word ? sampledNav[i] : editorialNav[i % editorialNav.length];
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      Object.assign(_c, { header, rail, railFooter, railItems });
    },
    'frame.tools': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, header, label, placement, util, wantFooter } = _c;
      let submit = null;
      const headerTools = util.el('div', 'ref-tools', header);
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }

      // Editorial document metadata band, matching the reference tool's title strip.
      const record = util.el('section', 'ref-record', document.body);
      util.el('div', 'ref-record-thumb', record, '❧');
      const identity = util.el('div', 'ref-record-identity', record);
      util.el('div', 'ref-record-title', identity, 'Autumn Collection');
      util.el('div', 'ref-record-subtitle', identity, 'Social Media Graphic　 ·　 1080 × 1080 px');
      const details = util.el('div', 'ref-record-details', record);
      for (const [title, value] of [['Format', 'Square (1:1)'], ['Size', '1080 × 1080 px'], ['Color profile', 'sRGB'], ['Background', '■　#F8F5ED']]) {
        const item = util.el('div', 'ref-record-item', details);
        util.el('span', '', item, title);
        util.el('strong', '', item, value);
      }
      Object.assign(_c, { details, headerTools, identity, record, submit });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-align-layout-mockup-02',
    template: 'site/base',
    design: { parts },
  });
})();
