// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.placement': (base, S) => function (_c) {
      const { content, ctx, local, lr, rng, tall, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['footer', 'footer', 'footer', 'link', 'icon', 'header']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      rng.bool(0.35); // preserve the reference frame draw
      const sidebar = true;
      rng.bool(0.5); // preserve the reference frame draw
      const nav = true;
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, placement, sidebar, wantFooter });
    },
    'frame.nav': (base, S) => function (_c) {
      const { content, header, nav, rng, util } = _c;
      if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        rng.sample(content.NAV_ITEMS, rng.int(3, 5)); // retain seeded draw sequence
        for (const item of ['Home', 'My applications', 'My documents', 'Appointments', 'Messages', 'Settings']) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
    },
    'frame.body': (base, S) => function (_c) {
      const { content, rng, sidebar, util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      if (sidebar) {
        const side = util.el('aside', 'ref-side', body);
        util.el('strong', 'ref-side-title', side, 'My applications');
        rng.sample(content.NAV_ITEMS, rng.int(4, 7)); // retain seeded draw sequence
        for (const item of ['Civic support', 'Council tax reduction', 'Housing register', 'Blue badge', 'Discretionary housing payment']) {
          const a = util.el('a', 'ref-sidelink', side, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label: item }); });
        }
      }
      Object.assign(_c, { body });
    },
  };

  env.site({
    name: 'design-use-gov-portal-branching-03',
    template: 'site/base',
    design: { parts },
  });
})();
