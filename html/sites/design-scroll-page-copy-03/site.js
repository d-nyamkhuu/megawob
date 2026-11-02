// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';


  const THEMES = {
    light: { bg: '#e5eaee', panel: '#ffffff', fg: '#0d0c24', muted: '#748195', line: '#d7dee5' },
    dark: { bg: '#15171c', panel: '#20232b', fg: '#e8eaf0', muted: '#9aa1ad', line: '#3a3f4b' },
    warm: { bg: '#f6f1e8', panel: '#fffaf2', fg: '#2b2118', muted: '#7d6b58', line: '#e2d6c3' },
  };

  const ACCENTS = ['#006dff', '#006dff', '#006dff', '#006dff', '#006dff', '#006dff'];

  const parts = {
    'frame.theme': (base, S) => function (_c) {
      const { ctx } = _c;
      const { LOW_ACCENTS, LOW_THEME } = S;
      const { rng, util, content } = ctx;
      let name = rng.pick(Object.keys(THEMES));
      const root = document.documentElement;
      let accent = rng.pick(ACCENTS);
      const tr = rng.fork('chrome/theme');
      if (tr.bool(0.08)) {
        name = 'low';
        accent = tr.pick(LOW_ACCENTS);
      }
      name = 'light';
      accent = '#006dff';
      for (const [k, v] of Object.entries(name === 'low' ? LOW_THEME : THEMES[name])) root.style.setProperty(`--${k}`, v);
      root.style.setProperty('--accent', accent);
      root.dataset.theme = name;
      Object.assign(_c, { accent, content, name, rng, root, tr, util });
    },
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, tall, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebarDraw = rng.bool(0.35); // keep the frame stream stable across episodes
      const sidebar = roomy || sidebarDraw && false;
      const nav = W >= 1180 && rng.bool(0.5);
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, placement, sidebar, sidebarDraw, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const windowbar = util.el('div', 'ref-windowbar', header);
      const controls = util.el('div', 'ref-window-controls', windowbar);
      for (const color of ['red', 'yellow', 'green']) util.el('span', `ref-window-dot ref-window-${color}`, controls);
      util.el('div', 'ref-window-title', windowbar, 'HelpDesk Pro');
      const menubar = util.el('div', 'ref-menu-bar', header);
      for (const item of ['File', 'Edit', 'View', 'Go', 'Tickets', 'Window', 'Help']) util.el('span', 'ref-menu-item', menubar, item);
      const appnav = util.el('nav', 'ref-app-nav', header);
      for (const [glyph, item] of [['◆', 'Home'], ['▱', 'Tickets'], ['♟', 'Customers'], ['▥', 'Reports'], ['▤', 'Knowledge Base']]) {
        const b = util.el('button', 'ref-app-nav-item', appnav);
        b.type = 'button';
        util.el('span', 'ref-app-icon', b, glyph);
        util.el('span', '', b, item);
      }
      S.frameBrand(_c, header);
      Object.assign(_c, { appnav, controls, header, menubar, windowbar });
    },
    'frame.body': (base, S) => function (_c) {
      const { content, rng, sidebar, util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      if (sidebar) {
        const side = util.el('aside', 'ref-side', body);
        rng.sample(content.NAV_ITEMS, rng.int(4, 7)); // preserve the original sidebar draws
        for (const item of ['Overview', 'Requester Details', 'Issue Details', 'Troubleshooting Steps',
          'Related Articles', 'Internal Notes', 'Change History', 'Other Open Tickets']) {
          const a = util.el('a', 'ref-sidelink', side, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label: item }); });
        }
      }
      Object.assign(_c, { body });
    },
  };

  env.site({
    name: 'design-scroll-page-copy-03',
    template: 'site/base',
    design: { THEMES, ACCENTS, parts },
  });
})();
