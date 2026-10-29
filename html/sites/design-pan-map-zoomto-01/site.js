// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const windowControls = util.el('div', 'rm-window-controls', header);
      for (const [symbol, title] of [['_', 'Minimize'], ['□', 'Maximize'], ['×', 'Close']]) {
        const control = util.el('button', 'rm-window-control', windowControls, symbol);
        control.type = 'button';
        control.title = title;
        control.setAttribute('aria-label', title);
      }
      S.frameBrand(_c, header);
      Object.assign(_c, { header, windowControls });
    },
  };

  env.site({
    name: 'design-pan-map-zoomto-01',
    template: 'site/base',
    design: { parts },
  });
})();
