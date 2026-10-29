// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const titlebar = util.el('div', 'w95-titlebar', header);
      util.el('span', 'w95-appicon', titlebar, '▦');
      const brand = util.el('div', 'ref-brand', titlebar, 'Release Planner - Product Launch');
      brand.dataset.role = 'brand';
      const win = util.el('div', 'w95-window-buttons', titlebar);
      for (const t of ['_', '□', '×']) util.el('span', '', win, t);
      const menu = util.el('div', 'w95-menu', header);
      for (const t of ['File', 'Edit', 'View', 'Insert', 'Tools', 'Help']) util.el('span', '', menu, t);
      const toolbar = util.el('div', 'w95-toolbar', header);
      for (const t of ['▧', '📂', '▤', '✂', '▣', '▦', '▥']) util.el('span', '', toolbar, t);
      Object.assign(_c, { brand, header, menu, titlebar, toolbar, win });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const dock = util.el('nav', 'w95-dock', document.body);
      for (const [icon, text] of [['▦', 'Timeline'], ['▧', 'Board'], ['♟', 'Teams'], ['▥', 'Reports'], ['⚒', 'Settings']]) {
        const item = util.el('span', 'w95-dock-item', dock);
        util.el('b', '', item, icon);
        util.el('span', '', item, text);
      }
      Object.assign(_c, { dock, stage });
    },
  };

  env.site({
    name: 'design-use-project-board-milestone-01',
    template: 'site/base',
    design: { parts },
  });
})();
