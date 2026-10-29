// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  env.site({
    name: 'design-use-file-manager-open-02',
    template: 'site/base',
    design: {
      parts: {
        'frame.footer': (base) => (state) => {
          const dock = state.ctx.util.el('nav', 'explorer-dock', document.body);
          dock.textContent = '▣                 ▤                 ♧                 ♲                     ▣\nExplorer          Documents          Network         Recycle Bin       Settings';
          return base(state);
        },
      },
    },
  });
})();
