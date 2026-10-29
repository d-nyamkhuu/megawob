// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const winbar = util.el('div', 'qt-titlebar', document.body);
      winbar.textContent = '▣  PeopleOps - Acme Corporation';
      const winbuttons = util.el('span', 'qt-window-buttons', winbar);
      winbuttons.textContent = '−  □  ×';
      const menubar = util.el('div', 'qt-menubar', document.body);
      util.el('span', 'helios-mark', menubar, '◉');
      util.el('strong', 'helios-name', menubar, 'Helios');
      const appnav = util.el('nav', 'helios-nav', menubar);
      for (const [item, active] of [['People', true], ['Hiring', false], ['Time Off', false], ['Performance', false], ['Compensation', false], ['Reports', false]]) {
        const link = util.el('span', `helios-link${active ? ' active' : ''}`, appnav, item);
        if (active) link.setAttribute('aria-current', 'page');
      }
      util.el('span', 'helios-search', menubar, '⌕　Search people, teams, or settings...');
      util.el('span', 'helios-bell', menubar, '♧');
      util.el('span', 'helios-avatar', menubar, 'DL');
      const rail = util.el('nav', 'qt-rail', document.body);
      for (const [icon, label] of [['⌂','Home'],['♧','Recruiting'],['♟','People'],['▣','Time Off'],['▥','Performance'],['▤','Compensation'],['▤','Reporting'],['⚙','Admin']]) {
        const item = util.el('div', `qt-rail-item${label === 'People' ? ' selected' : ''}`, rail);
        util.el('span', 'qt-rail-icon', item, icon);
        util.el('span', '', item, label);
      }
      S.frameBrand(_c, header);
      Object.assign(_c, { appnav, header, menubar, rail, winbar, winbuttons });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const metrics = util.el('aside', 'helios-metrics', body);
      util.el('h2', '', metrics, 'People Operations');
      util.el('p', 'metrics-sub', metrics, 'Your teams at a glance');
      for (const [icon, number, caption] of [['♟','124','Total employees'], ['✈','6','Pending leave requests'], ['♟','8','People off this week'], ['▦','3','Upcoming holidays']]) {
        const card = util.el('div', 'metric-card', metrics);
        util.el('span', 'metric-icon', card, icon);
        const copy = util.el('div', '', card);
        util.el('strong', '', copy, number);
        util.el('span', '', copy, caption);
      }
      const calendar = util.el('section', 'helios-calendar', metrics);
      const calhead = util.el('div', 'calendar-head', calendar);
      util.el('strong', '', calhead, 'April 2026');
      util.el('span', '', calhead, '›');
      const weekdays = util.el('div', 'calendar-grid calendar-week', calendar);
      for (const day of ['Su','Mo','Tu','We','Th','Fr','Sa']) util.el('span', '', weekdays, day);
      const dates = util.el('div', 'calendar-grid', calendar);
      for (const day of ['','','','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','','']) {
        const cell = util.el('span', day === '7' || day === '20' ? 'calendar-mark' : '', dates, day);
      }
      const quick = util.el('section', 'quick-links', metrics);
      util.el('strong', '', quick, 'Quick links');
      for (const item of ['▦　Leave policy', '▦　Team calendar', '▥　Reports', '♙　Employee directory']) util.el('div', '', quick, item);
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, calendar, calhead, dates, metrics, quick, weekdays });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      const summaries = util.el('aside', 'helios-summaries', body);
      const coverage = util.el('section', 'summary-card coverage-card', summaries);
      util.el('h3', '', coverage, 'Team coverage　ⓘ');
      util.el('span', '', coverage, 'Today');
      util.el('strong', '', coverage, '5 / 7 working');
      util.el('div', 'coverage-bar', coverage);
      util.el('hr', '', coverage);
      util.el('span', '', coverage, 'This week (Apr 6 – Apr 12)');
      util.el('strong', '', coverage, '4 / 7 working');
      util.el('div', 'coverage-bar half', coverage);
      const events = util.el('section', 'summary-card', summaries);
      util.el('h3', '', events, 'Upcoming events');
      for (const [date, label] of [['Apr 6 – Apr 10','Company blackout period'], ['Apr 20','Spring holiday'], ['May 25','Memorial Day']]) {
        const row = util.el('div', 'event-row', events);
        util.el('span', 'event-icon', row, '▦');
        const c = util.el('div', '', row);
        util.el('strong', '', c, date);
        util.el('span', '', c, label);
      }
      const balance = util.el('section', 'summary-card balance-card', summaries);
      util.el('h3', '', balance, 'Leave balance snapshot　ⓘ');
      for (const [range, count] of [['> 15 days','42'], ['6 – 15 days','58'], ['1 – 5 days','18'], ['0 days','6']]) {
        const row = util.el('div', 'balance-row', balance);
        util.el('span', '', row, range); util.el('span', '', row, count);
      }
      S.frameAlign(_c, stage);
      Object.assign(_c, { balance, coverage, events, stage, summaries });
    },
  };

  env.site({
    name: 'design-use-hr-timeoff-04',
    template: 'site/base',
    design: { parts },
  });
})();
