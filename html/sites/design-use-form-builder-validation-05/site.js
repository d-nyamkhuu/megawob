// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const logo = util.el('span', 'gem-atari', document.body);
      logo.innerHTML = '<svg viewBox="0 0 40 36" fill="none" stroke="black" stroke-width="4"><path d="M20 2v31M14 2v15C14 25 8 30 2 32M26 2v15c0 8 6 13 12 15"/></svg>';
      const trash = util.el('div', 'gem-trash', document.body);
      trash.innerHTML = '<svg viewBox="0 0 40 50" fill="white" stroke="black" stroke-width="2"><path d="M9 12h23l-2 33H11zM6 8h29v5H6zM17 4h8v4h-8zM16 17v23M22 17v23M27 17l-1 23"/></svg><span>Trash</span>';
      util.el('span', 'classic-window-icon', header);
      const windowControls = util.el('div', 'classic-window-controls', header);
      for (const glyph of ['_', '□', '×']) util.el('span', '', windowControls, glyph);
      S.frameBrand(_c, header);
      Object.assign(_c, { header, windowControls });
    },
  };

  env.site({
    name: 'design-use-form-builder-validation-05',
    template: 'site/base',
    design: { parts },
  });
})();
