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
      const sidebar = roomy && rng.bool(0.35);
      const navDraw = W >= 1180 ? rng.bool(0.5) : false;
      const nav = W >= 1180 || navDraw;
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, navDraw, placement, sidebar, wantFooter });
    },
    'frame.nav': (base, S) => function (_c) {
      const { content, header, local, nav, navDraw, rng, util } = _c;
      const { K } = S;
      if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        if (navDraw) local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
        for (const item of ['Home', 'Mail', 'Calendar', 'Documents', 'Spreadsheets', 'Contacts', 'Directory', 'Help']) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      const search = util.el('div', 'office-search', header);
      util.el('span', '', search, 'Search OfficeCentral:');
      const searchField = util.el('input', 'office-search-field', search);
      searchField.setAttribute('aria-label', 'Search OfficeCentral');
      const searchGo = util.el('button', 'office-search-go', search, 'Go');
      searchGo.type = 'button';
      searchGo.addEventListener('click', () => env.log('decoy', { what: 'search' }));
      Object.assign(_c, { search, searchField, searchGo });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);

      Object.assign(_c, { stage });
    },
  };

  env.site({
    name: 'design-use-spreadsheet-formula-04',
    template: 'site/base',
    design: { parts },
  });
})();
