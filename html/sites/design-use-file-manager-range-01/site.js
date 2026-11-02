// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { display, nav, rng, util } = _c;
      const { TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      // Keep the design's application identity present in every instruction mode.
      // Preserve the original title draw when this branch used to render a generic brand.
      let title = 'Files';
      if (display !== 'header' || nav) rng.pick(TITLES);
      const brand = util.el('div', 'ref-brand', header, 'Files');
      brand.dataset.role = 'brand';
      Object.assign(_c, { brand, header, title });
    },
    'frame.instruction': (base, S) => function (_c) {
      const { ctx, display, header, util } = _c;
      if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
      else util.el('div', 'ref-spacer', header);
      const search = util.el('div', 'fm-search', header);
      util.el('span', 'fm-search-icon', search, '⌕');
      const searchText = util.el('span', 'fm-search-text', search, 'Search files');
      searchText.setAttribute('aria-label', 'Search files');
      const launcher = util.el('div', 'fm-launcher', header, '⠿');
      launcher.setAttribute('aria-label', 'Applications');
      const account = util.el('div', 'fm-account', header, '●');
      account.setAttribute('aria-label', 'Account');
      Object.assign(_c, { account, launcher, search, searchText });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const inspector = util.el('aside', 'fm-inspector', body);
      const identity = util.el('div', 'fm-inspector-identity', inspector);
      util.el('span', 'fm-folder-icon', identity, '');
      const folder = util.el('div', 'fm-folder-copy', identity);
      util.el('strong', '', folder, 'Edits');
      util.el('span', '', folder, 'File folder');
      const properties = util.el('div', 'fm-properties', inspector);
      for (const [key, value] of [['Location', 'My Files › Projects › Website Redesign'],
        ['Size', '—'], ['Contains', '11 files, 1 folder'], ['Modified', 'Apr 16, 2014 5:42 PM']]) {
        const row = util.el('div', 'fm-property', properties);
        util.el('span', '', row, key);
        util.el('span', '', row, value);
      }
      Object.assign(_c, { folder, identity, inspector, properties, stage });
    },
  };

  env.site({
    name: 'design-use-file-manager-range-01',
    template: 'site/base',
    design: { parts },
  });
})();
