// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.lang': (base, S) => function (_c) {
      const { ctx, rng, util } = _c;
      // Localized frame: same layout draws as English, texts from UI_WORDS (own stream).
      const word = ctx.lang && ctx.lang !== 'en' && ctx.word ? ctx.word : null;
      const lr = rng.fork('chrome/lang');
      const local = (list, keys) => (word ? lr.sample(keys, list.length).map(word) : list);
      const closeLabel = word ? word('close') : 'Close';

      // Fluent desktop window frame surrounding the long help page.
      document.body.classList.add('wellness-app');
      const win = util.el('div', 'wellness-windowbar', document.body);
      util.el('span', 'wellness-appmark', win, '▣');
      util.el('span', 'wellness-windowtitle', win, 'Help Center');
      const winbuttons = util.el('div', 'wellness-winbuttons', win);
      for (const [label, glyph] of [['Minimize', '−'], ['Maximize', '□'], ['Close', '×']]) {
        const b = util.el('span', 'wellness-winbutton', winbuttons, glyph);
        b.setAttribute('aria-label', label);
      }
      const menubar = util.el('nav', 'wellness-menubar', document.body);
      for (const item of ['File', 'Edit', 'View', 'Go', 'Help']) util.el('span', '', menubar, item);
      const toolbar = util.el('div', 'wellness-toolbar', document.body);
      for (const [label, active] of [['Help Articles', true], ['Categories', false], ['Feedback', false], ['Settings', false]]) {
        const b = util.el('button', `wellness-tab${active ? ' is-active' : ''}`, toolbar, label);
        b.type = 'button';
      }
      const search = util.el('label', 'wellness-search', toolbar);
      util.el('span', 'wellness-search-icon', search, '⌕');
      const searchInput = util.el('input', '', search);
      searchInput.type = 'text';
      searchInput.placeholder = 'Search help articles';
      searchInput.setAttribute('aria-label', 'Search help articles');
      Object.assign(_c, { closeLabel, local, lr, menubar, search, searchInput, toolbar, win, winbuttons, word });
    },
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      header.classList.add('wellness-taskbar');
      S.frameBrand(_c, header);
      Object.assign(_c, { header });
    },
  };

  env.site({
    name: 'design-scroll-page-sticky-03',
    template: 'site/base',
    design: { parts },
  });
})();
