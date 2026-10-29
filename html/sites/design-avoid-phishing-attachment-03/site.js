// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.stage': (base, S) => function (_c) {
      const { body, display, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);

      // BeOS desktop frame and fixed utility navigation for this design.
      document.body.classList.add('beos-mail');
      document.body.classList.toggle('beos-header-note', display === 'header');
      const menu = util.el('div', 'beos-menu', document.body);
      for (const item of ['File', 'Edit', 'View', 'Go', 'Message', 'Tools', 'Actions', 'Help'])
        util.el('span', '', menu, item);
      const toolbar = util.el('div', 'beos-toolbar', body);
      for (const [icon, label] of [['✉', 'New'], ['↶', 'Reply'], ['↶', 'Reply All'], ['➜', 'Forward'], ['✕', 'Delete'], ['▰', 'Move'], ['⊘', 'Junk'], ['▣', 'Print']]) {
        const item = util.el('div', 'beos-tool', toolbar);
        util.el('span', 'beos-tool-icon', item, icon);
        util.el('span', '', item, label);
      }
      Object.assign(_c, { menu, stage, toolbar });
    },
  };

  env.site({
    name: 'design-avoid-phishing-attachment-03',
    template: 'site/base',
    design: { parts },
  });
})();
