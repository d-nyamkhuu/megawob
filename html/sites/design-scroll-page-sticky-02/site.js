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
      util.el('span', 'wellness-appmark', win, '▤');
      util.el('span', 'wellness-windowtitle', win, 'Help Center');
      const winbuttons = util.el('div', 'wellness-winbuttons', win);
      for (const [label, glyph] of [['Minimize', '−'], ['Maximize', '□'], ['Close', '×']]) {
        const b = util.el('span', 'wellness-winbutton', winbuttons, glyph);
        b.setAttribute('aria-label', label);
      }
      const menubar = util.el('nav', 'wellness-menubar', document.body);
      for (const item of ['File', 'Edit', 'View', 'Articles', 'Community', 'Tools', 'Help']) util.el('span', '', menubar, item);
      const toolbar = util.el('div', 'wellness-toolbar', document.body);
      for (const [glyph, label] of [['←','Back'], ['→','Forward'], ['⌂','Home'], ['⟳','Refresh'], ['▣','Print'], ['Aᴀ','Text size']]) {
        const b = util.el('button', 'wellness-tool', toolbar);
        b.type = 'button'; b.setAttribute('aria-label', label); b.title = label;
        util.el('span', 'wellness-glyph', b, glyph); util.el('span', '', b, label);
      }
      Object.assign(_c, { closeLabel, local, lr, menubar, toolbar, win, winbuttons, word });
    },
    'frame.header': (base, S) => function (_c) {
      const { rng, util } = _c;
      const { TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      header.classList.add('wellness-taskbar');
      const title = rng.pick(TITLES);
      const brand = util.el('div', 'ref-brand', header, 'Help Center');
      brand.dataset.role = 'brand';
      Object.assign(_c, { brand, header, title });
    },
    'frame.toast': (base) => function (_c) {
      base(_c);
      const note = _c.body.nextElementSibling;
      if (note && note.classList.contains('ref-note')) _c.body.before(note);
    },
    'frame.footer': (base) => function (_c) {
      base(_c);
      // A page-scrolling document keeps its episode controls in the window toolbar.
      if (_c.submit && _c.submit.closest('.ref-foot')) {
        _c.header.append(_c.submit.parentElement);
      }
    },
    'frame.floating': (base) => function (_c) {
      base(_c);
      if (_c.placement === 'floating') {
        const dock = _c.submit.parentElement;
        _c.header.append(dock);
      }
    },
  };

  env.site({
    name: 'design-scroll-page-sticky-02',
    template: 'site/base',
    design: { parts },
  });
})();
