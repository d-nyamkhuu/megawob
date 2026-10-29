// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { display, util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      if (display === 'header') header.classList.add('sap-instr-header');
      const titlebar = util.el('div', 'sap-titlebar', header);
      util.el('span', 'sap-logo', titlebar, 'SAP');
      util.el('span', 'sap-title', titlebar, 'SAP Easy Access  -  Customer Data Maintenance');
      util.el('span', 'sap-window-controls', titlebar, '−   □   ×');
      const menu = util.el('div', 'sap-menubar', header);
      for (const item of ['File', 'Edit', 'View', 'Favorites', 'Extras', 'System', 'Help']) util.el('span', '', menu, item);
      const toolbar = util.el('div', 'sap-toolbar', header);
      for (const icon of ['▤', '▱', '▣', '←', '→', '●', '⌕', '?']) util.el('span', 'sap-tool-icon', toolbar, icon);
      S.frameBrand(_c, header);
      Object.assign(_c, { header, menu, titlebar, toolbar });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      stage.addEventListener('input', (event) => {
        if (event.target && event.target.tagName === 'INPUT' && String(event.target.value || '').trim()) {
          stage.classList.add('sap-command-entered');
        }
      });
      stage.addEventListener('keydown', (event) => {
        if (event.key === 'F4' || event.key === 'Enter' || event.ctrlKey) stage.classList.add('sap-command-entered');
      });
      stage.addEventListener('pointerdown', () => stage.classList.add('sap-command-entered'), true);
      S.frameAlign(_c, stage);
      const stats = util.el('aside', 'sap-stats', body);
      util.el('h2', '', stats, 'Customer Records');
      for (const [key, value] of [['Total records:', '3,482'], ['Active:', '3,124'], ['Inactive:', '358']]) {
        const row = util.el('div', 'sap-stat-row', stats);
        util.el('span', '', row, key); util.el('span', '', row, value);
      }
      const activity = util.el('section', 'sap-activity', stats);
      util.el('h2', '', activity, 'Recent Activity');
      const table = util.el('div', 'sap-activity-table', activity);
      for (const row of [['Date', 'User', 'Action'], ['2020-05-14', 'ALER', 'Changed'], ['2020-05-14', 'JSMI', 'Created'], ['2020-05-13', 'KTRAN', 'Displayed'], ['2020-05-12', 'ALER', 'Changed'], ['2020-05-12', 'JSMI', 'Displayed']]) {
        const line = util.el('div', 'sap-activity-row', table);
        for (const cell of row) util.el('span', '', line, cell);
      }
      Object.assign(_c, { activity, stage, stats, table });
    },
  };

  env.site({
    name: 'design-use-legacy-app-sapgui-03',
    template: 'site/base',
    design: { parts },
  });
})();
