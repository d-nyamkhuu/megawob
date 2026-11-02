// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { rng, util } = _c;
      const { TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      {
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, 'Workspace');
        brand.dataset.role = 'brand';
      }
      Object.assign(_c, { header });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const stats = util.el('aside', 'ref-stats', body);
      util.el('h1', 'ref-stats-name', stats, 'Files');
      util.el('div', 'ref-stats-path', stats, '⌄  ▣  project');
      util.el('div', 'ref-stats-rule', stats);
      const symbols = util.el('div', 'ref-stats-symbols', stats);
      for (const item of ['›  ▱  .vscode', '›  ▱  data', '⌄  ▱  src', '　▤  analyze.ts', '　▤  format.ts', '　▤  report.ts', '　▤  types.ts', '›  ▱  tests', '▤  .gitignore', '▤  package.json', '▤  README.md', '▤  tsconfig.json']) {
        const row = util.el('div', '', symbols, item);
        if (item.includes('report.ts')) row.classList.add('file-selected');
      }
      Object.assign(_c, { stage, stats, symbols });
    },
  };

  env.site({
    name: 'design-use-text-editor-autocomplete-02',
    template: 'site/base',
    design: { parts },
  });
})();
