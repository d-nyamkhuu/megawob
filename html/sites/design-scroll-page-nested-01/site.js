// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.theme': (base, S) => function (_c) {
      const { ctx } = _c;
      const { ACCENTS, LOW_ACCENTS, THEMES } = S;
      const { rng, util, content } = ctx;
      let name = rng.pick(Object.keys(THEMES));
      const root = document.documentElement;
      let accent = rng.pick(ACCENTS);
      const tr = rng.fork('chrome/theme');
      if (tr.bool(0.08)) {
        name = 'low';
        accent = tr.pick(LOW_ACCENTS);
      }
      // Keep the reference's white help article palette while consuming the clone's original theme draws.
      for (const [k, v] of Object.entries({ bg: '#ffffff', panel: '#f3f8fc', fg: '#17345a', muted: '#60758c', line: '#c6d8e8' })) root.style.setProperty(`--${k}`, v);
      root.style.setProperty('--accent', '#075fc5');
      root.dataset.theme = 'light';
      Object.assign(_c, { accent, content, name, rng, root, tr, util });
    },
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, tall, util, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebar = roomy && rng.bool(0.35);
      const nav = W >= 1180 && rng.bool(0.5);
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      const windowbar = util.el('div', 'vista-windowbar', document.body);
      util.el('span', 'vista-ie-icon', windowbar, 'e');
      util.el('span', 'vista-window-title', windowbar, 'HealthToday Help Center - Windows Internet Explorer');
      const winControls = util.el('div', 'vista-window-controls', windowbar);
      for (const glyph of ['−', '□', '×']) util.el('span', 'vista-window-control', winControls, glyph);
      Object.assign(_c, { collide, cr, decoys, label, nav, placement, sidebar, wantFooter, winControls, windowbar });
    },
    'frame.header': (base, S) => function (_c) {
      const { rng, util } = _c;
      const { TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      {
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, 'HealthToday');
        brand.dataset.role = 'brand';
        util.el('span', 'vista-brand-divider', header);
        util.el('div', 'vista-section-title', header, 'Help Center');
      }
      Object.assign(_c, { header });
    },
    'frame.instruction': (base, S) => function (_c) {
      const { ctx, display, header, util } = _c;
      if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
      else util.el('div', 'ref-spacer', header);
      const search = util.el('div', 'vista-search', header);
      util.el('span', 'vista-search-label', search, 'Search Help Center');
      util.el('span', 'vista-search-icon', search, '⌕');
      Object.assign(_c, { search });
    },
  };

  env.site({
    name: 'design-scroll-page-nested-01',
    template: 'site/base',
    design: { parts },
  });
})();
