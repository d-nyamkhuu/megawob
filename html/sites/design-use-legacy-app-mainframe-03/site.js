// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, tall, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['footer', 'footer', 'footer', 'header', 'link', 'icon']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebarDraw = roomy && rng.bool(0.35);
      const sidebar = true;
      const nav = W >= 1180 && rng.bool(0.5);
      let decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      else if (rng.fork('chrome/end-label').bool(0.5)) label = 'Save';
      // A decoy that reads like an end control (another end word, never this episode's label).
      let { collide, cr } = S.frameCollide(_c, label);
      if (ctx.finish) { decoys = []; collide = null; }
      Object.assign(_c, { collide, cr, decoys, label, nav, placement, sidebar, sidebarDraw, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const controls = util.el('div', 'ref-window-controls', header);
      for (const name of ['close', 'minimize', 'maximize']) util.el('i', `ref-light-${name}`, controls);
      const windowTitle = util.el('div', 'ref-window-title', header, 'Enterprise Console');
      S.frameBrand(_c, header);
      Object.assign(_c, { header, windowTitle });
    },
    'frame.body': (base, S) => function (_c) {
      const { content, ctx, headerTools, rng, sidebar, util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const menu = util.el('div', 'ref-menubar', document.body);
      const nav = util.el('nav', 'glass-nav', menu);
      const icons = {
        Host: '<rect x="2" y="2" width="20" height="20" rx="3" fill="#0877f2" stroke="none"/><path d="M7 7h10M7 11h10M7 15h10" stroke="#fff"/>',
        Orders: '<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="12" cy="12" r="4"/>',
        Inventory: '<path d="M12 2 21 7v10l-9 5-9-5V7zM3 7l9 5 9-5M12 12v10"/>',
        Finance: '<path d="M3 20V13h4v7M10 20V7h4v13M17 20V3h4v17M2 21h20"/>',
        Reporting: '<path d="M5 2h10l4 4v16H5zM15 2v5h4M8 11h8M8 15h8M8 19h6"/>',
        Admin: '<circle cx="12" cy="12" r="3.3"/><path d="M10 2h4l.5 2.3 1.8.8 2-.9 2.8 2.8-.9 2 .8 1.8L23 11v3l-2.3.5-.8 1.8.9 2-2.8 2.8-2-.9-1.8.8L14 23h-4l-.5-2.3-1.8-.8-2 .9-2.8-2.8.9-2-.8-1.8L1 14v-3l2.3-.5.8-1.8-.9-2 2.8-2.8 2 .9 1.8-.8z"/>',
      };
      for (const label of ['Host','Orders','Inventory','Finance','Reporting','Admin']) {
        const item = util.el('span', label === 'Host' ? 'glass-tab current' : 'glass-tab', nav);
        const glyph = util.el('span', 'glass-icon', item);
        glyph.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[label]}</svg>`;
        util.el('span', '', item, label);
      }
      const search = util.el('div', 'glass-search', menu);
      util.el('span', 'glass-search-icon', search, '⌕');
      util.el('span', '', search, 'Search');
      const toolbar = util.el('div', 'ref-toolbar', document.body);
      // Header actions remain in the title bar; the navigation stays clear.
      document.body.insertBefore(menu, body);
      document.body.insertBefore(toolbar, body);
      if (sidebar) {
        const side = util.el('aside', 'ref-side', body);
        rng.sample(content.NAV_ITEMS, rng.int(4, 7));
        util.el('strong', 'record-caption', side, 'Rcds');
        util.el('div', 'record-ellipsis', side, '•••');
        const keys = ctx.spec && Array.isArray(ctx.spec.records) ? ctx.spec.records.slice(0,17).map((r) => r.key) : [];
        for (const key of keys) util.el('div', 'record-index', side, key);
      }
      Object.assign(_c, { body, menu, toolbar });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      stage.addEventListener('input', (e) => {
        if (e.target && /^(INPUT|TEXTAREA)$/.test(e.target.tagName) && e.target.value) stage.classList.add('ref-terminal-active');
      });
      stage.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') stage.classList.add('ref-terminal-active');
      });
      Object.assign(_c, { stage });
    },
    'frame.panel': (base, S) => function (_c) {
      base(_c);
      const heading = _c.body.querySelector('.ref-panel-title');
      if (heading && !_c.word) heading.textContent = '▧  Task';
    },
  };

  env.site({
    name: 'design-use-legacy-app-mainframe-03',
    template: 'site/base',
    design: { parts },
  });
})();
