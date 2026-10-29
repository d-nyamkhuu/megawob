// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const appTitle = util.el('div', 'ref-brand', header, 'EverNote Pro');
      appTitle.dataset.role = 'brand';
      const win = util.el('div', 'ref-window-controls', header);
      for (const [label, glyph] of [['Minimize', '−'], ['Maximize', '□'], ['Close', '×']]) {
        const b = util.el('span', 'ref-window-control', win, glyph);
        b.setAttribute('aria-label', label);
      }
      // Keep the legacy frame draws above intact, but this single-purpose window has no
      // inherited application menu or action toolbar.
      util.el('div', 'ref-stats', document.body, '20 settings　│　0 changes');
      S.frameBrand(_c, header);
      Object.assign(_c, { appTitle, header, win });
    },
    'frame.body': (base, S) => function (_c) {
      const { content, local, rng, sidebar, util } = _c;
      const { K } = S;
      const body = util.el('div', 'ref-body', document.body);
      // Consume the same seeded sidebar sample in its original position, without drawing
      // the cloned workspace rail or help panel in this single-window design.
      if (sidebar) local(rng.sample(content.NAV_ITEMS, rng.int(4, 7)), K.nav);
      S.frameSidebar(_c, body);
      Object.assign(_c, { body });
    },
  };

  env.site({
    name: 'design-change-settings-search-03',
    template: 'site/base',
    design: { parts },
  });
})();
