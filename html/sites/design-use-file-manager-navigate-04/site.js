// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';


  const TITLES = ['Documents'];

  const parts = {
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const help = util.el('aside', 'aqua-help', body);
      util.el('div', 'aqua-help-title', help, 'Documents');
      util.el('div', 'aqua-help-kind', help, 'Folder');
      util.el('p', 'aqua-help-intro', help, 'Use this window to browse and manage your files and folders.');
      const tips = [
        ['‹   ›', 'Use Back and Up to move between folders.'],
        ['▦  ▤', 'Choose a view to change how items are shown.'],
        ['▰', 'Double-click a folder to open it.'],
        ['▤', 'Select items to move, copy, delete or rename them.'],
        ['⌘', 'Hold Command or Shift to select multiple items.'],
        ['□', 'Drag in an empty area to select multiple items.'],
        ['↶', 'Use Edit > Undo to reverse your last change.'],
      ];
      for (const [icon, text] of tips) {
        const row = util.el('div', 'aqua-tip', help);
        util.el('span', 'aqua-tip-icon', row, icon);
        util.el('span', 'aqua-tip-text', row, text);
      }
      Object.assign(_c, { help, stage, tips });
    },
  };

  env.site({
    name: 'design-use-file-manager-navigate-04',
    template: 'site/base',
    design: { TITLES, parts },
  });
})();
