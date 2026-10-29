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
        const brand = util.el('div', 'ref-brand', header, 'cards.py');
        brand.dataset.role = 'brand';
      }
      Object.assign(_c, { header });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const rail = util.el('nav', 'ref-file-rail', body);
      for (const [icon, label] of [['▤', 'Files'], ['⌕', 'Search'], ['⑂', 'Source Control'], ['▶', 'Run'], ['⚙', 'Settings']]) {
        const item = util.el('a', 'ref-rail-item', rail);
        item.href = '#';
        item.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'rail', label }); });
        util.el('span', 'ref-rail-icon', item, icon);
        util.el('span', 'ref-rail-label', item, label);
      }
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, rail });
    },
    'frame.panel': (base) => function (_c) {
      base(_c);
      _c.panel = _c.body.querySelector('.ref-panel');
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, header, util } = _c;
      const editorWindow = util.el('section', 'ref-editor-window', body);
      editorWindow.append(header);
      const stage = util.el('main', 'ref-stage', editorWindow);
      S.frameAlign(_c, stage);
      const stats = util.el('aside', 'ref-stats', body);
      const tree = util.el('section', 'ref-file-tree', stats);
      util.el('h1', 'ref-stats-name', tree, 'Files');
      util.el('div', 'ref-tree-row', tree, '⊟  📁  project');
      util.el('div', 'ref-tree-row ref-tree-indent', tree, '⊟  📁  src');
      util.el('div', 'ref-tree-row ref-tree-indent ref-tree-selected', tree, '▤  cards.py');
      for (const file of ['▤  deck.py', '▤  game.py', '▤  utils.py']) util.el('div', 'ref-tree-row ref-tree-indent', tree, file);
      util.el('div', 'ref-tree-row', tree, '⊞  📁  tests');
      util.el('div', 'ref-tree-row', tree, '▤  README.md');
      util.el('div', 'ref-tree-row', tree, '▤  requirements.txt');
      util.el('div', 'ref-stats-rule', tree);
      util.el('h1', 'ref-stats-name', stats, 'Properties');
      util.el('div', 'ref-stats-path', stats, 'cards.py');
      util.el('div', 'ref-stats-rule', stats);
      const meta = util.el('div', 'ref-stats-meta', stats);
      for (const [k, v] of [['Name:', 'cards.py'], ['Type:', 'Python File'], ['Size:', '1.2 KB'], ['Modified:', 'Mar 10, 1994 14:27'], ['Location:', 'project/src']]) {
        util.el('span', '', meta, k); util.el('span', '', meta, v);
      }
      util.el('div', 'ref-stats-rule', stats);
      const prefs = util.el('div', 'ref-file-prefs', stats);
      for (const [label, value] of [['Language:', 'Python'], ['Encoding:', 'UTF-8']]) {
        const row = util.el('label', 'ref-pref-row', prefs);
        util.el('span', '', row, label);
        const select = util.el('select', '', row);
        const option = util.el('option', '', select, value);
        option.selected = true;
      }
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
      if (_c.panel) stats.prepend(_c.panel);
      Object.assign(_c, { bars, meta, prefs, stage, stats, symbols, tree });
    },
  };

  env.site({
    name: 'design-use-text-editor-autocomplete-03',
    template: 'site/base',
    design: { parts },
  });
})();
