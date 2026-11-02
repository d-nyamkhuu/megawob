// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, tall, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebarDraw = roomy && rng.bool(0.35);
      const sidebar = false;
      const navDraw = W >= 1180 && rng.bool(0.5);
      const nav = W >= 1180;
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, navDraw, placement, sidebar, sidebarDraw, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { content, local, nav, rng, util } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      if (true) {
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, 'CoreDocs');
        brand.dataset.role = 'brand';
        util.el('span', 'pine-scenery', header);
      }
      if (nav) {
        // Preserve the base site's seeded navigation draws while placing its
        // frame in the left rail below, as this design requires.
        const navCount = rng.int(3, 5);
        const sampledNav = local(rng.sample(content.NAV_ITEMS, navCount), K.nav);
      }
      Object.assign(_c, { header });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const rail = util.el('nav', 'pine-rail', body);
      for (const [icon, item] of [['⌂','Home'],['▣','Documents'],['♟','Employees'],['▤','HR Cases'],['▥','Reports'],['⚙','Admin']]) {
        const a = util.el('a', `pine-rail-link${item === 'Documents' ? ' selected' : ''}`, rail);
        a.dataset.role = 'nav';
        util.el('span', 'pine-nav-icon', a, icon);
        util.el('span', '', a, item);
        a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
      }
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, rail });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-protect-privacy-redact-03',
    template: 'site/base',
    design: { parts },
  });
})();
