// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.instruction': (base, S) => function (_c) {
      const { ctx, display, header, util } = _c;
      if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
      else util.el('div', 'ref-spacer', header);

      // Static desktop action strip, matching the Explorer frame in this design.
      const appbar = util.el('div', 'ref-appbar', document.body);
      const appActions = [['←', 'Back'], ['→', 'Forward'], ['↑', 'Up'], ['📁', 'New Folder'], ['▣', 'Copy'], ['▤', 'Paste'], ['▣', 'Delete'], ['↶', 'Undo']];
      for (const [icon, text] of appActions) {
        const item = util.el('div', 'ref-app-action', appbar);
        util.el('span', 'ref-app-icon', item, icon);
        util.el('span', '', item, text);
      }
      const search = util.el('div', 'ref-app-search', appbar, '⌕　Search');
      search.setAttribute('aria-hidden', 'true');
      Object.assign(_c, { appActions, appbar, search });
    },
  };

  env.site({
    name: 'design-use-file-manager-navigate-02',
    template: 'site/base',
    design: { parts },
  });
})();
