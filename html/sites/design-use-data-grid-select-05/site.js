// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.theme': (base, S) => function (_c) {
      const { ctx } = _c;
      const { ACCENTS, LOW_ACCENTS, LOW_THEME, THEMES } = S;
      const { rng, util, content } = ctx;
      let name = rng.pick(Object.keys(THEMES));
      const root = document.documentElement;
      let accent = rng.pick(ACCENTS);
      const tr = rng.fork('chrome/theme');
      if (tr.bool(0.08)) {
        name = 'low';
        accent = tr.pick(LOW_ACCENTS);
      }
      for (const [k, v] of Object.entries(name === 'low' ? LOW_THEME : THEMES[name])) root.style.setProperty(`--${k}`, v);
      root.style.setProperty('--accent', accent);
      root.dataset.theme = name;
      // This design has one stable GNOME Human palette; keep the original draws above
      // so the page's seeded frame choices do not shift any later values.
      for (const [k, v] of Object.entries({ bg: '#efede6', panel: '#fbfaf7', fg: '#171b25', muted: '#655d55', line: '#bdb7ad' })) root.style.setProperty(`--${k}`, v);
      root.style.setProperty('--accent', '#fa8124');
      Object.assign(_c, { accent, content, name, rng, root, tr, util });
    },
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, tall, util, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      if (roomy) rng.bool(0.35);
      const sidebar = false;
      const showNav = W >= 1180 && rng.bool(0.5);
      const nav = true;
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      const titlebar = util.el('div', 'human-titlebar', document.body);
      util.el('span', 'human-app-icon', titlebar, '▣');
      util.el('strong', 'human-app-title', titlebar, 'Acme Trading Co. - Order Management');
      const winControls = util.el('div', 'human-window-controls', titlebar);
      util.el('span', 'human-winbtn', winControls, '−');
      util.el('span', 'human-winbtn', winControls, '□');
      util.el('span', 'human-winbtn human-close', winControls, '×');
      const menubar = util.el('nav', 'human-menubar', document.body);
      for (const label of ['File', 'Edit', 'View', 'Orders', 'Tools', 'Help']) util.el('span', 'human-menuitem', menubar, label);
      Object.assign(_c, { collide, cr, decoys, label, menubar, nav, placement, showNav, sidebar, titlebar, wantFooter, winControls });
    },
    'frame.nav': (base, S) => function (_c) {
      const { content, header, nav, rng, showNav, util } = _c;
      if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        if (showNav) rng.sample(content.NAV_ITEMS, rng.int(3, 5));
        for (const item of ['⌂|Home', '▤|Orders', '☻|Customers', '▣|Inventory', '▥|Reports', '⚙|Settings']) {
          const [ico, txt] = item.split('|');
          const a = util.el('a', 'ref-navlink', n);
          util.el('span', 'ref-navico', a, ico);
          util.el('span', '', a, txt);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
    },
    'frame.instruction': (base, S) => function (_c) {
      const { ctx, display, header, util } = _c;
      if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
      else util.el('div', 'ref-spacer', header);
      const productTools = util.el('div', 'human-product-tools', document.body);
      const productAction = (icon, label) => {
        const b = util.el('button', 'human-product-action', productTools);
        const glyphs = {
          plus: '<path d="M14 3v22M3 14h22"/><path d="M14 3v22M3 14h22"/>',
          edit: '<path d="M5 4h12l5 5v6M17 22H5V4"/><path d="m13 20 2.5-6L23 6.5a2.1 2.1 0 0 1 3 3L18.5 17z"/>',
          delete: '<circle cx="14" cy="14" r="11"/><path d="M8 14h12"/>',
          folder: '<path d="M2 7V4h9l3 4h12v16H2z"/>',
          tag: '<path d="M3 13 13 3h11v11L14 24z"/><circle cx="19" cy="8" r="1.5"/>',
          print: '<path d="M7 8V3h14v5M7 18H4V9h20v9h-3M7 14h14v9H7z"/><path d="M20 11h1"/>',
        };
        const iconNode = util.el('span', 'human-action-icon', b);
        iconNode.innerHTML = `<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${glyphs[icon]}</svg>`;
        util.el('span', '', b, label);
        b.type = 'button';
      };
      util.el('div', 'qt-pagetitle', document.body, 'Orders');
      document.body.insertBefore(document.body.lastChild, productTools);
      productAction('plus', 'New Order');
      productAction('edit', 'Edit');
      productAction('delete', 'Delete');
      productAction('folder', 'Send');
      productAction('print', 'Print');
      productAction('tag', 'Export　▾');
      const filterbar = util.el('div', 'human-filterbar', document.body);
      const sg = util.el('label', 'human-filter', filterbar);
      util.el('span', '', sg, 'Search:');
      util.el('span', 'human-filter-select qt-search', sg, '');
      for (const [label, value] of [['Status:', 'All'], ['Customer:', 'All'], ['Date Range:', 'All Dates']]) {
        const group = util.el('label', 'human-filter', filterbar);
        util.el('span', '', group, label);
        const select = util.el('span', 'human-filter-select', group, value);
      }
      const side = util.el('aside', 'qt-side', document.body);
      const box1 = util.el('div', 'qt-box', side);
      const ico = (h, svg, t) => { const e = util.el('h3', '', h, ''); e.innerHTML = `<svg class="qt-hi" viewBox="0 0 28 28" width="28" height="28" aria-hidden="true">${svg}</svg>`; e.append(t); return e; };
      ico(box1, '<rect x="3" y="15" width="5" height="10" fill="#4a86c8"/><rect x="10" y="9" width="5" height="16" fill="#2f6bb5"/><rect x="17" y="3" width="5" height="22" fill="#4a86c8"/>', ' Order Summary');
      for (const [a, b] of [['Total Orders:', '7'], ['Pending:', '2'], ['Processing:', '2'], ['Shipped:', '3']]) {
        const r = util.el('div', 'qt-kv', box1); util.el('span', '', r, a); util.el('span', '', r, b);
      }
      const tv = util.el('div', 'qt-kv qt-sep', box1); util.el('span', '', tv, 'Total Value:'); util.el('span', '', tv, '$10,798.50');
      const box2 = util.el('div', 'qt-box', side);
      ico(box2, '<circle cx="10" cy="9" r="5" fill="#3b78bf"/><path d="M1 25c0-7 5-9 9-9s9 2 9 9z" fill="#3b78bf"/><circle cx="20" cy="10" r="4" fill="#6a9bd4"/><path d="M15 25c0-5 3-7 6-7s6 2 6 7z" fill="#6a9bd4"/>', ' Customer Details');
      for (const a of ['Name:', 'Contact:', 'Phone:', 'Email:']) {
        const r = util.el('div', 'qt-kv qt-dash', box2); util.el('span', '', r, a); util.el('span', '', r, '—');
      }
      for (const a of ['Total Orders:', 'Total Value:']) {
        const r = util.el('div', 'qt-kv qt-dash', box2); util.el('span', '', r, a); util.el('span', '', r, '—');
      }
      Object.assign(_c, { filterbar, productAction, productTools });
    },
  };

  env.site({
    name: 'design-use-data-grid-select-05',
    template: 'site/base',
    design: { parts },
  });
})();
