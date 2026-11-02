// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.placement': (base, S) => function (_c) {
      base(_c);
      const { util } = _c;

      // Industrial desktop frame: native title strip, menu row and application tabs.
      const winbar = util.el('div', 'hr-windowbar', document.body);
      util.el('span', 'hr-window-icon', winbar, '▣');
      util.el('strong', 'hr-window-title', winbar, 'People Operations');
      const sys = util.el('div', 'hr-window-controls', winbar);
      for (const mark of ['—', '□', '×']) util.el('span', '', sys, mark);
      const menu = util.el('div', 'hr-menubar', document.body);
      util.el('span', 'hr-apple', menu, '●');
      for (const label of ['File', 'Edit', 'View', 'People', 'Hiring', 'Reports', 'Window', 'Help']) util.el('span', '', menu, label);
      util.el('span', 'hr-menu-clock', menu, '◧　 Mon Apr 23　 9:42 AM');
      document.body.insertBefore(menu, winbar);
      const tabs = util.el('nav', 'hr-tabs', document.body);
      const tabLabels = [['♟', 'People'], ['▣', 'Hiring'], ['♧', 'Org Chart'], ['▦', 'Leave'], ['▤', 'Reports'], ['⚙', 'Administration']];
      for (let i = 0; i < tabLabels.length; i++) {
        const tab = util.el('div', i === 1 ? 'hr-tab hr-tab-active' : 'hr-tab', tabs);
        util.el('span', 'hr-tab-icon', tab, tabLabels[i][0]);
        util.el('span', 'hr-tab-label', tab, tabLabels[i][1]);
      }
      util.el('span', 'hr-org', tabs, 'Acme Instruments　 |　 People Operations');
      Object.assign(_c, { menu, sys, tabLabels, tabs, winbar });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, rng, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      rng.pick(['center', 'center', 'flex-start', 'flex-end']);
      rng.pick(['center', 'center', 'flex-start', 'flex-end']);
      Object.assign(_c, { stage });
    },
    'frame.floating': (base, S) => function (_c) {
      base(_c);
      const { tabs, util } = _c;
      const statusbar = util.el('div', 'hr-statusbar', document.body);
      util.el('span', '', statusbar, 'Mon Apr 23　 9:42 AM');
      util.el('span', '', statusbar, 'People Operations');
      document.body.insertBefore(tabs, statusbar);
      Object.assign(_c, { statusbar });
    },
  };

  env.site({
    name: 'design-use-hr-pipeline-04',
    template: 'site/base',
    design: { parts },
  });
})();
