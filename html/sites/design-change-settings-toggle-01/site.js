// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      stage.style.flex = '1 1 0%';
      S.frameAlign(_c, stage);

      // Static organizer dashboard surrounding the floating Preferences window.
      const dashPanel = (cls, title, icon) => {
        const p = util.el('section', `org-panel ${cls}`, document.body);
        const h = util.el('header', 'org-panel-head', p);
        util.el('span', 'org-icon', h, icon);
        util.el('strong', '', h, title);
        return p;
      };
      const left = dashPanel('org-calendar', 'Calendar', '▦');
      const month = util.el('div', 'org-month', left);
      util.el('span', '', month, '‹');
      util.el('b', '', month, 'October 2024');
      util.el('span', '', month, '›');
      const cal = util.el('div', 'org-cal-grid', left);
      for (const d of ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']) util.el('span', 'org-dayname', cal, d);
      for (const d of ['29','30','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','1','2']) {
        const cell = util.el('span', 'org-day', cal, d);
        if (d === '16') cell.classList.add('selected');
        if (d === '29' || d === '30' && cal.children.length <= 9 || d === '1' && cal.children.length >= 33) cell.classList.add('outside');
      }
      const tasks = dashPanel('org-tasks', 'Tasks', '▤');
      for (const label of ['Write report','Plan team meeting','Book travel','Update website','Call supplier']) {
        const row = util.el('div', 'org-task-row', tasks);
        util.el('span', 'org-box', row, ''); util.el('span', '', row, label);
      }
      const upcoming = dashPanel('org-upcoming', 'Upcoming Items', '▦');
      for (const [label, n] of [['Today','2'],['Tomorrow','3'],['This Week','5'],['Later','7']]) {
        const row = util.el('div', 'org-stat-row', upcoming); util.el('span', '', row, label); util.el('span', '', row, n);
      }
      const status = dashPanel('org-status', 'Task Status', '▥');
      for (const [label, n] of [['Not started','4'],['In progress','2'],['Completed','3'],['Total','9']]) {
        const row = util.el('div', 'org-stat-row', status); util.el('span', '', row, label); util.el('span', '', row, n);
      }
      Object.assign(_c, { cal, dashPanel, left, month, stage, status, tasks, upcoming });
    },
  };

  env.site({
    name: 'design-change-settings-toggle-01',
    template: 'site/base',
    design: { parts },
  });
})();
