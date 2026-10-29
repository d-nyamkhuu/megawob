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
      util.el('strong', 'human-app-title', titlebar, 'Inventory Manager');
      const winControls = util.el('div', 'human-window-controls', titlebar);
      util.el('span', 'human-winbtn', winControls, '−');
      util.el('span', 'human-winbtn', winControls, '□');
      util.el('span', 'human-winbtn human-close', winControls, '×');
      const menubar = util.el('nav', 'human-menubar', document.body);
      for (const label of ['File', 'Edit', 'View', 'Records', 'Tools', 'Window', 'Help']) util.el('span', 'human-menuitem', menubar, label);
      Object.assign(_c, { collide, cr, decoys, label, menubar, nav, placement, showNav, sidebar, titlebar, wantFooter, winControls });
    },
    'frame.nav': (base, S) => function (_c) {
      const { content, header, nav, rng, showNav, util } = _c;
      if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        if (showNav) rng.sample(content.NAV_ITEMS, rng.int(3, 5));
        for (const item of ['Products', 'Orders', 'Suppliers', 'Customers', 'Employees', 'Reports']) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
    },
  };

  env.site({
    name: 'design-use-data-grid-select-04',
    template: 'site/base',
    design: { parts },
  });
})();
