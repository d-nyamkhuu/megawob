// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { content, display, local, lr, nav, rng, util, word } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
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
      } else {
        const n = util.el('nav', 'ref-nav', header);
        for (const item of ['Assets', 'Templates', 'Brand', 'Projects']) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      Object.assign(_c, { header });
    },
    'frame.tools': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, header, label, placement, util, wantFooter } = _c;
      let submit = null;
      const headerTools = util.el('div', 'ref-tools', header);
      const search = util.el('button', 'ref-utility ref-search', headerTools, '⌕');
      search.type = 'button';
      search.title = 'Search';
      search.setAttribute('aria-label', 'Search');
      search.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/></svg>';
      const alerts = util.el('button', 'ref-utility ref-bell', headerTools);
      alerts.type = 'button';
      alerts.title = 'Notifications';
      alerts.setAttribute('aria-label', 'Notifications');
      alerts.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></svg>';
      util.el('span', 'ref-avatar', headerTools, 'ES');
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
        if (title === 'Background') {
          const color = util.el('strong', '', item);
          util.el('i', 'ref-record-swatch', color);
          util.el('span', '', color, '#F8F5ED');
        } else util.el('strong', '', item, value);
      }
      Object.assign(_c, { alerts, details, headerTools, identity, record, search, submit });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const inspector = util.el('aside', 'ref-inspector', body);
      const tabs = util.el('div', 'inspector-tabs', inspector);
      util.el('button', 'inspector-tab active', tabs, 'Properties');
      util.el('button', 'inspector-tab', tabs, 'Layers');
      const selected = util.el('section', 'inspector-section inspector-selected', inspector);
      const selectedHead = util.el('div', 'inspector-section-head', selected);
      util.el('strong', '', selectedHead, 'Selected');
      util.el('span', '', selectedHead, '3 objects');
      for (const [name, type, kind] of [['Image A', 'Image', 'leaf'], ['Image B', 'Image', 'flower'], ['Image C', 'Image', 'single-leaf']]) {
        const row = util.el('div', 'inspector-layer', selected);
        util.el('span', `layer-thumb ${kind}`, row);
        const text = util.el('span', 'layer-name', row);
        util.el('strong', '', text, name); util.el('small', '', text, type);
        const eye = util.el('button', 'layer-eye', row); eye.type = 'button'; eye.title = 'Toggle visibility';
        eye.setAttribute('aria-label', 'Toggle visibility');
        eye.innerHTML = '<svg viewBox="0 0 20 14" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M1 7s3.2-5.2 9-5.2S19 7 19 7s-3.2 5.2-9 5.2S1 7 1 7Z"/><circle cx="10" cy="7" r="2.3" fill="currentColor"/></svg>';
      }
      const appearance = util.el('section', 'inspector-section inspector-appearance', inspector);
      util.el('div', 'appearance-title', appearance, 'Appearance');
      const opacity = util.el('label', 'appearance-control', appearance);
      util.el('span', '', opacity, 'Opacity');
      const range = util.el('input', 'opacity-range', opacity);
      range.type = 'range';
      range.min = '0';
      range.max = '100';
      range.value = '100';
      util.el('output', 'opacity-value', opacity, '100%');
      range.addEventListener('input', () => { opacity.querySelector('output').textContent = `${range.value}%`; });
      for (const [label, value, thumb] of [['Fill', 'Image (preserve size)', 'leaf'], ['Stroke', 'None', 'none']]) {
        const control = util.el('div', 'appearance-control', appearance);
        util.el('span', '', control, label);
        const field = util.el('button', 'appearance-select', control);
        field.type = 'button';
        if (thumb !== 'none') util.el('i', `layer-thumb ${thumb}`, field);
        util.el('span', '', field, value); util.el('b', '', field, '⌄');
      }
      Object.assign(_c, { appearance, inspector, opacity, range, selected, selectedHead, stage, tabs });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-align-layout-mockup-01',
    template: 'site/base',
    design: { parts },
  });
})();
