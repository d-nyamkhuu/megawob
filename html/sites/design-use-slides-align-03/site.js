// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const win = util.el('div', 'ref-windowbar', header);
      util.el('span', 'ref-window-icon', win, 'P');
      util.el('span', 'ref-window-title', win, 'Product Launch Deck');
      const search = util.el('div', 'ref-window-search', win);
      util.el('span', 'ref-search-glass', search, '⌕');
      util.el('span', '', search, 'Search (Alt+Q)');
      const winControls = util.el('div', 'ref-window-controls', win);
      for (const mark of ['−', '□', '×']) util.el('span', 'ref-window-control', winControls, mark);
      const banner = util.el('section', 'ref-launch-banner', header);
      banner.setAttribute('aria-label', 'Product Launch');
      const menu = util.el('nav', 'ref-menubar', header);
      for (const item of ['File', 'Edit', 'View', 'Insert', 'Format', 'Slide', 'Tools', 'Window', 'Help']) {
        util.el('span', 'ref-menu-item', menu, item);
      }
      const appbar = util.el('div', 'ref-appbar', header);
      const appTools = [
        ['▧', 'New Slide'], ['▣', 'Duplicate'], ['▤', 'Delete'], ['T', 'Text Box'],
        ['▧', 'Picture'], ['◇', 'Shape'], ['↶', 'Undo'], ['↷', 'Redo'],
      ];
      for (const [icon, text] of appTools) {
        const tool = util.el('div', 'ref-app-tool', appbar);
        util.el('span', 'ref-app-icon', tool, icon);
        util.el('span', '', tool, text);
      }
      S.frameBrand(_c, header);
      Object.assign(_c, { appTools, appbar, banner, header, menu, search, win, winControls });
    },
  };

  env.site({
    name: 'design-use-slides-align-03',
    template: 'site/base',
    design: { parts },
  });
})();
