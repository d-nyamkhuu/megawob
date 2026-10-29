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

      // KDE Breeze desktop frame for this search design.
      const win = util.el('div', 'breeze-titlebar', document.body);
      util.el('span', 'breeze-appicon', win, 'X');
      util.el('span', 'breeze-title', win, 'InfoFinder');
      util.el('span', 'breeze-window-actions', win, '—　□　×');
      const menu = util.el('nav', 'breeze-menubar', document.body);
      for (const item of ['File', 'Edit', 'View', 'Search', 'Bookmarks', 'Tools', 'Window', 'Help']) util.el('span', '', menu, item);
      const tabs = util.el('nav', 'breeze-tabs', document.body);
      for (const [ico, text] of [['▱','New'], ['▱','Open'], ['◉','Search'], ['☆','Bookmark'], ['▤','Notes']]) {
        const tab = util.el('span', `breeze-tab${text === 'Search' ? ' active' : ''}`, tabs);
        util.el('b', '', tab, ico); util.el('span', '', tab, text);
      }
      Object.assign(_c, { closeLabel, local, lr, menu, tabs, win, word });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      Object.assign(_c, { stage });
    },
  };

  env.site({
    name: 'design-resist-injection-search-03',
    template: 'site/base',
    design: { parts },
  });
})();
