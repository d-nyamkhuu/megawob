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
      for (const [k, v] of Object.entries({ bg: '#f3f6fa', panel: '#ffffff', fg: '#17243b', muted: '#65738a', line: '#dce4ee' })) root.style.setProperty(`--${k}`, v);
      root.style.setProperty('--accent', '#1682e8');
      Object.assign(_c, { accent, content, name, rng, root, tr, util });
    },
    'frame.layout': (base, S) => function (_c) {
      const { ctx } = _c;
      const W = window.innerWidth;
      const H = window.innerHeight;
      const roomy = W >= 1260;
      const tall = H >= 700;
      let display = ctx.display || 'header';
      if (display === 'panel' && !roomy) display = 'header';
      if (display === 'toast' && !tall) display = 'header';
      // reset() reuses the body: a previous toast must not shrink later episodes.
      document.body.classList.toggle('ref-has-note', display === 'toast');
      document.body.dataset.instructionDisplay = display;
      Object.assign(_c, { H, W, display, roomy, tall });
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
      const appIcon = util.el('span', 'human-app-icon', titlebar);
      util.el('span', 'fluent-cart-basket', appIcon);
      util.el('span', 'fluent-cart-handle', appIcon);
      util.el('span', 'fluent-cart-wheel fluent-cart-wheel-a', appIcon);
      util.el('span', 'fluent-cart-wheel fluent-cart-wheel-b', appIcon);
      util.el('strong', 'human-app-title', titlebar, 'Northwind');
      const globalSearch = util.el('div', 'fluent-global-search', titlebar, '⌕　Search orders, customers, or products…');
      util.el('span', 'fluent-bell', titlebar, '♧');
      util.el('span', 'fluent-avatar', titlebar, 'JD');
      const winControls = util.el('div', 'human-window-controls', titlebar);
      util.el('span', 'human-winbtn', winControls, '−');
      util.el('span', 'human-winbtn', winControls, '□');
      util.el('span', 'human-winbtn human-close', winControls, '×');
      const menubar = util.el('nav', 'human-menubar', document.body);
      for (const label of ['File', 'Edit', 'View', 'Go', 'Tools', 'Help']) util.el('span', 'human-menuitem', menubar, label);
      Object.assign(_c, { appIcon, collide, cr, decoys, globalSearch, label, menubar, nav, placement, showNav, sidebar, titlebar, wantFooter, winControls });
    },
    'frame.nav': (base, S) => function (_c) {
      const { content, header, nav, rng, showNav, util } = _c;
      if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        if (showNav) rng.sample(content.NAV_ITEMS, rng.int(3, 5));
        for (const item of ['⌂　Home', '▤　Orders', '♙　Customers', '⬡　Products', '▥　Reports', '⚙　Settings']) {
          const a = util.el('a', 'ref-navlink', n);
          const bits = item.split('　');
          util.el('span', 'ref-nav-icon', a, bits[0]);
          util.el('span', 'ref-nav-label', a, bits.slice(1).join('　'));
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, ctx, display, util, word } = _c;
      const stage = util.el('main', 'ref-stage', body);
      const tips = util.el('aside', 'fluent-tips', body);
      util.el('div', 'fluent-tips-heading', tips, '☼　Tips');
      if (display === 'panel') {
        const taskNote = util.el('div', 'fluent-tasknote', tips);
        util.el('strong', '', taskNote, word ? word('yourTask') : 'Your task');
        util.el('div', '', taskNote, ctx.instruction);
      }
      for (const [title, text] of [
        ['Sort a column', 'Click a column header to sort ascending or descending.'],
        ['Filter results', 'Use the filters under each column header to narrow the list.'],
        ['Select multiple rows', 'Use the checkbox in each row. Shift-click to select a range, or use the select-all checkbox in the header.'],
        ['Bulk actions', 'After selecting rows, use the toolbar to delete, mark as shipped, apply a tag, or export.'],
        ['Reorder columns', 'Drag and drop column headers to change their order. Drag the edge of a header to resize.'],
      ]) {
        const item = util.el('section', 'fluent-tip', tips);
        util.el('strong', '', item, title);
        util.el('div', '', item, text);
      }
      S.frameAlign(_c, stage);
      Object.assign(_c, { stage, tips });
    },
    'frame.end': (base, S) => function (_c) {
      // Reserve space for the bottom navigation and every end-control form.
      _c.titlebar.append(_c.headerTools);
      const nav = _c.header.querySelector('.ref-nav');
      if (nav) document.body.append(nav);
      return base(_c);
    },
  };

  env.site({
    name: 'design-use-data-grid-select-03',
    template: 'site/base',
    design: { parts },
  });
})();
