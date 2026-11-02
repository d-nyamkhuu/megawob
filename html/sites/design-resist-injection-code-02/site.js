// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const winControls = util.el('div', 'gem-window-controls', header);
      for (const [glyph, label] of [['−', 'Minimize'], ['□', 'Maximize'], ['×', 'Close']]) {
        const control = util.el('button', 'gem-window-control', winControls, glyph);
        control.type = 'button';
        control.setAttribute('aria-label', label);
        control.title = label;
      }
      S.frameBrand(_c, header);
      Object.assign(_c, { header, winControls });
    },
  };

  env.site({
    name: 'design-resist-injection-code-02',
    template: 'site/base',
    design: { parts },
  });
})();
