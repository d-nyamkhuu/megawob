// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';


  const TITLES = ['Northstar Admin Console'];

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { display, label, lr, nav, rng, util, word } = _c;
      const { K } = S;
      const header = util.el('header', 'ref-task', document.body);
      const winTitle = util.el('div', 'win-title', header);
      util.el('span', 'win-app-icon', winTitle, '▣');
      util.el('strong', '', winTitle, 'Northstar Systems - Directory Administration');
      const winControls = util.el('span', 'win-controls', winTitle, '−　□　×');
      winControls.setAttribute('aria-hidden', 'true');
      const menu = util.el('nav', 'win-menu', document.body);
      for (const item of ['File', 'Edit', 'View', 'Directory', 'Reports', 'Tools', 'Window', 'Help'])
        util.el('span', '', menu, item);
      const toolbar = util.el('div', 'win-toolbar', document.body);
      for (const [icon, label] of [['▯','New User'], ['✎','Edit User'], ['✕','Delete'], ['♟','Groups'], ['▤','Licences'], ['▥','Reports']]) {
        const tool = util.el('div', 'win-tool', toolbar);
        util.el('span', 'win-tool-icon', tool, icon);
        util.el('span', '', tool, label);
      }
      if (display !== 'header' || nav) {
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, word ? word(lr.pick(K.brand)) : title);
        brand.dataset.role = 'brand';
      }
      Object.assign(_c, { header, menu, toolbar, winControls, winTitle });
    },
  };

  env.site({
    name: 'design-use-admin-console-iam-02',
    template: 'site/base',
    design: { TITLES, parts },
  });
})();
