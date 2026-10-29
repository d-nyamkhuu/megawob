// Design on templates/site/base.js (the base site.js): early Material layout studio.
(function () {
  'use strict';

  const ICONS = [
    '<path d="M6 3l12 9-5.5 1 3 6-2.5 1-3-6L6 18z" fill="currentColor"/>',
    '<rect x="4" y="5" width="16" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="3 2"/>',
    '|',
    '<rect x="4" y="5" width="16" height="14" fill="none" stroke="currentColor" stroke-width="2"/>',
    '<circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="2"/>',
    '<path d="M5 19L19 5" stroke="currentColor" stroke-width="2"/>',
    '<path d="M5 5h14M12 5v14" stroke="currentColor" stroke-width="2.4"/>',
    '|',
    '<path d="M5 4v16M8 6h11v4H8zM8 13h7v4H8z" fill="currentColor" stroke="currentColor" stroke-width="1.5"/>',
    '<path d="M12 4v16M6 6h12v4H6zM8 13h8v4H8z" fill="currentColor" stroke="currentColor" stroke-width="1.5"/>',
    '<path d="M19 4v16M5 6h11v4H5zM9 13h7v4H9z" fill="currentColor" stroke="currentColor" stroke-width="1.5"/>',
    '<path d="M4 5h16M6 8h4v11H6zM13 8h4v7h-4z" fill="currentColor" stroke="currentColor" stroke-width="1.5"/>',
    '<path d="M4 12h16M6 6h4v12H6zM13 8h4v8h-4z" fill="currentColor" stroke="currentColor" stroke-width="1.5"/>',
    '<path d="M4 19h16M6 5h4v11H6zM13 9h4v7h-4z" fill="currentColor" stroke="currentColor" stroke-width="1.5"/>',
    '|',
    '<circle cx="10" cy="10" r="6" fill="none" stroke="currentColor" stroke-width="2"/><path d="M14.5 14.5L20 20M7 10h6" stroke="currentColor" stroke-width="2"/>',
    '<circle cx="10" cy="10" r="6" fill="none" stroke="currentColor" stroke-width="2"/><path d="M14.5 14.5L20 20M7 10h6M10 7v6" stroke="currentColor" stroke-width="2"/>',
  ];
  const LAYOUTS = [
    ['Marketing Banner', 3, ['#3d97ee', '#5aab62', '#ec6254']],
    ['Product Card', 3, ['#3d97ee', '#c9ccd1', '#5aab62']],
    ['Signup Panel', 3, ['#3d97ee', '#c9ccd1', '#ec6254']],
    ['Feature Grid', 4, ['#3d97ee', '#f0b429', '#9aa0a8']],
    ['Pricing Section', 3, ['#7f9aa8', '#c9ccd1', '#ec6254']],
    ['Contact Panel', 3, ['#c9ccd1', '#1f6fdc', '#f0b429']],
  ];

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { content, display, local, lr, nav, rng, util, word } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      const menu = ['File', 'Edit', 'View', 'Insert', 'Arrange', 'Tools', 'Help'];
      if (display !== 'header' || nav) {
        const title = rng.pick(TITLES);
        if (word) lr.pick(K.brand);
      }
      const brand = util.el('div', 'ref-brand', header, 'Layout Studio');
      brand.dataset.role = 'brand';
      const wc = util.el('div', 'ref-winctl', header);
      wc.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M5 18h10"/></svg><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><rect x="5" y="5" width="12" height="12"/></svg><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M5 5l12 12M17 5L5 17"/></svg>';
      const n = util.el('nav', 'ref-nav', header);
      if (nav) local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
      for (const item of menu) {
        const a = util.el('a', 'ref-navlink', n, item);
        a.dataset.role = 'nav';
        a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
      }
      Object.assign(_c, { header });
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

      // Icon toolbar (decorative).
      const record = util.el('section', 'ref-record', document.body);
      ICONS.forEach((p, i) => {
        if (p === '|') { util.el('i', 'ref-tsep', record); return; }
        const b = util.el('span', 'ref-tbtn' + (i === 0 ? ' on' : ''), record);
        b.innerHTML = `<svg viewBox="0 0 24 24">${p}</svg>`;
      });
      const zoom = util.el('span', 'ref-zoom', record, '100%');
      util.el('i', 'ref-caret', zoom);
      const search = headerTools, alerts = headerTools, identity = record, details = record;
      Object.assign(_c, { alerts, details, headerTools, identity, record, search, submit });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const inspector = util.el('aside', 'ref-inspector', body);
      util.el('div', 'ref-lhead', inspector, 'Layouts');
      const list = util.el('div', 'ref-llist', inspector);
      LAYOUTS.forEach(([name, n, cols], i) => {
        const row = util.el('div', 'ref-lrow' + (i === 0 ? ' on' : ''), list);
        const th = util.el('span', 'ref-lthumb', row);
        cols.forEach((c, k) => { const s = util.el('i', '', th); s.style.background = c; s.style.gridArea = ['a', 'b', 'c'][k]; });
        const t = util.el('span', 'ref-ltext', row);
        util.el('strong', '', t, name);
        util.el('small', '', t, `${n} items`);
      });
      const tabs = inspector, selected = inspector, selectedHead = inspector, appearance = inspector, opacity = inspector, range = inspector;
      Object.assign(_c, { appearance, inspector, opacity, range, selected, selectedHead, stage, tabs });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-align-layout-mockup-05',
    template: 'site/base',
    design: { parts },
  });
})();
