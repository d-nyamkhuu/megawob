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
      // 2011 desktop documentation application palette.
      for (const [k, v] of Object.entries({ bg: '#3a291b', panel: '#f5f0e4', fg: '#211b14', muted: '#725a35', line: '#d3cbbb' })) root.style.setProperty(`--${k}`, v);
      root.style.setProperty('--accent', '#075db5');
      root.dataset.theme = 'history';
      Object.assign(_c, { accent, content, name, rng, root, tr, util });
    },
    'frame.placement': (base, S) => function (_c) {
      const { content, ctx, local, lr, rng, roomy, tall, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebar = roomy && rng.bool(0.35);
      rng.bool(0.5); // preserve the reference frame draw while keeping this design's masthead complete
      const nav = true;
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, placement, sidebar, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { content, display, local, nav, rng, util } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      if (display !== 'header' || nav) {
        rng.pick(TITLES); // keep the seeded draw used by the source frame
        const brand = util.el('div', 'ref-brand', header, 'Ridgewood Docs');
        brand.dataset.role = 'brand';
      }
      if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        const sampledNav = local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
        const navItems = ['File', 'Edit', 'View', 'Go', 'Tools', 'Help'];
        for (const [i, item] of navItems.entries()) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      Object.assign(_c, { header });
    },
    'frame.nav': (base, S) => function (_c) {
    },
    'frame.stage': (base, S) => function (_c) {
      base(_c);
      // The imported frame's generic stage rules must not style task elements.
      _c.stage.className = 'ridgewood-stage';
    },
  };

  env.site({
    name: 'design-scroll-page-siblings-02',
    template: 'site/base',
    design: { parts },
  });
})();
