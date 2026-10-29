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
        const brand = util.el('div', 'ref-brand', header, 'Note App');
        brand.dataset.role = 'brand';
      }
      Object.assign(_c, { header });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const stats = util.el('aside', 'ref-stats', body);
      util.el('h1', 'ref-stats-name', stats, 'note.js');
      util.el('div', 'ref-stats-path', stats, 'src / notes.js');
      util.el('div', 'ref-stats-rule', stats);
      const meta = util.el('div', 'ref-stats-meta', stats);
      for (const [k, v] of [['Type', 'JavaScript'], ['Size', '842 bytes'], ['Modified', 'Apr 12, 2015, 10:24'], ['Lines', '32']]) {
        util.el('span', '', meta, k); util.el('span', '', meta, v);
      }
      util.el('div', 'ref-stats-rule', stats);
      util.el('h2', 'ref-stats-heading', stats, 'Symbols');
      const symbols = util.el('div', 'ref-stats-symbols', stats);
      for (const item of ['◇  NoteStore', '◇  constructor', '◇  add', '◇  remove', '◇  load']) {
        const row = util.el('div', '', symbols); util.el('span', '', row, item); util.el('span', '', row, '1');
      }
      util.el('div', 'ref-stats-rule', stats);
      util.el('h2', 'ref-stats-heading', stats, 'Language Stats');
      const bars = util.el('div', 'ref-stats-bars', stats);
      for (const [k, n, width, color] of [['Keywords', '8', '56%', '#39a2df'], ['Strings', '4', '32%', '#df4b42'],
        ['Functions', '5', '43%', '#36a596'], ['Variables', '9', '69%', '#758593']]) {
        const row = util.el('div', 'ref-stats-bar-row', bars);
        util.el('span', '', row, k);
        const track = util.el('i', '', row); const fill = util.el('b', '', track); fill.style.width = width; fill.style.background = color;
        util.el('span', '', row, n);
      }
      Object.assign(_c, { bars, meta, stage, stats, symbols });
    },
  };

  env.site({
    name: 'design-use-text-editor-autocomplete-01',
    template: 'site/base',
    design: { parts },
  });
})();
