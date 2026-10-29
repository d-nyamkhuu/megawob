// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.placement': (base, S) => function (_c) {
      const { content, ctx, local, lr, rng, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      rng.bool(0.3); // keep the frame draw sequence stable
      const wantFooter = true;
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      rng.bool(0.35); // keep the reference frame draw sequence stable
      const sidebar = true;
      rng.bool(0.5); // keep the frame draw sequence stable
      const nav = true;
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, placement, sidebar, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { content, display, lr, nav, rng, util, word } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      if (display !== 'header' || nav) {
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, word ? word(lr.pick(K.brand)) : title);
        brand.textContent = word ? brand.textContent : 'Company Extranet';
        brand.dataset.role = 'brand';
      }
      if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        rng.sample(content.NAV_ITEMS, rng.int(3, 5));
        for (const item of ['Home', 'Documents', 'Projects', 'Team', 'Reports', 'Administration']) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      Object.assign(_c, { header });
    },
    'frame.body': (base, S) => function (_c) {
      const { content, rng, sidebar, util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      if (sidebar) {
        const side = util.el('aside', 'ref-side', body);
        rng.sample(content.NAV_ITEMS, rng.int(4, 7));
        for (const item of ['Project Plan.doc', 'Budget Q2.xls', 'Meeting Notes.txt', 'Product Brief.pdf', 'Launch Timeline.ppt', 'Requirements.doc', 'Design Sketches.zip']) {
          const a = util.el('a', 'ref-sidelink', side, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label: item }); });
        }
        const team = util.el('section', 'ref-team-files', side);
        util.el('div', 'ref-team-title', team, 'Team Files');
        const table = util.el('div', 'ref-team-table', team);
        for (const [name, size] of [['Marketing', '12 items'], ['Product', '18 items'], ['Sales', '9 items'], ['Support', '14 items'], ['HR', '6 items']]) {
          const row = util.el('div', 'ref-team-row', table);
          util.el('span', '', row, name);
          util.el('span', '', row, size);
        }
      }
      Object.assign(_c, { body });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-use-file-manager-navigate-03',
    template: 'site/base',
    design: { parts },
  });
})();
