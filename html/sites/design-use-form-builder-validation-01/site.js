// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      util.el('span', 'classic-window-icon', header);
      const windowControls = util.el('div', 'classic-window-controls', header);
      for (const glyph of ['_', '□', '×']) util.el('span', '', windowControls, glyph);
      S.frameBrand(_c, header);
      Object.assign(_c, { header, windowControls });
    },
  };

  env.site({
    name: 'design-use-form-builder-validation-01',
    template: 'site/base',
    design: { parts },
  });
})();
